from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from enum import Enum

class SurfaceChangeCategory(str, Enum):
    GROUND_DEFORMATION = "ground_deformation"
    VEGETATION_FOREST = "vegetation_forest"
    FLOOD_WETLAND = "flood_wetland"
    AGRICULTURE = "agriculture"
    GLACIER_ICE = "glacier_ice"
    WILDFIRE = "wildfire"

class DataProviderStatus(str, Enum):
    LIVE_CONNECTED = "live_connected"
    SEARCH_COMPLETED = "search_completed"
    RESULTS_AVAILABLE = "results_available"
    NO_MATCHING_OBSERVATIONS = "no_matching_observations"
    AUTH_REQUIRED = "auth_required"
    PROVIDER_UNAVAILABLE = "provider_unavailable"
    SAMPLE_DATA_ACTIVE = "sample_data_active"

class EventStatus(str, Enum):
    CONFIRMED = "confirmed"
    ALGORITHMIC_CANDIDATE = "algorithmic_candidate"
    UNDER_REVIEW = "under_review"

class ExportFormat(str, Enum):
    GEOJSON = "geojson"
    CSV = "csv"
    JSON = "json"
    HTML = "html"

class BoundingBox(BaseModel):
    min_lon: float = Field(..., ge=-180, le=180)
    min_lat: float = Field(..., ge=-90, le=90)
    max_lon: float = Field(..., ge=-180, le=180)
    max_lat: float = Field(..., ge=-90, le=90)

class ProductMetadata(BaseModel):
    product_id: str
    title: str
    mission: str = "NISAR" # Or surrogate e.g. Sentinel-1 / ALOS-2
    sensor: str = "L-SAR" # or S-SAR / C-SAR
    platform: str
    acquisition_date: str # ISO-8601
    processing_level: str # e.g. L1_SLC, L2_GCOV, L2_GUNW, L3_DISP
    polarization: str # HH, HV, VV, VH, Dual, Quad
    orbit_direction: str # ASCENDING, DESCENDING
    relative_orbit: Optional[int] = None
    footprint_geojson: Dict[str, Any]
    source_status: str # PROVISIONAL, VALIDATED, BETA, SIMULATED, DEMO
    download_url: Optional[str] = None
    source_url: Optional[str] = None
    file_size_mb: Optional[float] = None
    is_demo: bool = False

class ProviderInfo(BaseModel):
    provider_id: str
    name: str
    agency: str
    bands: List[str]
    status: DataProviderStatus
    auth_required_for_download: bool
    free_public_search: bool
    description: str
    supported_products: List[str]
    reference_url: str

class SearchQuery(BaseModel):
    bbox: Optional[BoundingBox] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    categories: Optional[List[SurfaceChangeCategory]] = None
    polarizations: Optional[List[str]] = None
    platform: Optional[str] = None
    max_results: int = Field(default=25, ge=1, le=100)
    provider: Optional[str] = "all" # asf, bhoonidhi, sample, all

class SearchResultResponse(BaseModel):
    query: Dict[str, Any]
    total_found: int
    provider_status: Dict[str, DataProviderStatus]
    products: List[ProductMetadata]
    message: Optional[str] = None

class AnalysisRequest(BaseModel):
    product_a_id: str
    product_b_id: str
    category: SurfaceChangeCategory
    algorithm: str # e.g. "dinsar_phase_displacement", "log_ratio_backscatter", "dual_pol_rvi_delta", "coherence_change"
    aoi_bbox: Optional[BoundingBox] = None
    confidence_threshold: float = Field(default=0.65, ge=0.0, le=1.0)
    parameters: Optional[Dict[str, Any]] = None

class ComparisonRequest(BaseModel):
    product_a_id: str
    product_b_id: str
    aoi_bbox: Optional[BoundingBox] = None
    metric: str = "backscatter_db_ratio" # or "interferometric_coherence", "los_displacement_cm"

class AnalysisMetrics(BaseModel):
    mean_change_value: float
    max_change_value: float
    min_change_value: float
    units: str
    affected_area_km2: float
    ground_displacement_cm: Optional[float] = None
    coherence_loss_ratio: Optional[float] = None
    confidence_score: float # 0.0 - 1.0
    quality_grade: str # High, Moderate, Marginal

class AnalysisResult(BaseModel):
    analysis_id: str
    timestamp: str
    category: SurfaceChangeCategory
    algorithm_name: str
    algorithm_version: str
    input_products: List[ProductMetadata]
    metrics: AnalysisMetrics
    evidence_summary: str
    scientific_interpretation: str
    limitations: List[str]
    geojson_layers: Dict[str, Any] # Change polygons and footprints
    time_series_data: Optional[List[Dict[str, Any]]] = None
    raster_overlay_url: Optional[str] = None
    provenance: Dict[str, Any]
    is_demo_data: bool = False

class EventItem(BaseModel):
    event_id: str
    title: str
    category: SurfaceChangeCategory
    location_name: str
    coordinates: List[float] # [lon, lat]
    observation_date: str
    severity: str # LOW, MODERATE, HIGH, CRITICAL
    status: EventStatus
    confidence: float
    description: str
    affected_area_km2: float
    displacement_cm: Optional[float] = None
    source_attribution: str
    product_ids: List[str]
    is_demo: bool = False

class AssistantQuery(BaseModel):
    prompt: str
    selected_event_id: Optional[str] = None
    selected_analysis_id: Optional[str] = None
    coordinates: Optional[List[float]] = None
    context_meta: Optional[Dict[str, Any]] = None

class AssistantResponse(BaseModel):
    observed_evidence: List[str]
    plausible_interpretation: str
    confidence_assessment: str
    alternative_explanations: List[str]
    recommended_verification_steps: List[str]
    scientific_citations_links: List[Dict[str, str]]
    source_mode: str # "deterministic_science_engine" or "llm_enhanced"

class DemoInvestigation(BaseModel):
    investigation_id: str
    title: str
    category: SurfaceChangeCategory
    location_name: str
    coordinates: List[float] # [lon, lat, height]
    question: str
    data_source: str
    observation_dates: List[str]
    summary: str
    methodology: str
    limitations: str
    source_documentation_url: str
    product_a: ProductMetadata
    product_b: ProductMetadata
    precomputed_analysis: AnalysisResult
