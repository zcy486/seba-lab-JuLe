from flask import Blueprint, request, jsonify, abort, current_app
from sqlalchemy import join
from sqlalchemy.sql import select
from ..extensions import db
from ..models import Exercise, Account, Tag, Difficulty, Scope, tags_helper
from ..schemas import ExerciseSchema
from ..blueprints.tags import create_tag, increment_tag_use, decrement_tag_use
from ..jwt_signature_verification import require_authorization
from sklearn.neighbors import NearestNeighbors
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd

recommendation_routes = Blueprint('recommendation', __name__, url_prefix='/recommendations')

app = current_app._get_current_object()
app.app_context.push()


def build_recommendation_engine():
    with app.app_context():

        # query relevant exercise information from db
        exercises_info = db.session.query(Exercise.id, Exercise.explanation, Exercise.question,
                                          Exercise.sample_solution,
                                          Exercise.difficulty).all()

        exercises_info_df = pd.DataFrame(exercises_info,
                                         columns=['id', 'explanation', 'question', 'solution', 'difficulty'])

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

        return model_knn


similar_exercises_knn = build_recommendation_engine()


@recommendation_routes.route('/<exercise_id>', methods=['GET'])
def index(exercise_id):
    distances, indices = similar_exercises_knn.kneighbors(features[exercise_id], n_neighbors=4)

    print(indices)

    return 'This works!'
