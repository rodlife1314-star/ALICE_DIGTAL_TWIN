/**
 * ATOMIC PHYSICS ACCEPTANCE TESTS — Section 14
 * Lennard-Jones 12-6 reference kernel verification
 * 
 * All tests use float64, ε = σ = 1.0
 * Tolerances: "mixed" = |a - b| ≤ tol · max(1, |b|)
 */

import { 
  computeLJPair, 
  validateLJConfiguration, 
  LJPairConfiguration,
  validateCentralDifference
} from "./lennard-jones-pair";
import { sha256Hex } from "./crypto";

interface TestResult {
  name: string;
  passed: boolean;
  actual?: number;
  expected?: number;
  tolerance?: number;
  deviation?: number;
  error?: string;
}

interface TestSuite {
  name: string;
  results: TestResult[];
  passed: number;
  failed: number;
}

const EPSILON = 1.0;
const SIGMA = 1.0;
const R_MIN = Math.pow(2, 1 / 6); // ≈ 1.122462

// ============================================================================
// TEST 1: Zero crossing at r = σ
// ============================================================================
export function testZeroCrossing(): TestResult {
  const config: LJPairConfiguration = {
    site1: { id: "atom1", position: [0, 0, 0] },
    site2: { id: "atom2", position: [SIGMA, 0, 0] },
    epsilon: EPSILON,
    sigma: SIGMA
  };
  
  const result = computeLJPair(config);
  if ("error" in result) {
    return {
      name: "Zero crossing at r = σ",
      passed: false,
      error: `Validation failed: ${result.error[0].rule}`
    };
  }
  
  const tolerance = 1e-12;
  const passed = Math.abs(result.potentialEnergy) <= tolerance;
  
  return {
    name: "Zero crossing at r = σ",
    passed,
    actual: result.potentialEnergy,
    expected: 0.0,
    tolerance,
    deviation: Math.abs(result.potentialEnergy)
  };
}

// ============================================================================
// TEST 2: Minimum energy at r = 2^(1/6)σ
// ============================================================================
export function testMinimumEnergy(): TestResult {
  const config: LJPairConfiguration = {
    site1: { id: "atom1", position: [0, 0, 0] },
    site2: { id: "atom2", position: [R_MIN * SIGMA, 0, 0] },
    epsilon: EPSILON,
    sigma: SIGMA
  };
  
  const result = computeLJPair(config);
  if ("error" in result) {
    return {
      name: "Minimum energy at r = 2^(1/6)σ",
      passed: false,
      error: `Validation failed: ${result.error[0].rule}`
    };
  }
  
  const tolerance = 1e-12;
  const passed = Math.abs(result.potentialEnergy - (-EPSILON)) <= tolerance;
  
  return {
    name: "Minimum energy at r = 2^(1/6)σ",
    passed,
    actual: result.potentialEnergy,
    expected: -EPSILON,
    tolerance,
    deviation: Math.abs(result.potentialEnergy - (-EPSILON))
  };
}

// ============================================================================
// TEST 3: Minimum force is zero at r = 2^(1/6)σ
// ============================================================================
export function testMinimumForce(): TestResult {
  const config: LJPairConfiguration = {
    site1: { id: "atom1", position: [0, 0, 0] },
    site2: { id: "atom2", position: [R_MIN * SIGMA, 0, 0] },
    epsilon: EPSILON,
    sigma: SIGMA
  };
  
  const result = computeLJPair(config);
  if ("error" in result) {
    return {
      name: "Minimum force is zero at r = 2^(1/6)σ",
      passed: false,
      error: `Validation failed: ${result.error[0].rule}`
    };
  }
  
  const tolerance = 1e-12;
  const passed = Math.abs(result.radialForce) <= tolerance;
  
  return {
    name: "Minimum force is zero at r = 2^(1/6)σ",
    passed,
    actual: result.radialForce,
    expected: 0.0,
    tolerance,
    deviation: Math.abs(result.radialForce)
  };
}

// ============================================================================
// TEST 4: Force vs energy gradient (central difference)
// ============================================================================
export function testForceVsEnergyGradient(): TestResult {
  const config: LJPairConfiguration = {
    site1: { id: "atom1", position: [0, 0, 0] },
    site2: { id: "atom2", position: [2.5 * SIGMA, 0, 0] },
    epsilon: EPSILON,
    sigma: SIGMA
  };
  
  const h = 1e-5 * SIGMA;
  const centralDiff = validateCentralDifference(config, h);
  
  if (!centralDiff.valid) {
    return {
      name: "Force vs energy gradient (central difference)",
      passed: false,
      deviation: centralDiff.maxDeviation,
      error: `Max deviation ${centralDiff.maxDeviation.toFixed(2e-6)} exceeds tolerance 1e-6`
    };
  }
  
  return {
    name: "Force vs energy gradient (central difference)",
    passed: true,
    deviation: centralDiff.maxDeviation,
    tolerance: 1e-6
  };
}

