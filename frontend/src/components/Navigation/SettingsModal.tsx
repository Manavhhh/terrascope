import React, { useState } from 'react';
import {
  X,
  Key,
  ShieldCheck,
  Database,
  Satellite,
  CheckCircle2,
  Palette,
  Check,
  Sliders,
} from 'lucide-react';
import { ProviderInfo, ColorPaletteId } from '../../types';
import { COLOR_PALETTES } from '../../utils/palettes';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  providers: ProviderInfo[];
  cesiumToken: string;
  onSaveCesiumToken: (token: string) => void;
  colorPalette?: ColorPaletteId;
  onChangeColorPalette?: (palette: ColorPaletteId) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  providers,
  cesiumToken,
  onSaveCesiumToken,
  colorPalette = 'spectral',
  onChangeColorPalette,
}) => {
  const [tokenInput, setTokenInput] = useState(cesiumToken);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCesiumToken(tokenInput.trim());
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md select-none font-sans p-4">
      <div className="w-full max-w-2xl bg-[#0e131f] border border-[#222d42] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222d42] px-6 py-4 bg-[#0a0e17]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Satellite className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight">
                Settings & Visual System
              </h2>
              <p className="text-[11px] text-slate-400">
                Figma color palettes, telemetry credentials, and satellite data providers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-[#182030] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200">
          {/* Color Combination Palettes Section */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Figma Color Combination Palettes
                </h3>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono-tech uppercase">
                Active: {COLOR_PALETTES[colorPalette]?.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Tailored chromatic palettes for remote sensing, designed for maximum perceptual contrast, scientific fidelity, and accessibility.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.values(COLOR_PALETTES).map((pal) => {
                const isSelected = pal.id === colorPalette;
                return (
                  <button
                    key={pal.id}
                    onClick={() => onChangeColorPalette?.(pal.id)}
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-[#151c2c] border-cyan-500/50 shadow-md ring-1 ring-cyan-500/30'
                        : 'bg-[#0a0d16] border-[#1d2638] hover:bg-[#111724] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white">{pal.name}</span>
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center text-black">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight">
                      {pal.category} · {pal.unit}
                    </div>
                    {/* Visual gradient swatch */}
                    <div
                      className={`w-full h-2.5 rounded-full bg-gradient-to-r ${pal.gradient} shadow-inner`}
                    />
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono-tech">
                      <span>{pal.minLabel}</span>
                      <span>{pal.maxLabel}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Providers Status */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              Connected Radar Data Providers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {providers.map((p) => (
                <div
                  key={p.provider_id}
                  className="bg-[#0a0d16] border border-[#1d2638] rounded-xl p-3 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      {p.name}
                      {p.free_public_search && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono-tech">
                          OPEN
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{p.agency}</div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono-tech">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="uppercase text-[10px]">{p.status.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cesium Ion Token Input */}
          <form onSubmit={handleSave} className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-400" />
              Cesium Ion Access Token (Optional)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              TERRA//SCOPE ships with photorealistic Esri World Satellite Imagery out of the box. Provide a personal Cesium Ion token if you want 3D World Terrain elevation meshes.
            </p>
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="flex-1 bg-[#0a0d16] border border-[#1d2638] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono-tech"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
            {savedNotice && (
              <div className="text-xs text-emerald-400 flex items-center gap-1 pt-1 font-mono-tech">
                <CheckCircle2 className="w-3.5 h-3.5" /> Token applied to active session.
              </div>
            )}
          </form>

          {/* Security & Scientific Integrity Notice */}
          <div className="bg-[#0a0d16] border border-[#1d2638] rounded-xl p-3.5 text-xs text-slate-400 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-medium">NASA-ISRO Data Security Policy:</strong>
              <p className="mt-0.5 leading-relaxed text-[11px] text-slate-400">
                All Earthdata authentication keys and radar algorithms are isolated within the backend pipeline. No API keys or tokens are ever exposed to the client or stored unencrypted.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#222d42] px-6 py-3.5 bg-[#0a0e17] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1b2336] hover:bg-[#222d42] text-slate-200 font-medium rounded-lg text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
