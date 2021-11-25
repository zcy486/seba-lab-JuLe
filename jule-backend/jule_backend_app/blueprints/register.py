from flask import Blueprint
from flask import request

register_routes = Blueprint('register', __name__, url_prefix="/register")


@register_routes.route('/', methods=['POST'])
def index():
    email = request.args.get('email')
    password = request.args.get('password')
    name = request.args.get('name')
    return "registration..." + name
