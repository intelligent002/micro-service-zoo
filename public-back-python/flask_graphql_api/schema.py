import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType
from models import Project as ProjectModel, Task as TaskModel


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

    def resolve_get_projects(self, info):
        return ProjectModel.query.all()

    def resolve_get_tasks(self, info):
        return TaskModel.query.all()


schema = graphene.Schema(query=Query)
