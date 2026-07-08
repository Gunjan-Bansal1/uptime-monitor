import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from ..database import SessionLocal
from ..services import get_urls, perform_health_check, create_health_check
from ..schemas import HealthCheckCreate
from ..config import settings

# Set up logging for tracking background checks
logger = logging.getLogger("scheduler")

# Create a singleton scheduler instance
scheduler = AsyncIOScheduler()

async def check_all_urls():
    """
    Periodic job that fetches all active URLs from the database,
    performs health checks on each, and logs results back to the database.
    """
    db = SessionLocal()
    try:
        urls = get_urls(db)
        for url in urls:
            try:
                # Perform the health check (this calls the async monitoring service)
                check_result = await perform_health_check(url.id, url.url)
                
                # Parse output dictionary into Pydantic schema
                check_in = HealthCheckCreate(**check_result)
                
                # Persist the health check log entry
                create_health_check(db, check_in)
                
            except Exception as e:
                # Catch any failure to ensure the loop keeps running for other URLs
                logger.error(f"Failed to check URL {url.url}: {e}")
                
    finally:
        # Guarantee database session cleanup
        db.close()

def start_scheduler():
    """
    Adds the health check job to the scheduler and starts executing.
    Runs immediately once, and then periodically every PING_INTERVAL_SECONDS.
    """
    if not scheduler.running:
        scheduler.add_job(
            check_all_urls,
            "interval",
            seconds=settings.PING_INTERVAL_SECONDS,
            id="url_health_checks",
            replace_existing=True
        )
        scheduler.start()
        logger.info(f"Background health check scheduler started (interval: {settings.PING_INTERVAL_SECONDS}s).")

def shutdown_scheduler():
    """
    Stops the background scheduler, ensuring a clean teardown.
    """
    if scheduler.running:
        scheduler.shutdown()
        logger.info("Background health check scheduler shut down.")
