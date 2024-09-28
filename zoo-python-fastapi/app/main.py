from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import index, health, graphql
from metrics import init_metrics

app = FastAPI(
    title="My FastAPI Project",
    description="A project demonstrating REST, GraphQL, CORS, and prometheus metrics",
    version="1.0.0",
    docs_url="/docs",  # URL for Swagger UI
    redoc_url="/redoc",  # URL for ReDoc UI
    openapi_url="/openapi.json"  # URL for OpenAPI schema
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

# Prometheus metrics
init_metrics(app)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
