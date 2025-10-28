from sqlalchemy import Column, String, Integer, DateTime, Text, Boolean, ForeignKey, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
from app.database import Base
import enum


class EventType(str, enum.Enum):
    EARNINGS_CALL = "earnings_call"
    CONFERENCE = "conference"
    INVESTOR_DAY = "investor_day"


class EventStatus(str, enum.Enum):
    UPCOMING = "upcoming"
    LIVE = "live"
    COMPLETED = "completed"


class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    profile = relationship("Profile", back_populates="user", uselist=False)
    watchlists = relationship("Watchlist", back_populates="user")


class Profile(Base):
    __tablename__ = "profiles"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    name = Column(String)
    locale = Column(String, default="en")
    timezone = Column(String, default="Europe/Berlin")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="profile")


class Watchlist(Base):
    __tablename__ = "watchlists"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, default="My Watchlist")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="watchlists")
    items = relationship("WatchlistItem", back_populates="watchlist", cascade="all, delete-orphan")


class WatchlistItem(Base):
    __tablename__ = "watchlist_items"
    
    id = Column(Integer, primary_key=True)
    watchlist_id = Column(Integer, ForeignKey("watchlists.id"), nullable=False)
    ticker = Column(String, nullable=False)
    company_name = Column(String)
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    
    watchlist = relationship("Watchlist", back_populates="items")


class Event(Base):
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True)
    ticker = Column(String, nullable=False, index=True)
    company_name = Column(String)
    event_type = Column(SQLEnum(EventType), default=EventType.EARNINGS_CALL)
    event_status = Column(SQLEnum(EventStatus), default=EventStatus.UPCOMING)
    event_date = Column(DateTime(timezone=True), nullable=False, index=True)
    quarter = Column(String)
    fiscal_year = Column(Integer)
    audio_url = Column(String)
    provider = Column(String, default="finnhub")
    provider_event_id = Column(String, unique=True)
    meta_data = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    transcript = relationship("Transcript", back_populates="event", uselist=False)
    summary = relationship("Summary", back_populates="event", uselist=False)
    qa_items = relationship("QAItem", back_populates="event")


class Transcript(Base):
    __tablename__ = "transcripts"
    
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey("events.id"), unique=True, nullable=False)
    raw_text = Column(Text, nullable=False)
    structured_data = Column(JSON)
    processed_at = Column(DateTime(timezone=True), server_default=func.now())
    
    event = relationship("Event", back_populates="transcript")
    chunks = relationship("TranscriptChunk", back_populates="transcript", cascade="all, delete-orphan")


class TranscriptChunk(Base):
    __tablename__ = "transcript_chunks"
    
    id = Column(Integer, primary_key=True)
    transcript_id = Column(Integer, ForeignKey("transcripts.id"), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    text = Column(Text, nullable=False)
    start_time = Column(String)
    end_time = Column(String)
    speaker = Column(String)
    token_count = Column(Integer)
    embedding = Column(Vector(3072))
    meta_data = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    transcript = relationship("Transcript", back_populates="chunks")


class Summary(Base):
    __tablename__ = "summaries"
    
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey("events.id"), unique=True, nullable=False)
    quicktake = Column(JSON)
    extractive_quotes = Column(JSON)
    guidance_table = Column(JSON)
    delta_analysis = Column(JSON)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    
    event = relationship("Event", back_populates="summary")


class QAItem(Base):
    __tablename__ = "qa_items"
    
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    question_index = Column(Integer)
    analyst_name = Column(String)
    analyst_firm = Column(String)
    question_text = Column(Text)
    question_timestamp = Column(String)
    answer_text = Column(Text)
    answer_timestamp = Column(String)
    topic = Column(String)
    deflection_score = Column(Integer)
    meta_data = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    event = relationship("Event", back_populates="qa_items")


class ChatHistory(Base):
    __tablename__ = "chat_history"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    citations = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
