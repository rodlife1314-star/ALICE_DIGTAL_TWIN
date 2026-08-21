import React, { useState } from "react";
import {
  Activity,
  Layers,
  Zap,
  Shield,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  Info,
  Radio,
  Eye,
  SlidersHorizontal,
  Flame,
  Wind,
  ShieldAlert,
  Compass
} from "lucide-react";
import {
  SpeciesInput,
  AtmosphericFieldState,
  MembraneRegionState,
  MembraneDecisionContext,
  ActiveMembraneEvaluationResult,
  DEFAULT_ATMOSPHERIC_STATE,
  INITIAL_MEMBRANE_REGIONS,
  REFERENCE_SPECIES_LIBRARY,
  evaluateActiveMembrane
} from "../lib/activeMembraneEngine";

interface ActiveMembraneSurfaceViewProps {
  twinId?: string;
}

export function ActiveMembraneSurfaceView({ twinId }: ActiveMembraneSurfaceViewProps) {
  // Atmospheric Field State
  const [atmosphere, setAtmosphere] = useState<AtmosphericFieldState>(DEFAULT_ATMOSPHERIC_STATE);

  // Conjunctive Gate Rule Configuration
  const [maxDiameterNm, setMaxDiameterNm] = useState<number>(2.0); // 2.0 nm tight vs 12.0 nm loose
  const [allowSinglyIonized, setAllowSinglyIonized] = useState<boolean>(true); // true: >= +1e; false: > +1e
  const [minRequiredPositiveCharge, setMinRequiredPositiveCharge] = useState<number>(1.0);

  // Selected Species & Regions
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesInput>(REFERENCE_SPECIES_LIBRARY[0]);
  const [regions, setRegions] = useState<MembraneRegionState[]>(INITIAL_MEMBRANE_REGIONS);
  const [activeRegionId, setActiveRegionId] = useState<string>("REG-A");

  // Custom Species Injector inputs
  const [customHydratedRadius, setCustomHydratedRadius] = useState<number>(0.85);
  const [customCharge, setCustomCharge] = useState<number>(1.0);
  const [customFormula, setCustomFormula] = useState<string>("[K(H2O)6]+");

  // Evaluation Decision Result
  const [evaluationResult, setEvaluationResult] = useState<ActiveMembraneEvaluationResult | null>(() => {
    const context: MembraneDecisionContext = {
      mode: "selective_harvest",
      requiredSelectivityRatio: 0.95,
      maxPermittedHydratedDiameterNm: 2.0,
      minRequiredPositiveCharge: 1.0,
      allowSinglyIonized: true,
      ambientField: DEFAULT_ATMOSPHERIC_STATE,
      regions: INITIAL_MEMBRANE_REGIONS
    };
    return evaluateActiveMembrane(REFERENCE_SPECIES_LIBRARY[0], INITIAL_MEMBRANE_REGIONS[0], context);
  });

  const handleEvaluate = (speciesToTest?: SpeciesInput, targetRegionId?: string) => {
    const species = speciesToTest || selectedSpecies;
    const regionId = targetRegionId || activeRegionId;
    const currentRegion = regions.find((r) => r.regionId === regionId) || regions[0];

    const context: MembraneDecisionContext = {
      mode: "selective_harvest",
      requiredSelectivityRatio: 0.95,
      maxPermittedHydratedDiameterNm: maxDiameterNm,
      minRequiredPositiveCharge: minRequiredPositiveCharge,
      allowSinglyIonized: allowSinglyIonized,
      ambientField: atmosphere,
      regions
    };

    const res = evaluateActiveMembrane(species, currentRegion, context);
    setEvaluationResult(res);

    // Update the targeted region's dynamic state post-actuation
    setRegions((prev) =>
      prev.map((r) => {
        if (r.regionId === regionId) {
          return {
            ...r,
            activePoreDiameterNm: res.actuationCommands.targetPoreDiameterNm,
            surfaceChargeMv: res.actuationCommands.targetSurfaceChargeMv,
            transportRateFraction: res.actuationCommands.targetTransportRate,
            isSealed: res.actuationCommands.sealed,
            localSnrDb: res.snrImprovementDb
          };
        }
        return r;
      })
    );
  };

  const handleSelectPredefinedSpecies = (sp: SpeciesInput) => {
    setSelectedSpecies(sp);
    setCustomHydratedRadius(sp.hydratedRadiusNm);
    setCustomCharge(sp.chargeElementary);
    setCustomFormula(sp.chemicalFormula);
    handleEvaluate(sp, activeRegionId);
  };

  const handleApplyCustomSpecies = () => {
    const custom: SpeciesInput = {
      id: `custom-${Date.now()}`,
      name: `Custom Injected Species (${customFormula})`,
      chemicalFormula: customFormula,
      bareRadiusNm: Number((customHydratedRadius * 0.4).toFixed(3)),
      hydratedRadiusNm: customHydratedRadius,
      chargeElementary: customCharge,
      concentrationPpm: 100.0,
      velocityMs: 15.0,
      isContaminant: customHydratedRadius > 10.0
    };
    setSelectedSpecies(custom);
    handleEvaluate(custom, activeRegionId);
  };

  return (
    <div className="space-y-8 text-[#E6E4DF]">
      {/* Doctrine Banner */}
      <div className="bg-[#13151A] border border-[#2B303C] rounded-lg p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-4xl">
            <div className="flex items-center space-x-2">
              <span className="bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded tracking-wider uppercase">
                ACTIVE COGNITIVE DECISION SURFACE
              </span>
              <span className="bg-[#509EE3]/15 text-[#509EE3] border border-[#509EE3]/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                5-LAYER INTELLIGENCE
              </span>
              <span className="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                95/5 INFORMATION LAW
              </span>
            </div>
            <h2 className="text-2xl font-light text-[#E6E4DF] tracking-tight">
              Adaptive Ion-Selective Permeability & Boundary Interpretation
            </h2>
            <p className="text-xs text-[#A0A4AB] leading-relaxed">
              A passive membrane asks: <em>"Does this particle satisfy my fixed rule?"</em> An intelligent membrane asks:
              <em> "What is approaching? What state am I in? What permeability profile should I adopt?"</em>
              Translates the conjunctive size–charge gate into responsive physical pore tuning, surface electrostatic deflection, and localized spatial actuation across 5 distributed regions.
            </p>
          </div>

          <div className="bg-[#181A20] border border-[#2A2E39] rounded-lg p-4 font-mono text-xs text-right shrink-0 lg:max-w-xs space-y-1.5">
            <span className="text-[10px] text-[#C5A059] font-bold block uppercase tracking-wider">
              DYNAMIC UPDATE LAW
            </span>
            <p className="text-[11px] text-[#8A8F9A] italic">
              M(t+1) = f(M(t), A(t), SNR(t), G)
            </p>
            <span className="text-[9px] text-[#737885] block">
              95% Physics & Atmospheric Field • 5% Cognitive Intervention
            </span>
          </div>
        </div>
      </div>

      {/* 5-Layer Cognitive Architecture Visualizer */}
      <div className="bg-[#13151A] border border-[#22262F] rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#22262F]">
          <span className="text-xs font-mono font-bold text-[#E6E4DF] uppercase flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#509EE3]" />
            <span>5-Layer Active Membrane Intelligence Stack</span>
          </span>
          <span className="text-[10px] font-mono text-[#8A8F9A]">Closed-Loop Sensing to Actuation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
          {/* Layer 1: Sense */}
          <div className="bg-[#181A20] p-3.5 rounded border border-[#2B303C] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[#C5A059] font-bold text-[11px]">1. SENSE</span>
              <Activity className="w-3.5 h-3.5 text-[#C5A059]" />
            </div>
            <span className="text-[10px] text-[#8A8F9A] block">Multi-channel sensing:</span>
            <p className="text-[#E6E4DF] text-[11px]">
              Hydrated diameter (d_eff), charge state (+1e, +2e), local temp, pressure.
            </p>
          </div>

          {/* Layer 2: Interpret */}
          <div className="bg-[#181A20] p-3.5 rounded border border-[#2B303C] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[#509EE3] font-bold text-[11px]">2. INTERPRET</span>
              <Radio className="w-3.5 h-3.5 text-[#509EE3]" />
            </div>
            <span className="text-[10px] text-[#8A8F9A] block">signalToNoise():</span>
            <p className="text-[#E6E4DF] text-[11px]">
              Extracts chemical signature from ambient static and evaluates drift.
            </p>
          </div>

          {/* Layer 3: Decide */}
          <div className="bg-[#181A20] p-3.5 rounded border border-[#2B303C] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[#4ADE80] font-bold text-[11px]">3. DECIDE</span>
              <Sliders className="w-3.5 h-3.5 text-[#4ADE80]" />
            </div>
            <span className="text-[10px] text-[#8A8F9A] block">Contextual Routing:</span>
            <p className="text-[#E6E4DF] text-[11px]">
              PERMIT · REJECT · ATTENUATE · HOLD · STOP under invariant constraints.
            </p>
          </div>

          {/* Layer 4: Actuate */}
          <div className="bg-[#181A20] p-3.5 rounded border border-[#2B303C] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[#EAB308] font-bold text-[11px]">4. ACTUATE</span>
              <Zap className="w-3.5 h-3.5 text-[#EAB308]" />
            </div>
            <span className="text-[10px] text-[#8A8F9A] block">Dynamic Responsive Physics:</span>
            <p className="text-[#E6E4DF] text-[11px]">
              Electro-responsive pore dilation, surface potential tuning (±150mV), affinity inversion.
            </p>
          </div>

          {/* Layer 5: Learn */}
          <div className="bg-[#181A20] p-3.5 rounded border border-[#2B303C] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[#C084FC] font-bold text-[11px]">5. LEARN</span>
              <RotateCcw className="w-3.5 h-3.5 text-[#C084FC]" />
            </div>
            <span className="text-[10px] text-[#8A8F9A] block">Closed-Loop Verification:</span>
            <p className="text-[#E6E4DF] text-[11px]">
              Measures post-actuation SNR outcome delta; preserves memory without weakening invariants.
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Work Area: Atmospheric Field, Conjunctive Rule & Species Ingestion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Atmospheric Field & Conjunctive Gate Setup (5 cols) */}
        <div className="lg:col-span-5 bg-[#13151A] border border-[#22262F] rounded-lg p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#22262F]">
            <span className="text-xs font-mono font-bold text-[#E6E4DF] uppercase flex items-center space-x-2">
              <Wind className="w-4 h-4 text-[#509EE3]" />
              <span>Atmospheric Field & Conjunctive Rule</span>
            </span>
            <span className="text-[10px] font-mono text-[#8A8F9A]">Environmental Tuning</span>
          </div>

          {/* Conjunctive Rule Gate Selector */}
          <div className="space-y-3 font-mono text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-[#8A8F9A]">
                <span>SIZE THRESHOLD (d_effective)</span>
                <span className="text-[#C5A059] font-bold">{maxDiameterNm.toFixed(1)} nm</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMaxDiameterNm(2.0);
                    handleEvaluate();
                  }}
                  className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                    maxDiameterNm === 2.0
                      ? "bg-[#1E2E22] border-[#2D5A38] text-[#4ADE80] font-bold"
                      : "bg-[#181A20] border-[#2B303C] text-[#8A8F9A]"
                  }`}
                >
                  Tight Ion Gate (&lt; 2.0 nm)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMaxDiameterNm(12.0);
                    handleEvaluate();
                  }}
                  className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                    maxDiameterNm === 12.0
                      ? "bg-[#1E2E22] border-[#2D5A38] text-[#4ADE80] font-bold"
                      : "bg-[#181A20] border-[#2B303C] text-[#8A8F9A]"
                  }`}
                >
                  Loose Window (&lt; 12.0 nm)
                </button>
              </div>
            </div>

            {/* Charge Logic Gate: >= +1e vs > +1e */}
            <div className="space-y-1 pt-2 border-t border-[#22262F]">
              <div className="flex justify-between text-[#8A8F9A]">
                <span>CHARGE GATE LOGIC ($q$)</span>
                <span className="text-[#509EE3] font-bold">
                  {allowSinglyIonized ? "charge >= +1e" : "charge > +1e (Strict Multivalent)"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAllowSinglyIonized(true);
                    setMinRequiredPositiveCharge(1.0);
                    handleEvaluate();
                  }}
                  className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                    allowSinglyIonized
                      ? "bg-[#172338] border-[#38BDF8] text-[#38BDF8] font-bold"
                      : "bg-[#181A20] border-[#2B303C] text-[#8A8F9A]"
                  }`}
                >
                  Admits Singly Ionized (q &ge; +1e)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAllowSinglyIonized(false);
                    setMinRequiredPositiveCharge(1.0);
                    handleEvaluate();
                  }}
                  className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                    !allowSinglyIonized
                      ? "bg-[#172338] border-[#38BDF8] text-[#38BDF8] font-bold"
                      : "bg-[#181A20] border-[#2B303C] text-[#8A8F9A]"
                  }`}
                >
                  Excludes +1e (q &gt; +1e only)
                </button>
              </div>
            </div>
          </div>

          {/* Atmospheric Field Ionization Controls */}
          <div className="space-y-3 pt-3 border-t border-[#22262F] font-mono text-xs">
            <span className="text-[10px] text-[#8A8F9A] uppercase font-bold block">Atmospheric Field Parameters:</span>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[#8A8F9A]">
                <span>IONIZATION POTENTIAL</span>
                <span className="text-[#E6E4DF] font-bold">{atmosphere.ionizationPotentialKvCm.toFixed(1)} kV/cm</span>
              </div>
              <input
                type="range"
                min={0.0}
                max={15.0}
                step={0.5}
                value={atmosphere.ionizationPotentialKvCm}
                onChange={(e) => setAtmosphere({ ...atmosphere, ionizationPotentialKvCm: Number(e.target.value) })}
                className="w-full accent-[#509EE3] cursor-pointer"
              />
              <span className="text-[10px] text-[#737885] block">
                Fields &gt; 3.5 kV/cm induce charge separation in incoming neutral clusters
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-[#181A20] p-2.5 rounded border border-[#2B303C]">
                <span className="text-[9px] text-[#8A8F9A] block">TEMPERATURE</span>
                <span className="text-[#E6E4DF] font-bold text-xs">{atmosphere.ambientTempC}&deg;C</span>
              </div>
              <div className="bg-[#181A20] p-2.5 rounded border border-[#2B303C]">
                <span className="text-[9px] text-[#8A8F9A] block">REL. HUMIDITY</span>
                <span className="text-[#509EE3] font-bold text-xs">{atmosphere.relativeHumidityPercent}% (Solvation)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Species Ingestion & Real-Time Decision Result (7 cols) */}
        <div className="lg:col-span-7 bg-[#13151A] border border-[#22262F] rounded-lg p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#22262F]">
              <span className="text-xs font-mono font-bold text-[#E6E4DF] uppercase flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>Species Ingestion & Adaptive Decision</span>
              </span>
              {evaluationResult && (
                <span
                  className={`text-xs font-mono px-3 py-1 rounded font-bold border ${
                    evaluationResult.action === "STOP"
                      ? "bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444] animate-pulse"
                      : evaluationResult.action === "PERMIT"
                      ? "bg-[#10B981]/20 border-[#10B981] text-[#10B981]"
                      : evaluationResult.action === "ATTENUATE"
                      ? "bg-[#3B82F6]/20 border-[#3B82F6] text-[#509EE3]"
                      : evaluationResult.action === "HOLD"
                      ? "bg-[#EAB308]/20 border-[#EAB308] text-[#EAB308]"
                      : "bg-[#737885]/20 border-[#737885] text-[#8A8F9A]"
                  }`}
                >
                  ROUTE: {evaluationResult.action}
                </span>
              )}
            </div>

            {/* Predefined Species Library */}
            <div className="space-y-1.5 font-mono text-xs">
              <span className="text-[10px] text-[#8A8F9A] uppercase font-bold">Select Ingested Species:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {REFERENCE_SPECIES_LIBRARY.map((sp) => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => handleSelectPredefinedSpecies(sp)}
                    className={`p-2 rounded border text-left text-[11px] transition-colors cursor-pointer space-y-0.5 ${
                      selectedSpecies.id === sp.id
                        ? "bg-[#1A2536] border-[#509EE3] text-[#509EE3]"
                        : "bg-[#181A20] border-[#2B303C] text-[#8A8F9A] hover:text-[#E6E4DF]"
                    }`}
                  >
                    <div className="font-bold truncate">{sp.chemicalFormula}</div>
                    <div className="text-[9px] text-[#737885]">
                      d={sp.hydratedRadiusNm}nm | q={sp.chargeElementary > 0 ? `+${sp.chargeElementary}e` : `${sp.chargeElementary}e`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Evaluation Rationale */}
            {evaluationResult && (
              <div className="bg-[#181A20] border border-[#2A2E39] rounded-lg p-4 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#8A8F9A] uppercase font-bold">COGNITIVE ROUTING RATIONALE</span>
                  <span className="text-[10px] text-[#509EE3]">Target Region: {evaluationResult.regionId}</span>
                </div>
                <p className="text-[#E6E4DF] leading-relaxed text-xs">{evaluationResult.decisionRationale}</p>
              </div>
            )}

            {/* Actuation Commands Triggered on Membrane Substrate */}
            {evaluationResult && (
              <div className="bg-[#0D0E11] border border-[#22252D] rounded-lg p-4 font-mono text-xs space-y-3">
                <span className="text-[10px] text-[#C5A059] uppercase font-bold block">
                  PHYSICAL ACTUATION INSTRUCTIONS (4. ACTUATE)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="bg-[#14161C] p-2 rounded border border-[#22262F]">
                    <span className="text-[9px] text-[#8A8F9A] block">PORE DILATION</span>
                    <span className="text-[#4ADE80] font-bold">
                      {evaluationResult.actuationCommands.targetPoreDiameterNm.toFixed(2)} nm
                    </span>
                  </div>
                  <div className="bg-[#14161C] p-2 rounded border border-[#22262F]">
                    <span className="text-[9px] text-[#8A8F9A] block">SURFACE POTENTIAL</span>
                    <span className="text-[#509EE3] font-bold">
                      {evaluationResult.actuationCommands.targetSurfaceChargeMv > 0 ? "+" : ""}
                      {evaluationResult.actuationCommands.targetSurfaceChargeMv.toFixed(0)} mV
                    </span>
                  </div>
                  <div className="bg-[#14161C] p-2 rounded border border-[#22262F]">
                    <span className="text-[9px] text-[#8A8F9A] block">FLUX RATE</span>
                    <span className="text-[#EAB308] font-bold">
                      {(evaluationResult.actuationCommands.targetTransportRate * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="bg-[#14161C] p-2 rounded border border-[#22262F]">
                    <span className="text-[9px] text-[#8A8F9A] block">AFFINITY STATE</span>
                    <span className="text-[#C084FC] font-bold uppercase text-[10px]">
                      {evaluationResult.actuationCommands.affinityState}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-[#8A8F9A] pt-4 border-t border-[#22262F]">
            <span>Information Balance: <strong className="text-[#509EE3]">95% Material/Field</strong> + <strong className="text-[#4ADE80]">5% Cognition</strong></span>
            <button
              type="button"
              onClick={() => handleEvaluate()}
              className="bg-[#509EE3] hover:bg-[#3B82F6] text-[#0D0E11] px-4 py-2 rounded font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Re-Evaluate Active Membrane</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Distributed Spatial Regions Grid (Local Intelligence Surface) */}
      <div className="bg-[#13151A] border border-[#22262F] rounded-lg p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#22262F] gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#8A8F9A] font-bold tracking-wider">
                DISTRIBUTED SPATIAL INTELLIGENCE
              </span>
              <h3 className="text-base font-semibold text-[#E6E4DF]">
                5-Region Local Membrane Microstate Matrix
              </h3>
            </div>
          </div>

          <div className="bg-[#181A20] px-3 py-1.5 rounded border border-[#2B303C] font-mono text-xs flex items-center space-x-2">
            <span className="text-[#8A8F9A]">ACTIVE SURFACE:</span>
            <span className="text-[#4ADE80] font-bold">5/5 REGIONS ENGAGED</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 font-mono text-xs">
          {regions.map((reg) => (
            <div
              key={reg.regionId}
              onClick={() => {
                setActiveRegionId(reg.regionId);
                handleEvaluate(selectedSpecies, reg.regionId);
              }}
              className={`p-4 rounded-lg border transition-all cursor-pointer space-y-3 ${
                activeRegionId === reg.regionId
                  ? "bg-[#17202E] border-[#509EE3] shadow-md shadow-[#509EE3]/10"
                  : "bg-[#181A20] border-[#262B35] hover:border-[#3A404F]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[#C5A059] font-bold text-xs">{reg.regionId}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                    reg.isSealed
                      ? "bg-[#EF4444]/20 text-[#EF4444]"
                      : reg.transportRateFraction > 0.5
                      ? "bg-[#10B981]/20 text-[#10B981]"
                      : "bg-[#3B82F6]/20 text-[#509EE3]"
                  }`}
                >
                  {reg.isSealed ? "SEALED" : `${(reg.transportRateFraction * 100).toFixed(0)}% FLUX`}
                </span>
              </div>

              <div className="text-[11px] font-medium text-[#E6E4DF] leading-tight">
                {reg.name.replace(/Region [A-E]: /, "")}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#262A34] text-[10px] text-[#8A8F9A]">
                <div className="flex justify-between">
                  <span>Pore Diameter:</span>
                  <span className="text-[#E6E4DF] font-bold">{reg.activePoreDiameterNm.toFixed(1)} nm</span>
                </div>
                <div className="flex justify-between">
                  <span>Surface Charge:</span>
                  <span className="text-[#509EE3] font-bold">
                    {reg.surfaceChargeMv > 0 ? "+" : ""}{reg.surfaceChargeMv.toFixed(0)} mV
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Local SNR:</span>
                  <span className="text-[#4ADE80] font-bold">{reg.localSnrDb.toFixed(1)} dB</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
