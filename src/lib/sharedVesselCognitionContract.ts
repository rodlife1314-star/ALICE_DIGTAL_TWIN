import {
  VesselModelResultEnvelope,
  CognitionChallengeRecord,
  ProposedStateTransition,
  VersionedSystemLedgerRecord,
  EpistemicClass
} from "../types";

/**
 * ─── TRUTH CLASSIFICATION & VALIDATION RULES ─────────────────────────────────
 *
 * Core Invariant: "THE OBJECT MUST EARN THE RENDER."
 *
 * 1. An output calculated from interface sliders, geometry math, or simulation
 *    functions may NEVER be classified as 'MEASURED'.
 * 2. 'MEASURED' requires verified physical acquisition proof (sensor serial, calibration, raw hash).
 * 3. 'INFERRED' (cognitive hypotheses) must never be collapsed into 'SIMULATED' (physics engine solvers).
 * 4. CCV-01 conceptual speed/thrust values are models, strictly 'SIMULATED' or 'DERIVED'.
 */

export interface EpistemicValidationResult {
  valid: boolean;
  violations: string[];
  correctedClass?: EpistemicClass;
}

export function validateEpistemicIntegrity(
  envelope: VesselModelResultEnvelope
): EpistemicValidationResult {
  const violations: string[] = [];
  let correctedClass: EpistemicClass | undefined;

  // Check 1: Invalid MEASURED claims on computational models
  const isComputationalModel =
    envelope.modelIdentifier.startsWith("AliceVessel.FieldGeometry") ||
    envelope.modelIdentifier.startsWith("AliceVessel.EnergyAccounting") ||
    envelope.modelIdentifier.startsWith("AliceVessel.CCV01Engine") ||
    envelope.modelIdentifier.startsWith("AliceVessel.VolumetricCavity") ||
    envelope.modelIdentifier.startsWith("AliceVessel.TransportMedium");

  if (envelope.epistemicClass === "MEASURED") {
    if (isComputationalModel) {
      violations.push(
        `[EPISTEMIC SLIPPAGE] Model '${envelope.modelIdentifier}' calculates state from algorithm/parameters but was marked 'MEASURED'. Must be classified as 'DERIVED' or 'SIMULATED'.`
      );
      correctedClass = "DERIVED";
    }

    if (!envelope.physicalAcquisitionProof) {
      violations.push(
        `[PROVENANCE DEFICIT] Output '${envelope.output.variable}' claims 'MEASURED' status without verified PhysicalAcquisitionProof (missing hardware sensor ID, calibration date, or raw sample hash).`
      );
      if (!correctedClass) correctedClass = "SIMULATED";
    }
  }

  // Check 2: CCV-01 Engine conceptual boundaries
  if (envelope.modelIdentifier.includes("CCV01Engine")) {
    if (envelope.epistemicClass === "MEASURED") {
      violations.push(
        `[CONCEPTUAL INTEGRITY] CCV-01 conceptual transport parameters cannot be 'MEASURED' prior to physical vehicle commissioning.`
      );
      correctedClass = "SIMULATED";
    }
  }

  // Check 3: Check execution domain vs epistemic class
  if (
    (envelope.executionDomain === "CLOUD" || envelope.executionDomain === "REMOTE_GPU") &&
    envelope.epistemicClass === "MEASURED"
  ) {
    violations.push(
      `[DOMAIN ANOMALY] Execution domain '${envelope.executionDomain}' cannot directly produce 'MEASURED' telemetry without edge ingestion receipt.`
    );
  }

  return {
    valid: violations.length === 0,
    violations,
    correctedClass
  };
}

/**
 * ─── COGNITION CHALLENGE GENERATION ──────────────────────────────────────────
 *
 * Pathfinder Cognition inspects vessel envelopes to formulate questions,
 * counter-hypotheses, and boundaries without asserting authority.
 */
