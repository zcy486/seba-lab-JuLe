from flask import Flask

from jule_backend_app.extensions import (
    db,
    ma
)
from jule_backend_app.blueprints import (
    exercises
)


def create_app(test_config=None):
    app = Flask(__name__)

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
        return "JuLe backend active!"

    return app


def register_extensions(app):
    # bind database
    db.init_app(app)
    # db.create_all()
    
    # bind marshmallow
    ma.init_app(app)


def register_blueprints(app):
    app.register_blueprint(exercises.exercises_routes)
