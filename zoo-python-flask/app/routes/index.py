from flask import Blueprint, jsonify

route_index = Blueprint('routes_index', __name__)


@route_index.route('/', methods=['GET'])
def index():
    """
    Root endpoint that returns a welcome message.
    """
    try:
        return jsonify({"message": "Welcome to GraphQL API for Projects and Tasks"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
