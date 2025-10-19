from flask import Blueprint
from flask_graphql import GraphQLView

from app.graphql.schema import schema

route_graphql = Blueprint('routes_graphql', __name__)

# Custom error formatter
def custom_format_error(error):
    """
    Define format for GraphQL errors.
    """
    formatted_error = {
        'message': str(error),
        'locations': [
            {
                'line': loc.line,
                'column': loc.column
            } for loc in getattr(error, 'locations', [])
        ] if getattr(error, 'locations', None) else None,
        'path': getattr(error, 'path', None)
    }
    return formatted_error

# Create the GraphQL view with GraphiQL disabled
route_graphql.add_url_rule(
    '/',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        batch=False,  # Enable batch processing for GraphQL queries
        graphiql=True,  # Disable the GraphiQL interface for security purposes
        format_error=custom_format_error    # Custom error handler
    ),
    methods=['GET', 'POST']  # Allow GET and POST requests for the GraphQL endpoint
)
