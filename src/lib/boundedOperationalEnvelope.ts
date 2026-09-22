/**
 * PATHFINDER SOVEREIGN SUBSTRATE: BOUNDED OPERATIONAL ENVELOPE (BOE)
 * & EPISTEMIC SEPARATION QUAD
 *
 * Core Formalism:
 *   "Authority is not the same thing as intervention frequency.
 *    A human can remain sovereign without physically touching every state transition.
 *    The authority lives in the boundary conditions:
 *    [ Authority defines the permissible state-space: Omega_safe ]
 *    The machine may move rapidly inside it.
 *    It may never redefine it."
 *
 * Sovereign Kernel Temporal Refinement:
 *   Human defines Omega_safe -> Agent recommends -> Policy verifies -> System acts within Omega_safe -> Ledger records
 *
 * Invariant:
 *   x_t not in Omega_safe => STOP (fail-closed)
 *
 * Epistemic Separation Invariant:
 *   MEASURED != ESTIMATED != SIMULATED != RECOMMENDED
 */

import {
  BoundedOperationalEnvelope,
  EpistemicObject,
  EpistemicTier,
  ReflexControlCycle,
  SubstrateReviewRecord
} from "../types";

export const EPISTEMIC_TIERS: Record<EpistemicTier, { label: string; badgeColor: string; description: string }> = {
  MEASURED: {
    label: "MEASURED",
    badgeColor: "#509EE3",
    description: "Direct empirical physical sensor reading (e.g. thermocouple T=742°C, hall sensor, accelerometer)."
  },
  ESTIMATED: {
    label: "ESTIMATED",
    badgeColor: "#C5A059",
    description: "Reconstructed state via observer/Kalman filter (e.g. core plasma temperature T_core ≈ 811°C)."
  },
  SIMULATED: {
    label: "SIMULATED",
    badgeColor: "#A855F7",
    description: "Forward PDE or digital twin trajectory prediction (e.g. forward 5s projection T_{t+5s} = 846°C)."
  },
  RECOMMENDED: {
    label: "RECOMMENDED",
    badgeColor: "#F59E0B",
    description: "Candidate optimization action produced by agent/policy network (e.g. actuator command u* = -7.2%)."
  }
};

/**
 * Default Bounded Operational Envelope authorized by Sovereign Operator
 */
export const DEFAULT_BOUNDED_OPERATIONAL_ENVELOPE: BoundedOperationalEnvelope = {
  id: "BOE-ALPHA-FUSION-PLASMA-01",
  name: "Magnetic Confinement & Thermal Equilibrium Envelope (Omega_safe)",
  authorizedBy: "Sovereign Operator (Rod / Jemma Substrate)",
  authorizedAt: "2026-09-10T14:10:00Z",
  domain: "physical / fusion-plasma",
  version: "2.4.0-SOVEREIGN",
  stateBounds: [
    {
      variable: "core_temperature_c",
      units: "°C",
      min: 650.0,
      max: 850.0,
      criticalEmergencyThreshold: 880.0,
      rateLimitPerSecond: 25.0
    },
    {
      variable: "plasma_current_ma",
      units: "MA",
      min: 1.1,
      max: 1.8,
      criticalEmergencyThreshold: 2.0,
      rateLimitPerSecond: 0.15
    },
    {
      variable: "poloidal_coil_voltage_kv",
      units: "kV",
      min: -10.0,
      max: 10.0,
      criticalEmergencyThreshold: 12.0,
      rateLimitPerSecond: 5.0
    },
    {
      variable: "magnetic_flux_drift_pct",
      units: "%",
      min: -5.0,
      max: 5.0,
      criticalEmergencyThreshold: 8.0,
      rateLimitPerSecond: 1.2
    }
  ],
  reflexLoopFrequencyHz: 100, // 10ms execution loop
  failClosedAction: "STOP",
  authorityInvariant: "Authority defines the permissible state-space (Omega_safe). Machine executes deterministic reflex control inside it, but may never redefine it."
};

/**
 * JEMMA Substrate Review Record for Fusionality / Google Tokamak Control Material
 */
