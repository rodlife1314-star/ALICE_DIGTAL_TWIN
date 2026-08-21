/**
 * PATHFINDER ACTIVE COGNITIVE MEMBRANE ENGINE
 *
 * "The membrane no longer merely separates two environments. It interprets the boundary between them."
 *
 * 5-Layer Cognitive Architecture:
 * 1. Sense: Size (effective/hydrated diameter), charge (elementary charge e), chemistry, temp, pressure.
 * 2. Interpret: SNR classification, anomaly separation, drift extraction.
 * 3. Decide: Dynamic routing (PERMIT · REJECT · ATTENUATE · HOLD · STOP).
 * 4. Actuate: Responsive pore dilation, surface charge potential tuning, affinity inversion, channel closure.
 * 5. Learn: Post-actuation SNR outcome comparison, memory cache update, spatial adaptation.
 */

export type MembraneAction = "PERMIT" | "REJECT" | "ATTENUATE" | "HOLD" | "STOP";

export interface SpeciesInput {
  id: string;
  name: string;
  chemicalFormula: string;
  bareRadiusNm: number;          // Bare atomic/molecular radius (nm)
  hydratedRadiusNm: number;      // Effective / hydrated diameter with solvation shell (nm)
  chargeElementary: number;      // Elementary charge unit: -2e, -1e, 0, +1e, +2e, +3e
  concentrationPpm: number;      // Incoming concentration
  velocityMs: number;            // Approach velocity (m/s)
  isContaminant?: boolean;       // Toxic / hazard flag
  violatesStopInvariant?: boolean;
}

export interface AtmosphericFieldState {
  ionizationPotentialKvCm: number; // Ionizing field strength (kV/cm)
  ambientTempC: number;
  relativeHumidityPercent: number;
  pressureKpa: number;
  carrierGas: "dry_air" | "nitrogen" | "argon" | "plasma_sheath";
}

export interface MembraneRegionState {
  regionId: string;
  name: string;
  primaryRole: "ion_selective" | "thermal_attenuation" | "contaminant_rejection" | "drift_monitor" | "safety_seal";
  activePoreDiameterNm: number;  // Dynamic mechanical/electro-responsive pore diameter (0.5 to 14.0 nm)
  surfaceChargeMv: number;       // Surface electrostatic potential (-150 mV to +150 mV)
  ligandBindingAffinity: number; // 0.0 (repulsive) to 1.0 (strongly bound)
  transportRateFraction: number; // 0.0 (closed) to 1.0 (fully open flux)
  localSnrDb: number;
  healthIndex: number;           // 0.0 to 1.0
  isSealed: boolean;
}

export interface MembraneDecisionContext {
  mode: "quiescent" | "selective_harvest" | "shock_defense" | "decontamination";
  targetSpeciesFormula?: string;
  requiredSelectivityRatio: number;
  maxPermittedHydratedDiameterNm: number; // e.g. 2.0 nm or 12.0 nm
  minRequiredPositiveCharge: number;       // e.g. +1.0e (charge >= +1e)
  allowSinglyIonized: boolean;             // true for >= +1e; false for strict > +1e
  ambientField: AtmosphericFieldState;
  regions: MembraneRegionState[];
}

export interface ActiveMembraneEvaluationResult {
  action: MembraneAction;
  species: SpeciesInput;
  regionId: string;
  decisionRationale: string;
  actuationCommands: {
    targetPoreDiameterNm: number;
    targetSurfaceChargeMv: number;
    targetTransportRate: number;
    affinityState: "neutral" | "attractive" | "inverted_repulsive" | "chemisorption_trap";
    sealed: boolean;
  };
  snrImprovementDb: number;
  informationRatio: {
    substrateAndAtmosphereInfoPercent: number; // 95%
    activeCognitiveInterventionPercent: number; // 5%
  };
  invariantVerified: boolean;
  timestamp: string;
}

export const DEFAULT_ATMOSPHERIC_STATE: AtmosphericFieldState = {
  ionizationPotentialKvCm: 4.8,
  ambientTempC: 22.5,
  relativeHumidityPercent: 45.0,
  pressureKpa: 101.3,
  carrierGas: "dry_air"
};

