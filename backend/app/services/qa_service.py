from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.models import Event, QAItem
from app.services.openai_service import get_chat_completion
import re
import logging

logger = logging.getLogger(__name__)


async def extract_qa_items(event_id: int, transcript_text: str, db: Session) -> List[QAItem]:
    """
    Extract Q&A items from transcript with analyst info and deflection scoring
    """
    logger.info(f"Extracting Q&A for event {event_id}")
    
    qa_blocks = parse_qa_section(transcript_text)
    
    qa_items = []
    for idx, qa in enumerate(qa_blocks):
        topic = await classify_question_topic(qa["question"])
        deflection_score = calculate_deflection_score(qa["answer"])
        
        qa_item = QAItem(
            event_id=event_id,
            question_index=idx,
            analyst_name=qa.get("analyst_name"),
            analyst_firm=qa.get("analyst_firm"),
            question_text=qa["question"],
            question_timestamp=qa.get("question_timestamp"),
            answer_text=qa["answer"],
            answer_timestamp=qa.get("answer_timestamp"),
            topic=topic,
            deflection_score=deflection_score,
            meta_data={"raw_block": qa}
        )
        
        qa_items.append(qa_item)
        db.add(qa_item)
    
    db.commit()
    logger.info(f"Extracted {len(qa_items)} Q&A items for event {event_id}")
    return qa_items


def parse_qa_section(transcript: str) -> List[Dict[str, Any]]:
    """
    Parse Q&A section from transcript
    """
    qa_blocks = []
    
    lines = transcript.split("\n")
    in_qa_section = False
    current_qa = None
    
    for line in lines:
        if "Q&A" in line or "question" in line.lower() and "answer" in line.lower():
            in_qa_section = True
            continue
        
        if not in_qa_section:
            continue
        
        timestamp_match = re.match(r'\[(\d{2}:\d{2}:\d{2})\]', line.strip())
        if timestamp_match:
            timestamp = timestamp_match.group(1)
            
            analyst_pattern = r'\[?\d{2}:\d{2}:\d{2}\]?\s*([A-Za-z\s]+)(?:,\s*([A-Za-z\s&]+))?:'
            analyst_match = re.search(analyst_pattern, line)
            
            if analyst_match:
                if current_qa and current_qa.get("question"):
                    qa_blocks.append(current_qa)
                
                current_qa = {
                    "analyst_name": analyst_match.group(1).strip() if analyst_match.group(1) else None,
                    "analyst_firm": analyst_match.group(2).strip() if analyst_match.group(2) else None,
                    "question_timestamp": timestamp,
                    "question": line[analyst_match.end():].strip(),
                    "answer": "",
                    "answer_timestamp": None
                }
            elif current_qa and not current_qa.get("answer"):
                current_qa["answer_timestamp"] = timestamp
                current_qa["answer"] = line[timestamp_match.end():].strip()
            elif current_qa:
                current_qa["answer"] += " " + line.strip()
    
    if current_qa and current_qa.get("question"):
        qa_blocks.append(current_qa)
    
    return qa_blocks


async def classify_question_topic(question: str) -> str:
    """
    Classify question topic using simple keyword matching or LLM
    """
    question_lower = question.lower()
    
    if any(word in question_lower for word in ["revenue", "sales", "top line", "growth"]):
        return "revenue"
    elif any(word in question_lower for word in ["margin", "profitability", "operating income"]):
        return "margins"
    elif any(word in question_lower for word in ["guidance", "outlook", "forecast", "expect"]):
        return "guidance"
    elif any(word in question_lower for word in ["product", "launch", "innovation"]):
        return "product"
    elif any(word in question_lower for word in ["competition", "competitive", "market share"]):
        return "competition"
    elif any(word in question_lower for word in ["ai", "artificial intelligence", "machine learning"]):
        return "ai_technology"
    else:
        return "other"


def calculate_deflection_score(answer: str) -> int:
    """
    Simple heuristic deflection score (0-10)
    Higher = more deflecting/non-committal
    """
    answer_lower = answer.lower()
    score = 0
    
    hedging_phrases = [
        "we'll see", "hard to say", "difficult to predict", "too early to tell",
        "not ready to comment", "can't disclose", "not at liberty", "working on it",
        "evaluating", "exploring", "considering", "looking into"
    ]
    
    for phrase in hedging_phrases:
        if phrase in answer_lower:
            score += 2
    
    if len(answer.split()) < 30:
        score += 2
    
    if score > 10:
        score = 10
    
    return score
