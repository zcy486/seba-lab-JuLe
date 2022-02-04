import json
import math
import spacy
import pandas as pd
import sys
from typing import Any
from flask import Blueprint, request, jsonify, abort
from ..extensions import db
from ..models import Exercise, Account, Tag, Difficulty, Scope, tags_helper, NerTag, Submission, Grade
from ..schemas import ExerciseSchema
from ..blueprints.tags import create_tag, increment_tag_use, decrement_tag_use
from ..jwt_signature_verification import require_authorization
from sklearn.neighbors import NearestNeighbors
from sklearn.feature_extraction.text import TfidfVectorizer

current_module = sys.modules[__name__]

# Exercise blueprint used to register blueprint in app.py
exercises_routes = Blueprint('exercise', __name__, url_prefix='/exercises')

# Schemas
exercise_schema = ExerciseSchema()  # For single exercise
exercises_schema = ExerciseSchema(many=True)  # For list of exercises

per_page = 5  # number of exercises displayed per page´

# global variable for finding similar exercise
current_module.similar_exercises_engine = None
current_module.features = None
current_module.exercise_matrix = None

# global variables for personalized exercise recommendations
current_module.recommendation_engine = None
current_module.sim_user = None
current_module.enough_users = False

# pretrained spacy model
nlp = spacy.load("de_core_news_sm")


# index route, not in use
@exercises_routes.route('/', strict_slashes=False)
def index():
    return 'Index of the exercise routes!'


# applies filters from frontend and returns a list of exercises (1st page) together with the total page number
@exercises_routes.route('/filters', methods=['POST'])
@require_authorization
def read_exercises_by_filters(current_account: Account):
    query = db.session.query(Exercise)

    # filters by owner's id
    if 'owner_id' in request.json:
        query = query.filter_by(owner_id=int(request.json['owner_id']))

    # filters by difficulty
    if 'difficulty' in request.json:
        query = query.filter_by(difficulty=Difficulty(request.json['difficulty']))

    # filters by search text being contained in exercise title
    if 'search' in request.json:
        query = query.filter(Exercise.title.contains(request.json['search']))

    # filters by selected tags (treated as "OR")
    if 'tags' in request.json:
        query = query.filter(db.or_(*[Exercise.tags.any(Tag.id == tag_id) for tag_id in request.json['tags']]))

    # filters to get exercises that are
    # 1.public, visible to everyone
    # 2.internal, visible to users in same university
    # 3.draft, visible to owner of exercise
    query = query.filter(
        db.or_(Exercise.scope == Scope.public,
               db.and_(Exercise.scope == Scope.internal,
                       Exercise.owner.has(Account.university_id == current_account.university_id)),
               db.and_(Exercise.scope == Scope.draft, Exercise.owner_id == current_account.id)
               )
    )

    # filters by submitted status (finished or not finished)
    if 'status' in request.json:
        submitted_status = request.json['status']
        if submitted_status == 1:
            query = query.join(Submission).filter(Submission.account_id == current_account.id)
        elif submitted_status == 2:
            sq = query.join(Submission).filter(Submission.account_id == current_account.id).with_entities(Exercise.id)
            query = query.filter(~Exercise.id.in_(sq))
        else:
            return abort(400, "Parameter values are not correct.")

    pages = math.ceil(query.count() / per_page)
    # get exercises in the 1st page because it's redirected to the 1st page after applying filters
    exercises_first_page = query.paginate(1, per_page, error_out=False).items

    return jsonify({'pages': pages, 'exercises': exercises_schema.dump(exercises_first_page)})


