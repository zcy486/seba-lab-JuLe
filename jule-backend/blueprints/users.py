from flask import Blueprint

from jule_backend_app.jwt_signature_verification import require_authorization
from jule_backend_app.models import Account
from jule_backend_app.schemas import UserSchema


# Account blueprint used to register blueprint in app.py
users_routes = Blueprint('users', __name__, url_prefix="/users")

# Schemas
user_schema = UserSchema()


@users_routes.route('/current', methods=['GET'], strict_slashes=False)
@require_authorization
def get_user_from_jwt(current_account: Account):

    return user_schema.dump(current_account)  # returns the current account associated to the jwt provided in header
