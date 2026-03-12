from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.api import api_router
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.models.scholarship import Scholarship

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

def seed_db():
    db = SessionLocal()
    if db.query(Scholarship).count() == 0:
        print("Seeding database with mock scholarships...")
        mock_data = [
            {
                "provider_name": "Google",
                "title": "Women Techmakers Scholarship",
                "amount": 10000,
                "deadline_days": 12,
                "win_probability": 45,
                "effort_hours": 3,
                "tags": "STEM,Women,Undergrad",
                "description": "For women studying computer science or a related field. Essay required about your impact on the community.",
                "color_start": "from-blue-500",
                "color_end": "to-blue-700",
            },
            {
                "provider_name": "Thiel",
                "title": "Thiel Fellowship",
                "amount": 100000,
                "deadline_days": 45,
                "win_probability": 2,
                "effort_hours": 15,
                "tags": "Entrepreneurship,Dropout,Tech",
                "description": "For young people who want to build new things instead of sitting in a classroom.",
                "color_start": "from-orange-400",
                "color_end": "to-rose-500",
            },
            {
                "provider_name": "Taco Bell",
                "title": "Live Más Scholarship",
                "amount": 25000,
                "deadline_days": 5,
                "win_probability": 12,
                "effort_hours": 1,
                "tags": "Video,Creative,No-Essay",
                "description": "Create a 2-minute video about your passion. No grades or essays required.",
                "color_start": "from-purple-600",
                "color_end": "to-indigo-900",
            },
            {
                "provider_name": "Burger King",
                "title": "Burger King Scholars",
                "amount": 1000,
                "deadline_days": 28,
                "win_probability": 65,
                "effort_hours": 2,
                "tags": "High School,GPA 2.5+,Community",
                "description": "For high school seniors with a strong academic record and community service experience.",
                "color_start": "from-amber-500",
                "color_end": "to-amber-700",
            },
            {
                "provider_name": "Gates",
                "title": "The Gates Scholarship",
                "amount": 50000,
                "deadline_days": 120,
                "win_probability": 5,
                "effort_hours": 20,
                "tags": "Minority,Low-Income,Leadership",
                "description": "A highly selective, last-dollar scholarship for outstanding minority students.",
                "color_start": "from-slate-700",
                "color_end": "to-slate-900",
            }
        ]
        
        for item in mock_data:
            db.add(Scholarship(**item))
            
        db.commit()
    db.close()

@app.on_event("startup")
def on_startup():
    seed_db()

@app.get("/")
def root():
    return {"message": "Welcome to Echelon API"}