export const JEMMA_FUSIONALITY_SUBSTRATE_REVIEW: SubstrateReviewRecord = {
  id: "JSR-2026-FUSIONALITY-01",
  title: "JEMMA Substrate Review: Fusionality / DeepMind Tokamak Magnetic Control Architecture",
  sourceMatter: "Google DeepMind / Swiss Plasma Center (SPC) Tokamak Reinforcement Learning Magnetic Control Substrate",
  authorizingEntity: "Jemma / Pathfinder Substrate Kernel",
  timestamp: "2026-09-10T14:10:00Z",
  disposition: "ADAPT",
  domainGeneralizations: {
    commonKernelVsMachineSpecific:
      "Decouples abstract state representations and equilibrium targets from specific coil geometries and voltage drivers. The sovereign kernel operates identically whether governing an Antikythera kinematic gear-train or a tokamak magnetic coil.",
    simulationPreDeploymentReasoning:
      "Simulation functions strictly as an offline counterfactual reasoning and policy training sandpit. Model-inferred policies are never permitted to alter real physical state until validated against deterministic safety invariants.",
    stateEstimationToFeedbackLoop:
      "Rigid causal pipeline: Sensor measurement -> State reconstruction (equilibrium fitting) -> Forward prediction -> Candidate actuation -> Verification -> Deterministic reflex execution.",
    deterministicSafetySeparatedFromAI:
      "Critical boundary separation: High-dimensional AI optimization recommends candidates, but deterministic non-learning safety rails have veto power and execute emergency stop independently of neural network weights.",
    constraintEnforcementFailClosed:
      "Fail-closed invariant: If an actuator command or estimated state leaves Omega_safe, the reflex system immediately executes STOP. No fallback to fuzzy reasoning or self-healing extrapolation.",
    provenanceRequirements:
      "Strict immutability across data sources: Sensor measurements, reconstructed states, forward predictions, and optimizer recommendations must retain distinct epistemic tags and cannot be conflated.",
    humanAuthorityBoundaries:
      "Authority operates across timescales: Sovereign humans define the operational envelope Omega_safe at governance cadence; the machine operates reflexes at millisecond speed strictly bounded within that envelope.",
    crossTerrainModularity:
      "The (Human defines Omega_safe -> Agent recommends -> Policy verifies -> Act -> Ledger) pipeline transfers symmetrically to fly-by-wire aviation envelopes, electrical grid dispatch, planetary bio-membranes, and high-frequency autonomous systems."
  },
  epistemicAudit: {
    observed: [
      "Source demonstrates deep RL policy outputting target voltages to 19 magnetic coils at 20-100Hz on the TCV tokamak.",
      "Source utilizes a high-fidelity physical simulator (FGS/TokSys) to train policies prior to live chamber discharge.",
      "Source incorporates real-time voltage and current boundary limiters that override agent commands to protect physical coils.",
      "Magnetic reconstruction algorithms estimate internal flux surfaces from external flux loops and magnetic probes."
    ],
    derived: [
      "Human authorization cannot be serialized per-millisecond without stalling rapid physical dynamics.",
      "The human sovereign locus is mathematically transferred to the definition and cryptographic locking of Omega_safe.",
      "Deterministic safety rails must be implemented in simple, auditable, non-neural logic that cannot hallucinate.",
      "A ledger commit must record both compliant reflex cycles and envelope-breach emergency stop events."
    ],
    analogy: [
      "Pathfinder's Sovereign Kernel (Agent recommends -> Policy constrains -> Human authorises -> Commit) maps directly to supervisory envelope authority.",
      "JEMMA's Ground-Truth Physical Reality Guardian maps to the deterministic physics boundary monitor.",
      "Antikythera deterministic gear kinematic rails parallel the tokamak hardware coil current limits."
    ],
    speculativeRejected: [
      "REJECTED: Long-distance electromagnetic distribution conjectures. Plasma magnetic confinement physics in a closed toroidal vacuum vessel does not provide physical evidence for unbounded remote energy transmission.",
      "REJECTED: End-to-end neural autonomous governance. AI agents cannot self-modify their operational envelope or redefine stability criteria."
    ]
  },
  sovereignKernelTest: {
    formula: "Human defines Omega_safe -> Agent recommends -> Policy verifies -> System acts within Omega_safe -> Ledger records",
    invariant: "x_t not in Omega_safe => STOP",
    timescaleDecoupling: "Authority defines the permissible state-space. Machine executes deterministic reflex control inside it, but may never redefine it."
  },
  minimumArchitecturalChange:
    "1. Introduce BoundedOperationalEnvelope (Omega_safe) with pre-authorized state bounds and rate limits. 2. Enforce Epistemic Separation Quad (MEASURED != ESTIMATED != SIMULATED != RECOMMENDED). 3. Implement fail-closed STOP invariant in deterministic reflex control loops."
};

/**
 * Validate that an epistemic transition respects the non-conflation law:
 * MEASURED != ESTIMATED != SIMULATED != RECOMMENDED
 */
export function validateEpistemicSeparation(obj: EpistemicObject): {
  valid: boolean;
  message: string;
} {
  if (!obj.tier) {
    return { valid: false, message: "Missing epistemic tier designation." };
  }

  // Ensure source matches tier semantics
  if (obj.tier === "MEASURED" && (obj.provenance.sourceId.includes("agent") || obj.provenance.sourceId.includes("model"))) {
    return {
      valid: false,
      message: "EPISTEMIC VIOLATION: Agent/Model output cannot be classified as MEASURED."
    };
  }

  if (obj.tier === "RECOMMENDED" && obj.provenance.sourceId.includes("sensor")) {
    return {
      valid: false,
      message: "EPISTEMIC VIOLATION: Raw sensor cannot be classified as RECOMMENDED action."
    };
  }

  return {
    valid: true,
    message: `Valid Epistemic Object: [${obj.tier}] variable '${obj.variableName}' backed by source '${obj.provenance.sourceId}'.`
  };
}

