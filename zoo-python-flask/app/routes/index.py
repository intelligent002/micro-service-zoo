from flask import Blueprint, jsonify, current_app

route_index = Blueprint('routes_index', __name__)


@route_index.route('/', methods=['GET'])
def index():
    """
    Root endpoint that returns a welcome message.
    """
    try:
        return jsonify({"message": "Welcome to GraphQL API for Projects and Tasks"}), 200
    except Exception as e:
        current_app.logger.error(str(e))
        return jsonify({"error": "something gone wrong, examine the logs"}), 500
