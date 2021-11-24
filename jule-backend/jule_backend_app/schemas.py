from jule_backend_app.extensions import ma
from jule_backend_app import models


# Schemas
class StatisticSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.Statistic


class AuthSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.Auth


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.User


class UniversitySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.University


class TagSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.Tag


class ExerciseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.Exercise


class SubmissionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.Submission


class GradeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.Grade
