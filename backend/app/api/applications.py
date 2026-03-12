from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from pydantic import BaseModel

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.application import Application
from app.models.scholarship import Scholarship

router = APIRouter()

class ApplicationUpdate(BaseModel):
    status: str

@router.get("")
def get_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.services.matching.engine import calculate_win_probability

    # Only return applications that are not skipped
    apps = db.query(Application).filter(
        Application.user_id == current_user.id,
        Application.status != "Skipped"
    ).all()
    
    result = []
    for app in apps:
        scholarship = db.query(Scholarship).filter(Scholarship.id == app.scholarship_id).first()
        if scholarship:
            # Count applicants for game-theory penalty
            applicant_count = db.query(Application).filter(
                Application.scholarship_id == scholarship.id,
                Application.status == "Saved"
            ).count()
            personalized_prob = calculate_win_probability(current_user, scholarship, total_applicants=applicant_count)

            result.append({
                "id": str(app.id),
                "scholarship_id": str(scholarship.id),
                "status": app.status,
                "provider_name": scholarship.provider_name,
                "title": scholarship.title,
                "amount": scholarship.amount,
                "deadline_days": scholarship.deadline_days,
                "win_probability": personalized_prob,
                "color_start": scholarship.color_start,
                "color_end": scholarship.color_end,
            })
            
    return result

@router.patch("/{app_id}")
def update_application(
    app_id: int,
    update_data: ApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(
        Application.id == app_id,
        Application.user_id == current_user.id
    ).first()
    
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    app.status = update_data.status
    db.commit()
    db.refresh(app)
    
    return {"status": "updated", "new_status": app.status}