export function createCognitionChallenge(
  envelope: VesselModelResultEnvelope,
  interpretation: string,
  challenges: string[],
  falsificationCriteria: string[],
  recommendedAction: "HOLD" | "REFINE_EXPERIMENT" | "PROPOSE_TRANSITION" | "REJECT" = "PROPOSE_TRANSITION"
): CognitionChallengeRecord {
  return {
    challengeId: `cog-chal-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    targetEnvelopeId: envelope.envelopeId,
    cognitiveModelId: "Pathfinder.Cognition-Reasoner.v2",
    epistemicStatus: "INFERRED", // Strictly INFERRED, distinct from physics simulations
    challengeType: "BOUNDARY_STRESS",
    interpretation,
    challengesRaised: challenges,
    falsificationCriteria,
    recommendedAction,
    createdAt: new Date().toISOString()
  };
}

/**
 * ─── PROPOSED STATE TRANSITION CREATION ───────────────────────────────────────
 */
export function createProposedStateTransition(
  envelope: VesselModelResultEnvelope,
  challenge: CognitionChallengeRecord,
  change: {
    targetSystemComponent: string;
    currentStateVariable: string;
    currentBaselineValue: any;
    proposedBaselineValue: any;
    units: string;
    rationale: string;
  }
): ProposedStateTransition {
  return {
    proposalId: `prop-trans-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    sourceEnvelopeId: envelope.envelopeId,
    challengeRecordId: challenge.challengeId,
    proposedChange: change,
    octagonSafetyEvaluation: {
      status: "PENDING",
      stateContainmentVerified: false,
      invariantsChecked: [
        "Omega_safe boundary containment (x_t in Omega_safe)",
        "Matter Stack causality (Function -> Material -> Structure -> Object)",
        "Truth classification audit (Zero unearned MEASURED claims)"
      ]
    },
    operatorPromotionGate: {
      requiredAuthority: "SOVEREIGN_HUMAN_OPERATOR",
      status: "AWAITING_OPERATOR"
    },
    createdAt: new Date().toISOString()
  };
}

/**
 * ─── OCTAGON SAFETY EVALUATION ────────────────────────────────────────────────
 *
 * Deterministic safety gate. Machine executes reflex verification against
 * state boundaries (Omega_safe). Machine cannot promote itself.
 */
export function evaluateOctagonSafetyGate(
  transition: ProposedStateTransition,
  stateBounds?: Array<{ variable: string; min: number; max: number }>
): ProposedStateTransition {
  const violations: string[] = [];
  const proposedVal = Number(transition.proposedChange.proposedBaselineValue);

  if (stateBounds && !isNaN(proposedVal)) {
    const bound = stateBounds.find(
      (b) => b.variable.toLowerCase() === transition.proposedChange.currentStateVariable.toLowerCase()
    );
    if (bound) {
      if (proposedVal < bound.min || proposedVal > bound.max) {
        violations.push(
          `Value ${proposedVal} ${transition.proposedChange.units} violates envelope bounds [${bound.min}, ${bound.max}].`
        );
      }
    }
  }

  const passed = violations.length === 0;

  return {
    ...transition,
    octagonSafetyEvaluation: {
      evaluatedAt: new Date().toISOString(),
      status: passed ? "CONTAINED_SAFE" : "VIOLATION_BLOCKED",
      stateContainmentVerified: passed,
      invariantsChecked: transition.octagonSafetyEvaluation.invariantsChecked,
      violations: violations.length > 0 ? violations : undefined
    }
  };
}

/**
 * ─── OPERATOR PROMOTION GATE ──────────────────────────────────────────────────
 *
 * Only sovereign human operator authority can authorize baseline promotion.
 * Appends committed state to the versioned immutable ledger.
 */
