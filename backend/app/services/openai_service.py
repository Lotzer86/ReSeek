import openai
from typing import List, Dict, Any
from app.config import get_settings
import tiktoken
import logging

logger = logging.getLogger(__name__)
settings = get_settings()

openai.api_key = settings.openai_api_key


async def get_embedding(text: str, model: str = "text-embedding-3-large") -> List[float]:
    """Generate embedding for text using OpenAI"""
    try:
        response = await openai.embeddings.create(
            model=model,
            input=text
        )
        return response.data[0].embedding
    except Exception as e:
        logger.error(f"Error generating embedding: {e}")
        raise


async def get_chat_completion(
    messages: List[Dict[str, str]],
    model: str = "gpt-4o-mini",
    temperature: float = 0.7,
    max_tokens: int = 2000
) -> str:
    """Get chat completion from OpenAI"""
    try:
        response = await openai.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Error getting chat completion: {e}")
        raise


def count_tokens(text: str, model: str = "gpt-4o-mini") -> int:
    """Count tokens in text"""
    try:
        encoding = tiktoken.encoding_for_model(model)
        return len(encoding.encode(text))
    except:
        return len(text) // 4


def chunk_text(text: str, max_tokens: int = 500, overlap: int = 50) -> List[Dict[str, Any]]:
    """
    Chunk text into segments of approximately max_tokens with overlap.
    Returns list of chunks with metadata.
    """
    encoding = tiktoken.get_encoding("cl100k_base")
    tokens = encoding.encode(text)
    chunks = []
    
    start = 0
    chunk_index = 0
    
    while start < len(tokens):
        end = min(start + max_tokens, len(tokens))
        chunk_tokens = tokens[start:end]
        chunk_text = encoding.decode(chunk_tokens)
        
        chunks.append({
            "chunk_index": chunk_index,
            "text": chunk_text,
            "token_count": len(chunk_tokens),
            "start_token": start,
            "end_token": end
        })
        
        chunk_index += 1
        start = end - overlap if end < len(tokens) else end
    
    return chunks
