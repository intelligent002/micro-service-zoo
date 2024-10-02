from fastapi import APIRouter
from strawberry.fastapi import GraphQLRouter

from app.services.graphql.schema import schema

router = APIRouter()
graphql_app = GraphQLRouter(schema)

# Register the GraphQL router
router.include_router(graphql_app, prefix="/graphql")
