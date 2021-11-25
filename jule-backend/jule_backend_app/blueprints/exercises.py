import math

from flask import Blueprint, request
from jule_backend_app.extensions import db
from jule_backend_app.models import Exercise
from jule_backend_app.schemas import ExerciseSchema

exercises_routes = Blueprint('exercise', __name__, url_prefix="/exercises")


@exercises_routes.route('/')
def index():
    return "Index of the exercise routes!"


@exercises_routes.route('/page/<int:page>', methods=['GET', 'POST'])
def list_exercises(page):
    if request.method == 'POST':
        query = db.session.query(Exercise)
        if request.form['title']:
            query = query.filter(Exercise.title.contains(request.form['title']))
        if request.form['difficulty']:
            query = query.filter(Exercise.difficulty == request.form['difficulty'])
        if request.form['scope']:
            query = query.filter(Exercise.scope == request.form['scope'])
        if request.form['tags']:
            tags = request.form['tags']
            # TODO
            # query = query.filter(db.or_(*[Exercise.tags.contains(tag) for tag in tags]))

        per_page = 10
        total = query.count()
        page_count = math.ceil(total / per_page)
        exercises_per_page = query.paginate(page, per_page, error_out=False)
        exercise_schema = ExerciseSchema()
        return exercise_schema.dump(exercises_per_page)


@exercises_routes.route('/create')
def create():
    return "Create new exercise:"
