from flask import Flask
from blueprints.exercise import exercise_routes
from blueprints.statistics import statistics_routes


app = Flask(__name__)


@app.route('/')
def index():
    return "JuLe backend active!"


# TODO: register more blueprints here
app.register_blueprint(exercise_routes, url_prefix='/exercise')

app.register_blueprint(statistics_routes, url_prefix='/statistics')

if __name__ == "__main__":
    app.run(debug=True)
