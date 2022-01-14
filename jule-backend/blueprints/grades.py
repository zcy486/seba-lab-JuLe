import textstat
from flask import Blueprint, request, jsonify, abort
from ..models import Grade, Account
from ..schemas import GradeSchema
from ..jwt_signature_verification import require_authorization

grades_routes = Blueprint('grades', __name__, url_prefix="/grades")

# Schema used to return grade
grade_schema = GradeSchema()


@grades_routes.route('/<exercise_id>', methods=['GET'])
@require_authorization
def get_grade(current_account: Account, exercise_id):
    student_id = current_account.id
    if request.method == 'GET':
        try:
            submission_grade = Grade.query.filter_by(exercise_id=exercise_id,
                                                     student_id=student_id).first()

            print(submission_grade)

            return jsonify(grade_schema.dump(submission_grade))

        except Exception as N:
            print(N)
            # TODO: make except less general
            return abort(405)
    else:
        return abort(405)