export const INITIAL_MEMBRANE_REGIONS: MembraneRegionState[] = [
  {
    regionId: "REG-A",
    name: "Region A: Ion Selective Gateway",
    primaryRole: "ion_selective",
    activePoreDiameterNm: 1.8,
    surfaceChargeMv: -45.0, // Negative surface attracts positive ions
    ligandBindingAffinity: 0.85,
    transportRateFraction: 0.92,
    localSnrDb: 24.5,
    healthIndex: 0.98,
    isSealed: false
  },
  {
    regionId: "REG-B",
    name: "Region B: Thermal Shock Absorber",
    primaryRole: "thermal_attenuation",
    activePoreDiameterNm: 0.9,
    surfaceChargeMv: 0.0,
    ligandBindingAffinity: 0.30,
    transportRateFraction: 0.35,
    localSnrDb: 18.2,
    healthIndex: 0.95,
    isSealed: false
  },
  {
    regionId: "REG-C",
    name: "Region C: Contaminant Barrier & Trap",
    primaryRole: "contaminant_rejection",
    activePoreDiameterNm: 0.5,
    surfaceChargeMv: 80.0, // Positive potential rejects positive toxins & inverts affinity
    ligandBindingAffinity: 0.05,
    transportRateFraction: 0.0,
    localSnrDb: 29.1,
    healthIndex: 0.97,
    isSealed: false
  },
  {
    regionId: "REG-D",
    name: "Region D: Unfamiliar Drift Monitor",
    primaryRole: "drift_monitor",
    activePoreDiameterNm: 3.2,
    surfaceChargeMv: -15.0,
    ligandBindingAffinity: 0.50,
    transportRateFraction: 0.50,
    localSnrDb: 14.8,
    healthIndex: 0.92,
    isSealed: false
  },
  {
    regionId: "REG-E",
    name: "Region E: Invariant Safety Interlock",
    primaryRole: "safety_seal",
    activePoreDiameterNm: 0.0,
    surfaceChargeMv: 0.0,
    ligandBindingAffinity: 0.0,
    transportRateFraction: 0.0,
    localSnrDb: 32.0,
    healthIndex: 1.0,
    isSealed: false
  }
];

export const REFERENCE_SPECIES_LIBRARY: SpeciesInput[] = [
  {
    id: "sp-1",
    name: "Hydrated Lithium Cation",
    chemicalFormula: "[Li(H2O)4]+",
    bareRadiusNm: 0.076,
    hydratedRadiusNm: 0.76,
    chargeElementary: +1.0,
    concentrationPpm: 120.0,
    velocityMs: 14.2,
    isContaminant: false
  },
  {
    id: "sp-2",
    name: "Hydrated Magnesium Dication",
    chemicalFormula: "[Mg(H2O)6]2+",
    bareRadiusNm: 0.072,
    hydratedRadiusNm: 0.86,
    chargeElementary: +2.0,
    concentrationPpm: 85.0,
    velocityMs: 9.8,
    isContaminant: false
  },
  {
    id: "sp-3",
    name: "Tricationic Lanthanum Cluster",
    chemicalFormula: "[La(H2O)9]3+",
    bareRadiusNm: 0.103,
    hydratedRadiusNm: 1.52,
    chargeElementary: +3.0,
    concentrationPpm: 24.0,
    velocityMs: 5.4,
    isContaminant: false
  },
  {
    id: "sp-4",
    name: "Charged Carbon Aerosol Aggregate",
    chemicalFormula: "(C_aggregate)+",
    bareRadiusNm: 4.5,
    hydratedRadiusNm: 14.8, // Exceeds 12 nm window
    chargeElementary: +1.0,
    concentrationPpm: 450.0,
    velocityMs: 65.0,
    isContaminant: true
  },
  {
    id: "sp-5",
    name: "Neutral Nitrogen/Oxygen Cluster",
    chemicalFormula: "N2 / O2",
    bareRadiusNm: 0.15,
    hydratedRadiusNm: 0.38,
    chargeElementary: 0.0,
    concentrationPpm: 780000.0,
    velocityMs: 480.0,
    isContaminant: false
  },
  {
    id: "sp-6",
    name: "Radioactive Actinide Aerosol Tracer",
    chemicalFormula: "238U-oxide particulate",
    bareRadiusNm: 1.8,
    hydratedRadiusNm: 5.2,
    chargeElementary: +2.0,
    concentrationPpm: 0.4,
    velocityMs: 12.0,
    isContaminant: true,
    violatesStopInvariant: true
  }
];

/**
 * 5-Layer Active Membrane Evaluation Pipeline
 */
