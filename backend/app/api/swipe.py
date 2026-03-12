from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.scholarship import Scholarship
from app.models.application import Application

router = APIRouter()

class SwipeAction(BaseModel):
    scholarship_id: int
    action: str  # "save" or "skip"

@router.post("")
def record_swipe(
    action_in: SwipeAction,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if scholarship exists
    scholarship = db.query(Scholarship).filter(Scholarship.id == action_in.scholarship_id).first()
    if not scholarship:
        raise HTTPException(status_code=404, detail="Scholarship not found")
        
    # Check if action already exists
    existing = db.query(Application).filter(
        Application.user_id == current_user.id,
        Application.scholarship_id == action_in.scholarship_id
    ).first()
    
    if existing:
        # Update existing
        if action_in.action == "save":
            existing.status = "Saved"
        elif action_in.action == "skip":
            existing.status = "Skipped"
        db.commit()
        return {"status": "updatedAction"}
        
    # Create new
    status = "Saved" if action_in.action == "save" else "Skipped"
    new_app = Application(
        user_id=current_user.id,
        scholarship_id=action_in.scholarship_id,
        status=status
    )
    db.add(new_app)
    db.commit()
    
    return {"status": "recorded"}

@router.get("/feed")
def get_swipe_feed(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.services.matching.engine import calculate_win_probability

    # Return scholarships that the user hasn't skipped or saved
    seen_ids = [
        app.scholarship_id for app in db.query(Application).filter(Application.user_id == current_user.id).all()
    ]
    
    query = db.query(Scholarship)
    if seen_ids:
        query = query.filter(~Scholarship.id.in_(seen_ids))
        
    # Limit to 10 for the feed
    scholarships = query.limit(10).all()
    
    # We need to reshape slightly for the frontend which expects arrays for tags and color classes
    result = []
    for s in scholarships:
        tags_list = s.tags.split(",") if s.tags else []

        # Count how many users have already saved this scholarship (for game-theory penalty)
        applicant_count = db.query(Application).filter(
            Application.scholarship_id == s.id,
            Application.status == "Saved"
        ).count()

        # Calculate personalized win probability using multi-factor AI engine
        personalized_prob = calculate_win_probability(current_user, s, total_applicants=applicant_count)

        result.append({
            "id": str(s.id),
            "provider_name": s.provider_name,
            "title": s.title,
            "amount": s.amount,
            "deadline_days": s.deadline_days,
            "win_probability": personalized_prob,
            "effort_hours": s.effort_hours,
            "tags": tags_list,
            "description": s.description,
            "color_start": s.color_start,
            "color_end": s.color_end
        })
    
    # Sort by win probability descending — best matches first
    result.sort(key=lambda x: x["win_probability"], reverse=True)
        
    return result

