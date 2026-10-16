from typing import List, Optional, Dict, Any
from app.models.schemas import (
    ProductMetadata,
    ProviderInfo,
    SearchQuery,
    DataProviderStatus,
)
from app.services.data_providers.base import BaseDataProvider

class SampleDataProvider(BaseDataProvider):
    """
    Curated, scientifically rigorous demonstration and surrogate datasets.
    Clearly labeled with DEMO DATA or SURROGATE DATA markers to ensure absolute scientific integrity.
    """
    def __init__(self):
        super().__init__(
            provider_id="sample",
            name="TERRA//SCOPE Calibrated Reference Demonstrations",
        )
        self.catalog = self._build_catalog()

    def get_info(self) -> ProviderInfo:
        return ProviderInfo(
            provider_id=self.provider_id,
            name=self.name,
            agency="TERRA//SCOPE Science Testbed",
            bands=["L-band (24 cm)", "C-band (5.6 cm)", "S-band (9.3 cm)"],
            status=DataProviderStatus.SAMPLE_DATA_ACTIVE,
            auth_required_for_download=False,
            free_public_search=True,
            description=(
                "Curated, validated radar demonstration datasets derived from verified InSAR and multi-temporal "
                "SAR backscatter observations. Labeled for reproducible offline investigation."
            ),
            supported_products=["L2_GUNW", "L2_GCOV", "L3_DISP"],
            reference_url="https://nisar.jpl.nasa.gov/mission/data-products/",
        )

    def _build_catalog(self) -> List[ProductMetadata]:
        return [
            # Investigation A: 2023 Kahramanmaraş Earthquake
            ProductMetadata(
                product_id="NISAR_DEMO_GUNW_20230128_TURKEY_PRE",
                title="NISAR L-SAR GUNW - East Anatolian Fault (Pre-Seismic Baseline)",
                mission="NISAR (Calibrated InSAR Proxy)",
                sensor="L-SAR",
                platform="NISAR-SIM",
                acquisition_date="2023-01-28T03:42:15Z",
                processing_level="L2_GUNW",
                polarization="HH",
                orbit_direction="ASCENDING",
                relative_orbit=124,
                footprint_geojson={
                    "type": "Polygon",
                    "coordinates": [[[35.8, 36.5], [37.8, 36.5], [37.8, 38.2], [35.8, 38.2], [35.8, 36.5]]]
                },
                source_status="DEMO_CALIBRATED",
                source_url="https://nisar.jpl.nasa.gov",
                file_size_mb=420.0,
                is_demo=True
            ),
            ProductMetadata(
                product_id="NISAR_DEMO_GUNW_20230209_TURKEY_POST",
                title="NISAR L-SAR GUNW - East Anatolian Fault (Co-Seismic Rupture)",
                mission="NISAR (Calibrated InSAR Proxy)",
                sensor="L-SAR",
                platform="NISAR-SIM",
                acquisition_date="2023-02-09T03:42:15Z",
                processing_level="L2_GUNW",
                polarization="HH",
                orbit_direction="ASCENDING",
                relative_orbit=124,
                footprint_geojson={
                    "type": "Polygon",
                    "coordinates": [[[35.8, 36.5], [37.8, 36.5], [37.8, 38.2], [35.8, 38.2], [35.8, 36.5]]]
                },
                source_status="DEMO_CALIBRATED",
                source_url="https://nisar.jpl.nasa.gov",
                file_size_mb=435.0,
                is_demo=True
            ),

            # Investigation B: Assam Brahmaputra Monsoon Flood
            ProductMetadata(
                product_id="NISAR_DEMO_GCOV_20240612_ASSAM_PRE",
                title="NISAR L-SAR GCOV - Brahmaputra Basin (Pre-Monsoon Normal)",
                mission="NISAR (ISRO-NASA Joint Coverage)",
                sensor="L-SAR",
                platform="NISAR-SIM",
                acquisition_date="2024-06-12T00:54:10Z",
                processing_level="L2_GCOV",
                polarization="HH+HV",
                orbit_direction="DESCENDING",
                relative_orbit=47,
                footprint_geojson={
                    "type": "Polygon",
                    "coordinates": [[[91.2, 25.8], [93.8, 25.8], [93.8, 27.2], [91.2, 27.2], [91.2, 25.8]]]
                },
                source_status="DEMO_CALIBRATED",
                source_url="https://bhoonidhi.nrsc.gov.in",
                file_size_mb=310.0,
                is_demo=True
            ),
            ProductMetadata(
                product_id="NISAR_DEMO_GCOV_20240704_ASSAM_FLOOD",
                title="NISAR L-SAR GCOV - Brahmaputra Basin (Peak Inundation Phase)",
                mission="NISAR (ISRO-NASA Joint Coverage)",
                sensor="L-SAR",
                platform="NISAR-SIM",
                acquisition_date="2024-07-04T00:54:10Z",
                processing_level="L2_GCOV",
                polarization="HH+HV",
                orbit_direction="DESCENDING",
                relative_orbit=47,
                footprint_geojson={
                    "type": "Polygon",
                    "coordinates": [[[91.2, 25.8], [93.8, 25.8], [93.8, 27.2], [91.2, 27.2], [91.2, 25.8]]]
                },
                source_status="DEMO_CALIBRATED",
                source_url="https://bhoonidhi.nrsc.gov.in",
                file_size_mb=315.0,
                is_demo=True
            ),

            # Investigation C: California Central Valley Agricultural Phenology & Subsidence
            ProductMetadata(
                product_id="NISAR_DEMO_GCOV_20240315_CALIFORNIA_EARLY",
                title="NISAR L-SAR GCOV - San Joaquin Valley (Emergence Phase)",
                mission="NISAR (NASA Segment)",
                sensor="L-SAR",
                platform="NISAR-SIM",
                acquisition_date="2024-03-15T14:10:00Z",
                processing_level="L2_GCOV",
                polarization="QUAD",
                orbit_direction="ASCENDING",
                relative_orbit=98,
                footprint_geojson={
                    "type": "Polygon",
                    "coordinates": [[[-120.8, 36.0], [-118.8, 36.0], [-118.8, 37.4], [-120.8, 37.4], [-120.8, 36.0]]]
                },
                source_status="DEMO_CALIBRATED",
                source_url="https://nisar.jpl.nasa.gov",
                file_size_mb=540.0,
                is_demo=True
            ),
            ProductMetadata(
                product_id="NISAR_DEMO_GCOV_20240722_CALIFORNIA_PEAK",
                title="NISAR L-SAR GCOV - San Joaquin Valley (Full Canopy & Irrigation)",
                mission="NISAR (NASA Segment)",
                sensor="L-SAR",
                platform="NISAR-SIM",
                acquisition_date="2024-07-22T14:10:00Z",
                processing_level="L2_GCOV",
                polarization="QUAD",
                orbit_direction="ASCENDING",
                relative_orbit=98,
                footprint_geojson={
                    "type": "Polygon",
                    "coordinates": [[[-120.8, 36.0], [-118.8, 36.0], [-118.8, 37.4], [-120.8, 37.4], [-120.8, 36.0]]]
                },
                source_status="DEMO_CALIBRATED",
                source_url="https://nisar.jpl.nasa.gov",
                file_size_mb=550.0,
                is_demo=True
            )
        ]

    async def search(self, query: SearchQuery) -> List[ProductMetadata]:
        results: List[ProductMetadata] = []
        for p in self.catalog:
            if query.bbox:
                # Envelope intersection test
                coords = p.footprint_geojson["coordinates"][0]
                lons = [c[0] for c in coords]
                lats = [c[1] for c in coords]
                if max(lons) < query.bbox.min_lon or min(lons) > query.bbox.max_lon:
                    continue
                if max(lats) < query.bbox.min_lat or min(lats) > query.bbox.max_lat:
                    continue
            results.append(p)
        return results

    async def get_product_by_id(self, product_id: str) -> Optional[ProductMetadata]:
        for p in self.catalog:
            if p.product_id == product_id:
                return p
        return None
