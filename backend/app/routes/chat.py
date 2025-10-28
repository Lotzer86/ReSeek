from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db
from app.services.rag_service import query_rag, suggest_questions
from app.models.models import ChatHistory
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


class ChatQuery(BaseModel):
    question: str
    event_id: Optional[int] = None
    tickers: Optional[List[str]] = None
    user_id: str


class SuggestQuestionsRequest(BaseModel):
    event_id: int


@router.post("/query")
async def chat_query(query_data: ChatQuery, db: Session = Depends(get_db)):
    """
    RAG-based chat query with citations
    """
    result = await query_rag(
        question=query_data.question,
        event_id=query_data.event_id,
        ticker_list=query_data.tickers,
        db=db
    )
    
    chat_history = ChatHistory(
        user_id=query_data.user_id,
        event_id=query_data.event_id,
        question=query_data.question,
        answer=result["answer"],
        citations=result.get("citations", [])
    )
    db.add(chat_history)
    db.commit()
    
    return {
        "answer": result["answer"],
        "citations": result["citations"],
        "sources": result.get("sources", [])
    }


@router.post("/suggest-questions")
async def get_suggested_questions(
    request: SuggestQuestionsRequest,
    db: Session = Depends(get_db)
):
    """Get suggested questions for an event"""
    suggestions = await suggest_questions(request.event_id, db)
    
    return {"questions": suggestions}


@router.get("/history/{user_id}")
async def get_chat_history(
    user_id: str,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get user's chat history"""
    history = db.query(ChatHistory).filter(
        ChatHistory.user_id == user_id
    ).order_by(ChatHistory.created_at.desc()).limit(limit).all()
    
    return {
        "history": [
            {
                "id": chat.id,
                "question": chat.question,
                "answer": chat.answer,
                "event_id": chat.event_id,
                "created_at": chat.created_at.isoformat()
            }
            for chat in history
        ]
    }
