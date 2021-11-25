from flask import Blueprint
from flask import request, abort
from flask.json import jsonify
from jule_backend_app.app import db
from jule_backend_app.schemas import AuthSchema, UserSchema
from jule_backend_app.models import Auth, User

login_routes = Blueprint('login', __name__, url_prefix="/login")

# Schemas
auth_schema = AuthSchema()
user_schema = UserSchema()

@login_routes.route('/', methods=['GET'])
def index():
    email = request.args.get('email')
    password = request.args.get('password')
    try:
        query_auth = Auth.query.filter_by(email=email).first()
        if (query_auth.password != password):
            return "wrong password!"
        else:
            query_user = User.query.filter_by(auth_id=str(query_auth.id)).first()
            return jsonify(user_schema.dump(query_user))
    except Exception as N:
        print(N)
        # TODO: make except less general
        return abort(405)