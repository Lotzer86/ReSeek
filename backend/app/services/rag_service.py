from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.services.embedding_service import search_similar_chunks, search_similar_chunks_across_watchlist
from app.services.openai_service import get_chat_completion
from app.models.models import TranscriptChunk, Summary, Event
import logging

logger = logging.getLogger(__name__)


async def query_rag(
    question: str,
    event_id: Optional[int],
    ticker_list: Optional[List[str]],
    db: Session
) -> Dict[str, Any]:
    """
    RAG query with strict grounding and citations
    """
    if event_id:
        chunks = await search_similar_chunks(question, event_id, db, limit=5)
        event = db.query(Event).filter(Event.id == event_id).first()
        summary = db.query(Summary).filter(Summary.event_id == event_id).first()
    elif ticker_list:
        chunks = await search_similar_chunks_across_watchlist(question, ticker_list, db, limit=10)
        event = None
        summary = None
    else:
        return {
            "answer": "Please specify either an event or watchlist to query.",
            "citations": []
        }
    
    context = build_context(chunks, summary)
    
    answer_text, citations = await generate_grounded_answer(question, context, chunks)
    
    return {
        "answer": answer_text,
        "citations": citations,
        "sources": [
            {
                "chunk_id": chunk.id,
                "event_id": chunk.transcript.event_id if chunk.transcript else None,
                "text": chunk.text[:200] + "...",
                "timestamp": chunk.start_time
            }
            for chunk in chunks[:3]
        ]
    }


def build_context(chunks: List[TranscriptChunk], summary: Optional[Summary]) -> str:
    """
    Build context from chunks and summary for LLM
    """
    context_parts = []
    
    if summary and summary.quicktake:
        context_parts.append("=== SUMMARY ===")
        for item in summary.quicktake:
            context_parts.append(f"- {item.get('bullet', '')}")
        context_parts.append("")
    
    context_parts.append("=== RELEVANT TRANSCRIPT EXCERPTS ===")
    for chunk in chunks:
        timestamp = chunk.start_time or "unknown"
        speaker = chunk.speaker or "Speaker"
        context_parts.append(f"[{timestamp}] {speaker}: {chunk.text}")
        context_parts.append("")
    
    return "\n".join(context_parts)


async def generate_grounded_answer(
    question: str,
    context: str,
    chunks: List[TranscriptChunk]
) -> tuple:
    """
    Generate answer with strict grounding and extract citations
    """
    try:
        with open("backend/prompts/chat_system.txt", "r") as f:
            system_prompt = f.read()
    except:
        with open("prompts/chat_system.txt", "r") as f:
            system_prompt = f.read()
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}"}
    ]
    
    try:
        answer = await get_chat_completion(messages, temperature=0.3, max_tokens=1000)
        
        citations = extract_citations(answer, chunks)
        
        return answer, citations
    except Exception as e:
        logger.error(f"Error generating answer: {e}")
        return "I encountered an error processing your question. Please try again.", []


def extract_citations(answer_text: str, chunks: List[TranscriptChunk]) -> List[Dict[str, Any]]:
    """
    Extract citations from answer text
    Format: [quote "...", ts HH:MM:SS]
    """
    import re
    
    citations = []
    citation_pattern = r'\[quote\s+"([^"]+)",\s*ts\s+(\d{2}:\d{2}:\d{2})\]'
    
    matches = re.finditer(citation_pattern, answer_text)
    
    for match in matches:
        quote = match.group(1)
        timestamp = match.group(2)
        
        matching_chunk = next(
            (chunk for chunk in chunks if timestamp == chunk.start_time or quote[:50] in chunk.text),
            None
        )
        
        citations.append({
            "quote": quote,
            "timestamp": timestamp,
            "chunk_id": matching_chunk.id if matching_chunk else None,
            "event_id": matching_chunk.transcript.event_id if matching_chunk and matching_chunk.transcript else None
        })
    
    return citations


async def suggest_questions(event_id: int, db: Session) -> List[str]:
    """
    Generate suggested questions based on event summary
    """
    summary = db.query(Summary).filter(Summary.event_id == event_id).first()
    
    if not summary:
        return [
            "What were the key financial highlights?",
            "What guidance did management provide?",
            "What were the main topics discussed in Q&A?"
        ]
    
    suggestions = [
        "What drove the revenue growth this quarter?",
        "What is the outlook for next quarter?",
        "What did management say about profitability?",
        "Were there any new product announcements?",
        "What questions did analysts ask?"
    ]
    
    return suggestions[:5]
