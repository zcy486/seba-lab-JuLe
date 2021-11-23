from sqlalchemy import Column, Integer, String, Enum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from db import Base
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


class StatisticType(Base):
    __tablename__ = 'statistic_types'
    id = Column(Integer, primary_key=True)
    title = Column(String(50), unique=True)
    description = Column(String(140), unique=False)

    def __init__(self, title, description):
        self.title = title
        self.description = description

    def __repr__(self):
        return f'<Statistic {self.title!r}>'

class Statistic(Base):
    __tablename__ = 'statistics'
    id = Column(Integer, primary_key=True)
    statistic_type_id = Column(Integer, foreign_key=True)
    exercise_id = Column(Integer, foreign_key=True)
    submission_value = Column(Integer)

    def __init__(self, statistic_type_id, exercise_id, submission_value):
        self.statistic_type_id = statistic_type_id
        self.exercise_id = exercise_id
        self.submission_value = submission_value

    def __repr__(self):
        return f'<Statistic {self.title!r}>'

class Auth(Base):
    __tablename__ = 'authentications'
    id = Column(Integer, primary_key=True)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(128), nullable=False)
    user = relationship('User', uselist=False)

    def __init__(self, email, password, user):
        self.email = email
        self.password = password
        self.user = user


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    role = Column(Enum(Role))
    last_login = Column(DateTime(timezone=True))
    register_time = Column(DateTime(timezone=True), server_default=func.now())
    university = relationship('University', uselist=False)

    def __init__(self, name, role, university):
        self.name = name
        self.role = role
        self.university = university

    def __repr__(self):
        return f'<User {self.name!r}>'


class University(Base):
    __tablename__ = 'universities'
    id = Column(Integer, primary_key=True)
    name = Column(String(80), unique=True, nullable=False)
    abbreviation = Column(String(20))
    logo_src = Column(String(140), nullable=True)

    def __init__(self, name, abbreviation, logo_src):
        self.name = name
        self.abbreviation = abbreviation
        self.logo_src = logo_src

    def __repr__(self):
        return f'<University {self.name!r}>'


class Tag(Base):
    __tablename__ = 'tags'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    amount = Column(Integer, nullable=False)

    def __init__(self, name):
        self.name = name
        self.amount = 1

    def __repr__(self):
        return f'<Tag {self.name!r}>'


class Exercise(Base):
    __tablename__ = 'exercises'
    id = Column(Integer, primary_key=True)
    title = Column(String(50), unique=True, nullable=False)
    text = Column(String(1500), nullable=False)
    sample_solution = Column(String(1500))
    difficulty = Column(Enum(Difficulty))
    scope = Column(Enum(Scope))
    tags = relationship('Tag')

    def __init__(self, title, text, sample_solution, difficulty, scope, tags):
        self.title = title
        self.text = text
        self.sample_solution = sample_solution
        self.difficulty = difficulty
        self.scope = scope
        self.tags = tags

    def __repr__(self):
        return f'<Exercise {self.title!r}>'


class Submission(Base):
    __tablename__ = 'submissions'
    id = Column(Integer, primary_key=True)
    text = Column(String(1500), nullable=False)
    exercise = Column('Exercise', uselist=False)
    user = relationship('User', uselist=False)

    def __init__(self, text, exercise, user):
        self.text = text
        self.exercise = exercise
        self.user = user


class Grade(Base):
    __tablename__ = 'grades'
    id = Column(Integer, primary_key=True)
    score = Column(Enum(Score))
    submission = relationship('Submission', uselist=False)
    statistics = relationship('Statistic')  # TODO: not sure if this is the right way for statistics

    def __init__(self, score, submission, statistics):
        self.score = score
        self.submission = submission
        self.statistics = statistics
