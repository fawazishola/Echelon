import os
import sys

# Add the backend directory to sys.path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.scholarship import Scholarship

def seed_scholarships():
    db = SessionLocal()
    
    new_scholarships = [
        {
            "provider_name": "Microsoft",
            "title": "Tuition Scholarship for STEM",
            "amount": 15000.0,
            "deadline_days": 14,
            "effort_hours": 4.5,
            "tags": "STEM,Undergrad,Merit",
            "description": "Microsoft offers tuition scholarships to encourage student interest in STEM fields. Requires a resume and one essay on how you plan to use technology to impact your community.",
            "color_start": "from-blue-600",
            "color_end": "to-cyan-500",
            "win_probability": 0, # dynamic
        },
        {
            "provider_name": "Palantir",
            "title": "Women in Technology Scholarship",
            "amount": 7000.0,
            "deadline_days": 21,
            "effort_hours": 3.0,
            "tags": "STEM,Women,Undergrad,Grad",
            "description": "We are proud to announce the Palantir Women in Technology Scholarship, which awards grants to celebrate and support women who are beginning careers in technology.",
            "color_start": "from-slate-800",
            "color_end": "to-slate-600",
            "win_probability": 0,
        },
        {
            "provider_name": "Generation Google",
            "title": "Generation Google Scholarship (North America)",
            "amount": 10000.0,
            "deadline_days": 30,
            "effort_hours": 5.0,
            "tags": "STEM,Undergrad,Diversity,Merit",
            "description": "Established to help aspiring students pursuing computer science degrees excel in technology and become leaders in the field.",
            "color_start": "from-rose-500",
            "color_end": "to-blue-500",
            "win_probability": 0,
        },
        {
            "provider_name": "Amazon",
            "title": "Amazon Future Engineer Scholarship",
            "amount": 40000.0,
            "deadline_days": 45,
            "effort_hours": 8.0,
            "tags": "STEM,High School Senior,Need-based",
            "description": "Recipients receive $40,000 toward college tuition and a paid summer internship at Amazon after their freshman year of college.",
            "color_start": "from-amber-500",
            "color_end": "to-orange-600",
            "win_probability": 0,
        },
        {
            "provider_name": "Apple",
            "title": "Apple HBCU Scholars Program",
            "amount": 15000.0,
            "deadline_days": 60,
            "effort_hours": 4.0,
            "tags": "STEM,HBCU,Undergrad,Merit",
            "description": "Apple has partnered with the Thurgood Marshall College Fund to provide scholarships to students attending Historically Black Colleges and Universities (HBCUs).",
            "color_start": "from-neutral-700",
            "color_end": "to-neutral-900",
            "win_probability": 0,
        },
        {
            "provider_name": "BWHI",
            "title": "Black Women in STEM Scholarship",
            "amount": 5000.0,
            "deadline_days": 10,
            "effort_hours": 2.5,
            "tags": "STEM,Women,Diversity,Undergrad",
            "description": "Aimed at encouraging and supporting Black women who are pursuing undergraduate degrees in Science, Technology, Engineering, and Mathematics.",
            "color_start": "from-purple-600",
            "color_end": "to-pink-500",
            "win_probability": 0,
        },
        {
            "provider_name": "Lockheed Martin",
            "title": "Lockheed Martin STEM Scholarship",
            "amount": 10000.0,
            "deadline_days": 25,
            "effort_hours": 3.5,
            "tags": "STEM,Engineering,Undergrad,Merit",
            "description": "Open to high school and college students aiming for degrees in engineering, computer science, and related STEM fields. Highly competitive.",
            "color_start": "from-cyan-700",
            "color_end": "to-blue-800",
            "win_probability": 0,
        },
        {
            "provider_name": "Thiel Foundation",
            "title": "The Thiel Fellowship",
            "amount": 100000.0,
            "deadline_days": 120,
            "effort_hours": 20.0,
            "tags": "Entrepreneurship,Under 22,Startup",
            "description": "The Thiel Fellowship gives $100,000 to young people who want to build new things instead of sitting in a classroom.",
            "color_start": "from-orange-500",
            "color_end": "to-red-600",
            "win_probability": 0,
        },
        {
            "provider_name": "SWE",
            "title": "Society of Women Engineers Scholarships",
            "amount": 8000.0,
            "deadline_days": 40,
            "effort_hours": 3.0,
            "tags": "STEM,Women,Engineering,Undergrad,Grad",
            "description": "SWE Scholarships support those who identify as a woman and pursue an ABET-accredited bachelor or graduate student program in preparation for careers in engineering, engineering technology, and computer science in the United States.",
            "color_start": "from-teal-600",
            "color_end": "to-emerald-500",
            "win_probability": 0,
        },
        {
            "provider_name": "SME Education Foundation",
            "title": "SME Family Scholarship",
            "amount": 2500.0,
            "deadline_days": 15,
            "effort_hours": 1.5,
            "tags": "Engineering,Manufacturing,Undergrad",
            "description": "Provides financial support to students pursuing degrees or certificates in manufacturing engineering, technology, or closely related fields.",
            "color_start": "from-indigo-600",
            "color_end": "to-blue-500",
            "win_probability": 0,
        },
        {
            "provider_name": "Taco Bell Foundation",
            "title": "Live Más Scholarship",
            "amount": 25000.0,
            "deadline_days": 50,
            "effort_hours": 2.0,
            "tags": "Creative,Video,Any Major,Undergrad",
            "description": "This isn't your traditional scholarship. We won't judge you on your grades, essays, or test scores. Submit a 2-minute video about your passion.",
            "color_start": "from-violet-600",
            "color_end": "to-purple-700",
            "win_probability": 0,
        },
        {
            "provider_name": "Gates Foundation",
            "title": "The Gates Scholarship",
            "amount": 50000.0,
            "deadline_days": 90,
            "effort_hours": 10.0,
            "tags": "Diversity,Need-based,Merit,Undergrad",
            "description": "A highly selective, full-ride scholarship for exceptional, Pell-eligible, minority, high school seniors.",
            "color_start": "from-emerald-600",
            "color_end": "to-green-700",
            "win_probability": 0,
        }
    ]
    
    # Simple check to avoid duplicates if run multiple times
    existing_titles = [s.title for s in db.query(Scholarship).all()]
    
    count = 0
    for s_data in new_scholarships:
        if s_data["title"] not in existing_titles:
            new_s = Scholarship(**s_data)
            db.add(new_s)
            count += 1
            
    db.commit()
    print(f"✅ Successfully seeded {count} new scholarships into the database.")
    
if __name__ == "__main__":
    seed_scholarships()
