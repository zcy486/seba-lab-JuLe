from flask import Blueprint, request, current_app, render_template
from flask.wrappers import Response
from jule_backend_app.app import db
from jule_backend_app.schemas import AccountSchema, UniversitySchema
from jule_backend_app.models import Account
from werkzeug.security import generate_password_hash
from flask_mail import Mail, Message
from threading import Thread
import datetime
from jule_backend_app.config import JWT_SECRET_KEY_EMAILVERIFY
import jwt

register_routes = Blueprint('register', __name__, url_prefix="/register")

# Schemas
account_schema = AccountSchema()
university_schema = UniversitySchema()

def send_async_email(app, email, jwt_token):
    with app.app_context():
        print('now sending confirm mail async')
        link = 'http://localhost:3000/confirm-email?token=' + jwt_token
        msg = Message(  subject='Please Verify Your Email Address',
                        recipients=[email],
                        sender='JuLe <no-reply@jule.de>',
                        # line below is for clients, which can not display html
                        body='In order to start using your JuLe account, you need to confirm your email address: ' + link + ' If you did not sign up for this account you can ignore this email and the account will be deleted.',
                        html=render_template('confirm_email.html', link = link, year = datetime.datetime.now().year))
        mail = Mail(app)
        # set below to 0 to disable log messages when sending mail
        app.extensions['mail'].debug = 1 # default is 1
        mail.send(msg)

@register_routes.route('/', methods=['POST'], strict_slashes=False)
def index():
    data = request.get_json()
    print('received the following data: ' + str(data))
    email = data['email']
    password = data['password']
    name = data['name']
    if 'role' not in data:
        role = 'student'
    else:
        role = request.json['role']
    if 'university' not in data:
        university_id = 0
    else:
        university_id = data['universityId']

    email_check = Account.query.filter_by(email=email).first()
    if email_check is not None:
        return Response(status=409) # Email exists

    # TODO add 406 Response for: The user input was not acceptable
    # not acceptable user input can occur, even if checked for in the frontend.

    # TODO check for password requirements

    new_account = Account(email=email, password=generate_password_hash(password, method='pbkdf2:sha1', salt_length=8), name=name, role=role, university_id=university_id)
    db.session.add(new_account)
    db.session.commit()
    # refreshing the account, to get the just assigned id
    db.session.refresh(new_account)

    # Generating JWT Token used for Email Verification
    expire_date = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    jwt_token = jwt.encode({'id':new_account.id, 'name':name, 'email':email, 'exp':expire_date, 'is_verified':False}, JWT_SECRET_KEY_EMAILVERIFY)
    # Sending email (in seperate thread)
    thr = Thread(target=send_async_email, args=[current_app._get_current_object(), email, jwt_token])
    thr.start()

    # TODO: The user has limited time to verify his account. Unverified accounts should be deleted after the time expires.
    # Create a postgres procedure that searches for unverified accounts and filters all rows with register time > 1 hour.
    # This procedure can then be executed periodically (multiple times per day) to delete these accounts.

    return Response(status=201) # New User Created
