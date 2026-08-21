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
  auditHash: string;
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
    ? `Within this reconstruction and its stated fixed-centre/0.5mm module assumptions, preserving nominal Metonic tooth count (${nominalTeeth} teeth) is a candidate binding constraint. Perturbation (${perturbedTeeth} teeth) introduces ${ratioDeviationPercent.toFixed(2)}% ratio departure, ${spiralDialAngleDriftDeg.toFixed(2)}° registration drift, ${calendarDayPhaseDrift.toFixed(1)} days calendar desynchronization, and +${centerDistanceDeltaMm.toFixed(2)}mm pitch interference causing mechanical tooth clash.`
    : `Nominal baseline (${nominalTeeth} teeth) achieves zero ratio deviation and exact kinematic synchronization with the 235-month Metonic cycle.`;
    
  // Deterministic mock sha256 checksum for audit record
  const auditString = `KINEMATIC-VERIFY:${nominalTeeth}:${perturbedTeeth}:${gearModuleMm}:${ratioDeviationPercent.toFixed(4)}:${spiralDialAngleDriftDeg.toFixed(4)}`;
  let hashVal = 0;
  for (let i = 0; i < auditString.length; i++) {
    hashVal = ((hashVal << 5) - hashVal) + auditString.charCodeAt(i);
    hashVal |= 0;
  }
  const auditHash = `0x${Math.abs(hashVal).toString(16).padStart(8, "0")}`;

  return {
    nominalTeeth,
    perturbedTeeth,
    toothDelta,
    gearModuleMm,
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
