from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.logger import setup_logging



from app.database import sessionmanager
from app.metrics import init_metrics
from app.routes import index, health, graphql, schema


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Function that handles startup and shutdown events.
    To understand more, read https://fastapi.tiangolo.com/advanced/events/
    """
    yield
    if sessionmanager._engine is not None:
        # Close the DB connection
        await sessionmanager.close()

# Setup Logging
setup_logging()

# Setup FastAPI
app = FastAPI(
    lifespan=lifespan,
    title="My FastAPI Project",
    description="A project demonstrating REST, GraphQL, CORS, and prometheus metrics",
    version="1.0.0",
    docs_url="/graphql/docs",  # URL for Swagger UI
    redoc_url="/graphql/redoc",  # URL for ReDoc UI
    openapi_url="/graphql/openapi.json"  # URL for OpenAPI schema
)

# CORS settings
CORSMiddleware(
    app,
    allow_origins="*",
    allow_methods="*",
    allow_headers="*",
    allow_credentials=True,
    allow_origin_regex=None,
    expose_headers="*",
    max_age=600,
)

# Include routers for REST, health checks, and GraphQL
app.include_router(index.router, prefix="/graphql")
app.include_router(health.router, prefix="/graphql")
app.include_router(graphql.router, prefix="/graphql")
app.include_router(schema.router, prefix="/graphql")

# Prometheus metrics
init_metrics(app)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8001, reload=True)
