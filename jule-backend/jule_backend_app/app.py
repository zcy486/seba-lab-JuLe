from flask import Flask
from flask_cors import CORS

from jule_backend_app.extensions import (
    db,
    ma
)
from jule_backend_app.blueprints import (
    exercises,
    tags,
    login,
    register,
    statistics,
    universities,
    submission,
    grades,
    users
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

    @app.route('/')
    def index():
        # Uncomment bellow lines, to recreate database
        # db.drop_all()
        # db.create_all()
        return "JuLe backend active!"

    return app


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
    app.register_blueprint(universities.universities_routes)
    app.register_blueprint(submission.submission_routes)
    app.register_blueprint(grades.grades_routes)
    app.register_blueprint(users.users_routes)
