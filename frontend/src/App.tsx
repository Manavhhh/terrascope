import React, { useState, useEffect } from 'react';
import { TopNav } from './components/Navigation/TopNav';
import { CategoryPillBar } from './components/Navigation/CategoryPillBar';
import { SettingsModal } from './components/Navigation/SettingsModal';
import { CommandPalette } from './components/Navigation/CommandPalette';
import { GuidedTourModal } from './components/Navigation/GuidedTourModal';
import { ExplorationSidebar } from './components/Sidebar/ExplorationSidebar';
import { IntelligencePanel } from './components/Intelligence/IntelligencePanel';
import { TemporalTimeline } from './components/Timeline/TemporalTimeline';
import { CesiumGlobe } from './components/Globe/CesiumGlobe';
import { GlobeHUD } from './components/Globe/GlobeHUD';
import { CompareLabView } from './components/Compare/CompareLabView';
import { EventDiscoveryView } from './components/Events/EventDiscoveryView';
import { DataCatalogView } from './components/Catalog/DataCatalogView';
import { MethodologyView } from './components/Methodology/MethodologyView';
import {
  SystemHealth,
  ProviderInfo,
  ProductMetadata,
  EventItem,
  DemoInvestigation,
  AnalysisResult,
  SurfaceChangeCategory,
  ColorPaletteId,
} from './types';
import { api } from './services/api';

