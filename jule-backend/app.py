from flask import Flask
from flask_cors import CORS
from flask_apscheduler.scheduler import BackgroundScheduler
from .models import Account, Exercise, StatisticType, Tag
from .schemas import UniversitySchema
from .utils import get_expire_date_jwt_email
from sqlalchemy import and_
import os
import json
from .config import LOAD_MOCK_DATA
from werkzeug.security import generate_password_hash

from .extensions import (
    db,
    ma
)

from .recommendation_email import send_recommendation_emails_task

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
    contact,
    discussions,
    opt_out_email
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
        scheduler.add_job(send_recommendation_emails_task, args=[app], trigger='interval', days=7, timezone="UTC")
        scheduler.start()

    # if in development mode, inserts mock data into DB
    if LOAD_MOCK_DATA:
        insert_mock_data(app)

    @app.route('/')
    def index():
        # Uncomment bellow lines, to recreate database
        # db.drop_all()
        # db.create_all()

        # Uncomment to send recommendation emails
        # send_recommendation_emails_task(app)
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
    app.register_blueprint(discussions.discussions_routes)
    app.register_blueprint(opt_out_email.opt_out_email_routes)


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
        account_entry_count = db.session.query(Account).count()
        exercise_entry_count = db.session.query(Exercise).count()
        if (account_entry_count + exercise_entry_count == 0):
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

            # Insert mock account data
            with open("./mock_data/mock_accounts.json", "r") as mock_accounts:
                mock_accounts = json.load(mock_accounts)

                for mock_account in mock_accounts:
                    loaded_mock_account = Account(id=mock_account["id"],
                                                email=mock_account["email"],
                                                password=generate_password_hash(
                                                    mock_account["password"], method='pbkdf2:sha1', salt_length=8),
                                                name=mock_account["name"],
                                                role=mock_account["role"],
                                                university_id=mock_account["universityId"],
                                                is_verified=mock_account["isVerified"])
                    db.session.add(loaded_mock_account)

                    try:
                        db.session.commit()
                    except Exception as E:
                        db.session.rollback()
                        print(E)

            # load mock exercises and their tags
            with open("./mock_data/mock_exercises.json", "r") as mock_exercises:
                mock_exercises = json.load(mock_exercises)

                for mock_exercise in mock_exercises:
                    loaded_mock_exercise = Exercise(
                        owner_id=mock_exercise['ownerId'],
                        title=mock_exercise['title'],
                        explanation=mock_exercise['explanation'],
                        question=mock_exercise['question'],
                        difficulty=mock_exercise['difficulty'],
                        scope=mock_exercise['scope'],
                        sample_solution=mock_exercise['sampleSolution']
                    )

                    # TODO: remove duplicate code taken from tags.py
                    # increments use_count from tag and save in db
                    def increment_tag_use(tag_id: int):
                        try:
                            tag = Tag.query.get(tag_id)  # get first tag from sb with matching id (should be unique)
                            if tag is None:  # if there is no tag with matching name
                                raise Exception("No tag with matching name")
                            else:
                                tag.use_count += 1  # increment use_count
                                db.session.commit()
                        except:
                            # TODO: make except less general
                            raise Exception("IncrementFailed")

                    # creates a new tag and stores it in db returns tag that was created in db throws error if tag already exists
                    def create_tag(tag_name: str) -> Tag:
                        try:
                            new_tag = Tag(name=tag_name, use_count=1)
                            db.session.add(new_tag)
                            db.session.commit()
                            db.session.refresh(new_tag)
                            tag: Tag = new_tag

                        except Exception as N:
                            print(N)
                            # TODO: make except less general

                        else:
                            return tag

                    def add_tags_by_name(exercise, tag_names):
                        for tag_name in tag_names:
                            tag = Tag.query.filter_by(name=tag_name).first()
                            # if there is no tag with matching name
                            # create new tag
                            if tag is None:
                                tag = create_tag(tag_name)
                            else:
                                increment_tag_use(tag.id)
                            exercise.tags.append(tag)

                    add_tags_by_name(loaded_mock_exercise, mock_exercise['tags'])

                    db.session.add(loaded_mock_exercise)

                    try:
                        db.session.commit()
                    except Exception as E:
                        db.session.rollback()
                        print(E)

            # load statistic types
            with open("./mock_data/mock_statistic_types.json", "r") as mock_statistic_types:
                mock_statistic_types = json.load(mock_statistic_types)

                for mock_statistic_type in mock_statistic_types:
                    loaded_mock_statistic_type = StatisticType(
                        id=mock_statistic_type['id'],
                        title=mock_statistic_type['title'],
                        description=mock_statistic_type['description']
                    )
                    db.session.add(loaded_mock_statistic_type)

                    try:
                        db.session.commit()
                    except Exception as E:
                        db.session.rollback()
                        print(E)
                

        else:
            print("did not load mock data as database already holds data")
