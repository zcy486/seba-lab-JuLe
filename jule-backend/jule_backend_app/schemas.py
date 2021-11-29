from jule_backend_app.extensions import ma
from jule_backend_app import models


# Schemas
class StatisticSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.Statistic


class AccountSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.Account


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
