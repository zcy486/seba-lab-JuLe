from flask import Blueprint, request, jsonify, abort
import os, sys
currentdir = os.path.dirname(os.path.realpath(__file__))
parentdir = os.path.dirname(currentdir)
sys.path.append(parentdir)
import nlp_utils

statistics_routes = Blueprint('statistics', __name__)

@statistics_routes.route('/', methods=['GET'])
def get_info():
    if request.method == 'GET':
        # TODO: get infos about all statisctics from db
        data = {'some_statistic': "some description"}
        return jsonify(data)
    else:
        return abort(405)

@statistics_routes.route('/<exercise_id>/<student_id>', methods=['GET'])
def get_statistics(exercise_id, student_id):
    if request.method == 'GET':
        # TODO: get peer, sample, and student statistics for the exercise from db
        data = {'some_statistic': "some value"}
        return jsonify(data)
    else:
        return abort(405)

@statistics_routes.route('/<exercise_id>/calculate', methods=['POST'])
def calculate_statistics(exercise_id):
    if request.method == 'POST':

        params = request.json

        # get parameters from the request body
        if params is None:
            params = request.args

        if params is not None:
            if 'text' in params and 'sample_solution' in params:
                text = params['text']
                # TODO: define how to indicate if its a sample solution
                sample_solution = params['sample_solution']

                # TODO: add statistics to db
                statistics = nlp_utils.calculate_statistics(text)
                return jsonify(statistics)
            else:
                return abort(400, "Parameter(s) missinig from request.")
    else:
        return abort(405)