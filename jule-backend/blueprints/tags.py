from typing import List
from flask import abort, Blueprint, jsonify

from ..app import db
from ..schemas import TagSchema
from ..models import Tag, Account
from ..jwt_signature_verification import require_authorization

# Tag blueprint used to register blueprint in app.py
tags_routes = Blueprint('tags', __name__, url_prefix="/tags")

# Schemas
tag_schema = TagSchema()  # For single tags
tags_schema = TagSchema(many=True)  # For lists of tags


# returns a list of all tags sorted by descending use_count (popularity)
@tags_routes.route('', methods=['GET'], strict_slashes=False)
@require_authorization
def read_tags(current_account: Account):
    try:
        query_tags = Tag.query.order_by(Tag.use_count).all()
        all_tags = query_tags

    except Exception as N:
        print(N)
        return abort(405)

    else:
        return jsonify(tags_schema.dump(all_tags))


# returns a single tag with matching id or throws error if no tag exists
@tags_routes.route('/<tag_id>', methods=['GET'])
@require_authorization
def read_tag(current_account: Account, tag_id: int):
    try:
        query_tag = Tag.query.filter_by(id=tag_id).first()
        if query_tag is None:
            raise Exception("No Tag with matching id")
        tag: Tag = query_tag

    except Exception as N:
        print(N)
        return abort(405)

    else:
        return tag_schema.dump(tag)


# helper functions not exposed to REST API
# creates a new tag and stores it in db returns tag that was created in db throws error if tag already exists
def create_tag(tag_name: str) -> Tag:
    try:
        new_tag = Tag(name=tag_name, use_count=1)
        db.session.add(new_tag)
        db.session.commit()
        db.session.refresh(new_tag)
        tag: Tag = new_tag

    except Exception as N:
        print(N)

    else:
        return tag


# get a tag's id from its name
def get_tag_id_from_name(tag_name: str):
    tag = Tag.query.filter_by(name=tag_name).first()  # get first tag from db with matching name (should be unique)
    if tag is None:  # if there is no tag with matching name
        raise Exception("No tag with matching name")
    else:
        return tag.id


# increments use_count from tag and save in db
def increment_tag_use(tag_id: int):
    try:
        tag = Tag.query.get(tag_id)  # get first tag from sb with matching id (should be unique)
        if tag is None:  # if there is no tag with matching name
            raise Exception("No tag with matching name")
        else:
            tag.use_count += 1  # increment use_count
            db.session.commit()
    except:
        raise Exception("IncrementFailed")


# decrement use_count from tag and if use_count equals zero, delete tag
def decrement_tag_use(tag_id: int):
    try:
        tag = Tag.query.get(tag_id)  # get first tag from sb with matching id (should be unique)
        if tag is None:  # if there is no tag with matching name
            raise Exception("No tag with matching name")
        else:
            tag.use_count -= 1  # increment use_count
            if tag.use_count < 1:  # if a tag's use_count is less than 1
                db.session.delete(tag)
            db.session.commit()  # commit changes to tag to db
    except Exception as N:
        print(N)
        raise Exception("DecrementFailed")
