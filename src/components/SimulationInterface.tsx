import React, { useState, useMemo } from "react";
import {
  Compass,
  Calculator,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Play,
  Layers,
  ArrowRight,
  Sliders,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Lock,
  FileCheck
} from "lucide-react";
import { SimulationBaselineState, SimulationPerturbation, SimulationRun } from "../types";
import {
  computeDeterministicMetonicKinematics,
  validateKinematicInputs,
  MetonicKinematicVerificationResult
} from "../lib/deterministicKinematics";

export interface SimulationInterfaceProps {
  baselineState?: SimulationBaselineState | string;
  perturbation?: SimulationPerturbation | string;
  onRunSimulation?: (result: {
    baseline: SimulationBaselineState;
    perturbation: SimulationPerturbation;
    verification: MetonicKinematicVerificationResult;
  }) => void;
  onCommitToLedger?: (record: any) => void;
  title?: string;
  subtitle?: string;
  isCompact?: boolean;
}

export function SimulationInterface({
  baselineState = {
    name: "Initial Baseline State",
    description: "Nominal 235 synodic months / 19 tropical years Metonic transmission baseline",
    nominalTeeth: 38,
    targetRatio: "235 / 19 (12.3684 rev/yr)",
    moduleMm: 0.5,
    centerDistanceMm: 19.0
  },
  perturbation = {
    targetGear: "Metonic Transmission Driven Gear (b2/c1 mesh)",
    nominalTeeth: 38,
    perturbedTeeth: 39,
    toothDelta: 1,
    moduleMm: 0.5,
    centerDistanceMm: 19.0,
    targetRelationship: "235 synodic months / 19 tropical years",
    description: "Perturb effective tooth count of one gear in the Metonic transmission by +1 tooth equivalent while holding all other reconstructed ratios constant.",
    assumptions: [
      "235 synodic months / 19 tropical years is the target encoded relationship.",
      "All non-perturbed gear ratios remain fixed.",
      "Manufacturing error, friction and backlash are excluded from this computational test.",
      "Only kinematic information transfer is being evaluated.",
      "No result may modify the archaeological evidence state."
    ]
  },
  onRunSimulation,
  onCommitToLedger,
  title = "Counterfactual Simulation Interface",
  subtitle = "Evaluate model perturbations against nominal baseline equilibrium under strict epistemic isolation",
  isCompact = false
}: SimulationInterfaceProps) {
  // Normalize input baseline
  const normalizedBaseline: SimulationBaselineState = useMemo(() => {
    if (typeof baselineState === "string") {
      return {
        name: baselineState,
        description: "Standard nominal baseline state",
        nominalTeeth: 38,
        targetRatio: "235 / 19",
        moduleMm: 0.5,
        centerDistanceMm: 19.0
      };
    }
    return {
      name: baselineState.name || "Initial Baseline State",
      description: baselineState.description || "Nominal Metonic baseline",
      nominalTeeth: baselineState.nominalTeeth ?? 38,
      targetRatio: baselineState.targetRatio || "235 / 19 (12.3684)",
      moduleMm: baselineState.moduleMm ?? 0.5,
      centerDistanceMm: baselineState.centerDistanceMm ?? 19.0,
      ...baselineState
    };
  }, [baselineState]);

  // Normalize input perturbation
  const initialPerturbation: SimulationPerturbation = useMemo(() => {
    if (typeof perturbation === "string") {
      return {
        targetGear: "Metonic Transmission Gear",
        nominalTeeth: 38,
        perturbedTeeth: 39,
        toothDelta: 1,
        moduleMm: 0.5,
        centerDistanceMm: 19.0,
        description: perturbation,
        assumptions: [
          "Preserve all non-perturbed ratios",
          "Fixed-centre arbor geometry",
          "Kinematic transfer test only"
        ]
      };
    }
    return {
      targetGear: perturbation.targetGear || "Metonic Transmission Driven Gear",
      nominalTeeth: perturbation.nominalTeeth ?? 38,
      perturbedTeeth: perturbation.perturbedTeeth ?? 39,
      toothDelta: (perturbation.perturbedTeeth ?? 39) - (perturbation.nominalTeeth ?? 38),
      moduleMm: perturbation.moduleMm ?? 0.5,
      centerDistanceMm: perturbation.centerDistanceMm ?? 19.0,
      targetRelationship: perturbation.targetRelationship || "235 synodic months / 19 tropical years",
      description: perturbation.description || "Perturb effective tooth count by +1 tooth",
      assumptions: perturbation.assumptions || [
        "235 synodic months / 19 tropical years is the target encoded relationship.",
        "All non-perturbed gear ratios remain fixed.",
        "Kinematic information transfer is being evaluated.",
        "No result may modify the archaeological evidence state."
      ],
      ...perturbation
    };
  }, [perturbation]);

  // Interactive parameter state
  const [nominalTeeth, setNominalTeeth] = useState<number>(initialPerturbation.nominalTeeth ?? 38);
  const [perturbedTeeth, setPerturbedTeeth] = useState<number>(initialPerturbation.perturbedTeeth ?? 39);
  const [moduleMm, setModuleMm] = useState<number>(initialPerturbation.moduleMm ?? 0.5);
  const [targetRelationship, setTargetRelationship] = useState<string>(
    initialPerturbation.targetRelationship || "235 synodic months / 19 tropical years"
  );
  const [showAssumptions, setShowAssumptions] = useState<boolean>(true);

  // Duplicate submission guards & execution status
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isAdmitting, setIsAdmitting] = useState<boolean>(false);
  const [showLedgerConfirmModal, setShowLedgerConfirmModal] = useState<boolean>(false);
  const [operatorConfirmedAdmission, setOperatorConfirmedAdmission] = useState<boolean>(false);

  // Parameter validation
  const validation = useMemo(() => {
    return validateKinematicInputs(nominalTeeth, perturbedTeeth, moduleMm);
  }, [nominalTeeth, perturbedTeeth, moduleMm]);

  // Compute live deterministic kinematics safely
  const verification: MetonicKinematicVerificationResult | null = useMemo(() => {
    if (!validation.isValid) return null;
    try {
      return computeDeterministicMetonicKinematics(nominalTeeth, perturbedTeeth, moduleMm);
    } catch {
      return null;
    }
  }, [nominalTeeth, perturbedTeeth, moduleMm, validation.isValid]);

  const handleExecute = () => {
    if (!validation.isValid || !verification || isRecording) return;
    setIsRecording(true);
    try {
      if (onRunSimulation) {
        onRunSimulation({
          baseline: normalizedBaseline,
          perturbation: {
            ...initialPerturbation,
            nominalTeeth,
            perturbedTeeth,
            toothDelta: perturbedTeeth - nominalTeeth,
            moduleMm,
            targetRelationship
          },
          verification
        });
      }
    } finally {
      setTimeout(() => setIsRecording(false), 600);
    }
  };

  const handleOpenLedgerModal = () => {
    if (!validation.isValid || !verification || isAdmitting) return;
    setOperatorConfirmedAdmission(false);
    setShowLedgerConfirmModal(true);
  };

  const handleConfirmLedgerCommit = () => {
    if (!verification || !operatorConfirmedAdmission || isAdmitting) return;
    setIsAdmitting(true);
    try {
      if (onCommitToLedger) {
        onCommitToLedger(verification);
      }
      setShowLedgerConfirmModal(false);
    } finally {
      setTimeout(() => setIsAdmitting(false), 600);
    }
  };

  const handleResetToNominal = () => {
    setNominalTeeth(38);
    setPerturbedTeeth(38);
    setModuleMm(0.5);
  };

  const handleSetAblationPlusOne = () => {
    setNominalTeeth(38);
    setPerturbedTeeth(39);
    setModuleMm(0.5);
  };

  return (
    <div className="bg-[#0F1117] border border-[#222736] rounded-lg p-5 sm:p-6 space-y-6 text-[#E6E4DF] shadow-2xl relative">
      {/* Header & Epistemic Boundary Alert */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#1E2330] pb-4 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-[#C5A059]" />
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#C5A059]">
              SIMULATION INTERFACE · EPISTEMIC EXPERIMENT PIPELINE
            </span>
          </div>
          <h2 className="text-xl font-light text-[#E6E4DF] tracking-tight mt-0.5">
            {title}
          </h2>
          <p className="text-xs text-[#8A8F9A] mt-0.5 max-w-2xl">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#17231A] text-[#4ADE80] border border-[#274E35]">
            Deterministic Kinematic Substrate
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C202C] text-[#93C5FD] border border-[#2E3547]">
            Doctrine 8: Simulation ≠ Observation
          </span>
        </div>
      </div>

      {/* Grid: Baseline vs Perturbation Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Baseline State Card */}
        <div className="bg-[#131722] border border-[#202738] rounded-md p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#1D2433] pb-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#93C5FD] font-semibold flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>1. Baseline State (Frozen Reference)</span>
            </span>
            <span className="text-[10px] font-mono text-[#737885]">Nominal P(t) / C(t)</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="font-medium text-[#E6E4DF]">{normalizedBaseline.name}</div>
            <p className="text-[#8A8F9A] text-[11px] leading-relaxed">
              {normalizedBaseline.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px] font-mono">
            <div className="bg-[#0C0E14] border border-[#191F2D] p-2 rounded">
              <span className="text-[9px] text-[#737885] uppercase block">Nominal Teeth</span>
              <span className="text-[#93C5FD] font-bold">{nominalTeeth} T</span>
            </div>
            <div className="bg-[#0C0E14] border border-[#191F2D] p-2 rounded">
              <span className="text-[9px] text-[#737885] uppercase block">Target Ratio</span>
              <span className="text-[#E6E4DF] font-bold">235 / 19</span>
            </div>
            <div className="bg-[#0C0E14] border border-[#191F2D] p-2 rounded col-span-2 sm:col-span-1">
              <span className="text-[9px] text-[#737885] uppercase block">Module / Center</span>
              <span className="text-[#E6E4DF]">{moduleMm} mm / 19.0 mm</span>
            </div>
          </div>
        </div>

        {/* Perturbation Configuration Card */}
        <div className="bg-[#171A24] border border-[#282F42] rounded-md p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#242A3B] pb-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#C5A059] font-semibold flex items-center space-x-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>2. Perturbation Object (Counterfactual Intervention)</span>
            </span>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handleSetAblationPlusOne}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#242B3A] text-[#C5A059] hover:bg-[#2F374B] transition-colors cursor-pointer"
              >
                +1 Tooth
              </button>
              <button
                type="button"
                onClick={handleResetToNominal}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1D222F] text-[#8A8F9A] hover:bg-[#282F40] transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[9px] uppercase font-mono text-[#8A8F9A] mb-1">
                Nominal (N_nom)
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                step="1"
                value={nominalTeeth ?? 127}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setNominalTeeth(isNaN(val) ? 127 : val);
                }}
                className="w-full bg-[#0D1017] border border-[#2D364A] text-xs font-mono text-[#E6E4DF] p-2 rounded focus:outline-none focus:border-[#C5A059]"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase font-mono text-[#C5A059] mb-1 font-semibold">
                Perturbed (N')
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                step="1"
                value={perturbedTeeth ?? 128}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setPerturbedTeeth(isNaN(val) ? 128 : val);
                }}
                className="w-full bg-[#0D1017] border border-[#C5A059] text-xs font-mono text-[#C5A059] p-2 rounded focus:outline-none focus:border-[#D4AF37] font-bold"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase font-mono text-[#8A8F9A] mb-1">
                Module m (mm)
              </label>
              <input
                type="number"
                min="0.01"
                max="20"
                step="0.05"
                value={moduleMm ?? 0.5}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setModuleMm(isNaN(val) ? 0.5 : val);
                }}
                className="w-full bg-[#0D1017] border border-[#2D364A] text-xs font-mono text-[#E6E4DF] p-2 rounded focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          {/* Inline Validation Warnings */}
          {!validation.isValid && (
            <div className="bg-[#241315] border border-[#4D2024] p-2.5 rounded text-xs space-y-1">
              <div className="flex items-center space-x-1.5 text-[#EF4444] font-mono text-[10px] font-bold uppercase">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Parameter Integrity Violation</span>
              </div>
              <ul className="text-[10px] text-[#FCA5A5] font-mono list-disc list-inside space-y-0.5">
                {validation.errors.map((err, idx) => (
                  <li key={idx}>{err.message}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-[11px] text-[#A0A4AB] leading-snug">
            {initialPerturbation.description}
          </p>
        </div>
      </div>

      {/* Assumptions Accordion */}
      <div className="bg-[#11141D] border border-[#1E2433] rounded-md p-3">
        <button
          type="button"
          onClick={() => setShowAssumptions(!showAssumptions)}
          className="w-full flex items-center justify-between text-xs font-mono text-[#8A8F9A] hover:text-[#E6E4DF] cursor-pointer"
        >
          <span className="flex items-center space-x-2">
            <Info className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="uppercase text-[10px] font-bold tracking-wider">
              Stated Experimental Assumptions ({initialPerturbation.assumptions?.length || 5})
            </span>
          </span>
          {showAssumptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAssumptions && (
          <ul className="mt-2.5 pt-2 border-t border-[#1C2230] space-y-1 text-xs text-[#A0A4AB] list-disc list-inside font-mono text-[11px]">
            {initialPerturbation.assumptions?.map((asm, i) => (
              <li key={i}>{asm}</li>
            ))}
          </ul>
        )}
      </div>

      {/* ─── COUNTERFACTUAL MODEL DIVERGENCE RESULTS PANEL ─── */}
      {verification ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#262D3E] pb-2 gap-2">
            <div className="flex items-center space-x-2">
              <Calculator className="w-4 h-4 text-[#4ADE80]" />
              <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#4ADE80]">
                COUNTERFACTUAL MODEL DIVERGENCE RESULTS
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#8A8F9A]">
              Deterministic Audit Checksum: <strong className="text-[#4ADE80]">{verification.auditHash}</strong>
            </span>
          </div>

          {/* 4-Stat Metric Matrix: Ratio Shift, Angular Drift, Calendar Phase, Interference Flags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Ratio Shift */}
            <div className="bg-[#121620] border border-[#212B3E] p-4 rounded-md space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-[#93C5FD] block font-semibold">
                1. Kinematic Ratio Shift
              </span>
              <div className="flex items-baseline space-x-2">
                <span className={`text-2xl font-mono font-bold ${
                  verification.ratioDeviationPercent !== 0 ? "text-[#F59E0B]" : "text-[#4ADE80]"
                }`}>
                  {verification.ratioDeviationPercent >= 0 ? "+" : ""}
                  {verification.ratioDeviationPercent.toFixed(2)}%
                </span>
                <span className="text-[10px] text-[#737885] font-mono">
                  ({verification.toothDelta >= 0 ? "+" : ""}{verification.toothDelta} tooth)
                </span>
              </div>
              <div className="text-[10px] text-[#8A8F9A] font-mono border-t border-[#1C2433] pt-1">
                Departure: ΔR / R = ({verification.toothDelta} / {verification.nominalTeeth})
              </div>
            </div>

            {/* 2. Angular Drift */}
            <div className="bg-[#121620] border border-[#212B3E] p-4 rounded-md space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-[#F59E0B] block font-semibold">
                2. Dial Angular Drift
              </span>
              <div className="flex items-baseline space-x-2">
                <span className={`text-2xl font-mono font-bold ${
                  verification.spiralDialAngleDriftDeg !== 0 ? "text-[#F59E0B]" : "text-[#4ADE80]"
                }`}>
                  {verification.spiralDialAngleDriftDeg.toFixed(2)}°
                </span>
                <span className="text-[10px] text-[#737885] font-mono">
                  across 1800°
                </span>
              </div>
              <div className="text-[10px] text-[#8A8F9A] font-mono border-t border-[#1C2433] pt-1">
                Pointer drift across 5-turn Metonic spiral
              </div>
            </div>

            {/* 3. Calendar Phase Drift */}
            <div className="bg-[#121620] border border-[#212B3E] p-4 rounded-md space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-[#E879F9] block font-semibold">
                3. Ephemeris Calendar Phase
              </span>
              <div className="flex items-baseline space-x-2">
                <span className={`text-2xl font-mono font-bold ${
                  verification.synodicMonthPhaseDrift !== 0 ? "text-[#E879F9]" : "text-[#4ADE80]"
                }`}>
                  {verification.synodicMonthPhaseDrift.toFixed(2)} mo
                </span>
                <span className="text-[10px] text-[#737885] font-mono">
                  ({verification.calendarDayPhaseDrift.toFixed(1)} d)
                </span>
              </div>
              <div className="text-[10px] text-[#8A8F9A] font-mono border-t border-[#1C2433] pt-1">
                Cumulative error over one 19-year cycle
              </div>
            </div>

            {/* 4. Mechanical Interference Flags */}
            <div className="bg-[#121620] border border-[#212B3E] p-4 rounded-md space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-[#EF4444] block font-semibold flex items-center justify-between">
                <span>4. Interference Flags</span>
                {verification.isMechanicallyInterfering ? (
                  <span className="text-[9px] font-bold text-[#EF4444] bg-[#2E1515] px-1.5 py-0.2 rounded border border-[#522222]">
                    CLASH DETECTED
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-[#4ADE80] bg-[#142A1D] px-1.5 py-0.2 rounded border border-[#245037]">
                    MESH CLEAR
                  </span>
                )}
              </span>
              <div className="flex items-baseline space-x-2">
                <span className={`text-2xl font-mono font-bold ${
                  verification.isMechanicallyInterfering ? "text-[#EF4444]" : "text-[#4ADE80]"
                }`}>
                  +{verification.centerDistanceDeltaMm.toFixed(2)} mm
                </span>
                <span className="text-[10px] text-[#737885] font-mono">
                  (+{verification.moduleInterferenceRatio.toFixed(1)}m)
                </span>
              </div>
              <div className="text-[10px] text-[#8A8F9A] font-mono border-t border-[#1C2433] pt-1">
                {verification.isMechanicallyInterfering
                  ? "Exceeds fixed-arbor tolerance (0.05 mm)"
                  : "Within nominal center distance"}
              </div>
            </div>
          </div>

          {/* Epistemic Conclusion Banner */}
          <div className={`p-4 rounded-md border space-y-2.5 ${
            verification.epistemicVerdict === "CANDIDATE_BINDING_MUST"
              ? "bg-[#181F19] border-[#294B34]"
              : "bg-[#131822] border-[#222F45]"
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#233C2C] pb-2">
              <div className="flex items-center space-x-2 text-xs font-mono">
                <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
                <span className="font-bold text-[#4ADE80] uppercase">
                  Epistemic Classification: {verification.epistemicVerdict}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#C5A059] bg-[#221F14] px-2 py-0.5 rounded border border-[#3E341E]">
                O → K; K - req → failure
              </span>
            </div>

            <p className="text-xs text-[#E6E4DF] leading-relaxed font-mono">
              "{verification.epistemicFormulation}"
            </p>

            <div className="text-[11px] text-[#8A8F9A] pt-1 flex items-center justify-between">
              <span>
                <strong>Epistemic Boundary Statement:</strong> Does not assert historical proof of {nominalTeeth} teeth; establishes that under stated fixed-centre assumptions, the nominal ratio is a <em>candidate binding MUST constraint</em>.
              </span>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-3">
            <div className="text-xs font-mono text-[#737885] flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Ready for Orion Ablation & Jemma Provenance Verification</span>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              {onCommitToLedger && (
                <button
                  type="button"
                  disabled={!validation.isValid || isAdmitting}
                  onClick={handleOpenLedgerModal}
                  className="flex-1 sm:flex-none px-4 py-2 rounded bg-[#17231A] hover:bg-[#1E3324] border border-[#2A5237] text-[#4ADE80] text-xs font-semibold font-mono transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Admit to Jemma Ledger</span>
                </button>
              )}
              <button
                type="button"
                disabled={!validation.isValid || isRecording}
                onClick={handleExecute}
                className="flex-1 sm:flex-none px-5 py-2 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-[#0D0E11] text-xs font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Play className={`w-3.5 h-3.5 fill-current ${isRecording ? "animate-pulse" : ""}`} />
                <span>{isRecording ? "Recording Run..." : "Record Counterfactual Experiment Run"}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#161214] border border-[#3E2024] p-6 rounded-md text-center space-y-2">
          <AlertTriangle className="w-6 h-6 text-[#EF4444] mx-auto" />
          <h3 className="text-sm font-mono font-bold text-[#EF4444]">
            SIMULATION CALCULATION BLOCKED
          </h3>
          <p className="text-xs text-[#8A8F9A] max-w-md mx-auto font-mono">
            Deterministic kinematic recomputation halted. All parameters must be positive finite values (Doctrine 8 & Compute Integrity Law).
          </p>
        </div>
      )}

      {/* ─── MANDATORY OPERATOR CONFIRMATION MODAL (JEMMA LEDGER ADMISSION) ─── */}
      {showLedgerConfirmModal && verification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#111319] border-2 border-[#C5A059] rounded-lg max-w-xl w-full p-6 space-y-5 text-[#E6E4DF] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#232A3B] pb-3">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-[#C5A059]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C5A059]">
                  OPERATOR AUTHORITY GATE · JEMMA PROVENANCE LEDGER
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#8A8F9A]">
                Doctrine 2: Authority Remains with Operator
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-[#A0A4AB] leading-relaxed">
                You are about to admit an uncommitted simulation proof into Jemma's permanent append-only provenance ledger.
              </p>

              <div className="bg-[#0B0D13] border border-[#1E2536] p-3.5 rounded font-mono text-[11px] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#737885]">Audit Checksum:</span>
                  <span className="text-[#4ADE80] font-bold">{verification.auditHash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737885]">Nominal → Perturbed Teeth:</span>
                  <span className="text-[#E6E4DF]">{verification.nominalTeeth} T → {verification.perturbedTeeth} T</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737885]">Kinematic Departure:</span>
                  <span className="text-[#F59E0B] font-bold">
                    {verification.ratioDeviationPercent >= 0 ? "+" : ""}{verification.ratioDeviationPercent.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737885]">Epistemic Verdict:</span>
                  <span className="text-[#93C5FD] font-bold">{verification.epistemicVerdict}</span>
                </div>
              </div>

              <div className="bg-[#1A1812] border border-[#3E341B] p-3 rounded text-[11px] text-[#D4AF37] leading-relaxed">
                <strong>Epistemic Isolation Notice:</strong> Admitting this record documents the mathematical proof and counterfactual ablation test. It does <em>not</em> convert the simulation into an archaeological observation or physical fact.
              </div>

              <label className="flex items-start space-x-2.5 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={operatorConfirmedAdmission}
                  onChange={(e) => setOperatorConfirmedAdmission(e.target.checked)}
                  className="mt-0.5 rounded border-[#3E341B] text-[#C5A059] focus:ring-0 focus:outline-none"
                />
                <span className="text-[11px] text-[#E6E4DF] font-mono select-none">
                  I, the Operator, have reviewed the kinematic proof and explicitly authorize admission of this candidate constraint to Jemma's provenance record.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#232A3B]">
              <button
                type="button"
                disabled={isAdmitting}
                onClick={() => setShowLedgerConfirmModal(false)}
                className="px-4 py-2 rounded bg-[#181C26] hover:bg-[#222838] border border-[#2D364A] text-xs font-mono text-[#8A8F9A] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!operatorConfirmedAdmission || isAdmitting}
                onClick={handleConfirmLedgerCommit}
                className="px-5 py-2 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-[#0D0E11] text-xs font-semibold font-mono transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isAdmitting ? "Admitting..." : "Confirm & Admit to Ledger"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
