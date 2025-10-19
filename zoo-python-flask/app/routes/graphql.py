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
graphql_view = GraphQLView.as_view(
    'graphql',
    schema=schema,
    batch=False,           # Enable batch processing for GraphQL queries
    graphiql=True,         # Enable GraphiQL web UI
    format_error=custom_format_error
)

# Handle both /graphql and /graphql/ (Flask otherwise redirects one to the other)
route_graphql.add_url_rule('/', view_func=graphql_view, methods=['GET', 'POST'])
route_graphql.add_url_rule('',  view_func=graphql_view, methods=['GET', 'POST'])
