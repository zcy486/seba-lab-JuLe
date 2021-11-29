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
    email = request.args.get('email')
    password = request.args.get('password')
    name = request.args.get('name')
    role = request.args.get('role')
    university_id = request.args.get('university_id')
    new_account = Account(email=email, password=password, name=name, role=role, university_id=university_id)
    db.session.add(new_account)
    db.session.commit()
    db.session.refresh(new_account)
    response = account_schema.dump(new_account)
    response['university_id'] = new_account.university_id
    response.pop('password')
    return jsonify(response)
