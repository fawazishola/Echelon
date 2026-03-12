from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.scholarship import Scholarship
from app.models.application import Application

router = APIRouter()

class ScholarshipResponse(BaseModel):
    id: int
    provider_name: str
    title: str
    amount: int
    deadline_days: int
    effort_hours: float
    win_probability: int
    tags: Optional[str] = None
    description: Optional[str] = None
    eligibility: Optional[str] = None
    color_start: Optional[str] = None
    color_end: Optional[str] = None
    
    class Config:
        from_attributes = True

@router.get("", response_model=List[ScholarshipResponse])
def list_scholarships(db: Session = Depends(get_db)):
    return db.query(Scholarship).all()

@router.get("/{scholarship_id}", response_model=ScholarshipResponse)
def get_scholarship(
    scholarship_id: int, 
    db: Session = Depends(get_db)
):
    scholarship = db.query(Scholarship).filter(Scholarship.id == scholarship_id).first()
    if not scholarship:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    return scholarship
