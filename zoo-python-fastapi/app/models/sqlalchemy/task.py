from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Task(Base):
    """SQLAlchemy Model - interact with SQL"""
    __tablename__ = "tasks"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    project_id: Mapped[int] = mapped_column(ForeignKey('projects.id'))
    name: Mapped[str] = mapped_column(String(255), index=True, unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True,
                                                 default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True,
                                                 default=lambda: datetime.now(timezone.utc),
                                                 onupdate=lambda: datetime.now(timezone.utc))
