import io
import csv
import json
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Query, Response
from fastapi.responses import JSONResponse, PlainTextResponse, HTMLResponse
from app.models.schemas import (
    AnalysisRequest,
    AnalysisResult,
    ComparisonRequest,
    ExportFormat,
    SurfaceChangeCategory,
)
from app.services.engine.sar_processor import sar_processor
from app.services.data_providers.sample_provider import SampleDataProvider
from app.services.data_providers.asf_provider import ASFDataProvider
from app.services.data_providers.bhoonidhi_provider import BhoonidhiDataProvider

router = APIRouter(prefix="/api/analysis", tags=["Scientific Change Detection"])

# In-memory storage for analysis results in this session
analysis_store: Dict[str, AnalysisResult] = {}
sample_provider = SampleDataProvider()
asf_provider = ASFDataProvider()
bhoonidhi_provider = BhoonidhiDataProvider()

async def _resolve_product(product_id: str):
    p = await sample_provider.get_product_by_id(product_id)
    if p:
        return p
    p = await bhoonidhi_provider.get_product_by_id(product_id)
    if p:
        return p
    p = await asf_provider.get_product_by_id(product_id)
    if p:
        return p
    return None

@router.post("/detect", response_model=AnalysisResult)
async def run_change_detection(request: AnalysisRequest):
    """
    Executes a scientific change detection analysis between two radar acquisitions.
    Applies rigorous physical radar algorithms (InSAR phase displacement, backscatter log-ratio, or RVI).
    """
    prod_a = await _resolve_product(request.product_a_id)
    prod_b = await _resolve_product(request.product_b_id)

    if not prod_a:
        raise HTTPException(status_code=404, detail=f"Base observation scene '{request.product_a_id}' not found.")
    if not prod_b:
        raise HTTPException(status_code=404, detail=f"Comparison observation scene '{request.product_b_id}' not found.")

    try:
        result = sar_processor.run_analysis(request, prod_a, prod_b)
        analysis_store[result.analysis_id] = result
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scientific analysis failed: {str(e)}")

@router.post("/compare", response_model=AnalysisResult)
async def compare_observations(request: ComparisonRequest):
    """
    Executes a temporal comparison between two radar observation dates.
    Auto-detects suitable algorithm based on product type.
    """
    prod_a = await _resolve_product(request.product_a_id)
    prod_b = await _resolve_product(request.product_b_id)

    if not prod_a or not prod_b:
        raise HTTPException(status_code=404, detail="One or both observation scenes could not be found.")

    # Infer category
    category = SurfaceChangeCategory.FLOOD_WETLAND
    algo = "log_ratio_backscatter"
    if "GUNW" in prod_a.processing_level or "DISP" in prod_a.processing_level:
        category = SurfaceChangeCategory.GROUND_DEFORMATION
        algo = "dinsar_phase_displacement"
    elif "QUAD" in prod_a.polarization:
        category = SurfaceChangeCategory.AGRICULTURE
        algo = "dual_pol_rvi_delta"

    detect_req = AnalysisRequest(
        product_a_id=request.product_a_id,
        product_b_id=request.product_b_id,
        category=category,
        algorithm=algo,
        aoi_bbox=request.aoi_bbox
    )
    result = sar_processor.run_analysis(detect_req, prod_a, prod_b)
    analysis_store[result.analysis_id] = result
    return result

@router.get("/{analysis_id}", response_model=AnalysisResult)
def get_analysis_by_id(analysis_id: str):
    """Retrieves an existing analysis by its unique identifier."""
    if analysis_id in analysis_store:
        return analysis_store[analysis_id]
    raise HTTPException(status_code=404, detail=f"Analysis with ID '{analysis_id}' not found.")

