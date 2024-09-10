import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType

from app import metrics
from models import Project as ProjectModel, Task as TaskModel

# Prometheus metrics
get_projects_counter = metrics.counter('graphql_get_projects_requests_total', 'Total number of requests to getProjects')
get_projects_duration = metrics.histogram('graphql_get_projects_duration_seconds', 'Duration of getProjects method')
get_tasks_counter = metrics.counter('graphql_get_tasks_requests_total', 'Total number of requests to getTasks')
get_tasks_duration = metrics.histogram('graphql_get_tasks_duration_seconds', 'Duration of getTasks method')


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

    @get_projects_duration.time()  # Measure the duration of this method
    def resolve_get_projects(self, info):
        get_projects_counter.inc()  # Increment counter
        return ProjectModel.query.all()

    @get_tasks_duration.time()  # Measure the duration of this method
    def resolve_get_tasks(self, info):
        get_tasks_counter.inc()  # Increment counter
        return TaskModel.query.all()


schema = graphene.Schema(query=Query)
