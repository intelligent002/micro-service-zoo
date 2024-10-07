from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import sessionmanager
from app.logger import setup_logging
from app.metrics import init_metrics
from app.routes import router_index, router_graphql, router_health, router_schema


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Function that handles startup and shutdown events.
    To understand more, read https://fastapi.tiangolo.com/advanced/events/
    """
    yield
    if await sessionmanager.engine is not None:
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
    docs_url="/swagger",  # URL for Swagger UI
    redoc_url="/redoc",  # URL for ReDoc UI
    openapi_url="/openapi.json"  # URL for OpenAPI schema
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to specific domains
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
    allow_credentials=True,  # Allow credentials (e.g., cookies) - will not work with wildcard origins
    expose_headers=["*"],  # Expose headers to frontend
    max_age=600,  # How long the results of a preflight request can be cached
)

# Include routers for REST, health checks, and GraphQL
app.include_router(router_index)
app.include_router(router_health)
app.include_router(router_graphql)
app.include_router(router_schema)

# Prometheus metrics
init_metrics(app)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8001, reload=True)
