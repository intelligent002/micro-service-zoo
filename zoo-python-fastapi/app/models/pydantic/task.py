from datetime import datetime

from pydantic import BaseModel, ConfigDict


class Task(BaseModel):
    """Pydantic Model - IO validations"""
    model_config = ConfigDict(from_attributes=True)
    id: int
    project_id: int
    name: str
    created_at: datetime
    updated_at: datetime
