import React from 'react';
import {
  Mountain,
  Trees,
  Waves,
  Sprout,
  Snowflake,
  Sparkles,
} from 'lucide-react';
import { SurfaceChangeCategory, DemoInvestigation } from '../../types';

interface CategoryPillBarProps {
  selectedCategories: SurfaceChangeCategory[];
  onToggleCategory: (cat: SurfaceChangeCategory) => void;
  onSelectSingleCategory?: (cat: SurfaceChangeCategory) => void;
  activeInvestigation?: DemoInvestigation | null;
  onSelectInvestigation?: (inv: DemoInvestigation) => void;
  demoInvestigations?: DemoInvestigation[];
}

interface CategoryOption {
  id: SurfaceChangeCategory | 'all';
  label: string;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'all', label: 'All', icon: <Sparkles className="w-3 h-3 text-cyan-400" /> },
  { id: 'ground_deformation', label: 'Deformation', icon: <Mountain className="w-3 h-3 text-cyan-400" /> },
  { id: 'flood_wetland', label: 'Floods', icon: <Waves className="w-3 h-3 text-blue-400" /> },
  { id: 'agriculture', label: 'Agriculture', icon: <Sprout className="w-3 h-3 text-emerald-400" /> },
  { id: 'glacier_ice', label: 'Cryosphere', icon: <Snowflake className="w-3 h-3 text-sky-400" /> },
  { id: 'vegetation_forest', label: 'Forest', icon: <Trees className="w-3 h-3 text-lime-400" /> },
];

export const CategoryPillBar: React.FC<CategoryPillBarProps> = ({
  selectedCategories,
  onToggleCategory,
  onSelectSingleCategory,
  onSelectInvestigation,
  demoInvestigations = [],
}) => {
  const isAllActive = selectedCategories.length > 2;

  const handleSelect = (id: SurfaceChangeCategory | 'all') => {
    if (id === 'all') {
      if (onSelectSingleCategory) {
        onSelectSingleCategory('ground_deformation');
      }
      return;
    }

    if (onSelectSingleCategory) {
      onSelectSingleCategory(id);
    } else {
      onToggleCategory(id);
    }

    if (onSelectInvestigation && demoInvestigations.length > 0) {
      const match = demoInvestigations.find((d) => d.category === id);
      if (match) {
        onSelectInvestigation(match);
      }
    }
  };

  return (
    <div className="absolute top-14 left-1/2 -translate-x-1/2 z-10 pointer-events-auto select-none font-sans">
      <div className="flex items-center gap-1 bg-[#0f131d]/80 backdrop-blur-md px-1.5 py-1 rounded-full border border-[#1e2536] shadow-md">
        {CATEGORIES.map((cat) => {
          const isActive =
            cat.id === 'all'
              ? isAllActive
              : selectedCategories.includes(cat.id as SurfaceChangeCategory);

          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              {cat.icon}
              <span className="text-[11px]">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
