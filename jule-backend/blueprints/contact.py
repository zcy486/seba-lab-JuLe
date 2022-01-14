import datetime
import jwt
import requests
from threading import Thread

from flask import Blueprint, request, current_app, render_template
from flask.json import jsonify
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash

from ..app import db
from ..config import CAPTCHA_API_SECRET_KEY, EMAIL_INVALID, EMAIL_ALREADY_EXISTS, JWT_SECRET_KEY_EMAIL_VERIFY, \
    CLIENT_URL, CONTACT_EMAIL_ACCOUNT, ADMIN_EMAIL_ACCOUNT, BAD_REQUEST, PASSWORD_REQUIREMENTS
from ..models import Account
from ..schemas import AccountSchema, UniversitySchema
from ..utils import validate_email, validate_password, get_expire_date_jwt_email

contact_routes = Blueprint('contact', __name__, url_prefix="/contact")

# Schemas
account_schema = AccountSchema()
university_schema = UniversitySchema()


def send_async_email(app, sender, message):
    with app.app_context():
        print('now sending contact-us mail async')
        msg = Message(subject='Contact Us Page',
                      recipients=[ADMIN_EMAIL_ACCOUNT],
                      sender=CONTACT_EMAIL_ACCOUNT,
                      body='From: ' + sender + '\nMessage: ' + message)
        mail = Mail(app)
        # set below to 0 to disable log messages when sending mail
        app.extensions['mail'].debug = 1  # default is 1
        mail.send(msg)


@contact_routes.route('/', methods=['POST'], strict_slashes=False)
def index():
    try:
        data = request.get_json()
        print('received the following data: ' + str(data))
        email = data['email']

        if validate_email(email) is False:
            return jsonify({'message': EMAIL_INVALID['message']}), EMAIL_INVALID['status_code']

        # TODO: (security) check message and name for malicious input
        message = data['message']
        name = data['name']
        sender = name + '<' + email + '>'

        # Sending email (in separate thread)
        # noinspection PyProtectedMember
        thr = Thread(target=send_async_email, args=[current_app._get_current_object(), sender, message])
        thr.start()

        return jsonify({'message': 'email sent'}), 200  # OK
    except Exception as N:
        print("bad request:" + str(N))
        return jsonify({'message': BAD_REQUEST['message']}), BAD_REQUEST['status_code']
