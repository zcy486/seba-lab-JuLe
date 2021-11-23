from flask import Blueprint

exercises_routes = Blueprint('exercise', __name__, url_prefix="/exercises")


@exercises_routes.route('/')
def index():
    return "Index of the exercise routes!"


@exercises_routes.route('/create')
def create():
    return "Create new exercise!"
