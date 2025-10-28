from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi import HTTPException
from app.config import get_settings
import logging

logger = logging.getLogger(__name__)
settings = get_settings()

engine = None
SessionLocal = None

try:
    db_url = settings.database_url
    logger.info(f"Connecting to database: {db_url[:30]}...")
    
    if db_url.startswith("sqlite"):
        engine = create_engine(
            db_url,
            connect_args={"check_same_thread": False},
            echo=settings.environment == "development"
        )
    else:
        engine = create_engine(
            db_url,
            pool_pre_ping=True,
            echo=settings.environment == "development",
            connect_args={"connect_timeout": 5}
        )
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    logger.info("Database engine created successfully")
except Exception as e:
    logger.warning(f"Database connection not available: {e}")
    logger.warning("API will start but database operations will fail with 503 errors")

Base = declarative_base()


def get_db():
    if SessionLocal is None:
        raise HTTPException(
            status_code=503,
            detail="Database not available. Please configure database credentials in .env file."
        )
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
