import strawberry


@strawberry.type
class Query:
    @strawberry.field
    def hello(self) -> str:
        return "Hello, FastAPI with GraphQL!"


schema = strawberry.Schema(query=Query)
