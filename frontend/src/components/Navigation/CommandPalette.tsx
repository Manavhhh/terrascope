import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Globe2,
  Activity,
  SplitSquareVertical,
  Layers,
  BookOpen,
  Mountain,
  Waves,
  Sprout,
  Compass,
  Sliders,
  RotateCcw,
  Sparkles,
  Bot,
  MapPin,
  Command,
  ArrowRight,
  X,
  Orbit,
} from 'lucide-react';
import { DemoInvestigation, EventItem } from '../../types';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: 'explore' | 'events' | 'compare' | 'catalog' | 'methodology') => void;
  onSelectInvestigation: (inv: DemoInvestigation) => void;
  onSelectEvent: (evt: EventItem) => void;
  onFlyTo: (lon: number, lat: number) => void;
  onToggle2D: () => void;
  is2DMode: boolean;
  onToggleOrbits: () => void;
  showOrbits: boolean;
  onToggleFootprints: () => void;
  showFootprints: boolean;
  onToggleChangeLayer: () => void;
  showChangeLayer: boolean;
  onToggleSidebar: () => void;
  onToggleIntelligence: () => void;
  onOpenSettings: () => void;
  demoInvestigations: DemoInvestigation[];
  events: EventItem[];
}

interface ActionItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation' | 'Investigations' | 'Events' | 'Controls' | 'Locations';
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onSelectInvestigation,
  onSelectEvent,
  onFlyTo,
  onToggle2D,
  is2DMode,
  onToggleOrbits,
  showOrbits,
  onToggleFootprints,
  showFootprints,
  onToggleChangeLayer,
  showChangeLayer,
  onToggleSidebar,
  onToggleIntelligence,
  onOpenSettings,
  demoInvestigations,
  events,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Construct all searchable items
  const allItems: ActionItem[] = [
    // Navigation
    {
      id: 'nav-globe',
      title: '3D Earth Globe View',
      subtitle: 'Interactive planetary radar exploration and swath coverage',
      category: 'Navigation',
      icon: <Globe2 className="w-4 h-4 text-cyan-400" />,
      badge: 'Mode',
      action: () => {
        onSelectTab('explore');
        onClose();
      },
    },
    {
      id: 'nav-events',
      title: 'Surface Events Feed',
      subtitle: 'Global earthquakes, riverine floods, and cryosphere alerts',
      category: 'Navigation',
      icon: <Activity className="w-4 h-4 text-rose-400" />,
      badge: `${events.length} Active`,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      action: () => {
        onSelectTab('events');
        onClose();
      },
    },
    {
      id: 'nav-compare',
      title: 'Compare Lab (Split-Swipe)',
      subtitle: 'Side-by-side dual polarization and interferometric baselines',
      category: 'Navigation',
      icon: <SplitSquareVertical className="w-4 h-4 text-purple-400" />,
      badge: 'Lab',
      action: () => {
        onSelectTab('compare');
        onClose();
      },
    },
    {
      id: 'nav-catalog',
      title: 'NISAR & EO Data Catalog',
      subtitle: 'Browse Level-1 & Level-2 radar granules and testbed data',
      category: 'Navigation',
      icon: <Layers className="w-4 h-4 text-emerald-400" />,
      badge: 'Catalog',
      action: () => {
        onSelectTab('catalog');
        onClose();
      },
    },
    {
      id: 'nav-science',
      title: 'Scientific Methodology & Math',
      subtitle: 'Differential InSAR, Backscatter log-ratio, and RVI equations',
      category: 'Navigation',
      icon: <BookOpen className="w-4 h-4 text-amber-400" />,
      badge: 'Documentation',
      action: () => {
        onSelectTab('methodology');
        onClose();
      },
    },

    // Demonstrations
    ...demoInvestigations.map((inv) => ({
      id: `demo-${inv.investigation_id}`,
      title: inv.title,
      subtitle: `${inv.location_name} • ${inv.question || inv.summary}`,
      category: 'Investigations' as const,
      icon:
        inv.category === 'ground_deformation' ? (
          <Mountain className="w-4 h-4 text-cyan-400" />
        ) : inv.category === 'flood_wetland' ? (
          <Waves className="w-4 h-4 text-blue-400" />
        ) : (
          <Sprout className="w-4 h-4 text-lime-400" />
        ),
      badge: 'Calibrated Demo',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      action: () => {
        onSelectInvestigation(inv);
        onClose();
      },
    })),

    // Active Events
    ...events.map((evt) => ({
      id: `evt-${evt.event_id}`,
      title: evt.title,
      subtitle: `${evt.location_name} • ${evt.description}`,
      category: 'Events' as const,
      icon: <Activity className="w-4 h-4 text-rose-400" />,
      badge: evt.severity,
      badgeColor:
        evt.severity === 'CRITICAL'
          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
          : 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      action: () => {
        onSelectEvent(evt);
        onClose();
      },
    })),

    // Canvas & Layer Controls
    {
      id: 'ctrl-2d-3d',
      title: is2DMode ? 'Switch to 3D Globe Projection' : 'Switch to 2D Map Projection',
      subtitle: 'Toggle between orthographic 3D planetary globe and flat map',
      category: 'Controls',
      icon: <Globe2 className="w-4 h-4 text-cyan-400" />,
      badge: is2DMode ? 'Currently 2D' : 'Currently 3D',
      action: () => {
        onToggle2D();
        onClose();
      },
    },
    {
      id: 'ctrl-orbits',
      title: showOrbits ? 'Hide NISAR Orbit Tracks' : 'Show NISAR Orbit Tracks',
      subtitle: 'Toggle orbital flight path trajectories around Earth',
      category: 'Controls',
      icon: <Orbit className="w-4 h-4 text-purple-400" />,
      badge: showOrbits ? 'ON' : 'OFF',
      action: () => {
        onToggleOrbits();
        onClose();
      },
    },
    {
      id: 'ctrl-swaths',
      title: showFootprints ? 'Hide Radar Swath Footprints' : 'Show Radar Swath Footprints',
      subtitle: 'Toggle ground track observational bounding boxes',
      category: 'Controls',
      icon: <Layers className="w-4 h-4 text-cyan-400" />,
      badge: showFootprints ? 'ON' : 'OFF',
      action: () => {
        onToggleFootprints();
        onClose();
      },
    },
    {
      id: 'ctrl-overlays',
      title: showChangeLayer ? 'Hide Change Heatmap Overlays' : 'Show Change Heatmap Overlays',
      subtitle: 'Toggle calibrated backscatter and phase change raster layers',
      category: 'Controls',
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      badge: showChangeLayer ? 'ON' : 'OFF',
      action: () => {
        onToggleChangeLayer();
        onClose();
      },
    },
    {
      id: 'ctrl-sidebar',
      title: 'Toggle Mission Deck (Left Panel)',
      subtitle: 'Configure SAR observation parameters and pipeline algorithms',
      category: 'Controls',
      icon: <Sliders className="w-4 h-4 text-slate-300" />,
      action: () => {
        onToggleSidebar();
        onClose();
      },
    },
    {
      id: 'ctrl-intelligence',
      title: 'Toggle Orbit AI & Telemetry (Right Panel)',
      subtitle: 'Inspect surface displacement readouts and machine intelligence',
      category: 'Controls',
      icon: <Bot className="w-4 h-4 text-purple-400" />,
      action: () => {
        onToggleIntelligence();
        onClose();
      },
    },
    {
      id: 'ctrl-settings',
      title: 'Settings & API Keys',
      subtitle: 'Cesium Ion token, NASA Earthdata, and ISRO Bhoonidhi credentials',
      category: 'Controls',
      icon: <Sliders className="w-4 h-4 text-slate-300" />,
      action: () => {
        onOpenSettings();
        onClose();
      },
    },

    // Fast Geo-Jumps
    {
      id: 'loc-turkey',
      title: 'Fly to Kahramanmaraş, Türkiye',
      subtitle: 'East Anatolian Fault Line (37.58° N, 36.92° E)',
      category: 'Locations',
      icon: <MapPin className="w-4 h-4 text-rose-400" />,
      badge: 'Fault Slip',
      action: () => {
        onFlyTo(36.92, 37.58);
        onSelectTab('explore');
        onClose();
      },
    },
    {
      id: 'loc-assam',
      title: 'Fly to Brahmaputra Basin, Assam, India',
      subtitle: 'Monsoon Flood Inundation (26.60° N, 92.80° E)',
      category: 'Locations',
      icon: <MapPin className="w-4 h-4 text-blue-400" />,
      badge: 'Flood Zone',
      action: () => {
        onFlyTo(92.8, 26.6);
        onSelectTab('explore');
        onClose();
      },
    },
    {
      id: 'loc-california',
      title: 'Fly to San Joaquin Valley, California',
      subtitle: 'Central Valley Agricultural Parcels (36.60° N, -119.80° W)',
      category: 'Locations',
      icon: <MapPin className="w-4 h-4 text-lime-400" />,
      badge: 'Aquifer/Crop',
      action: () => {
        onFlyTo(-119.8, 36.6);
        onSelectTab('explore');
        onClose();
      },
    },
    {
      id: 'loc-himalaya',
      title: 'Fly to Siachen Glacier, Himalayas',
      subtitle: 'High-Altitude Cryosphere Coherence Drift (35.40° N, 77.10° E)',
      category: 'Locations',
      icon: <MapPin className="w-4 h-4 text-sky-400" />,
      badge: 'Cryo',
      action: () => {
        onFlyTo(77.1, 35.4);
        onSelectTab('explore');
        onClose();
      },
    },
  ];

  // Filter items based on query
  const filtered = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase())) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#0f1320] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden flex flex-col max-h-[75vh] z-10 font-mono-tech select-none animate-scaleUp">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-cyan-500/20 bg-[#090e1b]/80 gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search investigations, events, tools, or regions... (e.g. Turkey, compare, 2D)"
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="px-2 py-0.5 rounded bg-surface-container text-[10px] text-slate-400 border border-slate-700 font-mono">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-sans">
              <Compass className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-pulse" />
              <p className="text-sm">No matching navigation targets found.</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching "Earthquake", "Assam", "Compare", "3D", or coordinates.
              </p>
            </div>
          ) : (
            filtered.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-500/15 border border-cyan-400/50 text-cyan-200'
                      : 'hover:bg-white/5 border border-transparent text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-cyan-500/20' : 'bg-slate-800/60'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white truncate font-sans">
                          {item.title}
                        </span>
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                          {item.category}
                        </span>
                      </div>
                      {item.subtitle && (
                        <span className="text-[11px] text-slate-400 truncate font-sans">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          item.badgeColor || 'bg-slate-800/80 text-slate-300 border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isSelected && <ArrowRight className="w-4 h-4 text-cyan-400" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2 border-t border-cyan-500/15 bg-[#090e1b]/80 flex items-center justify-between text-[11px] text-slate-400 font-sans">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.2 bg-slate-800 rounded border border-slate-700 text-[10px] font-mono">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.2 bg-slate-800 rounded border border-slate-700 text-[10px] font-mono">
                ↓
              </kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.2 bg-slate-800 rounded border border-slate-700 text-[10px] font-mono">
                ↵
              </kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.2 bg-slate-800 rounded border border-slate-700 text-[10px] font-mono">
                ESC
              </kbd>
              Close
            </span>
          </div>
          <span className="text-cyan-400 font-mono-tech text-[10px]">
            TERRA//SCOPE FIGMA QUICK NAV
          </span>
        </div>
      </div>
    </div>
  );
};
