from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models.models import User, Profile
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


class UserCreate(BaseModel):
    id: str
    email: str


class ProfileUpdate(BaseModel):
    name: str | None = None
    locale: str | None = None
    timezone: str | None = None


@router.post("/users")
async def create_or_get_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Create or retrieve user (called after Supabase auth)
    """
    user = db.query(User).filter(User.id == user_data.id).first()
    
    if not user:
        user = User(id=user_data.id, email=user_data.email)
        db.add(user)
        db.commit()
        db.refresh(user)
        
        profile = Profile(user_id=user.id)
        db.add(profile)
        db.commit()
        
        logger.info(f"Created new user: {user.email}")
    
    return {"user": {"id": user.id, "email": user.email}}


@router.get("/profile/{user_id}")
async def get_profile(user_id: str, db: Session = Depends(get_db)):
    """Get user profile"""
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "name": profile.name,
        "locale": profile.locale,
        "timezone": profile.timezone
    }


@router.put("/profile/{user_id}")
async def update_profile(
    user_id: str,
    profile_data: ProfileUpdate,
    db: Session = Depends(get_db)
):
    """Update user profile"""
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    if profile_data.name is not None:
        profile.name = profile_data.name
    if profile_data.locale is not None:
        profile.locale = profile_data.locale
    if profile_data.timezone is not None:
        profile.timezone = profile_data.timezone
    
    db.commit()
    db.refresh(profile)
    
    return {"message": "Profile updated", "profile": {
        "name": profile.name,
        "locale": profile.locale,
        "timezone": profile.timezone
    }}
