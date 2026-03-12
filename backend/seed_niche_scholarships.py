import os
import sys

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.scholarship import Scholarship

def seed_niche_scholarships():
    db = SessionLocal()
    
    niche_scholarships = [
        {
            "provider_name": "AABE (American Association of Blacks in Energy)",
            "title": "AABE National Scholarship",
            "amount": 5000.0,
            "deadline_days": 45,
            "effort_hours": 3.0,
            "tags": "STEM,Energy,Black/African American,High School Senior",
            "description": "For African American high school seniors with a 3.0 GPA who plan to major in business, engineering, technology, mathematics or physical science fields in preparation for a career in the energy sector.",
            "color_start": "from-emerald-600",
            "color_end": "to-teal-500",
            "win_probability": 0,
        },
        {
            "provider_name": "Knoll",
            "title": "Diversity Advancement Design Scholarship",
            "amount": 10000.0,
            "deadline_days": 30,
            "effort_hours": 6.0,
            "tags": "Design,Architecture,Black/African American,Grade 12",
            "description": "Tuition scholarship up to $10,000 for Black high school seniors planning to study architecture, graphic design, industrial design, or interior design. Portfolio required.",
            "color_start": "from-slate-800",
            "color_end": "to-neutral-900",
            "win_probability": 0,
        },
        {
            "provider_name": "Microsoft",
            "title": "Blacks at Microsoft (BAM) Scholarship",
            "amount": 20000.0,
            "deadline_days": 60,
            "effort_hours": 5.0,
            "tags": "STEM,Computer Science,Black/African American,High School Senior",
            "description": "Dedicated to supporting the continued growth of black high school seniors interested in pursuing careers in technology. 50 scholarships awarded, ranging from $2500 to $20000.",
            "color_start": "from-blue-600",
            "color_end": "to-indigo-500",
            "win_probability": 0,
        },
        {
            "provider_name": "Mae & Mary Foundation",
            "title": "Mae & Mary Legacy Scholarship",
            "amount": 2000.0,
            "deadline_days": 21,
            "effort_hours": 2.5,
            "tags": "Healthcare,Medical,Black/African American,Grade 12",
            "description": "A charitable organization dedicated to the advancement of Black Americans pursuing careers in the medical and healthcare professions. Often goes un-applied for outside of local networks.",
            "color_start": "from-rose-500",
            "color_end": "to-pink-600",
            "win_probability": 0,
        },
        {
            "provider_name": "CBC Spouses",
            "title": "Performing Arts Scholarship",
            "amount": 5000.0,
            "deadline_days": 90,
            "effort_hours": 8.0,
            "tags": "Arts,Music,Drama,Black/African American",
            "description": "For Black/African American high school seniors or college students pursuing a degree in performing arts (drama, music, dance, opera, marching bands, etc). Requires an audition tape.",
            "color_start": "from-purple-600",
            "color_end": "to-fuchsia-500",
            "win_probability": 0,
        },
        {
            "provider_name": "Illinois CPA Society",
            "title": "Herman J. Neal Accounting Scholarship",
            "amount": 4000.0,
            "deadline_days": 40,
            "effort_hours": 3.0,
            "tags": "Accounting,Finance,Black/African American,Illinois",
            "description": "Supports African American students (including high school seniors entering college) in Illinois pursuing an accounting degree and the CPA designation. A highly specific niche with low competition.",
            "color_start": "from-blue-700",
            "color_end": "to-cyan-600",
            "win_probability": 0,
        },
        {
            "provider_name": "BLM² Foundation",
            "title": "Community Leadership Scholarship",
            "amount": 1000.0,
            "deadline_days": 15,
            "effort_hours": 2.0,
            "tags": "Leadership,Community Service,Black/African American,Grade 12",
            "description": "Awards $1000 to graduating high school seniors passionate about community service. Must submit a short essay detailing community impact.",
            "color_start": "from-amber-500",
            "color_end": "to-orange-500",
            "win_probability": 0,
        },
        {
            "provider_name": "NFP / FNSNA",
            "title": "Tubman Scholar Scholarship",
            "amount": 3000.0,
            "deadline_days": 35,
            "effort_hours": 3.5,
            "tags": "Nursing,Healthcare,Black/African American",
            "description": "Dedicated to supporting Black nursing students (including incoming freshmen). Helps build the pipeline of African American nurses.",
            "color_start": "from-teal-500",
            "color_end": "to-emerald-400",
            "win_probability": 0,
        },
        {
            "provider_name": "Architects Foundation",
            "title": "Diversity Advancement Scholarship",
            "amount": 20000.0,
            "deadline_days": 75,
            "effort_hours": 10.0,
            "tags": "Architecture,Design,Minority,High School",
            "description": "Multi-year scholarship up to $20k for high school students planning to enroll in a NAAB-accredited architecture program. Requires portfolio and letters of rec.",
            "color_start": "from-slate-700",
            "color_end": "to-zinc-600",
            "win_probability": 0,
        },
        {
            "provider_name": "Real Estate / MLR",
            "title": "Marki Lemons Ryhal Education Scholarship",
            "amount": 1500.0,
            "deadline_days": 20,
            "effort_hours": 1.5,
            "tags": "Real Estate,Business,Black/African American Women,Chicagoland",
            "description": "Hyper-niche scholarship supporting African American women in Chicagoland seeking a real estate career or attending an HBCU.",
            "color_start": "from-indigo-500",
            "color_end": "to-violet-500",
            "win_probability": 0,
        }
    ]
    
    existing_titles = [s.title for s in db.query(Scholarship).all()]
    
    count = 0
    for s_data in niche_scholarships:
        if s_data["title"] not in existing_titles:
            new_s = Scholarship(**s_data)
            db.add(new_s)
            count += 1
            
    db.commit()
    print(f"✅ Successfully seeded {count} niche African American scholarships into the database.")
    
if __name__ == "__main__":
    seed_niche_scholarships()
