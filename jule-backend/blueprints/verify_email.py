import datetime
import jwt
import time
from flask import Blueprint
from flask import request
from flask.json import jsonify

from ..app import db
from ..config import TOKEN_IS_MISSING, JWT_SECRET_KEY_EMAIL_VERIFY, TOKEN_HAS_EXPIRED, TOKEN_IS_INVALID, \
    JWT_SECRET_KEY, BAD_REQUEST
from ..models import Account, University
from ..schemas import AccountSchema, UniversitySchema
from ..utils import get_expire_date_jwt_auth

verify_email_routes = Blueprint('verify_email', __name__, url_prefix="/verify_email")

# Schemas
account_schema = AccountSchema()
university_schema = UniversitySchema()


@verify_email_routes.route('/', methods=['GET'])
def index():
    try:
        jwt_token = None

        if 'x-access-token' in request.headers:
            jwt_token = request.headers['x-access-token']

        if not jwt_token:
            return jsonify({'message': TOKEN_IS_MISSING['message']}), TOKEN_IS_MISSING['status_code']

        try:
            data = jwt.decode(jwt_token, JWT_SECRET_KEY_EMAIL_VERIFY, algorithms=["HS256"],
                              options={'verify_exp': False})
        except jwt.exceptions.InvalidTokenError:
            return jsonify({'message': TOKEN_IS_INVALID['message']}), TOKEN_IS_INVALID['status_code']
        print(data)
        
        # Check for expired token
        current_date = time.time()
        if float(data['exp']) < current_date:
            # delete account from database, since the token is expired and an email-verification is no longer possible
            query_account = Account.query.filter_by(id=data['id']).first()  # query first for SQLAlchemy to cascade
            db.session.delete(query_account)
            db.session.commit()
            return jsonify({'message': TOKEN_HAS_EXPIRED['message']}), TOKEN_HAS_EXPIRED['status_code']

        # Setting Account's email address to verified
        query_account = Account.query.filter_by(id=data['id']).first()
        query_account.is_verified = True
        # Updating last-login
        query_account.last_login = datetime.datetime.utcnow()
        db.session.commit()

        # Creating new JWT Token, used for authentication
        expire_date = get_expire_date_jwt_auth()
        jwt_token_auth = jwt.encode(
            {'id': query_account.id, 'email': query_account.email, 'exp': expire_date, 'is_verified': True},
            JWT_SECRET_KEY)

        # Building Response
        account_object = account_schema.dump(query_account)
        university_object = University.query.filter_by(id=query_account.university_id).first()
        university_response = university_schema.dump(university_object)
        account_object['university'] = university_response
        # Adding JWT Token to Response
        account_object['jwtToken'] = jwt_token_auth

        return jsonify(account_object)
    except Exception as N:
        print("bad request:" + str(N))
        return jsonify({'message': BAD_REQUEST['message']}), BAD_REQUEST['status_code']
