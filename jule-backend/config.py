LOAD_MOCK_DATA = True # If True, sets up DB with mock data

SQLALCHEMY_DATABASE_URI = "postgresql://postgres:UY6pWbv2KW8E8zxV@172.20.128.1/jule"  # noqa
SQLALCHEMY_TRACK_MODIFICATIONS = False

SECRET_KEY_EXPIRES = 24  # HOURS (how long to keep user signed in)
SECRET_KEY_EMAIL_EXPIRES = 1  # HOURS (how long the email link is valid)

JWT_SECRET_KEY = "A3C30D995A3D6A26E030D06C8B9133E11518CE07EAD70EDD8BCC7362CDE7181BF" \
                 "6B908039E199FFB6E1507F157DE56EE05B801639B6B5D42C13219BF5D5C95CB"
JWT_SECRET_KEY_EMAIL_VERIFY = "9EC6186C78806824D35799A2747C261FB4B860E4B90794D3DB23E6CC" \
                              "05D376C0D6139C3878EC9387C9053DD00A9504F1099EF1E4D4533A272E3371B949632142"
JWT_SECRET_KEY_RESET_PASSWORD = "741A30878C2F3E94D17324E0B9969219D6760ABA40EA4AC4EDE03156D39" \
                                "4B1780E4795BC916CB6F4231AC06223E4EA06545BE7BDC0F4C782565B8DBF826F7CE9"

MAIL_SERVER = "172.20.128.2"
MAIL_PORT = 25
MAIL_USE_TLS = False
MAIL_USE_SSL = False

CLIENT_URL = "https://jule.tk/"
NO_REPLY_EMAIL_ACCOUNT = "JuLe <no-reply@jule.tk>"  # Used for Email-Verification and Password-Reset
CONTACT_EMAIL_ACCOUNT = "JuLe Contact Form <contact-us@jule.tk>"  # Used for sending Contact Emails (contact-us form)
ADMIN_EMAIL_ACCOUNT = "alexander.maslew@gmail.com"  # Used for receiving Contact Emails

CAPTCHA_API_SECRET_KEY = "6LfJGDgdAAAAAEpRdXhWcsPPnIsXu0i4ovr-R15w"  # noqa

# Error Messages with HTTP Status Codes
BAD_REQUEST = {"message": "Could not understand the request due to invalid syntax", "status_code": 400}
EMAIL_DOES_NOT_EXIST = {"message": "This email address does not exist", "status_code": 432}
EMAIL_ALREADY_EXISTS = {"message": "This email address is already registered", "status_code": 433}
EMAIL_INVALID = {"message": "This email address is not valid", "status_code": 434}
EMAIL_NOT_VERIFIED = {"message": "This email address is not verified yet", "status_code": 435}
PASSWORD_IS_MISSING = {"message": "Password is missing", "status_code": 436}
PASSWORD_IS_WRONG = {"message": "Password is wrong", "status_code": 437}
PASSWORD_REQUIREMENTS = {"message": "Password does not meet the requirements", "status_code": 438}
TOKEN_IS_MISSING = {"message": "Token is missing", "status_code": 439}
TOKEN_IS_INVALID = {"message": "Token is invalid", "status_code": 440}
TOKEN_HAS_EXPIRED = {"message": "Token has expired", "status_code": 441}
