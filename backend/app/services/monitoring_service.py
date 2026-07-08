import time
from datetime import datetime, timezone
import httpx
from ..config import settings

async def perform_health_check(url_id: int, url: str) -> dict:
    """
    Performs a single asynchronous HTTP GET request to verify a URL's status.
    
    Measures latency using time.perf_counter() and determines status.
    Handles network errors, timeouts, and unexpected exceptions safely.
    """
    start_time = time.perf_counter()
    
    try:
        # Perform the request using an async httpx client.
        # follow_redirects is enabled to handle 3xx status codes correctly.
        async with httpx.AsyncClient(timeout=settings.REQUEST_TIMEOUT_SECONDS, follow_redirects=True) as client:
            response = await client.get(url)
            
        end_time = time.perf_counter()
        response_time_ms = int((end_time - start_time) * 1000)
        status_code = response.status_code
        
        # 2xx (Success) and 3xx (Redirect) indicate the website is active
        is_up = 200 <= status_code < 400
        
        return {
            "url_id": url_id,
            "is_up": is_up,
            "status_code": status_code,
            "response_time_ms": response_time_ms,
            "checked_at": datetime.now(timezone.utc)
        }
        
    except httpx.TimeoutException:
        # Handle HTTP request timeouts
        return {
            "url_id": url_id,
            "is_up": False,
            "status_code": None,
            "response_time_ms": None,
            "checked_at": datetime.now(timezone.utc)
        }
    except httpx.RequestError:
        # Handle connection, DNS resolution, and SSL issues
        return {
            "url_id": url_id,
            "is_up": False,
            "status_code": None,
            "response_time_ms": None,
            "checked_at": datetime.now(timezone.utc)
        }
    except Exception:
        # Catch-all for unexpected general failures
        return {
            "url_id": url_id,
            "is_up": False,
            "status_code": None,
            "response_time_ms": None,
            "checked_at": datetime.now(timezone.utc)
        }

