import React, { useState } from 'react';
import {
  Globe,
  Orbit,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sliders,
  ChevronDown,
  Compass,
  Plus,
  Minus,
  Palette,
  Check,
} from 'lucide-react';
import { ColorPaletteId } from '../../types';
import { COLOR_PALETTES } from '../../utils/palettes';

interface GlobeHUDProps {
  coordinates: { lon: number; lat: number; height: number } | null;
  is2DMode: boolean;
  onToggle2D: () => void;
  showOrbits: boolean;
  onToggleOrbits: () => void;
  showFootprints: boolean;
  onToggleFootprints: () => void;
  showChangeLayer: boolean;
  onToggleChangeLayer: () => void;
  layerOpacity: number;
  onChangeOpacity: (opacity: number) => void;
  onResetView?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  colorPalette?: ColorPaletteId;
  onChangeColorPalette?: (palette: ColorPaletteId) => void;
}

export const GlobeHUD: React.FC<GlobeHUDProps> = ({
  coordinates,
  is2DMode,
  onToggle2D,
  showOrbits,
  onToggleOrbits,
  showFootprints,
  onToggleFootprints,
  showChangeLayer,
  onToggleChangeLayer,
  layerOpacity,
  onChangeOpacity,
  onResetView,
  onZoomIn,
  onZoomOut,
  colorPalette = 'spectral',
  onChangeColorPalette,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showPaletteMenu, setShowPaletteMenu] = useState(false);

  const activePalette = COLOR_PALETTES[colorPalette] || COLOR_PALETTES.spectral;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* FIGMA MAP CONTROLS DOCK (Top-Right Canvas Cluster with Zoom +/-)          */}
      {/* ========================================================================= */}
      <div className="absolute top-14 right-4 z-20 pointer-events-auto select-none font-sans">
        <div className="flex items-center gap-1 bg-[#0e131f]/90 backdrop-blur-md p-1 rounded-lg border border-[#222d42] shadow-xl text-xs">
          {/* Zoom In & Out Controls */}
          <div className="flex items-center bg-[#141a29] rounded-md border border-[#222d42]">
            <button
              onClick={onZoomIn}
              className="p-1.5 text-slate-300 hover:text-cyan-400 hover:bg-[#1b2336] rounded-l-md transition-colors cursor-pointer"
              title="Zoom In (or Scroll Wheel Up)"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <div className="h-3 w-px bg-[#222d42]" />
            <button
              onClick={onZoomOut}
              className="p-1.5 text-slate-300 hover:text-cyan-400 hover:bg-[#1b2336] rounded-r-md transition-colors cursor-pointer"
              title="Zoom Out (or Scroll Wheel Down)"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-[#222d42] mx-0.5" />

          {/* 3D / 2D Projection Toggle */}
          <button
            onClick={onToggle2D}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-200 hover:text-cyan-300 hover:bg-[#182030] transition-colors cursor-pointer"
            title={is2DMode ? 'Switch to 3D Globe Projection' : 'Switch to 2D Map Projection'}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{is2DMode ? '2D' : '3D'}</span>
          </button>

          <div className="h-4 w-px bg-[#222d42] mx-0.5" />

          {/* Layer Overlays Menu */}
          <div className="relative">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                showLayerMenu
                  ? 'bg-[#1b2336] text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-200 hover:text-white hover:bg-[#182030] border border-transparent'
              }`}
              title="Layer Visibility & Radar Heatmaps"
            >
              <Layers className="w-3.5 h-3.5 text-slate-300" />
              <span>Layers</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLayerMenu && (
              <div className="absolute top-full mt-2 right-0 w-64 bg-[#101520] border border-[#222d42] rounded-xl shadow-2xl p-3 flex flex-col gap-2 z-40">
                <div className="flex items-center justify-between text-[10px] uppercase font-mono-tech tracking-wider text-slate-400 border-b border-[#222d42] pb-1.5">
                  <span>Radar Layer Stack</span>
                  <span className="text-cyan-400 font-bold">NISAR</span>
                </div>

                <label className="flex items-center justify-between text-xs text-slate-200 hover:bg-[#182030] p-1.5 rounded-md cursor-pointer transition-colors">
                  <span className="flex items-center gap-2">
                    <Orbit className="w-3.5 h-3.5 text-purple-400" />
                    Satellite Orbits
                  </span>
                  <input
                    type="checkbox"
                    checked={showOrbits}
                    onChange={onToggleOrbits}
                    className="w-3.5 h-3.5 rounded bg-[#080b11] border-[#222d42] text-cyan-400 focus:ring-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-200 hover:bg-[#182030] p-1.5 rounded-md cursor-pointer transition-colors">
                  <span className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    Swath Footprints
                  </span>
                  <input
                    type="checkbox"
                    checked={showFootprints}
                    onChange={onToggleFootprints}
                    className="w-3.5 h-3.5 rounded bg-[#080b11] border-[#222d42] text-cyan-400 focus:ring-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-200 hover:bg-[#182030] p-1.5 rounded-md cursor-pointer transition-colors">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Change Heatmap
                  </span>
                  <input
                    type="checkbox"
                    checked={showChangeLayer}
                    onChange={onToggleChangeLayer}
                    className="w-3.5 h-3.5 rounded bg-[#080b11] border-[#222d42] text-cyan-400 focus:ring-0 cursor-pointer"
                  />
                </label>

                {showChangeLayer && (
                  <div className="pt-2 border-t border-[#222d42] flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Overlay Opacity</span>
                      <span className="font-mono-tech text-cyan-300 font-semibold">{Math.round(layerOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="1.0"
                      step="0.05"
                      value={layerOpacity}
                      onChange={(e) => onChangeOpacity(parseFloat(e.target.value))}
                      className="w-full h-1 bg-[#1c2538] accent-cyan-400 rounded cursor-pointer"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-[#222d42] mx-0.5" />

          {/* Color Combination Palettes Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowPaletteMenu(!showPaletteMenu);
                if (showLayerMenu) setShowLayerMenu(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                showPaletteMenu
                  ? 'bg-[#1b2336] text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-200 hover:text-white hover:bg-[#182030] border border-transparent'
              }`}
              title="Figma Color Combination Palettes"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Palette</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showPaletteMenu && (
              <div className="absolute top-full mt-2 right-0 w-72 bg-[#101520] border border-[#222d42] rounded-xl shadow-2xl p-3 flex flex-col gap-2.5 z-40">
                <div className="flex items-center justify-between text-[10px] uppercase font-mono-tech tracking-wider text-slate-400 border-b border-[#222d42] pb-1.5">
                  <span>Color Palettes</span>
                  <span className="text-amber-400 font-bold">Figma & GIS</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {Object.values(COLOR_PALETTES).map((pal) => {
                    const isSelected = pal.id === colorPalette;
                    return (
                      <button
                        key={pal.id}
                        onClick={() => {
                          onChangeColorPalette?.(pal.id);
                          setShowPaletteMenu(false);
                        }}
                        className={`text-left p-2 rounded-lg border transition-all cursor-pointer flex flex-col gap-1.5 ${
                          isSelected
                            ? 'bg-[#182235] border-cyan-500/40 shadow-sm'
                            : 'bg-[#0d121c] border-[#1d2638] hover:bg-[#141b2a] hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-white flex items-center gap-1.5">
                            {pal.name}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </div>
                        <div className="text-[10px] text-slate-400">{pal.category}</div>
                        {/* Gradient Preview Bar */}
                        <div
                          className={`w-full h-2 rounded-full bg-gradient-to-r ${pal.gradient} shadow-inner`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-[#222d42] mx-0.5" />

          {/* Reset Camera / Nadir */}
          {onResetView && (
            <button
              onClick={onResetView}
              className="p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-[#182030] transition-colors cursor-pointer"
              title="Reset View to Target"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-[#182030] transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* GEIST MONO COORDINATE CHIP (Bottom-Left Canvas Overlay)                   */}
      {/* ========================================================================= */}
      <div className="absolute bottom-20 left-4 z-10 pointer-events-auto select-none font-mono-tech">
        <div className="bg-[#0e131f]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#222d42] text-[11px] text-slate-300 flex items-center gap-2 shadow-lg">
          <Compass className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          {coordinates ? (
            <span>
              <strong className="text-white font-medium">
                {coordinates.lat >= 0 ? '+' : ''}{coordinates.lat.toFixed(3)}°N
              </strong>
              ,{' '}
              <strong className="text-white font-medium">
                {coordinates.lon >= 0 ? '+' : ''}{coordinates.lon.toFixed(3)}°E
              </strong>{' '}
              · <span className="text-cyan-400">{(coordinates.height / 1000).toFixed(0)} km</span> alt
              <span className="text-slate-400 ml-2 hidden md:inline">· Scroll or double-click to zoom</span>
            </span>
          ) : (
            <span className="text-slate-400 font-sans">
              Scroll wheel or double-click globe to zoom cursor · Click [+][-]
            </span>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HARMONIOUS INSAR / GIS SCALE BAR (Bottom-Right Canvas Overlay)             */}
      {/* ========================================================================= */}
      <div className="hidden sm:block absolute bottom-20 right-4 z-10 pointer-events-auto select-none font-mono-tech">
        <div className="bg-[#0e131f]/90 backdrop-blur-md px-3 py-2 rounded-lg border border-[#222d42] text-[10px] text-slate-400 flex flex-col gap-1.5 shadow-lg">
          <div className="flex items-center justify-between gap-4 font-sans text-[11px] text-slate-300 font-medium">
            <span>{activePalette.name}</span>
            <span className="font-mono-tech text-[10px] text-cyan-400 font-semibold">{activePalette.unit}</span>
          </div>
          <div className={`w-48 h-1.5 rounded-full bg-gradient-to-r ${activePalette.gradient} shadow-sm`} />
          <div className="flex justify-between text-[9px] text-slate-400 font-mono-tech">
            <span className="text-rose-400">{activePalette.minLabel}</span>
            <span>{activePalette.zeroLabel}</span>
            <span className="text-amber-400">{activePalette.maxLabel}</span>
          </div>
        </div>
      </div>
    </>
  );
};
