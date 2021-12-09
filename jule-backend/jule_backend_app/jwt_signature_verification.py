from flask import jsonify
from flask.globals import request
import jwt
from jule_backend_app.config import JWT_SECRET_KEY
from jule_backend_app.models import Account
from functools import wraps


def require_authorization(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        jwt_token = None

        if 'x-access-token' in request.headers:
            jwt_token = request.headers['x-access-token']

        if not jwt_token:
            return jsonify({'message' : 'Token is missing!'}), 401

        try:
            data = jwt.decode(jwt_token, JWT_SECRET_KEY, algorithms=["HS256"])
            # TODO return decoded token data
            current_account = Account.query.filter_by(id=data['id']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_account, *args, **kwargs)

    return decorated