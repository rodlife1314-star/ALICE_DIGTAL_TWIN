/**
 * ALICE CONVECTIVE BUOYANCY & POROUS TRANSPORT ENGINE
 * 
 * Extracted generic physical model for natural stack-effect thermal buoyancy,
 * convective chimney circulation, Grashof/Rayleigh onset numbers, and Darcy porous media flow.
 * 
 * Reusable across vehicle avionics cooling stacks, regenerative heat exchangers, and porous
 * protective matrices.
 */

import { sha256Hex } from "../../lib/crypto";

export const STANDARD_GRAVITY = 9.80665; // m/s^2
export const AIR_SPECIFIC_HEAT_J_KG_K = 1005.0; // J / (kg · K)
export const AIR_DENSITY_STP_KG_M3 = 1.204; // kg / m^3 at 20°C
export const AIR_KINEMATIC_VISCOSITY_M2_S = 1.516e-5; // m^2 / s at 20°C
export const AIR_DYNAMIC_VISCOSITY_PA_S = 1.825e-5; // Pa · s
export const PRANDTL_NUMBER_AIR = 0.71;

export interface StackBuoyancyParameters {
  chimneyHeightM: number;          // Vertical stack height H (m)
  coreTempKelvin: number;          // T_core (internal heat source)
  ambientTempKelvin: number;       // T_amb
  ductCrossSectionAreaM2: number;  // Flow passage area A (m^2)
  inletLossCoeff?: number;         // Minor loss K_inlet (default 0.5)
}

export interface PorousMediaFlowParameters {
  permeabilityM2: number;          // Intrinsic permeability k (m^2), e.g. 1.2e-11 for packed sand/sintered porous core
  fluidViscosityPaS: number;       // Dynamic viscosity mu (Pa · s)
  bedLengthM: number;              // Porous matrix depth L (m)
  pressureDropPa: number;          // Driving Delta P (Pa)
  bedCrossSectionAreaM2: number;   // Flow area A (m^2)
  porosityFraction: number;        // Void fraction epsilon (0.20 to 0.60)
}

export interface BuoyancyConvectiveResult {
  stackVelocityMs: number;         // v_stack = sqrt(2 * g * H * Delta_T / T_ref)
  buoyancyPressureDeltaPa: number; // Delta P = rho * g * H * (Delta_T / T_ref)
  massFlowRateKgS: number;         // m_dot = rho * v * A
  convectiveHeatDissipationWatts: number; // Q = m_dot * Cp * Delta_T
  grashofNumber: number;           // Gr
  rayleighNumber: number;          // Ra = Gr * Pr
  convectionRegime: "LAMINAR_NATURAL" | "TURBULENT_BUOYANT" | "SUB_CRITICAL_DIFFUSION";
  epistemicClass: "NOMINAL_EQUILIBRIUM" | "SIMULATED_BEHAVIOUR";
  auditHash: string;
}

export interface PorousMediaFlowResult {
  darcyVelocityMs: number;         // q = (k * Delta P) / (mu * L)
  interstitialPoreVelocityMs: number; // v_int = q / epsilon
  volumetricFlowRateM3S: number;   // Q = q * A
  massFlowRateKgS: number;
  reynoldsNumberPore: number;      // Re_pore = (rho * q * d_pore) / mu
  flowRegime: "DARCY_LINEAR" | "FORCHHEIMER_TRANSITIONAL";
  epistemicClass: "SIMULATED_BEHAVIOUR";
  auditHash: string;
}

/**
 * Computes natural stack-effect chimney buoyancy velocity and convective heat dissipation.
 */
