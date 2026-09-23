'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  SimulationParameters,
  GeometryType,
  GEOMETRY_DEFINITIONS,
  NAUTICAL_FLIGHT_SEQUENCE,
  NauticalFlightStage,
  NauticalStageInfo,
  calculateVesselEngineMetrics,
  COSMIC_FLUX_CORRIDORS,
  CRUISE_GAMMA_0_PRESET,
  VECTORING_GAMMA_DELTA_PRESET,
  TelemetryContractItem,
} from '@/lib/physics-engine';
import {
  Eye,
  Crosshair,
  Compass,
  Layers,
  ShieldCheck,
  RotateCcw,
  Sliders,
  Sparkles,
  AlertTriangle,
  Radio,
  Zap,
  CheckCircle2,
  ChevronRight,
  Maximize2,
  Minimize2,
  Info,
  Scale,
  Activity,
  Anchor,
  Wind,
  Flame,
  ArrowRight,
  Box,
} from 'lucide-react';
import ProvenanceBadge from './ProvenanceBadge';
import GovernedTelemetryWidget from './GovernedTelemetryWidget';
import GovernedObjectStackInspector from './GovernedObjectStackInspector';
import { AliceTwinCockpitJourney } from './AliceTwinCockpitJourney';

export type CockpitViewMode = 'captain' | 'twin' | 'field' | 'provenance' | 'seat_journey';

interface CockpitArtefactTwinViewProps {
  params: SimulationParameters;
  onParamsChange: (updater: (prev: SimulationParameters) => SimulationParameters) => void;
  nodalTelemetry: { powers: number[]; efficiency: number; uniformity: number };
  onOpenAiSynthesis?: () => void;
  onNavigateToWorkbench?: () => void;
}

