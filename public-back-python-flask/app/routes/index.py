from flask import Blueprint, jsonify

routes_index = Blueprint('routes_index', __name__)


@routes_index.route('/')
def index():
    """
    Root endpoint that returns a welcome message.
    """
    try:
        return jsonify({"message": "Welcome to GraphQL API for Projects and Tasks"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