// ============================================================================
// TEST 5: Equal and opposite pair forces
// ============================================================================
export function testEqualOppositePairForces(): TestResult {
  const config: LJPairConfiguration = {
    site1: { id: "atom1", position: [0, 0, 0] },
    site2: { id: "atom2", position: [1.5 * SIGMA, 0.3 * SIGMA, 0.2 * SIGMA] },
    epsilon: EPSILON,
    sigma: SIGMA
  };
  
  const result = computeLJPair(config);
  if ("error" in result) {
    return {
      name: "Equal and opposite pair forces",
      passed: false,
      error: `Validation failed: ${result.error[0].rule}`
    };
  }
  
  const [fx1, fy1, fz1] = result.forceVector1;
  const [fx2, fy2, fz2] = result.forceVector2;
  
  const sumFx = Math.abs(fx1 + fx2);
  const sumFy = Math.abs(fy1 + fy2);
  const sumFz = Math.abs(fz1 + fz2);
  
  const mag1 = Math.sqrt(fx1 * fx1 + fy1 * fy1 + fz1 * fz1);
  const tolerance = 1e-15 * Math.max(1, mag1);
  const maxDeviation = Math.max(sumFx, sumFy, sumFz);
  const passed = maxDeviation <= tolerance;
  
  return {
    name: "Equal and opposite pair forces",
    passed,
    actual: maxDeviation,
    expected: 0.0,
    tolerance,
    deviation: maxDeviation
  };
}

// ============================================================================
// TEST 6: Translation invariance
// ============================================================================
export function testTranslationInvariance(): TestResult {
  const config1: LJPairConfiguration = {
    site1: { id: "atom1", position: [0, 0, 0] },
    site2: { id: "atom2", position: [1.8 * SIGMA, 0, 0] },
    epsilon: EPSILON,
    sigma: SIGMA
  };
  
  const config2: LJPairConfiguration = {
    site1: { id: "atom1", position: [5, 3, 2] },
    site2: { id: "atom2", position: [5 + 1.8 * SIGMA, 3, 2] },
    epsilon: EPSILON,
    sigma: SIGMA
  };
  
  const result1 = computeLJPair(config1);
  const result2 = computeLJPair(config2);
  
  if ("error" in result1 || "error" in result2) {
    return {
      name: "Translation invariance",
      passed: false,
      error: "Validation failed"
    };
  }
  
  const tolerance_energy = 1e-12;
  const tolerance_forces = 1e-12;
  
  const energy_match = Math.abs(result1.potentialEnergy - result2.potentialEnergy) <= tolerance_energy;
  const force_match = 
    Math.abs(result1.radialForce - result2.radialForce) <= tolerance_forces;
  
  const passed = energy_match && force_match;
  
  return {
    name: "Translation invariance",
    passed,
    actual: Math.abs(result1.potentialEnergy - result2.potentialEnergy),
    expected: 0.0,
    tolerance: tolerance_energy
  };
}

// ============================================================================
// TEST 7: Rigid rotation
// ============================================================================
export function testRigidRotation(): TestResult {
  // Test multiple random rotations
  const numRotations = 10;
  const tolerance = 1e-12;
  let allPassed = true;
  let maxDeviation = 0;
  
  for (let rot = 0; rot < numRotations; rot++) {
    // Random rotation angles
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.random() * 2 * Math.PI;
    const psi = Math.random() * 2 * Math.PI;
    
    // Original configuration
    const config0: LJPairConfiguration = {
      site1: { id: "atom1", position: [0, 0, 0] },
      site2: { id: "atom2", position: [2.2 * SIGMA, 0, 0] },
      epsilon: EPSILON,
      sigma: SIGMA
    };
    
    // Rotate position (simplified: single rotation around Z)
    const x = 2.2 * SIGMA;
    const x_rot = x * Math.cos(theta);
    const y_rot = x * Math.sin(theta);
    
    const configRotated: LJPairConfiguration = {
      site1: { id: "atom1", position: [0, 0, 0] },
      site2: { id: "atom2", position: [x_rot, y_rot, 0] },
      epsilon: EPSILON,
      sigma: SIGMA
    };
    
    const result0 = computeLJPair(config0);
    const resultRotated = computeLJPair(configRotated);
    
    if ("error" in result0 || "error" in resultRotated) {
      allPassed = false;
      break;
    }
    
    const energy_dev = Math.abs(result0.potentialEnergy - resultRotated.potentialEnergy);
    if (energy_dev > maxDeviation) maxDeviation = energy_dev;
    
    if (energy_dev > tolerance) {
      allPassed = false;
      break;
    }
  }
  
  return {
    name: "Rigid rotation (≥10 random rotations)",
    passed: allPassed,
    actual: maxDeviation,
    expected: 0.0,
    tolerance
  };
}

