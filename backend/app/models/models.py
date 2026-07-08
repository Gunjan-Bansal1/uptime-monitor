from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class URL(Base):
    """
    URL model representing a registered website to be monitored.
    """
    __tablename__ = "urls"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Establish one-to-many relationship with cascading deletion
    checks = relationship(
        "HealthCheck",
        back_populates="url_relation",
        cascade="all, delete-orphan",
        passive_deletes=True
    )


class HealthCheck(Base):
    """
    HealthCheck model storing the result of a single ping/uptime check.
    """
    __tablename__ = "health_checks"

    id = Column(Integer, primary_key=True, index=True)
    url_id = Column(
        Integer,
        ForeignKey("urls.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    is_up = Column(Boolean, nullable=False)
    status_code = Column(Integer, nullable=True)
    response_time_ms = Column(Integer, nullable=True)
    checked_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True
    )

    # Back-reference to the target URL model
    url_relation = relationship("URL", back_populates="checks")