@router.get("/{analysis_id}/export")
def export_analysis_result(
    analysis_id: str,
    format: ExportFormat = Query(ExportFormat.GEOJSON, description="Export format: geojson, csv, json, or html")
):
    """
    Exports scientifically complete analysis results with traceable provenance.
    Outputs actual polygon coordinates, metrics, and quality indicators.
    """
    if analysis_id not in analysis_store:
        raise HTTPException(status_code=404, detail=f"Analysis '{analysis_id}' not found for export.")

    res = analysis_store[analysis_id]

    if format == ExportFormat.GEOJSON:
        geojson_data = res.geojson_layers
        # Inject metadata into top-level properties
        geojson_data["metadata"] = {
            "analysis_id": res.analysis_id,
            "category": res.category.value,
            "algorithm": res.algorithm_name,
            "timestamp": res.timestamp,
            "mean_change": res.metrics.mean_change_value,
            "units": res.metrics.units,
            "affected_area_km2": res.metrics.affected_area_km2,
            "confidence": res.metrics.confidence_score,
            "provenance": res.provenance
        }
        return Response(
            content=json.dumps(geojson_data, indent=2),
            media_type="application/geo+json",
            headers={"Content-Disposition": f"attachment; filename=terrascope_{res.analysis_id}.geojson"}
        )

    elif format == ExportFormat.CSV:
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["zone_id", "classification", "metric_value", "units", "area_km2", "confidence"])
        for feat in res.geojson_layers.get("features", []):
            props = feat.get("properties", {})
            writer.writerow([
                props.get("zone_id", props.get("parcel_id", "ZONE")),
                props.get("classification", "Change Zone"),
                props.get("mean_displacement_cm", props.get("mean_backscatter_delta_db", props.get("delta_rvi", 0.0))),
                res.metrics.units,
                props.get("area_km2", 0.0),
                props.get("confidence", res.metrics.confidence_score)
            ])
        return PlainTextResponse(
            content=output.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=terrascope_{res.analysis_id}.csv"}
        )

    elif format == ExportFormat.JSON:
        return Response(
            content=res.model_dump_json(indent=2),
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename=terrascope_{res.analysis_id}_report.json"}
        )

    elif format == ExportFormat.HTML:
        html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>TERRA//SCOPE Analysis Report - {res.analysis_id}</title>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; background: #030712; color: #f1f5f9; padding: 40px; margin: 0; }}
    .card {{ background: #09101f; border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 8px; padding: 24px; margin-bottom: 24px; }}
    h1 {{ color: #00f0ff; margin-top: 0; }}
    h2 {{ color: #38bdf8; font-size: 18px; border-bottom: 1px solid rgba(56, 189, 248, 0.2); padding-bottom: 8px; }}
    .metric-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 16px 0; }}
    .metric-box {{ background: rgba(13, 23, 44, 0.8); border: 1px solid rgba(56, 189, 248, 0.15); border-radius: 6px; padding: 12px; }}
    .metric-val {{ font-size: 24px; font-weight: bold; color: #00f0ff; }}
    .badge {{ display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; background: rgba(168, 85, 247, 0.2); color: #c084fc; border: 1px solid #a855f7; }}
    table {{ width: 100%; border-collapse: collapse; margin-top: 12px; }}
    th, td {{ border: 1px solid rgba(56, 189, 248, 0.2); padding: 8px 12px; text-align: left; }}
    th {{ background: rgba(56, 189, 248, 0.1); color: #38bdf8; }}
  </style>
</head>
<body>
  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h1>TERRA//SCOPE // SCIENTIFIC ANALYSIS DOSSIER</h1>
      <span class="badge">{res.analysis_id}</span>
    </div>
    <p style="color:#94a3b8;">Generated: {res.timestamp} | Algorithm: {res.algorithm_name} ({res.algorithm_version})</p>
    
    <h2>1. Executive Scientific Summary</h2>
    <p>{res.evidence_summary}</p>
    <p><em>Interpretation:</em> {res.scientific_interpretation}</p>

    <h2>2. Key Quantified Metrics</h2>
    <div class="metric-grid">
      <div class="metric-box">
        <div style="font-size:12px; color:#94a3b8;">Mean Change</div>
        <div class="metric-val">{res.metrics.mean_change_value} {res.metrics.units}</div>
      </div>
      <div class="metric-box">
        <div style="font-size:12px; color:#94a3b8;">Affected Surface Area</div>
        <div class="metric-val">{res.metrics.affected_area_km2} km²</div>
      </div>
      <div class="metric-box">
        <div style="font-size:12px; color:#94a3b8;">Confidence Index</div>
        <div class="metric-val">{int(res.metrics.confidence_score * 100)}% ({res.metrics.quality_grade})</div>
      </div>
      <div class="metric-box">
        <div style="font-size:12px; color:#94a3b8;">Peak Extreme Change</div>
        <div class="metric-val">{res.metrics.max_change_value} {res.metrics.units}</div>
      </div>
    </div>

    <h2>3. Delineated Geographic Zones</h2>
    <table>
      <thead>
        <tr>
          <th>Zone ID</th>
          <th>Classification</th>
          <th>Area (km²)</th>
          <th>Confidence</th>
        </tr>
      </thead>
      <tbody>
        {"".join([f"<tr><td>{f.get('properties',{}).get('zone_id', 'Z')}</td><td>{f.get('properties',{}).get('classification','Unknown')}</td><td>{f.get('properties',{}).get('area_km2', 0)}</td><td>{int(f.get('properties',{}).get('confidence', 0.9)*100)}%</td></tr>" for f in res.geojson_layers.get("features", [])])}
      </tbody>
    </table>

    <h2>4. Provenance and Processing Chain</h2>
    <pre style="background:#030712; padding:12px; border-radius:4px; color:#38bdf8; overflow-x:auto;">{json.dumps(res.provenance, indent=2)}</pre>
  </div>
</body>
</html>"""
        return HTMLResponse(content=html_content)
