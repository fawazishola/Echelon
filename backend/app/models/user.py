from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    
    # Onboarding / Profile Fields
    dob = Column(String, nullable=True) # ISO format date
    gender = Column(String, nullable=True)
    ethnicity = Column(String, nullable=True) # JSON array stored as string or comma separated
    
    education_level = Column(String, nullable=True)
    institution = Column(String, nullable=True)
    major = Column(String, nullable=True)
    gpa = Column(String, nullable=True)
    grad_year = Column(String, nullable=True)
    
    extracurriculars = Column(String, nullable=True)
    awards = Column(String, nullable=True)
    volunteer_work = Column(String, nullable=True)
    
    onboarding_complete = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
