from datetime import datetime
from fastapi import APIRouter
from app.config import settings

router = APIRouter(prefix="/api", tags=["System"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "app_name": settings.app_name,
        "tagline": settings.tagline,
        "version": settings.version,
        "environment": settings.environment,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "services": {
            "radar_engine": "operational",
            "asf_provider": "operational",
            "bhoonidhi_provider": "operational",
            "orbit_assistant": "operational",
            "demonstrations": "ready"
        }
    }
