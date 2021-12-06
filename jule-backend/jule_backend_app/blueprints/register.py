from flask import Blueprint
from flask import request
from flask.wrappers import Response
from jule_backend_app.app import db
from jule_backend_app.schemas import AccountSchema, UniversitySchema
from jule_backend_app.models import Account
from werkzeug.security import generate_password_hash

register_routes = Blueprint('register', __name__, url_prefix="/register")

# Schemas
account_schema = AccountSchema()
university_schema = UniversitySchema()

@register_routes.route('/', methods=['POST'])
def index():
    data = request.get_json()
    print('received the following data: ' + str(data))
    email = data['email']
    password = data['password']
    name = data['name']
    if ('role' not in data):
        role = 'student'
    else:
        role = request.json['role']
    if ('university' not in data):
        university_id = 0
    else:
        university_id = 0 # TODO get the university_id (best way to achieve this is not decided yet)

    email_check = Account.query.filter_by(email=email).first()
    if (email_check is not None):
        return Response(status=409) # Email exists

    # TODO add 406 Response for: The user input was not acceptable
    # not acceptable user input can occur, even if checked for in the frontend.

    # TODO check for password requirements

    new_account = Account(email=email, password=generate_password_hash(password, method='pbkdf2:sha1', salt_length=8), name=name, role=role, university_id=university_id)
    db.session.add(new_account)
    db.session.commit()
    return Response(status=201) # New User Created
