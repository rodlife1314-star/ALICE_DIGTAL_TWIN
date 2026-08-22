// Deterministic Kinematic & Arithmetic Engine
// Provides independent, deterministic recomputation of mechanical, kinematic,
// and astronomical cycle formulas before admitting AI simulation claims to the ledger.

export interface KinematicValidationError {
  field: "nominalTeeth" | "perturbedTeeth" | "gearModuleMm";
  message: string;
}

export interface MetonicKinematicVerificationResult {
  nominalTeeth: number;
  perturbedTeeth: number;
  toothDelta: number;
  gearModuleMm: number;
  
  // Exact Rational Representation [numerator, denominator]
  exactRationalRatio: [bigint, bigint];
  exactToothDeltaRatio: [bigint, bigint];
  
  // Independent Deterministic Calculations
  ratioDeviationPercent: number; // e.g. 2.6315789%
  spiralDialAngleDriftDeg: number; // e.g. -47.3684° over 1800° (5-turn spiral)
  synodicMonthPhaseDrift: number; // e.g. 6.1842 months over 235-month cycle
  calendarDayPhaseDrift: number; // e.g. 182.62 days (approx 182.5 days)
  centerDistanceDeltaMm: number; // e.g. +0.25 mm
  moduleInterferenceRatio: number; // e.g. +0.50 module
  
  // Mechanical Feasibility
  isMechanicallyInterfering: boolean;
  isCalendarRegisterDesynchronized: boolean;
  
  // Epistemic Status
  epistemicVerdict: "CANDIDATE_BINDING_MUST" | "NOMINAL_EQUILIBRIUM" | "NON_BINDING_TOLERANCE";
  epistemicFormulation: string;
  auditHash: string; // Canonical 64-character SHA-256 hex string
}

/**
 * Standard pure-TypeScript 64-character hex SHA-256 implementation.
 * Guaranteed deterministic and identical across client browser and Node.js environments.
 */
export function sha256Hex(asciiString: string): string {
  function rightRotate(value: number, amount: number): number {
    return (value >>> amount) | (value << (32 - amount));
  }

  const words: number[] = [];
  const asciiBitLength = asciiString.length * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  for (let i = 0; i < asciiString.length; i++) {
    const j = i >> 2;
    words[j] = (words[j] || 0) | ((asciiString.charCodeAt(i) & 0xff) << ((3 - (i % 4)) * 8));
  }

  const padIndex = asciiString.length >> 2;
  words[padIndex] = (words[padIndex] || 0) | (0x80 << ((3 - (asciiString.length % 4)) * 8));
  const totalWords = (((asciiString.length + 8) >> 6) + 1) * 16;
  words[totalWords - 1] = asciiBitLength;

  const w: number[] = new Array(64);

  for (let i = 0; i < words.length; i += 16) {
    const oldHash = [...hash];

    for (let j = 0; j < 64; j++) {
      if (j < 16) {
        w[j] = words[i + j] || 0;
      } else {
        const s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
        const s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
      }

      const s1 = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const temp1 = (hash[7] + s1 + ch + k[j] + w[j]) | 0;
      const s0 = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = (s0 + maj) | 0;

      hash[7] = hash[6];
      hash[6] = hash[5];
      hash[5] = hash[4];
      hash[4] = (hash[3] + temp1) | 0;
      hash[3] = hash[2];
      hash[2] = hash[1];
      hash[1] = hash[0];
      hash[0] = (temp1 + temp2) | 0;
    }

    for (let j = 0; j < 8; j++) {
      hash[j] = (hash[j] + oldHash[j]) | 0;
    }
  }

  let result = "";
  for (let i = 0; i < 8; i++) {
    result += ("00000000" + (hash[i] >>> 0).toString(16)).slice(-8);
  }

  return result.toLowerCase();
}

