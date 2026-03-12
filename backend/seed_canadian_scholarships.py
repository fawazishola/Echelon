import os
import sys

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.scholarship import Scholarship

def seed_canadian_scholarships():
    db = SessionLocal()
    
    canadian_scholarships = [
        {
            "provider_name": "Western University",
            "title": "President's Entrance Scholarship for Black Students",
            "amount": 50000.0,
            "deadline_days": 60,
            "effort_hours": 10.0,
            "tags": "Canada,Black/African Canadian,Undergrad,Merit",
            "description": "Recognizes outstanding academic performance, creative and innovative thought, and exceptional achievement in extracurricular activities for Black students entering Western University.",
            "color_start": "from-purple-800",
            "color_end": "to-purple-600",
            "win_probability": 0,
        },
        {
            "provider_name": "Canadian Institute of Planners",
            "title": "Diversity Impact Bursary",
            "amount": 5000.0,
            "deadline_days": 45,
            "effort_hours": 4.0,
            "tags": "Canada,Urban Planning,Black/African Canadian",
            "description": "Addresses under-representation in the planning profession. Designed for undergraduate Black students and students of colour in Canada.",
            "color_start": "from-blue-600",
            "color_end": "to-cyan-500",
            "win_probability": 0,
        },
        {
            "provider_name": "University of Calgary",
            "title": "Roy Oliver Lindseth Undergraduate Award in Diversity",
            "amount": 2000.0,
            "deadline_days": 30,
            "effort_hours": 2.5,
            "tags": "Canada,Diversity,Black/African Canadian,Undergrad",
            "description": "Awarded to continuing undergraduate students who have demonstrated active commitment to equity, diversity, and inclusion in their communities.",
            "color_start": "from-red-600",
            "color_end": "to-red-400",
            "win_probability": 0,
        },
        {
            "provider_name": "BBPA",
            "title": "BBPA National Scholarship Program",
            "amount": 3000.0,
            "deadline_days": 40,
            "effort_hours": 5.0,
            "tags": "Canada,Black/African Canadian,Merit,Community",
            "description": "Supports academic excellence for Black Canadian youth across the country. Based on academics, community involvement, and financial need.",
            "color_start": "from-amber-500",
            "color_end": "to-orange-600",
            "win_probability": 0,
        },
        {
            "provider_name": "Donald Moore Canada",
            "title": "Donald Moore Canada Scholarship",
            "amount": 1500.0,
            "deadline_days": 20,
            "effort_hours": 2.0,
            "tags": "Canada,Black/African Canadian,Any Field",
            "description": "Aims to reduce the financial burden of education and increase the representation of Black Canadians in all fields of study.",
            "color_start": "from-zinc-700",
            "color_end": "to-neutral-900",
            "win_probability": 0,
        },
        {
            "provider_name": "TD Bank",
            "title": "TD Scholarship for Black Students",
            "amount": 70000.0,
            "deadline_days": 120,
            "effort_hours": 15.0,
            "tags": "Canada,Black/African Canadian,Leadership",
            "description": "Recognizes academic excellence, leadership, and community involvement in Black Canadian students. Covers tuition, living expenses, and offers summer work.",
            "color_start": "from-emerald-700",
            "color_end": "to-green-600",
            "win_probability": 0,
        },
        {
            "provider_name": "Black Lives Matter Canada",
            "title": "BLM Canada Scholarship Fund",
            "amount": 2500.0,
            "deadline_days": 25,
            "effort_hours": 3.0,
            "tags": "Canada,Black/African Canadian,Social Justice",
            "description": "Supports Black Canadian students across various disciplines who show a commitment to community work and social justice.",
            "color_start": "from-slate-900",
            "color_end": "to-black",
            "win_probability": 0,
        },
        {
            "provider_name": "NBCC",
            "title": "National Black Coalition of Canada Scholarship",
            "amount": 1000.0,
            "deadline_days": 15,
            "effort_hours": 2.0,
            "tags": "Canada,Black/African Canadian,Social Justice",
            "description": "Supports undergraduate students committed to promoting social justice, education, and community development within Canada.",
            "color_start": "from-indigo-600",
            "color_end": "to-blue-700",
            "win_probability": 0,
        },
        {
            "provider_name": "Ottawa Community Foundation",
            "title": "Black Canadian Scholarship Fund",
            "amount": 5000.0,
            "deadline_days": 35,
            "effort_hours": 4.5,
            "tags": "Canada,Ottawa,Black/African Canadian,Merit",
            "description": "For Black youth in Ottawa graduating from high school with a 75%+ average and demonstrating strong community leadership.",
            "color_start": "from-teal-600",
            "color_end": "to-emerald-500",
            "win_probability": 0,
        },
        {
            "provider_name": "CCAWR",
            "title": "Caribbean Canadian Association Scholarship",
            "amount": 1500.0,
            "deadline_days": 30,
            "effort_hours": 2.5,
            "tags": "Canada,Caribbean,Waterloo,Black/African Canadian",
            "description": "For Caribbean-Canadian students in the Waterloo region pursuing post-secondary education in Canada. Promotes excellence and community leadership.",
            "color_start": "from-fuchsia-600",
            "color_end": "to-pink-500",
            "win_probability": 0,
        }
    ]
    
    existing_titles = [s.title for s in db.query(Scholarship).all()]
    
    count = 0
    for s_data in canadian_scholarships:
        if s_data["title"] not in existing_titles:
            new_s = Scholarship(**s_data)
            db.add(new_s)
            count += 1
            
    db.commit()
    print(f"✅ Successfully seeded {count} Canadian Black student scholarships into the database.")
    
if __name__ == "__main__":
    seed_canadian_scholarships()
