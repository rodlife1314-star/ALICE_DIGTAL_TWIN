import { DigitalTwin, DigitalTwinDomain, Observation, SimulationRun, EvidenceClassification } from "../types";

/**
 * PATHFINDER SPATIAL SCALE (PSS) HIERARCHY & RUNTIME CONTRACTS
 * 
 * "The database preserves. Sensors observe. Models interpret. Solvers calculate. 
 *  The ledger remembers. The Sovereign Operator decides."
 * 
 * Epistemic & Spatial Scale Hierarchy:
 * - PSS-0: Ecosystem (Atmosphere, surrounding strata, environmental boundary forces & cosmic sinks)
 * - PSS-1: System (Complete physical twin assembly, envelope, casing and macro-structure)
 * - PSS-2: Subsystem (Functional modules, gear trains, active regions, material strata)
 * - PSS-3: Component (Individual components, gear teeth, pin-slots, nanopores, tunnels)
 * - PSS-4: Microstructure (Micro-texture, electrostatic field potential wells, molecular hydration shells)
 */

export type PathfinderSpatialScale = 0 | 1 | 2 | 3 | 4;
export type SpatialLODLevel = PathfinderSpatialScale; // Backward compatibility alias

export const PSS_LABELS: Record<PathfinderSpatialScale, { code: string; name: string; description: string }> = {
  0: { code: "PSS-0", name: "PSS-0 · ECOSYSTEM", description: "Atmosphere, surrounding strata, environmental boundary forces & cosmic sinks" },
  1: { code: "PSS-1", name: "PSS-1 · SYSTEM", description: "Complete physical twin assembly, envelope, casing and macro-structure" },
  2: { code: "PSS-2", name: "PSS-2 · SUBSYSTEM", description: "Functional modules, gear trains, active regions, material strata" },
  3: { code: "PSS-3", name: "PSS-3 · COMPONENT", description: "Individual components, gear teeth, pin-slots, nanopores, tunnels" },
  4: { code: "PSS-4", name: "PSS-4 · MICROSTRUCTURE", description: "Micro-texture, electrostatic field potential wells, molecular hydration shells" }
};

export const LOD_LABELS = PSS_LABELS;

export type SpatialEvidenceClassification = 
  | "OBSERVED_GEOMETRY"                // Physically measured, CT-scanned, directly laser-scanned
  | "MEASURED_STATE"                   // Live sensor telemetry (probe temperature, pH, velocity, pressure)
  | "EVIDENCE_SUPPORTED_RECONSTRUCTION"// Reconstructed geometry backed by direct inscriptions/epigraphy/records
  | "MODEL_PARAMETER_ASSUMED"          // Assumed/Standardized parameters without direct specimen measurement
  | "MODEL_INFERRED_STRUCTURE"         // Computational gap fill, FEA/PDE derived mesh, interpolation
  | "SIMULATED_BEHAVIOUR"              // Interactive kinematic or particle trajectory output (Hypothetical)
  | "ILLUSTRATIVE_BOUNDARY";           // Conceptual boundary, flux envelope, coordinate grid

export interface SpatialVector3 {
  x: number;
  y: number;
  z: number;
}

export interface SpatialClassificationRevision {
  timestamp: string;
  fromClassification: SpatialEvidenceClassification;
  toClassification: SpatialEvidenceClassification;
  rationale: string;
  authorizingOperator: string;
  evidenceRefId?: string;
}

export type RenderQualityProfile = "low_power_mobile" | "balanced" | "scientific_high_fidelity";

export type SpatialFieldSource = "SOLVER" | "INTERPOLATED" | "PROCEDURAL_DEMO";

export interface SpatialFieldData {
  fieldType: "temperature_field" | "co2_concentration" | "electric_potential" | "ir_flux_density" | "shear_stress";
  fieldSource: SpatialFieldSource;
  scalarValue: number;
  minRange: number;
  maxRange: number;
  unit: string;
  meshResolution?: string;
  timestep?: string;
  solverRunId?: string;
  residual?: string;
  evidenceState: SpatialEvidenceClassification;
  lastSolverReceiptId?: string;
}

