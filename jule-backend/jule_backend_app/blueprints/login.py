from flask import Blueprint
from flask import request, abort
from flask.json import jsonify
from jule_backend_app.app import db
from jule_backend_app.schemas import AccountSchema
from jule_backend_app.models import Account

login_routes = Blueprint('login', __name__, url_prefix="/login")

# Schemas
account_schema = AccountSchema()

@login_routes.route('/', methods=['GET'])
def index():
    email = request.args.get('email')
    password = request.args.get('password')
    try:
        query_account = Account.query.filter_by(email=email).first()

        if (query_account is None):
            return "wrong email!"
        if (query_account.password != password):
            return "wrong password!"
        response = account_schema.dump(query_account)
        response.pop('password')
        return jsonify(response)
    except Exception as N:
        print(N)
        # TODO: make except less general
        return abort(405)