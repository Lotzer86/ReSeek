from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from app.database import get_db
from app.models.models import Watchlist, WatchlistItem
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


class WatchlistItemCreate(BaseModel):
    ticker: str
    company_name: str | None = None


@router.get("/{user_id}")
async def get_user_watchlist(user_id: str, db: Session = Depends(get_db)):
    """Get user's watchlist"""
    watchlist = db.query(Watchlist).filter(Watchlist.user_id == user_id).first()
    
    if not watchlist:
        watchlist = Watchlist(user_id=user_id, name="My Watchlist")
        db.add(watchlist)
        db.commit()
        db.refresh(watchlist)
    
    items = db.query(WatchlistItem).filter(WatchlistItem.watchlist_id == watchlist.id).all()
    
    return {
        "watchlist_id": watchlist.id,
        "name": watchlist.name,
        "items": [
            {
                "id": item.id,
                "ticker": item.ticker,
                "company_name": item.company_name,
                "added_at": item.added_at.isoformat()
            }
            for item in items
        ]
    }


@router.post("/{user_id}/items")
async def add_to_watchlist(
    user_id: str,
    item_data: WatchlistItemCreate,
    db: Session = Depends(get_db)
):
    """Add ticker to watchlist"""
    watchlist = db.query(Watchlist).filter(Watchlist.user_id == user_id).first()
    
    if not watchlist:
        watchlist = Watchlist(user_id=user_id, name="My Watchlist")
        db.add(watchlist)
        db.commit()
        db.refresh(watchlist)
    
    existing = db.query(WatchlistItem).filter(
        WatchlistItem.watchlist_id == watchlist.id,
        WatchlistItem.ticker == item_data.ticker
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Ticker already in watchlist")
    
    item = WatchlistItem(
        watchlist_id=watchlist.id,
        ticker=item_data.ticker,
        company_name=item_data.company_name
    )
    
    db.add(item)
    db.commit()
    db.refresh(item)
    
    logger.info(f"Added {item_data.ticker} to watchlist for user {user_id}")
    
    return {
        "id": item.id,
        "ticker": item.ticker,
        "company_name": item.company_name
    }


@router.delete("/items/{item_id}")
async def remove_from_watchlist(item_id: int, db: Session = Depends(get_db)):
    """Remove ticker from watchlist"""
    item = db.query(WatchlistItem).filter(WatchlistItem.id == item_id).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(item)
    db.commit()
    
    return {"message": "Item removed from watchlist"}
