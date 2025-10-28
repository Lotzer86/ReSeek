from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.models import Transcript, TranscriptChunk
from app.services.openai_service import get_embedding, chunk_text
import logging
import re

logger = logging.getLogger(__name__)


async def process_transcript_chunks(transcript_id: int, transcript_text: str, db: Session):
    """
    Chunk transcript and generate embeddings for each chunk.
    Attempts to preserve speaker and timestamp information.
    """
    chunks_data = chunk_text(transcript_text, max_tokens=500, overlap=50)
    
    for chunk_info in chunks_data:
        chunk_text_content = chunk_info["text"]
        
        speaker, timestamp = extract_metadata(chunk_text_content)
        
        try:
            embedding = await get_embedding(chunk_text_content)
            
            chunk = TranscriptChunk(
                transcript_id=transcript_id,
                chunk_index=chunk_info["chunk_index"],
                text=chunk_text_content,
                start_time=timestamp,
                speaker=speaker,
                token_count=chunk_info["token_count"],
                embedding=embedding,
                meta_data={
                    "start_token": chunk_info["start_token"],
                    "end_token": chunk_info["end_token"]
                }
            )
            
            db.add(chunk)
        except Exception as e:
            logger.error(f"Error processing chunk {chunk_info['chunk_index']}: {e}")
            continue
    
    db.commit()
    logger.info(f"Processed {len(chunks_data)} chunks for transcript {transcript_id}")


def extract_metadata(text: str) -> tuple:
    """Extract speaker and timestamp from transcript chunk"""
    speaker = None
    timestamp = None
    
    timestamp_pattern = r'\[(\d{2}:\d{2}:\d{2})\]'
    timestamp_match = re.search(timestamp_pattern, text)
    if timestamp_match:
        timestamp = timestamp_match.group(1)
    
    speaker_pattern = r'\[?\d{2}:\d{2}:\d{2}\]?\s*([A-Za-z\s]+(?:,\s*[A-Za-z\s]+)?):' 
    speaker_match = re.search(speaker_pattern, text)
    if speaker_match:
        speaker = speaker_match.group(1).strip()
    
    return speaker, timestamp


async def search_similar_chunks(
    query: str,
    event_id: int,
    db: Session,
    limit: int = 5
) -> List[TranscriptChunk]:
    """
    Search for similar transcript chunks using vector similarity.
    """
    query_embedding = await get_embedding(query)
    
    from sqlalchemy import select, func
    from app.models.models import Event
    
    stmt = (
        select(TranscriptChunk)
        .join(Transcript)
        .join(Event)
        .where(Event.id == event_id)
        .order_by(TranscriptChunk.embedding.l2_distance(query_embedding))
        .limit(limit)
    )
    
    result = db.execute(stmt)
    return result.scalars().all()


async def search_similar_chunks_across_watchlist(
    query: str,
    ticker_list: List[str],
    db: Session,
    limit: int = 10
) -> List[TranscriptChunk]:
    """
    Search across multiple companies in watchlist.
    """
    query_embedding = await get_embedding(query)
    
    from sqlalchemy import select
    from app.models.models import Event
    
    stmt = (
        select(TranscriptChunk)
        .join(Transcript)
        .join(Event)
        .where(Event.ticker.in_(ticker_list))
        .order_by(TranscriptChunk.embedding.l2_distance(query_embedding))
        .limit(limit)
    )
    
    result = db.execute(stmt)
    return result.scalars().all()
