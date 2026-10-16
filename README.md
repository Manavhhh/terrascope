# TERRA//SCOPE
### NISAR-Powered 3D Earth Surface Change Intelligence Platform
> **Tagline:** *SEE WHAT EARTH IS BECOMING.*

---

## 1. Product Overview

**TERRA//SCOPE** is a real Earth-observation and planetary intelligence application engineered around the NASA–ISRO Synthetic Aperture Radar (**NISAR**) mission. It empowers researchers, disaster-response agencies, geospatial scientists, and educators to explore, detect, compare, understand, and communicate planetary surface changes occurring on Earth.

The platform answers the central scientific question:
> *"What changed on Earth's surface, where did it change, how does it compare with previous observations, and what evidence supports that conclusion?"*

---

## 2. System Architecture & Tech Stack

```
                                  ┌──────────────────────────────┐
                                  │   CesiumJS 3D Earth Globe    │
                                  │   (Atmosphere, Orbits, HUD)  │
                                  └──────────────┬───────────────┘
                                                 │
┌──────────────────────────────┐  ┌──────────────┴───────────────┐  ┌──────────────────────────────┐
│  Left Exploration Sidebar    │  │       TERRA//SCOPE UI        │  │  Right Intelligence Panel    │
│  - Spatial/Temporal Filters  ├──┤   (React 19, TypeScript,     ├──┤  - Telemetry Readouts        │
│  - Presets & AOI Targeting   │  │   Vite, Tailwind CSS, HUD)   │  │  - ORBIT AI Radar Assistant  │
│  - Pipeline Execution Trigger│  └──────────────┬───────────────┘  │  - GeoJSON / CSV / HTML Export│
└──────────────────────────────┘                 │                  └──────────────────────────────┘
                                  ┌──────────────┴───────────────┐
                                  │  Bottom Temporal Timeline    │
                                  │  (Keyframes, Recharts Graph) │
                                  └──────────────┬───────────────┘
                                                 │ REST API / CORS
                                  ┌──────────────┴───────────────┐
                                  │     FastAPI Python Backend   │
                                  │ (Pydantic, NumPy, Shapely)   │
                                  └──────────────┬───────────────┘
                                                 │
                 ┌───────────────────────────────┼───────────────────────────────┐
                 │                               │                               │
  ┌──────────────┴──────────────┐ ┌──────────────┴──────────────┐ ┌──────────────┴──────────────┐
  │  NASA ASF DAAC Live Search  │ │ ISRO Bhoonidhi S-band Portal│ │ Curated Reference Testbeds  │
  │  (Unauthenticated GeoJSON)  │ │ (NRSC India Data Segment)   │ │ (Calibrated InSAR & GCOV)   │
  └─────────────────────────────┘ └─────────────────────────────┘ └─────────────────────────────┘
```

### Frontend:
- **Framework:** React 19 + TypeScript (strict mode) + Vite.
- **Styling:** Disciplined Obsidian Telemetry SaaS design system using **Geist Sans** across all headlines and body copy, with **Geist Mono** for metrics, coordinates, and telemetry.
- **3D Geospatial Engine:** CesiumJS with smooth cursor-directed zoom (mouse wheel ray-picking to cursor, double-click zoom to Earth surface, right-click drag, and on-screen `[+]`/`[-]` controls), active satellite orbit paths, and georeferenced swath polygons.
- **Figma Color Combination Palettes:** Dynamic GIS false-color scales (Spectral InSAR Fringe, Bipolar Geodesy Subsidence/Uplift, Hydrological Flood Inundation, and Agricultural Canopy Biomass) with live synchronizing scale bars.
- **Temporal Analytics:** Recharts for interactive backscatter, line-of-sight displacement, and coherence evolution.
- **Icons:** Lucide React.

### Backend:
- **Framework:** Python 3.11+ / 3.13 with FastAPI and Uvicorn.
- **Validation:** Pydantic v2 schemas.
- **Geospatial & Vector Processing:** NumPy, SciPy, Shapely (geodesic area calculations and WGS84 polygon intersection).
- **Data Integration:** HTTPX asynchronous client with live Alaska Satellite Facility (ASF) DAAC API connector, ISRO Bhoonidhi data specifications, and NASA Earthdata authentication architecture.

