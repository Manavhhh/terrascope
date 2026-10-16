import React from 'react';
import { BookOpen, Radio, ShieldAlert, Cpu, Layers, ExternalLink } from 'lucide-react';

export const MethodologyView: React.FC = () => {
  return (
    <div className="absolute inset-0 top-12 bg-[#080b11] z-20 flex flex-col font-sans select-none overflow-y-auto p-6 md:p-8 text-slate-200">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-[#1e2638] pb-4">
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest font-mono-tech">
              SCIENTIFIC OBSERVATION FOUNDATION
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            NISAR Radar Methodology & Observation Physics
          </h1>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Theoretical and mathematical formulation of Synthetic Aperture Radar (SAR) change intelligence,
            SweepSAR geometry, and interferometric phase inversion.
          </p>
        </div>

        {/* Section 1: NISAR Mission Architecture */}
        <div className="bg-[#060b18] border border-cyan-500/20 rounded-lg p-6 space-y-3">
          <h2 className="text-sm font-bold text-cyan-300 uppercase flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-400" />
            1. NASA-ISRO Synthetic Aperture Radar (NISAR) Architecture
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            NISAR represents the first dual-frequency radar Earth observation mission utilizing a 12-meter
            unfurlable mesh reflector antenna. Operating in a sun-synchronous dawn-dusk orbit at an altitude
            of 747 km with an inclination of 98.4°, NISAR achieves an exact 12-day orbital repeat cycle.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-xs">
            <div className="bg-[#09101f] border border-cyan-500/15 p-3 rounded">
              <strong className="text-white block mb-1">NASA L-SAR Payload</strong>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Carrier frequency ~1.25 GHz (wavelength lambda = 24.0 cm). L-band penetrates weather,
                dense forest canopies, and dry topsoil, maintaining interferometric phase coherence
                over long temporal baselines for global tectonic deformation.
              </p>
            </div>
            <div className="bg-[#09101f] border border-cyan-500/15 p-3 rounded">
              <strong className="text-white block mb-1">ISRO S-SAR Payload</strong>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Carrier frequency ~3.2 GHz (wavelength lambda = 9.3 cm). S-band provides heightened
                sensitivity to surface roughness, coastal sea ice dynamics, and agricultural vegetative
                canopy structures across the Indian subcontinent.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: InSAR Phase Deformation Inversion */}
        <div className="bg-[#060b18] border border-cyan-500/20 rounded-lg p-6 space-y-3">
          <h2 className="text-sm font-bold text-cyan-300 uppercase flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            2. Differential InSAR Line-of-Sight (LOS) Crustal Displacement
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Differential Interferometric SAR (DInSAR) calculates the phase difference between two coregistered
            complex radar acquisitions. The measured interferometric phase delta is decomposed as:
          </p>
          <div className="bg-[#030712] border border-cyan-500/30 p-3 rounded text-center text-xs text-cyan-300 font-bold">
            phi_int = phi_topo + phi_disp + phi_atm + phi_orbit + phi_noise
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            After subtracting the topographic phase simulated from a high-resolution DEM (Copernicus 30m),
            the remaining unwrapped phase directly yields line-of-sight surface displacement d_LOS:
          </p>
          <div className="bg-[#030712] border border-cyan-500/30 p-3 rounded text-center text-xs text-purple-300 font-bold">
            d_LOS = - ( lambda / 4 * pi ) * delta_phi
          </div>
          <p className="text-xs text-slate-400 text-[11px]">
            For NISAR L-band (lambda = 24 cm), one full 2pi phase fringe corresponds to 12.0 cm of relative
            crustal displacement along the satellite line of sight.
          </p>
        </div>

        {/* Section 3: Radiometric Log-Ratio Inundation Engine */}
        <div className="bg-[#060b18] border border-cyan-500/20 rounded-lg p-6 space-y-3">
          <h2 className="text-sm font-bold text-cyan-300 uppercase flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            3. Multi-Temporal Log-Ratio & Polarimetric Vegetation Index
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Multi-temporal change detection on terrain-flattened Gamma-0 calibrated backscatter sigma0 is
            performed via log-ratio differencing:
          </p>
          <div className="bg-[#030712] border border-cyan-500/30 p-3 rounded text-center text-xs text-emerald-300 font-bold">
            Delta sigma0_dB = 10 * log10( I_post / I_pre ) = sigma0_post(dB) - sigma0_pre(dB)
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Open floodwater acts as a specular reflector, reflecting transmitted microwave energy away from
            the sensor and inducing sharp signal drops (-4 to -10 dB). For vegetated parcels, the Radar
            Vegetation Index (RVI) quantifies volume scattering:
          </p>
          <div className="bg-[#030712] border border-cyan-500/30 p-3 rounded text-center text-xs text-lime-300 font-bold">
            RVI = ( 4 * sigma_HV ) / ( sigma_HH + sigma_HV )
          </div>
        </div>

        {/* Section 4: Scientific Limitations & Responsible Interpretation */}
        <div className="bg-[#060b18] border border-amber-500/30 rounded-lg p-6 space-y-3">
          <h2 className="text-sm font-bold text-amber-400 uppercase flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            4. Scientific Limitations & Responsible Remote Sensing
          </h2>
          <ul className="list-disc list-inside space-y-2 text-xs text-slate-300">
            <li>
              <strong>1D Line-of-Sight Projection:</strong> A single ascending or descending radar pass
              measures displacement only along the line-of-sight vector. True 3D crustal slip (E-W vs vertical)
              requires multi-track decomposition or GNSS integration.
            </li>
            <li>
              <strong>Temporal Decorrelation:</strong> Rapid vegetative growth, snow melt, or tilling alters
              surface scatterers at sub-wavelength scales, reducing coherence below the unwrapping threshold.
            </li>
            <li>
              <strong>Atmospheric Stratification:</strong> Turbulent tropospheric water vapor delay can induce
              apparent 2-4 cm phase ramps across high-relief topography, necessitating atmospheric correction.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