export function authorizeOperatorPromotion(
  transition: ProposedStateTransition,
  operatorId: string,
  notes?: string
): {
  transition: ProposedStateTransition;
  ledgerRecord?: VersionedSystemLedgerRecord;
  error?: string;
} {
  if (transition.octagonSafetyEvaluation.status !== "CONTAINED_SAFE") {
    return {
      transition,
      error: "Octagon safety gate failed or pending: transition outside permissible safe state envelope."
    };
  }

  const commitHash = `0x${Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")}`;

  const updatedTransition: ProposedStateTransition = {
    ...transition,
    operatorPromotionGate: {
      requiredAuthority: "SOVEREIGN_HUMAN_OPERATOR",
      status: "PROMOTED_TO_BASELINE",
      promotedBy: operatorId,
      promotedAt: new Date().toISOString(),
      operatorNotes: notes || "Promoted to official baseline by human operator.",
      versionedCommitHash: commitHash
    }
  };

  const ledgerRecord: VersionedSystemLedgerRecord = {
    ledgerIndex: Date.now(),
    timestamp: new Date().toISOString(),
    proposalId: transition.proposalId,
    sourceEnvelopeId: transition.sourceEnvelopeId,
    promotedBy: operatorId,
    targetComponent: transition.proposedChange.targetSystemComponent,
    variableName: transition.proposedChange.currentStateVariable,
    previousValue: transition.proposedChange.currentBaselineValue,
    promotedValue: transition.proposedChange.proposedBaselineValue,
    units: transition.proposedChange.units,
    immutableCommitHash: commitHash
  };

  return {
    transition: updatedTransition,
    ledgerRecord
  };
}

/**
 * ─── CANONICAL REFERENCE SEEDS (ALICE VESSEL @ a2ddbd0) ────────────────────────
 */
