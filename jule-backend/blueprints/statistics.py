from flask import Blueprint, request, jsonify, abort
import textstat
from app import db
from models import Statistic, Exercise
from sqlalchemy.sql import func
from models import StatisticType

textstat.set_lang('de')


# calculate all statistics for one solution
# TODO: add statistics
def calculate_statistics(text):
    statistics = dict()

    syllable_count = textstat.syllable_count(text)
    poly_syl_count = textstat.polysyllabcount(text)
    char_count = textstat.char_count(text)
    lexicon_count = textstat.lexicon_count(text)
    sentence_count = textstat.sentence_count(text)

    statistics['Syllable Count'] = (syllable_count, 0)
    statistics['Polysyllable Count'] = (poly_syl_count, 1)
    statistics['Char Count'] = (char_count, 2)
    statistics['Lexicon Count'] = (lexicon_count, 3)
    statistics['Sentence Count'] = (sentence_count, 4)

    return statistics


statistics_routes = Blueprint('statistics', __name__)


# return information about all existing types of statistics
@statistics_routes.route('/statisticTypes', methods=['GET'])
def get_statistics_types():
    if request.method == 'GET':
        try:
            statistics_types = StatisticType.query.all()
            return jsonify(statistics_types)
        except Exception as N:
            print(N)
            # TODO: make except less general
            return abort(405)
    else:
        return abort(405)


@statistics_routes.route('/statistics/<exercise_id>/<student_id>', methods=['GET'])
def get_statistics(exercise_id, student_id):
    if request.method == 'GET':
        try:
            # TODO: check how return of group by looks like reformat return
            # get statistics from db
            exercise = Exercise.query.get(exercise_id)
            student_stats = Statistic.query.filter_by(exercise_id=exercise_id, student_id=student_id).all()
            peer_stats = db.session.query(func.avg(Statistic.submission_value)).group_by(Statistic.statistic_type_id)
            solution_stats = calculate_statistics(exercise.sample_solution)

            # add values to dict
            data = dict()
            data['student_stats'] = student_stats
            data['peer_stats'] = peer_stats
            data['solution_stats'] = solution_stats

            return jsonify(data)
        except Exception as N:
            print(N)
            # TODO: make except less general
            return abort(405)
    else:
        return abort(405)
