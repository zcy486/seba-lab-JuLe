from flask import Blueprint
from flask import request
from flask.json import jsonify
from flask.wrappers import Response
from jule_backend_app.app import db
from jule_backend_app.schemas import AccountSchema, UniversitySchema
from jule_backend_app.models import Account, University
from werkzeug.security import check_password_hash

login_routes = Blueprint('login', __name__, url_prefix="/login")

# Schemas
account_schema = AccountSchema()
university_schema = UniversitySchema()

@login_routes.route('/', methods=['POST'])
def index():
    data = request.get_json()
    email = data['email']
    password = data['password']
    try:
        query_account = Account.query.filter_by(email=email).first()
        if (query_account is None):
            return Response(status=401) # Wrong email
        if (check_password_hash(query_account.password, password) == False):
            return Response(status=403) # Wrong password
        response = account_schema.dump(query_account)
        query_university = University.query.filter_by(id=query_account.university_id).first()
        university_response = university_schema.dump(query_university)
        response['university'] = university_response
        return jsonify(response)
    except Exception as N:
        print("bad request:" + N)
        return Response(status=400)