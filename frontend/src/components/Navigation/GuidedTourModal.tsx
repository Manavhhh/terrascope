import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Globe2,
  Sliders,
  Sparkles,
  Command,
  Activity,
  Layers,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToDemo: (index: number) => void;
}

interface Step {
  title: string;
  badge: string;
  subtitle: string;
  content: string;
  icon: React.ReactNode;
  hint: string;
}

const STEPS: Step[] = [
  {
    title: 'Figma-Inspired Mission Navigation',
    badge: 'Step 1 of 4',
    subtitle: 'Streamlined mode switcher and global search',
    content:
      'Navigate between 3D Globe, Surface Events feed, Split-Swipe Compare Lab, and Data Catalog using the clean top tabs. Press ⌘K or Ctrl+K anywhere to open the instant Command Palette to jump to any event or tool.',
    icon: <Command className="w-8 h-8 text-cyan-400" />,
    hint: 'Keyboard Shortcut: Ctrl + K (or ⌘K) opens quick search',
  },
  {
    title: '1-Click Preset Discovery Strip',
    badge: 'Step 2 of 4',
    subtitle: 'Instantly load verified Earth observation testbeds',
    content:
      'Directly beneath the navigation bar, the preset discovery strip allows single-click exploration of tectonic earthquakes, flood inundation, agriculture, and glaciers with live anomaly counters.',
    icon: <Activity className="w-8 h-8 text-rose-400" />,
    hint: 'Try clicking "Earthquake & Fault Slip" or "Floods & Hydrology"',
  },
  {
    title: 'Floating Canvas Tool Dock',
    badge: 'Step 3 of 4',
    subtitle: 'Figma-style canvas toolbar centered on your screen',
    content:
      'Effortlessly switch between Select (V), Pan (H), and Measure (M) tools, toggle 2D Map or 3D Globe projections, adjust layer opacity on the fly, and manage satellite orbit tracks and radar swath footprints.',
    icon: <Sliders className="w-8 h-8 text-purple-400" />,
    hint: 'Toggle between 3D spherical globe and flat 2D map anytime',
  },
  {
    title: 'Orbit AI & Deep InSAR Intelligence',
    badge: 'Step 4 of 4',
    subtitle: 'Physics-based remote sensing at your fingertips',
    content:
      'Expand the right-hand Orbit AI panel to inspect real-time Line-of-Sight (LOS) displacement in centimeters, coherence stability, and machine learning hypothesis validation against GNSS benchmarks.',
    icon: <Sparkles className="w-8 h-8 text-emerald-400" />,
    hint: 'Export findings directly as GeoJSON, CSV, or executive HTML briefs',
  },
];

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onClose,
  onJumpToDemo,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn select-none font-sans">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0f1320] border border-cyan-500/30 rounded-2xl shadow-[0_0_60px_rgba(0,240,255,0.25)] overflow-hidden flex flex-col z-10 animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-4 border-b border-cyan-500/20 bg-[#090e1b]/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono-tech px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
              {step.badge}
            </span>
            <span className="text-xs font-mono-tech text-slate-400">TERRA//SCOPE ONBOARDING</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            {step.icon}
          </div>

          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">{step.title}</h3>
            <p className="text-xs font-mono-tech text-cyan-400 mt-0.5">{step.subtitle}</p>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed font-sans">{step.content}</p>

          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center gap-2.5 text-xs text-cyan-200">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-mono-tech text-[11px]">{step.hint}</span>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentStep
                    ? 'w-6 bg-cyan-400 shadow-sm shadow-cyan-400'
                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 border-t border-cyan-500/20 bg-[#090e1b]/80 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-all cursor-pointer ${
              currentStep === 0
                ? 'opacity-40 cursor-not-allowed text-slate-500'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onJumpToDemo(0);
                onClose();
              }}
              className="text-xs text-slate-400 hover:text-cyan-300 px-3 py-1.5 transition-colors cursor-pointer font-sans"
            >
              Skip to Demo
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs font-mono-tech transition-all shadow-[0_0_12px_rgba(0,240,255,0.4)] cursor-pointer active:scale-95"
            >
              <span>{currentStep === STEPS.length - 1 ? 'Start Exploring' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
