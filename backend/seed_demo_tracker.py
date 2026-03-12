import os
import sys

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.scholarship import Scholarship
from app.models.user import User
from app.models.application import Application

def seed_demo_tracker():
    db = SessionLocal()
    
    # 1. Ensure the demo user exists
    user = db.query(User).filter(User.email == "demo@echelon.ai").first()
    if not user:
        print("❌ Demo user not found!")
        return
        
    # 2. Define the 4 target scholarships
    targets = [
        {
            "provider_name": "Google",
            "title": "Women Techmakers Scholarship",
            "amount": 10000.0,
            "deadline_days": 12,
            "effort_hours": 5.0,
            "tags": "STEM,Women,Tech",
            "description": "Through the Women Techmakers Scholars Program, Google is building programs and resources for women in technology.",
            "color_start": "from-red-500",
            "color_end": "to-yellow-500",
            "win_probability": 0,
        },
        {
            "provider_name": "Thiel Foundation",
            "title": "The Thiel Fellowship",
            "amount": 100000.0,
            "deadline_days": 45,
            "effort_hours": 20.0,
            "tags": "Entrepreneurship,Under 22,Startup",
            "description": "The Thiel Fellowship gives $100,000 to young people who want to build new things instead of sitting in a classroom.",
            "color_start": "from-orange-500",
            "color_end": "to-red-600",
            "win_probability": 0,
        },
        {
            "provider_name": "Taco Bell Foundation",
            "title": "Live Más Scholarship",
            "amount": 25000.0,
            "deadline_days": 5,
            "effort_hours": 2.0,
            "tags": "Creative,Video,Any Major,Undergrad",
            "description": "This isn't your traditional scholarship. Submit a 2-minute video about your passion.",
            "color_start": "from-violet-600",
            "color_end": "to-purple-700",
            "win_probability": 0,
        },
        {
            "provider_name": "Gates Foundation",
            "title": "The Gates Scholarship",
            "amount": 50000.0,
            "deadline_days": 120,
            "effort_hours": 10.0,
            "tags": "Diversity,Need-based,Merit,Undergrad",
            "description": "A highly selective, full-ride scholarship for exceptional, Pell-eligible, minority, high school seniors.",
            "color_start": "from-emerald-600",
            "color_end": "to-green-700",
            "win_probability": 0,
        }
    ]
    
    # 3. Create or update them in the DB
    scholarship_ids = []
    for data in targets:
        s = db.query(Scholarship).filter(Scholarship.title == data["title"]).first()
        if s:
            # Update existing to match the exact specs the user wants
            s.amount = data["amount"]
            s.deadline_days = data["deadline_days"]
            s.provider_name = data["provider_name"]
            s.color_start = data.get("color_start")
            s.color_end = data.get("color_end")
            s.description = data.get("description")
            s.tags = data.get("tags")
            db.commit()
            scholarship_ids.append(s.id)
        else:
            # Create new
            new_s = Scholarship(**data)
            db.add(new_s)
            db.commit()
            db.refresh(new_s)
            scholarship_ids.append(new_s.id)
            
    # 4. Clear all existing applications for the demo user
    db.query(Application).filter(Application.user_id == user.id).delete()
    db.commit()
    
    # 5. Add applications for these 4 specific scholarships as "Saved"
    for s_id in scholarship_ids:
        app = Application(
            user_id=user.id,
            scholarship_id=s_id,
            status="Saved"
        )
        db.add(app)
        
    db.commit()
    print("✅ Successfully populated the Tracker Kanban board with the 4 requested demo scholarships!")

if __name__ == "__main__":
    seed_demo_tracker()
