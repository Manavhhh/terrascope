from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from app.models.schemas import ProductMetadata, ProviderInfo, SearchQuery, DataProviderStatus

class BaseDataProvider(ABC):
    def __init__(self, provider_id: str, name: str):
        self.provider_id = provider_id
        self.name = name

    @abstractmethod
    def get_info(self) -> ProviderInfo:
        pass

    @abstractmethod
    async def search(self, query: SearchQuery) -> List[ProductMetadata]:
        pass

    @abstractmethod
    async def get_product_by_id(self, product_id: str) -> Optional[ProductMetadata]:
        pass
