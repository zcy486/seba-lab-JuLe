import json
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
    if 'text' in request.json and 'exerciseId' in request.json and 'anonymous' in request.json:
        text = request.json['text']
        exercise_id = request.json['exerciseId']
        anonymous = request.json['anonymous']
        exercise = Exercise.query.filter_by(id=exercise_id).first()
        if exercise is None:
            return abort(405, 'Exercise no longer exists!')

        poster = current_account
        new_discussion = Discussion(text=text, poster=poster, exercise=exercise, anonymous=anonymous)

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

    # update text of the discussion
    if request.method == 'POST':
        if 'text' in request.json:
            text = request.json['text']
            discussion.text = text

            db.session.commit()

            return jsonify(discussion_schema.dump(discussion))

        else:
            return abort(400, "Parameter missing from request.")

    # delete discussion
    elif request.method == 'DELETE':
        db.session.delete(discussion)
        db.session.commit()

        return jsonify({'message': 'successfully deleted'}), 200

    else:
        return abort(405, 'Method not allowed.')


@discussions_routes.route('/<discussion_id>/new_comment', methods=['POST'])
@require_authorization
def add_new_comment(current_account: Account, discussion_id):
    discussion = Discussion.query.filter_by(id=discussion_id).first()
    if discussion is None:
        return abort(405, 'No discussion found with matching id')

    if 'text' in request.json and 'anonymous' in request.json:
        comment_text = request.json['text']
        anonymous = request.json['anonymous']
        new_comment = Comment(text=comment_text, poster=current_account, anonymous=anonymous)
        discussion.comments.append(new_comment)

        db.session.add(new_comment)
        db.session.commit()

        return jsonify(discussion_schema.dump(discussion))

    else:
        return abort(400, "Parameter missing from request.")


@discussions_routes.route('/<discussion_id>/<comment_id>', methods=['DELETE'])
@require_authorization
def delete_comment(current_account: Account, discussion_id, comment_id):
    discussion = Discussion.query.filter_by(id=discussion_id).first()
    if discussion is None:
        return abort(405, 'No discussion found with matching id')

    comment = Comment.query.filter_by(id=comment_id).first()
    if comment is None:
        return abort(405, 'No comment found with matching id')

    db.session.delete(comment)
    db.session.commit()

    return jsonify(discussion_schema.dump(discussion))


@discussions_routes.route('/<discussion_id>/vote', methods=['GET', 'POST'])
@require_authorization
def vote_discussion(current_account: Account, discussion_id):
    discussion = Discussion.query.filter_by(id=discussion_id).first()
    if discussion is None:
        return abort(405, 'No discussion found with matching id')

    vote_exists = current_account in discussion.votes_by

    if request.method == 'GET':
        # returns whether current user has voted for the discussion
        return json.dumps(vote_exists)

    elif request.method == 'POST':
        if not vote_exists:
            discussion.votes_by.append(current_account)
            discussion.votes += 1

        # if vote already exists, cancel vote
        else:
            discussion.votes_by.remove(current_account)
            discussion.votes -= 1

        db.session.commit()
        return jsonify(discussion_schema.dump(discussion))

    else:
        return abort(405, 'Method not allowed.')


# method for comment, similar to vote_discussion
@discussions_routes.route('/<discussion_id>/<comment_id>/vote', methods=['GET', 'POST'])
@require_authorization
def vote_comment(current_account: Account, discussion_id, comment_id):
    discussion = Discussion.query.filter_by(id=discussion_id).first()
    if discussion is None:
        return abort(405, 'No discussion found with matching id')

    comment = Comment.query.filter_by(id=comment_id).first()
    if comment is None:
        return abort(405, 'No comment found with matching id')

    vote_exists = current_account in comment.votes_by

    if request.method == 'GET':
        # returns whether current user has vote for the comment
        return json.dumps(vote_exists)

    elif request.method == 'POST':
        if not vote_exists:
            comment.votes_by.append(current_account)
            comment.votes += 1

        # if vote already exists, cancel vote
        else:
            comment.votes_by.remove(current_account)
            comment.votes -= 1

        db.session.commit()
        return jsonify(discussion_schema.dump(discussion))

    else:
        return abort(405, 'Method not allowed.')
