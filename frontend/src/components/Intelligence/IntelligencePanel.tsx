import React, { useState } from 'react';
import {
  X,
  Activity,
  Bot,
  Download,
  Copy,
  Check,
  FileText,
  MapPin,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { EventItem, AnalysisResult } from '../../types';
import { OrbitAssistantTab } from './OrbitAssistantTab';
import { api } from '../../services/api';

interface IntelligencePanelProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedEvent: EventItem | null;
  activeAnalysis: AnalysisResult | null;
}

export const IntelligencePanel: React.FC<IntelligencePanelProps> = ({
  isOpen,
  onToggle,
  selectedEvent,
  activeAnalysis,
}) => {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'orbit' | 'export'>('telemetry');
  const [copiedCoords, setCopiedCoords] = useState(false);

  if (!isOpen) {
    return null; // Topbar controls this cleanly without floating screen obstacles
  }

  // Defaults
  const locationName =
    selectedEvent?.location_name ||
    (activeAnalysis ? 'Active Surface Deformation Grid' : 'Global Observation Monitor');
  const coordinates = selectedEvent
    ? selectedEvent.coordinates
    : activeAnalysis
    ? [36.92, 37.58]
    : [0.0, 0.0];

  const handleCopyCoords = () => {
    const text = `${coordinates[1].toFixed(5)}, ${coordinates[0].toFixed(5)}`;
    navigator.clipboard.writeText(text);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const handleExport = (format: 'geojson' | 'csv' | 'json' | 'html') => {
    if (!activeAnalysis) return;
    const url = api.getExportUrl(activeAnalysis.analysis_id, format);
    window.open(url, '_blank');
  };

  return (
    <aside className="absolute top-14 right-4 z-20 w-88 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-120px)] flex flex-col bg-[#121722]/95 rounded-xl border border-[#1e2536] shadow-2xl backdrop-blur-xl pointer-events-auto font-sans select-none overflow-hidden transition-all duration-200">
      {/* Target Designation Header */}
      <div className="px-3.5 py-2.5 border-b border-[#1e2536] flex items-center justify-between bg-[#0f131d]">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-mono-tech tracking-wider text-slate-400 block">
              Orbit AI &amp; Telemetry
            </span>
            <h3 className="font-semibold text-xs text-slate-100 truncate">
              {locationName}
            </h3>
          </div>
        </div>
        <button
          onClick={onToggle}
          title="Close Inspector"
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Clean Mode Sub-Tabs */}
      <div className="flex border-b border-[#1e2536] bg-[#0a0d14]/50 p-1 gap-1 text-xs">
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`flex-1 py-1 px-2 rounded-md text-center transition-all cursor-pointer font-medium flex items-center justify-center gap-1.5 ${
            activeTab === 'telemetry'
              ? 'bg-[#181f2e] text-cyan-300 border border-[#283347] shadow-sm'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Metrics</span>
        </button>

        <button
          onClick={() => setActiveTab('orbit')}
          className={`flex-1 py-1 px-2 rounded-md text-center transition-all cursor-pointer font-medium flex items-center justify-center gap-1.5 ${
            activeTab === 'orbit'
              ? 'bg-[#181f2e] text-purple-300 border border-[#283347] shadow-sm'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-purple-400" />
          <span>Orbit AI</span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`flex-1 py-1 px-2 rounded-md text-center transition-all cursor-pointer font-medium flex items-center justify-center gap-1.5 ${
            activeTab === 'export'
              ? 'bg-[#181f2e] text-emerald-300 border border-[#283347] shadow-sm'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Export</span>
        </button>
      </div>

      {/* Body Container */}
      <div className="p-3.5 overflow-y-auto space-y-3.5 text-xs flex-1 custom-scrollbar">
        {/* TELEMETRY READOUT TAB */}
        {activeTab === 'telemetry' && (
          <div className="space-y-3">
            {/* Geodetic Coordinates Pill */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#0f131d] border border-[#1e2536] text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-300 font-mono-tech">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {coordinates[1].toFixed(4)}°N, {coordinates[0].toFixed(4)}°E
                </span>
              </div>
              <button
                onClick={handleCopyCoords}
                className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[10px] cursor-pointer"
              >
                {copiedCoords ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Metrics Grid */}
            {activeAnalysis ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-[#0f131d] border border-[#1e2536]">
                    <span className="text-[10px] uppercase font-mono-tech text-slate-400 block">
                      Max Change
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-mono-tech font-bold text-base text-slate-100">
                        {activeAnalysis.metrics.max_change_value > 0 ? '+' : ''}
                        {activeAnalysis.metrics.max_change_value.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono-tech">
                        {activeAnalysis.metrics.units}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0f131d] border border-[#1e2536]">
                    <span className="text-[10px] uppercase font-mono-tech text-slate-400 block">
                      Min Change
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-mono-tech font-bold text-base text-slate-100">
                        {activeAnalysis.metrics.min_change_value.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono-tech">
                        {activeAnalysis.metrics.units}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0f131d] border border-[#1e2536]">
                    <span className="text-[10px] uppercase font-mono-tech text-slate-400 block">
                      Affected Area
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-mono-tech font-bold text-base text-cyan-300">
                        {activeAnalysis.metrics.affected_area_km2.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono-tech">km²</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0f131d] border border-[#1e2536]">
                    <span className="text-[10px] uppercase font-mono-tech text-slate-400 block">
                      Confidence
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-mono-tech font-bold text-base text-emerald-400">
                        {(activeAnalysis.metrics.confidence_score * 100).toFixed(0)}%
                      </span>
                      <span className="text-[10px] text-emerald-500 font-mono-tech">Grade A</span>
                    </div>
                  </div>
                </div>

                {/* Evidence Summary Card */}
                <div className="p-3 rounded-lg bg-[#0f131d] border border-[#1e2536] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Evidence Summary</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {activeAnalysis.evidence_summary}
                  </p>
                </div>

                {/* Scientific Interpretation */}
                <div className="p-3 rounded-lg bg-[#0f131d] border border-[#1e2536] space-y-1.5">
                  <span className="text-[10px] uppercase font-mono-tech text-slate-400 tracking-wider block">
                    Interpretation
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {activeAnalysis.scientific_interpretation}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 space-y-2">
                <Activity className="w-6 h-6 text-slate-500 mx-auto" />
                <p className="text-xs">No active analysis selected.</p>
                <p className="text-[11px] text-slate-500">
                  Select a testbed from the top navigation dropdown to load calibrated findings.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ORBIT AI TAB */}
        {activeTab === 'orbit' && (
          <OrbitAssistantTab
            activeAnalysis={activeAnalysis}
            selectedEvent={selectedEvent}
          />
        )}

        {/* EXPORT TAB */}
        {activeTab === 'export' && (
          <div className="space-y-3">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Export verified analysis layers, vector contours, and executive findings.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleExport('geojson')}
                disabled={!activeAnalysis}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#0f131d] hover:bg-[#181f2e] border border-[#1e2536] text-slate-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-cyan-400" />
                  <div className="text-left">
                    <span className="text-xs font-medium block">GeoJSON Layer Bundle</span>
                    <span className="text-[10px] text-slate-400">GIS vector polygon boundaries</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono-tech text-slate-400">.geojson</span>
              </button>

              <button
                onClick={() => handleExport('csv')}
                disabled={!activeAnalysis}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#0f131d] hover:bg-[#181f2e] border border-[#1e2536] text-slate-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-400" />
                  <div className="text-left">
                    <span className="text-xs font-medium block">Time-Series CSV</span>
                    <span className="text-[10px] text-slate-400">Tabular displacement &amp; coherence</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono-tech text-slate-400">.csv</span>
              </button>

              <button
                onClick={() => handleExport('html')}
                disabled={!activeAnalysis}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#0f131d] hover:bg-[#181f2e] border border-[#1e2536] text-slate-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <div className="text-left">
                    <span className="text-xs font-medium block">Executive HTML Dossier</span>
                    <span className="text-[10px] text-slate-400">Printable scientific report</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono-tech text-slate-400">.html</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
