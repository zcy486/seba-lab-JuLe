from flask import Blueprint, request, jsonify, abort
import textstat

textstat.set_lang('de')

# TODO: add statistics
def calculate_statistics(text):

    statistics = dict()

    syllable_count = textstat.syllable_count(text)

    statistics['syllable_count'] = syllable_count

    return statistics

statistics_routes = Blueprint('statistics', __name__)

@statistics_routes.route('/', methods=['GET'])
def get_info():
    if request.method == 'GET':
        # TODO: get infos about all statisctics from db
        data = {'some_statistic': "some description"}
        return jsonify(data)
    else:
        return abort(405)

@statistics_routes.route('/<exercise_id>/<student_id>', methods=['GET, POST'])
def grade(exercise_id, student_id):
    if request.method == 'GET':
        # TODO: get peer, sample, and student statistics for the exercise from db
        data = {'some_statistic': "some value"}
        return jsonify(data)
    elif request.method == 'POST':
        params = request.json

        # get parameters from the request body
        if params is None:
            params = request.args

        if params is not None:
            if 'text' in params:
                text = params['text']
                # TODO: add statistics to db
                statistics = calculate_statistics(text)
            else:
                return abort(400, "Parameter missinig from request.")
    else:
        return abort(405)
