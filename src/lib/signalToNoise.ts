/**
 * PATHFINDER RUNTIME: HYBRID THRESHOLD ATTENTION GATE & DUAL-BASELINE TRACKING
 *
 * Core Principle:
 * "The system may adapt attention thresholds, but it may not adapt away its obligations."
 * "Adapt to ageing without learning to ignore it."
 */

export type SignalRoutingAction = "STOP" | "SURFACE" | "MONITOR" | "DISCARD";

export type DomainType = "engineered" | "physical" | "biological" | "environmental" | "musical" | "governance";

export interface SignalInput {
  id: string;
  timestamp: number;
  source: string;
  domain: DomainType;
  signalType: "electronic_strain" | "impedance_shift" | "thermal_transient" | "boundary_anomaly" | "contract_violation" | "baseline_drift";
  amplitude: number;             // Raw perturbation magnitude
  frequencyHz?: number;          // Spectral characterization
  durationMs?: number;           // Duration of transient
  isReversible?: boolean;        // Reversibility flag
  urgency: number;               // U: 0.0 to 1.0
  anomalyStrength: number;       // A: 0.0 to 1.0
  environmentalCorrelation?: number; // 0.0 to 1.0 (e.g. ambient temp/humidity match)
  violatesStopInvariant?: boolean;
  stopInvariantReason?: string;
  metadata?: Record<string, any>;
}

export interface DualBaselineState {
  fastBaseline: number;          // B_f(t): Fast operational baseline (temperature, cyclic load)
  slowBaseline: number;          // B_s(t): Slow ageing baseline (fatigue, hysteresis, oxidation)
  instantaneousResidual: number; // ΔE_f = E(t) - B_f(t)
  ageingResidual: number;        // ΔE_s = B_f(t) - B_s(t)
  driftVelocity: number;         // v_drift = d(B_s)/dt
  hysteresis: number;            // Normalized loop area (0.0 to 1.0)
  recoveryTimeMs: number;        // Time required to return to fast baseline
  cycleCount: number;            // Total deformation or load cycles
  effectiveNoiseFloor: number;   // N_effective = min(N_adaptive, N_max)
  maxPermittedNoiseFloor: number;// Hard ceiling for noise floor widening
}

export interface AttentionGateConfig {
  lambdaLoad: number;            // λ: Penalty weight for system/cognitive load (suppresses chatter)
  muUrgency: number;             // μ: Amplification weight for urgency
  nuAnomaly: number;             // ν: Amplification weight for anomaly strength
  domainContextThresholds: Record<string, Record<string, number>>; // [domain][mode] -> baseThreshold
  maxPermittedNoiseFloor: number;
  tauFastSeconds: number;        // Time constant for fast baseline filter (e.g. 2.0s)
  tauSlowSeconds: number;        // Time constant for slow baseline filter (e.g. 300.0s)
  driftAlarmVelocityThreshold: number; // Rate of slow drift that forces SURFACE
  hysteresisAlarmThreshold: number;    // Hysteresis level forcing SURFACE
}

export interface CumulativeDriftAccumulator {
  cumulativeStateDelta: number;  // ΔS_cumulative = Σ w_recency * w_source * ΔS_i
  samples: Array<{
    timestamp: number;
    delta: number;
    sourceWeight: number;
    recencyWeight: number;
  }>;
  windowSize: number;
  driftThreshold: number;
}

export interface CandidateScoreInput {
  electronicCouplingDensity: number; // 0.0 to 1.0 (number of overlapping bond pathways)
  perturbationSensitivity: number;  // Gauge factor / dE/dε (e.g. 1.0 to 30.0)
  signalSeparability: number;       // SNR separability (0.0 to 1.0)
  environmentalStability: number;   // Resistance to O2/moisture (0.0 to 1.0)
  readoutCost: number;              // Measurement overhead (1.0 to 10.0)
}

export interface SignalEvaluationResult {
  action: SignalRoutingAction;
  effectiveThreshold: number;
  contextBaseline: number;
  signalScore: number;
  rationale: string;
  invariantTriggered: boolean;
  stopReason?: string;
  isCumulativeDriftPromoted: boolean;
  dualBaseline: DualBaselineState;
  accumulatorState: CumulativeDriftAccumulator;
  timestamp: string;
}