export const App: React.FC = () => {
  // Navigation & Mode
  const [activeTab, setActiveTab] = useState<
    'explore' | 'events' | 'compare' | 'catalog' | 'methodology'
  >('explore');

  // Core Data State
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [products, setProducts] = useState<ProductMetadata[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [demoInvestigations, setDemoInvestigations] = useState<DemoInvestigation[]>([]);
  const [activeInvestigation, setActiveInvestigation] = useState<DemoInvestigation | null>(null);

  // Selection & Analysis State
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedProductA, setSelectedProductA] = useState<ProductMetadata | null>(null);
  const [selectedProductB, setSelectedProductB] = useState<ProductMetadata | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Filters & Algorithm
  const [selectedCategories, setSelectedCategories] = useState<SurfaceChangeCategory[]>([
    'ground_deformation',
  ]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('dinsar_phase_displacement');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.8);

  // Globe HUD & Layer Controls
  const [flyToLocation, setFlyToLocation] = useState<{ lon: number; lat: number; height?: number } | null>(
    null
  );
  const [hoverCoords, setHoverCoords] = useState<{ lon: number; lat: number; height: number } | null>(
    null
  );
  const [showOrbits, setShowOrbits] = useState(true);
  const [showFootprints, setShowFootprints] = useState(true);
  const [showChangeLayer, setShowChangeLayer] = useState(true);
  const [layerOpacity, setLayerOpacity] = useState(0.85);
  const [is2DMode, setIs2DMode] = useState(false);
  const [zoomTrigger, setZoomTrigger] = useState<{ action: 'in' | 'out'; timestamp: number } | null>(null);
  const [colorPalette, setColorPalette] = useState<ColorPaletteId>('spectral');

  // Layout Panels Collapsible State (Default clean & expansive)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isIntelligenceOpen, setIsIntelligenceOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [cesiumToken, setCesiumToken] = useState('');

  // Initial Data Fetch
  useEffect(() => {
    const initApp = async () => {
      try {
        const [h, p, evts, demos, searchRes] = await Promise.all([
          api.getHealth().catch(() => null),
          api.getProviders().catch(() => []),
          api.getEvents().catch(() => []),
          api.getDemoInvestigations().catch(() => []),
          api.searchProducts({ max_results: 30 }).catch(() => ({ products: [], total_found: 0 })),
        ]);

        if (h) setHealth(h);
        if (p) setProviders(p);
        if (evts) setEvents(evts);
        if (demos) setDemoInvestigations(demos);
        if (searchRes && searchRes.products.length > 0) {
          setProducts(searchRes.products);
        }

        // Set initial focal point to Turkey Earthquake Rupture
        if (demos && demos.length > 0) {
          const firstDemo = demos[0];
          setActiveInvestigation(firstDemo);
          setSelectedProductA(firstDemo.product_a);
          setSelectedProductB(firstDemo.product_b);
          setActiveAnalysis(firstDemo.precomputed_analysis);
          setFlyToLocation({
            lon: firstDemo.coordinates[0],
            lat: firstDemo.coordinates[1],
            height: firstDemo.coordinates[2] || 600000,
          });
        }
      } catch (err) {
        console.error('Initialization error:', err);
      }
    };

    initApp();
  }, []);

  // Keyboard shortcut listener for Figma-style Command Palette (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsTourOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handler: Select a prebuilt demo investigation
  const handleSelectInvestigation = (inv: DemoInvestigation) => {
    setActiveInvestigation(inv);
    setSelectedProductA(inv.product_a);
    setSelectedProductB(inv.product_b);
    setActiveAnalysis(inv.precomputed_analysis);
    setSelectedEvent(null);
    setSelectedCategories([inv.category]);
    setFlyToLocation({
      lon: inv.coordinates[0],
      lat: inv.coordinates[1],
      height: inv.coordinates[2] || 600000,
    });
    // Open intelligence inspector to display telemetry
    setIsIntelligenceOpen(true);
    setActiveTab('explore');
  };

  // Handler: Select single category from top pill bar
  const handleSelectCategoryFromPill = (cat: SurfaceChangeCategory) => {
    setSelectedCategories([cat]);
    // Find matching demo if available
    const matchingDemo = demoInvestigations.find((d) => d.category === cat);
    if (matchingDemo) {
      handleSelectInvestigation(matchingDemo);
    } else {
      // Find matching event
      const matchingEvent = events.find((e) => e.category === cat);
      if (matchingEvent) {
        setSelectedEvent(matchingEvent);
        setFlyToLocation({
          lon: matchingEvent.coordinates[0],
          lat: matchingEvent.coordinates[1],
          height: 600000,
        });
        setIsIntelligenceOpen(true);
      }
    }
  };

  // Handler: Execute change detection pipeline
  const handleRunAnalysis = async () => {
    if (!selectedProductA || !selectedProductB) return;
    setIsAnalyzing(true);
    try {
      const res = await api.runAnalysis({
        product_a_id: selectedProductA.product_id,
        product_b_id: selectedProductB.product_id,
        category: selectedCategories[0] || 'ground_deformation',
        algorithm: selectedAlgorithm,
        confidence_threshold: confidenceThreshold,
      });
      setActiveAnalysis(res);
      // Auto-open intelligence panel to show result
      setIsIntelligenceOpen(true);
    } catch (err) {
      console.error('Analysis execution failed:', err);
      alert(`Analysis Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handler: Run comparison in Compare Lab
  const handleRunComparison = async (prodAId: string, prodBId: string) => {
    setIsAnalyzing(true);
    try {
      const res = await api.compareObservations({
        product_a_id: prodAId,
        product_b_id: prodBId,
      });
      setActiveAnalysis(res);
    } catch (err) {
      console.error('Comparison failed:', err);
      alert(`Comparison Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handler: Search geocoding / coordinate input
  const handleSearchQuery = (query: string) => {
    const parts = query.split(/[\s,]+/);
    if (parts.length === 2) {
      const p1 = parseFloat(parts[0]);
      const p2 = parseFloat(parts[1]);
      if (!isNaN(p1) && !isNaN(p2)) {
        const lat = Math.abs(p1) <= 90 ? p1 : p2;
        const lon = Math.abs(p1) > 90 ? p1 : p2;
        setFlyToLocation({ lon, lat, height: 600000 });
        return;
      }
    }

    const lower = query.toLowerCase();
    if (lower.includes('turkey') || lower.includes('kahramanmaras')) {
      setFlyToLocation({ lon: 36.92, lat: 37.58, height: 500000 });
    } else if (lower.includes('assam') || lower.includes('brahmaputra') || lower.includes('india')) {
      setFlyToLocation({ lon: 92.8, lat: 26.6, height: 600000 });
    } else if (lower.includes('california') || lower.includes('san joaquin') || lower.includes('valley')) {
      setFlyToLocation({ lon: -119.8, lat: 36.6, height: 550000 });
    } else if (lower.includes('himalaya') || lower.includes('siachen')) {
      setFlyToLocation({ lon: 77.1, lat: 35.4, height: 500000 });
    } else {
      alert(`Targeting search coordinates for: "${query}"`);
    }
  };

  // Handler: Toggle Category in Sidebar
  const handleToggleCategory = (cat: SurfaceChangeCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Handler: Reset View to Active Target
  const handleResetView = () => {
    if (activeInvestigation) {
      setFlyToLocation({
        lon: activeInvestigation.coordinates[0],
        lat: activeInvestigation.coordinates[1],
        height: activeInvestigation.coordinates[2] || 600000,
      });
    } else {
      setFlyToLocation({ lon: 36.92, lat: 37.58, height: 600000 });
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#090e1b] text-slate-100 flex flex-col font-sans select-none">
      {/* Top Navigation Header (Clean SaaS) */}
      <TopNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        health={health}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isIntelligenceOpen={isIntelligenceOpen}
        onToggleIntelligence={() => setIsIntelligenceOpen(!isIntelligenceOpen)}
        activeInvestigation={activeInvestigation}
        demoInvestigations={demoInvestigations}
        onSelectInvestigation={handleSelectInvestigation}
        onStartTour={() => setIsTourOpen(true)}
      />

      {/* Main Center Stage */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {/* Interactive 3D Cesium Globe (Panoramic Hero Centerpiece) */}
        <CesiumGlobe
          products={products}
          selectedProduct={selectedProductA || selectedProductB}
          activeAnalysis={activeAnalysis}
          events={events}
          selectedEvent={selectedEvent}
          onSelectEvent={(evt) => {
            setSelectedEvent(evt);
            setIsIntelligenceOpen(true);
          }}
          onSelectProduct={(prod) => {
            setSelectedProductA(prod);
          }}
          flyToLocation={flyToLocation}
          showOrbits={showOrbits}
          showFootprints={showFootprints}
          showChangeLayer={showChangeLayer}
          layerOpacity={layerOpacity}
          is2DMode={is2DMode}
          onCoordinatesHover={setHoverCoords}
          cesiumIonToken={cesiumToken}
          zoomTrigger={zoomTrigger}
          colorPalette={colorPalette}
        />

        {/* Sub-Bar / Preset Discovery Strip (Figma & Stitch spec) */}
        {activeTab === 'explore' && (
          <CategoryPillBar
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
            onSelectSingleCategory={handleSelectCategoryFromPill}
            activeInvestigation={activeInvestigation}
            onSelectInvestigation={handleSelectInvestigation}
            demoInvestigations={demoInvestigations}
          />
        )}

        {/* Centered Floating Canvas Tool Dock (Figma Toolbar) */}
        {activeTab === 'explore' && (
          <GlobeHUD
            coordinates={hoverCoords}
            is2DMode={is2DMode}
            onToggle2D={() => setIs2DMode(!is2DMode)}
            showOrbits={showOrbits}
            onToggleOrbits={() => setShowOrbits(!showOrbits)}
            showFootprints={showFootprints}
            onToggleFootprints={() => setShowFootprints(!showFootprints)}
            showChangeLayer={showChangeLayer}
            onToggleChangeLayer={() => setShowChangeLayer(!showChangeLayer)}
            layerOpacity={layerOpacity}
            onChangeOpacity={setLayerOpacity}
            onResetView={handleResetView}
            onZoomIn={() => setZoomTrigger({ action: 'in', timestamp: Date.now() })}
            onZoomOut={() => setZoomTrigger({ action: 'out', timestamp: Date.now() })}
            colorPalette={colorPalette}
            onChangeColorPalette={setColorPalette}
          />
        )}

        {/* Floating Left Mission Controller Deck */}
        {activeTab === 'explore' && (
          <ExplorationSidebar
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
            products={products}
            selectedProductA={selectedProductA}
            selectedProductB={selectedProductB}
            onSelectProductA={setSelectedProductA}
            onSelectProductB={setSelectedProductB}
            onFlyToCoords={(lon, lat) => setFlyToLocation({ lon, lat, height: 600000 })}
            onRunAnalysis={handleRunAnalysis}
            isAnalyzing={isAnalyzing}
            confidenceThreshold={confidenceThreshold}
            onChangeConfidence={setConfidenceThreshold}
            selectedAlgorithm={selectedAlgorithm}
            onSelectAlgorithm={setSelectedAlgorithm}
            demoInvestigations={demoInvestigations}
            onSelectInvestigation={handleSelectInvestigation}
          />
        )}

        {/* Floating Right Intelligence & Orbit AI Inspector */}
        {activeTab === 'explore' && (
          <IntelligencePanel
            isOpen={isIntelligenceOpen}
            onToggle={() => setIsIntelligenceOpen(!isIntelligenceOpen)}
            selectedEvent={selectedEvent}
            activeAnalysis={activeAnalysis}
          />
        )}

        {/* Floating Bottom Temporal Scrubber Dock */}
        {activeTab === 'explore' && (
          <TemporalTimeline
            isOpen={isTimelineOpen}
            onToggle={() => setIsTimelineOpen(!isTimelineOpen)}
            activeAnalysis={activeAnalysis}
            products={products}
            onSelectDate={(date) => {
              console.log('Selected date:', date);
            }}
          />
        )}

        {/* Mode Overlay Views */}
        {activeTab === 'compare' && (
          <CompareLabView
            products={products}
            activeAnalysis={activeAnalysis}
            onRunComparison={handleRunComparison}
            onNavigateToGlobe={() => setActiveTab('explore')}
          />
        )}

        {activeTab === 'events' && (
          <EventDiscoveryView
            events={events}
            onSelectEvent={(evt) => {
              setSelectedEvent(evt);
              setActiveTab('explore');
            }}
            onFlyTo={(lon, lat) => {
              setFlyToLocation({ lon, lat, height: 600000 });
              setActiveTab('explore');
            }}
          />
        )}

        {activeTab === 'catalog' && (
          <DataCatalogView
            products={products}
            providers={providers}
            onSelectProduct={(p) => {
              setSelectedProductA(p);
            }}
            onFlyToProduct={(p) => {
              const coords = p.footprint_geojson?.coordinates?.[0]?.[0];
              if (coords) {
                setFlyToLocation({ lon: coords[0], lat: coords[1], height: 600000 });
              }
              setActiveTab('explore');
            }}
          />
        )}

        {activeTab === 'methodology' && <MethodologyView />}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        providers={providers}
        cesiumToken={cesiumToken}
        onSaveCesiumToken={setCesiumToken}
        colorPalette={colorPalette}
        onChangeColorPalette={setColorPalette}
      />

      {/* Figma-Style Command Palette (⌘K / Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={setActiveTab}
        onSelectInvestigation={handleSelectInvestigation}
        onSelectEvent={(evt) => {
          setSelectedEvent(evt);
          setFlyToLocation({
            lon: evt.coordinates[0],
            lat: evt.coordinates[1],
            height: 600000,
          });
          setIsIntelligenceOpen(true);
          setActiveTab('explore');
        }}
        onFlyTo={(lon, lat) => {
          setFlyToLocation({ lon, lat, height: 600000 });
        }}
        onToggle2D={() => setIs2DMode(!is2DMode)}
        is2DMode={is2DMode}
        onToggleOrbits={() => setShowOrbits(!showOrbits)}
        showOrbits={showOrbits}
        onToggleFootprints={() => setShowFootprints(!showFootprints)}
        showFootprints={showFootprints}
        onToggleChangeLayer={() => setShowChangeLayer(!showChangeLayer)}
        showChangeLayer={showChangeLayer}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onToggleIntelligence={() => setIsIntelligenceOpen(!isIntelligenceOpen)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        demoInvestigations={demoInvestigations}
        events={events}
      />

      {/* Guided Tour Modal */}
      <GuidedTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onJumpToDemo={(idx) => {
          if (demoInvestigations[idx]) {
            handleSelectInvestigation(demoInvestigations[idx]);
          }
        }}
      />
    </div>
  );
};

export default App;
