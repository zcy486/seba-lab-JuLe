import datetime
import sys
from sqlalchemy import and_, text
from .config import EMAIL_RECOMMENDATION_LIMIT, NO_REPLY_EMAIL_ACCOUNT, CLIENT_URL
from .app import db
from threading import Thread
from flask_mail import Mail, Message


# noinspection SpellCheckingInspection
def render_html(account, exercises_to_recommend):
    current_year = datetime.datetime.now().year
    body = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" " \
           "\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n" \
           "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n" \
           "<head>\n" \
           "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\"/>\n" \
           "</head>\n" \
           "<body leftmargin=\"0\" marginwidth=\"0\" topmargin=\"0\" marginheight=\"0\" offset=\"0\" " \
           "style=\"margin: 0pt auto; padding: 0px; background:#F4F7FA;\">\n" \
           "<table id=\"main\" width=\"100%\" height=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"" \
           " bgcolor=\"#F4F7FA\">\n" \
           "<tbody>\n" \
           "<tr>\n" \
           "<td valign=\"top\">\n" \
           "<table class=\"innermain\" cellpadding=\"0\" width=\"580\" cellspacing=\"0\" border=\"0\" " \
           "bgcolor=\"#F4F7FA\" align=\"center\" style=\"margin:0 auto; table-layout: fixed;\">\n" \
           "<tbody>\n" \
           "<!-- START of MAIL Content -->\n" \
           "<tr>\n" \
           "<td colspan=\"4\">\n" \
           "<!-- Logo start here -->\n" \
           "<table class=\"logo\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" \
           "<tbody>\n" \
           "<tr>\n" \
           "<td colspan=\"2\" height=\"30\"></td>\n" \
           "</tr>\n" \
           "<tr>\n" \
           "<td valign=\"top\" align=\"center\">\n" \
           "<a href=\"" + CLIENT_URL + "\" style=\"display:inline-block; cursor:pointer; text-align:center;\">\n" \
           "<img src=\"" + CLIENT_URL + "images/jule.png\" height=\"36\" width=\"117\" border=\"0\" alt=\"JuLe\"/>\n" \
           "</a>\n" \
           "</td>\n" \
           "</tr>\n" \
           "<tr>\n" \
           "<td colspan=\"2\" height=\"30\"></td>\n" \
           "</tr>\n" \
           "</tbody>\n" \
           "</table>\n" \
           "<!-- Logo end here -->\n" \
           "<!-- Main CONTENT -->\n" \
           "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" bgcolor=\"#ffffff\" " \
                                       "style=\"border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);\">\n" \
           "<tbody>\n" \
           "<tr>\n" \
           "<td height=\"40\"></td>\n" \
           "</tr>\n" \
           "<tr style=\"font-family: -apple-system,BlinkMacSystemFont,&#39;Segoe UI&#39;,&#39;Roboto&#39;,&#39;" \
                                       "Oxygen&#39;,&#39;Ubuntu&#39;,&#39;Cantarell&#39;,&#39;Fira Sans&#39;,&#39;" \
                                       "Droid Sans&#39;,&#39;Helvetica Neue&#39;,sans-serif; color:#4E5C6E; " \
                                       "font-size:14px; line-height:20px; margin-top:20px;\">\n" \
           "<td class=\"content\" colspan=\"2\" valign=\"top\" align=\"center\" style=\"padding-left:90px; " \
                                       "padding-right:90px;\">\n" \
           "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" bgcolor=\"#ffffff\">\n" \
           "<tbody>\n" \
           "<tr>\n" \
           "<td align=\"center\" valign=\"bottom\" colspan=\"2\" cellpadding=\"3\">\n" \
           "<img alt=\"JuLe\" width=\"80\" src=\"" + CLIENT_URL + "images/icon_recommendation.png\"/>\n" \
           "</td>\n" \
           "</tr>\n" \
           "<tr>\n" \
           "<td height=\"30\" &nbsp;=\"\"></td>\n" \
           "</tr>\n" \
           "<tr>\n" \
           "<td align=\"center\">\n" \
           "<span style=\"color:#48545d;font-size:22px;line-height: 24px;\">Hello " + account['name'] + \
           ",<br>Please check out " + str(len(exercises_to_recommend)) + \
           " exercise recommendations just for you</span>\n" \
           "</td>\n" \
           "</tr>\n" \
           "<tr>\n" \
           "<td height=\"24\" &nbsp;=\"\"></td>\n" \
           "</tr>\n"

    for exercise in exercises_to_recommend:
        if exercise['times_completed'] > 0:
            message = "The exercise \"" + exercise['title'] + "\" created by " + exercise['author'] + " with " \
                      + exercise['difficulty'] + " difficulty has been completed " + str(exercise['times_completed']) \
                      + " times so far"
        else:
            message = "The exercise \"" + exercise['title'] + "\" created by " + exercise['author'] + " with " \
                      + exercise['difficulty'] + " difficulty has not been completed so far"
        body += "<tr>\n" \
                "<td height=\"1\" bgcolor=\"#DAE1E9\"></td>\n" \
                "</tr>\n" \
                "<tr>\n" \
                "<td height=\"24\" &nbsp;=\"\"></td>\n" \
                "</tr>\n" \
                "<tr>\n" \
                "<td align=\"center\">\n" \
                "<span style=\"color:#48545d;font-size:14px;line-height:24px;\">\n" + message + "\n</span>\n" \
                "</td>\n" \
                "</tr>\n" \
                "<tr>\n" \
                "<td height=\"20\" &nbsp;=\"\"></td>\n" \
                "</tr>\n" \
                "<tr>\n" \
                "<td valign=\"top\" width=\"48%\" align=\"center\">\n" \
                "<span>\n" \
                "<a href=\"" + CLIENT_URL + "exercises/" + str(exercise['id']) + \
                "\" style=\"display:block; padding:15px 25px; background-color:#1a76d2; color:#ffffff; " \
                "border-radius:3px; text-decoration:none;\">Solve " + exercise['title'] + "</a>\n" \
                "</span>\n" \
                "</td>\n" \
                "</tr>\n" \
                "<tr>\n" \
                "<tr>\n" \
                "<td height=\"24\" &nbsp;=\"\"></td>\n" \
                "</tr>\n"

    body += "<tr>\n" \
            "<td align=\"center\">\n" \
            "<img src=\"" + CLIENT_URL + "images/hr.png\" width=\"54\" height=\"2\" border=\"0\"/>\n" \
            "</td>\n" \
            "</tr>\n" \
            "<tr>\n" \
            "<td height=\"20\" &nbsp;=\"\"></td>\n" \
            "</tr>\n" \
            "<tr>\n" \
            "<td align=\"center\">\n" \
            "<p style=\"color:#a2a2a2; font-size:12px; line-height:17px; font-style:italic;\">\n" \
            "If you do not want to receive any more email recommendations, click <a href=\"" + CLIENT_URL + \
            "email-opt-out?email=" + account['email'] + \
            "\" target=\"_blank\" style=\"color:#9EB0C9 !important; text-decoration:none;\">here</a> to opt out.\n" \
            "</p>\n" \
            "</td>\n" \
            "</tr>\n" \
            "</tbody>\n" \
            "</table>\n" \
            "</td>\n" \
            "</tr>\n" \
            "<tr>\n" \
            "<td height=\"60\"></td>\n" \
            "</tr>\n" \
            "</tbody>\n" \
            "</table>\n" \
            "<!-- Main CONTENT end here -->\n" \
            "<!-- FOOTER start here -->\n" \
            "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" \
            "<tbody>\n" \
            "<tr>\n" \
            "<td height=\"10\">&nbsp;</td>\n" \
            "</tr>\n" \
            "<tr>\n" \
            "<td valign=\"top\" align=\"center\">\n" \
            "<span style=\"font-family: -apple-system,BlinkMacSystemFont,&#39;Segoe UI&#39;,&#39;Roboto&#39;,&#39;" \
            "Oxygen&#39;,&#39;Ubuntu&#39;,&#39;Cantarell&#39;,&#39;Fira Sans&#39;,&#39;Droid Sans&#39;,&#39;" \
            "Helvetica Neue&#39;,sans-serif; color:#9EB0C9; font-size:10px;\">&copy;\n" \
            "<a href=\"" + CLIENT_URL + "\" target=\"_blank\" style=\"color:#9EB0C9 !important; " \
                                        "text-decoration:none;\">JuLe</a> " + str(current_year) + "\n" \
            "</span>\n" \
            "</td>\n" \
            "</tr>\n" \
            "<tr>\n" \
            "<td height=\"50\">&nbsp;</td>\n" \
            "</tr>\n" \
            "</tbody>\n" \
            "</table>\n" \
            "<!-- FOOTER end here -->\n" \
            "</td>\n" \
            "</tr>\n" \
            "<!-- MAIL Content end here -->\n" \
            "</tbody>\n" \
            "</table>\n" \
            "</td>\n" \
            "</tr>\n" \
            "</tbody>\n" \
            "</table>\n" \
            "</body>\n" \
            "</html>"
    return body


