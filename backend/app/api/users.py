from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter()

class UserUpdate(BaseModel):
    # Personal
    full_name: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    ethnicity: Optional[str] = None
    
    # Academic
    education_level: Optional[str] = None
    institution: Optional[str] = None
    major: Optional[str] = None
    gpa: Optional[float] = None
    grad_year: Optional[str] = None
    
    # Achievements
    extracurriculars: Optional[str] = None
    awards: Optional[str] = None
    volunteer_work: Optional[str] = None
    
    onboarding_complete: Optional[bool] = None

class UserProfile(UserUpdate):
    id: int
    email: str
    
    class Config:
        from_attributes = True

@router.get("/me", response_model=UserProfile)
def read_user_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserProfile)
def update_user_me(
    user_in: UserUpdate, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    update_data = user_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        # Handle GPA conversion if it comes as float but we store as string
        if field == "gpa" and value is not None:
             setattr(current_user, field, str(value))
        else:
            setattr(current_user, field, value)
            
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user
