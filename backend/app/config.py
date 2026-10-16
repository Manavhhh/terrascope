import os
from typing import List
from pydantic import BaseModel

class Settings(BaseModel):
    app_name: str = "TERRA//SCOPE"
    tagline: str = "SEE WHAT EARTH IS BECOMING"
    version: str = "1.0.0"
    environment: str = os.getenv("ENVIRONMENT", "development")
    port: int = int(os.getenv("PORT", "8000"))
    host: str = os.getenv("HOST", "0.0.0.0")
    
    # CORS
    cors_origins: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # Credentials (Optional - Graceful degradation enabled)
    earthdata_username: str = os.getenv("EARTHDATA_USERNAME", "")
    earthdata_password: str = os.getenv("EARTHDATA_PASSWORD", "")
    earthdata_bearer_token: str = os.getenv("EARTHDATA_BEARER_TOKEN", "")
    
    isro_bhoonidhi_api_key: str = os.getenv("ISRO_BHOONIDHI_API_KEY", "")
    
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")

settings = Settings()
