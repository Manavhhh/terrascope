from typing import List
from fastapi import APIRouter, HTTPException
from app.models.schemas import DemoInvestigation
from app.services.demo_investigations import demo_service
from app.routers.analysis import analysis_store

router = APIRouter(prefix="/api/demo", tags=["Prebuilt Demonstrations"])

# Pre-populate analysis store with precomputed demo analyses
for inv in demo_service.get_all():
    analysis_store[inv.precomputed_analysis.analysis_id] = inv.precomputed_analysis

@router.get("/investigations", response_model=List[DemoInvestigation])
def list_demo_investigations():
    """Returns all 3 prebuilt, scientifically validated demonstration investigations."""
    return demo_service.get_all()

@router.get("/investigations/{investigation_id}", response_model=DemoInvestigation)
def get_demo_investigation(investigation_id: str):
    """Retrieves a specific prebuilt demonstration investigation."""
    inv = demo_service.get_by_id(investigation_id)
    if inv:
        return inv
    raise HTTPException(status_code=404, detail=f"Investigation '{investigation_id}' not found.")
