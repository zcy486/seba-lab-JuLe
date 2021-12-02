import json
import math

from flask import Blueprint, request, jsonify, abort
from jule_backend_app.extensions import db
from jule_backend_app.models import Exercise, Account, Tag
from jule_backend_app.schemas import ExerciseSchema
from jule_backend_app.blueprints.tags import create_tag, increment_tag_use, decrement_tag_use

# Exercise blueprint used to register blueprint in app.py
exercises_routes = Blueprint('exercise', __name__, url_prefix='/exercises')

# Schemas
exercise_schema = ExerciseSchema()  # For single exercise
exercises_schema = ExerciseSchema(many=True)  # For list of exercises

per_page = 5  # number of exercises displayed per page


# index route, not in use
@exercises_routes.route('/')
def index():
    return 'Index of the exercise routes!'


# returns the total page number by filters
@exercises_routes.route('/pages', methods=['GET'])
def get_exercise_pages():
    query = db.session.query(Exercise)

    # TODO: apply filters

    pages = math.ceil(query.count() / per_page)

    return jsonify({'pages': pages})


# returns a list of exercises and total page count by filters
@exercises_routes.route('/page/<int:page>', methods=['GET'])
def read_exercises(page):
    query = db.session.query(Exercise)

    # TODO: apply filters
    '''
    if request.form['title']:
        query = query.filter(Exercise.title.contains(request.form['title']))
    if request.form['difficulty']:
        query = query.filter(Exercise.difficulty == int(request.form['difficulty']))
    if request.form['tags']:
        tag_names = json.load(request.form['tags'])
        query = query.filter(db.or_(*[Exercise.tags.any(Tag.name == tag_name) for tag_name in tag_names]))
    '''

    exercises_per_page = query.paginate(page, per_page, error_out=False).items
    return jsonify(exercises_schema.dump(exercises_per_page))


# returns a list of exercises published by the lecturer
@exercises_routes.route('/<owner_id>/page/<int:page>', methods=['GET'])
def read_published_exercises(owner_id, page):
    query = Exercise.query.filter_by(owner_id=owner_id)
    # TODO: add filters and pagination


# route for reading, updating, deleting a single exercise by id
@exercises_routes.route('/<exercise_id>', methods=['GET', 'POST', 'DELETE'])
def rud_exercise(exercise_id):
    exercise = Exercise.query.filter_by(id=exercise_id).first()
    if exercise is None:
        return abort(405, 'No exercise found with matching id')

    # read exercise by id
    if request.method == 'GET':
        return jsonify(exercise_schema.dump(exercise))

    # update exercise by id
    elif request.method == 'POST':
        if request.form['title']:
            exercise.title = request.form['title']
        if request.form['explanation']:
            exercise.explanation = request.form['explanation']
        if request.form['question']:
            exercise.question = request.form['question']
        if request.form['difficulty']:
            exercise.difficulty = request.form['difficulty']
        if request.form['scope']:
            exercise.scope = request.form['scope']
        if request.form['sample_solution']:
            exercise.sample_solution = request.form['sample_solution']
        if request.form['tags']:
            new_tag_names = request.form['tags']
            # clear old tags in the exercise
            remove_tags_from_exercise(exercise)
            # append new tags to the exercise
            add_tags_by_name(exercise, json.loads(new_tag_names))

        # commit changes to db
        db.session.commit()
        return jsonify(exercise_schema.dump(exercise))

    # delete exercise by id
    elif request.method == 'DELETE':
        # remove dependencies
        # TODO: uncomment this line when user data is ready
        # exercise.owner = None
        remove_tags_from_exercise(exercise)

        db.session.delete(exercise)
        db.session.commit()
        return jsonify({'message': 'successfully deleted'}), 200

    else:
        return abort(405, 'Request method is not supported')


# creates a new exercise and stores it in db returns exercise that was created in db
# throws error if exercise already exists
@exercises_routes.route('/create', methods=['POST'])
def create_exercise():
    # TODO: add owner to the exercise when user data is ready
    # owner_id = request.form['owner_id']
    # owner = User.query.filter_by(id=owner_id).first()
    # if owner is None:
    #    return abort(405, 'User not exists')

    title = request.form['title']
    explanation = request.form['explanation']
    question = request.form['question']
    difficulty = request.form['difficulty']
    scope = request.form['scope']
    sample_solution = request.form['sample_solution']
    tag_names = request.form['tags']

    if title is None or explanation is None or question is None or difficulty is None or scope is None \
            or sample_solution is None:
        return abort(400, 'Some required fields of the request are empty')

    exists = Exercise.query.filter_by(title=title).first() is not None
    if exists:
        # if exercise with same title already exists
        return abort(409, 'exercise with same title already exists')

    # create new exercise
    new_exercise = Exercise(
        # owner=owner,
        title=title,
        explanation=explanation,
        question=question,
        difficulty=int(difficulty),
        scope=int(scope),
        sample_solution=sample_solution,
    )

    # append tags to the exercise
    add_tags_by_name(new_exercise, json.loads(tag_names))

    db.session.add(new_exercise)
    db.session.commit()

    return jsonify(exercise_schema.dump(new_exercise))


# helper function not exposed to REST API
# append tags to the exercise by tag_names
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


# helper function not exposed to REST API
# remove all the tags from the exercise
def remove_tags_from_exercise(exercise):
    for old_tag in exercise.tags:
        exercise.tags.remove(old_tag)
        decrement_tag_use(old_tag.id)
