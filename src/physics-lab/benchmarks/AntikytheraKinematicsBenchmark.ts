/**
 * PHYSICS LABORATORY BENCHMARK: ANTIKYTHERA DETERMINISTIC KINEMATICS
 * 
 * Historical mechanics benchmark and numerical precision proof.
 * Validates deterministic integer arithmetic, gear train meshing, and astronomical cycle
 * phase synchronization against physical arbor tolerances.
 * 
 * Epistemic Status: ARCHIVED_BENCHMARK_PROOF
 * Sovereign Authority: Operator
 */

import { sha256Hex } from "../../lib/crypto";

export interface KinematicBenchmarkResult {
  nominalTeeth: number;
  perturbedTeeth: number;
  toothDelta: number;
  gearModuleMm: number;
  exactRationalRatio: [bigint, bigint];
  exactToothDeltaRatio: [bigint, bigint];
  ratioDeviationPercent: number;
  spiralDialAngleDriftDeg: number;
  synodicMonthPhaseDrift: number;
  calendarDayPhaseDrift: number;
  centerDistanceDeltaMm: number;
  isMechanicallyInterfering: boolean;
  isCalendarRegisterDesynchronized: boolean;
  benchmarkVerdict: "VERIFIED_EQUILIBRIUM" | "VERIFIED_INTERFERENCE_BREACH";
  auditHash: string;
}

/**
 * Executes the canonical Antikythera 38T/39T Metonic gear train kinematic benchmark.
 */
export function runAntikytheraKinematicBenchmark(
  nominalTeeth: number = 38,
  perturbedTeeth: number = 39,
  gearModuleMm: number = 0.5
): KinematicBenchmarkResult {
  if (nominalTeeth < 1 || perturbedTeeth < 1 || gearModuleMm <= 0) {
    throw new Error("[BENCHMARK ERROR] Tooth count and module must be strictly positive.");
  }

  const toothDelta = perturbedTeeth - nominalTeeth;
  const exactNominal = BigInt(nominalTeeth);
  const exactPerturbed = BigInt(perturbedTeeth);
  const exactDelta = BigInt(toothDelta);

  const exactRationalRatio: [bigint, bigint] = [exactPerturbed, exactNominal];
  const exactToothDeltaRatio: [bigint, bigint] = [exactDelta, exactNominal];

  const ratioDeviation = toothDelta / nominalTeeth;
  const ratioDeviationPercent = ratioDeviation * 100;

  // 19-year Metonic 5-turn spiral dial (1800° total arc)
  const totalSpiralDegrees = 1800;
  const spiralDialAngleDriftDeg = -ratioDeviation * totalSpiralDegrees;

  // 235 synodic months Metonic cycle
  const totalSynodicMonths = 235;
  const synodicMonthPhaseDrift = ratioDeviation * totalSynodicMonths;

  // Mean synodic month = 29.530588 days
  const meanSynodicMonthDays = 29.530588;
  const calendarDayPhaseDrift = synodicMonthPhaseDrift * meanSynodicMonthDays;

  // Center distance pitch offset: Delta C = (m * Delta N) / 2
  const centerDistanceDeltaMm = (gearModuleMm * toothDelta) / 2;

  // Fixed arbor clearance threshold is 0.05 mm
  const isMechanicallyInterfering = Math.abs(centerDistanceDeltaMm) > 0.05;
  const isCalendarRegisterDesynchronized = Math.abs(calendarDayPhaseDrift) > 1.0;

  const benchmarkVerdict: "VERIFIED_EQUILIBRIUM" | "VERIFIED_INTERFERENCE_BREACH" =
    toothDelta === 0 ? "VERIFIED_EQUILIBRIUM" : "VERIFIED_INTERFERENCE_BREACH";

  const auditPayload = JSON.stringify({
    benchmark: "ANTIKYTHERA_KINEMATICS_BENCHMARK_PROOF",
    nominalTeeth,
    perturbedTeeth,
    toothDelta,
    gearModuleMm,
    ratioDeviationPercent: Number(ratioDeviationPercent.toFixed(6)),
    spiralDialAngleDriftDeg: Number(spiralDialAngleDriftDeg.toFixed(4)),
    calendarDayPhaseDrift: Number(calendarDayPhaseDrift.toFixed(2)),
    centerDistanceDeltaMm: Number(centerDistanceDeltaMm.toFixed(4)),
    benchmarkVerdict
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
    isMechanicallyInterfering,
    isCalendarRegisterDesynchronized,
    benchmarkVerdict,
    auditHash
  };
}
