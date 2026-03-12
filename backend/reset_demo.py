#!/usr/bin/env python3
"""
Echelon Demo Reset Script

One command to rule them all. Run before every demo:

    python reset_demo.py

What it does:
  1. Wipes and recreates the database
  2. Seeds all 35 scholarships
  3. Creates a demo user with a fully filled profile
  4. Pre-populates the tracker with applications in various pipeline stages

Demo credentials:
  Email:    demo@echelon.ai
  Password: demo123
"""

import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine, Base, SessionLocal
from app.core.auth import get_password_hash
from app.models.user import User
from app.models.scholarship import Scholarship
from app.models.application import Application


def reset():
    # ── 1. Nuke & recreate all tables ────────────────────────────
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Fresh database created\n")

    db = SessionLocal()

    # ── 2. Seed the base 5 scholarships (from main.py logic) ────
    base_scholarships = [
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
        },
    ]

    for item in base_scholarships:
        db.add(Scholarship(**item))
    db.commit()
    print(f"Seeded {len(base_scholarships)} base scholarships")

    # ── 3. Run the extra seed scripts inline ─────────────────────
    from seed_more_scholarships import seed_scholarships
    from seed_canadian_scholarships import seed_canadian_scholarships
    from seed_niche_scholarships import seed_niche_scholarships

    seed_scholarships()
    seed_canadian_scholarships()
    seed_niche_scholarships()

    total = db.query(Scholarship).count()
    print(f"Total scholarships in deck: {total}\n")

    # ── 4. Create demo user with filled profile ──────────────────
    demo_user = User(
        email="demo@echelon.ai",
        hashed_password=get_password_hash("demo123"),
        full_name="Fawaz Alnasser",
        dob="2004-06-15",
        gender="Male",
        ethnicity="Black/African Canadian",
        education_level="Undergrad",
        institution="University of Toronto",
        major="Computer Science",
        gpa="3.85",
        grad_year="2027",
        extracurriculars="Hackathons, Competitive Programming, Robotics Club, Open Source Contributor",
        awards="Dean's List 2024, HackTheNorth Finalist, Google Developer Student Club Lead",
        volunteer_work="Code Mentorship for underserved high school students, Food Bank volunteer",
        onboarding_complete=True,
    )
    db.add(demo_user)
    db.commit()
    db.refresh(demo_user)
    print(f"Demo user created: demo@echelon.ai / demo123")
    print(f"   Profile: CS @ UofT, 3.85 GPA, Class of 2027\n")

    # ── 5. Pre-populate the tracker with varied pipeline stages ──
    #    This makes the Kanban board look alive during demo.
    all_scholarships = db.query(Scholarship).all()

    # Map titles to desired statuses for a realistic-looking board
    tracker_presets = {
        # Saved (right-swiped but not yet applied)
        "Women Techmakers Scholarship": "Saved",
        "Generation Google Scholarship (North America)": "Saved",
        "Blacks at Microsoft (BAM) Scholarship": "Saved",
        "Diversity Advancement Scholarship": "Saved",

        # Applied
        "Amazon Future Engineer Scholarship": "Applied",
        "Tuition Scholarship for STEM": "Applied",
        "Thiel Fellowship": "Applied",

        # In Review
        "Live Más Scholarship": "In Review",
        "BBPA National Scholarship Program": "In Review",
        "President's Entrance Scholarship for Black Students": "In Review",
    }

    applied_count = 0
    for scholarship in all_scholarships:
        status = tracker_presets.get(scholarship.title)
        if status:
            app = Application(
                user_id=demo_user.id,
                scholarship_id=scholarship.id,
                status=status,
            )
            db.add(app)
            applied_count += 1

    db.commit()

    # Print a nice summary
    from collections import Counter
    status_counts = Counter(tracker_presets.values())
    print(f"Pre-loaded {applied_count} applications into the tracker:")
    for status, count in status_counts.items():
        print(f"   - {status}: {count}")

    # Remaining scholarships are unswiped — will appear in the Discover feed
    unswiped = total - applied_count
    print(f"\n{unswiped} scholarships remain in the Discover swipe deck")

    db.close()

    print("\n" + "=" * 50)
    print("DEMO READY!")
    print("=" * 50)
    print()
    print("  Start backend:   cd backend && .venv/bin/uvicorn app.main:app --port 8000")
    print("  Start frontend:  cd frontend && npm run dev")
    print("  Open:            http://localhost:3000")
    print()
    print("  Login:           demo@echelon.ai / demo123")
    print("  → Skip onboarding, go straight to Discover + Tracker")
    print()


if __name__ == "__main__":
    reset()
