import React, { useState } from 'react';
import {
  Activity,
  Search,
  Filter,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Calendar,
  Layers,
} from 'lucide-react';
import { EventItem, SurfaceChangeCategory, EventStatus } from '../../types';

interface EventDiscoveryViewProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onFlyTo: (lon: number, lat: number) => void;
}

export const EventDiscoveryView: React.FC<EventDiscoveryViewProps> = ({
  events,
  onSelectEvent,
  onFlyTo,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'area' | 'severity'>('date');

  const filteredEvents = events
    .filter((e) => {
      if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && e.status !== selectedStatus) return false;
      if (
        searchTerm &&
        !e.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !e.location_name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.observation_date).getTime() - new Date(a.observation_date).getTime();
      }
      if (sortBy === 'area') {
        return b.affected_area_km2 - a.affected_area_km2;
      }
      return b.confidence - a.confidence;
    });

  return (
    <div className="absolute inset-0 top-12 bg-[#080b11] z-20 flex flex-col font-sans select-none overflow-y-auto">
      {/* Title & Filter Bar */}
      <div className="bg-[#0e131f] border-b border-[#1e2638] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight">
              Global Surface Change Discovery & Alerts
            </h2>
            <p className="text-xs text-slate-400">
              Curated radar event observatory. Distinguishes ground-truth validated disasters from algorithmic candidates.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search event title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#141b2a] border border-[#222d42] text-xs text-white pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-400 w-56 font-sans"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#141b2a] border border-[#222d42] text-xs text-slate-200 py-1.5 px-2.5 rounded-lg focus:outline-none focus:border-cyan-400 font-sans"
          >
            <option value="all">All Categories</option>
            <option value="ground_deformation">Ground Deformation</option>
            <option value="flood_wetland">Flood & Wetlands</option>
            <option value="agriculture">Agriculture & Seasonal</option>
            <option value="glacier_ice">Glacier Movement</option>
            <option value="wildfire">Wildfire Burn Scars</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#09101f] border border-cyan-500/20 text-xs text-slate-200 py-1 px-2 rounded focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed (Independent Source)</option>
            <option value="algorithmic_candidate">Algorithmic Candidate</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#09101f] border border-cyan-500/20 text-xs text-slate-200 py-1 px-2 rounded focus:outline-none focus:border-cyan-400"
          >
            <option value="date">Sort: Observation Date</option>
            <option value="area">Sort: Affected Area</option>
            <option value="severity">Sort: Confidence Score</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((evt) => {
          const isConfirmed = evt.status === 'confirmed';
          const severityColor =
            evt.severity === 'CRITICAL'
              ? 'text-red-400 border-red-500/40 bg-red-950/20'
              : evt.severity === 'HIGH'
              ? 'text-amber-400 border-amber-500/40 bg-amber-950/20'
              : 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20';

          return (
            <div
              key={evt.event_id}
              className="bg-[#060b18] border border-cyan-500/25 hover:border-cyan-400/60 rounded-lg p-4 flex flex-col justify-between transition-all group shadow-xl hover:shadow-cyan-500/10"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[9px] uppercase px-2 py-0.5 rounded font-bold border ${severityColor}`}
                  >
                    {evt.severity} // {evt.category.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1 text-[10px]">
                    {isConfirmed ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> CONFIRMED
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> CANDIDATE
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                  {evt.title}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>{evt.location_name}</span>
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-300 mt-2.5 leading-relaxed">
                  {evt.description}
                </p>

                {/* Quantified Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-cyan-500/15 text-[10px]">
                  <div>
                    <span className="text-slate-500 block">AFFECTED AREA</span>
                    <span className="text-white font-bold">{evt.affected_area_km2} km²</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">OBSERVATION DATE</span>
                    <span className="text-cyan-300 font-bold">
                      {evt.observation_date.substring(0, 10)}
                    </span>
                  </div>
                </div>

                {/* Source attribution */}
                <div className="mt-2 text-[10px] text-slate-400">
                  <span className="text-slate-500">Source: </span>
                  <span>{evt.source_attribution}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-cyan-500/15 flex gap-2">
                <button
                  onClick={() => {
                    onSelectEvent(evt);
                    onFlyTo(evt.coordinates[0], evt.coordinates[1]);
                  }}
                  className="flex-1 py-1.5 px-3 bg-cyan-600/30 hover:bg-cyan-500/40 text-cyan-200 border border-cyan-400/40 rounded text-xs font-bold transition-all flex items-center justify-center gap-1"
                >
                  <span>INVESTIGATE ON 3D GLOBE</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
