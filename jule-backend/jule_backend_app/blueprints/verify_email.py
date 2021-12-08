from flask import Blueprint
from flask import request
from jule_backend_app.app import db
from flask.json import jsonify
from flask.wrappers import Response
from jule_backend_app.schemas import AccountSchema, UniversitySchema
from jule_backend_app.models import Account, University
from jule_backend_app.config import JWT_SECRET_KEY, JWT_SECRET_KEY_EMAILVERIFY
import jwt, time, datetime

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
            return jsonify({'message' : 'Token is missing!'}), 401

        try:
            data = jwt.decode(jwt_token, JWT_SECRET_KEY_EMAILVERIFY, algorithms=["HS256"])
            print(data)
            # Check for expired token
            current_date = time.time()
            if (float(data['exp']) < current_date):
                return jsonify({'message' : 'Token has expired!'}), 401
            
            # Setting Account's email address to verified
            query_account = Account.query.filter_by(id=data['id']).first()
            query_account.is_verified = True
            db.session.commit()

            # Creating new JWT Token, which can be used for authentication!
            expire_date = datetime.datetime.utcnow() + datetime.timedelta(days=1)
            jwt_token_auth = jwt.encode({'id':query_account.id, 'email':query_account.email, 'exp':expire_date, 'is_verified':True}, JWT_SECRET_KEY)

            # Building Response
            account_object = account_schema.dump(query_account)
            university_object = University.query.filter_by(id=query_account.university_id).first()
            university_response = university_schema.dump(university_object)
            account_object['university'] = university_response
            # Adding JWT Token to Response
            account_object['jwtToken'] = jwt_token_auth
        except:
            return jsonify({'message' : 'Token is invalid!'}), 401
        return jsonify(account_object)
    except Exception as N:
        print("bad request:" + str(N))
        return Response(status=400)