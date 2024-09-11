from flask import Blueprint

routes_index = Blueprint('routes_index', __name__)

@routes_index.route('/')
def index():
    return "Welcome to GraphQL API for Projects and Tasks"
