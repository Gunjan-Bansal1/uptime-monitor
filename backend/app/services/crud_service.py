from sqlalchemy.orm import Session
from typing import List, Optional
from ..models import URL, HealthCheck
from ..schemas import URLCreate, HealthCheckCreate

def create_url(db: Session, url_in: URLCreate) -> URL:
    """
    Registers a new URL in the database.
    Converts Pydantic's HttpUrl to a standard string for storage.
    """
    db_url = URL(url=str(url_in.url))
    db.add(db_url)
    db.commit()
    db.refresh(db_url)
    return db_url

def get_urls(db: Session) -> List[URL]:
    """
    Retrieves all registered URLs from the database.
    """
    return db.query(URL).all()

def delete_url(db: Session, url_id: int) -> bool:
    """
    Deletes a registered URL by its ID.
    Triggers database-level cascade deletion of historical checks.
    Returns True if deletion was successful, False otherwise.
    """
    db_url = db.query(URL).filter(URL.id == url_id).first()
    if db_url:
        db.delete(db_url)
        db.commit()
        return True
    return False

def create_health_check(db: Session, check_in: HealthCheckCreate) -> HealthCheck:
    """
    Saves a new health check result entry to the database.
    """
    db_check = HealthCheck(
        url_id=check_in.url_id,
        is_up=check_in.is_up,
        status_code=check_in.status_code,
        response_time_ms=check_in.response_time_ms,
        checked_at=check_in.checked_at
    )
    db.add(db_check)
    db.commit()
    db.refresh(db_check)
    return db_check

def get_latest_health_check(db: Session, url_id: int) -> Optional[HealthCheck]:
    """
    Fetches the most recent health check record for a given URL.
    """
    return (
        db.query(HealthCheck)
        .filter(HealthCheck.url_id == url_id)
        .order_by(HealthCheck.checked_at.desc())
        .first()
    )

def get_urls_with_latest_checks(db: Session) -> List[dict]:
    """
    Retrieves all registered URLs from the database, populated with their
    latest health check outcome if available.
    """
    urls = db.query(URL).all()
    results = []
    for url in urls:
        latest_check = (
            db.query(HealthCheck)
            .filter(HealthCheck.url_id == url.id)
            .order_by(HealthCheck.checked_at.desc())
            .first()
        )
        results.append({
            "id": url.id,
            "url": url.url,
            "created_at": url.created_at,
            "latest_check": latest_check
        })
    return results

