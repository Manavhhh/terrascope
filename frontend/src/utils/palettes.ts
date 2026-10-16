import { ColorPaletteDef, ColorPaletteId } from '../types';

export const COLOR_PALETTES: Record<ColorPaletteId, ColorPaletteDef> = {
  spectral: {
    id: 'spectral',
    name: 'Spectral Fringe (InSAR)',
    category: 'Phase & Ground Deformation',
    description: 'Multi-cycle interferometric fringe wrapping for sub-centimeter surface displacement and tectonic fault ruptures.',
    gradient: 'from-purple-500 via-cyan-400 via-emerald-400 via-amber-400 to-rose-500',
    colors: ['#a855f7', '#00f0ff', '#10b981', '#f59e0b', '#f43f5e'],
    unit: 'λ/2 = 12 mm',
    minLabel: '-4 cm (Sink)',
    zeroLabel: '0',
    maxLabel: '+4 cm (Uplift)',
  },
  bipolar: {
    id: 'bipolar',
    name: 'Bipolar Geodesy (Divergent)',
    category: 'Subsidence vs. Uplift',
    description: 'Divergent high-contrast palette cleanly separating crustal subsidence/sinkholes from tectonic uplift.',
    gradient: 'from-rose-600 via-rose-400 via-slate-500 via-sky-400 to-blue-600',
    colors: ['#e11d48', '#fb7185', '#64748b', '#38bdf8', '#2563eb'],
    unit: 'LOS Velocity (cm/yr)',
    minLabel: '-8 cm/yr',
    zeroLabel: 'Stable',
    maxLabel: '+8 cm/yr',
  },
  hydro: {
    id: 'hydro',
    name: 'Hydrological Flood Inundation',
    category: 'Wetlands & Flooding',
    description: 'Calibrated SAR radar backscatter attenuation scale for flood extent, water pooling, and saturated soil.',
    gradient: 'from-indigo-950 via-blue-700 via-sky-500 to-cyan-300',
    colors: ['#1e1b4b', '#1d4ed8', '#0284c7', '#38bdf8', '#67e8f9'],
    unit: 'Backscatter (dB)',
    minLabel: '-24 dB (Open Water)',
    zeroLabel: '-15 dB',
    maxLabel: '-6 dB (Dry Soil)',
  },
  canopy: {
    id: 'canopy',
    name: 'Biomass & Agricultural Canopy',
    category: 'Vegetation & Forestry',
    description: 'Polarimetric cross-ratio (L-HV / L-HH) scale distinguishing bare furrowed ground, crop growth, and dense forestry.',
    gradient: 'from-amber-800 via-amber-500 via-lime-500 to-emerald-400',
    colors: ['#92400e', '#f59e0b', '#84cc16', '#10b981', '#059669'],
    unit: 'RVI Polarimetric Ratio',
    minLabel: '0.1 (Fallow/Soil)',
    zeroLabel: '0.45',
    maxLabel: '0.95 (Dense Canopy)',
  },
};

export const getColorForClassification = (
  classification: string,
  paletteId: ColorPaletteId = 'spectral'
): string => {
  const c = classification.toLowerCase();
  
  if (paletteId === 'bipolar') {
    if (c.includes('subsidence') || c.includes('sink') || c.includes('retreat')) return '#e11d48';
    if (c.includes('uplift') || c.includes('advance')) return '#2563eb';
    if (c.includes('rupture') || c.includes('fault')) return '#fb7185';
    return '#38bdf8';
  }
  
  if (paletteId === 'hydro') {
    if (c.includes('flood') || c.includes('inundation') || c.includes('water')) return '#38bdf8';
    if (c.includes('saturated') || c.includes('wetland')) return '#0284c7';
    if (c.includes('rupture') || c.includes('subsidence')) return '#1d4ed8';
    return '#67e8f9';
  }
  
  if (paletteId === 'canopy') {
    if (c.includes('crop') || c.includes('canopy') || c.includes('vegetation')) return '#10b981';
    if (c.includes('fallow') || c.includes('soil')) return '#f59e0b';
    if (c.includes('loss') || c.includes('deforestation')) return '#92400e';
    return '#84cc16';
  }

  // Default: Spectral Fringe
  if (c.includes('subsidence') || c.includes('retreat')) return '#ef4444';
  if (c.includes('uplift') || c.includes('advance')) return '#f59e0b';
  if (c.includes('crop') || c.includes('canopy')) return '#10b981';
  if (c.includes('rupture') || c.includes('fault')) return '#a855f7';
  if (c.includes('flood') || c.includes('water')) return '#00f0ff';
  return '#00f0ff';
};
