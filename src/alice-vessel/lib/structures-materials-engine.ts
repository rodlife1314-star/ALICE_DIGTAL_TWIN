/**
 * ALICE VESSEL STRUCTURES & MATERIALS CONSTITUTIVE ENGINE
 * 
 * Extracted permanent physical model for cellular solids, metamaterial lattice coupons,
 * Gibson-Ashby micromechanical scaling, and specific stiffness optimization.
 * 
 * Governing Formulation:
 * E* / Es = C · (rho* / rhos)^n
 * sigma_y* / sigma_ys = C_y · (rho* / rhos)^m
 */

import { sha256Hex } from "../../lib/crypto";

export type CellularLatticeTopology = "honeycomb" | "open_cell_foam" | "octet_truss" | "reentrant_auxetic";

export interface SolidBaseMaterial {
  name: string;
  youngsModulusGpa: number;    // E_s (e.g. 72.0 GPa for Aluminium 7075-T6, 160.0 GPa for Ti-6Al-4V)
  yieldStrengthMpa: number;    // sigma_ys (e.g. 500 MPa)
  densityGcm3: number;         // rho_s (e.g. 2.81 g/cm^3)
  poissonsRatio: number;       // nu_s (e.g. 0.33)
}

export interface CellularLatticeCoupon {
  topology: CellularLatticeTopology;
  relativeDensity: number;     // rho* / rho_s in [0.02, 0.50]
  baseMaterial: SolidBaseMaterial;
  cellWallThicknessUm?: number;
  cellDiameterMm?: number;
}

export interface GibsonAshbyAnalysisResult {
  topology: CellularLatticeTopology;
  relativeDensity: number;
  effectiveDensityGcm3: number;
  modulusRatio: number;        // E* / Es
  effectiveModulusGpa: number; // E*
  yieldStrengthRatio: number;  // sigma_y* / sigma_ys
  effectiveYieldStrengthMpa: number; // sigma_y*
  effectivePoissonsRatio: number;    // nu*
  effectiveShearModulusGpa: number;  // G* = E* / (2 * (1 + nu*))
  specificStiffnessMpm: number;      // (E* / rho*) in kN·m/kg
  mechanicsClass: "STRETCH_DOMINATED" | "BENDING_DOMINATED" | "AUXETIC_COMPLIANT";
  governingLaw: string;
  epistemicClass: "SIMULATED_BEHAVIOUR";
  auditHash: string;
}

export const CANONICAL_ALUMINIUM_7075: SolidBaseMaterial = {
  name: "Aluminium 7075-T6",
  youngsModulusGpa: 72.0,
  yieldStrengthMpa: 503.0,
  densityGcm3: 2.81,
  poissonsRatio: 0.33
};

/**
 * Computes deterministic Gibson-Ashby scaling mechanics for a cellular metamaterial coupon.
 */
export function analyzeGibsonAshbyLattice(
  coupon: CellularLatticeCoupon
): GibsonAshbyAnalysisResult {
  const { topology, relativeDensity, baseMaterial } = coupon;
  const relDensityClamped = Math.max(0.01, Math.min(0.60, relativeDensity));

  let c = 1.0;
  let n = 2.0;
  let cy = 0.3;
  let m = 1.5;
  let effectivePoissonsRatio = 0.33;
  let mechanicsClass: "STRETCH_DOMINATED" | "BENDING_DOMINATED" | "AUXETIC_COMPLIANT" = "BENDING_DOMINATED";

  switch (topology) {
    case "honeycomb":
      // Axial/In-plane stretch-dominated behavior
      c = 0.8;
      n = 1.0;
      cy = 0.5;
      m = 1.0;
      effectivePoissonsRatio = 0.40;
      mechanicsClass = "STRETCH_DOMINATED";
      break;

    case "open_cell_foam":
      // Classical strut bending-dominated behavior (Gibson & Ashby 1997)
      c = 1.0;
      n = 2.0;
      cy = 0.3;
      m = 1.5;
      effectivePoissonsRatio = 0.33;
      mechanicsClass = "BENDING_DOMINATED";
      break;

    case "octet_truss":
      // Triangulated stretch-dominated micro-architecture (Deshpande et al.)
      c = 0.3;
      n = 1.0;
      cy = 0.25;
      m = 1.0;
      effectivePoissonsRatio = 0.28;
      mechanicsClass = "STRETCH_DOMINATED";
      break;

    case "reentrant_auxetic":
      // Re-entrant negative Poisson's ratio cellular topology
      c = 0.6;
      n = 1.8;
      cy = 0.35;
      m = 1.4;
      effectivePoissonsRatio = -0.35;
      mechanicsClass = "AUXETIC_COMPLIANT";
      break;
  }

  // Modulus Ratio E* / Es = C * (rho* / rhos)^n
  const modulusRatio = c * Math.pow(relDensityClamped, n);
  const effectiveModulusGpa = modulusRatio * baseMaterial.youngsModulusGpa;

  // Yield Strength Ratio sigma_y* / sigma_ys = C_y * (rho* / rhos)^m
  const yieldStrengthRatio = cy * Math.pow(relDensityClamped, m);
  const effectiveYieldStrengthMpa = yieldStrengthRatio * baseMaterial.yieldStrengthMpa;

  // Effective Density rho* = relativeDensity * rho_s
  const effectiveDensityGcm3 = relDensityClamped * baseMaterial.densityGcm3;

  // Shear Modulus G* = E* / (2 * (1 + nu*))
  const effectiveShearModulusGpa = effectiveModulusGpa / (2 * (1 + effectivePoissonsRatio));

  // Specific Stiffness: E* / rho* (GPa / (g/cm^3) -> 10^9 N/m^2 / 10^3 kg/m^3 = 10^6 m^2/s^2)
  const specificStiffnessMpm = (effectiveModulusGpa * 1e3) / effectiveDensityGcm3;

  const governingLaw = `Gibson–Ashby Law: E*/Es = ${c} · (ρ*/ρs)^${n}, σy*/σys = ${cy} · (ρ*/ρs)^${m}`;

  const auditPayload = JSON.stringify({
    schema: "ALICE_GIBSON_ASHBY_V1",
    topology,
    relativeDensity: Number(relDensityClamped.toFixed(4)),
    effectiveModulusGpa: Number(effectiveModulusGpa.toFixed(4)),
    effectiveYieldStrengthMpa: Number(effectiveYieldStrengthMpa.toFixed(2)),
    modulusRatio: Number(modulusRatio.toFixed(6)),
    epistemicClass: "SIMULATED_BEHAVIOUR"
  });

  const auditHash = `0x${sha256Hex(auditPayload)}`;

  return {
    topology,
    relativeDensity: relDensityClamped,
    effectiveDensityGcm3,
    modulusRatio,
    effectiveModulusGpa,
    yieldStrengthRatio,
    effectiveYieldStrengthMpa,
    effectivePoissonsRatio,
    effectiveShearModulusGpa,
    specificStiffnessMpm,
    mechanicsClass,
    governingLaw,
    epistemicClass: "SIMULATED_BEHAVIOUR",
    auditHash
  };
}