/**
 * Execute a deterministic reflex cycle against the authorized Bounded Operational Envelope Omega_safe
 */
export function runReflexControlCycle(
  envelope: BoundedOperationalEnvelope,
  simulatedBreach: boolean = false
): ReflexControlCycle {
  const cycleId = `CYC-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const timestamp = new Date().toISOString();

  // 1. MEASURED: Physical sensor reading
  const sensorValue = simulatedBreach ? 885.4 : 742.0 + (Math.random() * 8.0 - 4.0);
  const measured: EpistemicObject<number> = {
    id: `meas-${Date.now()}`,
    variableName: "core_temperature_c",
    value: Number(sensorValue.toFixed(1)),
    units: "°C",
    tier: "MEASURED",
    provenance: {
      sourceId: "THERMOCOUPLE-ARRAY-TC-09",
      timestamp,
      confidenceBounds: [sensorValue - 1.5, sensorValue + 1.5],
      sampleFrequencyHz: 1000
    },
    immutableSignature: `sig-meas-${Math.random().toString(16).substring(2, 10)}`
  };

  // 2. ESTIMATED: State observer / equilibrium reconstruction
  const estimatedVal = simulatedBreach ? 892.1 : sensorValue * 1.09 + (Math.random() * 2.0 - 1.0);
  const estimated: EpistemicObject<number> = {
    id: `est-${Date.now()}`,
    variableName: "plasma_core_t_reconstructed",
    value: Number(estimatedVal.toFixed(1)),
    units: "°C",
    tier: "ESTIMATED",
    provenance: {
      sourceId: "KALMAN-OBSERVER-FLUX-FITTER-V2",
      timestamp,
      confidenceBounds: [estimatedVal - 5.0, estimatedVal + 5.0]
    },
    immutableSignature: `sig-est-${Math.random().toString(16).substring(2, 10)}`
  };

  // 3. SIMULATED: Forward PDE digital twin prediction (t + 50ms)
  const simVal = simulatedBreach ? 910.5 : estimatedVal + (Math.random() * 4.0 - 2.0);
  const simulated: EpistemicObject<number> = {
    id: `sim-${Date.now()}`,
    variableName: "plasma_t_forward_50ms",
    value: Number(simVal.toFixed(1)),
    units: "°C",
    tier: "SIMULATED",
    provenance: {
      sourceId: "PATHFINDER-PDE-SOLVER-RUN-48",
      timestamp,
      confidenceBounds: [simVal - 8.0, simVal + 8.0]
    },
    immutableSignature: `sig-sim-${Math.random().toString(16).substring(2, 10)}`
  };

  // 4. RECOMMENDED: Candidate actuation from neural policy optimizer
  const recVal = simulatedBreach ? -18.5 : -7.2 + (Math.random() * 1.5 - 0.75);
  const recommended: EpistemicObject<number> = {
    id: `rec-${Date.now()}`,
    variableName: "poloidal_coil_voltage_kv",
    value: Number(recVal.toFixed(2)),
    units: "kV",
    tier: "RECOMMENDED",
    provenance: {
      sourceId: "AGENT-POLICY-DEEPMIND-RL-M4",
      timestamp
    },
    immutableSignature: `sig-rec-${Math.random().toString(16).substring(2, 10)}`
  };

  // 5. POLICY VERIFICATION: Check against Omega_safe
  const tempBound = envelope.stateBounds.find(b => b.variable === "core_temperature_c")!;
  const voltageBound = envelope.stateBounds.find(b => b.variable === "poloidal_coil_voltage_kv")!;

  const tempInside = measured.value <= tempBound.max && estimated.value <= tempBound.criticalEmergencyThreshold;
  const voltageInside = recommended.value >= voltageBound.min && recommended.value <= voltageBound.max;

  const insideEnvelope = tempInside && voltageInside && !simulatedBreach;
  const executionAction = insideEnvelope ? "ACTUATE_REFLEX" : "DETERMINISTIC_STOP";

  return {
    cycleId,
    timestamp,
    measuredState: measured,
    estimatedCoreState: estimated,
    simulatedTrajectory: simulated,
    agentRecommendedAction: recommended,
    policyVerified: true,
    insideEnvelope,
    executionAction,
    latencyMs: Math.round(8 + Math.random() * 6), // 8-14ms reflex loop
    ledgerCommitHash: `LEDGER-SHA256-${Math.random().toString(16).substring(2, 12).toUpperCase()}`
  };
}
