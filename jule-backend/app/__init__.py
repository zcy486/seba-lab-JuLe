from flask import Flask


def create_app(test_config=None):
    app = Flask(__name__)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # bind database
    from app.extensions import db
    db.init_app(app)

    # TODO: bind blueprints here
    from app.blueprints.exercise import exercise_routes
    app.register_blueprint(exercise_routes, url_prefix='/exercise')

    @app.route('/')
    def index():
        return "JuLe backend active!"

    return app
