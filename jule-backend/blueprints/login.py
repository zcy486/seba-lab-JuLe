import jwt, datetime
from flask import Blueprint, request
from flask.json import jsonify
from app import db
from schemas import AccountSchema, UniversitySchema
from models import Account, University
from config import EMAIL_INVALID, EMAIL_DOES_NOT_EXIST, PASSWORD_IS_WRONG, EMAIL_NOT_VERIFIED, JWT_SECRET_KEY, BAD_REQUEST
from utils import validate_email, get_expire_date_jwt_auth
from werkzeug.security import check_password_hash


login_routes = Blueprint('login', __name__, url_prefix="/login")

# Schemas
account_schema = AccountSchema()
university_schema = UniversitySchema()


@login_routes.route('', methods=['POST'], strict_slashes=False)
def index():
    data = request.get_json()
    email = data['email']

    if (validate_email(email) == False):
        return jsonify({'message': EMAIL_INVALID['message']}), EMAIL_INVALID['status_code']

    password = data['password']
    try:
        query_account = Account.query.filter_by(email=email).first()

        if query_account is None:
            return jsonify({'message': EMAIL_DOES_NOT_EXIST['message']}), EMAIL_DOES_NOT_EXIST['status_code']
        if not check_password_hash(query_account.password, password):
            return jsonify({'message': PASSWORD_IS_WRONG['message']}), PASSWORD_IS_WRONG['status_code']
        if (query_account.is_verified == False):
            return jsonify({'message': EMAIL_NOT_VERIFIED['message']}), EMAIL_NOT_VERIFIED['status_code']

        # Generating JWT Token for User
        expire_date = get_expire_date_jwt_auth()
        jwt_token = jwt.encode({'id':query_account.id, 'email':query_account.email, 'exp':expire_date, 'is_verified':True}, JWT_SECRET_KEY)

        # Updating last-login
        query_account.last_login = datetime.datetime.utcnow()
        db.session.commit()

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
        return jsonify({'message': BAD_REQUEST['message']}), BAD_REQUEST['status_code']
