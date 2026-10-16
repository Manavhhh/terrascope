export type SurfaceChangeCategory =
  | 'ground_deformation'
  | 'vegetation_forest'
  | 'flood_wetland'
  | 'agriculture'
  | 'glacier_ice'
  | 'wildfire';

export type DataProviderStatus =
  | 'live_connected'
  | 'search_completed'
  | 'results_available'
  | 'no_matching_observations'
  | 'auth_required'
  | 'provider_unavailable'
  | 'sample_data_active';

export type EventStatus = 'confirmed' | 'algorithmic_candidate' | 'under_review';

export interface BoundingBox {
  min_lon: number;
  min_lat: number;
  max_lon: number;
  max_lat: number;
}

export interface ProductMetadata {
  product_id: string;
  title: string;
  mission: string;
  sensor: string;
  platform: string;
  acquisition_date: string;
  processing_level: string;
  polarization: string;
  orbit_direction: string;
  relative_orbit?: number;
  footprint_geojson: any;
  source_status: string;
  download_url?: string;
  source_url?: string;
  file_size_mb?: number;
  is_demo: boolean;
}

export interface ProviderInfo {
  provider_id: string;
  name: string;
  agency: string;
  bands: string[];
  status: DataProviderStatus;
  auth_required_for_download: boolean;
  free_public_search: boolean;
  description: string;
  supported_products: string[];
  reference_url: string;
}

export interface AnalysisMetrics {
  mean_change_value: number;
  max_change_value: number;
  min_change_value: number;
  units: string;
  affected_area_km2: number;
  ground_displacement_cm?: number;
  coherence_loss_ratio?: number;
  confidence_score: number;
  quality_grade: string;
}

export interface AnalysisResult {
  analysis_id: string;
  timestamp: string;
  category: SurfaceChangeCategory;
  algorithm_name: string;
  algorithm_version: string;
  input_products: ProductMetadata[];
  metrics: AnalysisMetrics;
  evidence_summary: string;
  scientific_interpretation: string;
  limitations: string[];
  geojson_layers: any;
  time_series_data?: Array<{ date: string; [key: string]: any }>;
  raster_overlay_url?: string;
  provenance: Record<string, any>;
  is_demo_data: boolean;
}

export interface EventItem {
  event_id: string;
  title: string;
  category: SurfaceChangeCategory;
  location_name: string;
  coordinates: [number, number]; // [lon, lat]
  observation_date: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  status: EventStatus;
  confidence: number;
  description: string;
  affected_area_km2: number;
  displacement_cm?: number;
  source_attribution: string;
  product_ids: string[];
  is_demo: boolean;
}

export interface AssistantResponse {
  observed_evidence: string[];
  plausible_interpretation: string;
  confidence_assessment: string;
  alternative_explanations: string[];
  recommended_verification_steps: string[];
  scientific_citations_links: Array<{ name: string; url: string }>;
  source_mode: string;
}

export interface DemoInvestigation {
  investigation_id: string;
  title: string;
  category: SurfaceChangeCategory;
  location_name: string;
  coordinates: [number, number, number]; // [lon, lat, height]
  question: string;
  data_source: string;
  observation_dates: string[];
  summary: string;
  methodology: string;
  limitations: string;
  source_documentation_url: string;
  product_a: ProductMetadata;
  product_b: ProductMetadata;
  precomputed_analysis: AnalysisResult;
}

export interface SystemHealth {
  status: string;
  app_name: string;
  tagline: string;
  version: string;
  environment: string;
  timestamp: string;
  services: Record<string, string>;
}

export type ColorPaletteId = 'spectral' | 'bipolar' | 'hydro' | 'canopy';

export interface ColorPaletteDef {
  id: ColorPaletteId;
  name: string;
  category: string;
  description: string;
  gradient: string;
  colors: string[];
  unit: string;
  minLabel: string;
  zeroLabel: string;
  maxLabel: string;
}