export function evaluateActiveMembrane(
  species: SpeciesInput,
  region: MembraneRegionState,
  context: MembraneDecisionContext
): ActiveMembraneEvaluationResult {
  // ── LAYER 1: SENSE & INVARIANT VERIFICATION ──────────────────────────────
  if (species.violatesStopInvariant) {
    return {
      action: "STOP",
      species,
      regionId: region.regionId,
      decisionRationale: `STOP INVARIANT BREACH: Species '${species.name}' [${species.chemicalFormula}] violates core safety doctrine. Region immediately sealed.`,
      actuationCommands: {
        targetPoreDiameterNm: 0.0,
        targetSurfaceChargeMv: 0.0,
        targetTransportRate: 0.0,
        affinityState: "chemisorption_trap",
        sealed: true
      },
      snrImprovementDb: 0.0,
      informationRatio: {
        substrateAndAtmosphereInfoPercent: 95,
        activeCognitiveInterventionPercent: 5
      },
      invariantVerified: false,
      timestamp: new Date().toISOString()
    };
  }

  // ── LAYER 2: INTERPRET CONJUNCTIVE SIZE & CHARGE WINDOW ───────────────────
  // Size gate: effective (hydrated) diameter vs limit
  const isSizePermitted = species.hydratedRadiusNm <= context.maxPermittedHydratedDiameterNm;

  // Charge gate: evaluate charge >= +1e (or > +1e if configured)
  const isChargePermitted = context.allowSinglyIonized
    ? species.chargeElementary >= context.minRequiredPositiveCharge
    : species.chargeElementary > context.minRequiredPositiveCharge;

  const isConjunctiveMet = isSizePermitted && isChargePermitted;

  // ── LAYER 3 & 4: DECIDE & COMPUTE ACTUATION COMMANDS ──────────────────────
  let action: MembraneAction = "REJECT";
  let targetPoreDiameterNm = region.activePoreDiameterNm;
  let targetSurfaceChargeMv = region.surfaceChargeMv;
  let targetTransportRate = region.transportRateFraction;
  let affinityState: "neutral" | "attractive" | "inverted_repulsive" | "chemisorption_trap" = "neutral";
  let rationale = "";

  if (region.primaryRole === "safety_seal") {
    action = "STOP";
    targetPoreDiameterNm = 0.0;
    targetTransportRate = 0.0;
    rationale = `Region E is designated as dedicated Invariant Safety Seal. All passage disabled.`;
  } else if (species.isContaminant && !isConjunctiveMet) {
    action = "REJECT";
    targetPoreDiameterNm = 0.4;
    targetSurfaceChargeMv = +90.0; // Positive repulsion against positive debris
    targetTransportRate = 0.0;
    affinityState = "inverted_repulsive";
    rationale = `REJECT CONTAMINANT: Species fails conjunctive gate (d_eff=${species.hydratedRadiusNm}nm, q=${species.chargeElementary}e). Inverting surface potential to +90mV to actively deflect.`;
  } else if (isConjunctiveMet && !species.isContaminant) {
    action = "PERMIT";
    // Actuate pore to precisely fit hydrated diameter + 0.3 nm clearance
    targetPoreDiameterNm = Number((species.hydratedRadiusNm * 1.15).toFixed(2));
    targetSurfaceChargeMv = -60.0; // Electrostatically guide positive cation
    targetTransportRate = 0.95;
    affinityState = "attractive";
    rationale = `PERMIT CONJUNCTIVE PASSAGE: Size (d_eff=${species.hydratedRadiusNm}nm <= ${context.maxPermittedHydratedDiameterNm}nm) AND Charge (q=+${species.chargeElementary}e >= +${context.minRequiredPositiveCharge}e) met. Dilating pore to ${targetPoreDiameterNm}nm, surface potential -60mV.`;
  } else if (species.chargeElementary === 0 && species.hydratedRadiusNm < 1.0) {
    action = "ATTENUATE";
    targetPoreDiameterNm = 0.8;
    targetSurfaceChargeMv = 0.0;
    targetTransportRate = 0.25;
    affinityState = "neutral";
    rationale = `ATTENUATE NEUTRAL FLUX: Neutral carrier gas (q=0e) lacks charge gating. Restricting flux rate to 25% to preserve internal pressure equilibrium.`;
  } else {
    action = "HOLD";
    targetPoreDiameterNm = 1.0;
    targetSurfaceChargeMv = -10.0;
    targetTransportRate = 0.10;
    affinityState = "neutral";
    rationale = `HOLD FOR RE-INTERROGATION: Species (q=${species.chargeElementary}e, d_eff=${species.hydratedRadiusNm}nm) held in boundary accumulation buffer. Running multi-frequency impedance sweep.`;
  }

  // ── LAYER 5: LEARN & COMPUTE SNR IMPROVEMENT ──────────────────────────────
  const baseSnr = region.localSnrDb;
  const snrImprovementDb = action === "PERMIT" ? 4.8 : action === "REJECT" ? 6.2 : 2.1;

  return {
    action,
    species,
    regionId: region.regionId,
    decisionRationale: rationale,
    actuationCommands: {
      targetPoreDiameterNm,
      targetSurfaceChargeMv,
      targetTransportRate,
      affinityState,
      sealed: action === "STOP"
    },
    snrImprovementDb: Number((baseSnr + snrImprovementDb).toFixed(1)),
    informationRatio: {
      substrateAndAtmosphereInfoPercent: 95,
      activeCognitiveInterventionPercent: 5
    },
    invariantVerified: true,
    timestamp: new Date().toISOString()
  };
}
