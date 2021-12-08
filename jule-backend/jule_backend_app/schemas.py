from jule_backend_app.extensions import ma
from jule_backend_app import models


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
class StatisticSchema(CamelCaseSQLASchema):
    class Meta:
        model = models.Statistic


class AccountSchema(CamelCaseSQLASchema):
    class Meta:
        model = models.Account

    id = ma.auto_field()
    email = ma.auto_field()
    name = ma.auto_field()
    role = ma.auto_field()
    last_login = ma.auto_field()
    register_time = ma.auto_field()
    is_verified = ma.auto_field()


class UniversitySchema(CamelCaseSQLASchema):
    class Meta:
        model = models.University

    name = ma.auto_field()
    abbreviation = ma.auto_field()
    logo_src = ma.auto_field()


class TagSchema(CamelCaseSQLASchema):
    class Meta:
        model = models.Tag

    id = ma.auto_field()
    name = ma.auto_field()


class ExerciseSchema(CamelCaseSQLASchema):
    # a list of tags
    tags = ma.Nested(TagSchema, many=True)

    class Meta:
        model = models.Exercise

    id = ma.auto_field()
    title = ma.auto_field()
    explanation = ma.auto_field()
    question = ma.auto_field()
    difficulty = ma.auto_field()
    scope = ma.auto_field()
    sample_solution = ma.auto_field()


class SubmissionSchema(CamelCaseSQLASchema):
    class Meta:
        model = models.Submission


class GradeSchema(CamelCaseSQLASchema):
    class Meta:
        model = models.Grade
