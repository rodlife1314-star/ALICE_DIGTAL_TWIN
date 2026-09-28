/**
 * ALICE VESSEL THERMAL & RADIATIVE DISSIPATION ENGINE
 * 
 * Extracted permanent physical model for net radiative cooling, deep-space heat dumping,
 * atmospheric transparency window (8-13 µm) transmission, and Surface Phonon Polariton (SPhP)
 * resonance.
 * 
 * Ontological Boundary:
 * Pure physical model. Evaluates radiative thermodynamics and polaritonic resonance
 * independent of any twin container, presentation surface, or UI state.
 */

import { sha256Hex } from "../../lib/crypto";

// Physical Constants
export const STEFAN_BOLTZMANN_CONSTANT = 5.670374419e-8; // W / (m^2 · K^4)
export const SPEED_OF_LIGHT = 299792458; // m/s
export const PLANCK_CONSTANT = 6.62607015e-34; // J · s
export const BOLTZMANN_CONSTANT = 1.380649e-23; // J / K

export interface RadiativeCoolingBoundaryConditions {
  surfaceTempKelvin: number;        // e.g. 295.15 K (~22°C)
  ambientTempKelvin: number;        // e.g. 307.15 K (~34°C)
  precipitableWaterVaporMm: number; // PWV (mm), default 14.0 mm
  solarIrradianceWm2: number;       // Direct + diffuse solar flux (W/m^2)
  parasiticConvectionCoeff: number; // h_c in W / (m^2 · K), e.g. 6.0
  surfaceEmissivityAtmWindow: number; // Emissivity across 8-13 µm band (e.g. 0.94)
  solarAbsorptivity: number;        // alpha_solar, e.g. 0.036 (rejection 96.4%)
  deepSpaceSinkTempKelvin?: number; // 3.0 K deep space sink when out of atmosphere
  isExoAtmospheric?: boolean;       // True for deep space carrier flight
}

export interface RadiativeCoolingResult {
  surfaceTempKelvin: number;
  ambientTempKelvin: number;
  subAmbientDepressionKelvin: number; // Delta T = T_surface - T_amb (negative when cooler than ambient)
  radiatedPowerWm2: number;          // P_rad = eps * sigma * T^4
  atmosphericCounterPowerWm2: number;// P_atm
  absorbedSolarPowerWm2: number;     // P_solar = alpha * I_solar
  convectiveGainWm2: number;         // P_conv = h_c * (T_amb - T_surface)
  netCoolingPowerWm2: number;        // P_net = P_rad - P_atm - P_solar - P_conv
  isNetCooling: boolean;             // P_net > 0
  atmosphericWindowEmissivity: number; // Emissivity across 8-13 µm
  phononPolaritonResonance: {
    resonanceWavelengthUm: number;   // 9.7 µm SiO2 SPhP peak
    oscillatorQualityFactor: number; // Q-factor of dielectric phonon resonance
    couplingEfficiency: number;      // Emissivity enhancement in window
  };
  epistemicClass: "NOMINAL_EQUILIBRIUM" | "SIMULATED_BEHAVIOUR" | "SUB_AMBIENT_EXCURSION";
  auditHash: string;
}

/**
 * Calculates atmospheric emissivity based on precipitable water vapor (PWV)
 * Semi-empirical model across the 8-13 µm transparency window.
 */
export function calculateAtmosphericWindowEmissivity(precipitableWaterVaporMm: number): number {
  const pwvClamped = Math.max(0.5, Math.min(60.0, precipitableWaterVaporMm));
  // PWV attenuates 8-13 µm window transparency: epsilon_atm rises with moisture
  return 0.18 + 0.015 * Math.sqrt(pwvClamped);
}

/**
 * Evaluates net radiative cooling power and sub-ambient temperature gradient.
 * Governing equation:
 * P_net(T) = P_rad(T) - P_atm(T_amb, PWV) - P_solar - P_conv
 */
