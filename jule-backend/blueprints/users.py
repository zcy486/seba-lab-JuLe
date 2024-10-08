from flask import abort, Blueprint, jsonify

from ..jwt_signature_verification import require_authorization
from ..models import Account
from ..schemas import AccountSchema, UserSchema

# Account blueprint used to register blueprint in app.py
users_routes = Blueprint('users', __name__, url_prefix="/users")

# Schemas
user_schema = UserSchema()


@users_routes.route('/current', methods=['GET'], strict_slashes=False)
@require_authorization
def get_user_from_jwt(current_account: Account):
    return user_schema.dump(current_account)  # returns the current account associated to the jwt provided in header
