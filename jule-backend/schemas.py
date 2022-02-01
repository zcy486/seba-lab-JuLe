from .extensions import ma
from .models import *


# Helper Schemas
def camelcase(s):
    parts = iter(s.split("_"))
    return next(parts) + "".join(i.title() for i in parts)


class CamelCaseSQLASchema(ma.SQLAlchemySchema):
    """
    Converts dumped data keys into camelCase and incoming data keys into snake_case
    https://marshmallow.readthedocs.io/en/latest/examples.html#inflection-camel-casing-keys
    """

    def on_bind_field(self, field_name, field_obj):
        field_obj.data_key = camelcase(field_name or field_obj.data_key)


# Schemas
class UniversitySchema(CamelCaseSQLASchema):
    class Meta:
        model = University
        load_instance = True

    name = ma.auto_field()
    abbreviation = ma.auto_field()
    logo_src = ma.auto_field()


class StatisticSchema(CamelCaseSQLASchema):
    class Meta:
        model = Statistic

    id = ma.auto_field()
    submission_value = ma.auto_field()
    statistic_type_id = ma.auto_field()
    exercise_id = ma.auto_field()
    submission_id = ma.auto_field()
    student_id = ma.auto_field()


class AccountSchema(CamelCaseSQLASchema):
    class Meta:
        model = Account
        load_instance = True

    id = ma.auto_field()
    email = ma.auto_field()
    name = ma.auto_field()
    role = ma.auto_field()
    last_login = ma.auto_field()
    register_time = ma.auto_field()
    university = ma.Nested(UniversitySchema)
    university_id = ma.auto_field()
    is_verified = ma.auto_field()
    password = ma.auto_field()


class UserSchema(CamelCaseSQLASchema):
    class Meta:
        model = Account

    id = ma.auto_field()
    name = ma.auto_field()
    role = ma.auto_field()
    university = ma.Nested(UniversitySchema)


class TagSchema(CamelCaseSQLASchema):
    class Meta:
        model = Tag

    id = ma.auto_field()
    name = ma.auto_field()


class NerTagSchema(CamelCaseSQLASchema):
    class Meta:
        model = NerTag

    label = ma.auto_field()
    start = ma.auto_field()
    end = ma.auto_field()
    explanation = ma.auto_field()


class ExerciseSchema(CamelCaseSQLASchema):
    class Meta:
        model = Exercise

    id = ma.auto_field()
    title = ma.auto_field()
    explanation = ma.auto_field()
    question = ma.auto_field()
    ner_tags = ma.Nested(NerTagSchema, many=True)
    difficulty = ma.auto_field()
    scope = ma.auto_field()
    sample_solution = ma.auto_field()
    tags = ma.Nested(TagSchema, many=True)  # list of tags
    owner = ma.Nested(UserSchema)


class SubmissionSchema(CamelCaseSQLASchema):
    class Meta:
        model = Submission

    id = ma.auto_field()
    text = ma.auto_field()
    exercise_id = ma.auto_field()
    account_id = ma.auto_field()


class GradeSchema(CamelCaseSQLASchema):
    class Meta:
        model = Grade

    id = ma.auto_field()
    student_id = ma.auto_field()
    submission_id = ma.auto_field()
    exercise_id = ma.auto_field()
    score = ma.auto_field()


class StatisticTypeSchema(CamelCaseSQLASchema):
    class Meta:
        model = StatisticType

    id = ma.auto_field()
    title = ma.auto_field()
    description = ma.auto_field()


class CommentSchema(CamelCaseSQLASchema):
    class Meta:
        model = Comment

    id = ma.auto_field()
    text = ma.auto_field()
    poster = ma.Nested(UserSchema)
    creation_time = ma.auto_field()
    votes = ma.auto_field()
    anonymous = ma.auto_field()


class DiscussionSchema(CamelCaseSQLASchema):
    class Meta:
        model = Discussion

    id = ma.auto_field()
    text = ma.auto_field()
    poster = ma.Nested(UserSchema)
    creation_time = ma.auto_field()
    comments = ma.Nested(CommentSchema, many=True)  # list of comments
    votes = ma.auto_field()
    anonymous = ma.auto_field()
