"""
University API
---
To add new universities, directly add them to the database
"""

from typing import List
from flask import abort, Blueprint, jsonify

from jule_backend_app.app import db
from jule_backend_app.schemas import UniversitySchema
from jule_backend_app.models import University, Account
from jule_backend_app.jwt_signature_verification import require_authorization

# University blueprint used to register blueprint in app.py
universities_routes = Blueprint('universities', __name__, url_prefix="/universities")

# Schemas
university_schema = UniversitySchema()  # For single university
universities_schema = UniversitySchema(many=True)  # For lists of universities


# returns a list of all universities sorted by alphabetical
@universities_routes.route('', methods=['GET'], strict_slashes=False)
@require_authorization
def read_universities(current_account: Account):
    try:
        query_universities = University.query.all()
        mock_universities: List[University] = [
            University(id=1, name="Technische Universität München", logo_src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Logo_of_the_Technical_University_of_Munich.svg/816px-Logo_of_the_Technical_University_of_Munich.svg.png"),
            University(id=2, name="Ludwig Maximillian Universität München", logo_src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Gruen-logo_lmu2.svg/1200px-Gruen-logo_lmu2.svg.png")
        ]
        all_universities = query_universities

    except Exception as N:
        print(N)
        # TODO: make except less general
        return abort(405)

    else:
        return jsonify(universities_schema.dump(all_universities))


# returns a single university with matching id or throws error if no university exists
@universities_routes.route('/<university_id>', methods=['GET'])
@require_authorization
def read_university(current_account: Account, university_id: int):
    try:
        query_university = University.query.filter_by(id=university_id).first()
        if query_university is None:
            raise Exception("No University with matching id")
        university: University = query_university

    except Exception as N:
        print(N)
        # TODO: make except less general
        return abort(405)

    else:
        return university_schema.dump(university)


# helper functions not exposed to REST API

# creates a new university and stores it in db returns university that was
# created in db throws error if university already exists
def create_university(university_name: str) -> University:
    try:
        # TODO: make new university in db exception if university already exists
        new_university = University(name=university_name, use_count=1)
        db.session.add(new_university)
        db.session.commit()
        db.session.refresh(new_university)
        university: University = new_university

    except Exception as N:
        print(N)
        # TODO: make except less general

    else:
        return university


# get a university's id from its name
def get_university_id_from_name(university_name: str):
    # get first university from db with matching name (should be unique)
    university = University.query.filter_by(name=university_name).first()
    if university is None:  # if there is no university with matching name
        raise Exception("No university with matching name")
    else:
        return university.id
