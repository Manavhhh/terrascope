import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  Calendar,
  LineChart as ChartIcon,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { AnalysisResult, ProductMetadata } from '../../types';

interface TemporalTimelineProps {
  isOpen: boolean;
  onToggle: () => void;
  activeAnalysis: AnalysisResult | null;
  products: ProductMetadata[];
  onSelectDate: (date: string) => void;
}

export const TemporalTimeline: React.FC<TemporalTimelineProps> = ({
  isOpen,
  onToggle,
  activeAnalysis,
  products,
  onSelectDate,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showChartDrawer, setShowChartDrawer] = useState(false);
  const [activeDateIndex, setActiveDateIndex] = useState(0);

  const timeSeries = activeAnalysis?.time_series_data || [];
  const hasTimeSeries = timeSeries.length > 0;

  const keyframes = timeSeries.length > 0
    ? timeSeries.map((t) => t.date)
    : products.slice(0, 5).map((p) => p.acquisition_date.substring(0, 10));

  // Toggle playback simulation
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Playback timer effect
  useEffect(() => {
    if (!isPlaying || keyframes.length === 0) return;
    const timer = setInterval(() => {
      setActiveDateIndex((prev) => {
        const next = (prev + 1) % keyframes.length;
        onSelectDate(keyframes[next]);
        return next;
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [isPlaying, keyframes, onSelectDate]);

  // Primary metric key from time-series
  const metricKey =
    timeSeries.length > 0
      ? Object.keys(timeSeries[0]).find((k) => k !== 'date') || 'value'
      : 'value';

  if (!isOpen) {
    return (
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass-cockpit text-cyan-300 hover:text-white border border-cyan-500/30 hover:border-cyan-400 font-mono-tech text-xs tracking-wider uppercase shadow-xl transition-all hover:scale-105 active:scale-95 group"
        >
          <Clock className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform" />
          <span className="font-semibold">TEMPORAL SCRUBBER</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    );
  }

  return (
    <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94vw] max-w-4xl glass-cockpit-high rounded-2xl border border-cyan-500/20 shadow-2xl backdrop-blur-2xl pointer-events-auto font-mono-tech select-none overflow-hidden transition-all duration-200">
      {/* Top Header / Primary Flight Scrubber Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-3 bg-black/20">
        {/* Play / Pause button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={togglePlay}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isPlaying
                ? 'bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.6)]'
                : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
            }`}
            title={isPlaying ? 'Pause orbital replay' : 'Play orbital replay'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
          </button>

          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] uppercase font-bold text-cyan-300 leading-tight">
              TEMPORAL PASSES
            </span>
            <span className="text-[9px] text-slate-400">12-DAY NISAR CADENCE</span>
          </div>
        </div>

        {/* Chronological Keyframe Pills Track */}
        <div className="flex-1 flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {keyframes.map((dateStr, idx) => {
            const isSelected = activeDateIndex === idx;
            return (
              <button
                key={dateStr + idx}
                onClick={() => {
                  setActiveDateIndex(idx);
                  onSelectDate(dateStr);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono-tech transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)] scale-105'
                    : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <Calendar className="w-2.5 h-2.5 opacity-70" />
                <span>{dateStr}</span>
              </button>
            );
          })}
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowChartDrawer(!showChartDrawer)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono-tech transition-all border ${
              showChartDrawer
                ? 'bg-purple-500/30 text-purple-200 border-purple-400 shadow-sm'
                : 'bg-white/5 text-slate-300 hover:text-white border-white/10'
            }`}
          >
            <ChartIcon className="w-3 h-3 text-purple-400" />
            <span className="hidden sm:inline">ANALYTICS</span>
            {showChartDrawer ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>

          <button
            onClick={onToggle}
            title="Minimize Scrubber"
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable Recharts Graph Drawer */}
      {showChartDrawer && (
        <div className="p-3 border-t border-cyan-500/15 bg-black/40 h-44 flex flex-col">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 px-1">
            <span className="uppercase font-bold text-cyan-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              TEMPORAL EVOLUTION CURVE: {metricKey.replace('_', ' ').toUpperCase()}
            </span>
            <span className="text-slate-400">
              UNITS: {activeAnalysis?.metrics.units || 'Centimeters (LOS)'}
            </span>
          </div>

          <div className="flex-1 w-full h-full">
            {hasTimeSeries ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeries} margin={{ top: 5, right: 15, bottom: 0, left: -25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,189,248,0.12)" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(9, 14, 27, 0.95)',
                      borderColor: 'rgba(0, 240, 255, 0.4)',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#f1f5f9',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={metricKey}
                    stroke="#00f0ff"
                    strokeWidth={2}
                    dot={{ fill: '#00f0ff', r: 3 }}
                    activeDot={{ r: 5, fill: '#818cf8', stroke: '#ffffff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-xs italic">
                Select or execute an investigation to render multi-temporal interferometric trend.
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};
