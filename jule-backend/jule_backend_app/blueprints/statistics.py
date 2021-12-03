from flask import Blueprint, request, jsonify, abort
import textstat
from jule_backend_app.app import db
from jule_backend_app.models import Statistic
from jule_backend_app.models import Exercise
from sqlalchemy.sql import func
from jule_backend_app.models import StatisticType

textstat.set_lang('de')


# calculutae all statistics for one solution
# TODO: add statistics
# TODO: add statistics typs to data base
def calculate_statistics(text):
    statistics = dict()

    syllable_count = textstat.syllable_count(text)
    poly_syl_count = textstat.polysyllabcount(text)
    char_count = textstat.char_count(text)
    lexicon_count = textstat.lexicon_count(text)
    sentence_count = textstat.sentence_count(text)

    statistics['syllable_count'] = (syllable_count, 1)
    statistics['poly_syl_count'] = (poly_syl_count, 2)
    statistics['char_count'] = (char_count, 3)
    statistics['lexicon_count'] = (lexicon_count, 4)
    statistics['sentence_count'] = (sentence_count, 5)

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


# create or return all available statistics for one student and one exercise
@statistics_routes.route('/statistics/<student_id>/<exercise_id>/<submission_id>', methods=['POST'])
def add_statistics(exercise_id, student_id, submission_id):
    if request.method == 'POST':
        try:
            params = request.json

            # get parameters from the request body
            if params is None:
                params = request.args

            if params is not None:
                if 'text' in params:
                    text = params['text']
                    student_stats = calculate_statistics(text)

                    # iterate over calculated statistics and add each to db
                    for stat_title in student_stats:
                        stat_value, stat_type_id = student_stats[stat_title]
                        stat = Statistic(statistic_type_id=stat_type_id, exercise_id=exercise_id, student_id=student_id,
                                         submission_value=stat_value, submission_id=submission_id)
                        db.session.add(stat)
                        db.session.commit()
                else:
                    return abort(400, "Parameter missinig from request.")

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
            exercise = Exercise.get(exercise_id)
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