export const CockpitArtefactTwinView: React.FC<CockpitArtefactTwinViewProps> = ({
  params,
  onParamsChange,
  nodalTelemetry,
  onOpenAiSynthesis,
  onNavigateToWorkbench,
}) => {
  // The 4 Canonical Navigation Views
  const [viewMode, setViewMode] = useState<CockpitViewMode>('captain');

  // Governed Object Stack Inspector Drawer State ("The Object Must Earn The Render")
  const [showObjectStack, setShowObjectStack] = useState<boolean>(false);

  // Reticle Dragging / Interactivity State
  const [isDraggingReticle, setIsDraggingReticle] = useState<boolean>(false);

  // Calculate live engine metrics from simulation state
  const engineMetrics = useMemo(() => calculateVesselEngineMetrics(params), [params]);

  // Active Corridor info
  const activeCorridor = engineMetrics.activeCorridor;

  // Active Stage
  const activeStage = engineMetrics.activeNauticalStage;

  // Current Geometry Definition
  const currentGeom = GEOMETRY_DEFINITIONS[params.geometry] || GEOMETRY_DEFINITIONS.G6;

  // Offset distance delta r (in pixel units and millimeter equivalent)
  const deltaX = params.sourceOffsetX;
  const deltaY = params.sourceOffsetY;
  const deltaR = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const deltaR_mm = deltaR * 0.75; // Calibration factor

  // Symmetry verification for Coaxial Cruise
  // Law: Delta r = 0 + symmetrical excitation + symmetrical boundary conditions => F_perp ~ 0, tau ~ 0
  const isExcitationSymmetric = deltaR < 1.0;
  const isBoundarySymmetric = params.boundaryReflection <= 0.5;
  const isCoaxialSymmetryConditionMet = isExcitationSymmetric && isBoundarySymmetric;

  // Live Governed Telemetry Items (Contract Enforcement)
  const governedTelemetry: Record<string, TelemetryContractItem> = useMemo(() => {
    const timestamp = new Date().toISOString().substring(11, 19);

    return {
      coaxialOffset: {
        id: 'coaxial_offset',
        label: 'Axial Radial Deflection (Δr)',
        value: deltaR_mm,
        unit: 'mm',
        formattedValue: deltaR_mm.toFixed(2),
        epistemicClass: 'CONFIGURED_INPUT',
        provenanceSource: 'DETERMINISTIC_KERNEL',
        derivationId: 'RETICLE_SPATIAL_DISPLACEMENT',
        timestamp,
        toleranceOrCondition: isExcitationSymmetric ? 'Δr < 1.0mm (Symmetric)' : 'Δr ≥ 1.0mm (Asymmetric)',
      },
      forwardPoyntingFlux: {
        id: 'forward_poynting_flux',
        label: 'Axial Momentum Flux (Π_z)',
        value: engineMetrics.axialMomentumFlux,
        unit: 'kN',
        formattedValue: engineMetrics.axialMomentumFlux.toFixed(1),
        epistemicClass: 'DERIVED',
        provenanceSource: 'DETERMINISTIC_KERNEL',
        derivationId: 'POYNTING_THEORETICAL_FLUX_INTEGRAL',
        timestamp,
        toleranceOrCondition: 'S = E × H integrated over aperture',
      },
      transverseTorque: {
        id: 'transverse_torque',
        label: 'Steering Reaction Torque (τ)',
        value: engineMetrics.maxwellTorqueNm,
        unit: 'N·m',
        formattedValue: engineMetrics.maxwellTorqueNm.toFixed(1),
        epistemicClass: isCoaxialSymmetryConditionMet ? 'DERIVED' : 'SIMULATED',
        provenanceSource: 'DETERMINISTIC_KERNEL',
        derivationId: 'MAXWELL_STRESS_MOMENT_INTEGRAL',
        timestamp,
        toleranceOrCondition: isCoaxialSymmetryConditionMet
          ? 'Δr ≈ 0 ∧ symm. boundary ⇒ τ ≈ 0'
          : 'Asymmetric shear active',
      },
      couplingEfficiency: {
        id: 'coupling_efficiency',
        label: 'Field Coupling Product (η)',
        value: nodalTelemetry.efficiency,
        unit: '%',
        formattedValue: (nodalTelemetry.efficiency * 100).toFixed(1),
        epistemicClass: 'SIMULATED',
        provenanceSource: 'DETERMINISTIC_KERNEL',
        derivationId: 'DISCRETIZED_NODAL_MATRIX_SOLVER',
        timestamp,
        toleranceOrCondition: 'Z_match × σ_phase',
      },
      standingWaveRatio: {
        id: 'standing_wave_ratio',
        label: 'Voltage Standing Wave Ratio (SWR)',
        value: engineMetrics.standingWaveRatio,
        unit: ':1',
        formattedValue: `${engineMetrics.standingWaveRatio.toFixed(2)}:1`,
        epistemicClass: 'DERIVED',
        provenanceSource: 'DETERMINISTIC_KERNEL',
        derivationId: 'TRANSMISSION_LINE_REFLECTION_COEFF',
        timestamp,
        toleranceOrCondition: `|ΔZ| = ${engineMetrics.deltaZAbs.toFixed(1)} Ω`,
      },
      ambientCorridorCarrier: {
        id: 'corridor_carrier',
        label: 'Corridor Field Strength (B_rail)',
        value: 11.2,
        unit: 'Tesla',
        formattedValue: '11.2',
        epistemicClass: 'HYPOTHESIS',
        provenanceSource: 'DETERMINISTIC_KERNEL',
        derivationId: 'CORRIDOR_WAVEGUIDE_SPECIFICATION',
        timestamp,
        toleranceOrCondition: activeCorridor.name,
      },
      doctrineState: {
        id: 'doctrine_state',
        label: 'Operational Doctrine State',
        value: activeStage.operationalState,
        formattedValue: activeStage.operationalState,
        epistemicClass: 'OPERATOR_DOCTRINE',
        provenanceSource: 'DETERMINISTIC_KERNEL',
        derivationId: 'NAUTICAL_PROCEDURAL_STATE_MACHINE',
        timestamp,
        governanceNote: 'Piloting rule, not independent physics proof',
      },
    };
  }, [deltaR_mm, isExcitationSymmetric, isCoaxialSymmetryConditionMet, engineMetrics, nodalTelemetry, activeCorridor, activeStage]);

  // Stage selection handler
  const handleSelectStage = (st: NauticalStageInfo) => {
    onParamsChange(prev => ({
      ...prev,
      vesselMode: st.recommendedMode,
      sourceOffsetX: st.targetOffsetX,
      sourceOffsetY: st.targetOffsetY,
      eigenmodeWeights: { ...st.eigenmodeDistribution },
    }));
  };

  // Center the reticle to exact zero
  const handleCenterReticle = () => {
    onParamsChange(prev => ({
      ...prev,
      vesselMode: 'cruise_gamma_0',
      sourceOffsetX: 0,
      sourceOffsetY: 0,
      eigenmodeWeights: { ...CRUISE_GAMMA_0_PRESET },
    }));
  };

  // Nudge Reticle
  const handleNudge = (dx: number, dy: number) => {
    onParamsChange(prev => ({
      ...prev,
      sourceOffsetX: Math.max(-60, Math.min(60, prev.sourceOffsetX + dx)),
      sourceOffsetY: Math.max(-60, Math.min(60, prev.sourceOffsetY + dy)),
      vesselMode: 'vectoring_gamma_delta',
      eigenmodeWeights: { ...VECTORING_GAMMA_DELTA_PRESET },
    }));
  };

  // Reticle Drag / Click handler
  const handleReticleAreaClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const clickX = e.clientX - rect.left - cx;
    const clickY = e.clientY - rect.top - cy;

    // Scale click to range [-50, 50]
    const scale = 50 / (Math.min(cx, cy) * 0.85);
    const newDx = Math.max(-60, Math.min(60, Math.round(clickX * scale)));
    const newDy = Math.max(-60, Math.min(60, Math.round(clickY * scale)));

    onParamsChange(prev => ({
      ...prev,
      sourceOffsetX: newDx,
      sourceOffsetY: newDy,
      vesselMode: Math.sqrt(newDx * newDx + newDy * newDy) < 3 ? 'cruise_gamma_0' : 'vectoring_gamma_delta',
      eigenmodeWeights:
        Math.sqrt(newDx * newDx + newDy * newDy) < 3
          ? { ...CRUISE_GAMMA_0_PRESET }
          : { ...VECTORING_GAMMA_DELTA_PRESET },
    }));
  }, [onParamsChange]);

  // Render polygon stator points for perspective tunnel
  const statorSymmetryN = currentGeom.n === 0 ? 16 : currentGeom.n;

  const generateStatorPoints = (cx: number, cy: number, r: number, n: number) => {
    const pts: string[] = [];
    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return pts.join(' ');
  };

  return (
    <div
      id="cockpit-artefact-twin-view"
      className="flex flex-col w-full min-h-[760px] bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-2xl overflow-hidden font-mono"
    >
      {/* Top Cockpit Command Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-amber-400 font-bold uppercase tracking-wider">
              ARTEFACT TWIN COCKPIT CONSOLE
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 text-[11px]">Alabaster Interior v1.0</span>
            <ProvenanceBadge epistemicClass="OPERATOR_DOCTRINE" showLayer={false} />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
            &ldquo;Pass the Thread Through the Centre&rdquo; — Coaxial Waveguide Laboratory
          </h2>
        </div>

        {/* View Mode Navigation Tabs: Captain -> Twin -> Field -> Provenance -> Mobile Seat Journey */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 shrink-0">
          <button
            id="btn-view-seat-journey"
            onClick={() => setViewMode('seat_journey')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              viewMode === 'seat_journey'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Mobile Seat HUD</span>
          </button>

          <button
            id="btn-view-captain"
            onClick={() => setViewMode('captain')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              viewMode === 'captain'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>1. Captain View</span>
          </button>

          <button
            id="btn-view-twin"
            onClick={() => setViewMode('twin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              viewMode === 'twin'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Twin View</span>
          </button>

          <button
            id="btn-view-field"
            onClick={() => setViewMode('field')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              viewMode === 'field'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>3. Field View</span>
          </button>

          <button
            id="btn-view-provenance"
            onClick={() => setViewMode('provenance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              viewMode === 'provenance'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>4. Provenance View</span>
          </button>

          {/* Governed Object Stack Inspector Button */}
          <button
            id="btn-governed-object-stack"
            onClick={() => setShowObjectStack(!showObjectStack)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ml-1 ${
              showObjectStack
                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400 shadow-md ring-1 ring-cyan-400/50'
                : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-750'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Stack:</span>
            <span className="text-amber-300">Earn The Render</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono">
              G+M+F+S
            </span>
          </button>
        </div>
      </div>

      {/* Governed Object Stack Inspector Drawer ("The Object Must Earn The Render") */}
      {showObjectStack && (
        <div className="p-3 sm:p-4 bg-slate-950 border-b border-cyan-500/40">
          <GovernedObjectStackInspector
            params={params}
            nodalTelemetry={nodalTelemetry}
            onClose={() => setShowObjectStack(false)}
          />
        </div>
      )}

      {/* Six-Stage Nautical Flight Sequence Ribbon */}
      <div className="bg-slate-950 border-b border-slate-800/90 px-3 py-2 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            NAUTICAL FLIGHT SEQUENCE STATE MACHINE:
          </span>
          <span className="text-[10px] text-slate-500">
            Active: Stage 0{activeStage.stageIndex} — <strong className="text-cyan-300">{activeStage.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
          {NAUTICAL_FLIGHT_SEQUENCE.map(st => {
            const isCurrent = activeStage.id === st.id;
            return (
              <button
                key={st.id}
                id={`cockpit-stage-btn-${st.id}`}
                onClick={() => handleSelectStage(st)}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-cyan-950/70 border-cyan-500/90 text-white shadow-md ring-1 ring-cyan-500/30'
                    : 'bg-slate-900/60 border-slate-850 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-[10px] text-cyan-400">0{st.stageIndex}</span>
                  <ProvenanceBadge tag={st.provenance} layer={st.semanticLayer} size="xs" />
                </div>
                <div className="text-[10px] font-semibold text-slate-200 truncate">{st.name}</div>
                <div className="text-[9px] text-slate-400 truncate mt-0.5">{st.operationalState}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workbench Body: Viewport + Five Real-Time Operator Answers */}
      {viewMode === 'seat_journey' ? (
        <div className="flex-1 w-full min-h-[680px] h-[calc(100vh-280px)] overflow-hidden">
          <AliceTwinCockpitJourney initialSpace="chair" onNavigateToTab={onNavigateToWorkbench} />
        </div>
      ) : (
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* Left / Center Area: Main Viewport (Captain / Twin / Field / Provenance) (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950 relative overflow-hidden">
          {/* ========================================================================= */}
          {/* VIEW 1: CAPTAIN VIEW (First-person forward canopy perspective)             */}
          {/* ========================================================================= */}
          {viewMode === 'captain' && (
            <div className="relative w-full h-full flex flex-col items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 select-none space-y-3">
              {/* Concept Title Header Banner (Matching Concept Art) */}
              <div className="w-full flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-950/90 border border-slate-800/80 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider">
                    ARTEFACT TWIN SYSTEM
                  </span>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-300 font-semibold text-[11px]">
                    VESSEL CONCEPT · INTERIOR (ALABASTER COCKPIT)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="text-cyan-400 font-bold tracking-widest uppercase">
                    RIDE THE FIELDS. EXPLORE FURTHER.
                  </span>
                  <ProvenanceBadge epistemicClass="OPERATOR_DOCTRINE" showSource={false} size="xs" />
                </div>
              </div>

              {/* Center Forward Canopy: High-Fidelity 16:9 Perspective Waveguide Tunnel & Alabaster Cockpit */}
              <div className="relative w-full aspect-[16/9] max-h-[560px] flex items-center justify-center">
                <svg
                  viewBox="0 0 960 540"
                  className="w-full h-full cursor-crosshair rounded-xl border border-slate-800 bg-slate-950 shadow-2xl"
                  onClick={handleReticleAreaClick}
                >
                  <defs>
                    {/* Deep Cosmos & Nebula Gradients */}
                    <linearGradient id="deepCosmosGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#020617" />
                      <stop offset="50%" stopColor="#090d1f" />
                      <stop offset="100%" stopColor="#050b1a" />
                    </linearGradient>

                    <radialGradient id="nebulaViolet" cx="45%" cy="40%" r="55%">
                      <stop offset="0%" stopColor="#4c1d95" stopOpacity="0.35" />
                      <stop offset="60%" stopColor="#1e1b4b" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#020617" stopOpacity="0" />
                    </radialGradient>

                    <radialGradient id="nebulaCyan" cx="55%" cy="60%" r="50%">
                      <stop offset="0%" stopColor="#0891b2" stopOpacity="0.3" />
                      <stop offset="70%" stopColor="#020617" stopOpacity="0" />
                    </radialGradient>

                    {/* Stator Tunnel Focal Starburst */}
                    <radialGradient id="focalHorizonGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                      <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.9" />
                      <stop offset="60%" stopColor="#0891b2" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#020617" stopOpacity="0" />
                    </radialGradient>

                    {/* Alabaster Cockpit Arch Gradients */}
                    <linearGradient id="alabasterArchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="40%" stopColor="#f8fafc" />
                      <stop offset="80%" stopColor="#e2e8f0" />
                      <stop offset="100%" stopColor="#cbd5e1" />
                    </linearGradient>

                    <linearGradient id="alabasterShade" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f1f5f9" />
                      <stop offset="100%" stopColor="#94a3b8" />
                    </linearGradient>

                    {/* Captain's Chair Amber Floor-Wash Illumination */}
                    <radialGradient id="amberFloorWash" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#d97706" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#020617" stopOpacity="0" />
                    </radialGradient>

                    <linearGradient id="floorDeckGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="100%" stopColor="#090d16" />
                    </linearGradient>
                  </defs>

                  {/* 1. Deep Space Cosmic Canvas with Nebular Luminescence */}
                  <rect width="960" height="540" fill="url(#deepCosmosGrad)" />
                  <rect width="960" height="540" fill="url(#nebulaViolet)" />
                  <rect width="960" height="540" fill="url(#nebulaCyan)" />

                  {/* Distant Stars */}
                  <circle cx="120" cy="80" r="1" fill="#94a3b8" />
                  <circle cx="210" cy="140" r="1.5" fill="#f8fafc" />
                  <circle cx="340" cy="65" r="1.2" fill="#cbd5e1" />
                  <circle cx="620" cy="75" r="1.8" fill="#ffffff" />
                  <circle cx="780" cy="120" r="1.3" fill="#e2e8f0" />
                  <circle cx="840" cy="220" r="1" fill="#94a3b8" />
                  <circle cx="160" cy="310" r="1.4" fill="#f8fafc" />
                  <circle cx="820" cy="340" r="1.2" fill="#cbd5e1" />

                  {/* 2. Vanishing Perspective Stator Waveguide Tunnel */}
                  {(() => {
                    // Center vanishing coordinates driven by reticle deltaX & deltaY
                    const centerX = 480 + deltaX * 1.8;
                    const centerY = 260 + deltaY * 1.8;

                    // Polygonal Stator Rings receding towards vanishing point
                    const statorRadii = [340, 260, 195, 140, 95, 60, 36, 18];

                    return (
                      <g>
                        {/* Perspective Stator Corridor Rails */}
                        {statorRadii.map((rad, idx) => {
                          const pts = generateStatorPoints(centerX, centerY, rad, statorSymmetryN);
                          const strokeOpacity = 0.12 + (1 - idx / statorRadii.length) * 0.7;
                          const isInner = idx === statorRadii.length - 1;
                          return (
                            <polygon
                              key={`ring-${idx}`}
                              points={pts}
                              fill="none"
                              stroke={isCoaxialSymmetryConditionMet ? '#38bdf8' : '#f59e0b'}
                              strokeWidth={isInner ? 2.5 : 1.2}
                              strokeOpacity={strokeOpacity}
                              strokeDasharray={idx % 2 === 1 ? '5 4' : undefined}
                            />
                          );
                        })}

                        {/* Axial Guide Rails Connecting Vertices to Center */}
                        {Array.from({ length: statorSymmetryN }).map((_, idx) => {
                          const angle = (2 * Math.PI * idx) / statorSymmetryN - Math.PI / 2;
                          const outerR = 340;
                          const x1 = centerX + outerR * Math.cos(angle);
                          const y1 = centerY + outerR * Math.sin(angle);
                          return (
                            <line
                              key={`rail-${idx}`}
                              x1={x1}
                              y1={y1}
                              x2={centerX}
                              y2={centerY}
                              stroke={isCoaxialSymmetryConditionMet ? '#0284c7' : '#d97706'}
                              strokeOpacity="0.35"
                              strokeWidth="1"
                            />
                          );
                        })}

                        {/* The Central Guided Electromagnetic Thread */}
                        {/* Thread Outer Bloom */}
                        <line
                          x1="480"
                          y1="540"
                          x2={centerX}
                          y2={centerY}
                          stroke={isCoaxialSymmetryConditionMet ? '#38bdf8' : '#fbbf24'}
                          strokeWidth="8"
                          strokeOpacity="0.4"
                        />
                        {/* Thread Core Laser */}
                        <line
                          x1="480"
                          y1="540"
                          x2={centerX}
                          y2={centerY}
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          strokeOpacity="0.95"
                        />

                        {/* Focal Horizon Starburst Glow */}
                        <circle cx={centerX} cy={centerY} r="36" fill="url(#focalHorizonGlow)" />

                        {/* Reticle Target Crosshairs */}
                        <circle
                          cx={centerX}
                          cy={centerY}
                          r="18"
                          fill="none"
                          stroke={isCoaxialSymmetryConditionMet ? '#34d399' : '#f59e0b'}
                          strokeWidth="2"
                        />
                        <line
                          x1={centerX - 28}
                          y1={centerY}
                          x2={centerX + 28}
                          y2={centerY}
                          stroke={isCoaxialSymmetryConditionMet ? '#34d399' : '#f59e0b'}
                          strokeWidth="1.5"
                        />
                        <line
                          x1={centerX}
                          y1={centerY - 28}
                          x2={centerX}
                          y2={centerY + 28}
                          stroke={isCoaxialSymmetryConditionMet ? '#34d399' : '#f59e0b'}
                          strokeWidth="1.5"
                        />

                        {/* Asymmetric Maxwell Stress Fringe Vectors if deltaR > 0 */}
                        {!isCoaxialSymmetryConditionMet && (
                          <g>
                            <line
                              x1="480"
                              y1="260"
                              x2={centerX}
                              y2={centerY}
                              stroke="#ef4444"
                              strokeWidth="2"
                              strokeDasharray="4 3"
                            />
                            <rect
                              x={(480 + centerX) / 2 + 8}
                              y={(260 + centerY) / 2 - 16}
                              width="140"
                              height="20"
                              rx="4"
                              fill="#450a0a"
                              stroke="#ef4444"
                              strokeWidth="1"
                            />
                            <text
                              x={(480 + centerX) / 2 + 14}
                              y={(260 + centerY) / 2 - 2}
                              fill="#fca5a5"
                              fontSize="10"
                              fontFamily="monospace"
                              fontWeight="bold"
                            >
                              τ_shear = {engineMetrics.maxwellTorqueNm.toFixed(0)} N·m
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })()}

                  {/* 3. The Sculpted Alabaster Cockpit Framework & Shell */}
                  {/* Outer Panoramic Canopy Arch Structure */}
                  <path
                    d="M 0 0 L 180 0 L 260 85 L 700 85 L 780 0 L 960 0 L 960 540 L 760 540 L 710 440 L 250 440 L 200 540 L 0 540 Z"
                    fill="none"
                    stroke="url(#alabasterArchGrad)"
                    strokeWidth="8"
                    strokeOpacity="0.85"
                  />

                  {/* Cockpit Left Bulkhead Column */}
                  <path
                    d="M 0 0 L 180 0 L 220 180 L 190 420 L 0 540 Z"
                    fill="#0f172a"
                    fillOpacity="0.8"
                    stroke="url(#alabasterArchGrad)"
                    strokeWidth="3"
                  />
                  {/* Left Bulkhead Wall Inscription (Matching Concept Art) */}
                  <g transform="translate(32, 130)">
                    <text fill="#cbd5e1" fontSize="11" fontFamily="monospace" fontWeight="bold" letterSpacing="1.5">
                      ALABASTER COCKPIT
                    </text>
                    <text y="20" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                      · CLARITY
                    </text>
                    <text y="36" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                      · CONTROL
                    </text>
                    <text y="52" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                      · CONNECTION
                    </text>
                  </g>

                  {/* Cockpit Right Bulkhead Column */}
                  <path
                    d="M 960 0 L 780 0 L 740 180 L 770 420 L 960 540 Z"
                    fill="#0f172a"
                    fillOpacity="0.8"
                    stroke="url(#alabasterArchGrad)"
                    strokeWidth="3"
                  />

                  {/* Cockpit Floor Deck */}
                  <path
                    d="M 190 440 L 770 440 L 800 540 L 160 540 Z"
                    fill="url(#floorDeckGrad)"
                    stroke="#334155"
                    strokeWidth="1.5"
                  />

                  {/* Glowing Amber Baseboard Floor-Wash Lighting */}
                  <path
                    d="M 190 440 Q 480 430 770 440"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeOpacity="0.9"
                  />

                  {/* 4. Dual Pilot Consoles (Left & Right Wings) */}
                  {/* Left Pilot Console Workstation */}
                  <polygon
                    points="170,360 270,360 290,440 190,440"
                    fill="#090d16"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeOpacity="0.7"
                  />
                  {/* Left Console Radar Scan Ring */}
                  <circle cx="230" cy="395" r="18" fill="#022c22" stroke="#10b981" strokeWidth="1" />
                  <circle cx="230" cy="395" r="10" fill="none" stroke="#10b981" strokeWidth="0.8" strokeDasharray="3 2" />
                  <line x1="230" y1="377" x2="230" y2="413" stroke="#10b981" strokeWidth="0.8" />
                  <line x1="212" y1="395" x2="248" y2="395" stroke="#10b981" strokeWidth="0.8" />

                  {/* Right Pilot Console Workstation */}
                  <polygon
                    points="690,360 790,360 770,440 670,440"
                    fill="#090d16"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeOpacity="0.7"
                  />
                  {/* Right Console Telemetry Waveform */}
                  <path
                    d="M 700 405 Q 715 385 730 400 T 760 395"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                  />

                  {/* 5. The Captain's Chair (Centerpiece Alabaster Command Seat) */}
                  {/* Turntable Pedestal Base with Intense Golden Amber Floor Glow */}
                  <ellipse cx="480" cy="515" rx="105" ry="24" fill="url(#amberFloorWash)" />
                  <ellipse cx="480" cy="510" rx="85" ry="18" fill="#090d16" stroke="#f59e0b" strokeWidth="2.5" />
                  <ellipse cx="480" cy="510" rx="60" ry="12" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.5" />

                  {/* Central Hydraulic Stem */}
                  <rect x="468" y="475" width="24" height="28" rx="3" fill="#334155" stroke="#64748b" strokeWidth="1" />

                  {/* Ergonomic Alabaster Backrest & Segmented Cushioning (Facing Forward Viewport) */}
                  {/* Main Seat Shell */}
                  <path
                    d="M 435 480 C 430 420 425 350 450 330 C 465 320 495 320 510 330 C 535 350 530 420 525 480 Z"
                    fill="url(#alabasterArchGrad)"
                    stroke="#94a3b8"
                    strokeWidth="2"
                  />
                  {/* Segmented Lumbar Inserts */}
                  <rect x="448" y="380" width="64" height="22" rx="4" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
                  <rect x="452" y="410" width="56" height="22" rx="4" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
                  <rect x="456" y="440" width="48" height="22" rx="4" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />

                  {/* Segmented Headrest */}
                  <rect x="455" y="325" width="50" height="26" rx="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
                  {/* Headrest Golden Emblem */}
                  <polygon points="480,332 485,340 480,344 475,340" fill="#f59e0b" />

                  {/* Sculpted Left & Right Armrests with Cyan Glowing Touchpads */}
                  <path
                    d="M 415 425 L 435 420 L 440 460 L 420 465 Z"
                    fill="#e2e8f0"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  />
                  <rect x="420" y="428" width="14" height="24" rx="2" fill="#0891b2" stroke="#38bdf8" strokeWidth="1" />

                  <path
                    d="M 545 425 L 525 420 L 520 460 L 540 465 Z"
                    fill="#e2e8f0"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  />
                  <rect x="526" y="428" width="14" height="24" rx="2" fill="#0891b2" stroke="#38bdf8" strokeWidth="1" />

                  {/* 6. Canopy HUD Graphics (Integrated Directly onto Forward Viewport Glass) */}
                  {/* Top-Left: FIELD GEOMETRY HUD */}
                  <g transform="translate(250, 95)">
                    <rect width="180" height="60" rx="6" fill="#020617" fillOpacity="0.75" stroke="#38bdf8" strokeWidth="1" />
                    <text x="10" y="18" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      FIELD GEOMETRY
                    </text>
                    <text x="10" y="34" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                      {currentGeom.symmetryGroup} CHANNELS ACTIVE
                    </text>
                    <text x="10" y="48" fill={isCoaxialSymmetryConditionMet ? '#34d399' : '#f59e0b'} fontSize="9" fontFamily="monospace" fontWeight="bold">
                      {isCoaxialSymmetryConditionMet ? 'STABLE AXIAL LOCK' : 'ASYMMETRIC SHEAR'}
                    </text>
                    {/* Mini Radar Polygon */}
                    <polygon
                      points="155,20 167,26 167,40 155,46 143,40 143,26"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                    />
                  </g>

                  {/* Center Top: THREAD LOCK Glowing Pill */}
                  <g transform="translate(400, 95)">
                    <rect
                      width="160"
                      height="26"
                      rx="13"
                      fill="#020617"
                      fillOpacity="0.85"
                      stroke={isCoaxialSymmetryConditionMet ? '#38bdf8' : '#f59e0b'}
                      strokeWidth="1.5"
                    />
                    <text
                      x="80"
                      y="17"
                      textAnchor="middle"
                      fill={isCoaxialSymmetryConditionMet ? '#38bdf8' : '#f59e0b'}
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                      letterSpacing="1"
                    >
                      {isCoaxialSymmetryConditionMet ? 'THREAD LOCK: Γ₀ ACTIVE' : 'THREAD LOCK: Γ_δ VECTOR'}
                    </text>
                  </g>

                  {/* Top-Right: THREAD-CENTRED CRUISE & VECTOR VIEW */}
                  <g transform="translate(530, 95)">
                    <rect width="210" height="60" rx="6" fill="#020617" fillOpacity="0.75" stroke="#34d399" strokeWidth="1" />
                    <text x="10" y="18" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      THREAD-CENTRED CRUISE
                    </text>
                    <text x="10" y="34" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                      AXIAL CRUISE / FIELD COUPLED
                    </text>
                    <text x="10" y="48" fill="#e2e8f0" fontSize="9" fontFamily="monospace">
                      VECTOR VIEW: E ⟂ H ⟂ |S|
                    </text>
                    {/* Triad Vector Symbol */}
                    <polygon points="185,22 195,35 175,35" fill="none" stroke="#34d399" strokeWidth="1.5" />
                  </g>

                  {/* Lower-Right: COAXIAL SYMMETRY HUD */}
                  <g transform="translate(680, 290)">
                    <rect width="180" height="52" rx="6" fill="#020617" fillOpacity="0.75" stroke={isCoaxialSymmetryConditionMet ? '#34d399' : '#f59e0b'} strokeWidth="1" />
                    <text x="10" y="18" fill={isCoaxialSymmetryConditionMet ? '#34d399' : '#f59e0b'} fontSize="10" fontFamily="monospace" fontWeight="bold">
                      COAXIAL SYMMETRY
                    </text>
                    <text x="10" y="32" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
                      Δr = {deltaR_mm.toFixed(2)} mm
                    </text>
                    <text x="10" y="45" fill={isCoaxialSymmetryConditionMet ? '#34d399' : '#f59e0b'} fontSize="9" fontFamily="monospace">
                      {isCoaxialSymmetryConditionMet ? 'PURE FORWARD FLUX (F_⊥≈0)' : 'VECTORING THRUST ACTIVE'}
                    </text>
                  </g>

                  {/* 7. Integrated Vessel Cutaway Inset (Matching Concept Art Lower-Left) */}
                  <g transform="translate(30, 395)">
                    <rect width="210" height="120" rx="8" fill="#020617" fillOpacity="0.88" stroke="#38bdf8" strokeWidth="1.2" />
                    <text x="12" y="20" fill="#38bdf8" fontSize="9.5" fontFamily="monospace" fontWeight="bold" letterSpacing="0.5">
                      VESSEL CROSS-SECTION (CUTAWAY)
                    </text>

                    {/* Longitudinal Hull Cutaway Outline */}
                    {/* Forward Ingestion Cone */}
                    <path
                      d="M 25 75 L 50 55 L 140 55 L 175 65 L 195 75 L 175 85 L 140 95 L 50 95 Z"
                      fill="#0f172a"
                      stroke="#38bdf8"
                      strokeWidth="1.2"
                    />

                    {/* Alabaster Cockpit Capsule */}
                    <ellipse cx="100" cy="75" rx="26" ry="14" fill="#1e293b" stroke="#e2e8f0" strokeWidth="1" />
                    {/* Seated Pilot Silhouette */}
                    <circle cx="98" cy="72" r="3" fill="#cbd5e1" />
                    <path d="M 96 76 L 102 76 L 100 82 Z" fill="#cbd5e1" />

                    {/* Aft Field Coupling Collars */}
                    <rect x="150" y="62" width="6" height="26" rx="1" fill="#0891b2" stroke="#38bdf8" strokeWidth="0.8" />
                    <rect x="165" y="60" width="6" height="30" rx="1" fill="#0891b2" stroke="#38bdf8" strokeWidth="0.8" />

                    {/* Continuous Electromagnetic Thread Passing Straight Through the Hull */}
                    <line x1="12" y1="75" x2="200" y2="75" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
                    <circle cx="25" cy="75" r="3" fill="#38bdf8" />
                    <circle cx="195" cy="75" r="3" fill="#38bdf8" />

                    {/* Annotation Tags */}
                    <text x="25" y="110" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">
                      FORWARD INGESTION · COCKPIT · AFT COLLAR
                    </text>
                  </g>
                </svg>

                {/* Reticle Micro-Nudge Overlay Buttons */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-slate-950/90 p-1.5 rounded-lg border border-slate-800 text-[10px] font-mono shadow-lg">
                  <span className="text-slate-400 mr-1 text-[9px]">STEER NUDGE:</span>
                  <button
                    id="nudge-left"
                    onClick={() => handleNudge(-10, 0)}
                    className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-750 font-bold"
                  >
                    ←
                  </button>
                  <button
                    id="nudge-up"
                    onClick={() => handleNudge(0, -10)}
                    className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-750 font-bold"
                  >
                    ↑
                  </button>
                  <button
                    id="nudge-down"
                    onClick={() => handleNudge(0, 10)}
                    className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-750 font-bold"
                  >
                    ↓
                  </button>
                  <button
                    id="nudge-right"
                    onClick={() => handleNudge(10, 0)}
                    className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-750 font-bold"
                  >
                    →
                  </button>
                  <button
                    id="center-zero"
                    onClick={handleCenterReticle}
                    className="ml-1 px-2 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 font-bold uppercase text-[9px]"
                  >
                    Lock Δr=0
                  </button>
                </div>
              </div>

              {/* Lower Cockpit Console Quote & Doctrine Footer (Matching Concept Art) */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 p-3 rounded-lg bg-slate-950/90 border border-slate-850 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold text-[11px] uppercase tracking-wide">
                    &ldquo;{activeStage.doctrineQuote}&rdquo;
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="text-slate-400 hidden md:inline">
                    NOT A VEHICLE THROUGH SPACE. A COUPLING TO WHAT ALREADY CONNECTS.
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="text-cyan-400 font-bold">SAME LAWS. A WIDER OCEAN.</span>
                  {isCoaxialSymmetryConditionMet ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                      <CheckCircle2 className="w-3.5 h-3.5" /> COAXIAL LOCK (Δr=0)
                    </span>
                  ) : (
                    <span className="text-amber-400 font-bold flex items-center gap-1 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                      <AlertTriangle className="w-3.5 h-3.5" /> VECTORING ACTIVE
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: TWIN VIEW (Longitudinal cutaway of the vessel and passing thread) */}
          {/* ========================================================================= */}
          {viewMode === 'twin' && (
            <div className="w-full h-full p-6 flex flex-col justify-between space-y-4 bg-slate-950">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>VESSEL CUTAWAY TWIN (LONGITUDINAL SECTION)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Alabaster cockpit position seated directly along the internal electromagnetic waveguide.
                  </p>
                </div>
                <ProvenanceBadge tag="SIMULATED" layer="MODEL_HYPOTHESIS" showLayer={true} />
              </div>

              {/* SVG Longitudinal Cutaway Diagram */}
              <div className="relative w-full max-w-[720px] mx-auto aspect-[16/8] bg-slate-900/60 rounded-xl border border-slate-800 p-3 flex items-center justify-center">
                <svg viewBox="0 0 820 320" className="w-full h-full select-none">
                  {/* Grid background */}
                  <defs>
                    <pattern id="cutawayGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="820" height="320" fill="url(#cutawayGrid)" />

                  {/* Exterior Hull Silhouette (Alabaster Composite) */}
                  <path
                    d="M 60 160 Q 120 70 240 70 L 640 70 Q 750 70 780 160 Q 750 250 640 250 L 240 250 Q 120 250 60 160 Z"
                    fill="#0f172a"
                    stroke="#e2e8f0"
                    strokeWidth="2.5"
                  />

                  {/* Internal Waveguide Tube (Center Spine) */}
                  <rect x="60" y="140" width="720" height="40" fill="#020617" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="6 3" />

                  {/* Cockpit Shell (Alabaster Pod) */}
                  <rect x="290" y="100" width="160" height="120" rx="16" fill="#1e293b" stroke="#f8fafc" strokeWidth="2" />
                  {/* Captain Seated Silhouette */}
                  <circle cx="360" cy="140" r="10" fill="#fef08a" />
                  <path d="M 350 152 Q 360 150 370 152 L 368 180 L 352 180 Z" fill="#fef08a" />
                  <rect x="340" y="165" width="40" height="25" rx="4" fill="#64748b" stroke="#94a3b8" strokeWidth="1" />
                  <text x="370" y="92" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold">
                    ALABASTER COCKPIT
                  </text>

                  {/* Forward Intake: Corridor Ingestion Aperture */}
                  <rect x="60" y="125" width="45" height="70" rx="6" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
                  <text x="82" y="215" textAnchor="middle" fill="#38bdf8" fontSize="9">
                    INGESTION
                  </text>

                  {/* Aft Coupling Rings (Field Coupling Stator Collars) */}
                  <rect x="600" y="115" width="30" height="90" rx="4" fill="#0f766e" stroke="#2dd4bf" strokeWidth="1.5" />
                  <rect x="650" y="110" width="30" height="100" rx="4" fill="#0f766e" stroke="#2dd4bf" strokeWidth="1.5" />
                  <text x="640" y="235" textAnchor="middle" fill="#2dd4bf" fontSize="9">
                    COUPLING COLLARS
                  </text>

                  {/* Active Electromagnetic Thread Passing Through Hull */}
                  {(() => {
                    const threadY = 160 + deltaY * 0.8;
                    return (
                      <g>
                        {/* Outside incoming beam */}
                        <line x1="0" y1="160" x2="60" y2="160" stroke="#06b6d4" strokeWidth="4" strokeOpacity="0.8" />
                        {/* Internal thread beam path */}
                        <path
                          d={`M 60 160 Q 240 ${threadY} 500 ${threadY} L 780 160 L 820 160`}
                          fill="none"
                          stroke={isCoaxialSymmetryConditionMet ? '#38bdf8' : '#f59e0b'}
                          strokeWidth="4"
                        />
                        {/* If delta Y is non-zero, show the shear stress zones at the aperture */}
                        {!isCoaxialSymmetryConditionMet && (
                          <g>
                            <circle cx="290" cy={threadY} r="6" fill="#ef4444" />
                            <circle cx="450" cy={threadY} r="6" fill="#ef4444" />
                            <line x1="60" y1="160" x2="780" y2="160" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
                          </g>
                        )}
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Cutaway Interpretation Footer */}
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between items-center text-slate-300 font-semibold">
                  <span>Waveguide Transit Analysis:</span>
                  <span className={isCoaxialSymmetryConditionMet ? 'text-emerald-400' : 'text-amber-400'}>
                    {isCoaxialSymmetryConditionMet
                      ? 'Coaxial Pass-Through (Thread centered on Pilot Spine)'
                      : `Deflected Waveguide Transit (|Δr| = ${deltaR_mm.toFixed(1)} mm)`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The vessel does not carry propulsion through the universe. The alabaster cockpit sits suspended directly inside the continuous electromagnetic channel, allowing the pilot to directly observe and modulate the stator coupling.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 3: FIELD VIEW (Poynting streamlines, Maxwell stress vectors)        */}
          {/* ========================================================================= */}
          {viewMode === 'field' && (
            <div className="w-full h-full p-6 flex flex-col justify-between space-y-4 bg-slate-950">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>FIELD & MAXWELL STRESS TENSOR VIEW</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Physical hull stripped away to expose Poynting power streamlines and boundary stress vectors.
                  </p>
                </div>
                <ProvenanceBadge tag="DERIVED" layer="ESTABLISHED_PHYSICS" showLayer={true} />
              </div>

              {/* Field Visualization Canvas / SVG */}
              <div className="relative w-full max-w-[720px] mx-auto aspect-[16/8] bg-slate-900/90 rounded-xl border border-slate-800 p-4 flex items-center justify-center">
                <svg viewBox="0 0 800 340" className="w-full h-full select-none">
                  {/* Poynting Streamlines (S = E x H) */}
                  {Array.from({ length: 9 }).map((_, idx) => {
                    const yBase = 70 + idx * 25;
                    const curveOffset = deltaY * 0.4 * (1 - Math.abs(idx - 4) / 4);
                    return (
                      <g key={`streamline-${idx}`}>
                        <path
                          d={`M 40 ${yBase} Q 400 ${yBase + curveOffset} 760 ${yBase}`}
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth={idx === 4 ? 3 : 1.2}
                          strokeOpacity={idx === 4 ? 0.9 : 0.4}
                          strokeDasharray={idx === 4 ? undefined : '5 4'}
                        />
                        {/* Directional arrow */}
                        <polygon
                          points={`760,${yBase} 750,${yBase - 3} 750,${yBase + 3}`}
                          fill="#38bdf8"
                          fillOpacity="0.8"
                        />
                      </g>
                    );
                  })}

                  {/* Maxwell Stress Boundary Surface Elements T · n̂ */}
                  <g>
                    <rect x="260" y="80" width="280" height="180" rx="12" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 2" />
                    <text x="400" y="72" textAnchor="middle" fill="#94a3b8" fontSize="10">
                      BOUNDARY SURFACE ∂V (∮ T · n̂ dA)
                    </text>

                    {/* Stress Vectors pointing into surface */}
                    {Array.from({ length: 6 }).map((_, idx) => {
                      const x = 290 + idx * 45;
                      const stressLen = 15 + Math.abs(deltaY) * 0.3 * (idx > 2 ? 1 : -1);
                      return (
                        <g key={`stress-top-${idx}`}>
                          <line x1={x} y1="80" x2={x} y2={80 - stressLen} stroke="#f59e0b" strokeWidth="2" />
                          <polygon points={`${x},80 ${x - 3},74 ${x + 3},74`} fill="#f59e0b" />
                        </g>
                      );
                    })}
                  </g>
                </svg>
              </div>

              {/* Stress Vector Interpretation Panel */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold mb-1">
                    SURFACE INTEGRAL FORMULATION:
                  </span>
                  <div className="font-mono text-amber-300 font-bold text-xs mb-1">
                    F_⊥ = ∮_∂V (ε₀ E(E·n̂) + μ₀ H(H·n̂) - ½(ε₀E² + μ₀H²)n̂) dA
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    When field distribution is symmetric around the central line, top and bottom stress integrals cancel identically.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold mb-1">
                    NET TRANSVERSE FORCE:
                  </span>
                  <div className="text-base font-bold text-emerald-400">
                    {isCoaxialSymmetryConditionMet ? 'F_⊥ ≈ 0.00 N (Zero Shear)' : `F_⊥ = ${(deltaR * 4.2).toFixed(1)} N (Vectoring)`}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Lateral acceleration is achieved by field asymmetry without expelling onboard chemical propellant.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 4: PROVENANCE VIEW (Governance audit ledger & derivation sources)   */}
          {/* ========================================================================= */}
          {viewMode === 'provenance' && (
            <div className="w-full h-full p-6 flex flex-col justify-between space-y-4 bg-slate-950 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span>SYSTEMS GOVERNANCE & PROVENANCE LEDGER</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Structural contract verification: every displayed quantity mapped to epistemic class and computational source.
                  </p>
                </div>
                <ProvenanceBadge tag="DERIVED" size="sm" />
              </div>

              {/* Tightened Engineering Law Callout Box */}
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                    FORMAL COAXIAL SYMMETRY THEOREM
                  </span>
                  <ProvenanceBadge epistemicClass="DERIVED" provenanceSource="DETERMINISTIC_KERNEL" showSource={true} />
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-purple-800/80 text-center font-mono text-xs sm:text-sm text-amber-300 font-bold">
                  Δr = 0 + symmetrical excitation + symmetrical boundary conditions ⇒ F_⊥ ≈ 0, τ ≈ 0
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  <strong>Engineering Rule:</strong> Δr = 0 by itself does not universally guarantee zero transverse force. Asymmetric material response, field perturbation, or boundary defects can break symmetry. Both excitation and boundary conditions must be symmetric.
                </p>
              </div>

              {/* Full Provenance Audit Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800 rounded-lg">
                  <thead className="bg-slate-900 text-[10px] text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="p-2.5 border-b border-slate-800">Telemetry Quantity</th>
                      <th className="p-2.5 border-b border-slate-800">Value</th>
                      <th className="p-2.5 border-b border-slate-800">Epistemic Class</th>
                      <th className="p-2.5 border-b border-slate-800">Source Engine</th>
                      <th className="p-2.5 border-b border-slate-800">Mathematical Basis / Derivation ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {Object.values(governedTelemetry).map(item => (
                      <tr key={item.id} className="hover:bg-slate-900/50">
                        <td className="p-2.5 text-slate-200 font-medium">{item.label}</td>
                        <td className="p-2.5 text-cyan-300 font-bold">
                          {item.formattedValue} {item.unit || ''}
                        </td>
                        <td className="p-2.5">
                          <ProvenanceBadge epistemicClass={item.epistemicClass} size="xs" />
                        </td>
                        <td className="p-2.5">
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/40 font-bold">
                            {item.provenanceSource}
                          </span>
                        </td>
                        <td className="p-2.5 text-[10px] text-slate-400 font-mono">
                          {item.derivationId}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* Right Area: Five Real-Time Operator Queries & Live Governed Cards (4 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 p-4 flex flex-col space-y-4 bg-slate-900/60 overflow-y-auto">
          {/* Header */}
          <div className="border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
              <span>FIVE REAL-TIME OPERATOR QUERIES</span>
              <span className="text-[9px] text-slate-500 font-normal">State Invariants</span>
            </h3>
          </div>

          {/* 1. Where am I? */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">1. WHERE AM I?</span>
              <ProvenanceBadge tag="HYPOTHESIS" layer="MODEL_HYPOTHESIS" size="xs" />
            </div>
            <div className="text-xs font-bold text-sky-300">
              {activeCorridor.name} (Corridor {activeCorridor.id})
            </div>
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>Position z:</span>
              <span className="text-slate-200">4.28 × 10⁶ km</span>
            </div>
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>Next Junction:</span>
              <span className="text-emerald-300 font-semibold">Lagrange-L1 Node</span>
            </div>
          </div>

          {/* 2. What mode am I in? */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">2. WHAT MODE AM I IN?</span>
              <ProvenanceBadge epistemicClass="OPERATOR_DOCTRINE" size="xs" />
            </div>
            <div className="text-xs font-bold text-amber-300">
              Stage 0{activeStage.stageIndex}: {activeStage.name}
            </div>
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>Coupling State:</span>
              <span className="text-cyan-300 font-bold">{activeStage.operationalState}</span>
            </div>
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>Recommended Action:</span>
              <span className="text-slate-200">{activeStage.action}</span>
            </div>
          </div>

          {/* 3. What is the field doing? */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">3. WHAT IS THE FIELD DOING?</span>
              <ProvenanceBadge tag="DERIVED" layer="ESTABLISHED_PHYSICS" size="xs" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <span className="text-slate-500 block">Stator Geometry:</span>
                <span className="text-slate-200 font-bold">{currentGeom.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Field Strength:</span>
                <span className="text-amber-400 font-bold">11.2 Tesla</span>
              </div>
              <div>
                <span className="text-slate-500 block">Poynting Flux:</span>
                <span className="text-cyan-400 font-bold">{engineMetrics.axialMomentumFlux.toFixed(0)} kW/m²</span>
              </div>
              <div>
                <span className="text-slate-500 block">Coherence:</span>
                <span className="text-emerald-400 font-bold">99.2%</span>
              </div>
            </div>
          </div>

          {/* 4. What is the vessel doing? */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">4. WHAT IS THE VESSEL DOING?</span>
              <ProvenanceBadge tag="SIMULATED" size="xs" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <span className="text-slate-500 block">Forward Thrust:</span>
                <span className="text-emerald-400 font-bold">{(engineMetrics.netThrustForceN / 1000).toFixed(1)} kN</span>
              </div>
              <div>
                <span className="text-slate-500 block">Steering Torque:</span>
                <span className="text-amber-400 font-bold">{engineMetrics.maxwellTorqueNm.toFixed(0)} N·m</span>
              </div>
              <div>
                <span className="text-slate-500 block">Return SWR:</span>
                <span className="text-slate-200 font-bold">{engineMetrics.standingWaveRatio.toFixed(2)}:1</span>
              </div>
              <div>
                <span className="text-slate-500 block">Thermal Loss:</span>
                <span className="text-rose-400 font-bold">{(params.sourcePower * 0.08).toFixed(0)} MW</span>
              </div>
            </div>
          </div>

          {/* 5. What evidence earned that? */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-cyan-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-cyan-400 uppercase font-bold">5. WHAT EVIDENCE EARNED THAT?</span>
              <ProvenanceBadge epistemicClass="DERIVED" provenanceSource="DETERMINISTIC_KERNEL" showSource={true} size="xs" />
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed font-mono">
              <strong>Kernel Proof:</strong> Maxwell stress surface tensor ∮ T · n̂ dA and Poynting flux S = E × H computed by deterministic solver.
            </p>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[9px] text-slate-400 space-y-1">
              <div>• Mathematical Laws: <strong>Earned by Kernel</strong></div>
              <div>• Metamaterial Z_match: <strong>Model Hypothesis</strong></div>
              <div>• Piloting Procedures: <strong>Operator Doctrine</strong></div>
            </div>
          </div>

          {/* Interactive Navigation to Workbench */}
          {onNavigateToWorkbench && (
            <button
              onClick={onNavigateToWorkbench}
              className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <span>Inspect Raw 2D Field Workbench</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          )}
        </div>
      </div>
      )}
    </div>
  );
};

export default CockpitArtefactTwinView;
