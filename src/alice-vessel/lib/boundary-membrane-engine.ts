/**
 * ALICE VESSEL BOUNDARY MEMBRANE & TRANSPORT ENGINE
 * 
 * Extracted permanent physical and cognitive model for the outer protective boundary,
 * selective electro-hydrodynamic filtration, Donnan charge exclusion, piezoresistive strain
 * transduction, and kinetic dissipation.
 * 
 * "The boundary membrane does not merely separate environments. It interprets and governs the flux between them."
 */

import { sha256Hex } from "../../lib/crypto";

export type BoundaryMembraneAction = "PERMIT" | "REJECT" | "ATTENUATE" | "HOLD" | "STOP";

export interface TransitingSpecies {
  id: string;
  name: string;
  formula: string;
  hydratedRadiusNm: number;      // Stokes-Einstein hydrated radius (nm)
  chargeElementary: number;      // e.g. -2, -1, 0, +1, +2, +3
  velocityMs: number;            // Incoming approach velocity (m/s)
  massDaltons?: number;          // Molecular mass
  isHazard?: boolean;
}

export interface MembraneRegionMicrostate {
  regionId: string;
  nominalPoreRadiusNm: number;   // Baseline physical pore radius (nm)
  appliedBiasVoltageV: number;   // Applied electro-actuation bias (-2.0V to +2.0V)
  surfaceChargeMv: number;       // Surface electrostatic potential (-150 mV to +150 mV)
  piezoresistiveGaugeFactor: number; // GF = 14.8
  tensileStrainPercent: number;  // Current measured strain (0.0% to 5.0%)
  maxSafeRuptureStrainPercent: number; // 2.5% safe limit
}

export interface BoundaryMembraneEvaluationResult {
  action: BoundaryMembraneAction;
  rejectionReason?: string;
  effectivePoreRadiusNm: number;
  sizeExclusionRatio: number;      // r_hydrated / r_effective_pore
  donnanPotentialBarrierKbt: number; // Dimensionless energy barrier
  electrostaticRejectionPercent: number; // 0 to 100%
  fluxPermeabilityFraction: number; // 0.0 (fully blocked) to 1.0 (unimpeded)
  measuredImpedanceDeltaPercent: number; // Delta R / R0 = GF * epsilon
  isStructuralRuptureImminent: boolean;
  epistemicClass: "NOMINAL_TRANSPORT" | "SIMULATED_BEHAVIOUR" | "STOP_INVARIANT_TRIP";
  auditHash: string;
}

// Physical constants at room temperature (298 K)
const THERMAL_VOLTAGE_MV = 25.69; // k_B * T / e in mV
const PIEZO_ELECTRO_RESPONSIVENESS_NM_PER_V = 0.85; // nm pore dilation per Volt

/**
 * Evaluates transport across the boundary membrane.
 * Enforces:
 * 1. Rupture check: If strain exceeds rupture threshold -> STOP.
 * 2. Size exclusion: If hydrated radius exceeds dynamic pore radius -> REJECT.
 * 3. Donnan exclusion: Electrostatic repulsion of co-ions.
 * 4. Piezoresistive impedance shift: Delta R / R0 = GF * strain.
 */
