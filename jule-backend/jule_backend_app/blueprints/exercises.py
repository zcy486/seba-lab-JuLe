import math

from flask import Blueprint, request, jsonify, abort
from jule_backend_app.extensions import db
from jule_backend_app.models import Exercise, Tag
from jule_backend_app.schemas import ExerciseSchema
from jule_backend_app.blueprints.tags import get_tag_id_from_name, create_tag

# Exercise blueprint used to register blueprint in app.py
exercises_routes = Blueprint('exercise', __name__, url_prefix="/exercises")

# Schemas
exercise_schema = ExerciseSchema()  # For single exercise
exercises_schema = ExerciseSchema(many=True)  # For list of exercises


@exercises_routes.route('/')
def index():
    return "Index of the exercise routes!"


# returns a list of exercises together with the total page number by filters
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
            tag_names = request.form['tags']
            query = query.filter(db.or_(*[Exercise.tags.any(Tag.name == tag_name) for tag_name in tag_names]))

        per_page = 10
        pages = math.ceil(query.count() / per_page)
        exercises_per_page = query.paginate(page, per_page, error_out=False)
        return jsonify({'pages': pages, 'exercises': exercises_schema.dump(exercises_per_page)})


@exercises_routes.route('/create', methods=['GET', 'POST'])
def create_exercise():
    if request.method == 'POST':
        title = request.form['title']
        text = request.form['text']
        difficulty = request.form['difficulty']
        scope = request.form['scope']
        tag_names = request.form['tags']

        if title is None or text is None or difficulty is None or scope is None:
            # TODO: all these fields are required
            return abort(405)

        # create new exercise
        new_exercise = Exercise(title=title, text=text, difficulty=difficulty, scope=scope)

        # append tags to the exercise
        for tag_name in tag_names:
            try:
                tag_id = get_tag_id_from_name(tag_name)
                tag = Tag.query.filter_by(id=tag_id).first()
                new_exercise.tags.append(tag)
            except Exception as N:
                # if there is no tag with matching name
                # create new tag
                print(N)
                new_tag = create_tag(tag_name)
                new_exercise.tags.append(new_tag)

        db.session.add(new_exercise)
        db.session.commit()

        return jsonify(exercise_schema.dump(new_exercise))
