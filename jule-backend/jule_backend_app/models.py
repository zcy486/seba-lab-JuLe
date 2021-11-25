from jule_backend_app.extensions import db
from datetime import datetime
import enum


# Please refer to these two pages:
# https://docs.sqlalchemy.org/en/14/orm/basic_relationships.html
# https://flask-sqlalchemy.palletsprojects.com/en/2.x/models/

class Role(enum.IntEnum):
    student = 1
    lecturer = 2


class Scope(enum.Enum):
    draft = 1
    internal = 2
    public = 3


class Difficulty(enum.Enum):
    easy = 1
    medium = 2
    hard = 3


class Score(enum.Enum):
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


class Auth(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)

    user = db.relationship('User', back_populates='auth', uselist=False)  # Auth -> User (one-to-one)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    role = db.Column(db.Enum(Role))
    last_login = db.Column(db.DateTime(timezone=True))
    register_time = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)

    university_id = db.Column(db.Integer, db.ForeignKey('university.id'), nullable=False)  # User -> University (one-to-one)
    university = db.relationship('University', back_populates='user', uselist=False)  # User -> University (one-to-one)

    auth_id = db.Column(db.Integer, db.ForeignKey('auth.id'), nullable=False)  # Auth <- User (one-to-one)
    auth = db.relationship('Auth', back_populates='user')  # Auth <- User (one-to-one)


class University(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    abbreviation = db.Column(db.String(20))
    logo_src = db.Column(db.String(140), nullable=True)

    user = db.relationship('User', back_populates='university', uselist=False)  # University -> User (one-to-one)


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
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), unique=True, nullable=False)
    text = db.Column(db.Text, nullable=False)
    sample_solution = db.Column(db.Text)
    difficulty = db.Column(db.Enum(Difficulty))
    scope = db.Column(db.Enum(Scope))

    tags = db.relationship('Tag', secondary=tags_helper)  # Exercise -> Tag (many-to-many)


class Submission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)

    exercise_id = db.Column(db.Integer, db.ForeignKey('exercise.id'),
                            nullable=False)  # Submission -> Exercise (many-to-one)
    exercise = db.relationship('Exercise')  # Submission -> Exercise (many-to-one)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Submission -> User (many-to-one)
    user = db.relationship('User')  # Submission -> User (many-to-one)

    grade_id = db.Column(db.Integer, db.ForeignKey('grade.id'), nullable=False)  # Submission <- Grade (one-to-one)
    grade = db.relationship('Grade', back_populates='submission')  # Submission <- Grade (one-to-one)


class Grade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Enum(Score))
    submission = db.relationship('Submission', back_populates='grade',
                                 uselist=False)  # Grade -> Submission (one-to-one)

    # TODO: not sure if this is the right way for statistics
    statistics = db.relationship('Statistic')  # Grade -> Statistic (one-to-many)
