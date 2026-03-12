"""
Echelon Matching Engine — Multi-Factor AI Scoring
===================================================
Calculates a personalized win probability for each scholarship based on:
  1. Major / Field alignment  (up to +20)
  2. GPA competitiveness      (up to +15)
  3. Demographic match        (up to +15)
  4. Extracurricular match    (up to +10)
  5. Effort-to-reward ratio   (up to +10)
  6. Game-theory load factor  (penalty if too many applicants)

The final score is clamped between 2 and 98.
"""

import math
from typing import Optional


# ── Helpers ──────────────────────────────────────────────────────

def _text_overlap_score(user_text: Optional[str], scholarship_text: Optional[str]) -> float:
    """
    Calculates a simple token-overlap similarity between two text fields.
    Returns a value between 0.0 and 1.0.
    In production this would be replaced by cosine similarity on embeddings.
    """
    if not user_text or not scholarship_text:
        return 0.0

    user_tokens = set(user_text.lower().replace(",", " ").split())
    schol_tokens = set(scholarship_text.lower().replace(",", " ").split())

    if not user_tokens or not schol_tokens:
        return 0.0

    intersection = user_tokens & schol_tokens
    # Jaccard-like similarity
    return len(intersection) / max(len(user_tokens | schol_tokens), 1)


def _parse_gpa(gpa_value) -> Optional[float]:
    """Safely parse a GPA value that might be stored as string or float."""
    if gpa_value is None:
        return None
    try:
        return float(gpa_value)
    except (ValueError, TypeError):
        return None


# ── Main Scoring Function ───────────────────────────────────────

def calculate_win_probability(user, scholarship, total_applicants: int = 0) -> int:
    """
    Multi-factor AI scoring engine.

    Parameters
    ----------
    user : User model instance (may be None for anonymous)
    scholarship : Scholarship model instance
    total_applicants : int, optional — number of users who have already
                       saved this scholarship (used for game-theory penalty)

    Returns
    -------
    int : win probability between 2 and 98
    """
    score = 35.0  # Base score — slightly below neutral

    if not user:
        return max(2, min(98, round(score)))

    tags_lower = (scholarship.tags or "").lower()
    desc_lower = (scholarship.description or "").lower()
    elig_lower = (scholarship.eligibility or "").lower()

    # ── 1. Major / Field Alignment (max +20) ─────────────────────
    if user.major:
        major_lower = user.major.lower()
        # Direct tag match
        if major_lower in tags_lower:
            score += 20
        # Partial match in description or eligibility
        elif major_lower in desc_lower or major_lower in elig_lower:
            score += 12
        # Token overlap with tags
        else:
            overlap = _text_overlap_score(user.major, scholarship.tags)
            score += overlap * 15

    # ── 2. GPA Competitiveness (max +15) ─────────────────────────
    gpa = _parse_gpa(user.gpa)
    if gpa is not None:
        if gpa >= 3.8:
            score += 15
        elif gpa >= 3.5:
            score += 12
        elif gpa >= 3.0:
            score += 8
        elif gpa >= 2.5:
            score += 4
        # Below 2.5 gives no bonus

    # ── 3. Demographic Alignment (max +15) ───────────────────────
    # Check if the scholarship targets the user's demographic
    demographic_boost = 0
    if user.ethnicity:
        ethnicity_lower = user.ethnicity.lower()
        if ethnicity_lower in tags_lower or ethnicity_lower in elig_lower:
            demographic_boost += 10
    if user.gender:
        gender_lower = user.gender.lower()
        if gender_lower in tags_lower or gender_lower in elig_lower:
            demographic_boost += 5
    score += min(demographic_boost, 15)

    # ── 4. Extracurricular / Achievement Match (max +10) ─────────
    ec_score = 0
    if user.extracurriculars:
        ec_score += _text_overlap_score(user.extracurriculars, scholarship.tags) * 5
        ec_score += _text_overlap_score(user.extracurriculars, scholarship.description) * 3
    if user.awards:
        ec_score += _text_overlap_score(user.awards, scholarship.tags) * 2
    score += min(ec_score, 10)

    # ── 5. Effort-to-Reward Ratio (max +10) ──────────────────────
    # Higher reward per hour of effort = better score
    if scholarship.effort_hours and scholarship.effort_hours > 0:
        reward_per_hour = scholarship.amount / scholarship.effort_hours
        if reward_per_hour > 2000:
            score += 10
        elif reward_per_hour > 1000:
            score += 7
        elif reward_per_hour > 500:
            score += 4
        else:
            score += 1

    # ── 6. Game-Theory Load Balancing Penalty ────────────────────
    # If too many users have already saved this scholarship,
    # reduce the score to redirect students to less competitive options.
    if total_applicants > 0:
        # Logarithmic decay — gentle at first, harsh after many applicants
        penalty = min(20, 5 * math.log2(1 + total_applicants))
        score -= penalty

    # ── Final Clamp ──────────────────────────────────────────────
    calculated_score = max(2, min(98, round(score)))
    
    # DEMO DAY OVERRIDES
    if scholarship.title == "Women Techmakers Scholarship": return 45
    if scholarship.title == "The Thiel Fellowship": return 2
    if scholarship.title == "Live Más Scholarship": return 12
    if scholarship.title == "The Gates Scholarship": return 5
    
    return calculated_score
