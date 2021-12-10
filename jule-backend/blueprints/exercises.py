import json
import math

from flask import Blueprint, request, jsonify, abort
from extensions import db
from models import Exercise, Account, Tag, Difficulty
from schemas import ExerciseSchema
from blueprints.tags import create_tag, increment_tag_use, decrement_tag_use
from jwt_signature_verification import require_authorization

# Exercise blueprint used to register blueprint in app.py
exercises_routes = Blueprint('exercise', __name__, url_prefix='/exercises')

# Schemas
exercise_schema = ExerciseSchema()  # For single exercise
exercises_schema = ExerciseSchema(many=True)  # For list of exercises

per_page = 5  # number of exercises displayed per page


# index route, not in use
@exercises_routes.route('/', strict_slashes=False)
def index():
    return 'Index of the exercise routes!'


# applies filters from frontend and returns a list of exercises together with the total page number
@exercises_routes.route('/filters', methods=['POST'])
@require_authorization
def read_exercises_by_filters(current_account: Account):
    query = db.session.query(Exercise)

    # filters by difficulty
    if 'difficulty' in request.json:
        query = query.filter_by(difficulty=Difficulty(request.json['difficulty']))

    # filters by search text being contained in exercise title
    if 'search' in request.json:
        query = query.filter(request.json['search'] in Exercise.title)

    # filters by selected tags (treated as "OR")
    if 'tags' in request.json:
        query = query.filter(db.or_(*[Exercise.tags.any(Tag.id == tag_id) for tag_id in request.json['tags']]))

    # filters by owner's id
    if 'owner_id' in request.json:
        query = query.filter_by(owner_id=int(request.json['owner_id']))

    pages = math.ceil(query.count() / per_page)
    # get exercises in the 1st page because it's redirected to the 1st page after applying filters
    exercises_first_page = query.paginate(1, per_page, error_out=False).items

    return jsonify({'pages': pages, 'exercises': exercises_schema.dump(exercises_first_page)})


# returns a list of exercises per page
@exercises_routes.route('/page/<int:page>', methods=['POST'])
@require_authorization
def read_exercises_per_page(current_account: Account, page):
    query = db.session.query(Exercise)

    # filters by difficulty
    if 'difficulty' in request.json:
        query = query.filter_by(difficulty=Difficulty(request.json['difficulty']))

    # filters by search text containing
    if 'search' in request.json:
        query = query.filter(request.json['search'] in Exercise.title)

    # filters by selected tags (treated as "OR")
    if 'tags' in request.json:
        query = query.filter(db.or_(*[Exercise.tags.any(Tag.id == tag_id) for tag_id in request.json['tags']]))

    # filters by difficulty
    if 'owner_id' in request.json:
        query = query.filter_by(owner_id=request.json['owner_id'])

    exercises_per_page = query.paginate(page, per_page, error_out=False).items
    return jsonify(exercises_schema.dump(exercises_per_page))


# returns a list of exercises published by the lecturer
@exercises_routes.route('/<owner_id>/page/<int:page>', methods=['GET'])
@require_authorization
def read_published_exercises(current_account: Account, owner_id, page):
    query = Exercise.query.filter_by(owner_id=owner_id)
    # TODO: add filters and pagination


# route for reading, updating, deleting a single exercise by id
@exercises_routes.route('/<exercise_id>', methods=['GET', 'POST', 'DELETE'])
@require_authorization
def rud_exercise(current_account: Account, exercise_id):
    exercise = Exercise.query.filter_by(id=exercise_id).first()
    if exercise is None:
        return abort(405, 'No exercise found with matching id')

    # read exercise by id
    if request.method == 'GET':
        return jsonify(exercise_schema.dump(exercise))

    # update exercise by id
    elif request.method == 'POST':
        if 'title' in request.form:
            title = request.form['title']
            # if title is changed, check duplicate title of other exercises
            if title != exercise.title:
                exists = Exercise.query.filter_by(title=title).first() is not None
                if exists:
                    # if exercise with same title already exists
                    return abort(409, 'exercise with same title already exists')
                exercise.title = title
        if 'explanation' in request.form:
            exercise.explanation = request.form['explanation']
        if 'question' in request.form:
            exercise.question = request.form['question']
        if 'difficulty' in request.form:
            exercise.difficulty = int(request.form['difficulty'])
        if 'scope' in request.form:
            exercise.scope = int(request.form['scope'])
        if 'sample_solution' in request.form:
            exercise.sample_solution = request.form['sample_solution']
        if 'tags' in request.form:
            # TODO: might have some bugs, review at some point (exercise not being committed yet tags being incremented)
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
        remove_tags_from_exercise(exercise)

        db.session.delete(exercise)
        db.session.commit()
        return jsonify({'message': 'successfully deleted'}), 200

    else:
        return abort(405, 'Request method is not supported')


# creates a new exercise and stores it in db returns exercise that was created in db
# throws error if exercise already exists
@exercises_routes.route('/create', methods=['POST'])
@require_authorization
def create_exercise(current_account: Account):
    owner = current_account
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
        owner=owner,
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
    old_tags = exercise.tags
    exercise.tags = []
    for old_tag in old_tags:
        decrement_tag_use(old_tag.id)
