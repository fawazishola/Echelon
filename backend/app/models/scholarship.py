from sqlalchemy import Column, Integer, String
from app.core.database import Base

class Scholarship(Base):
    __tablename__ = "scholarships"

    id = Column(Integer, primary_key=True, index=True)
    provider_name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    amount = Column(Integer, nullable=False)
    
    deadline_days = Column(Integer, default=30)
    effort_hours = Column(Integer, default=2)
    win_probability = Column(Integer, default=50) # In a real app this is calculated per-user, storing static for demo
    
    tags = Column(String, nullable=True) # Comma separated
    description = Column(String, nullable=True)
    eligibility = Column(String, nullable=True) # Comma separated or JSON string
    
    color_start = Column(String, nullable=True)
    color_end = Column(String, nullable=True)
