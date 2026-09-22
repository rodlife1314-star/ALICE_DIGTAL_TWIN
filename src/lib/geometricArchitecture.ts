/**
 * PATHFINDER GEOMETRIC ARCHITECTURE & SYMMETRY BREAKING SUBSTRATE
 *
 * Formal Reference Baseline:
 *   G_0 = { N_0, R_6(r), h }
 *
 * Source:
 *   N_0 = (0, 0, h)
 *
 * Receivers (Regular Hexagon on z = 0):
 *   N_k = (r * cos(theta_k), r * sin(theta_k), 0), where theta_k = 2 * pi * k / 6 = k * pi / 3 (k = 0..5)
 *
 * Invariants:
 *   - Angular separation: 60° (pi / 3)
 *   - Equal path length: d = sqrt(h^2 + r^2) = h * sqrt(1 + rho^2), for all k = 0..5
 *   - Elevation angle: alpha = atan(h / r) = atan(1 / rho)
 *   - Receiver-to-receiver chord distance: s = 2 * r * sin(pi / 6) = r
 *   - Regular hexagon: s = r
 *   - Default canonical scale: h = 50m, r = 50m => d ≈ 70.71m, alpha = 45°, s = 50m
 *
 * Dimensionless Ratio:
 *   rho = r / h
 *   rho < 1 => steep footprint directly beneath source
 *   rho = 1 => 45° slant geometry
 *   rho > 1 => wide spreading footprint with longer propagation path
 *
 * Optimization Objective:
 *   rho* = argmax_{rho} eta(rho)
 *
 * Symmetry Breaking & Sensitivity:
 *   G -> field solution -> P_i -> eta -> sensitivity to Delta G
 */

import { EpistemicTier } from "../types";

export interface NodeCoordinate3D {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  thetaRad: number;
  thetaDeg: number;
  distanceFromSource: number; // d_k
  elevationAngleDeg: number;  // alpha_k
  chordToNextNode: number;    // s_k
  receivedPowerKw: number;    // P_k
  epistemicTier: EpistemicTier;
}

export interface GeometricArchitectureState {
  h: number;                  // source height in meters
  r: number;                  // receiver ring radius in meters
  rho: number;                // dimensionless ratio r / h
  pathLength: number;         // nominal d = sqrt(h^2 + r^2)
  elevationAngleDeg: number;  // alpha = atan(h/r)
  chordDistance: number;      // s = 2*r*sin(pi/6) = r
  sourcePowerKw: number;      // P_0
  attenuationAlpha: number;   // absorption/scattering coeff (1/m)
  beamDirectivityExp: number; // beam shape cos(alpha)^beta
  receiverApertureM2: number; // effective receiver area
  isSymmetric: boolean;
  perturbation: {
    perturbedNodeIndex: number; // 0..5
    deltaR: number;             // meters
    deltaThetaDeg: number;      // degrees
    deltaH: number;             // meters
  };
}

export interface GeometricSweepPoint {
  rho: number;
  h: number;
  r: number;
  pathLength: number;
  elevationAngleDeg: number;
  totalReceivedPowerKw: number;
  efficiencyPct: number; // eta = (sum P_k) / P_0 * 100
}

export interface CandidateGeometry {
  id: "ring_hexagon" | "sphere" | "cone" | "planar_phased" | "spherical_phased";
  name: string;
  symmetryClass: string;
  pathLengthUniformity: "Strictly Equal (All 6)" | "Variable by Lat/Lon" | "Uniform by Radial Ring" | "Non-uniform Planar" | "Multi-directional Complex";
  controlComplexity: "Low (1-DOF: rho)" | "High (Multi-axis 3D)" | "Medium (Apex angle + depth)" | "Medium-High (Phase delays)" | "Very High (Spherical tessellation)";
  advantages: string[];
  disadvantages: string[];
  recommendedApplication: string;
}

