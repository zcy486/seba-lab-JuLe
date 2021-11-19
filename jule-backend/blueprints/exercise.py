from flask import Blueprint

exercise_routes = Blueprint('exercise', __name__)


@exercise_routes.route('/')
def index():
    return "Index of the exercise routes!"


@exercise_routes.route('/create')
def create():
    return "Create new exercise!"
