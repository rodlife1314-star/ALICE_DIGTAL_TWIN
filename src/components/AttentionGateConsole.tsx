import React, { useState, useEffect } from "react";
import {
  Activity,
  Zap,
  Shield,
  AlertTriangle,
  Layers,
  Cpu,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Info,
  Clock,
  Eye,
  SlidersHorizontal,
  Flame
} from "lucide-react";
import {
  SignalInput,
  SignalRoutingAction,
  DualBaselineState,
  CumulativeDriftAccumulator,
  SignalEvaluationResult,
  DEFAULT_ATTENTION_CONFIG,
  evaluateSignalToNoise,
  computeCandidateScore,
  CandidateScoreInput
} from "../lib/signalToNoise";

interface AttentionGateConsoleProps {
  twinId?: string;
  onEmitDecision?: (result: SignalEvaluationResult) => void;
}

export function AttentionGateConsole({ twinId, onEmitDecision }: AttentionGateConsoleProps) {
  // Config & Operating Parameters
  const [operatingDomain, setOperatingDomain] = useState<"engineered" | "physical" | "biological" | "governance">("engineered");
  const [operatingMode, setOperatingMode] = useState<string>("active_telemetry");
  const [systemLoad, setSystemLoad] = useState<number>(0.35); // L: 0.0 to 1.0
  const [urgency, setUrgency] = useState<number>(0.25);       // U: 0.0 to 1.0
  const [anomalyStrength, setAnomalyStrength] = useState<number>(0.30); // A: 0.0 to 1.0
  const [signalAmplitude, setSignalAmplitude] = useState<number>(0.22);
  const [isReversible, setIsReversible] = useState<boolean>(true);
  const [forceInvariantViolation, setForceInvariantViolation] = useState<boolean>(false);

  // Dual Baseline State
  const [dualBaseline, setDualBaseline] = useState<DualBaselineState>({
    fastBaseline: 0.15,
    slowBaseline: 0.12,
    instantaneousResidual: 0.07,
    ageingResidual: 0.03,
    driftVelocity: 0.012,
    hysteresis: 0.08,
    recoveryTimeMs: 45.0,
    cycleCount: 142,
    effectiveNoiseFloor: 0.08,
    maxPermittedNoiseFloor: 0.18
  });

  // Cumulative Drift Accumulator State
  const [accumulator, setAccumulator] = useState<CumulativeDriftAccumulator>({
    cumulativeStateDelta: 0.38,
    samples: [
      { timestamp: Date.now() - 4000, delta: 0.08, sourceWeight: 1.2, recencyWeight: 0.95 },
      { timestamp: Date.now() - 3000, delta: 0.09, sourceWeight: 1.2, recencyWeight: 0.95 },
      { timestamp: Date.now() - 2000, delta: 0.11, sourceWeight: 1.2, recencyWeight: 0.95 },
      { timestamp: Date.now() - 1000, delta: 0.10, sourceWeight: 1.2, recencyWeight: 0.95 }
    ],
    windowSize: 10,
    driftThreshold: 0.75
  });

  // Evaluation Decision Output
  const [lastResult, setLastResult] = useState<SignalEvaluationResult | null>(null);
  const [signalHistory, setSignalHistory] = useState<Array<SignalEvaluationResult>>([]);

  // Candidate Score Evaluator for Non-Actinides
  const [candidateParams, setCandidateParams] = useState<CandidateScoreInput>({
    electronicCouplingDensity: 0.92,
    perturbationSensitivity: 14.8,
    signalSeparability: 0.94,
    environmentalStability: 0.98,
    readoutCost: 5.2
  });

  const candidateScoreResult = computeCandidateScore(candidateParams);

  // Execute single signal evaluation
  const handleEvaluate = (overrideInput?: Partial<SignalInput>) => {
    const input: SignalInput = {
      id: `sig-${Date.now()}`,
      timestamp: Date.now(),
      source: "64-node-piezoresistive-array",
      domain: operatingDomain,
      signalType: "electronic_strain",
      amplitude: signalAmplitude,
      frequencyHz: 1200,
      durationMs: 45,
      isReversible: isReversible,
      urgency: urgency,
      anomalyStrength: anomalyStrength,
      environmentalCorrelation: 0.75,
      violatesStopInvariant: forceInvariantViolation,
      stopInvariantReason: forceInvariantViolation ? "ACTINIDE_EXCLUSION_BREACH: Radiological isotope detected on wearable layer" : undefined,
      ...overrideInput
    };

    const res = evaluateSignalToNoise(
      input,
      operatingMode,
      systemLoad,
      dualBaseline,
      accumulator,
      DEFAULT_ATTENTION_CONFIG
    );

    setDualBaseline(res.dualBaseline);
    setAccumulator(res.accumulatorState);
    setLastResult(res);
    setSignalHistory((prev) => [res, ...prev.slice(0, 15)]);

    if (onEmitDecision) {
      onEmitDecision(res);
    }
  };

  // Run initial evaluation on mount
  useEffect(() => {
    handleEvaluate();
  }, []);

  const handleInjectPreset = (type: "thermal_static" | "micro_drift" | "impact_precursor" | "stop_invariant" | "hysteresis_alarm") => {
    if (type === "thermal_static") {
      setSignalAmplitude(0.06);
      setUrgency(0.05);
      setAnomalyStrength(0.08);
      setIsReversible(true);
      setForceInvariantViolation(false);
      handleEvaluate({
        amplitude: 0.06,
        urgency: 0.05,
        anomalyStrength: 0.08,
        isReversible: true,
        violatesStopInvariant: false
      });
    } else if (type === "micro_drift") {
      setSignalAmplitude(0.18);
      setUrgency(0.35);
      setAnomalyStrength(0.40);
      setIsReversible(false);
      setForceInvariantViolation(false);
      handleEvaluate({
        amplitude: 0.18,
        urgency: 0.35,
        anomalyStrength: 0.40,
        isReversible: false,
        violatesStopInvariant: false
      });
    } else if (type === "impact_precursor") {
      setSignalAmplitude(0.72);
      setUrgency(0.92);
      setAnomalyStrength(0.88);
      setIsReversible(false);
      setForceInvariantViolation(false);
      handleEvaluate({
        amplitude: 0.72,
        urgency: 0.92,
        anomalyStrength: 0.88,
        isReversible: false,
        violatesStopInvariant: false
      });
    } else if (type === "stop_invariant") {
      setForceInvariantViolation(true);
      handleEvaluate({
        violatesStopInvariant: true,
        stopInvariantReason: "STOP INVARIANT: Unauthorized physical safety limit exceeded under high strain rate."
      });
    } else if (type === "hysteresis_alarm") {
      setSignalAmplitude(0.45);
      setUrgency(0.70);
      setAnomalyStrength(0.75);
      setIsReversible(false);
      setDualBaseline((prev) => ({ ...prev, hysteresis: 0.38, driftVelocity: 0.095 }));
      handleEvaluate({
        amplitude: 0.45,
        urgency: 0.70,
        anomalyStrength: 0.75,
        isReversible: false
      });
    }
  };

  return (
    <div className="space-y-8 text-[#E6E4DF]">
      {/* Doctrine Banner */}
      <div className="bg-[#13151A] border border-[#2B303C] rounded-lg p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-4xl">
            <div className="flex items-center space-x-2">
              <span className="bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded tracking-wider uppercase">
                SIGNAL-TO-NOISE RUNTIME CONTRACT
              </span>
              <span className="bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                HYBRID THRESHOLDS
              </span>
              <span className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                DUAL-BASELINE DRIFT
              </span>
            </div>
            <h2 className="text-2xl font-light text-[#E6E4DF] tracking-tight">
              Adaptive Attention Gate & Dual-Baseline Engine
            </h2>
            <p className="text-xs text-[#A0A4AB] leading-relaxed">
              Enforces selective attention over rich electronic topology telemetry:
              <strong className="text-[#E6E4DF]"> Invariant Floor (Fixed)</strong> protects safety & boundaries;
              <strong className="text-[#509EE3]"> Context Baseline</strong> defines domain materiality;
              <strong className="text-[#4ADE80]"> Load-Sensitive Gate</strong> dynamically scales threshold <em>T_effective = T_context + λ·L - μ·U - ν·A</em> without adapting away obligations.
            </p>
          </div>

          <div className="bg-[#181A20] border border-[#2A2E39] rounded-lg p-3.5 font-mono text-xs text-right shrink-0 lg:max-w-xs space-y-1">
            <span className="text-[10px] text-[#C5A059] font-bold block uppercase">GOVERNING INVARIANT</span>
            <p className="text-[11px] text-[#8A8F9A] italic">
              “Adapt to ageing without learning to ignore it. The system may adapt attention thresholds, but it may not adapt away its obligations.”
            </p>
          </div>
        </div>
      </div>

      {/* Main 3-Layer Control & Decision Surface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Signal & Attention Parameter Controls (5 cols) */}
        <div className="lg:col-span-5 bg-[#13151A] border border-[#22262F] rounded-lg p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#22262F]">
            <span className="text-xs font-mono font-bold text-[#E6E4DF] uppercase flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-[#509EE3]" />
              <span>Attention & Signal Ingestion</span>
            </span>
            <span className="text-[10px] font-mono text-[#8A8F9A]">Layer 1-3 Ingestion</span>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5 font-mono text-xs">
            <span className="text-[10px] text-[#8A8F9A] uppercase font-bold">Inject Signal Profile:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleInjectPreset("thermal_static")}
                className="p-2 rounded bg-[#181A20] hover:bg-[#20232B] border border-[#2B303C] text-left text-[11px] text-[#8A8F9A] hover:text-[#E6E4DF] transition-colors cursor-pointer"
              >
                1. Thermal Static (DISCARD)
              </button>
              <button
                type="button"
                onClick={() => handleInjectPreset("micro_drift")}
                className="p-2 rounded bg-[#181A20] hover:bg-[#20232B] border border-[#2B303C] text-left text-[11px] text-[#509EE3] transition-colors cursor-pointer"
              >
                2. Micro-Strain Drift (MONITOR)
              </button>
              <button
                type="button"
                onClick={() => handleInjectPreset("impact_precursor")}
                className="p-2 rounded bg-[#181A20] hover:bg-[#20232B] border border-[#2B303C] text-left text-[11px] text-[#EAB308] transition-colors cursor-pointer"
              >
                3. Kinetic Shock (SURFACE)
              </button>
              <button
                type="button"
                onClick={() => handleInjectPreset("stop_invariant")}
                className="p-2 rounded bg-[#181A20] hover:bg-[#20232B] border border-[#EF4444]/40 text-left text-[11px] text-[#EF4444] transition-colors cursor-pointer"
              >
                4. Safety Boundary (STOP)
              </button>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="space-y-4 pt-2 border-t border-[#22262F] font-mono text-xs">
            {/* System / Cognitive Load L */}
            <div className="space-y-1">
              <div className="flex justify-between text-[#8A8F9A]">
                <span>SYSTEM COGNITIVE LOAD ($L$)</span>
                <span className="text-[#E6E4DF] font-bold">{(systemLoad * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={systemLoad ?? 0}
                onChange={(e) => {
                  setSystemLoad(Number(e.target.value));
                }}
                className="w-full accent-[#509EE3] cursor-pointer"
              />
              <span className="text-[10px] text-[#737885] block">
                $\lambda L$: High load suppresses reversible chatter ($\lambda = 0.35$)
              </span>
            </div>

            {/* Urgency U */}
            <div className="space-y-1">
              <div className="flex justify-between text-[#8A8F9A]">
                <span>URGENCY ($U$)</span>
                <span className="text-[#4ADE80] font-bold">{((urgency ?? 0) * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={urgency ?? 0}
                onChange={(e) => setUrgency(Number(e.target.value))}
                className="w-full accent-[#4ADE80] cursor-pointer"
              />
              <span className="text-[10px] text-[#737885] block">
                $-\mu U$: Pulls time-critical signals above threshold ($\mu = 0.45$)
              </span>
            </div>

            {/* Anomaly Strength A */}
            <div className="space-y-1">
              <div className="flex justify-between text-[#8A8F9A]">
                <span>ANOMALY STRENGTH ($A$)</span>
                <span className="text-[#EAB308] font-bold">{((anomalyStrength ?? 0) * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={anomalyStrength ?? 0}
                onChange={(e) => setAnomalyStrength(Number(e.target.value))}
                className="w-full accent-[#EAB308] cursor-pointer"
              />
              <span className="text-[10px] text-[#737885] block">
                $-\nu A$: Amplifies topological deviation ($\nu = 0.50$)
              </span>
            </div>

            {/* Signal Amplitude */}
            <div className="space-y-1">
              <div className="flex justify-between text-[#8A8F9A]">
                <span>SIGNAL PERTURBATION ($\Delta E$)</span>
                <span className="text-[#C5A059] font-bold">{(signalAmplitude ?? 0.01).toFixed(2)} V</span>
              </div>
              <input
                type="range"
                min={0.01}
                max={1.0}
                step={0.01}
                value={signalAmplitude ?? 0.01}
                onChange={(e) => setSignalAmplitude(Number(e.target.value))}
                className="w-full accent-[#C5A059] cursor-pointer"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleEvaluate()}
            className="w-full bg-[#509EE3] hover:bg-[#3B82F6] text-[#0D0E11] font-mono text-xs font-bold py-2.5 rounded flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>Evaluate Attention Gate</span>
          </button>
        </div>

        {/* Live Decision Surface & Math Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-[#13151A] border border-[#22262F] rounded-lg p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#22262F]">
              <span className="text-xs font-mono font-bold text-[#E6E4DF] uppercase flex items-center space-x-2">
                <Activity className="w-4 h-4 text-[#C5A059]" />
                <span>Runtime Routing Decision</span>
              </span>
              {lastResult && (
                <span
                  className={`text-xs font-mono px-3 py-1 rounded font-bold border ${
                    lastResult.action === "STOP"
                      ? "bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444] animate-pulse"
                      : lastResult.action === "SURFACE"
                      ? "bg-[#10B981]/20 border-[#10B981] text-[#10B981]"
                      : lastResult.action === "MONITOR"
                      ? "bg-[#3B82F6]/20 border-[#3B82F6] text-[#509EE3]"
                      : "bg-[#737885]/20 border-[#737885] text-[#8A8F9A]"
                  }`}
                >
                  ACTION: {lastResult.action}
                </span>
              )}
            </div>

            {/* Rationale Callout */}
            {lastResult && (
              <div className="bg-[#181A20] border border-[#2A2E39] rounded-lg p-4 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#8A8F9A] uppercase font-bold">ROUTING RATIONALE</span>
                  <span className="text-[10px] text-[#737885]">{lastResult.timestamp.slice(11, 19)} UTC</span>
                </div>
                <p className="text-[#E6E4DF] text-xs leading-relaxed">{lastResult.rationale}</p>
              </div>
            )}

            {/* Exact Math Formula & Parameter Grid */}
            {lastResult && (
              <div className="bg-[#0D0E11] border border-[#22252D] rounded-lg p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-[#8A8F9A] text-[11px] pb-2 border-b border-[#1E222A]">
                  <span>FORMULA: T_effective = T_context + λ·L - μ·U - ν·A</span>
                  <span className="text-[#4ADE80] font-bold">
                    T_eff = {lastResult.effectiveThreshold.toFixed(3)}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div className="bg-[#14161C] p-2.5 rounded border border-[#22262F]">
                    <span className="text-[9px] text-[#8A8F9A] block">T_CONTEXT</span>
                    <span className="text-[#E6E4DF] font-bold text-xs">
                      {lastResult.contextBaseline.toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-[#14161C] p-2.5 rounded border border-[#22262F]">
                    <span className="text-[9px] text-[#8A8F9A] block">+ λ·L (LOAD)</span>
                    <span className="text-[#509EE3] font-bold text-xs">
                      +{(0.35 * systemLoad).toFixed(3)}
                    </span>
                  </div>
                  <div className="bg-[#14161C] p-2.5 rounded border border-[#22262F]">
                    <span className="text-[9px] text-[#8A8F9A] block">- μ·U (URGENCY)</span>
                    <span className="text-[#4ADE80] font-bold text-xs">
                      -{(0.45 * urgency).toFixed(3)}
                    </span>
                  </div>
                  <div className="bg-[#14161C] p-2.5 rounded border border-[#22262F]">
                    <span className="text-[9px] text-[#8A8F9A] block">- ν·A (ANOMALY)</span>
                    <span className="text-[#EAB308] font-bold text-xs">
                      -{(0.50 * anomalyStrength).toFixed(3)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Status Badges */}
          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-[#8A8F9A] pt-4 border-t border-[#22262F] gap-2">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span>Invariant Floor: <strong className="text-[#E6E4DF]">PROTECTED</strong></span>
            </span>
            <span>Cumulative Window: <strong className="text-[#509EE3]">{accumulator.samples.length}/{accumulator.windowSize}</strong></span>
          </div>
        </div>
      </div>

      {/* Dual-Baseline Tracking Canvas & Cumulative Drift Accumulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dual-Baseline Tracking (7 cols) */}
        <div className="lg:col-span-7 bg-[#13151A] border border-[#22262F] rounded-lg p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#22262F]">
            <div className="flex items-center space-x-2.5">
              <Layers className="w-4 h-4 text-[#4ADE80]" />
              <span className="text-xs font-mono font-bold text-[#E6E4DF] uppercase">
                Dual-Baseline Tracking Architecture
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#8A8F9A]">
              B_f(t) Fast vs B_s(t) Slow
            </span>
          </div>

          {/* Baseline Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-[#181A20] p-3 rounded border border-[#262B35] space-y-1">
              <span className="text-[10px] text-[#8A8F9A] block">FAST BASELINE B_f(t)</span>
              <span className="text-[#509EE3] font-bold text-sm">{dualBaseline.fastBaseline.toFixed(3)} V</span>
              <span className="text-[9px] text-[#737885] block">Reversible load cycles</span>
            </div>

            <div className="bg-[#181A20] p-3 rounded border border-[#262B35] space-y-1">
              <span className="text-[10px] text-[#8A8F9A] block">SLOW AGEING B_s(t)</span>
              <span className="text-[#C5A059] font-bold text-sm">{dualBaseline.slowBaseline.toFixed(3)} V</span>
              <span className="text-[9px] text-[#737885] block">Fatigue & permanent strain</span>
            </div>

            <div className="bg-[#181A20] p-3 rounded border border-[#262B35] space-y-1">
              <span className="text-[10px] text-[#8A8F9A] block">DRIFT VELOCITY v_drift</span>
              <span className={`font-bold text-sm ${dualBaseline.driftVelocity > 0.08 ? "text-[#EF4444]" : "text-[#4ADE80]"}`}>
                {dualBaseline.driftVelocity.toFixed(4)}/s
              </span>
              <span className="text-[9px] text-[#737885] block">dB_s/dt rate</span>
            </div>

            <div className="bg-[#181A20] p-3 rounded border border-[#262B35] space-y-1">
              <span className="text-[10px] text-[#8A8F9A] block">AGEING RESIDUAL ΔE_s</span>
              <span className="text-[#EAB308] font-bold text-sm">{dualBaseline.ageingResidual.toFixed(3)} V</span>
              <span className="text-[9px] text-[#737885] block">B_f(t) - B_s(t) displacement</span>
            </div>

            <div className="bg-[#181A20] p-3 rounded border border-[#262B35] space-y-1">
              <span className="text-[10px] text-[#8A8F9A] block">HYSTERESIS LOOP AREA</span>
              <span className="text-[#E6E4DF] font-bold text-sm">{dualBaseline.hysteresis.toFixed(3)}</span>
              <span className="text-[9px] text-[#737885] block">&lt;0.32 nominal threshold</span>
            </div>

            <div className="bg-[#181A20] p-3 rounded border border-[#262B35] space-y-1">
              <span className="text-[10px] text-[#8A8F9A] block">EFFECTIVE NOISE FLOOR</span>
              <span className="text-[#10B981] font-bold text-sm">{dualBaseline.effectiveNoiseFloor.toFixed(3)}</span>
              <span className="text-[9px] text-[#737885] block">Cap: {dualBaseline.maxPermittedNoiseFloor.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-3 bg-[#0D0E11] rounded border border-[#22252D] font-mono text-[11px] text-[#8A8F9A] space-y-1">
            <span className="text-[#C5A059] font-bold block">SOVEREIGN GOVERNANCE LAW:</span>
            <p className="leading-relaxed">
              <code>adaptiveNoiseFloor !== adaptiveSafetyBoundary</code>. Bounded noise floor adaptation prevents normalizing structural failure while preserving sensitivity to genuine ageing drift.
            </p>
          </div>
        </div>

        {/* Cumulative Drift Accumulator (5 cols) */}
        <div className="lg:col-span-5 bg-[#13151A] border border-[#22262F] rounded-lg p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#22262F]">
              <span className="text-xs font-mono font-bold text-[#E6E4DF] uppercase flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#509EE3]" />
                <span>Cumulative Drift Accumulator</span>
              </span>
              <span className="text-[10px] font-mono text-[#8A8F9A]">
                ΔS_cumulative
              </span>
            </div>

            {/* Progress Bar towards Drift Threshold */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between text-[#8A8F9A]">
                <span>ACCUMULATED STATE DELTA</span>
                <span className="text-[#E6E4DF] font-bold">
                  {accumulator.cumulativeStateDelta.toFixed(3)} / {accumulator.driftThreshold.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-[#181A20] h-3 rounded overflow-hidden border border-[#2A2E39]">
                <div
                  className={`h-full transition-all duration-300 ${
                    accumulator.cumulativeStateDelta >= accumulator.driftThreshold
                      ? "bg-[#EF4444]"
                      : accumulator.cumulativeStateDelta > 0.5
                      ? "bg-[#EAB308]"
                      : "bg-[#509EE3]"
                  }`}
                  style={{
                    width: `${Math.min(100, (accumulator.cumulativeStateDelta / accumulator.driftThreshold) * 100)}%`
                  }}
                />
              </div>
              <span className="text-[10px] text-[#737885] block">
                {accumulator.cumulativeStateDelta >= accumulator.driftThreshold
                  ? "THRESHOLD EXCEEDED: Promoted from MONITOR to SURFACE"
                  : "Quiet observations caching without bus flooding"}
              </span>
            </div>

            {/* Recent Cached Observations in Monitor */}
            <div className="space-y-1.5 font-mono text-[11px]">
              <span className="text-[10px] text-[#8A8F9A] uppercase font-bold">Cached Monitor Buffer ({accumulator.samples.length}):</span>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {accumulator.samples.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-[#181A20] rounded border border-[#252A36] flex items-center justify-between text-[#8A8F9A]"
                  >
                    <span>Sample #{idx + 1} (ΔE = {s.delta.toFixed(3)})</span>
                    <span className="text-[#509EE3]">w_rec={s.recencyWeight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setAccumulator((prev) => ({
                ...prev,
                cumulativeStateDelta: 0.0,
                samples: []
              }));
            }}
            className="w-full bg-[#181A20] hover:bg-[#222734] border border-[#2C3344] text-[#8A8F9A] hover:text-[#E6E4DF] font-mono text-xs py-2 rounded flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Accumulator Buffer</span>
          </button>
        </div>
      </div>

      {/* Non-Actinide Surrogate candidateScore Evaluator */}
      <div className="bg-[#13151A] border border-[#22262F] rounded-lg p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#22262F] gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-[#509EE3]/10 border border-[#509EE3]/30 flex items-center justify-center text-[#509EE3]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#8A8F9A] font-bold tracking-wider">
                SURROGATE SEARCH HEURISTIC
              </span>
              <h3 className="text-base font-semibold text-[#E6E4DF]">
                Non-Actinide Functional Equivalence Metric
              </h3>
            </div>
          </div>

          <div className="bg-[#181A20] px-3.5 py-1.5 rounded border border-[#2B303C] font-mono text-xs flex items-center space-x-2">
            <span className="text-[#8A8F9A]">CANDIDATE SCORE:</span>
            <span className="text-[#4ADE80] font-bold text-sm">{candidateScoreResult.score}</span>
            <span className="bg-[#10B981]/15 text-[#10B981] text-[9px] px-2 py-0.5 rounded border border-[#10B981]/30 font-bold">
              {candidateScoreResult.rank}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 font-mono text-xs">
          <div className="space-y-1">
            <span className="text-[#8A8F9A] text-[10px] block">COUPLING DENSITY (0-1)</span>
            <input
              type="number"
              step={0.05}
              min={0.1}
              max={1.0}
              value={candidateParams?.electronicCouplingDensity ?? 0.5}
              onChange={(e) => setCandidateParams({ ...candidateParams, electronicCouplingDensity: parseFloat(e.target.value) || 0.5 })}
              className="w-full bg-[#181A20] border border-[#2B303C] p-2 rounded text-[#E6E4DF]"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[#8A8F9A] text-[10px] block">PERTURBATION SENS. (GF)</span>
            <input
              type="number"
              step={0.5}
              min={1.0}
              max={30.0}
              value={candidateParams?.perturbationSensitivity ?? 10}
              onChange={(e) => setCandidateParams({ ...candidateParams, perturbationSensitivity: parseFloat(e.target.value) || 10 })}
              className="w-full bg-[#181A20] border border-[#2B303C] p-2 rounded text-[#E6E4DF]"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[#8A8F9A] text-[10px] block">SIGNAL SEPARABILITY (0-1)</span>
            <input
              type="number"
              step={0.05}
              min={0.1}
              max={1.0}
              value={candidateParams?.signalSeparability ?? 0.7}
              onChange={(e) => setCandidateParams({ ...candidateParams, signalSeparability: parseFloat(e.target.value) || 0.7 })}
              className="w-full bg-[#181A20] border border-[#2B303C] p-2 rounded text-[#E6E4DF]"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[#8A8F9A] text-[10px] block">ENV. STABILITY (0-1)</span>
            <input
              type="number"
              step={0.05}
              min={0.1}
              max={1.0}
              value={candidateParams?.environmentalStability ?? 0.8}
              onChange={(e) => setCandidateParams({ ...candidateParams, environmentalStability: parseFloat(e.target.value) || 0.8 })}
              className="w-full bg-[#181A20] border border-[#2B303C] p-2 rounded text-[#E6E4DF]"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[#8A8F9A] text-[10px] block">READOUT COST (&gt;0)</span>
            <input
              type="number"
              step={0.5}
              min={0.5}
              max={10.0}
              value={candidateParams?.readoutCost ?? 2.0}
              onChange={(e) => setCandidateParams({ ...candidateParams, readoutCost: parseFloat(e.target.value) || 2.0 })}
              className="w-full bg-[#181A20] border border-[#2B303C] p-2 rounded text-[#E6E4DF]"
            />
          </div>
        </div>

        <div className="p-3.5 bg-[#0D0E11] rounded border border-[#22252D] font-mono text-[11px] text-[#8A8F9A] flex items-center justify-between">
          <span>
            candidateScore = (Coupling × Sensitivity × Separability × Stability) / ReadoutCost
          </span>
          <span className="text-[#509EE3] font-bold">{candidateScoreResult.formula}</span>
        </div>
      </div>
    </div>
  );
}