# returns a list of exercises per page
@exercises_routes.route('/page/<int:page>', methods=['POST'])
@require_authorization
def read_exercises_per_page(current_account: Account, page):
    query = db.session.query(Exercise)

    # filters by owner's id
    if 'owner_id' in request.json:
        query = query.filter_by(owner_id=request.json['owner_id'])

    # filters by difficulty
    if 'difficulty' in request.json:
        query = query.filter_by(difficulty=Difficulty(request.json['difficulty']))

    # filters by search text containing
    if 'search' in request.json:
        query = query.filter(Exercise.title.contains(request.json['search']))

    # filters by selected tags (treated as "OR")
    if 'tags' in request.json:
        query = query.filter(db.or_(*[Exercise.tags.any(Tag.id == tag_id) for tag_id in request.json['tags']]))

    # filters to get exercises that are
    # 1.public, visible to everyone
    # 2.internal, visible to users in same university
    # 3.draft, visible to owner of exercise
    query = query.filter(
        db.or_(Exercise.scope == Scope.public,
               db.and_(Exercise.scope == Scope.internal,
                       Exercise.owner.has(Account.university_id == current_account.university_id)),
               db.and_(Exercise.scope == Scope.draft, Exercise.owner_id == current_account.id)
               )
    )

    # filters by submitted status (finished or not finished)
    if 'status' in request.json:
        submitted_status = request.json['status']
        if submitted_status == 1:
            query = query.join(Submission).filter(Submission.account_id == current_account.id)
        elif submitted_status == 2:
            sq = query.join(Submission).filter(Submission.account_id == current_account.id).with_entities(Exercise.id)
            query = query.filter(~Exercise.id.in_(sq))
        else:
            return abort(400, "Parameter values are not correct.")

    exercises_per_page = query.paginate(page, per_page, error_out=False).items
    return jsonify(exercises_schema.dump(exercises_per_page))


# returns whether current user has submitted the exercise
@exercises_routes.route('/<exercise_id>/submitted', methods=['GET'])
@require_authorization
def check_if_submitted(current_account: Account, exercise_id):
    submitted = Submission.query.filter_by(exercise_id=exercise_id, account_id=current_account.id).first() is not None
    return json.dumps(submitted)


# route for reading, updating, deleting a single exercise by id
@exercises_routes.route('/<exercise_id>', methods=['GET', 'POST', 'DELETE'])
@require_authorization
def rud_exercise(current_account: Account, exercise_id):
    exercise = Exercise.query.filter_by(id=exercise_id).first()
    if exercise is None:
        return abort(405, 'No exercise found with matching id')

    # read exercise by id
    if request.method == 'GET':
        # if the exercise's scope is draft
        if exercise.scope == Scope.draft:
            # the user must be the exercise's owner
            if current_account.id != exercise.owner_id:
                return abort(401, 'You are not authorized to view this exercise!')

        # if the exercise's scope is internal
        if exercise.scope == Scope.internal:
            owner = exercise.owner
            # the user and the exercise's owner must have same university_id
            if current_account.university_id != owner.university_id:
                return abort(401, 'You are not authorized to view this exercise!')

        return jsonify(exercise_schema.dump(exercise))

    # update exercise by id
    elif request.method == 'POST':
        # the user must be the exercise's owner to edit the exercise
        if current_account.id != exercise.owner_id:
            return abort(401, 'You are not authorized to edit this exercise!')

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

        # update ner tags
        ner_tags = get_ner_tags(exercise.question)
        update_ner_tags(exercise, ner_tags)

        return jsonify(exercise_schema.dump(exercise))

    # delete exercise by id
    elif request.method == 'DELETE':
        # the user must be the exercise's owner to delete the exercise
        if current_account.id != exercise.owner_id:
            return abort(401, 'You are not authorized to delete this exercise!')

        # remove dependencies
        remove_tags_from_exercise(exercise)

        db.session.delete(exercise)
        db.session.commit()

        # rebuild the exercise recommendation engine
        build_similar_exercises_engine()

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
    db.session.refresh(new_exercise)

    # add ner tags
    ner_tags = get_ner_tags(question)
    update_ner_tags(new_exercise, ner_tags)

    # rebuild the exercise recommendation engine
    build_similar_exercises_engine()

    return jsonify(exercise_schema.dump(new_exercise))


