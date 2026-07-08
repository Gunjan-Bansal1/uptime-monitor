from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import settings

# Create the SQLAlchemy engine. 
# "check_same_thread": False is required specifically for SQLite to allow 
# multi-threaded requests to interact with the database context.
engine = create_engine(
    settings.DATABASE_URL, connect_args={"check_same_thread": False}
)

# Enable foreign key constraint enforcement in SQLite.
# This forces SQLite to trigger database-level ON DELETE CASCADE behavior.
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

# Configure a session factory to generate database sessions on request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Create a Declarative Base class which our models will inherit from
Base = declarative_base()

# Dependency generator to yield database sessions per request,
# ensuring the connection is properly closed when the request lifecycle ends.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

