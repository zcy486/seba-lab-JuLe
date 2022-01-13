import re
import datetime
from config import SECRET_KEY_EXPIRES, SECRET_KEY_EMAIL_EXPIRES

def validate_email(email):
    if (re.search('^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$',email)):
        return True
    else:
        return False

# TODO validate passwords for requirements
def validate_password(password):
    return True

def get_expire_date_jwt_auth():
    return datetime.datetime.utcnow() + datetime.timedelta(hours=SECRET_KEY_EXPIRES)

def get_expire_date_jwt_email(for_deleting=False):
    if for_deleting:
        return datetime.datetime.utcnow() - datetime.timedelta(hours=SECRET_KEY_EMAIL_EXPIRES)
    else:
        return datetime.datetime.utcnow() + datetime.timedelta(hours=SECRET_KEY_EMAIL_EXPIRES)