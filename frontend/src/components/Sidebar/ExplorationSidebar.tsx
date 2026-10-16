import React, { useState } from 'react';
import {
  X,
  Compass,
  Play,
  RotateCw,
  Sliders,
  CheckCircle2,
  Mountain,
  Waves,
  Sprout,
  MapPin,
} from 'lucide-react';
import { SurfaceChangeCategory, ProductMetadata, DemoInvestigation } from '../../types';

interface ExplorationSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedCategories: SurfaceChangeCategory[];
  onToggleCategory: (cat: SurfaceChangeCategory) => void;
  products: ProductMetadata[];
  selectedProductA: ProductMetadata | null;
  selectedProductB: ProductMetadata | null;
  onSelectProductA: (p: ProductMetadata | null) => void;
  onSelectProductB: (p: ProductMetadata | null) => void;
  onFlyToCoords: (lon: number, lat: number) => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  confidenceThreshold: number;
  onChangeConfidence: (v: number) => void;
  selectedAlgorithm: string;
  onSelectAlgorithm: (algo: string) => void;
  demoInvestigations: DemoInvestigation[];
  onSelectInvestigation: (inv: DemoInvestigation) => void;
}

export const ExplorationSidebar: React.FC<ExplorationSidebarProps> = ({
  isOpen,
  onToggle,
  products,
  selectedProductA,
  selectedProductB,
  onSelectProductA,
  onSelectProductB,
  onFlyToCoords,
  onRunAnalysis,
  isAnalyzing,
  confidenceThreshold,
  onChangeConfidence,
  selectedAlgorithm,
  onSelectAlgorithm,
  demoInvestigations,
  onSelectInvestigation,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'presets' | 'pipeline' | 'coords'>('presets');
  const [latInput, setLatInput] = useState('');
  const [lonInput, setLonInput] = useState('');

  const handleCoordinateFly = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(latInput);
    const lon = parseFloat(lonInput);
    if (!isNaN(lat) && !isNaN(lon)) {
      onFlyToCoords(lon, lat);
    }
  };

  // If collapsed, provide a clean discreet edge button
  if (!isOpen) {
    return (
      <div className="absolute top-14 left-4 z-20 pointer-events-auto font-sans">
        <button
          onClick={onToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121722]/90 hover:bg-[#181f2e] text-slate-300 hover:text-white border border-[#1e2536] text-xs font-medium shadow-md transition-colors cursor-pointer"
          title="Open Observation Parameters"
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>Observation Parameters</span>
        </button>
      </div>
    );
  }

  return (
    <aside className="absolute top-14 left-4 z-20 w-84 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-120px)] flex flex-col bg-[#121722]/95 rounded-xl border border-[#1e2536] shadow-2xl backdrop-blur-xl pointer-events-auto font-sans select-none overflow-hidden transition-all duration-200">
      {/* Header bar */}
      <div className="px-3.5 py-2.5 border-b border-[#1e2536] flex items-center justify-between bg-[#0f131d]">
        <div className="flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <h2 className="font-semibold text-xs text-slate-100 uppercase tracking-wider">
            Observation Parameters
          </h2>
        </div>
        <button
          onClick={onToggle}
          title="Close Parameters Deck"
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-[#1e2536] bg-[#0a0d14]/50 p-1 gap-1 text-xs">
        <button
          onClick={() => setActiveSubTab('presets')}
          className={`flex-1 py-1 px-2 rounded-md text-center transition-all cursor-pointer font-medium ${
            activeSubTab === 'presets'
              ? 'bg-[#181f2e] text-cyan-300 border border-[#283347] shadow-sm'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          Testbeds
        </button>
        <button
          onClick={() => setActiveSubTab('pipeline')}
          className={`flex-1 py-1 px-2 rounded-md text-center transition-all cursor-pointer font-medium ${
            activeSubTab === 'pipeline'
              ? 'bg-[#181f2e] text-cyan-300 border border-[#283347] shadow-sm'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          Radar Pipeline
        </button>
        <button
          onClick={() => setActiveSubTab('coords')}
          className={`flex-1 py-1 px-2 rounded-md text-center transition-all cursor-pointer font-medium ${
            activeSubTab === 'coords'
              ? 'bg-[#181f2e] text-cyan-300 border border-[#283347] shadow-sm'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          Target Coords
        </button>
      </div>

      {/* Content Body */}
      <div className="p-3.5 overflow-y-auto space-y-3.5 text-xs flex-1 custom-scrollbar">
        {/* PRESETS TAB */}
        {activeSubTab === 'presets' && (
          <div className="space-y-2.5">
            <div className="text-[10px] uppercase font-mono-tech tracking-wider text-slate-400 flex items-center justify-between">
              <span>Calibrated Science Testbeds</span>
              <span className="text-[10px] text-slate-500">3 VERIFIED</span>
            </div>

            <div className="space-y-2">
              {demoInvestigations.map((inv) => (
                <div
                  key={inv.investigation_id}
                  onClick={() => onSelectInvestigation(inv)}
                  className="p-2.5 rounded-lg bg-[#0f131d] hover:bg-[#181f2e] border border-[#1e2536] hover:border-[#283347] cursor-pointer transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-slate-100 text-xs group-hover:text-cyan-300 leading-snug">
                      {inv.title}
                    </span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#161c29] text-slate-300 border border-[#1e2536] shrink-0 font-mono-tech">
                      L2_{inv.product_b?.processing_level || 'GUNW'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {inv.summary}
                  </p>

                  <div className="flex items-center justify-between pt-1.5 mt-2 border-t border-[#1e2536] text-[10px] text-slate-400">
                    <span className="text-cyan-400 font-mono-tech">
                      {inv.location_name.split(',')[0]}
                    </span>
                    <span className="text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> READY
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PIPELINE TAB */}
        {activeSubTab === 'pipeline' && (
          <div className="space-y-3">
            {/* Scene Pair Selector */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono-tech tracking-wider text-slate-400 block">
                Scene Pair Selection
              </label>

              <div>
                <span className="text-[10px] text-slate-400 block mb-1">
                  Baseline Reference (Scene A)
                </span>
                <select
                  value={selectedProductA?.product_id || ''}
                  onChange={(e) => {
                    const p = products.find((prod) => prod.product_id === e.target.value);
                    onSelectProductA(p || null);
                  }}
                  className="w-full bg-[#0f131d] border border-[#1e2536] rounded-md px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="">Select Reference Product...</option>
                  {products.map((p) => (
                    <option key={p.product_id} value={p.product_id}>
                      {p.acquisition_date} - {p.platform} ({p.processing_level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-1">
                  Repeat Pass (Scene B)
                </span>
                <select
                  value={selectedProductB?.product_id || ''}
                  onChange={(e) => {
                    const p = products.find((prod) => prod.product_id === e.target.value);
                    onSelectProductB(p || null);
                  }}
                  className="w-full bg-[#0f131d] border border-[#1e2536] rounded-md px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="">Select Secondary Product...</option>
                  {products.map((p) => (
                    <option key={p.product_id} value={p.product_id}>
                      {p.acquisition_date} - {p.platform} ({p.processing_level})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Algorithm Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono-tech tracking-wider text-slate-400 block">
                Detection Algorithm
              </label>
              <select
                value={selectedAlgorithm}
                onChange={(e) => onSelectAlgorithm(e.target.value)}
                className="w-full bg-[#0f131d] border border-[#1e2536] rounded-md px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
              >
                <option value="dinsar_phase_displacement">
                  D-InSAR Crustal Phase Displacement
                </option>
                <option value="backscatter_log_ratio">
                  Multi-Temporal Backscatter Log-Ratio
                </option>
                <option value="polarimetric_rvi">
                  Polarimetric Radar Vegetation Index (RVI)
                </option>
                <option value="coherence_change_detection">
                  Coherence Change Detection (CCD)
                </option>
              </select>
            </div>

            {/* Threshold Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Confidence Threshold</span>
                <span className="font-mono-tech text-cyan-300">
                  {(confidenceThreshold * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.99"
                step="0.01"
                value={confidenceThreshold}
                onChange={(e) => onChangeConfidence(parseFloat(e.target.value))}
                className="w-full h-1 bg-[#1c2333] accent-cyan-400 rounded cursor-pointer"
              />
            </div>

            {/* Run Button */}
            <button
              onClick={onRunAnalysis}
              disabled={isAnalyzing || !selectedProductA || !selectedProductB}
              className={`w-full py-2 px-3 rounded-md font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isAnalyzing || !selectedProductA || !selectedProductB
                  ? 'bg-[#181f2e] text-slate-500 cursor-not-allowed border border-[#1e2536]'
                  : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-sm'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing Multi-Temporal Pass...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Analysis</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* COORDS TAB */}
        {activeSubTab === 'coords' && (
          <form onSubmit={handleCoordinateFly} className="space-y-3">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Enter target geodetic coordinates to re-center the 3D Cesium sensor view.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase font-mono-tech text-slate-400 block mb-1">
                  Latitude (°N)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 37.58"
                  value={latInput}
                  onChange={(e) => setLatInput(e.target.value)}
                  className="w-full bg-[#0f131d] border border-[#1e2536] rounded-md px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 font-mono-tech"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono-tech text-slate-400 block mb-1">
                  Longitude (°E)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 36.92"
                  value={lonInput}
                  onChange={(e) => setLonInput(e.target.value)}
                  className="w-full bg-[#0f131d] border border-[#1e2536] rounded-md px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 font-mono-tech"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-1.5 px-3 rounded-md bg-[#181f2e] hover:bg-[#1f293d] border border-[#283347] text-xs text-cyan-300 font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Viewport</span>
            </button>
          </form>
        )}
      </div>
    </aside>
  );
};
