import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.routers import health, data, analysis, events, assistant, demo

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("terrascope.main")

app = FastAPI(
    title=settings.app_name,
    description=(
        "TERRA//SCOPE: NISAR-Powered 3D Earth Surface Change Intelligence Platform API. "
        "High-performance synthetic aperture radar (SAR) processing, InSAR crustal deformation analysis, "
        "and physical microwave scattering intelligence."
    ),
    version=settings.version,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Sub-Routers
app.include_router(health.router)
app.include_router(data.router)
app.include_router(analysis.router)
app.include_router(events.router)
app.include_router(assistant.router)
app.include_router(demo.router)

@app.on_event("startup")
async def startup_event():
    logger.info(f"=== {settings.app_name} v{settings.version} Initialized ===")
    logger.info("Radar Analysis Engine: ONLINE")
    logger.info("Alaska Satellite Facility API Connector: READY")
    logger.info("ISRO Bhoonidhi S-band Connector: READY")
    logger.info("ORBIT AI Assistant: ACTIVE")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal scientific processing error occurred. Check input geometries and parameters."}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.host, port=settings.port, reload=True)