export function computeStackBuoyancyConvection(
  params: StackBuoyancyParameters
): BuoyancyConvectiveResult {
  const {
    chimneyHeightM,
    coreTempKelvin,
    ambientTempKelvin,
    ductCrossSectionAreaM2,
    inletLossCoeff = 0.5
  } = params;

  const deltaTKelvin = Math.max(0.01, coreTempKelvin - ambientTempKelvin);
  const refTempKelvin = Math.max(100.0, ambientTempKelvin);

  // Buoyancy driving pressure: Delta P = rho * g * H * (Delta T / T_ref)
  const buoyancyPressureDeltaPa = AIR_DENSITY_STP_KG_M3 * STANDARD_GRAVITY * chimneyHeightM * (deltaTKelvin / refTempKelvin);

  // Stack effect velocity (Torricelli-Boussinesq limit with head loss)
  // v = sqrt((2 * g * H * Delta T) / (T_ref * (1 + K_inlet)))
  const stackVelocityMs = Math.sqrt((2 * STANDARD_GRAVITY * chimneyHeightM * deltaTKelvin) / (refTempKelvin * (1 + inletLossCoeff)));

  // Mass flow rate: m_dot = rho * v * A
  const massFlowRateKgS = AIR_DENSITY_STP_KG_M3 * stackVelocityMs * ductCrossSectionAreaM2;

  // Thermal dissipation: Q = m_dot * C_p * Delta T
  const convectiveHeatDissipationWatts = massFlowRateKgS * AIR_SPECIFIC_HEAT_J_KG_K * deltaTKelvin;

  // Dimensionless numbers
  const beta = 1 / refTempKelvin; // Thermal expansion coefficient (1/K)
  const grashofNumber = (STANDARD_GRAVITY * beta * deltaTKelvin * Math.pow(chimneyHeightM, 3)) / Math.pow(AIR_KINEMATIC_VISCOSITY_M2_S, 2);
  const rayleighNumber = grashofNumber * PRANDTL_NUMBER_AIR;

  let convectionRegime: "LAMINAR_NATURAL" | "TURBULENT_BUOYANT" | "SUB_CRITICAL_DIFFUSION" = "LAMINAR_NATURAL";
  if (rayleighNumber > 1e9) {
    convectionRegime = "TURBULENT_BUOYANT";
  } else if (rayleighNumber < 1e3) {
    convectionRegime = "SUB_CRITICAL_DIFFUSION";
  }

  const epistemicClass = "SIMULATED_BEHAVIOUR";

  const auditPayload = JSON.stringify({
    schema: "ALICE_CONVECTIVE_BUOYANCY_V1",
    chimneyHeightM,
    deltaTKelvin: Number(deltaTKelvin.toFixed(2)),
    stackVelocityMs: Number(stackVelocityMs.toFixed(4)),
    convectiveHeatDissipationWatts: Number(convectiveHeatDissipationWatts.toFixed(2)),
    rayleighNumber: Number(rayleighNumber.toExponential(4))
  });

  const auditHash = `0x${sha256Hex(auditPayload)}`;

  return {
    stackVelocityMs,
    buoyancyPressureDeltaPa,
    massFlowRateKgS,
    convectiveHeatDissipationWatts,
    grashofNumber,
    rayleighNumber,
    convectionRegime,
    epistemicClass,
    auditHash
  };
}

/**
 * Computes Darcy linear porous media flow across porous protective walls or sintered filter elements.
 */
export function computePorousMediaDarcyFlow(
  params: PorousMediaFlowParameters
): PorousMediaFlowResult {
  const {
    permeabilityM2,
    fluidViscosityPaS,
    bedLengthM,
    pressureDropPa,
    bedCrossSectionAreaM2,
    porosityFraction
  } = params;

  const clampedPorosity = Math.max(0.05, Math.min(0.95, porosityFraction));
  const clampedLength = Math.max(1e-4, bedLengthM);

  // Darcy superficial velocity: q = (k * Delta P) / (mu * L)
  const darcyVelocityMs = (permeabilityM2 * pressureDropPa) / (fluidViscosityPaS * clampedLength);

  // Interstitial pore velocity: v_int = q / epsilon
  const interstitialPoreVelocityMs = darcyVelocityMs / clampedPorosity;

  // Volumetric & Mass Flow
  const volumetricFlowRateM3S = darcyVelocityMs * bedCrossSectionAreaM2;
  const massFlowRateKgS = volumetricFlowRateM3S * AIR_DENSITY_STP_KG_M3;

  // Approximate mean pore diameter: d_pore ~ sqrt(k / epsilon)
  const meanPoreDiameterM = Math.sqrt(permeabilityM2 / clampedPorosity);
  const reynoldsNumberPore = (AIR_DENSITY_STP_KG_M3 * darcyVelocityMs * meanPoreDiameterM) / fluidViscosityPaS;

  const flowRegime = reynoldsNumberPore < 1.0 ? "DARCY_LINEAR" : "FORCHHEIMER_TRANSITIONAL";

  const auditPayload = JSON.stringify({
    schema: "ALICE_POROUS_DARCY_V1",
    darcyVelocityMs: Number(darcyVelocityMs.toFixed(6)),
    pressureDropPa: Number(pressureDropPa.toFixed(2)),
    reynoldsNumberPore: Number(reynoldsNumberPore.toFixed(4))
  });

  const auditHash = `0x${sha256Hex(auditPayload)}`;

  return {
    darcyVelocityMs,
    interstitialPoreVelocityMs,
    volumetricFlowRateM3S,
    massFlowRateKgS,
    reynoldsNumberPore,
    flowRegime,
    epistemicClass: "SIMULATED_BEHAVIOUR",
    auditHash
  };
}
