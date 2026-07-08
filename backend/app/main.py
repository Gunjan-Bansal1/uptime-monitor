from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base
from .scheduler import start_scheduler, shutdown_scheduler
from .api import urls_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure SQLite database tables are created before starting checks
    Base.metadata.create_all(bind=engine)
    # Start the periodic background health checks
    start_scheduler()
    yield
    # Stop the scheduler cleanly on application shutdown
    shutdown_scheduler()

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(urls_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}


