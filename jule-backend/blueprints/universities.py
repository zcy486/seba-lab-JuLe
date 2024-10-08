"""
University API
---
To add new universities, directly add them to the database
"""

from typing import List
from flask import abort, Blueprint, jsonify

from ..app import db
from ..schemas import UniversitySchema
from ..models import University

# University blueprint used to register blueprint in app.py
universities_routes = Blueprint('universities', __name__, url_prefix="/universities")

# Schemas
university_schema = UniversitySchema()  # For single university
universities_schema = UniversitySchema(many=True)  # For lists of universities


# returns a list of all universities sorted by alphabetical
@universities_routes.route('', methods=['GET'], strict_slashes=False)
def read_universities():
    try:
        query_universities = University.query.all()
        all_universities = query_universities

    except Exception as N:
        print(N)
        return abort(405)

    else:
        return jsonify(universities_schema.dump(all_universities))


# returns a single university with matching id or throws error if no university exists
@universities_routes.route('/<university_id>', methods=['GET'])
def read_university(university_id: int):
    try:
        query_university = University.query.filter_by(id=university_id).first()
        if query_university is None:
            raise Exception("No University with matching id")
        university: University = query_university

    except Exception as N:
        print(N)
        return abort(405)

    else:
        return university_schema.dump(university)


# helper functions not exposed to REST API

# creates a new university and stores it in db returns university that was
# created in db throws error if university already exists
def create_university(university_name: str) -> University:
    try:
        new_university = University(name=university_name, use_count=1)
        db.session.add(new_university)
        db.session.commit()
        db.session.refresh(new_university)
        university: University = new_university

    except Exception as N:
        print(N)

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
