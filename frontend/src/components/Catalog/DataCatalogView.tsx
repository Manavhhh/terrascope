import React, { useState } from 'react';
import {
  Layers,
  Search,
  ExternalLink,
  ShieldCheck,
  Download,
  Calendar,
  Satellite,
  Database,
  ArrowUpRight,
} from 'lucide-react';
import { ProductMetadata, ProviderInfo } from '../../types';

interface DataCatalogViewProps {
  products: ProductMetadata[];
  providers: ProviderInfo[];
  onSelectProduct: (product: ProductMetadata) => void;
  onFlyToProduct: (product: ProductMetadata) => void;
}

export const DataCatalogView: React.FC<DataCatalogViewProps> = ({
  products,
  providers,
  onSelectProduct,
  onFlyToProduct,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  const filtered = products.filter((p) => {
    if (levelFilter !== 'all' && !p.processing_level.includes(levelFilter)) return false;
    if (
      searchFilter &&
      !p.title.toLowerCase().includes(searchFilter.toLowerCase()) &&
      !p.product_id.toLowerCase().includes(searchFilter.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="absolute inset-0 top-12 bg-[#080b11] z-20 flex flex-col font-sans select-none overflow-y-auto">
      {/* Title & Providers Summary */}
      <div className="bg-[#0e131f] border-b border-[#1e2638] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight">
              NISAR Radar Data Catalog & Provenance Repository
            </h2>
            <p className="text-xs text-slate-400">
              Verified synthetic aperture radar scenes across NASA ASF, ISRO Bhoonidhi, and calibrated testbeds.
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search product ID or title..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-[#141b2a] border border-[#222d42] text-xs text-white pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-400 w-60 font-sans"
            />
          </div>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-[#09101f] border border-cyan-500/20 text-xs text-slate-200 py-1 px-2 rounded focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Processing Levels</option>
            <option value="GUNW">L2 GUNW (InSAR)</option>
            <option value="GCOV">L2 GCOV (Backscatter)</option>
            <option value="SLC">L1 SLC (Complex)</option>
            <option value="DISP">L3 DISP (Displacement)</option>
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="flex-1 p-6">
        <div className="bg-[#060b18] border border-cyan-500/25 rounded-lg overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#09101f] border-b border-cyan-500/20 text-[10px] text-cyan-400 uppercase">
                <th className="p-3">Product Title & Identifier</th>
                <th className="p-3">Mission / Sensor</th>
                <th className="p-3">Level</th>
                <th className="p-3">Polarization</th>
                <th className="p-3">Acquisition Date</th>
                <th className="p-3">Orbit Dir</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/10 text-slate-200">
              {filtered.map((prod) => (
                <tr
                  key={prod.product_id}
                  className="hover:bg-[#0c1833]/50 transition-colors group"
                >
                  <td className="p-3">
                    <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {prod.title}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{prod.product_id}</div>
                  </td>

                  <td className="p-3">
                    <div className="text-white">{prod.mission}</div>
                    <div className="text-[10px] text-slate-400">{prod.sensor}</div>
                  </td>

                  <td className="p-3">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold">
                      {prod.processing_level}
                    </span>
                  </td>

                  <td className="p-3 text-white">{prod.polarization}</td>

                  <td className="p-3 text-slate-300">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      <span>{prod.acquisition_date.substring(0, 10)}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {prod.acquisition_date.substring(11, 19)} UTC
                    </span>
                  </td>

                  <td className="p-3 text-slate-300">{prod.orbit_direction}</td>

                  <td className="p-3">
                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold border ${
                        prod.is_demo
                          ? 'bg-purple-950/40 border-purple-500/40 text-purple-300'
                          : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      }`}
                    >
                      {prod.source_status}
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          onSelectProduct(prod);
                          onFlyToProduct(prod);
                        }}
                        title="Locate Footprint on 3D Globe"
                        className="p-1.5 rounded bg-cyan-600/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-400/30 transition-all flex items-center gap-1 text-[11px]"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>GLOBE</span>
                      </button>

                      {prod.download_url && (
                        <a
                          href={prod.download_url}
                          target="_blank"
                          rel="noreferrer"
                          title="NASA / ISRO Granule Source"
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