export const CANDIDATE_GEOMETRIES: CandidateGeometry[] = [
  {
    id: "ring_hexagon",
    name: "Elevated Central Source + Regular Hexagonal Ring (G_0)",
    symmetryClass: "D_6h Hexagonal Planar Inversion",
    pathLengthUniformity: "Strictly Equal (All 6)",
    controlComplexity: "Low (1-DOF: rho)",
    advantages: [
      "Exact geometric symmetry: d_1 = d_2 = ... = d_6 = sqrt(h^2 + r^2).",
      "Equal 60° angular spacing with chord distance s = r.",
      "Deviations in received power are attributable directly to field/medium behavior, not geometric bias.",
      "Minimal control parameter space governed by dimensionless ratio rho = r / h."
    ],
    disadvantages: [
      "Bounded to planar ground footprint (z = 0).",
      "Elevation angle decreases as footprint expands (rho > 1)."
    ],
    recommendedApplication: "Canonical Pathfinder baseline benchmark for field and power transfer research."
  },
  {
    id: "sphere",
    name: "Concentric Spherical Enclosure",
    symmetryClass: "O(3) Full Rotational Symmetry",
    pathLengthUniformity: "Variable by Lat/Lon",
    controlComplexity: "High (Multi-axis 3D)",
    advantages: [
      "True 3D omnidirectional energy coverage in all directions.",
      "No dead angles or edge cutoffs."
    ],
    disadvantages: [
      "Severe control complexity: both range and local incident angles vary drastically unless concentric.",
      "Difficult ground mounting and structural occlusion."
    ],
    recommendedApplication: "Orbital satellite constellations and deep-space isotropic relays."
  },
  {
    id: "cone",
    name: "Downward Conical Shell Geometry",
    symmetryClass: "C_nv Axial Conical",
    pathLengthUniformity: "Uniform by Radial Ring",
    controlComplexity: "Medium (Apex angle + depth)",
    advantages: [
      "Energy preferentially directed downward into a bounded footprint.",
      "Eliminates upward stray radiation without rear shielding.",
      "Reduces angular domain needing dynamic phase control."
    ],
    disadvantages: [
      "Height gradient across concentric receiver rings causes path dispersion.",
      "Requires concentric tiered elevation structures."
    ],
    recommendedApplication: "Localized microgrid power beaming and industrial pit illumination."
  },
  {
    id: "planar_phased",
    name: "Planar Phased Surface Array",
    symmetryClass: "C_4v / C_6v 2D Grid Planar",
    pathLengthUniformity: "Non-uniform Planar",
    controlComplexity: "Medium-High (Phase delays)",
    advantages: [
      "Strong steerability and rapid electronic beam tilting.",
      "Closest alignment with modern RF/optical phased array manufacturing."
    ],
    disadvantages: [
      "Inherently directional with scan-loss at oblique angles (cos theta decay).",
      "High grating lobe vulnerability when steering off-boresight."
    ],
    recommendedApplication: "Long-range point-to-point tactical transmission."
  },
  {
    id: "spherical_phased",
    name: "Tessellated Spherical Phased Surface",
    symmetryClass: "I_h Icosahedral Geodesic",
    pathLengthUniformity: "Multi-directional Complex",
    controlComplexity: "Very High (Spherical tessellation)",
    advantages: [
      "Simultaneous multi-target beamforming across multiple azimuths and elevations.",
      "Near-zero geometric scan loss across the upper hemisphere."
    ],
    disadvantages: [
      "Extreme computational complexity: thousands of coupled phase shifting elements.",
      "Severe mutual coupling and thermal dissipation bottlenecks."
    ],
    recommendedApplication: "Future multi-node planetary grid nodes and orbital hubs."
  }
];

/**
 * Compute the field transfer to node k
 * Field physics: inverse-square geometric spread * atmospheric absorption * aperture projection
 * P_k = P_0 * (A_eff / (4 * pi * d_k^2)) * cos(alpha_k)^beta * exp(-gamma * d_k)
 */
export function computeNodeReceivedPower(
  distanceM: number,
  elevationAngleDeg: number,
  sourcePowerKw: number,
  apertureM2: number,
  directivityBeta: number,
  attenuationGamma: number
): number {
  if (distanceM <= 0) return 0;

  const elevationRad = (elevationAngleDeg * Math.PI) / 180;
  // Geometric spreading flux density S = P_0 / (4 * pi * d^2)
  const fluxDensity = sourcePowerKw / (4 * Math.PI * Math.pow(distanceM, 2));

  // Angular directivity gain: source radiates with cos(theta_tilt)^beta
  // where theta_tilt from vertical is 90° - alpha
  const tiltRad = Math.max(0, Math.min(Math.PI / 2, Math.PI / 2 - elevationRad));
  const directivityFactor = Math.pow(Math.cos(tiltRad), directivityBeta);

  // Atmospheric/medium exponential attenuation
  const mediumTransmission = Math.exp(-attenuationGamma * distanceM);

  // Effective captured power
  const capturedPower = fluxDensity * apertureM2 * directivityFactor * mediumTransmission;
  return Math.max(0, capturedPower);
}

/**
 * Solve complete G_0 hexagonal baseline geometry and compute node states
 */
