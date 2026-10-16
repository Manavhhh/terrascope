import logging
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import (
    ProviderInfo,
    SearchResultResponse,
    SearchQuery,
    ProductMetadata,
    BoundingBox,
    DataProviderStatus,
)
from app.services.data_providers.asf_provider import ASFDataProvider
from app.services.data_providers.bhoonidhi_provider import BhoonidhiDataProvider
from app.services.data_providers.sample_provider import SampleDataProvider
from app.services.data_providers.earthdata_client import EarthdataClient
from app.config import settings

logger = logging.getLogger("terrascope.data_router")
router = APIRouter(prefix="/api/data", tags=["Data Integration"])

asf_provider = ASFDataProvider()
bhoonidhi_provider = BhoonidhiDataProvider(api_key=settings.isro_bhoonidhi_api_key)
sample_provider = SampleDataProvider()
earthdata_client = EarthdataClient(
    username=settings.earthdata_username,
    password=settings.earthdata_password,
    bearer_token=settings.earthdata_bearer_token,
)

@router.get("/providers", response_model=List[ProviderInfo])
async def list_providers():
    """Returns status and configuration of all connected radar data providers."""
    return [
        asf_provider.get_info(),
        bhoonidhi_provider.get_info(),
        sample_provider.get_info()
    ]

@router.get("/search", response_model=SearchResultResponse)
async def search_products(
    min_lon: Optional[float] = Query(None, ge=-180, le=180),
    min_lat: Optional[float] = Query(None, ge=-90, le=90),
    max_lon: Optional[float] = Query(None, ge=-180, le=180),
    max_lat: Optional[float] = Query(None, ge=-90, le=90),
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    platform: Optional[str] = None,
    provider: Optional[str] = "all",
    max_results: int = Query(25, ge=1, le=100)
):
    """
    Searches available radar granules across active providers.
    Supports real Alaska Satellite Facility queries and calibrated reference datasets.
    """
    bbox = None
    if min_lon is not None and min_lat is not None and max_lon is not None and max_lat is not None:
        bbox = BoundingBox(min_lon=min_lon, min_lat=min_lat, max_lon=max_lon, max_lat=max_lat)

    query = SearchQuery(
        bbox=bbox,
        start_date=start_date,
        end_date=end_date,
        platform=platform,
        provider=provider,
        max_results=max_results
    )

    all_products: List[ProductMetadata] = []
    status_map = {}

    # Sample reference datasets
    if provider in ["all", "sample"]:
        sample_prods = await sample_provider.search(query)
        all_products.extend(sample_prods)
        status_map["sample"] = DataProviderStatus.SAMPLE_DATA_ACTIVE

    # Bhoonidhi S-band
    if provider in ["all", "bhoonidhi"]:
        bhoo_prods = await bhoonidhi_provider.search(query)
        all_products.extend(bhoo_prods)
        status_map["bhoonidhi"] = bhoonidhi_provider.last_status

    # Live ASF search
    if provider in ["all", "asf"]:
        try:
            asf_prods = await asf_provider.search(query)
            all_products.extend(asf_prods)
            status_map["asf"] = asf_provider.last_status
        except Exception as e:
            logger.error(f"ASF search failed: {e}")
            status_map["asf"] = DataProviderStatus.PROVIDER_UNAVAILABLE

    message = None
    if not all_products:
        message = "No radar observations match the specified spatial bounding box and date range."

    return SearchResultResponse(
        query={
            "bbox": [min_lon, min_lat, max_lon, max_lat] if bbox else None,
            "start_date": start_date,
            "end_date": end_date,
            "platform": platform,
            "provider": provider
        },
        total_found=len(all_products),
        provider_status=status_map,
        products=all_products,
        message=message
    )

@router.get("/products/{product_id}", response_model=ProductMetadata)
async def get_product_details(product_id: str):
    """Retrieves full metadata, geometry, and orbit characteristics for a specific radar scene."""
    # Check sample provider
    p = await sample_provider.get_product_by_id(product_id)
    if p:
        return p

    # Check Bhoonidhi
    p = await bhoonidhi_provider.get_product_by_id(product_id)
    if p:
        return p

    # Check ASF
    p = await asf_provider.get_product_by_id(product_id)
    if p:
        return p

    raise HTTPException(status_code=404, detail=f"Product with ID '{product_id}' not found in active catalogs.")
