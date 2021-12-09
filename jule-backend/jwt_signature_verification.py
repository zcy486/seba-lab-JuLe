from flask import jsonify
from flask.globals import request
import jwt
from config import JWT_SECRET_KEY
from models import Account
from functools import wraps
import time


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

            # Check for expired token
            current_date = time.time()
            if (float(data['exp']) < current_date):
                return jsonify({'message' : 'Token has expired!'}), 401

            current_account = Account.query.filter_by(id=data['id']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_account, *args, **kwargs)

    return decorated