# determines the k most similar exercises
@exercises_routes.route('/similar/<exercise_id>', methods=['GET'])
# @require_authorization
def similar_exercises(exercise_id):
    if current_module.similar_exercises_engine is None:
        build_similar_exercises_engine()

    sim_exercises_dict = dict()

    # check whether the exercise is part of the vector space
    if int(exercise_id) in current_module.exercise_matrix.id.values:

        # determine how many exercises to return
        if len(current_module.exercise_matrix) >= 4:
            k = 4
        else:
            k = len(current_module.exercise_matrix)

        # determine the index of the exercise in the exercise feature matrix
        exercise_index = \
            current_module.exercise_matrix.loc[current_module.exercise_matrix.id == int(exercise_id)].iloc[0][
                'index']

        # determine the most similar exercises according to the cosine distance of the TF-IDF vectors
        distances, indices = current_module.similar_exercises_engine.kneighbors(
            current_module.features[exercise_index],
            n_neighbors=k)

        # retrieving the exercises
        sim_exercises = current_module.exercise_matrix[
            current_module.exercise_matrix['index'].isin(indices[0][1:])].copy()

        sim_exercises_dict['ids'] = list(sim_exercises['id'])

        sim_exercises_dict['titles'] = list(sim_exercises['title'])
    else:
        sim_exercises_dict['ids'] = []

        sim_exercises_dict['titles'] = []

    return sim_exercises_dict


# determines the k recommended exercises
# partly inspired by this article:
# https://towardsdatascience.com/build-a-user-based-collaborative-filtering-recommendation-engine-for-anime-92d35921f304
@exercises_routes.route('/recommendations', methods=['GET'])
@require_authorization
def recommended_exercises(current_account: Account):
    build_recommendation_engine()

    account_id = current_account.id

    #  check if enough users to build model are present
    if current_module.enough_users:

        # either use the 3 most similar or all users as reference
        if current_module.recommendation_engine.shape[0] >= 4:
            num_user = 4
        else:
            num_user = current_module.recommendation_engine.shape[0]

        # get the grades for the particular user
        user_grades = current_module.recommendation_engine[current_module.recommendation_engine.index == int(account_id)]

        # determine the users with the most similar skill set
        distances, indices = current_module.sim_user.kneighbors(
            user_grades.values.tolist(),
            n_neighbors=num_user)

        # average the grades for those users for all exercises
        sim_users_mean_grades = pd.DataFrame(current_module.recommendation_engine.iloc[indices[0][1:]].mean(axis=0))
        sim_users_mean_grades.columns = ['mean_grade']

        # retrieve all exercises the user has not completed yet
        user_grades_filtered = user_grades.transpose()
        user_grades_filtered.columns = ['grades']
        exercises_not_done = user_grades_filtered[user_grades_filtered['grades'] == 0].index.tolist()

        # retrieve all the average grades of similar users for not completed exercises
        sim_users_mean_grades_filtered = sim_users_mean_grades[sim_users_mean_grades.index.isin(exercises_not_done)]

        # either return the 3 most relevant or all exercises that have not been completed yet
        if len(exercises_not_done) >= 3:
            num_exercises = 3
        else:
            num_exercises = len(exercises_not_done)

        # get the exercise ids with the worst average grade of similar users
        rec_exercises_ids = sim_users_mean_grades_filtered.sort_values(by=['mean_grade'], ascending=False).head(
            n=num_exercises).index.tolist()

    else:
        rec_exercises_ids = []
    # query recommended exercises
    rec_exercises = Exercise.query.filter(Exercise.id.in_(rec_exercises_ids)).all()

    return jsonify(exercises_schema.dump(rec_exercises))


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


