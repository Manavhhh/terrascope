import {
  SystemHealth,
  ProviderInfo,
  ProductMetadata,
  AnalysisResult,
  EventItem,
  DemoInvestigation,
  AssistantResponse,
  SurfaceChangeCategory,
  EventStatus,
} from '../types';

const API_BASE = '/api';

export const api = {
  async getHealth(): Promise<SystemHealth> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
    return res.json();
  },

  async getProviders(): Promise<ProviderInfo[]> {
    const res = await fetch(`${API_BASE}/data/providers`);
    if (!res.ok) throw new Error(`Failed to fetch providers: ${res.status}`);
    return res.json();
  },

  async searchProducts(params: {
    min_lon?: number;
    min_lat?: number;
    max_lon?: number;
    max_lat?: number;
    start_date?: string;
    end_date?: string;
    platform?: string;
    provider?: string;
    max_results?: number;
  }): Promise<{ products: ProductMetadata[]; total_found: number; message?: string }> {
    const query = new URLSearchParams();
    if (params.min_lon !== undefined) query.set('min_lon', params.min_lon.toString());
    if (params.min_lat !== undefined) query.set('min_lat', params.min_lat.toString());
    if (params.max_lon !== undefined) query.set('max_lon', params.max_lon.toString());
    if (params.max_lat !== undefined) query.set('max_lat', params.max_lat.toString());
    if (params.start_date) query.set('start_date', params.start_date);
    if (params.end_date) query.set('end_date', params.end_date);
    if (params.platform) query.set('platform', params.platform);
    if (params.provider) query.set('provider', params.provider);
    if (params.max_results) query.set('max_results', params.max_results.toString());

    const res = await fetch(`${API_BASE}/data/search?${query.toString()}`);
    if (!res.ok) throw new Error(`Search failed: ${res.status}`);
    return res.json();
  },

  async getProduct(productId: string): Promise<ProductMetadata> {
    const res = await fetch(`${API_BASE}/data/products/${encodeURIComponent(productId)}`);
    if (!res.ok) throw new Error(`Product not found: ${res.status}`);
    return res.json();
  },

  async runAnalysis(payload: {
    product_a_id: string;
    product_b_id: string;
    category: SurfaceChangeCategory;
    algorithm: string;
    aoi_bbox?: { min_lon: number; min_lat: number; max_lon: number; max_lat: number };
    confidence_threshold?: number;
  }): Promise<AnalysisResult> {
    const res = await fetch(`${API_BASE}/analysis/detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Analysis failed' }));
      throw new Error(err.detail || `Analysis error: ${res.status}`);
    }
    return res.json();
  },

  async compareObservations(payload: {
    product_a_id: string;
    product_b_id: string;
    metric?: string;
  }): Promise<AnalysisResult> {
    const res = await fetch(`${API_BASE}/analysis/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Comparison failed' }));
      throw new Error(err.detail || `Comparison error: ${res.status}`);
    }
    return res.json();
  },

  async getAnalysis(analysisId: string): Promise<AnalysisResult> {
    const res = await fetch(`${API_BASE}/analysis/${encodeURIComponent(analysisId)}`);
    if (!res.ok) throw new Error(`Analysis not found: ${res.status}`);
    return res.json();
  },

  getExportUrl(analysisId: string, format: 'geojson' | 'csv' | 'json' | 'html'): string {
    return `${API_BASE}/analysis/${encodeURIComponent(analysisId)}/export?format=${format}`;
  },

  async getEvents(category?: SurfaceChangeCategory, status?: EventStatus): Promise<EventItem[]> {
    const query = new URLSearchParams();
    if (category) query.set('category', category);
    if (status) query.set('status', status);
    const res = await fetch(`${API_BASE}/events?${query.toString()}`);
    if (!res.ok) throw new Error(`Events fetch failed: ${res.status}`);
    return res.json();
  },

  async askOrbit(payload: {
    prompt: string;
    selected_event_id?: string;
    selected_analysis_id?: string;
    coordinates?: [number, number];
    context_meta?: any;
  }): Promise<AssistantResponse> {
    const res = await fetch(`${API_BASE}/assistant/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`ORBIT query failed: ${res.status}`);
    return res.json();
  },

  async getDemoInvestigations(): Promise<DemoInvestigation[]> {
    const res = await fetch(`${API_BASE}/demo/investigations`);
    if (!res.ok) throw new Error(`Failed to load demo investigations: ${res.status}`);
    return res.json();
  },

  async getDemoInvestigation(id: string): Promise<DemoInvestigation> {
    const res = await fetch(`${API_BASE}/demo/investigations/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`Failed to load investigation: ${res.status}`);
    return res.json();
  },
};
