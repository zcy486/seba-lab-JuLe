from flask import Blueprint
from flask import request
from flask.json import jsonify
from jule_backend_app.app import db
from jule_backend_app.schemas import AccountSchema
from jule_backend_app.models import Account

register_routes = Blueprint('register', __name__, url_prefix="/register")

# Schemas
account_schema = AccountSchema()

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
    # TODO check for existing email, and give according error response
    new_account = Account(email=email, password=password, name=name, role=role, university_id=university_id)
    db.session.add(new_account)
    db.session.commit()
    db.session.refresh(new_account)
    response = account_schema.dump(new_account)
    response['university_id'] = new_account.university_id
    response.pop('password')
    return jsonify(response)