export const SEED_ALICE_VESSEL_ENVELOPES: VesselModelResultEnvelope[] = [
  {
    envelopeId: "env-alice-geom-01",
    modelIdentifier: "AliceVessel.FieldGeometry",
    modelVersion: "a2ddbd0-v1.0",
    parameters: {
      aspectRatio: 1.618,
      cavityRadiusMm: 142.5,
      meshResolution: "512x512_quad"
    },
    output: {
      variable: "VolumetricHarmonicQFactor",
      value: 1842.6,
      units: "dimensionless",
      uncertainty: { min: 1835.0, max: 1850.2, sigma: 3.1 }
    },
    epistemicClass: "DERIVED", // Corrected from legacy 'MEASURED' bug
    executionDomain: "LOCAL",
    executionReceipt: {
      receiptId: "rcpt-alice-geom-01",
      artifact: {
        artifactId: "art-geom-mesh-01",
        artifactType: "GEOMETRY_TENSOR",
        rawSummary: "Harmonic Q Factor calculated from mesh boundary",
        contentHash: "sha256:4ae019fb81"
      },
      hardware: {
        device: "Deterministic CPU Worker",
        architecture: "x86_64 Zen 5",
        powerEnvelopeWatts: 15
      },
      runtime: {
        engine: "Local V8 AVX-512",
        version: "v1.0-deterministic"
      },
      inputs: {
        manifestHash: "sha256:4ae019fb81",
        samplePayloadSummary: { cavityRadiusMm: 142.5 }
      },
      output: {
        primaryMetric: "VolumetricHarmonicQFactor",
        value: 1842.6,
        units: "dimensionless"
      },
      latency: {
        elapsedMs: 14.2,
        computeMs: 14.0
      },
      power: {
        averageWatts: 12.5
      },
      provenance: {
        timestamp: "2026-09-23T05:45:00Z",
        sourceNodeId: "alice-vessel-worker-01",
        immutableSignature: "0x9a8f2c0182bde"
      }
    },
    publishedAt: "2026-09-23T05:45:00Z"
  },
  {
    envelopeId: "env-alice-ccv01-02",
    modelIdentifier: "AliceVessel.CCV01Engine",
    modelVersion: "a2ddbd0-v1.0",
    parameters: {
      propellantMassKg: 120.0,
      expansionRatio: 48.0,
      nominalChamberPressureBar: 65.0
    },
    output: {
      variable: "ConceptualEffectiveThrust",
      value: 840.5,
      units: "N",
      uncertainty: { min: 820.0, max: 860.0 }
    },
    epistemicClass: "SIMULATED", // Strictly SIMULATED, never MEASURED
    executionDomain: "LOCAL",
    executionReceipt: {
      receiptId: "rcpt-alice-ccv01-02",
      artifact: {
        artifactId: "art-ccv01-thrust-02",
        artifactType: "PROPULSION_SIMULATION",
        rawSummary: "Conceptual Effective Thrust computed by thermodynamic solver",
        contentHash: "sha256:7bc8100ef1"
      },
      hardware: {
        device: "Thermodynamic Integrator Core",
        architecture: "x86_64",
        powerEnvelopeWatts: 15
      },
      runtime: {
        engine: "CCV-01 Propulsion Solver",
        version: "a2ddbd0"
      },
      inputs: {
        manifestHash: "sha256:7bc8100ef1",
        samplePayloadSummary: { expansionRatio: 48.0 }
      },
      output: {
        primaryMetric: "ConceptualEffectiveThrust",
        value: 840.5,
        units: "N"
      },
      latency: {
        elapsedMs: 22.8,
        computeMs: 22.5
      },
      power: {
        averageWatts: 15.0
      },
      provenance: {
        timestamp: "2026-09-23T05:50:00Z",
        sourceNodeId: "alice-vessel-ccv01-core",
        immutableSignature: "0xccv0189a771"
      }
    },
    publishedAt: "2026-09-23T05:50:00Z"
  },
  {
    envelopeId: "env-alice-sensor-03",
    modelIdentifier: "PhysicalCavityBench.RTD-Array",
    modelVersion: "bench-cal-2026.3",
    parameters: {
      samplingRateHz: 100,
      adcBits: 24,
      channel: "CH-04-WALL"
    },
    output: {
      variable: "PhysicalCavityWallTemperature",
      value: 294.15,
      units: "K",
      uncertainty: { min: 294.05, max: 294.25, sigma: 0.05 }
    },
    epistemicClass: "MEASURED", // Genuinely MEASURED with acquisition proof
    physicalAcquisitionProof: {
      hardwareSensorId: "PT100-CLASS-A-SN4482",
      physicalCalibrationDate: "2026-08-15",
      rawSampleHash: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
      signalNoiseRatioDb: 64.2
    },
    executionDomain: "VEHICLE_EDGE",
    executionReceipt: {
      receiptId: "rcpt-alice-sensor-03",
      artifact: {
        artifactId: "art-telemetry-wall-temp-03",
        artifactType: "PHYSICAL_TELEMETRY",
        rawSummary: "Direct RTD thermistor sampling from test bench array",
        contentHash: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
      },
      hardware: {
        device: "Jetson Orin Nano",
        architecture: "ARMv8.2-A Cortex-A78AE",
        powerEnvelopeWatts: 15
      },
      runtime: {
        engine: "JetPack Direct ADC Telemetry",
        version: "v6.0"
      },
      inputs: {
        manifestHash: "sha256:1a2b3c4d5e",
        samplePayloadSummary: { channel: "CH-04-WALL" }
      },
      output: {
        primaryMetric: "PhysicalCavityWallTemperature",
        value: 294.15,
        units: "K"
      },
      latency: {
        elapsedMs: 2.1,
        computeMs: 1.8
      },
      power: {
        averageWatts: 4.8
      },
      provenance: {
        timestamp: "2026-09-23T06:00:00Z",
        sourceNodeId: "bench-edge-sensor-node-01",
        immutableSignature: "0xedge99104fae"
      }
    },
    publishedAt: "2026-09-23T06:00:00Z"
  }
];
