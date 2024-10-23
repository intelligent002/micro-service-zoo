import time
from typing import List, Optional

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.config import Config
from app.metrics import gql_duration, gql_counter, async_time_decorator
from app.models.sqlalchemy import Project as ProjectSQL, Task as TaskSQL
from app.models.strawberry import Project as ProjectSTR, Task as TaskSTR
from app.services.graphql.get_logger import get_logger


# Main GraphQL Query class where fields are defined as GraphQL query resolvers
@strawberry.type
class Query:

    # Field to query Projects
    @strawberry.field
    @async_time_decorator(gql_duration, {'environment': Config.ENVIRONMENT, 'request': 'Projects'})
    async def get_projects(
            self,
            info,  # GraphQL context, used to access FastAPI dependencies like DB session
            id: Optional[int] = None,  # Optional filter by project ID
            name: Optional[str] = None  # Optional filter by project name
    ) -> List[ProjectSTR]:
        # Initialize logger
        logger = get_logger()
        try:
            # Extract the SQLAlchemy session from the GraphQL context
            session: AsyncSession = info.context["session"]

            # Start building the query
            query = select(ProjectSQL)  # Select from ProjectModel table

            # Apply filters if provided
            if id:
                query = query.where(ProjectSQL.id == id)  # Filter by project ID

            if name:
                query = query.where(ProjectSQL.name.ilike(f"%{name}%"))  # Filter by project name (case-insensitive)

            # Log the SQL query for debugging purposes
            logger.debug(f"Executing query: {str(query)}")

            # Execute the query asynchronously
            result = await session.execute(query)

            # Extract the results using .scalars().all() to return a list of matching projects
            projects = result.scalars().all()

            # Log success message
            logger.info(f"Processed get_projects(id={id}, name={name})")
            gql_counter.labels(environment=Config.ENVIRONMENT, request="Projects", status="OK").inc()

            # Return a list of Project objects, mapped from the database results
            return [ProjectSTR(
                id=p.id,
                name=p.name,
                created_at=p.created_at,
                updated_at=p.updated_at
            ) for p in projects]

        except Exception as e:

            # Log any exception that occurs
            logger.error(f"Failed to process get_projects(id={id}, name={name}): {str(e)}")
            gql_counter.labels(environment=Config.ENVIRONMENT, request="Projects", status="ERROR").inc()

            # Return an empty list on error
            return []

    # Field to query Tasks
    @strawberry.field
    @async_time_decorator(gql_duration, {'environment': Config.ENVIRONMENT, 'request': 'Tasks'})
    async def get_tasks(
            self,
            info,  # GraphQL context, used to access FastAPI dependencies like DB session
            name: Optional[str] = None,  # Optional filter by task name
            project_id: Optional[int] = None  # Optional filter by associated project ID
    ) -> List[TaskSTR]:
        # Initialize logger
        start_time = time.perf_counter()
        logger = get_logger()
        try:
            # Extract the SQLAlchemy session from the GraphQL context
            session: AsyncSession = info.context["session"]

            # Start building the query
            query = select(TaskSQL)  # Select from TaskModel table

            # Apply filters if provided
            if name:
                query = query.where(TaskSQL.name.ilike(f"%{name}%"))  # Filter by task name (case-insensitive)

            if project_id:
                query = query.where(TaskSQL.project_id == project_id)  # Filter by project ID

            # Log the SQL query for debugging purposes
            logger.debug(f"Executing query: {str(query)}")

            # Execute the query asynchronously
            result = await session.execute(query)

            # Extract the results using .scalars().all() to return a list of matching tasks
            tasks = result.scalars().all()

            # Log success message
            logger.info(f"Processed get_tasks(name={name}, project_id={project_id})")
            gql_counter.labels(environment=Config.ENVIRONMENT, request="Tasks", status="OK").inc()

            # Return a list of Task objects, mapped from the database results
            return [TaskSTR(
                id=t.id,
                name=t.name,
                project_id=t.project_id,
                created_at=t.created_at,
                updated_at=t.updated_at
            ) for t in tasks]

        except Exception as e:

            # Log any exception that occurs
            logger.error(f"Failed to process get_tasks(name={name}, project_id={project_id}): {str(e)}")
            gql_counter.labels(environment=Config.ENVIRONMENT, request="Tasks", status="ERROR").inc()

            # Return an empty list on error
            return []


# Create the GraphQL schema and attach the Query class
schema = strawberry.Schema(query=Query)
