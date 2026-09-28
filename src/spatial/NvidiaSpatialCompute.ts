import { 
  SpatialComputeRequest, 
  SpatialComputeResult, 
  PathfinderSpatialScale, 
  SpatialFieldData 
} from "../types/spatial";
import { sha256Hex } from "../lib/crypto";

/**
 * PATHFINDER HIGH-ASSURANCE SPATIAL COMPUTE RAIL & PROCEDURAL DEMO
 * 
 * Epistemic Foundations:
 * 1. "Rendering fidelity ≠ solver fidelity"
 * 2. "A configured endpoint does not prove successful execution."
 * 3. "Acceleration does not create authority. Presentation does not create evidence. The Operator reads the residual."
 * 4. Local procedural evaluations are explicitly classified as PROCEDURAL_DEMO / COMPUTE-GENERATED.
 *    They must never masquerade as verified remote H100 hardware execution or forged TPM attestations.
 * 5. Remote compute receipts require authentic server-side cryptographic hashing.
 */

// Canonical SHA-256 implementation imported from shared crypto utility
export const computeSha256Hex = sha256Hex;

export class NvidiaSpatialComputeRail {
  /**
   * Evaluates a spatial compute request locally under PROCEDURAL_DEMO mode.
   * Explicitly labeled as PROCEDURAL_DEMO without pretending to be remote H100 execution.
   */
  public static async executeSpatialCompute(
    request: SpatialComputeRequest
  ): Promise<SpatialComputeResult> {
    const requestId = `demo-req-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    
    // Procedural execution latency budget
    const queueTimeMs = 5;
    const kernelTimeMs = 12;
    const remoteRoundTripTimeMs = 35;
    const wallTimeMs = 35;

    await new Promise((resolve) => setTimeout(resolve, 35));

    // Strict requested tolerance (default 1.00e-5 unless caller overrides)
    const requestedTolerance = request.convergenceTolerance ?? 1.0e-5;

    let solverFramework = "Pathfinder Procedural Spatial Simulator";
    let solverVersion = "v2.4.0 (Client Procedural / Mathematical Heuristic)";
    let solverName = "Local Procedural Continuum Simulator";
    let providerJobId = `procedural-job-${Math.floor(10000 + Math.random() * 90000)}`;
    let providerEndpoint = "local-procedural://pathfinder-client";
    let hardwareReportedByProvider = "Client WebGL / WASM Substrate (Procedural Demo Mode)";
    let meshShape: [number, number, number] = [64, 64, 64];
    let fieldArtifactReference = `local://spatial-artifacts/field-${providerJobId}.dat`;
    let stoppingCriterion: "TOLERANCE_MET" | "MAX_ITERATIONS_REACHED" | "DIVERGENCE_DETECTED" | "TIME_STEP_LIMIT" = "TOLERANCE_MET";

    let scalarValue = 0;
    let minRange = 0;
    let maxRange = 100;
    let unit = "";
    let fieldType: "temperature_field" | "co2_concentration" | "electric_potential" | "ir_flux_density" | "shear_stress" = "temperature_field";
    let finalResidual = 8.2e-6;
    let iterationsExecuted = 50;

    switch (request.physicsDomain) {
      case "electrochemistry":
        solverName = "Procedural Poisson-Nernst-Planck Model";
        fieldType = "electric_potential";
        const surfPot = request.boundaryConditions.surfacePotentialMv ?? -60;
        scalarValue = surfPot;
        minRange = -100;
        maxRange = 50;
        unit = "mV";
        finalResidual = 3.1e-5;
        iterationsExecuted = 60;
        stoppingCriterion = "MAX_ITERATIONS_REACHED";
        break;

      case "thermal_radiation":
        solverName = "Procedural Stefan-Boltzmann Balance Model";
        fieldType = "temperature_field";
        const amb = request.boundaryConditions.ambientTempC ?? 34.0;
        const pwv = request.boundaryConditions.precipitableWaterVaporMm ?? 14.0;
        const subAmbient = Math.max(1.5, 9.2 - pwv * 0.12);
        scalarValue = Number((amb - subAmbient).toFixed(2));
        minRange = 15;
        maxRange = 50;
        unit = "°C";
        finalResidual = 7.8e-6;
        iterationsExecuted = 80;
        stoppingCriterion = "TOLERANCE_MET";
        break;

      case "kinematics":
        solverName = "Procedural Involute Gear Contact Model";
        fieldType = "shear_stress";
        const model = request.boundaryConditions.sarosToothHypothesis ?? "MODEL_A_223";
        scalarValue = model === "MODEL_A_223" ? 0.012 : 0.284;
        minRange = 0;
        maxRange = 1.0;
        unit = "° Phase Drift";
        finalResidual = 1.2e-6;
        iterationsExecuted = 40;
        stoppingCriterion = "TOLERANCE_MET";
        break;

      case "bio_aerodynamics":
        solverName = "Procedural Chimney Buoyancy Model";
        fieldType = "co2_concentration";
        const sealed = request.boundaryConditions.isChimneySealed ?? false;
        scalarValue = sealed ? 2840 : 620;
        minRange = 400;
        maxRange = 4000;
        unit = "ppm CO₂";
        finalResidual = 5.4e-5;
        iterationsExecuted = 100;
        stoppingCriterion = "MAX_ITERATIONS_REACHED";
        break;

      case "fluid_emulsion":
        solverName = "Procedural Emulsion Thermal Dispersion Model";
        fieldType = "temperature_field";
        scalarValue = 68.5;
        minRange = 20;
        maxRange = 100;
        unit = "°C Emulsion Core";
        finalResidual = 9.1e-5;
        iterationsExecuted = 75;
        stoppingCriterion = "MAX_ITERATIONS_REACHED";
        break;
    }

    const toleranceRatio = Number((finalResidual / requestedTolerance).toFixed(2));
    const convergenceStatus = finalResidual <= requestedTolerance;

    let epistemicRoute: "HOLD" | "SURFACE" | "STOP" | "REJECTED" = convergenceStatus ? "SURFACE" : "HOLD";
    let conflictRationale: string | undefined = undefined;

    if (!convergenceStatus) {
      conflictRationale = `[PROCEDURAL DEMO] Final residual ${finalResidual.toExponential(2)} exceeds tolerance ${requestedTolerance.toExponential(2)}. Awaiting true remote physical solver dispatch.`;
    }

    const inputManifestPayload = JSON.stringify({
      requestId,
      twinId: request.twinId,
      spatialScale: request.spatialScale,
      physicsDomain: request.physicsDomain,
      boundaryConditions: request.boundaryConditions,
      requestedResolution: request.requestedResolution,
      meshShape,
      requestedTolerance,
      timeWindow: request.timeWindow,
      mode: "PROCEDURAL_DEMO"
    });
    const inputManifestHash = computeSha256Hex(inputManifestPayload);

    const rawOutputPayload = JSON.stringify({
      providerJobId,
      scalarValue,
      finalResidual,
      toleranceRatio,
      convergenceStatus,
      iterationsExecuted,
      stoppingCriterion,
      meshShape,
      fieldArtifactReference
    });
    const rawOutputHash = computeSha256Hex(rawOutputPayload);

    const receiptPayload = JSON.stringify({
      providerJobId,
      providerEndpoint,
      solverFramework,
      solverVersion,
      hardwareReportedByProvider,
      inputManifestHash,
      rawOutputHash,
      finalResidual,
      requestedTolerance,
      toleranceRatio,
      convergenceStatus,
      timestamp: new Date().toISOString()
    });
    const receiptHash = computeSha256Hex(receiptPayload);

    const receiptId = `rcpt-demo-${providerJobId}`;
    const solverRunId = `DEMO-${request.physicsDomain.toUpperCase()}`;

    // Honest attestation indicating procedural execution
    const providerSignatureOrVerifiableAttestation = {
      attestationType: "LOCAL_PROCEDURAL_CALCULATION (Heuristic Model Demo - Remote Hardware Attestation Unavailable)",
      signer: "Local Client Substrate",
      keyFingerprint: "N/A:CLIENT_LOCAL_SIMULATION",
      verified: false,
      signature: `0xDEMO${receiptHash.slice(0, 32)}`
    };

    const fieldData: SpatialFieldData = {
      fieldType,
      fieldSource: "PROCEDURAL_DEMO",
      scalarValue,
      minRange,
      maxRange,
      unit,
      meshResolution: `${meshShape.join('×')} ${request.requestedResolution}`,
      timestep: `Δt = ${(request.timeWindow.step || 0.05).toFixed(3)}s`,
      solverRunId,
      residual: `|f(x)| = ${finalResidual.toExponential(2)} (Procedural estimate, limit ${requestedTolerance.toExponential(2)})`,
      evidenceState: "COMPUTE-GENERATED / PENDING VALIDATION" as any,
      lastSolverReceiptId: receiptId
    };

    return {
      requestId,
      twinId: request.twinId,
      spatialScale: request.spatialScale,
      physicsDomain: request.physicsDomain,
      fieldData,
      providerJobId,
      providerEndpoint,
      solverFramework,
      solverVersion,
      hardwareReportedByProvider,
      requestedTolerance,
      finalResidual,
      toleranceRatio,
      convergenceStatus,
      stoppingCriterion,
      iterationsExecuted,
      meshShape,
      fieldArtifactReference,
      executionBreakdown: {
        remoteRoundTripTimeMs,
        queueTimeMs,
        kernelTimeMs,
        wallTimeMs
      },
      inputManifestHash,
      rawOutputHash,
      receiptHash,
      providerSignatureOrVerifiableAttestation,
      epistemicRoute,
      conflictRationale,
      solverMetadata: {
        solverName,
        solverVersion,
        hardwareTarget: hardwareReportedByProvider,
        executionTimeMs: remoteRoundTripTimeMs,
        iterations: iterationsExecuted
      },
      convergenceState: convergenceStatus ? "CONVERGED" : "NOT_CONVERGED_TOLERANCE_EXCEEDED",
      residual: finalResidual,
      uncertainty: 0.05,
      computeReceipt: {
        receiptId,
        rail: "LOCAL-PROCEDURAL-DEMO",
        solverIdentity: `${solverName} on ${hardwareReportedByProvider}`,
        timestamp: new Date().toISOString(),
        hash: receiptHash,
        evidenceState: "COMPUTE-GENERATED / PENDING VALIDATION" as any,
        verified: false
      },
      appliedToCanonicalState: false
    };
  }
}
