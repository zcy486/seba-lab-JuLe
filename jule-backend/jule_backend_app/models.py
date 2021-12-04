from jule_backend_app.extensions import db
from datetime import datetime
import enum


# Please refer to these two pages:
# https://docs.sqlalchemy.org/en/14/orm/basic_relationships.html
# https://flask-sqlalchemy.palletsprojects.com/en/2.x/models/

class Role(enum.IntEnum):
    student = 1
    lecturer = 2


class Scope(enum.IntEnum):
    draft = 1
    internal = 2
    public = 3


class Difficulty(enum.IntEnum):
    easy = 1
    medium = 2
    hard = 3


class Score(enum.IntEnum):
    excellent = 1
    good = 2
    satisfactory = 3
    unsatisfactory = 4


class Statistic(db.Model):
    # TODO: to be modified
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), unique=True)
    description = db.Column(db.String(140), unique=False)

    grade_id = db.Column(db.Integer, db.ForeignKey('grade.id'), nullable=False)  # Grade <- Statistic (one-to-many)


class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(50))
    role = db.Column(db.Enum(Role))
    last_login = db.Column(db.DateTime(timezone=True))
    register_time = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)

    university_id = db.Column(db.Integer, db.ForeignKey('university.id'),
                              nullable=False)  # Account -> University (many-to-one)
    university = db.relationship('University', back_populates='account')  # Account -> University (many-to-one)


class University(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    abbreviation = db.Column(db.String(8))
    logo_src = db.Column(db.String(250), nullable=True)

    account = db.relationship('Account', back_populates='university')  # University -> Account (one-to-many)


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    use_count = db.Column(db.Integer, nullable=False)


# If you want to use many-to-many relationships you will need to define a helper table
# that is used for the relationship. For this helper table it is strongly recommended
# to not use a model but an actual table:
tags_helper = db.Table('tags_helper',
                       db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), primary_key=True),
                       db.Column('exercise_id', db.Integer, db.ForeignKey('exercise.id'), primary_key=True)
                       )


class Exercise(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(50), unique=True, nullable=False)
    explanation = db.Column(db.Text, nullable=False)
    question = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.Enum(Difficulty), nullable=False)
    scope = db.Column(db.Enum(Scope), nullable=False)
    sample_solution = db.Column(db.Text, nullable=False)

    # TODO: uncomment these two lines when user data is ready
    # owner_id = db.Column(db.Integer, db.ForeignKey('account.id'), nullable=False)  # Exercise -> Account (many-to-one)
    # owner = db.relationship('Account')  # Exercise -> Account (many-to-one)

    tags = db.relationship('Tag', secondary=tags_helper)  # Exercise -> Tag (many-to-many)


class Submission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)

    exercise_id = db.Column(db.Integer, db.ForeignKey('exercise.id'),
                            nullable=False)  # Submission -> Exercise (many-to-one)
    exercise = db.relationship('Exercise')  # Submission -> Exercise (many-to-one)

    account_id = db.Column(db.Integer, db.ForeignKey('account.id'),
                           nullable=False)  # Submission -> Account (many-to-one)
    account = db.relationship('Account')  # Submission -> Account (many-to-one)

    grade_id = db.Column(db.Integer, db.ForeignKey('grade.id'), nullable=False)  # Submission <- Grade (one-to-one)
    grade = db.relationship('Grade', back_populates='submission')  # Submission <- Grade (one-to-one)


class Grade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Enum(Score))
    submission = db.relationship('Submission', back_populates='grade',
                                 uselist=False)  # Grade -> Submission (one-to-one)

    # TODO: not sure if this is the right way for statistics
    statistics = db.relationship('Statistic')  # Grade -> Statistic (one-to-many)
