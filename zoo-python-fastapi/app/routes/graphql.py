from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from strawberry.fastapi import GraphQLRouter

from app.database import get_db
from app.services.graphql.schema import schema

router = APIRouter()

# Dependency injection for session in GraphQL context
async def get_context(session: AsyncSession = Depends(get_db)):
    return {"session": session}

# Add Strawberry GraphQL router to FastAPI
graphql_app = GraphQLRouter(schema, context_getter=get_context)

# Register the GraphQL router
router.include_router(graphql_app, prefix="/graphql")