export function solveGeometricArchitecture(
  config: GeometricArchitectureState
): {
  sourceNode: { x: number; y: number; z: number };
  nodes: NodeCoordinate3D[];
  totalReceivedPowerKw: number;
  transferEfficiencyPct: number;
  powerImbalanceRatio: number; // max(P_k) / min(P_k)
  pathLengthVarianceM2: number;
  dimensionlessRatioRho: number;
  nominalPathLength: number;
  nominalElevationAngleDeg: number;
  nominalChordDistanceM: number;
} {
  const {
    h,
    r,
    sourcePowerKw,
    attenuationAlpha,
    beamDirectivityExp,
    receiverApertureM2,
    perturbation
  } = config;

  const effectiveH = h + (perturbation.deltaH || 0);
  const rho = r / (effectiveH > 0 ? effectiveH : 0.001);
  const nominalD = Math.sqrt(effectiveH * effectiveH + r * r);
  const nominalAlphaDeg = (Math.atan2(effectiveH, r) * 180) / Math.PI;
  const nominalChordM = 2 * r * Math.sin(Math.PI / 6); // exactly r

  const nodes: NodeCoordinate3D[] = [];

  for (let k = 0; k < 6; k++) {
    const isPerturbed = perturbation.perturbedNodeIndex === k;
    const nodeR = isPerturbed ? Math.max(1, r + perturbation.deltaR) : r;
    const baseThetaRad = (2 * Math.PI * k) / 6;
    const perturbThetaRad = isPerturbed ? (perturbation.deltaThetaDeg * Math.PI) / 180 : 0;
    const thetaRad = baseThetaRad + perturbThetaRad;
    const thetaDeg = (thetaRad * 180) / Math.PI;

    // Node 3D Cartesian coordinates
    const x = nodeR * Math.cos(thetaRad);
    const y = nodeR * Math.sin(thetaRad);
    const z = 0; // receiver plane

    // Distance from elevated source (0, 0, effectiveH)
    const dk = Math.sqrt(x * x + y * y + effectiveH * effectiveH);
    const alphaKDeg = (Math.atan2(effectiveH, Math.sqrt(x * x + y * y)) * 180) / Math.PI;

    // Chord to next node (k + 1)
    const nextK = (k + 1) % 6;
    const nextBaseTheta = (2 * Math.PI * nextK) / 6;
    const nextPerturb = perturbation.perturbedNodeIndex === nextK ? (perturbation.deltaThetaDeg * Math.PI) / 180 : 0;
    const nextR = perturbation.perturbedNodeIndex === nextK ? Math.max(1, r + perturbation.deltaR) : r;
    const nextX = nextR * Math.cos(nextBaseTheta + nextPerturb);
    const nextY = nextR * Math.sin(nextBaseTheta + nextPerturb);
    const chordK = Math.sqrt(Math.pow(nextX - x, 2) + Math.pow(nextY - y, 2));

    // Power received at this node
    const receivedPowerKw = computeNodeReceivedPower(
      dk,
      alphaKDeg,
      sourcePowerKw,
      receiverApertureM2,
      beamDirectivityExp,
      attenuationAlpha
    );

    nodes.push({
      id: `node-${k}`,
      name: `Receiver N_${k}`,
      x,
      y,
      z,
      thetaRad,
      thetaDeg,
      distanceFromSource: dk,
      elevationAngleDeg: alphaKDeg,
      chordToNextNode: chordK,
      receivedPowerKw,
      epistemicTier: "SIMULATED"
    });
  }

  const powers = nodes.map(n => n.receivedPowerKw);
  const distances = nodes.map(n => n.distanceFromSource);
  const totalReceivedKw = powers.reduce((acc, v) => acc + v, 0);
  const efficiencyPct = sourcePowerKw > 0 ? (totalReceivedKw / sourcePowerKw) * 100 : 0;

  const minP = Math.min(...powers);
  const maxP = Math.max(...powers);
  const powerImbalanceRatio = minP > 0 ? maxP / minP : maxP > 0 ? 999 : 1.0;

  const meanD = distances.reduce((a, b) => a + b, 0) / 6;
  const pathLengthVarianceM2 = distances.reduce((a, b) => a + Math.pow(b - meanD, 2), 0) / 6;

  return {
    sourceNode: { x: 0, y: 0, z: effectiveH },
    nodes,
    totalReceivedPowerKw: totalReceivedKw,
    transferEfficiencyPct: efficiencyPct,
    powerImbalanceRatio,
    pathLengthVarianceM2,
    dimensionlessRatioRho: rho,
    nominalPathLength: nominalD,
    nominalElevationAngleDeg: nominalAlphaDeg,
    nominalChordDistanceM: nominalChordM
  };
}

/**
 * Sweep dimensionless ratio rho = r / h to discover optimal geometry rho* = argmax eta(rho)
 */
