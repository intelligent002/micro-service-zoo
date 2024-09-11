import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType

from app.metrics import projects_counter, projects_duration, tasks_counter, tasks_duration
from app.graphql.models import Project as ProjectModel, Task as TaskModel


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
    get_projects = graphene.List(Project)
    get_tasks = graphene.List(Task)

    @projects_duration.time()  # Measure the duration of this method
    def resolve_get_projects(self, info):
        projects_counter.inc()  # Increment counter
        return ProjectModel.query.all()

    @tasks_duration.time()  # Measure the duration of this method
    def resolve_get_tasks(self, info):
        tasks_counter.inc()  # Increment counter
        return TaskModel.query.all()


schema = graphene.Schema(query=Query)
