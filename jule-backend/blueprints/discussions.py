from flask import Blueprint, request, jsonify, abort
from ..extensions import db
from ..models import Account, Comment, Discussion, Exercise
from ..schemas import DiscussionSchema
from ..jwt_signature_verification import require_authorization

# Discussion blueprint used to register blueprint in app.py
discussions_routes = Blueprint('discussion', __name__, url_prefix='/discussions')

# Schemas
discussion_schema = DiscussionSchema()  # For single discussion
discussions_schema = DiscussionSchema(many=True)  # For list of discussions

per_page = 5  # number of discussions displayed per loading


@discussions_routes.route('/create', methods=['POST'])
@require_authorization
def create_discussion(current_account: Account):
    if 'text' in request.json and 'exerciseId' in request.json:
        text = request.json['text']
        exercise_id = request.json['exerciseId']
        exercise = Exercise.query.filter_by(id=exercise_id).first()
        if exercise is None:
            return abort(405, 'Exercise no longer exists!')

        poster = current_account
        new_discussion = Discussion(text=text, poster=poster, exercise=exercise)

        db.session.add(new_discussion)
        db.session.commit()

        return jsonify(discussion_schema.dump(new_discussion))

    else:
        return abort(400, "Parameter missing from request.")


@discussions_routes.route('/', methods=['GET'])
@require_authorization
def read_discussions(current_account: Account):
    exercise_id = request.args['exerciseId']
    order = request.args['order']
    page = request.args['page']

    if exercise_id is None or order is None or page is None:
        return abort(400, "Parameter missing from request.")

    order = int(order)
    page = int(page)

    # filter by exercise_id
    query = Discussion.query.filter_by(exercise_id=exercise_id)

    if order == 1:
        # sort discussions by creation time asc
        query = query.order_by(Discussion.creation_time)

    elif order == 2:
        # sort discussions by creation time desc
        query = query.order_by(Discussion.creation_time.desc())

    elif order == 3:
        # sort discussions by votes desc
        query = query.order_by(Discussion.votes.desc())

    discussions_per_page = query.paginate(page, per_page, error_out=False).items

    return jsonify(discussions_schema.dump(discussions_per_page))


@discussions_routes.route('/<discussion_id>', methods=['POST', 'DELETE'])
@require_authorization
def update_delete_discussion(current_account: Account, discussion_id):
    discussion = Discussion.query.filter_by(id=discussion_id).first()
    if discussion is None:
        return abort(405, 'No discussion found with matching id')

    if request.method == 'POST':
        # update text of the discussion
        if 'text' in request.json:
            text = request.json['text']
            discussion.text = text

            db.session.commit()

            return jsonify(discussion_schema.dump(discussion))

        else:
            return abort(400, "Parameter missing from request.")

    elif request.method == 'DELETE':
        # delete discussion
        related_comments = discussion.comments
        discussion.comments = []

        for comment in related_comments:
            db.session.delete(comment)

        db.session.delete(discussion)
        db.session.commit()

        return jsonify({'message': 'successfully deleted'}), 200


@discussions_routes.route('/<discussion_id>/new_comment', methods=['POST'])
@require_authorization
def add_new_comment(current_account: Account, discussion_id):
    discussion = Discussion.query.filter_by(id=discussion_id).first()
    if discussion is None:
        return abort(405, 'No discussion found with matching id')

    if 'text' in request.json:
        comment_text = request.json['text']
        new_comment = Comment(text=comment_text, poster=current_account, discussion_id=discussion_id)

        db.session.add(new_comment)
        db.session.commit()

        return jsonify(discussion_schema.dump(discussion))

    else:
        return abort(400, "Parameter missing from request.")

# TODO: more features to be added
