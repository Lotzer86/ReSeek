from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
from app.database import get_db
from app.models.models import Event, Transcript, Summary, QAItem, EventStatus
from app.services.embedding_service import process_transcript_chunks
from app.services.summarization_service import generate_summary
from app.services.qa_service import extract_qa_items
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/")
async def get_events(
    ticker: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get events with optional filtering"""
    query = db.query(Event)
    
    if ticker:
        query = query.filter(Event.ticker == ticker)
    
    if status:
        query = query.filter(Event.event_status == status)
    
    events = query.order_by(Event.event_date.desc()).limit(limit).all()
    
    return {
        "events": [
            {
                "id": event.id,
                "ticker": event.ticker,
                "company_name": event.company_name,
                "event_type": event.event_type,
                "event_status": event.event_status,
                "event_date": event.event_date.isoformat(),
                "quarter": event.quarter,
                "fiscal_year": event.fiscal_year,
                "has_transcript": event.transcript is not None,
                "has_summary": event.summary is not None
            }
            for event in events
        ]
    }


@router.get("/upcoming")
async def get_upcoming_events(
    tickers: Optional[str] = None,
    days: int = 30,
    db: Session = Depends(get_db)
):
    """Get upcoming events"""
    from_date = datetime.now()
    to_date = from_date + timedelta(days=days)
    
    query = db.query(Event).filter(
        Event.event_date >= from_date,
        Event.event_date <= to_date,
        Event.event_status == EventStatus.UPCOMING
    )
    
    if tickers:
        ticker_list = [t.strip() for t in tickers.split(",")]
        query = query.filter(Event.ticker.in_(ticker_list))
    
    events = query.order_by(Event.event_date).all()
    
    return {
        "upcoming_events": [
            {
                "id": event.id,
                "ticker": event.ticker,
                "company_name": event.company_name,
                "event_date": event.event_date.isoformat(),
                "quarter": event.quarter
            }
            for event in events
        ]
    }


@router.get("/{event_id}")
async def get_event_detail(event_id: int, db: Session = Depends(get_db)):
    """Get event details with transcript and summary"""
    event = db.query(Event).filter(Event.id == event_id).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    response = {
        "id": event.id,
        "ticker": event.ticker,
        "company_name": event.company_name,
        "event_type": event.event_type,
        "event_status": event.event_status,
        "event_date": event.event_date.isoformat(),
        "quarter": event.quarter,
        "fiscal_year": event.fiscal_year,
        "audio_url": event.audio_url
    }
    
    if event.transcript:
        response["transcript"] = {
            "id": event.transcript.id,
            "text": event.transcript.raw_text,
            "processed_at": event.transcript.processed_at.isoformat()
        }
    
    if event.summary:
        response["summary"] = {
            "id": event.summary.id,
            "quicktake": event.summary.quicktake,
            "extractive_quotes": event.summary.extractive_quotes,
            "guidance_table": event.summary.guidance_table,
            "delta_analysis": event.summary.delta_analysis,
            "generated_at": event.summary.generated_at.isoformat()
        }
    
    qa_items = db.query(QAItem).filter(QAItem.event_id == event_id).all()
    if qa_items:
        response["qa_items"] = [
            {
                "id": qa.id,
                "analyst_name": qa.analyst_name,
                "analyst_firm": qa.analyst_firm,
                "question": qa.question_text,
                "question_timestamp": qa.question_timestamp,
                "answer": qa.answer_text,
                "answer_timestamp": qa.answer_timestamp,
                "topic": qa.topic,
                "deflection_score": qa.deflection_score
            }
            for qa in qa_items
        ]
    
    return response


@router.get("/{event_id}/transcript")
async def get_transcript(event_id: int, db: Session = Depends(get_db)):
    """Get full transcript with chunks"""
    event = db.query(Event).filter(Event.id == event_id).first()
    
    if not event or not event.transcript:
        raise HTTPException(status_code=404, detail="Transcript not found")
    
    transcript = event.transcript
    
    return {
        "event_id": event_id,
        "ticker": event.ticker,
        "company_name": event.company_name,
        "event_date": event.event_date.isoformat(),
        "raw_text": transcript.raw_text,
        "chunks": [
            {
                "id": chunk.id,
                "chunk_index": chunk.chunk_index,
                "text": chunk.text,
                "start_time": chunk.start_time,
                "speaker": chunk.speaker
            }
            for chunk in transcript.chunks
        ]
    }
