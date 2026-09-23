'use client';

import React, { useState } from 'react';
import { Layers, ShieldCheck, HelpCircle, Compass, Scale, ChevronDown, ChevronUp } from 'lucide-react';
import ProvenanceBadge from './ProvenanceBadge';
import { SemanticLayer } from '@/lib/physics-engine';

interface SemanticLayersGuideProps {
  className?: string;
  defaultExpanded?: boolean;
}

export const SemanticLayersGuide: React.FC<SemanticLayersGuideProps> = ({
  className = '',
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [activeFilter, setActiveFilter] = useState<SemanticLayer | 'ALL'>('ALL');

  return (
    <div className={`rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg text-xs font-mono ${className}`}>
      {/* Header Bar */}
      <div className="p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-300 font-bold shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-wide text-xs sm:text-sm">
                Epistemic Architecture: 3 Semantic Layers
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] bg-slate-800 text-slate-300 border border-slate-700">
                RIGOROUS TYPING
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Distinguishing established equations, model hypotheses, and operator doctrine.
            </p>
          </div>
        </div>

        {/* The 4 Epistemic Labels Legend */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <ProvenanceBadge tag="MEASURED" />
          <ProvenanceBadge tag="DERIVED" />
          <ProvenanceBadge tag="SIMULATED" />
          <ProvenanceBadge tag="HYPOTHESIS" />

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 flex items-center gap-1 text-[11px] transition-colors"
          >
            <span>{isExpanded ? 'Collapse' : 'Details'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Layer Filter Pills */}
      <div className="px-3 sm:px-4 py-2 bg-slate-950/60 border-b border-slate-850 flex flex-wrap items-center gap-2 text-[11px]">
        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mr-1">Filter Layer:</span>
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`px-2 py-0.5 rounded transition-all ${
            activeFilter === 'ALL'
              ? 'bg-slate-700 text-white font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Layers (3)
        </button>
        <button
          onClick={() => setActiveFilter('ESTABLISHED_PHYSICS')}
          className={`px-2 py-0.5 rounded border transition-all ${
            activeFilter === 'ESTABLISHED_PHYSICS'
              ? 'bg-emerald-950 text-emerald-300 border-emerald-500 font-bold shadow-sm'
              : 'border-emerald-500/20 text-emerald-400/80 hover:bg-emerald-950/40'
          }`}
        >
          1. Established Physics
        </button>
        <button
          onClick={() => setActiveFilter('MODEL_HYPOTHESIS')}
          className={`px-2 py-0.5 rounded border transition-all ${
            activeFilter === 'MODEL_HYPOTHESIS'
              ? 'bg-amber-950 text-amber-300 border-amber-500 font-bold shadow-sm'
              : 'border-amber-500/20 text-amber-400/80 hover:bg-amber-950/40'
          }`}
        >
          2. Model Hypothesis
        </button>
        <button
          onClick={() => setActiveFilter('OPERATOR_DOCTRINE')}
          className={`px-2 py-0.5 rounded border transition-all ${
            activeFilter === 'OPERATOR_DOCTRINE'
              ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold shadow-sm'
              : 'border-cyan-500/20 text-cyan-400/80 hover:bg-cyan-950/40'
          }`}
        >
          3. Operator Doctrine
        </button>
      </div>

      {/* Expanded Content or Compact Summary */}
      <div className="p-3 sm:p-4 space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* LAYER 1: ESTABLISHED PHYSICS */}
          {(activeFilter === 'ALL' || activeFilter === 'ESTABLISHED_PHYSICS') && (
            <div className="p-3.5 rounded-lg bg-slate-950 border border-emerald-500/40 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Layer 1: Established Physics
                  </span>
                  <ProvenanceBadge tag="DERIVED" />
                </div>
                <div className="text-white font-bold text-xs">
                  Fundamental Maxwellian Invariants
                </div>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  Experimentally verified physical laws that legitimately drive the numerical field simulation kernel.
                </p>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-emerald-300 space-y-1 font-mono">
                  <div className="flex justify-between items-center">
                    <span>S = E × H</span>
                    <span className="text-[9px] text-slate-400">Poynting Flux</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>F = ∮_∂V T · n̂ dA</span>
                    <span className="text-[9px] text-slate-400">Maxwell Stress</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>dP/dt = -∮_∂V T · n̂ dA</span>
                    <span className="text-[9px] text-slate-400">Momentum Balance</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Invariant: Electromagnetic momentum and Poynting continuity hold rigorously across boundary ∂V.
                </div>
              </div>
            </div>
          )}

          {/* LAYER 2: MODEL HYPOTHESIS */}
          {(activeFilter === 'ALL' || activeFilter === 'MODEL_HYPOTHESIS') && (
            <div className="p-3.5 rounded-lg bg-slate-950 border border-amber-500/40 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Layer 2: Model Hypothesis
                  </span>
                  <ProvenanceBadge tag="HYPOTHESIS" />
                </div>
                <div className="text-white font-bold text-xs">
                  Model-Defined Theoretical Constructs
                </div>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  Theoretical constructs and coupling abstractions defined inside this architecture requiring empirical validation.
                </p>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-amber-300 space-y-1 font-mono">
                  <div className="flex justify-between items-center">
                    <span>Γ₀, Γ_δ</span>
                    <span className="text-[9px] text-slate-400">Cruise & Vectoring</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>C_AB</span>
                    <span className="text-[9px] text-slate-400">Corridor Coupling</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Σ_vessel</span>
                    <span className="text-[9px] text-slate-400">Hull Boundary</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>𝒯 = ℛ ⊕ 𝒱</span>
                    <span className="text-[9px] text-slate-400">Rail-Ship Dynamic</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Note: Tagged as model-defined hypotheses; not yet empirical physical constants.
                </div>
              </div>
            </div>
          )}

          {/* LAYER 3: OPERATOR DOCTRINE */}
          {(activeFilter === 'ALL' || activeFilter === 'OPERATOR_DOCTRINE') && (
            <div className="p-3.5 rounded-lg bg-slate-950 border border-cyan-500/40 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    Layer 3: Operator Doctrine
                  </span>
                  <ProvenanceBadge tag="HYPOTHESIS" />
                </div>
                <div className="text-white font-bold text-xs">
                  Operational Control & Symmetry Rules
                </div>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  Flight procedures and design paradigms governing energy guidance and piloting actions.
                </p>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 space-y-1 font-mono">
                  <div className="font-bold text-slate-200">
                    Stage 3 Symmetry Condition:
                  </div>
                  <div className="text-amber-300 font-bold">
                    Δr = 0 ⇒ τ_steer ≈ 0
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Axial momentum transfer Π_z maximized under rotational symmetry.
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Doctrine: Design paradigm / conceptual hypothesis, not a concluded physical proof.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Reference Table (when expanded) */}
        {isExpanded && (
          <div className="mt-3 p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Epistemic Taxonomy Reference Table
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px]">
                    <th className="pb-1.5 pr-3">Epistemic Label</th>
                    <th className="pb-1.5 pr-3">Semantic Tier</th>
                    <th className="pb-1.5 pr-3">Verification Basis</th>
                    <th className="pb-1.5">Example Quantities in App</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 font-mono text-slate-300">
                  <tr>
                    <td className="py-2 pr-3"><ProvenanceBadge tag="MEASURED" /></td>
                    <td className="py-2 pr-3 text-emerald-400">Established Physics</td>
                    <td className="py-2 pr-3 text-slate-400 font-sans">Empirical laboratory sensor or physical probe reading.</td>
                    <td className="py-2 text-slate-200">Laboratory probe voltage, hardware spectrometer calibration.</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3"><ProvenanceBadge tag="DERIVED" /></td>
                    <td className="py-2 pr-3 text-emerald-400">Established Physics</td>
                    <td className="py-2 pr-3 text-slate-400 font-sans">Mathematically derived from Maxwell equations and tensor conservation.</td>
                    <td className="py-2 text-slate-200">S = E × H, F = ∮ T · n̂ dA, dP/dt momentum integral.</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3"><ProvenanceBadge tag="SIMULATED" /></td>
                    <td className="py-2 pr-3 text-cyan-400">Numerical Engine</td>
                    <td className="py-2 pr-3 text-slate-400 font-sans">Output of discretized 2D/3D numerical wave solver.</td>
                    <td className="py-2 text-slate-200">Grid field intensity |E(r)|², nodal powers P_1..P_6, harmonic decomposition.</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3"><ProvenanceBadge tag="HYPOTHESIS" /></td>
                    <td className="py-2 pr-3 text-amber-400">Model Hypothesis / Doctrine</td>
                    <td className="py-2 pr-3 text-slate-400 font-sans">Theoretical constructs, coupling matrices, and operational flight rules.</td>
                    <td className="py-2 text-slate-200">Γ₀, Γ_δ, C_AB, Σ_vessel, Δr = 0 ⇒ τ_steer ≈ 0, 𝒯 = ℛ ⊕ 𝒱.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SemanticLayersGuide;