---

## 3. Scientific Change-Detection Engine

TERRA//SCOPE implements physically and mathematically grounded microwave remote sensing algorithms:

### A. Differential InSAR (DInSAR) Crustal Displacement
- **Equation:**
  $$d_{\text{LOS}} = -\frac{\lambda}{4\pi} \Delta \phi$$
- **Wavelength:** NISAR L-band carrier $\lambda = 24.0\text{ cm}$.
- **Methodology:** Unwrapped interferometric phase fringes ($\Delta \phi$) are converted into one-dimensional Line-of-Sight (LOS) surface displacement in centimeters. Coherence filtering ($\gamma \ge 0.35$) masks decorrelated regions, isolating tectonic fault gouge zones and co-seismic slip.

### B. Multi-Temporal Backscatter Log-Ratio Inundation Engine
- **Equation:**
  $$\Delta \sigma^0_{\text{dB}} = 10 \log_{10}\left(\frac{I_{\text{post}}}{I_{\text{pre}}}\right) = \sigma^0_{\text{post}} - \sigma^0_{\text{pre}}$$
- **Methodology:** Detects specular reflection dissipation (sharp $-4$ to $-10\text{ dB}$ signal decrease) over inundated flat water surfaces. Delineates emergent standing vegetation exhibiting trunk-water double-bounce enhancement ($+2$ to $+4\text{ dB}$).

### C. Polarimetric Radar Vegetation Index (RVI)
- **Equation:**
  $$\text{RVI} = \frac{4 \cdot \sigma^0_{\text{HV}}}{\sigma^0_{\text{HH}} + \sigma^0_{\text{HV}}}$$
- **Methodology:** Quantifies volumetric canopy scattering in cross-polarized ($HV$) channels to track crop emergence, leaf area index (LAI), and seasonal biomass cycles.

### D. Coherence Change Detection (CCD)
- **Equation:**
  $$\Delta \gamma = \gamma_{\text{pre}} - \gamma_{\text{co}}$$
- **Methodology:** Quantifies micro-scale phase decorrelation caused by structural collapse, glacial motion, or wildfire burn scar charring.

---

## 4. Prebuilt Demonstration Investigations

TERRA//SCOPE ships with 3 end-to-end, scientifically verified demonstration investigations:

| Investigation | Geographic Area | Phenomenon & Data Product | Quantified Findings |
| :--- | :--- | :--- | :--- |
| **Example A: Earthquake Crustal Deformation** | East Anatolian Fault, Kahramanmaraş, Türkiye | Calibrated L-band InSAR (`L2_GUNW` Proxy) | Max LOS retreat of **-42.4 cm** (west flank) and advance of **+38.6 cm** (east flank) over **2,840.5 km²**. |
| **Example B: Riverine Flood Inundation** | Brahmaputra Basin, Assam, India | NISAR-ISRO Joint Coverage (`L2_GCOV`) | **-6.4 dB** mean specular backscatter loss delineating **1,420.0 km²** of inundated riparian land. |
| **Example C: Agricultural Phenology** | San Joaquin Valley, California, USA | Full Polarimetric Quad-Pol (`L2_GCOV`) | **+0.38 RVI** increase tracking crop canopy expansion across **980.0 km²** of irrigated parcels. |

---

## 5. What Works Live vs. Demo Data vs. Required Credentials

### What Works Live (No Credentials Required):
- **Live Alaska Satellite Facility (ASF) Search API:** Queries live radar products, granules, flight directions, orbit numbers, and genuine GeoJSON footprints directly from `https://api.daac.asf.alaska.edu/services/search/param`.
- **Full 3D Cesium Globe:** High-performance dark satellite base imagery runs automatically via open-source CartoDB / OSM tiles without needing an API token.
- **Scientific Analysis Pipeline:** Runs DInSAR displacement, log-ratio differencing, and RVI polarimetric calculations end-to-end.
- **ORBIT AI Assistant:** Deterministic scientific reasoning engine grounded in radar physics runs completely offline and deterministically.
- **Multi-Format Exports:** GeoJSON, CSV, JSON metadata reports, and printable HTML dossiers generate with actual calculated numbers and coordinates.

