from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.models import Event, Summary
from app.services.openai_service import get_chat_completion
import json
import logging

logger = logging.getLogger(__name__)


async def generate_summary(event_id: int, transcript_text: str, db: Session) -> Summary:
    """
    Generate multi-pass summary: extractive -> abstractive
    """
    logger.info(f"Generating summary for event {event_id}")
    
    extractive_quotes = await extractive_pass(transcript_text)
    
    abstractive_result = await abstractive_pass(extractive_quotes)
    
    summary = Summary(
        event_id=event_id,
        extractive_quotes=extractive_quotes,
        quicktake=abstractive_result.get("quicktake", []),
        guidance_table=abstractive_result.get("guidance", []),
        delta_analysis=abstractive_result.get("delta_analysis", {})
    )
    
    db.add(summary)
    db.commit()
    db.refresh(summary)
    
    logger.info(f"Summary generated for event {event_id}")
    return summary


async def extractive_pass(transcript_text: str) -> List[Dict[str, Any]]:
    """
    First pass: Extract verbatim quotes with timestamps
    """
    try:
        with open("backend/prompts/extractive.txt", "r") as f:
            system_prompt = f.read()
    except:
        with open("prompts/extractive.txt", "r") as f:
            system_prompt = f.read()
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Extract key quotes from this transcript:\n\n{transcript_text[:15000]}"}
    ]
    
    try:
        response = await get_chat_completion(messages, temperature=0.3, max_tokens=3000)
        quotes = json.loads(response)
        return quotes if isinstance(quotes, list) else []
    except Exception as e:
        logger.error(f"Error in extractive pass: {e}")
        return []


async def abstractive_pass(extractive_quotes: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Second pass: Create QuickTake, guidance table, delta analysis
    """
    try:
        with open("backend/prompts/abstractive.txt", "r") as f:
            system_prompt = f.read()
    except:
        with open("prompts/abstractive.txt", "r") as f:
            system_prompt = f.read()
    
    quotes_text = json.dumps(extractive_quotes, indent=2)
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Create summary based on these quotes:\n\n{quotes_text}"}
    ]
    
    try:
        response = await get_chat_completion(messages, temperature=0.4, max_tokens=3000)
        result = json.loads(response)
        return result
    except Exception as e:
        logger.error(f"Error in abstractive pass: {e}")
        return {
            "quicktake": [],
            "guidance": [],
            "delta_analysis": {}
        }