export function sweepDimensionlessRatio(
  fixedH: number,
  rhoMin: number = 0.2,
  rhoMax: number = 2.5,
  steps: number = 30,
  sourcePowerKw: number = 100,
  attenuationAlpha: number = 0.002,
  beamDirectivityExp: number = 1.2,
  receiverApertureM2: number = 8.0
): {
  points: GeometricSweepPoint[];
  optimalRho: number;
  maxEfficiencyPct: number;
  optimalRadiusM: number;
  optimalPathLengthM: number;
  optimalElevationDeg: number;
} {
  const points: GeometricSweepPoint[] = [];
  let bestPoint: GeometricSweepPoint = {
    rho: 1.0,
    h: fixedH,
    r: fixedH,
    pathLength: fixedH * Math.sqrt(2),
    elevationAngleDeg: 45,
    totalReceivedPowerKw: 0,
    efficiencyPct: 0
  };

  const stepSize = (rhoMax - rhoMin) / (steps - 1);

  for (let i = 0; i < steps; i++) {
    const rho = rhoMin + i * stepSize;
    const r = rho * fixedH;
    const nominalD = fixedH * Math.sqrt(1 + rho * rho);
    const alphaDeg = (Math.atan(1 / rho) * 180) / Math.PI;

    // Evaluate power transfer for symmetric hexagon at this rho
    let totalP = 0;
    for (let k = 0; k < 6; k++) {
      totalP += computeNodeReceivedPower(
        nominalD,
        alphaDeg,
        sourcePowerKw,
        receiverApertureM2,
        beamDirectivityExp,
        attenuationAlpha
      );
    }
    const eff = (totalP / sourcePowerKw) * 100;

    const pt: GeometricSweepPoint = {
      rho: Number(rho.toFixed(3)),
      h: fixedH,
      r: Number(r.toFixed(1)),
      pathLength: Number(nominalD.toFixed(2)),
      elevationAngleDeg: Number(alphaDeg.toFixed(1)),
      totalReceivedPowerKw: Number(totalP.toFixed(3)),
      efficiencyPct: Number(eff.toFixed(3))
    };

    points.push(pt);
    if (eff > bestPoint.efficiencyPct) {
      bestPoint = pt;
    }
  }

  return {
    points,
    optimalRho: bestPoint.rho,
    maxEfficiencyPct: bestPoint.efficiencyPct,
    optimalRadiusM: bestPoint.r,
    optimalPathLengthM: bestPoint.pathLength,
    optimalElevationDeg: bestPoint.elevationAngleDeg
  };
}

/**
 * Perform formal sensitivity gradient analysis for geometric perturbation Delta G
 */
export function computeGeometricSensitivity(
  baseConfig: GeometricArchitectureState
): {
  radialSensitivityKwPerM: number;     // dP / dr
  angularSensitivityKwPerDeg: number;  // dP / dtheta
  heightSensitivityKwPerM: number;     // dP / dh
  symmetryLossIndex: number;           // coefficient of variation of received power (sigma / mu)
} {
  // Baseline symmetric
  const symConfig = {
    ...baseConfig,
    perturbation: { perturbedNodeIndex: 0, deltaR: 0, deltaThetaDeg: 0, deltaH: 0 }
  };
  const baseRes = solveGeometricArchitecture(symConfig);
  const baseTotalP = baseRes.totalReceivedPowerKw;

  // Perturb r by +1m
  const deltaR = 1.0;
  const rPerturbed = {
    ...symConfig,
    perturbation: { perturbedNodeIndex: 3, deltaR, deltaThetaDeg: 0, deltaH: 0 }
  };
  const rRes = solveGeometricArchitecture(rPerturbed);
  const dP_dr = (rRes.totalReceivedPowerKw - baseTotalP) / deltaR;

  // Perturb theta by +5 deg
  const deltaTheta = 5.0;
  const thetaPerturbed = {
    ...symConfig,
    perturbation: { perturbedNodeIndex: 3, deltaR: 0, deltaThetaDeg: deltaTheta, deltaH: 0 }
  };
  const thetaRes = solveGeometricArchitecture(thetaPerturbed);
  const dP_dtheta = (thetaRes.totalReceivedPowerKw - baseTotalP) / deltaTheta;

  // Perturb h by +1m
  const deltaH = 1.0;
  const hPerturbed = {
    ...symConfig,
    h: symConfig.h + deltaH
  };
  const hRes = solveGeometricArchitecture(hPerturbed);
  const dP_dh = (hRes.totalReceivedPowerKw - baseTotalP) / deltaH;

  // Current symmetry loss index
  const currentRes = solveGeometricArchitecture(baseConfig);
  const pList = currentRes.nodes.map(n => n.receivedPowerKw);
  const meanP = pList.reduce((a, b) => a + b, 0) / 6;
  const varianceP = pList.reduce((a, b) => a + Math.pow(b - meanP, 2), 0) / 6;
  const stdDevP = Math.sqrt(varianceP);
  const cv = meanP > 0 ? (stdDevP / meanP) * 100 : 0;

  return {
    radialSensitivityKwPerM: Number(dP_dr.toFixed(4)),
    angularSensitivityKwPerDeg: Number(dP_dtheta.toFixed(4)),
    heightSensitivityKwPerM: Number(dP_dh.toFixed(4)),
    symmetryLossIndex: Number(cv.toFixed(2))
  };
}