export function computeRadiativeThermalBalance(
  conditions: RadiativeCoolingBoundaryConditions
): RadiativeCoolingResult {
  const {
    surfaceTempKelvin,
    ambientTempKelvin,
    precipitableWaterVaporMm,
    solarIrradianceWm2,
    parasiticConvectionCoeff,
    surfaceEmissivityAtmWindow,
    solarAbsorptivity,
    deepSpaceSinkTempKelvin = 3.0,
    isExoAtmospheric = false
  } = conditions;

  // 1. Emitted Radiative Power (Stefan-Boltzmann)
  const radiatedPowerWm2 = surfaceEmissivityAtmWindow * STEFAN_BOLTZMANN_CONSTANT * Math.pow(surfaceTempKelvin, 4);

  // 2. Atmospheric or Deep Space Counter-Radiation
  let atmosphericCounterPowerWm2: number;
  if (isExoAtmospheric) {
    atmosphericCounterPowerWm2 = surfaceEmissivityAtmWindow * STEFAN_BOLTZMANN_CONSTANT * Math.pow(deepSpaceSinkTempKelvin, 4);
  } else {
    const epsAtm = calculateAtmosphericWindowEmissivity(precipitableWaterVaporMm);
    atmosphericCounterPowerWm2 = epsAtm * STEFAN_BOLTZMANN_CONSTANT * Math.pow(ambientTempKelvin, 4);
  }

  // 3. Absorbed Solar Radiation
  const absorbedSolarPowerWm2 = solarAbsorptivity * solarIrradianceWm2;

  // 4. Parasitic Convective / Conductive Heat Gain
  const tempDelta = ambientTempKelvin - surfaceTempKelvin;
  const convectiveGainWm2 = isExoAtmospheric ? 0 : parasiticConvectionCoeff * Math.max(0, tempDelta);

  // 5. Net Radiative Cooling Power
  const netCoolingPowerWm2 = radiatedPowerWm2 - atmosphericCounterPowerWm2 - absorbedSolarPowerWm2 - convectiveGainWm2;

  // Sub-ambient temperature depression
  const subAmbientDepressionKelvin = surfaceTempKelvin - ambientTempKelvin;

  // 6. Surface Phonon Polariton (SPhP) Coupling Metrics
  // Characteristic SiO2/SiC polaritonic resonance in the infrared reststrahlen band
  const resonanceWavelengthUm = 9.7; // µm
  const oscillatorQualityFactor = 28.5;
  const couplingEfficiency = 0.945;

  let epistemicClass: "NOMINAL_EQUILIBRIUM" | "SIMULATED_BEHAVIOUR" | "SUB_AMBIENT_EXCURSION" = "SIMULATED_BEHAVIOUR";
  if (subAmbientDepressionKelvin < -5.0 && netCoolingPowerWm2 > 0) {
    epistemicClass = "SUB_AMBIENT_EXCURSION";
  } else if (Math.abs(netCoolingPowerWm2) < 5.0) {
    epistemicClass = "NOMINAL_EQUILIBRIUM";
  }

  const auditPayload = JSON.stringify({
    schema: "ALICE_VESSEL_THERMAL_RADIATION_V1",
    surfaceTempKelvin,
    ambientTempKelvin,
    netCoolingPowerWm2: Number(netCoolingPowerWm2.toFixed(4)),
    subAmbientDepressionKelvin: Number(subAmbientDepressionKelvin.toFixed(4)),
    radiatedPowerWm2: Number(radiatedPowerWm2.toFixed(4)),
    epistemicClass
  });

  const auditHash = `0x${sha256Hex(auditPayload)}`;

  return {
    surfaceTempKelvin,
    ambientTempKelvin,
    subAmbientDepressionKelvin,
    radiatedPowerWm2,
    atmosphericCounterPowerWm2,
    absorbedSolarPowerWm2,
    convectiveGainWm2,
    netCoolingPowerWm2,
    isNetCooling: netCoolingPowerWm2 > 0,
    atmosphericWindowEmissivity: surfaceEmissivityAtmWindow,
    phononPolaritonResonance: {
      resonanceWavelengthUm,
      oscillatorQualityFactor,
      couplingEfficiency
    },
    epistemicClass,
    auditHash
  };
}
