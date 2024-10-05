from datetime import datetime

import strawberry


# Define Strawberry Types for Project and Task to expose in the GraphQL API
@strawberry.type
class Project:
    """Strawberry Model - GQL schema"""
    id: int
    name: str
    created_at: datetime
    updated_at: datetime
