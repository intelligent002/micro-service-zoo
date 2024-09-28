from sqlalchemy.orm import declarative_base

Base = declarative_base() # model base class

from .project import Project
from .task import Task