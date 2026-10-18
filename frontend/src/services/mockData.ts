import mockDataRaw from './mockData.json';
import { DemoInvestigation, EventItem, ProductMetadata, ProviderInfo } from '../types';

export const mockDemos = mockDataRaw.demos as unknown as DemoInvestigation[];
export const mockEvents = mockDataRaw.events as unknown as EventItem[];
export const mockCatalog = mockDataRaw.catalog as unknown as ProductMetadata[];
export const mockProviders = mockDataRaw.providers as unknown as ProviderInfo[];
