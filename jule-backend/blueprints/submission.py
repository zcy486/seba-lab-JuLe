from flask import Blueprint, request, jsonify, abort
import textstat
from app import db
from models import Statistic, Submission, Exercise, Score, Grade
from schemas import SubmissionSchema

textstat.set_lang('de')


# calculate all statistics for one solution
# TODO: import this from statistics blueprint
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


# calculate grade
def calculate_score(exercise_id, student_stats):
    exercise = Exercise.get(exercise_id)
    solution_stats = calculate_statistics(exercise.sample_solution)

    stat_diffs = [abs(student_stat[0] - solution_stats[0]) / solution_stats[0]
                  for student_stat, sample_stat in zip(student_stats.values(), solution_stats.values())]

    if all(x <= 0.1 for x in stat_diffs):
        return Score.excellent
    elif all(x <= 0.3 for x in stat_diffs):
        return Score.good
    elif all(x <= 0.4 for x in stat_diffs):
        return Score.satisfactory
    elif all(x <= 0.6 for x in stat_diffs):
        return Score.unsatisfactory


# Tag blueprint used to register blueprint in app.py
submission_routes = Blueprint('submission', __name__, url_prefix="/submission")

# Schema used to return submission
submission_schema = SubmissionSchema()


# create or return all available statistics for one student and one exercise
@submission_routes.route('/<account_id>/<exercise_id>', methods=['POST'])
def add_submission(account_id, exercise_id):
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
                    score = calculate_score(exercise_id, student_stats)

                    # query submission for this exercise/student pair from db
                    old_submission = Submission.query.filter_by(exercise_id=exercise_id, account_id=account_id).first()

                    # if no submission exists, add submission, and calculate statistics and grade
                    if old_submission is None:
                        new_submission = Submission(text=text,
                                                    exercise_id=exercise_id,
                                                    account_id=account_id)
                        db.session.add(new_submission)
                        db.session.commit()
                        db.session.refresh(new_submission)

                        # iterate over calculated statistics and add each to db
                        for stat_title in student_stats:
                            stat_value, stat_type_id = student_stats[stat_title]
                            stat = Statistic(statistic_type_id=stat_type_id,
                                             exercise_id=exercise_id,
                                             student_id=account_id,
                                             submission_value=stat_value,
                                             submission_id=new_submission.id)
                            db.session.add(stat)
                            db.session.commit()

                        # create new grade and add it to db
                        new_grade = Grade(score=score,
                                          exercise_id=exercise_id,
                                          account_id=account_id,
                                          submission_id=new_submission.id)

                        db.session.add(new_grade)
                        db.session.commit()
                        db.session.refresh(new_grade)

                    else:
                        # if  submission exists, update text
                        old_submission.text = text
                        db.session.commit()

                        for stat_title in student_stats:
                            # if  submission exists, update existing statistics
                            stat_value, stat_type_id = student_stats[stat_title]
                            stat = Statistic.query.filter_by(exercise_id=exercise_id,
                                                             account_id=account_id,
                                                             statistic_type_id=stat_type_id).first()
                            stat.submission_value = stat_value
                            db.session.commit()

                        # if  submission exists, update existing grade score
                        grade = Grade.query.filter_by(exercise_id=exercise_id,
                                                      account_id=account_id).first()
                        grade.score = score
                        db.session.commit()

                else:
                    return abort(400, "Parameter missing from request.")

        except Exception as N:
            print(N)
            # TODO: make except less general
            return abort(405)
    else:
        return abort(405)


# return a student's submission to a particular exercise exercise
@submission_routes.route('/<account_id>/<exercise_id>', methods=['GET'])
def get_submission(account_id, exercise_id):
    if request.method == 'GET':
        try:
            # query submission for this exercise/student pair from db
            submission = Submission.query.filter_by(exercise_id=exercise_id, account_id=account_id).first()

            return jsonify(submission_schema.dump(submission))

        except Exception as N:
            print(N)
            # TODO: make except less general
            return abort(405)
    else:
        return abort(405)
