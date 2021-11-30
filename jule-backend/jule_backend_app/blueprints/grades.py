import textstat
from flask import Blueprint, request, jsonify, abort
from jule_backend_app.app import db
from jule_backend_app.models import Grade
from jule_backend_app.schemas import GradeSchema
from jule_backend_app.models import Submission
from jule_backend_app.models import Exercise
from jule_backend_app.models import Statistic
from jule_backend_app.models import Score

grades_routes = Blueprint('grades', __name__)

gradeSchema = GradeSchema()

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

def calculate_score(exercise_id, submission_id, student_id):
    exercise = Exercise.get(exercise_id)
    solution_stats = calculate_statistics(exercise.sample_solution)
    student_stats = Statistic.query.filter_by(submission_id=submission_id, student_id=student_id).order_by(
        Statistic.statistic_type_id.asc())

    stat_diffs = [abs(student_stat.submission_value - student_stat[0])/student_stat.submission_value
                  for student_stat, sample_stat in zip(student_stats, solution_stats.values())]

    if all(x <= 0.1 for x in stat_diffs):
        return Score.excellent
    elif all(x <= 0.3 for x in stat_diffs):
        return Score.good
    elif all(x <= 0.4 for x in stat_diffs):
        return Score.satisfactory
    elif all(x <= 0.6 for x in stat_diffs):
        return Score.unsatisfactory

@grades_routes.route('/<submission_id>/<student_id>', methods=['GET, POST'])
def grade(submission_id, student_id):
    if request.method == 'GET':

        # TODO: use submission time stamp to get latest one. Or always replace older submissions?
        submission_grade = Grade.query.filter_by(submission_id=submission_id,
                                                 student_id=student_id)
        return jsonify(GradeSchema.dump(submission_grade))

    elif request.method == 'POST':
        try:
            # TODO: decide if this should really be happening here
            submission = Submission.get(submission_id)
            exercise_id = submission.exercise_id

            score = calculate_score(exercise_id, submission_id, student_id)

            # create new grade and add it to db
            new_grade = Grade(score=score,
                              exercise_id=exercise_id,
                              student_id=student_id,
                              submission_id=submission_id)

            db.session.add(new_grade)
            db.session.commit()
            db.session.refresh(new_grade)

        except Exception as N:
            print(N)
            # TODO: make except less general
    else:
        return abort(405)

