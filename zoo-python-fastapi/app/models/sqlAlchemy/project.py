from datetime import datetime, timezone

from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, mapped_column

from . import Base


class Project(Base):
    __tablename__ = "projects"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    name: Mapped[str] = mapped_column(index=True, unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True,
                                                 default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True,
                                                 default=lambda: datetime.now(timezone.utc),
                                                 onupdate=lambda: datetime.now(timezone.utc))