export const DEFAULT_ATTENTION_CONFIG: AttentionGateConfig = {
  lambdaLoad: 0.35,
  muUrgency: 0.45,
  nuAnomaly: 0.50,
  domainContextThresholds: {
    engineered: {
      quiescent: 0.40,
      active_telemetry: 0.25,
      impact_monitoring: 0.15
    },
    physical: {
      nominal: 0.35,
      calibration: 0.20,
      ablation: 0.15
    },
    biological: {
      nest_equilibrium: 0.30,
      stress_response: 0.15
    },
    governance: {
      routine: 0.30,
      audit: 0.10,
      emergency: 0.05
    }
  },
  maxPermittedNoiseFloor: 0.18,
  tauFastSeconds: 1.5,
  tauSlowSeconds: 180.0,
  driftAlarmVelocityThreshold: 0.08,
  hysteresisAlarmThreshold: 0.32
};

/**
 * Calculates Candidate Score for non-actinide surrogate screening
 * candidateScore = (electronicCouplingDensity * perturbationSensitivity * signalSeparability * environmentalStability) / readoutCost
 */
export function computeCandidateScore(params: CandidateScoreInput): { score: number; rank: string; formula: string } {
  const { electronicCouplingDensity, perturbationSensitivity, signalSeparability, environmentalStability, readoutCost } = params;
  const safeCost = Math.max(0.1, readoutCost);
  const score = (electronicCouplingDensity * perturbationSensitivity * signalSeparability * environmentalStability) / safeCost;
  
  let rank = "POOR";
  if (score > 1.8) rank = "EXEMPLARY (OPTIMAL SURROGATE)";
  else if (score > 1.0) rank = "VIABLE (SCALE 2-3 SCREENING)";
  else if (score > 0.5) rank = "MARGINAL (HIGH READOUT COST)";

  return {
    score: Number(score.toFixed(3)),
    rank,
    formula: `(${electronicCouplingDensity} × ${perturbationSensitivity} × ${signalSeparability} × ${environmentalStability}) / ${safeCost} = ${score.toFixed(3)}`
  };
}

/**
 * Evaluates a single sensory or digital twin signal through the 3-layer hybrid threshold gate.
 */