export interface InstancedParticleCollection {
  id: string;
  count: number;
  particleType: "ion" | "gas_molecule" | "termite_agent" | "photon_ray" | "nanopore";
  color: string;
  emissive?: string;
  size: number;
  bounds: {
    minX: number; maxX: number;
    minY: number; maxY: number;
    minZ: number; maxZ: number;
  };
  classification: SpatialEvidenceClassification;
  motionVelocity?: number;
  activeRate?: number;
}

export interface SpatialVisualNode {
  id: string;
  twinId: string;
  parentId?: string;
  lodLevel: PathfinderSpatialScale;
  entityId?: string;
  name: string;
  domain: DigitalTwinDomain | "substrate_workspace";
  classification: SpatialEvidenceClassification;
  classificationHistory?: SpatialClassificationRevision[];
  position: SpatialVector3;
  rotation?: SpatialVector3;
  scale?: SpatialVector3;
  explodedOffset?: SpatialVector3; // Direction and magnitude for exploded-view animation
  geometryType: 
    | "box" 
    | "sphere" 
    | "cylinder" 
    | "torus" 
    | "membrane_sheet" 
    | "gear_disc" 
    | "gear_tooth_ring"
    | "pin_and_slot"
    | "fluid_particles" 
    | "tunnel_network" 
    | "culinary_station" 
    | "radiator_panel" 
    | "vector_arrow" 
    | "atmosphere_column" 
    | "layered_metasurface"
    | "nanopore_channel"
    | "brood_chamber"
    | "ion_hydration_shell";
  dimensions: {
    width?: number;
    height?: number;
    depth?: number;
    radius?: number;
    tube?: number;
    segments?: number;
    headLength?: number;
    headRadius?: number;
    toothCount?: number;
    toothDepth?: number;
    poreDiameterNm?: number;
    channelLengthNm?: number;
  };
  materialProperties: {
    color: string;
    opacity: number;
    roughness?: number;
    metalness?: number;
    emissive?: string;
    emissiveIntensity?: number;
    wireframe?: boolean;
    transparent?: boolean;
    surfaceTexture?: "bronze_corrosion" | "soil_strata" | "silicon_metasurface" | "lipid_bilayer" | "none";
  };
  fieldData?: SpatialFieldData;
  subcomponents?: SpatialVisualNode[];
  instancedParticles?: InstancedParticleCollection[];
  liveMetrics?: Record<string, number | string | boolean>;
  observedVsSimulatedDelta?: {
    observedValue: number | string;
    simulatedValue: number | string;
    unit: string;
    deltaPct?: number;
    validationStatus: "VALIDATED" | "UNVALIDATED_DEVIATION" | "UNKNOWN" | "REQUIRES_SOURCE_RESOLUTION";
  };
  provenanceRef?: {
    evidenceId?: string;
    observationId?: string;
    sourceAsset?: string;
    confidenceScore?: number;
    attributionNote?: string;
  };
  snrRoute?: "STOP" | "HOLD" | "SURFACE" | "MONITOR" | "DISCARD";
}

export interface SpatialConnectionEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: string;
  classification: SpatialEvidenceClassification;
  medium?: string;
  fluxValue?: number;
  flowDirection?: "one_way" | "two_way" | "bidirectional_pulse";
  color?: string;
  activePulse?: boolean;
  minLod?: PathfinderSpatialScale;
}

export interface SpatialScene {
  id: string;
  twinId: string;
  domain: DigitalTwinDomain | "substrate_workspace";
  title: string;
  description: string;
  currentLOD: PathfinderSpatialScale;
  nodes: SpatialVisualNode[];
  edges: SpatialConnectionEdge[];
  instancedLayers?: InstancedParticleCollection[];
  environmentSettings: {
    ambientLightIntensity: number;
    directionalLightPosition: SpatialVector3;
    gridFloor: boolean;
    particleFlowActive: boolean;
    atmosphereFog?: string;
    simTimeScale: number;
  };
  viewingModes: {
    explodedFactor: number; // 0.0 to 1.0
    sectionalCutPlane: "NONE" | "Y_PLANE" | "Z_PLANE";
    sectionalCutPosition: number;
    activeFieldOverlay: "NONE" | "TEMPERATURE" | "CO2_CONCENTRATION" | "ELECTRIC_POTENTIAL" | "IR_FLUX";
    qualityProfile: RenderQualityProfile;
  };
  governingEquations: string[];
  truthLedgerSummary: {
    observedCount: number;
    reconstructedCount: number;
    inferredCount: number;
    simulatedCount: number;
    assumedCount?: number;
  };
}