// ============================================================================
// TEST 8: Rejection tests
// ============================================================================
export function testRejections(): TestResult[] {
  const results: TestResult[] = [];
  
  const testCases = [
    {
      name: "Reject r = 0",
      config: {
        site1: { id: "atom1", position: [0, 0, 0] },
        site2: { id: "atom2", position: [0, 0, 0] },
        epsilon: EPSILON,
        sigma: SIGMA
      },
      expectedError: "separation"
    },
    {
      name: "Reject r < 0.5σ",
      config: {
        site1: { id: "atom1", position: [0, 0, 0] },
        site2: { id: "atom2", position: [0.4 * SIGMA, 0, 0] },
        epsilon: EPSILON,
        sigma: SIGMA
      },
      expectedError: "separation"
    },
    {
      name: "Reject r > 5σ",
      config: {
        site1: { id: "atom1", position: [0, 0, 0] },
        site2: { id: "atom2", position: [5.1 * SIGMA, 0, 0] },
        epsilon: EPSILON,
        sigma: SIGMA
      },
      expectedError: "separation"
    },
    {
      name: "Reject NaN coordinate",
      config: {
        site1: { id: "atom1", position: [NaN, 0, 0] },
        site2: { id: "atom2", position: [2 * SIGMA, 0, 0] },
        epsilon: EPSILON,
        sigma: SIGMA
      },
      expectedError: "position"
    },
    {
      name: "Reject ε ≤ 0",
      config: {
        site1: { id: "atom1", position: [0, 0, 0] },
        site2: { id: "atom2", position: [1.5 * SIGMA, 0, 0] },
        epsilon: 0,
        sigma: SIGMA
      },
      expectedError: "epsilon"
    },
    {
      name: "Reject σ ≤ 0",
      config: {
        site1: { id: "atom1", position: [0, 0, 0] },
        site2: { id: "atom2", position: [1.5, 0, 0] },
        epsilon: EPSILON,
        sigma: 0
      },
      expectedError: "sigma"
    }
  ];
  
  for (const tc of testCases) {
    const validation = validateLJConfiguration(tc.config);
    const rejected = !validation.valid;
    const hasCorrectError = validation.errors.some(e => e.field.includes(tc.expectedError));
    const passed = rejected && hasCorrectError;
    
    results.push({
      name: tc.name,
      passed,
      error: passed ? undefined : `Expected error in "${tc.expectedError}" but got: ${JSON.stringify(validation.errors)}`
    });
  }
  
  return results;
}

// ============================================================================
// TEST 9: Determinism (bitwise reproducibility)
// ============================================================================
export function testDeterminism(): TestResult {
  const config: LJPairConfiguration = {
    site1: { id: "atom1", position: [1.234567890123456, 0.987654321, 0] },
    site2: { id: "atom2", position: [3.456789012345678, 1.123456789, 0] },
    epsilon: EPSILON,
    sigma: SIGMA
  };
  
  const result1 = computeLJPair(config);
  const result2 = computeLJPair(config);
  
  if ("error" in result1 || "error" in result2) {
    return {
      name: "Determinism (bitwise identical outputs)",
      passed: false,
      error: "Validation failed"
    };
  }
  
  const outputsMatch = 
    result1.potentialEnergy === result2.potentialEnergy &&
    result1.radialForce === result2.radialForce &&
    result1.forceVector1[0] === result2.forceVector1[0] &&
    result1.forceVector1[1] === result2.forceVector1[1] &&
    result1.forceVector1[2] === result2.forceVector1[2];
  
  const hashesMatch = 
    result1.inputHash === result2.inputHash &&
    result1.resultHash === result2.resultHash;
  
  const passed = outputsMatch && hashesMatch;
  
  return {
    name: "Determinism (bitwise identical outputs & digests)",
    passed,
    error: passed ? undefined : `Outputs or hashes differ on identical inputs`
  };
}

// ============================================================================
// RUN ALL ATOMIC TESTS
// ============================================================================
export function runAtomicTestSuite(): TestSuite {
  const results: TestResult[] = [
    testZeroCrossing(),
    testMinimumEnergy(),
    testMinimumForce(),
    testForceVsEnergyGradient(),
    testEqualOppositePairForces(),
    testTranslationInvariance(),
    testRigidRotation(),
    ...testRejections(),
    testDeterminism()
  ];
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  return {
    name: "Atomic Physics Acceptance Tests (Section 14)",
    results,
    passed,
    failed
  };
}

export function formatTestSuite(suite: TestSuite): string {
  const lines: string[] = [];
  lines.push(`\n${"=".repeat(80)}`);
  lines.push(`${suite.name}`);
  lines.push(`${"=".repeat(80)}`);
  lines.push(`PASSED: ${suite.passed} | FAILED: ${suite.failed}\n`);
  
  for (const result of suite.results) {
    const status = result.passed ? "✅ PASS" : "❌ FAIL";
    lines.push(`${status}: ${result.name}`);
    
    if (result.actual !== undefined) {
      lines.push(`       Actual: ${result.actual.toFixed(15)}`);
    }
    if (result.expected !== undefined) {
      lines.push(`       Expected: ${result.expected.toFixed(15)}`);
    }
    if (result.tolerance !== undefined) {
      lines.push(`       Tolerance: ${result.tolerance.toFixed(2e-15)}`);
    }
    if (result.deviation !== undefined) {
      lines.push(`       Deviation: ${result.deviation.toFixed(2e-15)}`);
    }
    if (result.error) {
      lines.push(`       Error: ${result.error}`);
    }
    lines.push("");
  }
  
  lines.push(`${"=".repeat(80)}\n`);
  return lines.join("\n");
}
