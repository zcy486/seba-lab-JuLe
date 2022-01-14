import email
from flask import Flask, jsonify
from flask_cors import CORS
from flask_apscheduler.scheduler import BackgroundScheduler
from .models import Account, Role
from .schemas import AccountSchema, UniversitySchema
from .utils import get_expire_date_jwt_email
from sqlalchemy import and_
import os
import json
from .config import DEVELOPMENT_MODE
from werkzeug.security import generate_password_hash

from .extensions import (
    db,
    ma
)
from .blueprints import (
    exercises,
    tags,
    login,
    register,
    statistics,
    universities,
    submission,
    grades,
    users,
    verify_email,
    reset_password,
    contact
)


def create_app(test_config=None):
    app = Flask(__name__)
    CORS(app)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    register_extensions(app)
    register_blueprints(app)

    scheduler = None
    # Prevents scheduler from running twice when using DEBUG mode
    if not app.debug or os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
        scheduler = BackgroundScheduler()
        scheduler.add_job(delete_unverified_accounts_task, args=[
                          app], trigger='interval', minutes=5, timezone="UTC")
        scheduler.start()

    # if in development mode, inserts mock data into DB
    if DEVELOPMENT_MODE:
        insert_mock_data(app)

    @app.route('/')
    def index():
        # Uncomment bellow lines, to recreate database
        # db.drop_all()
        # db.create_all()
        return "JuLe backend active!"

    try:
        # To keep the main thread alive
        return app
    except Exception as N:
        # shutdown scheduler if app occurs except
        print(str(N), flush=True)
        if scheduler is not None:
            scheduler.shutdown()


def register_extensions(app):
    # bind database
    db.init_app(app)
    with app.app_context():
        db.create_all()

    # bind marshmallow
    ma.init_app(app)


def register_blueprints(app):
    app.register_blueprint(exercises.exercises_routes)
    app.register_blueprint(tags.tags_routes)
    app.register_blueprint(login.login_routes)
    app.register_blueprint(register.register_routes)
    app.register_blueprint(statistics.statistics_routes)
    app.register_blueprint(verify_email.verify_email_routes)
    app.register_blueprint(reset_password.reset_password_routes)
    app.register_blueprint(universities.universities_routes)
    app.register_blueprint(submission.submission_routes)
    app.register_blueprint(grades.grades_routes)
    app.register_blueprint(users.users_routes)
    app.register_blueprint(contact.contact_routes)


# Deletes old user accounts that did not verify their email
def delete_unverified_accounts_task(app):
    with app.app_context():
        print("Now deleting Unverified Accounts older than " +
              str(get_expire_date_jwt_email(True)), flush=True)
        Account.query.filter(and_(Account.is_verified == False,  # noqa
                                  Account.register_time < get_expire_date_jwt_email(True))).delete()
        db.session.commit()


# Inserts mock data into database for development purposes
def insert_mock_data(app):
    print("Inserting mock data")
    with app.app_context():
        # Insert mock universities
        with open("./mock_data/mock_universities.json", "r") as mock_universities:
            mock_unis = json.load(mock_universities)
            university_schema = UniversitySchema()

            for mock_uni in mock_unis:
                loaded_mock_uni = university_schema.load(mock_uni)
                db.session.add(loaded_mock_uni)

                try:
                    db.session.commit()
                except Exception as E:
                    db.session.rollback()
                    print(E)

        with open("./mock_data/mock_accounts.json", "r") as mock_accounts:
            mock_accounts = json.load(mock_accounts)
            account_schema = AccountSchema()
            print("mock_accounts: " + str(mock_accounts))

            for mock_account in mock_accounts:
                print("mock_account: " + str(mock_account))
                loaded_mock_account = Account(id=mock_account["id"],
                                              email=mock_account["email"],
                                              password=generate_password_hash(
                                                  mock_account["password"], method='pbkdf2:sha1', salt_length=8),
                                              name=mock_account["name"],
                                              role=mock_account["role"],
                                              university_id=mock_account["universityId"],
                                              is_verified=mock_account["isVerified"])
                print("loaded_mock_account: " + str(loaded_mock_account))
                db.session.add(loaded_mock_account)

                try:
                    db.session.commit()
                except Exception as E:
                    db.session.rollback()
                    print(E)
