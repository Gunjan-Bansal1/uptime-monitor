from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, HttpUrl, field_validator


class HealthCheckCreate(BaseModel):
    """Schema for creating a HealthCheck entry."""
    url_id: int
    is_up: bool
    status_code: Optional[int] = None
    response_time_ms: Optional[int] = None
    checked_at: datetime


class HealthCheckResponse(BaseModel):
    """Schema for returning a HealthCheck details."""
    id: int
    url_id: int
    is_up: bool
    status_code: Optional[int]
    response_time_ms: Optional[int]
    checked_at: datetime

    model_config = ConfigDict(from_attributes=True)


class URLCreate(BaseModel):
    """Schema for registering a new URL."""
    url: HttpUrl

    @field_validator("url")
    @classmethod
    def validate_public_url(cls, value: HttpUrl):
        host = value.host.lower()

        # Reject incomplete hostnames
        if "." not in host:
            raise ValueError(
                "Please enter a complete domain name (e.g. google.com)."
            )

        # Reject placeholder/non-public hosts
        invalid_hosts = {
            "www",
            "localhost",
        }

        if host in invalid_hosts:
            raise ValueError(
                "Please enter a valid public website URL."
            )

        return value


class URLResponse(BaseModel):
    """Schema for returning URL details."""
    id: int
    url: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class URLWithLatestCheck(BaseModel):
    """Schema for returning URL details along with its latest health check result."""
    id: int
    url: str
    created_at: datetime
    latest_check: Optional[HealthCheckResponse] = None

    model_config = ConfigDict(from_attributes=True)