# function to build the recommendation engine for similar exercises
# builds the TF-IDF vectors for all exercises
def build_similar_exercises_engine():
    # query relevant exercise information from db
    exercises_info = db.session.query(Exercise.id, Exercise.title, Exercise.explanation, Exercise.question,
                                      Exercise.sample_solution,
                                      Exercise.difficulty).filter(Exercise.scope == 'public').all()

    exercises_info_df = pd.DataFrame(exercises_info,
                                     columns=['id', 'title', 'explanation', 'question', 'solution', 'difficulty'])

    # replace enum with actual strings
    exercises_info_df['difficulty'].replace(1, 'easy', inplace=True)
    exercises_info_df['difficulty'].replace(2, 'medium', inplace=True)
    exercises_info_df['difficulty'].replace(3, 'hard', inplace=True)

    # from a string of all available tags for each exercise
    exercise_tags = db.session.query(tags_helper.c.exercise_id, Tag.name).filter(
        (Tag.id == tags_helper.c.tag_id)).all()
    tags = dict()
    for id, tag in exercise_tags:
        if id in tags:
            tags[id] += ' ' + tag
        else:
            tags[id] = tag
    exercise_tags_df = pd.DataFrame(list(tags.items()), columns=['id', 'tags'])
    exercises_info_df = exercises_info_df.merge(exercise_tags_df, left_on='id', right_on='id')
    exercises_info_df.reset_index(inplace=True)

    # concatenate all available strings for exercises
    feature_matrix = exercises_info_df['id'].copy()
    feature_matrix['exercise_info'] = exercises_info_df['explanation'] + exercises_info_df['question'] + \
                                      exercises_info_df['solution'] + exercises_info_df['difficulty'] + \
                                      exercises_info_df['tags']

    # vectorize the information (one string for each exercise) using TF-IDF
    tfidf = TfidfVectorizer()
    features = tfidf.fit_transform(feature_matrix['exercise_info'])

    # fit a knn model which can be used to get the most similar exercises
    model_knn = NearestNeighbors(metric='cosine', algorithm='brute')
    model_knn.fit(features)

    current_module.exercise_matrix = exercises_info_df
    current_module.features = features
    current_module.similar_exercises_engine = model_knn


# function to build the recommendation engine based on a user's submission history
# uses the students' inverse grading as 'rating'
def build_recommendation_engine():
    grade_info = db.session.query(Grade.score, Grade.student_id, Grade.exercise_id).join(Exercise).filter(
        Exercise.scope == 'public').all()

    grade_info_df = pd.DataFrame(grade_info, columns=['score', 'user_id', 'exercise_id'])

    if grade_info_df.shape[0] > 2 and grade_info_df.shape[1] > 5:
        matrix = grade_info_df.pivot_table(index='user_id', columns='exercise_id', values='score')

        matrix = matrix.fillna(0)

        model_knn = NearestNeighbors(metric='cosine', algorithm='brute').fit(matrix)

        current_module.enough_users = True
        current_module.recommendation_engine = matrix
        current_module.sim_user = model_knn


def get_ner_tags(text):
    # process exercise using spacy module
    doc = nlp(text)

    # get lists of start, end, explanation of ner tag
    ents = [{"label": e.label_, "start": e.start_char, "end": e.end_char, "explanation": spacy.explain(e.label_)} for e
            in doc.ents]

    return ents


def update_ner_tags(exercise: Exercise, ner_tags: list[dict[str, Any]]):
    delete_ner_tags(exercise)
    for ner_tag in ner_tags:
        create_ner_tag(exercise, ner_tag)


def delete_ner_tags(exercise: Exercise):
    try:
        db.session.query(NerTag).filter_by(exercise_id=exercise.id).delete()

    except Exception as N:
        print(N)
        # TODO: make except less general


def create_ner_tag(exercise: Exercise, ner_tag: dict[str, Any]) -> NerTag:
    try:
        new_ner_tag = NerTag(
            label=ner_tag["label"],
            start=ner_tag["start"],
            end=ner_tag["end"],
            explanation=ner_tag["explanation"],
            exercise_id=exercise.id
        )
        db.session.add(new_ner_tag)
        db.session.commit()
        db.session.refresh(new_ner_tag)
        ner_tag: NerTag = new_ner_tag

    except Exception as N:
        print(N)
        # TODO: make except less general

    else:
        return ner_tag
