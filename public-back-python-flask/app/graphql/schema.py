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

    # Define the List type for simpler resolvers
    get_projects = graphene.List(Project)
    get_tasks = graphene.List(Task)

    # this is currently not exactly working
    # get_projects = SQLAlchemyConnectionField(Project, name=graphene.String())
    # get_tasks = SQLAlchemyConnectionField(Task, name=graphene.String())

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

            if name:
                current_app.logger.debug(f"Fetching tasks with name filter: {name}")
                return ProjectModel.query.filter(ProjectModel.name.ilike(f"%{name}%"))
            return ProjectModel.query
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
            # Get the name filter
            name = kwargs.get('name', None)

            if name:
                current_app.logger.debug(f"Fetching tasks with name filter: {name}")
                return TaskModel.query.filter(TaskModel.name.ilike(f"%{name}%"))
            return TaskModel.query
        except Exception as e:
            current_app.logger.error(f"Error while fetching tasks {str(e)}")
            return []

schema = graphene.Schema(query=Query)
