from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import URLCreate, URLResponse, URLWithLatestCheck
from ..models import URL
from ..services import create_url, get_urls_with_latest_checks, delete_url

router = APIRouter(prefix="/urls", tags=["urls"])

@router.post("", response_model=URLResponse, status_code=status.HTTP_201_CREATED)
def register_url(url_in: URLCreate, db: Session = Depends(get_db)):
    """
    Registers a new URL to be monitored.

    If the URL is already registered, returns an HTTP 409 Conflict.
    """

    # DEBUG (temporary)
    print("=" * 50)
    print("Incoming URL:", str(url_in.url))

    # Check if the URL already exists in the database
    existing_url = db.query(URL).filter(URL.url == str(url_in.url)).first()

    print("Existing URL object:", existing_url)
    if existing_url:
        print("Matched URL in DB:", existing_url.url)

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="URL is already registered for monitoring."
        )

    print("No duplicate found. Creating new URL...")

    return create_url(db, url_in)

@router.get("", response_model=List[URLWithLatestCheck])
def list_urls(db: Session = Depends(get_db)):
    """
    Lists all monitored URLs with their latest health check log.
    """
    return get_urls_with_latest_checks(db)

@router.delete("/{url_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_url(url_id: int, db: Session = Depends(get_db)):
    """
    Deletes a registered URL by its ID, along with all its check logs.
    """
    success = delete_url(db, url_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="URL not found."
        )


