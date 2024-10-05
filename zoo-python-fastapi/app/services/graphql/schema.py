from typing import List, Optional

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models import Project as ProjectModel, Task as TaskModel


# Strawberry Types for Project and Task

@strawberry.type
class Project:
    id: int
    name: str

    @strawberry.field
    def raw_id(self) -> int:
        return self.id


@strawberry.type
class Task:
    id: int
    name: str
    project_id: int

    @strawberry.field
    def raw_id(self) -> int:
        return self.id


# Queries using Strawberry
@strawberry.type
class Query:

    @strawberry.field
    async def get_projects(self, info, name: Optional[str] = None) -> List[Project]:
        # Use the FastAPI dependency injection to get the session
        session: AsyncSession = info.context["session"]

        try:
            query = select(ProjectModel)

            if name:
                query = query.where(ProjectModel.name.ilike(f"%{name}%"))

            result = await session.execute(query)
            projects = result.scalars().all()
            return [Project(id=p.id, name=p.name) for p in projects]

        except Exception as e:
            print(f"Error fetching projects: {str(e)}")
            return []

    @strawberry.field
    async def get_tasks(
            self,
            info,
            name: Optional[str] = None,
            project_id: Optional[int] = None
    ) -> List[Task]:
        # Use the FastAPI dependency injection to get the session
        session: AsyncSession = info.context["session"]

        try:
            query = select(TaskModel)

            if name:
                query = query.where(TaskModel.name.ilike(f"%{name}%"))

            if project_id:
                query = query.where(TaskModel.project_id == project_id)

            result = await session.execute(query)
            tasks = result.scalars().all()
            return [Task(id=t.id, name=t.name, project_id=t.project_id) for t in tasks]

        except Exception as e:
            print(f"Error fetching tasks: {str(e)}")
            return []


# Create the GraphQL schema
schema = strawberry.Schema(query=Query)
