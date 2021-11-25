from flask import Blueprint
from flask import request
from flask.json import jsonify
from jule_backend_app.app import db
from jule_backend_app.schemas import AuthSchema, UserSchema, UniversitySchema
from jule_backend_app.models import Auth, User, University

register_routes = Blueprint('register', __name__, url_prefix="/register")

# Schemas
auth_schema = AuthSchema()
user_schema = UserSchema()
uni_schema = UniversitySchema()

@register_routes.route('/', methods=['POST'])
def index():
    email = request.args.get('email')
    password = request.args.get('password')
    name = request.args.get('name')
    role = request.args.get('role')
    university_id = request.args.get('university_id')
    new_auth = Auth(email=email, password=password)
    db.session.add(new_auth)
    db.session.commit()
    db.session.refresh(new_auth)
    new_user = User(name=name, role=role, auth_id=new_auth.id, university_id=university_id)
    db.session.add(new_user)
    db.session.commit()
    db.session.refresh(new_user)
    response = user_schema.dump(new_user)
    response['university_id'] = new_user.university_id
    response['auth_id'] = new_user.auth_id
    return jsonify(response)
