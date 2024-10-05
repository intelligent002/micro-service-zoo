from typing import List, Optional

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models import Project as ProjectModel, Task as TaskModel
from app.services.graphql.get_logger import get_logger


# Strawberry Types for Project and Task

@strawberry.type
class Project:
    id: int
    name: str


@strawberry.type
class Task:
    id: int
    name: str
    project_id: int


# Queries using Strawberry
@strawberry.type
class Query:

    @strawberry.field
    async def get_projects(
            self,
            info,
            id: Optional[int] = None,
            name: Optional[str] = None
    ) -> List[Project]:
        # get the logger
        logger = get_logger()
        try:
            # Use the FastAPI dependency injection to get the session
            session: AsyncSession = info.context["session"]

            query = select(ProjectModel)

            if id:
                query = query.where(ProjectModel.id == id)

            if name:
                query = query.where(ProjectModel.name.ilike(f"%{name}%"))

            result = await session.execute(query)
            projects = result.scalars().all()
            logger.info(f"Processed get_projects(id={id},name={name})")
            return [Project(id=p.id, name=p.name) for p in projects]

        except Exception as e:
            logger.warning(f"Failed to process the get_projects(id={id},name={name}): [{str(e)}]")
            return []

    @strawberry.field
    async def get_tasks(
            self,
            info,
            name: Optional[str] = None,
            project_id: Optional[int] = None
    ) -> List[Task]:
        logger = get_logger()
        try:
            # Use the FastAPI dependency injection to get the session
            session: AsyncSession = info.context["session"]

            query = select(TaskModel)

            if name:
                query = query.where(TaskModel.name.ilike(f"%{name}%"))

            if project_id:
                query = query.where(TaskModel.project_id == project_id)

            result = await session.execute(query)
            tasks = result.scalars().all()
            logger.info(f"Processed get_tasks(name={name},project_id={project_id})")
            return [Task(id=t.id, name=t.name, project_id=t.project_id) for t in tasks]

        except Exception as e:
            logger.warning(f"Failed to process the get_tasks(name={name},project_id={project_id}): [{str(e)}]")
            return []


# Create the GraphQL schema
schema = strawberry.Schema(query=Query)
