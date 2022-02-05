from flask import Blueprint, request, jsonify, abort
import textstat
from ..app import db
from ..models import Statistic, Exercise, Account
from sqlalchemy.sql import func
from ..models import StatisticType
from sqlalchemy import asc
from ..schemas import StatisticTypeSchema, StatisticSchema
from ..jwt_signature_verification import require_authorization

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

# Schemas
statistic_type_schema = StatisticTypeSchema(many=True)
statistic_schema = StatisticSchema(many=True)


# return information about all existing types of statistics
@statistics_routes.route('/statisticTypes', methods=['GET'])
@require_authorization
def get_statistics_types():
    if request.method == 'GET':
        try:
            statistics_types = StatisticType.query.all()
            return jsonify(statistic_type_schema.dump(statistics_types))
        except Exception as N:
            print(N)
            # TODO: make except less general
            return abort(405)
    else:
        return abort(405)


# return information for peer, student, and sample solution statistics for an exercise/student pair
@statistics_routes.route('/statistics/<exercise_id>', methods=['GET'])
@require_authorization
def get_statistics(current_account: Account, exercise_id):
    student_id = current_account.id

    if request.method == 'GET':
        try:
            # get statistics from db/ calculate statistics
            exercise = Exercise.query.get(exercise_id)
            student_stats = Statistic.query.filter_by(exercise_id=exercise_id, student_id=student_id).order_by(
                asc(Statistic.statistic_type_id)).all()
            peer_stats = db.session.query(func.avg(Statistic.submission_value), Statistic.statistic_type_id).group_by(
                Statistic.statistic_type_id).filter(Statistic.exercise_id == exercise_id).order_by(
                asc(Statistic.statistic_type_id)).all()
            solution_stats = calculate_statistics(exercise.sample_solution)

            # reformat statistics to fit frontend type: title, student value,  peer value, sample solution value
            stats = []
            for student, peer, stat_title in zip(student_stats, peer_stats, solution_stats):
                stats.append((stat_title, student.submission_value, float(peer[0]), solution_stats[stat_title][0]))

            return_data = {'scores': stats}
            return jsonify(return_data)

        except Exception as N:
            print(N)
            # TODO: make except less general
            return abort(405)
    else:
        return abort(405)
