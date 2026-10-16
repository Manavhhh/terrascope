from fastapi import APIRouter
from app.models.schemas import AssistantQuery, AssistantResponse
from app.services.assistant.orbit_engine import orbit_assistant
from app.routers.analysis import analysis_store
from app.routers.events import EVENT_CATALOG

router = APIRouter(prefix="/api/assistant", tags=["ORBIT AI Earth Intelligence"])

@router.post("/explain", response_model=AssistantResponse)
async def ask_orbit(query: AssistantQuery):
    """
    Submits a query to the ORBIT Earth Intelligence Assistant.
    Provides structured, physically grounded radar evidence and alternative hypotheses.
    """
    context_analysis = None
    if query.selected_analysis_id and query.selected_analysis_id in analysis_store:
        context_analysis = analysis_store[query.selected_analysis_id].model_dump()

    context_event = None
    if query.selected_event_id:
        for ev in EVENT_CATALOG:
            if ev.event_id == query.selected_event_id:
                context_event = ev.model_dump()
                break

    return await orbit_assistant.explain(query, context_analysis, context_event)
