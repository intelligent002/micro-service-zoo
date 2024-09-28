from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.config import Config

# Create async engine
engine = create_async_engine(Config.DSN, echo=True, future=True)

# Create session factory with async support
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Base class for declarative models
Base = declarative_base()


# Dependency for FastAPI to get an async database session
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
