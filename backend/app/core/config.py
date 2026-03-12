import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Echelon API"
    API_V1_STR: str = "/api"
    
    # Security
    SECRET_KEY: str = "d432b49f96ce751859bdccbfdf7e05fc867bc5beec9ded158fb7cf0cc1eb2b89" # Use os.getenv in prod
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database
    DATABASE_URL: str = "sqlite:///./echelon.db"
    
    class Config:
        case_sensitive = True

settings = Settings()