export interface DomainSpatialAdapter {
  buildScene(twin: DigitalTwin, operatorParameters?: Record<string, any>, lodLevel?: PathfinderSpatialScale): SpatialScene;
  applyOperatorChange(change: Record<string, any>, currentScene: SpatialScene): {
    calculatedMetrics: Record<string, any>;
    governanceAlert?: string;
    snrStatus: "STOP" | "HOLD" | "SURFACE" | "MONITOR" | "DISCARD";
  };
  runSimulation(scene: SpatialScene, stepDelta: number): SpatialScene;
}

/**
 * NVIDIA SPATIAL COMPUTE HANDOFF INTERFACE CONTRACTS
 */

export interface SpatialComputeRequest {
  twinId: string;
  spatialScale: PathfinderSpatialScale;
  selectedRegion?: string;
  targetEntityId?: string;
  physicsDomain: "thermal_radiation" | "electrochemistry" | "kinematics" | "bio_aerodynamics" | "fluid_emulsion";
  boundaryConditions: Record<string, any>;
  requestedResolution: string; // e.g. "128x128x64 FVM" | "3D-FEA 0.1mm" | "Particle-Direct 100k"
  timeWindow: { start: number; end: number; step: number };
  convergenceCriteria?: { maxResidual: number; maxIterations: number };
  convergenceTolerance?: number;
}

export interface SpatialComputeResult {
  requestId: string;
  twinId: string;
  spatialScale: PathfinderSpatialScale;
  physicsDomain: string;
  fieldData: SpatialFieldData;
  geometryPatch?: {
    affectedNodeIds: string[];
    transformUpdates?: Record<string, { position?: SpatialVector3; rotation?: SpatialVector3 }>;
  };
  
  // High-Grade Provider Execution & Hardware Attestation
  providerJobId: string;
  providerEndpoint: string;
  solverFramework: string;
  solverVersion: string;
  hardwareReportedByProvider: string;
  
  // Mathematical Convergence Contract
  requestedTolerance: number;
  finalResidual: number;
  toleranceRatio: number; // finalResidual / requestedTolerance
  convergenceStatus: boolean; // strictly (finalResidual <= requestedTolerance)
  stoppingCriterion: "TOLERANCE_MET" | "MAX_ITERATIONS_REACHED" | "DIVERGENCE_DETECTED" | "TIME_STEP_LIMIT";
  iterationsExecuted: number;
  meshShape: [number, number, number];
  fieldArtifactReference: string;
  
  // Timing & Execution Profiling Breakdown
  executionBreakdown: {
    remoteRoundTripTimeMs: number;
    queueTimeMs: number;
    kernelTimeMs: number;
    wallTimeMs: number;
  };
  
  // Verifiable Cryptographic Receipts (True 64-char SHA-256)
  inputManifestHash: string;
  rawOutputHash: string;
  receiptHash: string;
  providerSignatureOrVerifiableAttestation: {
    attestationType: string;
    signer: string;
    keyFingerprint: string;
    verified: boolean;
    signature: string;
  };
  
  // Epistemic Routing & Conflict Details
  epistemicRoute: "HOLD" | "SURFACE" | "STOP" | "REJECTED";
  conflictRationale?: string;
  
  solverMetadata: {
    solverName: string;
    solverVersion: string;
    hardwareTarget: string;
    executionTimeMs: number;
    iterations: number;
  };
  convergenceState: "CONVERGED" | "DIVERGED" | "TERMINATED_MAX_ITER" | "NOT_CONVERGED_TOLERANCE_EXCEEDED";
  residual: number;
  uncertainty: number;
  computeReceipt: {
    receiptId: string;
    rail: string;
    solverIdentity: string;
    timestamp: string;
    hash: string;
    evidenceState: SpatialEvidenceClassification;
    verified: boolean;
  };
  appliedToCanonicalState: boolean;
}
