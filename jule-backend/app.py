from flask import Flask
from blueprints.exercise import exercise_routes
from blueprints.statistics import statistics_routes
from db import db_session, init_db

app = Flask(__name__)
init_db()

@app.route('/')
def index():
    return "JuLe backend active!"

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

# TODO: register more blueprints here
app.register_blueprint(exercise_routes, url_prefix='/exercise')

app.register_blueprint(statistics_routes, url_prefix='/statistics')

if __name__ == "__main__":
    app.run(debug=True)
