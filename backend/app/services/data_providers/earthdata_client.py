import logging
import httpx
from typing import Dict, Any, Optional

logger = logging.getLogger("terrascope.earthdata")

class EarthdataClient:
    """
    NASA Earthdata CMR (Common Metadata Repository) & EDL Authentication Client.
    Protects Earthdata credentials securely on the backend.
    """
    CMR_URL = "https://cmr.earthdata.nasa.gov/search/granules.json"
    EDL_TOKEN_URL = "https://urs.earthdata.nasa.gov/oauth/token"

    def __init__(self, username: str = "", password: str = "", bearer_token: str = ""):
        self.username = username
        self.password = password
        self.bearer_token = bearer_token

    def is_authenticated(self) -> bool:
        return bool(self.bearer_token or (self.username and self.password))

    def get_auth_headers(self) -> Dict[str, str]:
        if self.bearer_token:
            return {"Authorization": f"Bearer {self.bearer_token}"}
        return {}

    async def verify_connection(self) -> Dict[str, Any]:
        """Checks if NASA Earthdata CMR is responsive and credential status."""
        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                res = await client.get("https://cmr.earthdata.nasa.gov/search/collections.json?limit=1")
                cmr_ok = res.status_code == 200
                return {
                    "cmr_accessible": cmr_ok,
                    "auth_configured": self.is_authenticated(),
                    "download_entitled": self.is_authenticated(),
                    "status_code": res.status_code
                }
        except Exception as e:
            logger.warning(f"Failed to ping NASA Earthdata CMR: {e}")
            return {
                "cmr_accessible": False,
                "auth_configured": self.is_authenticated(),
                "download_entitled": False,
                "error": str(e)
            }
