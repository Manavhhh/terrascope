import React, { useState } from 'react';
import {
  Globe2,
  Activity,
  Layers,
  BookOpen,
  SplitSquareVertical,
  SlidersHorizontal,
  Search,
  ChevronDown,
  Sliders,
  Bot,
  HelpCircle,
  Mountain,
  Waves,
  Sprout,
  Check,
} from 'lucide-react';
import { SystemHealth, DemoInvestigation } from '../../types';

interface TopNavProps {
  activeTab: 'explore' | 'events' | 'compare' | 'catalog' | 'methodology';
  onSelectTab: (tab: 'explore' | 'events' | 'compare' | 'catalog' | 'methodology') => void;
  onOpenCommandPalette: () => void;
  health: SystemHealth | null;
  onOpenSettings: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  isIntelligenceOpen?: boolean;
  onToggleIntelligence?: () => void;
  activeInvestigation?: DemoInvestigation | null;
  demoInvestigations?: DemoInvestigation[];
  onSelectInvestigation?: (inv: DemoInvestigation) => void;
  onStartTour?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenCommandPalette,
  health,
  onOpenSettings,
  isSidebarOpen,
  onToggleSidebar,
  isIntelligenceOpen,
  onToggleIntelligence,
  activeInvestigation,
  demoInvestigations = [],
  onSelectInvestigation,
  onStartTour,
}) => {
  const [isTestbedDropdownOpen, setIsTestbedDropdownOpen] = useState(false);
  const isHealthy = health?.status === 'healthy';

  return (
    <header className="h-12 bg-[#0a0d14]/90 backdrop-blur-md border-b border-[#1e2536] px-4 flex items-center justify-between z-30 select-none shrink-0 font-sans">
      {/* Left: Brand + Active Testbed Dropdown */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onSelectTab('explore')}
          title="TERRA//SCOPE Mission Home"
        >
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-sm">
            <span className="text-[11px] font-bold text-slate-950 font-mono-tech">TS</span>
          </div>
          <span className="font-semibold text-sm tracking-tight text-slate-100 group-hover:text-cyan-400 transition-colors">
            TERRA<span className="text-cyan-400 font-normal">//</span>SCOPE
          </span>
          <span className="hidden sm:inline-block text-[10px] uppercase font-mono-tech px-1.5 py-0.5 rounded bg-[#161c29] text-slate-400 border border-[#1e2536]">
            NISAR
          </span>
        </div>

        {/* Vertical divider */}
        <div className="hidden md:block h-4 w-px bg-[#1e2536]" />

        {/* Active Testbed Selector (Replaces noisy sub-bar on home screen) */}
        {activeTab === 'explore' && demoInvestigations.length > 0 && (
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsTestbedDropdownOpen(!isTestbedDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#121722] hover:bg-[#181f2e] border border-[#1e2536] hover:border-[#283347] text-xs text-slate-200 transition-colors cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
              <span className="truncate max-w-[180px] lg:max-w-[240px] font-medium text-slate-200">
                {activeInvestigation ? activeInvestigation.title : 'Select Investigation'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {isTestbedDropdownOpen && (
              <div className="absolute top-full mt-1.5 left-0 w-80 bg-[#121722] border border-[#1e2536] rounded-lg shadow-2xl p-1.5 flex flex-col gap-1 z-40">
                <div className="px-2.5 py-1 text-[10px] font-mono-tech uppercase tracking-wider text-slate-400 border-b border-[#1e2536] mb-1">
                  Verified Science Testbeds
                </div>
                {demoInvestigations.map((inv) => {
                  const isSelected = activeInvestigation?.investigation_id === inv.investigation_id;
                  return (
                    <button
                      key={inv.investigation_id}
                      onClick={() => {
                        if (onSelectInvestigation) onSelectInvestigation(inv);
                        setIsTestbedDropdownOpen(false);
                      }}
                      className={`flex items-start justify-between p-2 rounded-md text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-200'
                          : 'hover:bg-[#181f2e] text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-2 min-w-0">
                        {inv.category === 'ground_deformation' ? (
                          <Mountain className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                        ) : inv.category === 'flood_wetland' ? (
                          <Waves className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                        ) : (
                          <Sprout className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-medium text-slate-100 truncate">
                            {inv.title}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate">
                            {inv.location_name}
                          </span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5 ml-2" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Center: Minimalist Mode Tabs (Linear / Vercel style) */}
      <nav className="flex items-center gap-1 bg-[#0f131d] p-0.5 rounded-lg border border-[#1e2536]">
        <button
          onClick={() => onSelectTab('explore')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-all cursor-pointer font-medium ${
            activeTab === 'explore'
              ? 'bg-[#181f2e] text-slate-100 shadow-sm border border-[#283347]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
          }`}
        >
          <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Globe</span>
        </button>

        <button
          onClick={() => onSelectTab('events')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-all cursor-pointer font-medium ${
            activeTab === 'events'
              ? 'bg-[#181f2e] text-slate-100 shadow-sm border border-[#283347]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-rose-400" />
          <span>Events</span>
          <span className="px-1.5 py-0.2 rounded-full bg-rose-500/10 text-rose-300 text-[10px] font-mono-tech border border-rose-500/20">
            3
          </span>
        </button>

        <button
          onClick={() => onSelectTab('compare')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-all cursor-pointer font-medium ${
            activeTab === 'compare'
              ? 'bg-[#181f2e] text-slate-100 shadow-sm border border-[#283347]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
          }`}
        >
          <SplitSquareVertical className="w-3.5 h-3.5 text-purple-400" />
          <span>Compare</span>
        </button>

        <button
          onClick={() => onSelectTab('catalog')}
          className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-all cursor-pointer font-medium ${
            activeTab === 'catalog'
              ? 'bg-[#181f2e] text-slate-100 shadow-sm border border-[#283347]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Catalog</span>
        </button>

        <button
          onClick={() => onSelectTab('methodology')}
          className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-all cursor-pointer font-medium ${
            activeTab === 'methodology'
              ? 'bg-[#181f2e] text-slate-100 shadow-sm border border-[#283347]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Docs</span>
        </button>
      </nav>

      {/* Right: Search, Drawer Controls, Health & Settings */}
      <div className="flex items-center gap-2">
        {/* Quick Search Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 bg-[#121722] hover:bg-[#181f2e] text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-md border border-[#1e2536] hover:border-[#283347] transition-all cursor-pointer"
          title="Search or jump to... (Ctrl+K or ⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline text-xs text-slate-400">Search</span>
          <kbd className="px-1.5 py-0.2 rounded bg-[#181f2e] text-[10px] font-mono-tech text-slate-400 border border-[#283347]">
            ⌘K
          </kbd>
        </button>

        {/* Panel Toggles Grouped Cleanly */}
        {activeTab === 'explore' && (
          <div className="flex items-center gap-1 bg-[#121722] p-0.5 rounded-md border border-[#1e2536]">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                title={isSidebarOpen ? 'Close Parameters Deck' : 'Open Parameters Deck'}
                className={`p-1.5 rounded transition-all text-xs flex items-center gap-1 cursor-pointer ${
                  isSidebarOpen
                    ? 'bg-[#1c2333] text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px] font-medium">Params</span>
              </button>
            )}

            {onToggleIntelligence && (
              <button
                onClick={onToggleIntelligence}
                title={isIntelligenceOpen ? 'Close Orbit AI Panel' : 'Open Orbit AI Panel'}
                className={`p-1.5 rounded transition-all text-xs flex items-center gap-1 cursor-pointer ${
                  isIntelligenceOpen
                    ? 'bg-[#1c2333] text-purple-300 border border-purple-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px] font-medium">Orbit AI</span>
              </button>
            )}
          </div>
        )}

        {/* Subtle Online Dot */}
        <div
          title={isHealthy ? 'NASA & ISRO Live Radar Feeds: Connected' : 'Connecting to Satellite Services...'}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#121722] border border-[#1e2536] text-[11px] font-mono-tech text-slate-300"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isHealthy ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'
            }`}
          />
          <span className="hidden lg:inline text-[11px] text-slate-300">Live</span>
        </div>

        {/* Guide / Help icon */}
        {onStartTour && (
          <button
            onClick={onStartTour}
            title="Interactive Onboarding Guide"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-md transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          title="Settings & API Tokens"
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-md transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
