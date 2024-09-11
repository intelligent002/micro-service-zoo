from flask import Blueprint
from flask_graphql import GraphQLView

from app.graphql.schema import schema

routes_graphql = Blueprint('routes_graphql', __name__)

routes_graphql.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True  # Enable GraphiQL interface for easy testing
    )
)
