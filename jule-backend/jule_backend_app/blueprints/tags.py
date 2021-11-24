from flask import abort, Blueprint
from dataclasses import dataclass

from jule_backend_app.schemas import TagSchema

# Tag blueprint used to register blueprint in app.py
tags_routes = Blueprint('tags', __name__, url_prefix="/tags")

# Schemas
tag_schema = TagSchema()  # For single tags
tags_schema = TagSchema(many=True)  # For lists of tags


# Tag model
@dataclass
class Tag:
    id: int
    name: str
    use_count: int


# returns a list of all tags sorted by descending use_count (popularity)
@tags_routes.route('/', methods=['GET'])
def read_tags():
    try:
        # TODO: get all tags from db and replace mock tags
        mock_tags: list[Tag] = [Tag(1, "tag1", 1), Tag(2, "tag2", 2)]
        tags: list[Tag] = mock_tags
        tags.sort(reverse=True, key=lambda elem: elem.use_count)

    except:
        # TODO: make except less general
        return abort(405)

    else:
        return tags_schema.dump(tags)


# returns a single tag with matching id or throws error if no tag exists
@tags_routes.route('/<tag_id>', methods=['GET'])
def read_tag(tag_id: int):
    try:
        # TODO: get specific tag from db and replace mock tag
        mock_tag: Tag = Tag(1, "tag1", 1)
        tag: Tag = mock_tag

    except:
        # TODO: make except less general
        return abort(405)

    else:
        return tag_schema.dump(tag)


# creates a new tag and stores it in db returns tag that was created in db throws error if tag already exists
@tags_routes.route('/', methods=['POST'])
def create_tag():
    try:
        # TODO: create new tag in db fail if tag already exists
        mock_tag: Tag = Tag(1, "tag1", 1)
        tag: Tag = mock_tag

    except:
        # TODO: make except less general
        return abort(405)

    else:
        return tag_schema.dump(tag)


# helper functions not exposed to REST API
# increments use_count from tag
def increment_tag_use(tag_id: int):
    try:
        # TODO: increment tag in db and remove mock tag
        tag: Tag(1, "tag1", 1)
        return tag

    except:
        # TODO: make except less general
        raise Exception("IncrementFailed")


# decrement use_count from tag and if use_count equals zero, delete tag
def decrement_tag_use(tag_id: int):
    try:
        # TODO: decrement tag in db and remove mock tag
        tag: Tag(1, "tag1", 1)

        if tag.use_count < 1:
            # TODO: delete tag from db
            tag = None

        return tag
    except:
        # TODO: make except less general
        # TODO: add further exceptions for db errors / delete errors
        raise Exception("DecrementFailed")
