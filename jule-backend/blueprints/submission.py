from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, abort
from sqlalchemy import and_
import textstat
from ..app import db
from ..models import Statistic, Submission, Exercise, Score, Grade, Account
from ..schemas import SubmissionSchema
from ..blueprints.statistics import calculate_statistics
from ..jwt_signature_verification import require_authorization
import json


textstat.set_lang('de')

submissions_schema = SubmissionSchema(many=True)  # For lists of submissions


# calculate grade
def calculate_score(exercise_id, student_stats):
    exercise = Exercise.query.get(exercise_id)
    solution_stats = calculate_statistics(exercise.sample_solution)

    stat_diffs = [abs(student_stat[0] - sample_stat[0])
                  for student_stat, sample_stat in zip(student_stats.values(), solution_stats.values())]

    print(stat_diffs)

    if all(x <= 0.1 for x in stat_diffs):
        return Score.excellent
    elif all(x <= 0.3 for x in stat_diffs):
        return Score.good
    elif all(x <= 0.4 for x in stat_diffs):
        return Score.satisfactory
    else:
        return Score.unsatisfactory


# Tag blueprint used to register blueprint in app.py
submission_routes = Blueprint('submission', __name__, url_prefix="/submission")

# Schema used to return submission
submission_schema = SubmissionSchema()


# create or return all available statistics for one student and one exercise
@submission_routes.route('/<exercise_id>', methods=['POST'], strict_slashes=False)
@require_authorization
def add_submission(current_account: Account, exercise_id):
    account_id = current_account.id
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
                            db.session.refresh(stat)

                        # # create new grade and add it to db
                        new_grade = Grade(score=score,
                                          exercise_id=exercise_id,
                                          student_id=account_id,
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
                                                             student_id=account_id,
                                                             statistic_type_id=stat_type_id).first()
                            stat.submission_value = stat_value
                            db.session.commit()

                        # if  submission exists, update existing grade score
                        grade = Grade.query.filter_by(exercise_id=exercise_id,
                                                      student_id=account_id).first()
                        grade.score = score
                        db.session.commit()

                    return jsonify(student_stats)

                else:
                    return abort(400, "Parameter missing from request.")

        except Exception as N:
            print(N)
            # TODO: make except less general
            return abort(405)
    else:
        return abort(405)


# return a student's submission to a particular exercise exercise
@submission_routes.route('/<exercise_id>', methods=['GET'])
@require_authorization
def get_submission(current_account: Account, exercise_id):
    account_id = current_account.id
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


# return the current user's hotstreak data
@submission_routes.route('/hotstreak', methods=['GET'])
@require_authorization
def get_hotstreak(current_account: Account):

    # print("getting hotstreak")

    account_id = current_account.id

    days_to_show = 180

    date_3_months_ago = datetime.today() - timedelta(days= days_to_show)

    try:
        recent_submissions = Submission.query.filter(and_(Submission.submission_time >= date_3_months_ago, Submission.account_id == account_id)).all()

        # print("recent submissions: " + json.dumps(submissions_schema.dump(recent_submissions)))

        # TODO optimize code and delete print statements

        def to_date(submission: Submission):
            return submission.submission_time.date()

        date_list = list(map(to_date, recent_submissions))

        # print("date list: " + str(date_list))

        empty_date_list = []

        for i in range(1, days_to_show + 1):
            empty_date_list.append((date_3_months_ago + timedelta(i)).date())

        # print("empty date list: " + str(empty_date_list))

        counted_date_list = []

        for date in empty_date_list:

            # print("date: " + date.strftime("%Y-%m-%d"))

            counted_date_list.append({"date": date,"count": date_list.count(date)})

        # print("counted_date_list: " + str(counted_date_list))

        return jsonify(counted_date_list)


    except Exception as N:
        print(N)
        # TODO: make except less general
        return abort(405)


# return the current user's submissions sorted by most recent
@submission_routes.route('/all', methods=['GET'])
@require_authorization
def get_submissions(current_account: Account):

    account_id = current_account.id

    try:
        submissions = Submission.query.filter(Submission.account_id == account_id).order_by(Submission.submission_time.desc()).all()

        return jsonify(submissions_schema.dump(submissions))

    except Exception as N:
        print(N)
        # TODO: make except less general
        return abort(405)

