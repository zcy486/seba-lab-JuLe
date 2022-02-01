import datetime
import jwt
from flask import Blueprint, request
from flask.json import jsonify

from ..app import db
from ..config import BAD_REQUEST
from ..models import Account
from ..jwt_signature_verification import require_authorization


opt_out_email_routes = Blueprint('opt_out_email', __name__, url_prefix="/set_opt_out_email")


@opt_out_email_routes.route('', methods=['POST'], strict_slashes=False)
@require_authorization
def index(current_account: Account):
    data = request.get_json()
    option = data['option']
    try:
        query_account = Account.query.filter_by(id=current_account.id).first()
        if option == "true":
            query_account.email_opt_out = False
        else:
            query_account.email_opt_out = True
        db.session.commit()
        return jsonify({'message': 'updated'}), 200
    except Exception as N:
        print("bad request:" + str(N))
        return jsonify({'message': BAD_REQUEST['message']}), BAD_REQUEST['status_code']