export function evaluateBoundaryMembraneTransport(
  species: TransitingSpecies,
  microstate: MembraneRegionMicrostate
): BoundaryMembraneEvaluationResult {
  const {
    nominalPoreRadiusNm,
    appliedBiasVoltageV,
    surfaceChargeMv,
    piezoresistiveGaugeFactor,
    tensileStrainPercent,
    maxSafeRuptureStrainPercent
  } = microstate;

  // 1. Structural Rupture Invariant Check
  const isStructuralRuptureImminent = tensileStrainPercent >= maxSafeRuptureStrainPercent;
  const measuredImpedanceDeltaPercent = piezoresistiveGaugeFactor * tensileStrainPercent;

  if (isStructuralRuptureImminent) {
    const auditHash = `0x${sha256Hex(JSON.stringify({
      status: "RUPTURE_STOP",
      strain: tensileStrainPercent,
      limit: maxSafeRuptureStrainPercent
    }))}`;
    return {
      action: "STOP",
      rejectionReason: `Active membrane structural rupture limit exceeded (${tensileStrainPercent.toFixed(2)}% >= ${maxSafeRuptureStrainPercent.toFixed(2)}%)`,
      effectivePoreRadiusNm: 0,
      sizeExclusionRatio: Infinity,
      donnanPotentialBarrierKbt: 0,
      electrostaticRejectionPercent: 100,
      fluxPermeabilityFraction: 0,
      measuredImpedanceDeltaPercent,
      isStructuralRuptureImminent: true,
      epistemicClass: "STOP_INVARIANT_TRIP",
      auditHash
    };
  }

  // 2. Dynamic Pore Electro-Actuation
  // r_p(V) = r_0 + alpha * V
  const effectivePoreRadiusNm = Math.max(0.2, nominalPoreRadiusNm + PIEZO_ELECTRO_RESPONSIVENESS_NM_PER_V * appliedBiasVoltageV);

  // 3. Hydrodynamic Size Exclusion (Stokes-Einstein)
  const sizeExclusionRatio = species.hydratedRadiusNm / effectivePoreRadiusNm;
  const isStericallyExcluded = sizeExclusionRatio > 1.0;

  // 4. Donnan Electrostatic Potential Barrier
  // Delta Phi = z * e * psi_surface / (k_B * T)
  const donnanPotentialBarrierKbt = (species.chargeElementary * surfaceChargeMv) / THERMAL_VOLTAGE_MV;
  
  // Rejection probability due to electrostatics
  let electrostaticRejectionPercent = 0;
  if (donnanPotentialBarrierKbt > 0) {
    // Like charges repel: potential barrier opposes passage
    electrostaticRejectionPercent = Math.min(99.9, (1 - Math.exp(-donnanPotentialBarrierKbt)) * 100);
  }

  // 5. Final Action Determination
  let action: BoundaryMembraneAction = "PERMIT";
  let rejectionReason: string | undefined = undefined;
  let fluxPermeabilityFraction = 1.0;

  if (species.isHazard) {
    action = "HOLD";
    rejectionReason = `Species ${species.name} flagged as operational hazard`;
    fluxPermeabilityFraction = 0.0;
  } else if (isStericallyExcluded) {
    action = "REJECT";
    rejectionReason = `Steric size exclusion: hydrated radius ${species.hydratedRadiusNm.toFixed(2)} nm exceeds pore ${effectivePoreRadiusNm.toFixed(2)} nm`;
    fluxPermeabilityFraction = 0.0;
  } else if (electrostaticRejectionPercent > 75.0) {
    action = "ATTENUATE";
    rejectionReason = `Donnan electrostatic repulsion (${electrostaticRejectionPercent.toFixed(1)}% barrier)`;
    fluxPermeabilityFraction = Math.max(0.01, 1.0 - electrostaticRejectionPercent / 100);
  } else {
    action = "PERMIT";
    // Minor steric drag reduction (Renkin equation approximation)
    fluxPermeabilityFraction = Math.max(0.1, Math.pow(1 - sizeExclusionRatio, 2));
  }

  const epistemicClass = action === "PERMIT" ? "NOMINAL_TRANSPORT" : "SIMULATED_BEHAVIOUR";

  const auditPayload = JSON.stringify({
    schema: "ALICE_BOUNDARY_MEMBRANE_V1",
    speciesId: species.id,
    effectivePoreRadiusNm: Number(effectivePoreRadiusNm.toFixed(4)),
    sizeExclusionRatio: Number(sizeExclusionRatio.toFixed(4)),
    electrostaticRejectionPercent: Number(electrostaticRejectionPercent.toFixed(2)),
    action,
    epistemicClass
  });

  const auditHash = `0x${sha256Hex(auditPayload)}`;

  return {
    action,
    rejectionReason,
    effectivePoreRadiusNm,
    sizeExclusionRatio,
    donnanPotentialBarrierKbt,
    electrostaticRejectionPercent,
    fluxPermeabilityFraction,
    measuredImpedanceDeltaPercent,
    isStructuralRuptureImminent: false,
    epistemicClass,
    auditHash
  };
}
