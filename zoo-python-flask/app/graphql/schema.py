import graphene
from flask import current_app
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField

from app.graphql.models import Project as ProjectModel, Task as TaskModel
from app.metrics import projects_counter, projects_duration, tasks_counter, tasks_duration


class Project(SQLAlchemyObjectType):
    class Meta:
        model = ProjectModel
        interfaces = (graphene.relay.Node,)

    raw_id = graphene.Int()  # Exposing the raw id

    def resolve_raw_id(parent, info):
        return parent.id


class Task(SQLAlchemyObjectType):
    class Meta:
        model = TaskModel
        interfaces = (graphene.relay.Node,)

    raw_id = graphene.Int()  # Exposing the raw id

    def resolve_raw_id(parent, info):
        return parent.id


class Query(graphene.ObjectType):
    node = relay.Node.Field()

    # this is currently not exactly working
    # get_projects = SQLAlchemyConnectionField(Project, name=graphene.String())
    # get_tasks = SQLAlchemyConnectionField(Task, name=graphene.String())

    # Define the List type for simpler resolvers
    get_projects = graphene.List(Project)

    # Add the projectId argument to the get_tasks field
    get_tasks = graphene.List(Task, name=graphene.String(), project_id=graphene.Int())

    # Measure the duration of this method
    @projects_duration.time()
    def resolve_get_projects(self, info, **kwargs):
        try:
            # Log the passed arguments
            current_app.logger.debug(f"Received arguments: {kwargs}")
            # Increment counter
            projects_counter.inc()
            # Get the name filter
            name = kwargs.get('name', None)

            project_query = ProjectModel.query

            # Apply the name filter if provided
            if name:
                current_app.logger.debug(f"Fetching tasks with name filter: {name}")
                project_query = project_query.filter(ProjectModel.name.ilike(f"%{name}%"))

            project_query.all()
        except Exception as e:
            current_app.logger.error(f"Error while fetching projects {str(e)}")
            return []

    # Measure the duration of this method
    @tasks_duration.time()
    def resolve_get_tasks(self, info, **kwargs):
        try:
            # Log the passed arguments
            current_app.logger.debug(f"Received arguments: {kwargs}")
            # Increment counter
            tasks_counter.inc()

            # Get the name and project_id filters
            name = kwargs.get('name', None)
            project_id = kwargs.get('project_id', None)

            task_query = TaskModel.query

            # Apply the name filter if provided
            if name:
                current_app.logger.debug(f"Fetching tasks with name filter: {name}")
                task_query = task_query.filter(TaskModel.name.ilike(f"%{name}%"))

            # Apply the project_id filter if provided
            if project_id:
                current_app.logger.debug(f"Fetching tasks for project_id: {project_id}")
                task_query = task_query.filter(TaskModel.project_id == project_id)

            return task_query.all()
        except Exception as e:
            current_app.logger.error(f"Error while fetching tasks {str(e)}")
            return []

schema = graphene.Schema(query=Query)
