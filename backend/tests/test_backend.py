import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.engine.sar_processor import sar_processor
from app.models.schemas import AnalysisRequest, SurfaceChangeCategory
from app.services.data_providers.sample_provider import SampleDataProvider

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["app_name"] == "TERRA//SCOPE"
    assert "radar_engine" in data["services"]

def test_data_providers():
    response = client.get("/api/data/providers")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3
    provider_ids = [p["provider_id"] for p in data]
    assert "asf" in provider_ids
    assert "bhoonidhi" in provider_ids
    assert "sample" in provider_ids

def test_events_discovery():
    response = client.get("/api/events")
    assert response.status_code == 200
    events = response.json()
    assert len(events) >= 3
    # Check earthquake event
    eq = next((e for e in events if e["event_id"] == "EVT-2023-TURKEY-EQ"), None)
    assert eq is not None
    assert eq["category"] == "ground_deformation"
    assert eq["status"] == "confirmed"

def test_demo_investigations():
    response = client.get("/api/demo/investigations")
    assert response.status_code == 200
    demos = response.json()
    assert len(demos) == 3
    demo_ids = [d["investigation_id"] for d in demos]
    assert "INV-EARTHQUAKE-TURKEY" in demo_ids
    assert "INV-FLOOD-BRAHMAPUTRA" in demo_ids
    assert "INV-AGRI-CENTRAL-VALLEY" in demo_ids

def test_sar_processor_insar():
    sp = SampleDataProvider()
    prod_a = sp.catalog[0]
    prod_b = sp.catalog[1]
    req = AnalysisRequest(
        product_a_id=prod_a.product_id,
        product_b_id=prod_b.product_id,
        category=SurfaceChangeCategory.GROUND_DEFORMATION,
        algorithm="dinsar_phase_displacement"
    )
    result = sar_processor.run_analysis(req, prod_a, prod_b)
    assert result.analysis_id.startswith("ANL-")
    assert result.metrics.ground_displacement_cm is not None
    assert result.metrics.ground_displacement_cm > 20.0
    assert len(result.geojson_layers["features"]) > 0

def test_analysis_export_formats():
    # 1. Run detect
    sp = SampleDataProvider()
    prod_a = sp.catalog[0]
    prod_b = sp.catalog[1]
    detect_resp = client.post("/api/analysis/detect", json={
        "product_a_id": prod_a.product_id,
        "product_b_id": prod_b.product_id,
        "category": "ground_deformation",
        "algorithm": "dinsar_phase_displacement"
    })
    assert detect_resp.status_code == 200
    anl_id = detect_resp.json()["analysis_id"]

    # 2. Test GeoJSON export
    geo_resp = client.get(f"/api/analysis/{anl_id}/export?format=geojson")
    assert geo_resp.status_code == 200
    assert geo_resp.headers["content-type"] == "application/geo+json"
    geo_data = geo_resp.json()
    assert "features" in geo_data
    assert "metadata" in geo_data

    # 3. Test CSV export
    csv_resp = client.get(f"/api/analysis/{anl_id}/export?format=csv")
    assert csv_resp.status_code == 200
    assert "zone_id" in csv_resp.text

    # 4. Test HTML report export
    html_resp = client.get(f"/api/analysis/{anl_id}/export?format=html")
    assert html_resp.status_code == 200
    assert "TERRA//SCOPE" in html_resp.text

def test_orbit_assistant():
    resp = client.post("/api/assistant/explain", json={
        "prompt": "What does the radar backscatter reduction mean in this flood scene?",
        "selected_event_id": "EVT-2024-ASSAM-FLOOD"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["observed_evidence"]) > 0
    assert "specular" in data["plausible_interpretation"].lower()
    assert len(data["alternative_explanations"]) > 0
    assert len(data["recommended_verification_steps"]) > 0
