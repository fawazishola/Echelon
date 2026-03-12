from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.scholarships import router as scholarships_router
from app.api.swipe import router as swipe_router
from app.api.applications import router as applications_router
from app.api.profile_stats import router as profile_stats_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(profile_stats_router, prefix="/users", tags=["users"])
api_router.include_router(scholarships_router, prefix="/scholarships", tags=["scholarships"])
api_router.include_router(swipe_router, prefix="/swipe", tags=["swipe"])
api_router.include_router(applications_router, prefix="/applications", tags=["applications"])