export function validateKinematicInputs(
  nominalTeeth: number,
  perturbedTeeth: number,
  gearModuleMm: number
): { isValid: boolean; errors: KinematicValidationError[] } {
  const errors: KinematicValidationError[] = [];

  // 1. Tooth counts must be positive integers (1 to 1000)
  if (!Number.isFinite(nominalTeeth) || !Number.isInteger(nominalTeeth) || nominalTeeth < 1 || nominalTeeth > 1000) {
    errors.push({
      field: "nominalTeeth",
      message: "Nominal tooth count must be a positive integer between 1 and 1000 (rejected zero, negative, fractional, NaN, Infinity)."
    });
  }

  if (!Number.isFinite(perturbedTeeth) || !Number.isInteger(perturbedTeeth) || perturbedTeeth < 1 || perturbedTeeth > 1000) {
    errors.push({
      field: "perturbedTeeth",
      message: "Perturbed tooth count must be a positive integer between 1 and 1000 (rejected zero, negative, fractional, NaN, Infinity)."
    });
  }

  // 2. Gear module must be a finite positive number (0.01mm to 20.0mm)
  if (!Number.isFinite(gearModuleMm) || gearModuleMm <= 0 || gearModuleMm < 0.01 || gearModuleMm > 20.0) {
    errors.push({
      field: "gearModuleMm",
      message: "Gear module must be a finite positive number between 0.01mm and 20.0mm (rejected non-positive, NaN, Infinity)."
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function computeDeterministicMetonicKinematics(
  nominalTeeth: number = 38,
  perturbedTeeth: number = 39,
  gearModuleMm: number = 0.5
): MetonicKinematicVerificationResult {
  const validation = validateKinematicInputs(nominalTeeth, perturbedTeeth, gearModuleMm);
  if (!validation.isValid) {
    const errorDetails = validation.errors.map(e => `${e.field}: ${e.message}`).join(" | ");
    throw new Error(`[KINEMATIC INTEGRITY ERROR] Invalid parameters: ${errorDetails}`);
  }

  const toothDelta = perturbedTeeth - nominalTeeth;
  
  // Exact rational ratio representation using BigInt to prevent floating-point drift
  const exactNominal = BigInt(nominalTeeth);
  const exactPerturbed = BigInt(perturbedTeeth);
  const exactDelta = BigInt(toothDelta);

  const exactRationalRatio: [bigint, bigint] = [exactPerturbed, exactNominal];
  const exactToothDeltaRatio: [bigint, bigint] = [exactDelta, exactNominal];

  // 1. Ratio Departure = (N' - N) / N
  const ratioDeviation = toothDelta / nominalTeeth;
  const ratioDeviationPercent = ratioDeviation * 100;
  
  // 2. Angular registration drift over 19-year Metonic dial
  // The Metonic back dial features a 5-turn spiral = 5 * 360° = 1800° total arc.
  const totalSpiralDegrees = 1800;
  const spiralDialAngleDriftDeg = -ratioDeviation * totalSpiralDegrees;
  
  // 3. Synodic month registration drift over 235-month Metonic cycle
  const totalSynodicMonths = 235;
  const synodicMonthPhaseDrift = ratioDeviation * totalSynodicMonths;
  
  // 4. Calendar day phase drift over full 19-year cycle
  // Mean synodic month = 29.530588 days
  const meanSynodicMonthDays = 29.530588;
  const calendarDayPhaseDrift = synodicMonthPhaseDrift * meanSynodicMonthDays;
  
  // 5. Pitch circle radius and center distance change
  // d = m * N, r = d / 2
  // Delta C = Delta r = (m * Delta N) / 2
  const centerDistanceDeltaMm = (gearModuleMm * toothDelta) / 2;
  const moduleInterferenceRatio = (gearModuleMm * toothDelta) / gearModuleMm;
  
  const isMechanicallyInterfering = Math.abs(centerDistanceDeltaMm) > 0.05; // fixed arbor tolerance 0.05mm
  const isCalendarRegisterDesynchronized = Math.abs(calendarDayPhaseDrift) > 1.0; // > 1 day error
  
  let epistemicVerdict: "CANDIDATE_BINDING_MUST" | "NOMINAL_EQUILIBRIUM" | "NON_BINDING_TOLERANCE" = "NOMINAL_EQUILIBRIUM";
  if (toothDelta !== 0 && (isMechanicallyInterfering || isCalendarRegisterDesynchronized)) {
    epistemicVerdict = "CANDIDATE_BINDING_MUST";
  } else if (toothDelta === 0) {
    epistemicVerdict = "NOMINAL_EQUILIBRIUM";
  } else {
    epistemicVerdict = "NON_BINDING_TOLERANCE";
  }
  
  const epistemicFormulation = toothDelta !== 0
    ? `Within this reconstruction and its stated fixed-centre/0.5mm module assumptions, preserving nominal Metonic tooth count (${nominalTeeth} teeth) is a candidate binding constraint. Perturbation (${perturbedTeeth} teeth) introduces ${ratioDeviationPercent.toFixed(4)}% ratio departure, ${spiralDialAngleDriftDeg.toFixed(4)}° registration drift, ${calendarDayPhaseDrift.toFixed(2)} days calendar desynchronization, and +${centerDistanceDeltaMm.toFixed(2)}mm pitch interference causing mechanical tooth clash.`
    : `Nominal baseline (${nominalTeeth} teeth) achieves zero ratio deviation and exact kinematic synchronization with the 235-month Metonic cycle.`;
    
  // Standard, cryptographic 64-character SHA-256 hex digest for audit record
  const auditPayload = JSON.stringify({
    schema: "PATHFINDER_DETERMINISTIC_KINEMATICS_V2",
    nominalTeeth,
    perturbedTeeth,
    toothDelta,
    gearModuleMm,
    exactRationalRatio: [exactRationalRatio[0].toString(), exactRationalRatio[1].toString()],
    ratioDeviationPercent: Number(ratioDeviationPercent.toFixed(6)),
    spiralDialAngleDriftDeg: Number(spiralDialAngleDriftDeg.toFixed(6)),
    synodicMonthPhaseDrift: Number(synodicMonthPhaseDrift.toFixed(6)),
    calendarDayPhaseDrift: Number(calendarDayPhaseDrift.toFixed(4)),
    centerDistanceDeltaMm: Number(centerDistanceDeltaMm.toFixed(4)),
    epistemicVerdict
  });

  const auditHash = `0x${sha256Hex(auditPayload)}`;

  return {
    nominalTeeth,
    perturbedTeeth,
    toothDelta,
    gearModuleMm,
    exactRationalRatio,
    exactToothDeltaRatio,
    ratioDeviationPercent,
    spiralDialAngleDriftDeg,
    synodicMonthPhaseDrift,
    calendarDayPhaseDrift,
    centerDistanceDeltaMm,
    moduleInterferenceRatio,
    isMechanicallyInterfering,
    isCalendarRegisterDesynchronized,
    epistemicVerdict,
    epistemicFormulation,
    auditHash
  };
}
