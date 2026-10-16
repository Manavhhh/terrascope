import React, { useState } from 'react';
import {
  SplitSquareVertical,
  Calendar,
  Layers,
  ArrowRight,
  Sliders,
  AlertCircle,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { ProductMetadata, AnalysisResult } from '../../types';

interface CompareLabViewProps {
  products: ProductMetadata[];
  activeAnalysis: AnalysisResult | null;
  onRunComparison: (prodAId: string, prodBId: string) => void;
  onNavigateToGlobe: () => void;
}

export const CompareLabView: React.FC<CompareLabViewProps> = ({
  products,
  activeAnalysis,
  onRunComparison,
  onNavigateToGlobe,
}) => {
  const [selectedAId, setSelectedAId] = useState(
    activeAnalysis?.input_products[0]?.product_id || products[0]?.product_id || ''
  );
  const [selectedBId, setSelectedBId] = useState(
    activeAnalysis?.input_products[1]?.product_id || products[1]?.product_id || ''
  );
  const [swipePosition, setSwipePosition] = useState(50); // 0 to 100 percentage
  const [showDifferenceLayer, setShowDifferenceLayer] = useState(true);
  const [differenceOpacity, setDifferenceOpacity] = useState(0.8);

  const prodA = products.find((p) => p.product_id === selectedAId);
  const prodB = products.find((p) => p.product_id === selectedBId);

  // Incompatibility check
  const isComparable = prodA && prodB && prodA.orbit_direction === prodB.orbit_direction;
  const incompatibilityReason =
    prodA && prodB && prodA.orbit_direction !== prodB.orbit_direction
      ? `Geometric Incompatibility: Baseline A is ${prodA.orbit_direction} while Baseline B is ${prodB.orbit_direction}. Radar look angles conflict.`
      : null;

  return (
    <div className="absolute inset-0 top-12 bg-[#080b11] z-20 flex flex-col font-sans select-none overflow-y-auto">
      {/* Compare Lab Controls Bar */}
      <div className="bg-[#0e131f] border-b border-[#1e2638] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <SplitSquareVertical className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight">
              Before / After Comparison Lab
            </h2>
            <p className="text-xs text-slate-400">
              Synchronized temporal change inspection with swipe curtain & radiometric differencing
            </p>
          </div>
        </div>

        {/* Scene Pair Selectors */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-cyan-300 font-medium font-mono-tech">PRE-EVENT (T1):</span>
            <select
              value={selectedAId}
              onChange={(e) => setSelectedAId(e.target.value)}
              className="bg-[#141b2a] border border-[#222d42] text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 font-sans"
            >
              {products.map((p) => (
                <option key={p.product_id} value={p.product_id}>
                  {p.acquisition_date.substring(0, 10)} - {p.title.substring(0, 30)}
                </option>
              ))}
            </select>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-500" />

          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-300 font-medium font-mono-tech">POST-EVENT (T2):</span>
            <select
              value={selectedBId}
              onChange={(e) => setSelectedBId(e.target.value)}
              className="bg-[#141b2a] border border-[#222d42] text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-purple-400 font-sans"
            >
              {products.map((p) => (
                <option key={p.product_id} value={p.product_id}>
                  {p.acquisition_date.substring(0, 10)} - {p.title.substring(0, 30)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onRunComparison(selectedAId, selectedBId)}
            disabled={!isComparable}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isComparable
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md'
                : 'bg-[#1b2336] text-slate-500 cursor-not-allowed'
            }`}
          >
            Execute Comparison
          </button>
        </div>
      </div>

      {/* Incompatibility Warning */}
      {incompatibilityReason && (
        <div className="m-4 p-3 bg-amber-950/40 border border-amber-500/40 rounded flex items-center gap-2 text-amber-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{incompatibilityReason}</span>
        </div>
      )}

      {/* Synchronized Swipe Inspector Screen */}
      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Visual Swipe Simulator Panel (2 cols) */}
        <div className="lg:col-span-2 bg-[#060b18] border border-cyan-500/25 rounded-lg overflow-hidden flex flex-col relative shadow-2xl">
          {/* Header Bar */}
          <div className="p-3 bg-[#09101f] border-b border-cyan-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-cyan-400">SYNCHRONIZED SWIPE CURTAIN</span>
              <span className="text-slate-400 text-[10px]">
                DRAG SLIDER: <strong className="text-white">{swipePosition}%</strong>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDifferenceLayer}
                  onChange={(e) => setShowDifferenceLayer(e.target.checked)}
                  className="accent-cyan-400"
                />
                <span>CHANGE DELTA OVERLAY</span>
              </label>
              {showDifferenceLayer && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">OPACITY:</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={differenceOpacity}
                    onChange={(e) => setDifferenceOpacity(parseFloat(e.target.value))}
                    className="w-16 h-1 accent-cyan-400"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Canvas Simulation Area */}
          <div className="flex-1 relative min-h-[380px] bg-[#02050e] overflow-hidden flex items-center justify-center">
            {/* Background Simulated Grid */}
            <div className="absolute inset-0 tech-grid-bg opacity-30" />

            {/* Left Frame (Scene A - Baseline) */}
            <div
              className="absolute inset-0 border-r-2 border-cyan-400 bg-gradient-to-r from-cyan-950/20 to-transparent flex items-center justify-start pl-8"
              style={{ width: `${swipePosition}%` }}
            >
              <div className="bg-[#09101f]/90 border border-cyan-500/40 p-3 rounded backdrop-blur max-w-xs shadow-xl">
                <span className="text-[10px] text-cyan-400 uppercase font-bold block">
                  T1 REFERENCE BASELINE
                </span>
                <div className="text-white font-bold text-xs mt-1">
                  {prodA?.title || 'Scene A Baseline'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Acquired: {prodA?.acquisition_date.substring(0, 10)} | Orbit {prodA?.orbit_direction}
                </div>
                <div className="text-[10px] text-emerald-400 mt-1">
                  Normal Radiometric Backscatter: -11.8 dB
                </div>
              </div>
            </div>

            {/* Right Frame (Scene B - Post-event) */}
            <div className="absolute right-8 top-12 bg-[#09101f]/90 border border-purple-500/40 p-3 rounded backdrop-blur max-w-xs shadow-xl pointer-events-none">
              <span className="text-[10px] text-purple-400 uppercase font-bold block">
                T2 POST-EVENT OBSERVATION
              </span>
              <div className="text-white font-bold text-xs mt-1">
                {prodB?.title || 'Scene B Comparison'}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Acquired: {prodB?.acquisition_date.substring(0, 10)} | Orbit {prodB?.orbit_direction}
              </div>
              <div className="text-[10px] text-purple-300 mt-1">
                Modified Scattering: Specular Reflection / Phase Fringe Offset
              </div>
            </div>

            {/* Difference Overlay Highlight */}
            {showDifferenceLayer && activeAnalysis && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ opacity: differenceOpacity }}
              >
                <div className="w-72 h-44 border-2 border-dashed border-cyan-400 rounded-lg bg-cyan-500/10 backdrop-blur-sm flex flex-col items-center justify-center text-center p-3">
                  <span className="text-xs font-bold text-cyan-300 uppercase">
                    DELINEATED SURFACE CHANGE ANOMALY
                  </span>
                  <span className="text-base font-bold text-white mt-1">
                    {activeAnalysis.metrics.mean_change_value > 0 ? '+' : ''}
                    {activeAnalysis.metrics.mean_change_value} {activeAnalysis.metrics.units}
                  </span>
                  <span className="text-[10px] text-purple-300 mt-0.5">
                    Extending across {activeAnalysis.metrics.affected_area_km2} km²
                  </span>
                </div>
              </div>
            )}

            {/* Center Swipe Drag Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_12px_#00f0ff] cursor-ew-resize flex items-center justify-center"
              style={{ left: `${swipePosition}%` }}
            >
              <div className="w-6 h-6 rounded-full bg-cyan-400 text-black font-bold text-[10px] flex items-center justify-center shadow-lg">
                ‹›
              </div>
            </div>
          </div>

          {/* Swipe Slider Bar */}
          <div className="p-3 bg-[#09101f] border-t border-cyan-500/20 flex items-center gap-3">
            <span className="text-[10px] text-slate-400">T1 (PRE)</span>
            <input
              type="range"
              min="0"
              max="100"
              value={swipePosition}
              onChange={(e) => setSwipePosition(parseInt(e.target.value))}
              className="flex-1 h-1.5 accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400">T2 (POST)</span>
          </div>
        </div>

        {/* Comparison Telemetry Card (1 col) */}
        <div className="bg-[#060b18] border border-cyan-500/25 rounded-lg p-4 space-y-4 shadow-2xl">
          <div className="border-b border-cyan-500/20 pb-2">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider text-cyan-400">
              TEMPORAL PAIR VERIFICATION
            </h3>
            <span className="text-[10px] text-slate-400">
              Interferometric Baseline & Scattering Stability
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-[#09101f] border border-cyan-500/15 p-2 rounded flex justify-between">
              <span className="text-slate-400">Orbit Geometry:</span>
              <span className="text-white font-bold">{prodA?.orbit_direction || 'MATCHED'}</span>
            </div>

            <div className="bg-[#09101f] border border-cyan-500/15 p-2 rounded flex justify-between">
              <span className="text-slate-400">Temporal Baseline:</span>
              <span className="text-cyan-300 font-bold">12 Days (NISAR Exact Repeat)</span>
            </div>

            <div className="bg-[#09101f] border border-cyan-500/15 p-2 rounded flex justify-between">
              <span className="text-slate-400">Perpendicular Baseline:</span>
              <span className="text-white">64.2 meters (Sub-critical)</span>
            </div>

            <div className="bg-[#09101f] border border-cyan-500/15 p-2 rounded flex justify-between">
              <span className="text-slate-400">Coherence Conservation:</span>
              <span className="text-emerald-400 font-bold">High (gamma {'>='} 0.65)</span>
            </div>
          </div>

          {activeAnalysis ? (
            <div className="bg-[#030712] border border-cyan-500/30 p-3 rounded space-y-2">
              <span className="text-[10px] font-bold text-cyan-300 uppercase block">
                DIFFERENCE RESULT SUMMARY
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {activeAnalysis.evidence_summary}
              </p>
              <button
                onClick={onNavigateToGlobe}
                className="w-full py-1.5 mt-2 bg-cyan-600/30 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-400/50 rounded text-[11px] font-bold transition-all text-center block"
              >
                VIEW ON 3D GLOBE
              </button>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 italic bg-[#030712] p-3 rounded border border-slate-800">
              Click "Execute Comparison" to compute multi-temporal difference metrics between the two
              selected scenes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
