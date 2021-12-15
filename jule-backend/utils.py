import re
import datetime

def validate_email(email):
    if (re.search('^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$',email)):
        return True
    else:
        return False

# TODO validate passwords for requirements
def validate_password(password):
    return True

def get_expire_date_jwt_auth():
    return datetime.datetime.utcnow() + datetime.timedelta(days=1)

def get_expire_date_jwt_email():
    return datetime.datetime.utcnow() + datetime.timedelta(hours=1)