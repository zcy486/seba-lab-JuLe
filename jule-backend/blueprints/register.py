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
    CLIENT_URL, NO_REPLY_EMAIL_ACCOUNT, BAD_REQUEST, PASSWORD_REQUIREMENTS
from ..models import Account
from ..schemas import AccountSchema, UniversitySchema
from ..utils import validate_email, validate_password, get_expire_date_jwt_email

register_routes = Blueprint('register', __name__, url_prefix="/register")

# Schemas
account_schema = AccountSchema()
university_schema = UniversitySchema()


@register_routes.route('/captcha/', methods=['POST'])
def captcha():
    captcha_value = request.get_json()['captchaValue']
    if captcha_value is None:
        return jsonify({'message': 'captcha value missing'}), 406

    # Sending request to Google
    google = 'https://www.google.com/recaptcha/api/siteverify'
    payload = {
        'secret': CAPTCHA_API_SECRET_KEY,
        'response': captcha_value,
        'remoteip': request.remote_addr,  # noqa
    }
    response = requests.post(google, data=payload)
    result = response.json()
    # Verification
    success = result['success']
    if success:
        return jsonify({'message': 'verify success'}), 200

    return jsonify({'message': 'verify fail'}), 409


def send_async_email(app, email, jwt_token):
    with app.app_context():
        print('now sending confirm mail async')
        link = CLIENT_URL + 'confirm-email?token=' + jwt_token
        msg = Message(subject='Please Verify Your Email Address',
                      recipients=[email],
                      sender=NO_REPLY_EMAIL_ACCOUNT,
                      # line below is for clients, which can not display html
                      body='In order to start using your JuLe account, you need to confirm your email address: '
                           + link + ' If you did not sign up for this account you can ignore this email '
                                    'and the account will be deleted.',
                      html=render_template('confirm_email.html', client_url=CLIENT_URL, link=link,
                                           year=datetime.datetime.now().year))
        mail = Mail(app)
        # set below to 0 to disable log messages when sending mail
        app.extensions['mail'].debug = 1  # default is 1
        mail.send(msg)


@register_routes.route('/', methods=['POST'], strict_slashes=False)
def index():
    try:
        data = request.get_json()
        print('received the following data: ' + str(data))
        email = data['email']

        if validate_email(email) is False:
            return jsonify({'message': EMAIL_INVALID['message']}), EMAIL_INVALID['status_code']

        password = data['password']

        if validate_password(password) is False:
            return jsonify({'message': PASSWORD_REQUIREMENTS['message']}), PASSWORD_REQUIREMENTS['status_code']

        name = data['name']
        if 'role' not in data:
            role = 'student'
        else:
            role = request.json['role']
        if 'universityId' not in data:
            university_id = 0
        else:
            university_id = data['universityId']

        email_check = Account.query.filter_by(email=email).first()
        if email_check is not None:
            return jsonify({'message': EMAIL_ALREADY_EXISTS['message']}), EMAIL_ALREADY_EXISTS['status_code']

        new_account = Account(email=email,
                              password=generate_password_hash(password, method='pbkdf2:sha1', salt_length=8), name=name,
                              role=role, university_id=university_id)
        db.session.add(new_account)
        db.session.commit()
        # refreshing the account, to get the just assigned id
        db.session.refresh(new_account)

        # Generating JWT Token used for Email Verification
        expire_date = get_expire_date_jwt_email()
        jwt_token = jwt.encode(
            {'id': new_account.id, 'name': name, 'email': email, 'exp': expire_date, 'is_verified': False},
            JWT_SECRET_KEY_EMAIL_VERIFY)
        # Sending email (in separate thread)
        # noinspection PyProtectedMember
        thr = Thread(target=send_async_email, args=[current_app._get_current_object(), email, jwt_token])
        thr.start()

        return jsonify({'message': 'user created'}), 201  # New User Created
    except Exception as N:
        print("bad request:" + str(N))
        return jsonify({'message': BAD_REQUEST['message']}), BAD_REQUEST['status_code']
