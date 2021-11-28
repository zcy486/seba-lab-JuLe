from jule_backend_app.extensions import ma
from jule_backend_app import models


# Schemas
class StatisticSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.Statistic

class StatisticTypeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.StatisticType

class AuthSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.Auth


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.User


class UniversitySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.University


class TagSchema(ma.SQLAlchemySchema):
    class Meta:
        model = models.Tag

    name = ma.auto_field()


class ExerciseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.Exercise


class SubmissionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.Submission


class GradeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.Grade
