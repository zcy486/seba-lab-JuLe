import textstat
from flask import Blueprint, request, jsonify, abort
from models import Grade
from schemas import GradeSchema


grades_routes = Blueprint('grades', __name__, url_prefix="/grades")

gradeSchema = GradeSchema()


@grades_routes.route('/<exercise_id>/<student_id>', methods=['GET'])
def get_grade(exercise_id, student_id):
    if request.method == 'GET':

        submission_grade = Grade.query.filter_by(exercise_id=exercise_id,
                                                 student_id=student_id).all()

        return jsonify(GradeSchema.dump(submission_grade))
    else:
        return abort(405)
