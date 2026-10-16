import logging
import httpx
from typing import List, Optional, Dict, Any
from app.models.schemas import (
    ProductMetadata,
    ProviderInfo,
    SearchQuery,
    DataProviderStatus,
)
from app.services.data_providers.base import BaseDataProvider

logger = logging.getLogger("terrascope.asf")

class ASFDataProvider(BaseDataProvider):
    """
    Real Integration with Alaska Satellite Facility (ASF) Search API.
    ASF DAAC is NASA's primary synthetic aperture radar archive for NISAR, Sentinel-1, ALOS, and UAVSAR.
    Public search requires NO API credentials.
    """
    BASE_URL = "https://api.daac.asf.alaska.edu/services/search/param"

    def __init__(self):
        super().__init__(
            provider_id="asf",
            name="NASA Alaska Satellite Facility (ASF DAAC)",
        )
        self.last_status = DataProviderStatus.LIVE_CONNECTED

    def get_info(self) -> ProviderInfo:
        return ProviderInfo(
            provider_id=self.provider_id,
            name=self.name,
            agency="NASA / Alaska Satellite Facility DAAC",
            bands=["L-band (NISAR L-SAR)", "C-band (Sentinel-1)", "L-band (ALOS PALSAR)"],
            status=self.last_status,
            auth_required_for_download=True, # NASA Earthdata Login required for download
            free_public_search=True,         # Search API is open and unauthenticated
            description=(
                "Official NASA Earth Science Data Archive for SAR imagery. "
                "Provides official NISAR L-band science data products (L1 SLC, L2 GCOV, L2 GUNW InSAR, L3 displacement), "
                "alongside Sentinel-1 and historical radar baselines."
            ),
            supported_products=["L1_SLC", "L2_GCOV", "L2_GUNW", "L3_DISP", "SLC", "GRD"],
            reference_url="https://asf.alaska.edu/data-sets/sar-data-sets/nisar/",
        )

    async def search(self, query: SearchQuery) -> List[ProductMetadata]:
        params: Dict[str, Any] = {
            "output": "geojson",
            "maxResults": min(query.max_results, 50),
        }

        # Spatial bounding box
        if query.bbox:
            params["bbox"] = f"{query.bbox.min_lon},{query.bbox.min_lat},{query.bbox.max_lon},{query.bbox.max_lat}"

        # Temporal filter
        if query.start_date:
            params["start"] = query.start_date
        if query.end_date:
            params["end"] = query.end_date

        # Platform filter - allow NISAR or fallback to Sentinel-1 / ALOS if requested or for active radar comparison
        platform = "NISAR"
        if query.platform:
            platform = query.platform.upper()
        params["platform"] = platform

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(self.BASE_URL, params=params)
                
                # If NISAR yields no granules (e.g. pre-launch/calibration phase query window),
                # we also query Sentinel-1 SAR as a live validated baseline so the user can see live data!
                if response.status_code == 200:
                    data = response.json()
                    features = data.get("features", [])
                    
                    if not features and platform == "NISAR":
                        # Query Sentinel-1 as live SAR fallback baseline
                        params["platform"] = "SENTINEL-1"
                        fb_response = await client.get(self.BASE_URL, params=params)
                        if fb_response.status_code == 200:
                            fb_data = fb_response.json()
                            features = fb_data.get("features", [])
                            self.last_status = DataProviderStatus.RESULTS_AVAILABLE
                    
                    products: List[ProductMetadata] = []
                    for feat in features:
                        props = feat.get("properties", {})
                        geom = feat.get("geometry", {})
                        file_name = props.get("fileName", props.get("granuleName", "SAR_GRANULE"))
                        granule_id = props.get("sceneName", file_name)
                        plat_name = props.get("platform", "NISAR")
                        
                        products.append(
                            ProductMetadata(
                                product_id=granule_id,
                                title=f"{plat_name} {props.get('beamModeType', 'SAR')} - {granule_id[:24]}",
                                mission="NISAR" if "NISAR" in plat_name else "Sentinel-1 (SAR Baseline)",
                                sensor="L-SAR" if "NISAR" in plat_name else "C-SAR",
                                platform=plat_name,
                                acquisition_date=props.get("startTime", "2024-01-01T00:00:00Z"),
                                processing_level=props.get("processingLevel", "L2_GCOV"),
                                polarization=props.get("polarization", "HH+HV"),
                                orbit_direction=props.get("flightDirection", "ASCENDING"),
                                relative_orbit=props.get("pathNumber", None),
                                footprint_geojson=geom,
                                source_status="VALIDATED" if "NISAR" not in plat_name else "BETA_CALIBRATION",
                                download_url=props.get("url"),
                                source_url=f"https://search.asf.alaska.edu/#/?granule={granule_id}",
                                file_size_mb=float(props.get("bytes", 0)) / (1024 * 1024) if props.get("bytes") else None,
                                is_demo=False
                            )
                        )
                    
                    if products:
                        self.last_status = DataProviderStatus.RESULTS_AVAILABLE
                    else:
                        self.last_status = DataProviderStatus.NO_MATCHING_OBSERVATIONS
                    return products
                else:
                    logger.warning(f"ASF search returned HTTP {response.status_code}")
                    self.last_status = DataProviderStatus.PROVIDER_UNAVAILABLE
                    return []
        except Exception as e:
            logger.error(f"Error querying ASF search API: {e}")
            self.last_status = DataProviderStatus.PROVIDER_UNAVAILABLE
            return []

    async def get_product_by_id(self, product_id: str) -> Optional[ProductMetadata]:
        # Fast query by sceneName
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                response = await client.get(
                    self.BASE_URL,
                    params={"granule_list": product_id, "output": "geojson"}
                )
                if response.status_code == 200:
                    data = response.json()
                    features = data.get("features", [])
                    if features:
                        feat = features[0]
                        props = feat.get("properties", {})
                        geom = feat.get("geometry", {})
                        return ProductMetadata(
                            product_id=product_id,
                            title=f"{props.get('platform', 'SAR')} - {product_id}",
                            mission="NISAR" if "NISAR" in str(props.get('platform')) else "Sentinel-1",
                            sensor="L-SAR" if "NISAR" in str(props.get('platform')) else "C-SAR",
                            platform=props.get("platform", "NISAR"),
                            acquisition_date=props.get("startTime", "2024-01-01T00:00:00Z"),
                            processing_level=props.get("processingLevel", "L2_GCOV"),
                            polarization=props.get("polarization", "HH+HV"),
                            orbit_direction=props.get("flightDirection", "ASCENDING"),
                            relative_orbit=props.get("pathNumber"),
                            footprint_geojson=geom,
                            source_status="VALIDATED",
                            download_url=props.get("url"),
                            source_url=f"https://search.asf.alaska.edu/#/?granule={product_id}",
                            is_demo=False
                        )
        except Exception as e:
            logger.error(f"Failed to fetch product by id from ASF: {e}")
        return None
