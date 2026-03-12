from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func as sql_func

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.application import Application
from app.models.scholarship import Scholarship

router = APIRouter()

# Profile fields used to compute completeness
PROFILE_FIELDS = [
    "full_name", "dob", "gender", "ethnicity",
    "education_level", "institution", "major", "gpa", "grad_year",
    "extracurriculars", "awards", "volunteer_work",
]


@router.get("/me/stats")
def get_profile_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # ---- Funnel counts ----
    def _count(status: str) -> int:
        return (
            db.query(sql_func.count(Application.id))
            .filter(
                Application.user_id == current_user.id,
                Application.status == status,
            )
            .scalar()
            or 0
        )

    saved_count = _count("Saved")
    applied_count = _count("Applied")
    won_count = _count("Won")
    lost_count = _count("Lost")

    # ---- Dollar totals ----
    total_won = (
        db.query(sql_func.coalesce(sql_func.sum(Scholarship.amount), 0))
        .join(Application, Application.scholarship_id == Scholarship.id)
        .filter(
            Application.user_id == current_user.id,
            Application.status == "Won",
        )
        .scalar()
    )

    total_potential_value = (
        db.query(sql_func.coalesce(sql_func.sum(Scholarship.amount), 0))
        .join(Application, Application.scholarship_id == Scholarship.id)
        .filter(
            Application.user_id == current_user.id,
            Application.status != "Skipped",
        )
        .scalar()
    )

    # ---- Win rate ----
    outcomes = won_count + lost_count
    win_rate = round((won_count / outcomes) * 100) if outcomes > 0 else 0

    # ---- Profile completeness ----
    filled = 0
    missing_fields: list[str] = []
    for field in PROFILE_FIELDS:
        value = getattr(current_user, field, None)
        if value and str(value).strip():
            filled += 1
        else:
            missing_fields.append(field)

    profile_completeness = round((filled / len(PROFILE_FIELDS)) * 100)

    return {
        "total_won": total_won,
        "total_potential_value": total_potential_value,
        "applied_count": applied_count,
        "saved_count": saved_count,
        "won_count": won_count,
        "lost_count": lost_count,
        "win_rate": win_rate,
        "profile_completeness": profile_completeness,
        "missing_fields": missing_fields,
    }
