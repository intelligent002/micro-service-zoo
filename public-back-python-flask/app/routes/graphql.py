from flask import Blueprint
from flask_graphql import GraphQLView
from app.graphql.schema import schema

routes_graphql = Blueprint('routes_graphql', __name__)

def format_error(error):
    """
    Define format for errors.
    """
    return {
        'message': error.message,
        'locations': error.locations,
        'path': error.path
    }

# Create the GraphQL view with GraphiQL disabled
routes_graphql.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        batch=True,  # Enable batch processing for GraphQL queries
        graphiql=True,  # Disable the GraphiQL interface for security purposes
        format_error=format_error  # Custom error handler
    ),
    methods=['GET', 'POST']  # Allow GET and POST requests for the GraphQL endpoint
)
