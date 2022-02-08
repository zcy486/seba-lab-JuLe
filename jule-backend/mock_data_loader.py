from datetime import timedelta

from werkzeug.security import generate_password_hash
import json

from .extensions import db
from .models import Account, Exercise, StatisticType, Submission, Discussion, Comment
from .schemas import UniversitySchema

from .blueprints import exercises


# Inserts mock data into database for development purposes
def insert_mock_data(app):
    print("Trying to insert mock data", flush=True)
    with app.app_context():
        account_entry_count = db.session.query(Account).count()
        exercise_entry_count = db.session.query(Exercise).count()
        if (account_entry_count + exercise_entry_count == 0):
            print("Starting to insert mock data", flush=True)
            # Insert mock universities
            with open("./mock_data/mock_universities.json", "r") as mock_universities:
                mock_unis = json.load(mock_universities)
                university_schema = UniversitySchema()

                for mock_uni in mock_unis:
                    loaded_mock_uni = university_schema.load(mock_uni)
                    db.session.add(loaded_mock_uni)

                    try:
                        db.session.commit()
                    except Exception as E:
                        db.session.rollback()
                        print(E)

            # Insert mock account data
            with open("./mock_data/mock_accounts.json", "r") as mock_accounts:
                mock_accounts = json.load(mock_accounts)

                for mock_account in mock_accounts:
                    loaded_mock_account = Account(
                        # id=mock_account["id"],
                        email=mock_account["email"],
                        password=generate_password_hash(
                            mock_account["password"], method='pbkdf2:sha1', salt_length=8),
                        name=mock_account["name"],
                        role=mock_account["role"],
                        university_id=mock_account["universityId"],
                        is_verified=mock_account["isVerified"])
                    db.session.add(loaded_mock_account)

                    try:
                        db.session.commit()
                    except Exception as E:
                        db.session.rollback()
                        print(E)

            # load statistic types
            with open("./mock_data/mock_statistic_types.json", "r") as mock_statistic_types:
                mock_statistic_types = json.load(mock_statistic_types)

                for mock_statistic_type in mock_statistic_types:
                    loaded_mock_statistic_type = StatisticType(
                        id=mock_statistic_type['id'],
                        title=mock_statistic_type['title'],
                        description=mock_statistic_type['description']
                    )
                    db.session.add(loaded_mock_statistic_type)

                    try:
                        db.session.commit()
                    except Exception as E:
                        db.session.rollback()
                        print(E)

            # load mock exercises and their tags
            with open("./mock_data/mock_exercises.json", "r") as mock_exercises:

                mock_exercises = json.load(mock_exercises)

                for mock_exercise in mock_exercises:

                    try:

                        jwt_token = get_mock_account_jwt(app=app, account_id=mock_exercise['ownerId'])

                        with app.test_request_context(
                                path=f"exercises/create",
                                data=json.dumps(mock_exercise),
                                content_type='application/json',
                                method='POST',
                                headers={'x-access-token': jwt_token}
                        ):

                            exercises.create_exercise()
                    except Exception as E:
                        print(E)

            # load submissions
            with open("./mock_data/mock_submissions.json", "r") as mock_submissions:
                mock_submissions = json.load(mock_submissions)

                for mock_submission in mock_submissions:

                    jwt_token = get_mock_account_jwt(app=app, account_id=mock_submission['accountId'])

                    with app.test_request_context(
                            path=f"/submission/{mock_submission['exerciseId']}",
                            data=json.dumps(mock_submission),
                            content_type='application/json',
                            method='POST',
                            headers={'x-access-token': jwt_token}
                    ):
                        from .blueprints import submission

                        submission.add_submission(exercise_id=mock_submission['exerciseId'])

                        try:
                            latest_submission = Submission.query.order_by(Submission.submission_time.desc()).first()
                            latest_submission.submission_time = latest_submission.submission_time - \
                                                                timedelta(days=mock_submission['submission_time_delta'])
                            db.session.commit()

                        except Exception as E:
                            print(E)

            # load discussions
            with open("./mock_data/mock_discussions.json", "r") as mock_discussions:
                mock_discussions = json.load(mock_discussions)

                for mock_discussion in mock_discussions:
                    loaded_mock_discussion = Discussion(
                        id=mock_discussion['id'],
                        text=mock_discussion['text'],
                        poster_id=mock_discussion['posterId'],
                        exercise_id=mock_discussion['exerciseId'],
                        votes=mock_discussion['votes'],
                        anonymous=mock_discussion['anonymous']
                    )

                    db.session.add(loaded_mock_discussion)

                    try:
                        db.session.commit()
                    except Exception as E:
                        db.session.rollback()
                        print(E)

                # append a comment in the second discussion
                # mock_comment = Comment(
                #     text="Yes, that's a typo.",
                #     poster_id=1,
                #     discussion_id=2,
                #     anonymous=True
                # )
                # db.session.add(mock_comment)
                # try:
                #     db.session.commit()
                # except Exception as E:
                #     db.session.rollback()
                #     print(E)

        else:
            print("did not load mock data as database already holds data", flush=True)


def get_mock_account_jwt(app, account_id: int) -> str:
    with open("./mock_data/mock_accounts.json", "r") as mock_accounts:
        mock_accounts = json.load(mock_accounts)
        filtered_results = list(filter(lambda account: account['id'] == account_id, mock_accounts))
        if len(filtered_results) == 1:
            mock_account = filtered_results[0]

            data = {'email': mock_account['email'], 'password': mock_account['password']}

            from .blueprints import login
            with app.test_request_context(
                    path=f"login",
                    data=json.dumps(data),
                    content_type='application/json',
                    method='POST'
            ):
                try:
                    jwt_token = login.index().json['jwtToken']
                    # print("successfully obtained jwt_token from mock account", flush=True)
                    return jwt_token
                except Exception as E:
                    print(E)
