import datetime, jwt, time
from flask import Blueprint, request, render_template, current_app
from flask.json import jsonify
from app import db
from config import PASSWORD_IS_MISSING, TOKEN_IS_MISSING, JWT_SECRET_KEY_RESETPASSWORD, TOKEN_HAS_EXPIRED, JWT_SECRET_KEY, TOKEN_IS_INVALID, BAD_REQUEST, EMAIL_INVALID, EMAIL_DOES_NOT_EXIST, EMAIL_NOT_VERIFIED, CLIENT_URL, EMAIL_ACCOUNT, PASSWORD_REQUIREMENTS
from utils import validate_email, validate_password, get_expire_date_jwt_auth, get_expire_date_jwt_email
from werkzeug.security import generate_password_hash
from models import Account, University
from flask_mail import Mail, Message
from threading import Thread
from schemas import AccountSchema, UniversitySchema


reset_password_routes = Blueprint('reset_password', __name__, url_prefix="/reset_password")

# Schemas
account_schema = AccountSchema()
university_schema = UniversitySchema()

def send_async_email(app, email, name, jwt_token):
    with app.app_context():
        print('now sending reset_password mail async')
        link = CLIENT_URL + 'reset-password?token=' + jwt_token
        msg = Message(  subject = 'Reset your JuLe password',
                        recipients = [email],
                        sender = EMAIL_ACCOUNT,
                        # line below is for clients, which can not display html
                        body = 'Hi ' + name + ', You recently requested to reset your JuLe account password. If you did not make this request, just ignore this email. Otherwise, please click the link to reset your password: ' + link,
                        html = render_template('reset_email.html', client_url = CLIENT_URL, link = link, name = name, year = datetime.datetime.now().year))
        mail = Mail(app)
        # set below to 0 to disable log messages when sending mail
        app.extensions['mail'].debug = 1 # default is 1
        mail.send(msg)


@reset_password_routes.route('/with_token/', methods=['POST'])
def withToken():
    try:
        data = request.get_json()
        print('received the following data: ' + str(data))
        password = data['password']

        if (password == None):
            return jsonify({'message': PASSWORD_IS_MISSING['message']}), PASSWORD_IS_MISSING['status_code']

        if (validate_password(password) == False):
            return jsonify({'message': PASSWORD_REQUIREMENTS['message']}), PASSWORD_REQUIREMENTS['status_code']

        jwt_reset_token = None

        if 'x-access-token' in request.headers:
            jwt_reset_token = request.headers['x-access-token']

        if not jwt_reset_token:
            return jsonify({'message': TOKEN_IS_MISSING['message']}), TOKEN_IS_MISSING['status_code']

        try:
            data = jwt.decode(jwt_reset_token, JWT_SECRET_KEY_RESETPASSWORD, algorithms=["HS256"], options={'verify_exp': False})
            print(data)
            # Check for expired token
            current_date = time.time()
            if float(data['exp']) < current_date:
                return jsonify({'message': TOKEN_HAS_EXPIRED['message']}), TOKEN_HAS_EXPIRED['status_code']

            # Setting Account's password
            query_account = Account.query.filter_by(id=data['id']).first()
            query_account.password = generate_password_hash(password, method='pbkdf2:sha1', salt_length=8)
            db.session.commit()

            # Creating new JWT Token, used for authentication
            expire_date = get_expire_date_jwt_auth()
            jwt_token_auth = jwt.encode(
                {'id': query_account.id, 'email': query_account.email, 'exp': expire_date, 'is_verified': query_account.is_verified},
                JWT_SECRET_KEY)

            # Building Response
            account_object = account_schema.dump(query_account)
            university_object = University.query.filter_by(id=query_account.university_id).first()
            university_response = university_schema.dump(university_object)
            account_object['university'] = university_response
            # Adding JWT Token to Response
            account_object['jwtToken'] = jwt_token_auth
        except:
            return jsonify({'message': TOKEN_IS_INVALID['message']}), TOKEN_IS_INVALID['status_code']
        return jsonify(account_object) # Password has been changed
    except Exception as N:
        print("bad request:" + str(N))
        return jsonify({'message': BAD_REQUEST['message']}), BAD_REQUEST['status_code']

@reset_password_routes.route('/', methods=['POST'])
def index():
    try:
        data = request.get_json()
        print('received the following data: ' + str(data))
        email = data['email']

        if (validate_email(email) == False):
            return jsonify({'message': EMAIL_INVALID['message']}), EMAIL_INVALID['status_code']
        
        # Getting user Account via Email address
        query_account = Account.query.filter_by(email=email).first()

        if (query_account == None):
            return jsonify({'message': EMAIL_DOES_NOT_EXIST['message']}), EMAIL_DOES_NOT_EXIST['status_code']

        if (query_account.is_verified == False):
            return jsonify({'message': EMAIL_NOT_VERIFIED['message']}), EMAIL_NOT_VERIFIED['status_code']

        # Generating JWT Token used for Resetting Password
        expire_date = get_expire_date_jwt_email()
        jwt_token = jwt.encode({'id':query_account.id, 'name':query_account.name, 'email':email, 'exp':expire_date, 'is_verified':query_account.is_verified}, JWT_SECRET_KEY_RESETPASSWORD)

        # Sending email (in seperate thread)
        thr = Thread(target=send_async_email, args=[current_app._get_current_object(), email, query_account.name, jwt_token])
        thr.start()

        return jsonify({'message': 'email sent'}), 201 # Email has been sent
    except Exception as N:
        print("bad request:" + str(N))
        return jsonify({'message': BAD_REQUEST['message']}), BAD_REQUEST['status_code']
