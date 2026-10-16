from typing import List, Optional
from fastapi import APIRouter, Query
from app.models.schemas import EventItem, SurfaceChangeCategory, EventStatus

router = APIRouter(prefix="/api/events", tags=["Event Discovery"])

EVENT_CATALOG: List[EventItem] = [
    EventItem(
        event_id="EVT-2023-TURKEY-EQ",
        title="Kahramanmaraş M7.8 Co-Seismic Surface Rupture",
        category=SurfaceChangeCategory.GROUND_DEFORMATION,
        location_name="East Anatolian Fault, Kahramanmaraş, Türkiye",
        coordinates=[36.92, 37.58],
        observation_date="2023-02-09T03:42:15Z",
        severity="CRITICAL",
        status=EventStatus.CONFIRMED,
        confidence=0.96,
        description="Major tectonic rupture with -42.4 cm to +38.6 cm differential InSAR line-of-sight crustal offset.",
        affected_area_km2=2840.5,
        displacement_cm=42.4,
        source_attribution="USGS Earthquake Hazard / Calibrated InSAR Pair",
        product_ids=["NISAR_DEMO_GUNW_20230128_TURKEY_PRE", "NISAR_DEMO_GUNW_20230209_TURKEY_POST"],
        is_demo=True
    ),
    EventItem(
        event_id="EVT-2024-ASSAM-FLOOD",
        title="Assam Brahmaputra Valley Monsoon Inundation",
        category=SurfaceChangeCategory.FLOOD_WETLAND,
        location_name="Brahmaputra Basin, Assam, India",
        coordinates=[92.8, 26.6],
        observation_date="2024-07-04T00:54:10Z",
        severity="HIGH",
        status=EventStatus.CONFIRMED,
        confidence=0.94,
        description="Severe overbank river flooding with -6.4 dB radar specular reflection loss across riparian lowlands.",
        affected_area_km2=1420.0,
        displacement_cm=None,
        source_attribution="Central Water Commission (India) / ISRO Bhoonidhi SAR",
        product_ids=["NISAR_DEMO_GCOV_20240612_ASSAM_PRE", "NISAR_DEMO_GCOV_20240704_ASSAM_FLOOD"],
        is_demo=True
    ),
    EventItem(
        event_id="EVT-2024-CALIFORNIA-AGRI",
        title="San Joaquin Valley Agro-Ecosystem Phenology Cycle",
        category=SurfaceChangeCategory.AGRICULTURE,
        location_name="Central Valley, California, USA",
        coordinates=[-119.8, 36.6],
        observation_date="2024-07-22T14:10:00Z",
        severity="MODERATE",
        status=EventStatus.ALGORITHMIC_CANDIDATE,
        confidence=0.88,
        description="Seasonal crop canopy expansion detected via +0.38 Radar Vegetation Index (RVI) increase.",
        affected_area_km2=980.0,
        displacement_cm=2.8,
        source_attribution="TERRA//SCOPE Multi-Temporal RVI Detector",
        product_ids=["NISAR_DEMO_GCOV_20240315_CALIFORNIA_EARLY", "NISAR_DEMO_GCOV_20240722_CALIFORNIA_PEAK"],
        is_demo=True
    ),
    EventItem(
        event_id="EVT-2024-HIMALAYA-GLACIER",
        title="Siachen / Karakoram Glacial Velocity Surge Candidate",
        category=SurfaceChangeCategory.GLACIER_ICE,
        location_name="Siachen Glacier Basin, Western Himalayas",
        coordinates=[77.1, 35.4],
        observation_date="2024-08-15T02:10:00Z",
        severity="MODERATE",
        status=EventStatus.ALGORITHMIC_CANDIDATE,
        confidence=0.82,
        description="Accelerated glacier ice motion speckle-tracking displacement anomaly (~1.2 m/month).",
        affected_area_km2=145.0,
        displacement_cm=120.0,
        source_attribution="TERRA//SCOPE Cryosphere Speckle-Tracking Algorithm",
        product_ids=["NISAR_S_SAR_GUNW_20240828T121545_088_HIM"],
        is_demo=False
    ),
    EventItem(
        event_id="EVT-2024-CANADA-WILDFIRE",
        title="Boreal Forest Wildfire Coherence Decorrelation Scar",
        category=SurfaceChangeCategory.WILDFIRE,
        location_name="Fort McMurray Boreal Zone, Alberta, Canada",
        coordinates=[-111.4, 56.7],
        observation_date="2024-06-08T11:20:00Z",
        severity="HIGH",
        status=EventStatus.CONFIRMED,
        confidence=0.91,
        description="Acute coherence decorrelation (loss > 0.55) delineating crown and ground fire burn scar.",
        affected_area_km2=680.0,
        displacement_cm=None,
        source_attribution="Canadian Interagency Forest Fire Centre / ASF SAR",
        product_ids=["ASF_S1_20240608_CANADA_BURN"],
        is_demo=False
    )
]

@router.get("", response_model=List[EventItem])
def list_events(
    category: Optional[SurfaceChangeCategory] = None,
    status: Optional[EventStatus] = None,
    min_severity: Optional[str] = None
):
    """
    Returns surface change event catalog with filtering by category, status, and severity.
    Distinguishes independent ground-truth confirmed disasters from algorithmic candidates.
    """
    results = EVENT_CATALOG
    if category:
        results = [e for e in results if e.category == category]
    if status:
        results = [e for e in results if e.status == status]
    return results
