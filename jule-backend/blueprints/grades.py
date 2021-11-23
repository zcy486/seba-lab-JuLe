from flask import Blueprint, request, jsonify, abort
import os, sys

grades_routes = Blueprint('grades', __name__)

@statistics_routes.route('/<exercise_id>/<student_id>', methods=['GET, POST'])
def grade(exercise_id, student_id):
    if request.method == 'GET':
        # TODO: get grade from db
        data = {'grade': "some value"}
        return jsonify(data)
    elif request.method == 'POST':
        # TODO: get statistics from db calculate grade add grade to db
        return "grade calculated"
    else:
        return abort(405)