def send_async_email(app, account, exercises_to_recommend):
    with app.app_context():
        print('now sending recommend exercises mail async for user ' + account['name'], flush=True)
        msg = Message(subject='JuLe Exercise Recommendations',
                      recipients=[account['email']],
                      sender=NO_REPLY_EMAIL_ACCOUNT,
                      body=str(len(exercises_to_recommend)) + ' new exercise recommendations just for you',
                      html=render_html(account, exercises_to_recommend))
        mail = Mail(app)
        # set below to 0 to disable log messages when sending mail
        app.extensions['mail'].debug = 1  # default is 1
        mail.send(msg)


def send_recommendation_emails_task(app):
    with app.app_context():
        print("Now sending recommendation emails", flush=True)
        # fetch all accounts that may receive emails
        accounts = db.engine.execute("select id, name, email, university_id from account "  # noqa
                                     "where email_opt_out = false and is_verified = true")
        for account in accounts:
            # exercises without the completed ones for account_id, only for user's university_id,
            # only with public scope and ordered by most completed (graded)
            exercises_query = db.engine.execute(
                text("select exercise.id, title, difficulty, name as author, count as times_completed "  # noqa
                     "from exercise join account on exercise.owner_id = account.id "
                     "join (select id, coalesce(max(count), 0) as count from exercise "
                     "left join (select exercise_id, count(*) from grade "
                     "group by exercise_id)t1 on exercise.id = t1.exercise_id "
                     "group by id, count)graded on exercise.id = graded.id "
                     "where exercise.scope = 'public' and university_id = :uni_id "
                     "and exercise.id not in (select id from submission "
                     "where account_id = :acc_id) order by count desc limit :limit"),
                {'uni_id': account['university_id'], 'acc_id': account['id'], 'limit': EMAIL_RECOMMENDATION_LIMIT})
            exercises_to_recommend = []
            for exercise in exercises_query:
                exercises_to_recommend.append(
                    {'id': exercise['id'], 'title': exercise['title'], 'difficulty': exercise['difficulty'],
                     'author': exercise['author'], 'times_completed': exercise['times_completed']})

            if len(exercises_to_recommend) > 0:
                print('exercises found for user ' + account['name'], flush=True)
                print(exercises_to_recommend, flush=True)
                # Sending email (in separate thread)
                thr = Thread(target=send_async_email, args=[app, account, exercises_to_recommend])
                thr.start()
            else:
                print('no exercises found for user ' + account['name'], flush=True)