export function evaluateSignalToNoise(
  signal: SignalInput,
  operatingMode: string = "active_telemetry",
  systemLoad: number = 0.2, // L: 0.0 to 1.0
  dualBaseline: DualBaselineState,
  accumulator: CumulativeDriftAccumulator,
  config: AttentionGateConfig = DEFAULT_ATTENTION_CONFIG
): SignalEvaluationResult {
  // ── LAYER 1: INVARIANT FLOOR (FIXED) ───────────────────────────────────────
  // Safety, authority, provenance, and boundary violations bypass ordinary SNR scoring.
  // System load must NEVER raise the threshold for STOP.
  if (signal.violatesStopInvariant) {
    return {
      action: "STOP",
      effectiveThreshold: 0.0,
      contextBaseline: 0.0,
      signalScore: 1.0,
      rationale: `INVARIANT FLOOR TRIGGERED: ${signal.stopInvariantReason || "Safety/Authority/Physical Boundary breach detected. Load invariant bypass enforced."}`,
      invariantTriggered: true,
      stopReason: signal.stopInvariantReason || "Physical Boundary Breach",
      isCumulativeDriftPromoted: false,
      dualBaseline,
      accumulatorState: accumulator,
      timestamp: new Date().toISOString()
    };
  }

  // ── UPDATE DUAL BASELINE (Fast vs Slow Ageing) ──────────────────────────────
  const reading = signal.amplitude;
  const dt = 1.0; // Normalized 1-second sample step
  
  // Fast baseline tracks high-frequency reversible movements
  const alphaFast = dt / (config.tauFastSeconds + dt);
  const updatedFastBaseline = dualBaseline.fastBaseline + alphaFast * (reading - dualBaseline.fastBaseline);

  // Slow baseline tracks permanent drift, fatigue, oxidation
  const alphaSlow = dt / (config.tauSlowSeconds + dt);
  const updatedSlowBaseline = dualBaseline.slowBaseline + alphaSlow * (updatedFastBaseline - dualBaseline.slowBaseline);

  const instantaneousResidual = Math.abs(reading - updatedFastBaseline);
  const ageingResidual = Math.abs(updatedFastBaseline - updatedSlowBaseline);
  const driftVelocity = Math.abs(updatedSlowBaseline - dualBaseline.slowBaseline) / dt;

  // Calculate hysteresis and recovery
  const newCycleCount = reading > dualBaseline.fastBaseline + 0.2 ? dualBaseline.cycleCount + 1 : dualBaseline.cycleCount;
  const updatedHysteresis = signal.isReversible === false ? Math.min(1.0, dualBaseline.hysteresis + 0.04) : Math.max(0.0, dualBaseline.hysteresis - 0.01);
  const updatedRecoveryTime = signal.isReversible ? 45.0 : dualBaseline.recoveryTimeMs + 12.0;

  // Bounded Noise Floor Adaptation: N_effective = min(N_adaptive, N_max)
  let candidateAdaptiveNoise = dualBaseline.effectiveNoiseFloor;
  const isBenignReversible = (signal.environmentalCorrelation || 0) > 0.6 && (signal.isReversible !== false) && updatedHysteresis < 0.2;
  if (isBenignReversible) {
    candidateAdaptiveNoise = Math.min(config.maxPermittedNoiseFloor, dualBaseline.effectiveNoiseFloor + 0.005);
  } else {
    candidateAdaptiveNoise = Math.max(0.02, dualBaseline.effectiveNoiseFloor - 0.002);
  }
  const effectiveNoiseFloor = Math.min(candidateAdaptiveNoise, config.maxPermittedNoiseFloor);

  const updatedDualBaseline: DualBaselineState = {
    fastBaseline: Number(updatedFastBaseline.toFixed(4)),
    slowBaseline: Number(updatedSlowBaseline.toFixed(4)),
    instantaneousResidual: Number(instantaneousResidual.toFixed(4)),
    ageingResidual: Number(ageingResidual.toFixed(4)),
    driftVelocity: Number(driftVelocity.toFixed(4)),
    hysteresis: Number(updatedHysteresis.toFixed(4)),
    recoveryTimeMs: Number(updatedRecoveryTime.toFixed(1)),
    cycleCount: newCycleCount,
    effectiveNoiseFloor: Number(effectiveNoiseFloor.toFixed(4)),
    maxPermittedNoiseFloor: config.maxPermittedNoiseFloor
  };

  // ── LAYER 2: CONTEXT BASELINE (DOMAIN / MODE SPECIFIC) ──────────────────────
  const domainTable = config.domainContextThresholds[signal.domain] || config.domainContextThresholds.engineered;
  const contextBaseline = domainTable[operatingMode] !== undefined ? domainTable[operatingMode] : 0.30;

  // ── LAYER 3: LOAD-SENSITIVE ATTENTION GATE (ADAPTIVE) ───────────────────────
  // T_effective = T_context + λ*L - μ*U - ν*A
  const L = Math.max(0, Math.min(1, systemLoad));
  const U = Math.max(0, Math.min(1, signal.urgency));
  const A = Math.max(0, Math.min(1, signal.anomalyStrength));

  const effectiveThreshold = Math.max(
    0.05,
    contextBaseline + (config.lambdaLoad * L) - (config.muUrgency * U) - (config.nuAnomaly * A)
  );

  // Overall signal materiality score
  const signalScore = Math.max(0, reading * 0.4 + A * 0.35 + U * 0.25);

  // ── EVALUATION & ROUTING HIERARCHY ──────────────────────────────────────────
  
  // 1. Accelerating Drift or Structural Ageing Boundary -> forces SURFACE / STOP
  if (driftVelocity >= config.driftAlarmVelocityThreshold || updatedHysteresis >= config.hysteresisAlarmThreshold) {
    return {
      action: "SURFACE",
      effectiveThreshold: Number(effectiveThreshold.toFixed(4)),
      contextBaseline,
      signalScore: Number(signalScore.toFixed(4)),
      rationale: `MATERIAL AGEING ALERT: Drift velocity (${driftVelocity.toFixed(4)}) or hysteresis (${updatedHysteresis.toFixed(2)}) crossed structural degradation limits.`,
      invariantTriggered: false,
      isCumulativeDriftPromoted: true,
      dualBaseline: updatedDualBaseline,
      accumulatorState: accumulator,
      timestamp: new Date().toISOString()
    };
  }

  // 2. Immediate Material Signal -> SURFACE
  if (signalScore >= effectiveThreshold) {
    return {
      action: "SURFACE",
      effectiveThreshold: Number(effectiveThreshold.toFixed(4)),
      contextBaseline,
      signalScore: Number(signalScore.toFixed(4)),
      rationale: `MATERIAL NOW: Score (${signalScore.toFixed(3)}) >= T_effective (${effectiveThreshold.toFixed(3)}) under load L=${L.toFixed(2)}. Promoted to Operator working memory.`,
      invariantTriggered: false,
      isCumulativeDriftPromoted: false,
      dualBaseline: updatedDualBaseline,
      accumulatorState: accumulator,
      timestamp: new Date().toISOString()
    };
  }

  // 3. Accumulate sub-threshold signal in bounded MONITOR cache
  const recencyWeight = 0.95;
  const sourceWeight = signal.domain === "engineered" ? 1.2 : 1.0;
  const deltaS = signal.amplitude * sourceWeight * recencyWeight;

  const updatedAccumulatorSamples = [
    { timestamp: signal.timestamp, delta: deltaS, sourceWeight, recencyWeight },
    ...accumulator.samples.slice(0, accumulator.windowSize - 1)
  ];

  const cumulativeStateDelta = updatedAccumulatorSamples.reduce((acc, s) => acc + s.delta, 0);

  const updatedAccumulator: CumulativeDriftAccumulator = {
    ...accumulator,
    cumulativeStateDelta: Number(cumulativeStateDelta.toFixed(4)),
    samples: updatedAccumulatorSamples
  };

  // Check if cumulative quiet observations cross threshold
  if (cumulativeStateDelta >= accumulator.driftThreshold) {
    return {
      action: "SURFACE",
      effectiveThreshold: Number(effectiveThreshold.toFixed(4)),
      contextBaseline,
      signalScore: Number(signalScore.toFixed(4)),
      rationale: `CUMULATIVE DRIFT DETECTED: Sum of quiet sub-threshold observations (${cumulativeStateDelta.toFixed(3)}) crossed drift threshold (${accumulator.driftThreshold}).`,
      invariantTriggered: false,
      isCumulativeDriftPromoted: true,
      dualBaseline: updatedDualBaseline,
      accumulatorState: updatedAccumulator,
      timestamp: new Date().toISOString()
    };
  }

  // 4. Benign Reversible Noise -> DISCARD
  if (instantaneousResidual <= effectiveNoiseFloor && signal.isReversible !== false && (signal.environmentalCorrelation || 0) > 0.4) {
    return {
      action: "DISCARD",
      effectiveThreshold: Number(effectiveThreshold.toFixed(4)),
      contextBaseline,
      signalScore: Number(signalScore.toFixed(4)),
      rationale: `BENIGN REVERSIBLE NOISE: Residual (${instantaneousResidual.toFixed(4)}) <= Noise floor (${effectiveNoiseFloor.toFixed(4)}). Zero state impact.`,
      invariantTriggered: false,
      isCumulativeDriftPromoted: false,
      dualBaseline: updatedDualBaseline,
      accumulatorState: updatedAccumulator,
      timestamp: new Date().toISOString()
    };
  }

  // 5. Otherwise -> MONITOR with accumulator
  return {
    action: "MONITOR",
    effectiveThreshold: Number(effectiveThreshold.toFixed(4)),
    contextBaseline,
    signalScore: Number(signalScore.toFixed(4)),
    rationale: `ACCUMULATING IN MONITOR: Score (${signalScore.toFixed(3)}) < T_effective (${effectiveThreshold.toFixed(3)}). Cached to track long-term baseline drift.`,
    invariantTriggered: false,
    isCumulativeDriftPromoted: false,
    dualBaseline: updatedDualBaseline,
    accumulatorState: updatedAccumulator,
    timestamp: new Date().toISOString()
  };
}
