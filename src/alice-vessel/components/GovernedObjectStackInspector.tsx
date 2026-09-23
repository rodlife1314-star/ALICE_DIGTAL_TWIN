'use client';

import React from 'react';
import {
  GovernedObjectStateStack,
  SimulationParameters,
  calculateGovernedObjectState,
} from '@/lib/physics-engine';
import {
  Layers,
  ShieldCheck,
  Zap,
  Activity,
  Box,
  Compass,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Sparkles,
  Eye,
} from 'lucide-react';
import ProvenanceBadge from './ProvenanceBadge';

interface GovernedObjectStackInspectorProps {
  params: SimulationParameters;
  nodalTelemetry?: { powers: number[]; efficiency: number; uniformity: number };
  onClose?: () => void;
}

export const GovernedObjectStackInspector: React.FC<GovernedObjectStackInspectorProps> = ({
  params,
  nodalTelemetry,
  onClose,
}) => {
  const stack: GovernedObjectStateStack = calculateGovernedObjectState(params, nodalTelemetry);
  const { fieldModel, boundaryGeometry, materialState, structuralLoads, observableSensors, synthesis } = stack;

  return (
    <div
      id="governed-object-stack-inspector"
      className="flex flex-col w-full bg-slate-950 text-slate-100 rounded-xl border border-cyan-500/40 shadow-2xl p-4 sm:p-6 font-mono space-y-6"
    >
      {/* Header with Axiom & Descent Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-bold uppercase tracking-wider">
              Axiom: The Object Must Earn The Render
            </span>
            <ProvenanceBadge epistemicClass="DERIVED" provenanceSource="DETERMINISTIC_KERNEL" showSource={true} size="xs" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Governed Design Stack &amp; Stateful Physical Artefact Inspector
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Every rendered line, hue, and contour descends from a physical load, boundary, or material state vector.
          </p>
        </div>

        {/* The Formal State Equation Pill */}
        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-right shrink-0">
          <span className="text-[10px] text-slate-500 uppercase block font-semibold">STATE EQUATION</span>
          <span className="text-xs text-amber-300 font-bold">
            OBJECT(t) = G(t) + M(t) + F(t) + S(t)
          </span>
        </div>
      </div>

      {/* The Architectural Descent & Verification Pipeline Schematics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Descent Chain */}
        <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 space-y-2">
          <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            1. Generative Descent Chain
          </span>
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">FIELD MODEL</span>
            <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">BOUNDARY</span>
            <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">MATERIAL</span>
            <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">STRUCTURE</span>
            <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="px-2 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/60 font-bold">
              [OBJECT(t)]
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">
            Shape descends from loads; loads descend from fields; fields couple across materials.
          </p>
        </div>

        {/* Observable Verification Loop */}
        <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 space-y-2">
          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            2. Observable Twin Verification Loop
          </span>
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
            <span className="px-2 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/60 font-bold">[OBJECT(t)]</span>
            <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">SENSORS</span>
            <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">TWIN</span>
            <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">MEASUREMENT</span>
            <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/60 font-bold">
              VALIDATION
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">
            Sensory telemetry validates the twin against empirical Maxwell invariants in real time.
          </p>
        </div>
      </div>

      {/* The 5 Stack Layers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {/* Layer 1: Field State */}
        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-850 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-sky-300 uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              Layer 1: Field State F(t)
            </span>
            <ProvenanceBadge epistemicClass={fieldModel.provenance} size="xs" />
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Carrier Magnetic Field B:</span>
              <span className="text-white font-bold">{fieldModel.carrierFieldB_T} T</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Poynting Axial Flux S_z:</span>
              <span className="text-cyan-300 font-bold">{fieldModel.poyntingFlux_kWm2.toFixed(1)} kW/m²</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Carrier Frequency:</span>
              <span className="text-slate-200">{fieldModel.frequency_GHz.toFixed(2)} GHz</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Phase Velocity v_p / c:</span>
              <span className="text-emerald-300">{fieldModel.phaseVelocityRatio.toFixed(3)}</span>
            </div>
          </div>
          <div className="text-[9px] text-slate-400 pt-1 border-t border-slate-850">
            Basis: {fieldModel.derivationId}
          </div>
        </div>

        {/* Layer 2: Boundary & Geometry */}
        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-850 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              Layer 2: Geometry G(t)
            </span>
            <ProvenanceBadge epistemicClass={boundaryGeometry.provenance} size="xs" />
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Symmetry Group:</span>
              <span className="text-amber-300 font-bold">{boundaryGeometry.symmetryGroup}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Active Stator Channels:</span>
              <span className="text-white font-bold">{boundaryGeometry.activeChannels} channels</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Aperture Bore Diameter:</span>
              <span className="text-slate-200">{boundaryGeometry.apertureDiameter_m} m</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Axial Radial Deflection Δr:</span>
              <span className={boundaryGeometry.isCoaxiallySymmetric ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {boundaryGeometry.axialDisplacementDeltaR_mm.toFixed(2)} mm
              </span>
            </div>
          </div>
          <div className="text-[9px] text-slate-400 pt-1 border-t border-slate-850">
            Basis: {boundaryGeometry.derivationId}
          </div>
        </div>

        {/* Layer 3: Material State */}
        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-850 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-emerald-300 uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Box className="w-3.5 h-3.5 text-emerald-400" />
              Layer 3: Material M(t)
            </span>
            <ProvenanceBadge epistemicClass={materialState.provenance} size="xs" />
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Permittivity ε_r:</span>
              <span className="text-white font-bold">{materialState.relativePermittivity.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Effective Impedance Z:</span>
              <span className="text-cyan-300 font-bold">{materialState.impedance_Z_ohms.toFixed(1)} Ω</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Impedance Mismatch |ΔZ|:</span>
              <span className="text-amber-300">{Math.abs(materialState.deltaZ_ohms).toFixed(1)} Ω</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Alabaster Shear Modulus:</span>
              <span className="text-slate-200">{materialState.metamaterialShearModulus_GPa.toFixed(1)} GPa</span>
            </div>
          </div>
          <div className="text-[9px] text-slate-400 pt-1 border-t border-slate-850">
            Basis: {materialState.derivationId}
          </div>
        </div>

        {/* Layer 4: Structural Loads */}
        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-850 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-rose-300 uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-rose-400" />
              Layer 4: Structure &amp; Loads L(t)
            </span>
            <ProvenanceBadge epistemicClass={structuralLoads.provenance} size="xs" />
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Forward Thrust Π_z:</span>
              <span className="text-emerald-400 font-bold">{structuralLoads.axialThrust_kN.toFixed(1)} kN</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Transverse Force F_⊥:</span>
              <span className="text-amber-400 font-bold">{structuralLoads.transverseForce_N.toFixed(1)} N</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Steering Torque τ:</span>
              <span className="text-rose-300 font-bold">{structuralLoads.reactionlessTorque_Nm.toFixed(0)} N·m</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Standing Wave Ratio SWR:</span>
              <span className="text-slate-200">{structuralLoads.standingWaveRatio.toFixed(2)}:1</span>
            </div>
          </div>
          <div className="text-[9px] text-slate-400 pt-1 border-t border-slate-850">
            Basis: {structuralLoads.derivationId}
          </div>
        </div>

        {/* Layer 5: Observable Sensors */}
        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-850 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-purple-300 uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              Layer 5: Sensors S(t)
            </span>
            <ProvenanceBadge epistemicClass={observableSensors.provenance} size="xs" />
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Optical Reticle Sensor:</span>
              <span className="text-white font-bold">{observableSensors.opticalReticleOffset_mm.toFixed(2)} mm</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Phase Coherence Lock:</span>
              <span className="text-emerald-400 font-bold">{observableSensors.phaseCoherenceLock.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>SWR Return Sensor:</span>
              <span className="text-slate-200">{observableSensors.swrTelemetry.toFixed(2)}:1</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Thermal Bloom Risk:</span>
              <span className={observableSensors.thermalBloomRisk === 'NOMINAL' ? 'text-emerald-400' : 'text-rose-400'}>
                {observableSensors.thermalBloomRisk}
              </span>
            </div>
          </div>
          <div className="text-[9px] text-slate-400 pt-1 border-t border-slate-850">
            Basis: {observableSensors.derivationId}
          </div>
        </div>

        {/* Layer 6: Rendered Artefact Object */}
        <div className="p-3.5 rounded-lg bg-gradient-to-br from-cyan-950/50 to-slate-900 border border-cyan-500/50 space-y-2">
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-1.5">
            <span className="font-bold text-cyan-300 uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              Earned Render State O(t)
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 font-bold">
              VERIFIED
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
            {synthesis.earnedRenderProof}
          </p>
          <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] text-amber-300">
            {synthesis.stateDescription}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernedObjectStackInspector;