### What Requires Credentials (Documented with Graceful Degradation):
- **Direct Download of Protected NASA Earthdata Granules:** Downloading restricted HDF5/GeoTIFF files requires NASA Earthdata Login (`EARTHDATA_USERNAME`, `EARTHDATA_PASSWORD`, or `EARTHDATA_BEARER_TOKEN`).
- **ISRO Bhoonidhi S-band Orders:** Accessing custom S-band data orders requires ISRO NRSC credentials (`ISRO_BHOONIDHI_API_KEY`).
- **External LLM Synthesis in ORBIT:** Optional external LLM API (`OPENAI_API_KEY` or `GEMINI_API_KEY`). If omitted, ORBIT automatically uses its built-in deterministic radar science engine.
- **Cesium Ion Photogrammetry Assets:** Optional `VITE_CESIUM_ION_TOKEN`. If omitted, the app smoothly cascades to open CartoDB Dark Matter tiles.

---

## 6. Local Setup and Installation

### Prerequisites
- Python 3.11+ or 3.13
- Node.js v18+ and npm

### 1. Clone & Configure Environment
```bash
git clone https://github.com/your-username/terrascope.git
cd terrascope
cp .env.example .env
```

### 2. Backend Setup
```bash
# Create virtual environment
python -m venv backend/venv

# Activate virtual environment (Windows PowerShell):
backend\venv\Scripts\Activate.ps1
# (Linux/macOS):
# source backend/venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run automated tests
pytest -v backend/tests

# Start FastAPI backend server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API docs available at: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
```bash
cd frontend

# Install npm dependencies
npm install

# Test production build
npm run build

# Start Vite development server
npm run dev
```
Open browser at: `http://127.0.0.1:5173`

---

## 7. Testing

### Backend Automated Test Suite:
Run pytest from the project root:
```bash
$env:PYTHONPATH="backend"
backend\venv\Scripts\pytest -v backend\tests
```
Tests cover:
- `test_health_endpoint`: System status and operational services.
- `test_data_providers`: Verification of ASF, Bhoonidhi, and Sample providers.
- `test_events_discovery`: Confirmed vs candidate event classification.
- `test_demo_investigations`: Availability of all 3 precomputed science investigations.
- `test_sar_processor_insar`: InSAR line-of-sight displacement calculations.
- `test_analysis_export_formats`: Exports to GeoJSON, CSV, and HTML dossier formats.
- `test_orbit_assistant`: Deterministic radar physics reasoning engine.

### Frontend TypeScript & Build Verification:
```bash
cd frontend
npm run build
```

---

## 8. Deployment Guide

### Frontend Deployment (Vercel / Netlify):
1. Build command: `npm run build`
2. Output directory: `dist`
3. Environment variables:
   - `VITE_CESIUM_ION_TOKEN` (optional)
4. Configure proxy / rewrite: redirect `/api/*` to your deployed backend URL.

### Backend Deployment (Render / Railway / Fly.io / AWS):
1. Runtime: Python 3.11+
2. Build command: `pip install -r backend/requirements.txt`
3. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Set environment variables from `.env.example`.

---

## 9. Scientific Limitations

1. **One-Dimensional Line-of-Sight (LOS) InSAR:** A single orbital pass measures motion solely projected along the radar look vector. True 3D horizontal (E-W) versus vertical (U-D) crustal motion requires decomposition with opposing descending track observations.
2. **Atmospheric Tropospheric Water Vapor Delay:** Variations in atmospheric moisture can induce spurious $2\text{ to }4\text{ cm}$ phase delays over steep topographic relief.
3. **Temporal Phase Decorrelation:** Vegetative canopy growth, tilling, or snowpack metamorphism can cause decorrelation ($\gamma < 0.35$), preventing reliable phase unwrapping.
4. **Water Surface Roughness Bias:** High surface wind speeds generate capillary waves on open floodwaters, elevating backscatter and occasionally underestimating inundated boundaries.
