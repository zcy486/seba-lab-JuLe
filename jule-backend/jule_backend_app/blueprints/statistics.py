from flask import Blueprint, request, jsonify, abort
import textstat
from jule_backend_app.app import db
from jule_backend_app.models import Statistic
from jule_backend_app.models import Exercise
from sqlalchemy.sql import func
from jule_backend_app.models import StatisticType

textstat.set_lang('de')


# calculutae all statistics for one solution
# could be extened to make the types of statistics to be calculated variable
# more elegant to not hard code statistic type ids, but if we only have 5 it doesn't make sense to query them all the time
# TODO: add statistics
def calculate_statistics(text):
    statistics = dict()

    syllable_count = textstat.syllable_count(text)

    statistics['syllable_count'] = (syllable_count, 1)

    return statistics


statistics_routes = Blueprint('statistics', __name__)


# return information about all existing types of statistics
@statistics_routes.route('/', methods=['GET'])
def get_info():
    if request.method == 'GET':
        statistics_types = StatisticType.query.all()
        return jsonify(statistics_types)
    else:
        return abort(405)


# create or return all available statistics for one student and one exercise
@statistics_routes.route('/<exercise_id>/<student_id>', methods=['GET, POST'])
def grade(exercise_id, student_id):
    if request.method == 'GET':

        # TODO: check how return of group by looks like and whether it needs to be reformatted
        # get statistics from db
        exercise = Exercise.get(exercise_id)
        student_stats = Statistic.query.filter_by(exercise_id=exercise_id, student_id=student_id)
        peer_stats = db.session.query(func.avg(Statistic.submission_value)).group_by(Statistic.statistic_type_id)
        solution_stats = calculate_statistics(exercise.sample_solution)

        # add values to dict
        data = dict()
        data['student_stats'] = student_stats
        data['peer_stats'] = peer_stats
        data['solution_stats'] = solution_stats

        return jsonify(data)
    elif request.method == 'POST':
        params = request.json

        # get parameters from the request body
        if params is None:
            params = request.args

        if params is not None:
            if 'text' in params:
                text = params['text']
                student_stats = calculate_statistics(text)

                for stat_title in student_stats:
                    stat_value, stat_type_id = student_stats[stat_title]
                    stat = Statistic(statistic_type_id=stat_type_id, exercise_id=exercise_id, student_id=student_id,
                                     submission_value=stat_value)
                    db.session.add(stat)
                    db.session.commit()
            else:
                return abort(400, "Parameter missinig from request.")
    else:
        return abort(405)
