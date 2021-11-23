from jule_backend_app.extensions import db
from datetime import datetime
import enum


class Role(enum.Enum):
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
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), unique=True)
    description = db.Column(db.String(140), unique=False)


class Auth(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    user = db.relationship('User', uselist=False)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    role = db.Column(db.Enum(Role))
    last_login = db.Column(db.DateTime(timezone=True))
    register_time = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    university = db.relationship('University', uselist=False)


class University(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    abbreviation = db.Column(db.String(20))
    logo_src = db.Column(db.String(140), nullable=True)


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    amount = db.Column(db.Integer, nullable=False)


class Exercise(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), unique=True, nullable=False)
    text = db.Column(db.Text, nullable=False)
    sample_solution = db.Column(db.Text)
    difficulty = db.Column(db.Enum(Difficulty))
    scope = db.Column(db.Enum(Scope))
    tags = db.relationship('Tag')


class Submission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    exercise = db.Column('Exercise', uselist=False)
    user = db.relationship('User', uselist=False)


class Grade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Enum(Score))
    submission = db.relationship('Submission', uselist=False)
    statistics = db.relationship('Statistic')  # TODO: not sure if this is the right way for statistics
