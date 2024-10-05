from datetime import datetime

import strawberry


# Define Strawberry Types for Project and Task to expose in the GraphQL API
@strawberry.type
class Task:
    """Strawberry Model - GQL schema"""
    id: int
    name: str
    project_id: int
    created_at: datetime
    updated_at: datetime
