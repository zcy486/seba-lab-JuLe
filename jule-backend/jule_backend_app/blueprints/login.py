from flask import Blueprint, Flask
from flask import request
from flask.helpers import make_response
from flask.json import jsonify
from flask.wrappers import Response
from jule_backend_app.schemas import AccountSchema, UniversitySchema
from jule_backend_app.models import Account, University
from jule_backend_app.config import JWT_SECRET_KEY
from werkzeug.security import check_password_hash
import jwt
import datetime

login_routes = Blueprint('login', __name__, url_prefix="/login")

# Schemas
account_schema = AccountSchema()
university_schema = UniversitySchema()


@login_routes.route('', methods=['POST'], strict_slashes=False)
def index():
    data = request.get_json()
    email = data['email']
    password = data['password']
    try:
        query_account = Account.query.filter_by(email=email).first()
        if query_account is None:
            return Response(status=401) # Wrong email
        if not check_password_hash(query_account.password, password):
            return Response(status=403) # Wrong password
        if (query_account.is_verified == False):
            return Response(status=409) # Account not verified
        # Generating JWT Token for User
        expire_date = datetime.datetime.utcnow() + datetime.timedelta(days=1)
        jwt_token = jwt.encode({'id':query_account.id, 'email':query_account.email, 'exp':expire_date, 'is_verified':True}, JWT_SECRET_KEY)

        # Building Response
        account_object = account_schema.dump(query_account)
        university_object = University.query.filter_by(id=query_account.university_id).first()
        university_response = university_schema.dump(university_object)
        account_object['university'] = university_response
        # Adding JWT Token to Response
        account_object['jwtToken'] = jwt_token
        return jsonify(account_object)
    except Exception as N:
        print("bad request:" + str(N))
        return Response(status=400)
