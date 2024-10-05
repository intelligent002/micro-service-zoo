from typing import List, Optional

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models import Project as ProjectModel, Task as TaskModel
from app.services.graphql.get_logger import get_logger


# Define Strawberry Types for Project and Task to expose in the GraphQL API
@strawberry.type
class Project:
    id: int
    name: str


@strawberry.type
class Task:
    id: int
    name: str
    project_id: int


# Main GraphQL Query class where fields are defined as GraphQL query resolvers
@strawberry.type
class Query:

    # Field to query Projects
    @strawberry.field
    async def get_projects(
        self,
        info,  # GraphQL context, used to access FastAPI dependencies like DB session
        id: Optional[int] = None,  # Optional filter by project ID
        name: Optional[str] = None  # Optional filter by project name
    ) -> List[Project]:
        # Initialize logger
        logger = get_logger()
        try:
            # Extract the SQLAlchemy session from the GraphQL context
            session: AsyncSession = info.context["session"]

            # Start building the query
            query = select(ProjectModel)  # Select from ProjectModel table

            # Apply filters if provided
            if id:
                query = query.where(ProjectModel.id == id)  # Filter by project ID

            if name:
                query = query.where(ProjectModel.name.ilike(f"%{name}%"))  # Filter by project name (case-insensitive)

            # Log the SQL query for debugging purposes
            logger.info(f"Executing query: {str(query)}")

            # Execute the query asynchronously
            result = await session.execute(query)

            # Extract the results using .scalars().all() to return a list of matching projects
            projects = result.scalars().all()

            # Log success message
            logger.info(f"Processed get_projects(id={id}, name={name})")

            # Return a list of Project objects, mapped from the database results
            return [Project(id=p.id, name=p.name) for p in projects]

        except Exception as e:
            # Log any exception that occurs
            logger.warning(f"Failed to process get_projects(id={id}, name={name}): {str(e)}")
            return []  # Return an empty list on error

    # Field to query Tasks
    @strawberry.field
    async def get_tasks(
        self,
        info,  # GraphQL context, used to access FastAPI dependencies like DB session
        name: Optional[str] = None,  # Optional filter by task name
        project_id: Optional[int] = None  # Optional filter by associated project ID
    ) -> List[Task]:
        # Initialize logger
        logger = get_logger()
        try:
            # Extract the SQLAlchemy session from the GraphQL context
            session: AsyncSession = info.context["session"]

            # Start building the query
            query = select(TaskModel)  # Select from TaskModel table

            # Apply filters if provided
            if name:
                query = query.where(TaskModel.name.ilike(f"%{name}%"))  # Filter by task name (case-insensitive)

            if project_id:
                query = query.where(TaskModel.project_id == project_id)  # Filter by project ID

            # Log the SQL query for debugging purposes
            logger.info(f"Executing query: {str(query)}")

            # Execute the query asynchronously
            result = await session.execute(query)

            # Extract the results using .scalars().all() to return a list of matching tasks
            tasks = result.scalars().all()

            # Log success message
            logger.info(f"Processed get_tasks(name={name}, project_id={project_id})")

            # Return a list of Task objects, mapped from the database results
            return [Task(id=t.id, name=t.name, project_id=t.project_id) for t in tasks]

        except Exception as e:
            # Log any exception that occurs
            logger.warning(f"Failed to process get_tasks(name={name}, project_id={project_id}): {str(e)}")
            return []  # Return an empty list on error


# Create the GraphQL schema and attach the Query class
schema = strawberry.Schema(query=Query)
