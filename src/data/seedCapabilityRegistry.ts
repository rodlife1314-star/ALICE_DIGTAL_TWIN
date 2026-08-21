import {
  ModelCapability,
  TaskModelSelectionRequest,
  ModelSelectionResult,
  EvaluatedModelMatch,
  InferenceRail
} from "../types";

/**
 * ── COMMON INFERENCE CONTRACT RAILS ──────────────────────────────────────────
 * Sovereign Trust Boundary:
 *  - Gemini (Cognitive / Framing / Loop): APPROVED
 *  - NVIDIA NIM / RAPIDS (Accelerated Compute): APPROVED
 *  - Open-Source vLLM / Local Runtime (Provider-Agnostic): EXPERIMENTAL
 *  - Local Deterministic Kinematics (Zero-Drift Arithmetic): APPROVED
 *  - FPT AI Factory / Remote Pod: REVOKED (Preserved only for historical ledger provenance)
 */
export const SYSTEM_INFERENCE_RAILS: InferenceRail[] = [
  {
    rail_id: "RAIL-NVIDIA-NIM",
    provider: "NVIDIA",
    runtime: "nvidia-nim",
    deployment_mode: "HOSTED_EXTERNAL",
    model_id: "nvidia-nim-physics/stefan-boltzmann-pde-v2",
    endpoint: "https://integrate.api.nvidia.com/v1/physics",
    capabilities: ["physical_simulation", "high_precision", "deterministic"],
    trust_state: "APPROVED",
    credential_state: "CONFIGURED",
    health_state: "HEALTHY",
    execution_location: "NVIDIA Cloud GPU Fabric (H100/A100)",
    trustRationale: "Operator Approved: Primary external accelerated compute ecosystem for TensorRT-LLM and physics solvers."
  },
  {
    rail_id: "RAIL-RAPIDS-CUDF",
    provider: "NVIDIA",
    runtime: "rapids-cudf",
    deployment_mode: "HOSTED_EXTERNAL",
    model_id: "rapids-cudf-sweep/atmospheric-modtran-v24",
    endpoint: "local-gpu://rapids-engine",
    capabilities: ["physical_simulation", "deterministic", "high_precision", "edge_offline"],
    trust_state: "APPROVED",
    credential_state: "NOT_REQUIRED",
    health_state: "HEALTHY",
    execution_location: "Local/Remote cuDF Vectorized Dataframe Engine",
    trustRationale: "Operator Approved: High-throughput parametric sweeps & atmospheric transmissivity matrices."
  },
  {
    rail_id: "RAIL-OPEN-SOURCE",
    provider: "Open-Source Inference Fabric",
    runtime: "vllm",
    deployment_mode: "SELF_HOSTED_REMOTE",
    model_id: "mistralai/Mistral-7B-Instruct-v0.3",
    endpoint: "http://localhost:8000/v1 or custom vLLM instance",
    capabilities: ["fast_reasoning", "evidence_synthesis", "edge_offline"],
    trust_state: "EXPERIMENTAL",
    credential_state: "NOT_REQUIRED",
    health_state: "HEALTHY",
    execution_location: "Provider-Neutral Self-Hosted / Local Runtime (vLLM/TGI/Ollama)",
    trustRationale: "Experimental: Provider-agnostic open-source inference lane. Unbound from proprietary hosting."
  },
  {
    rail_id: "RAIL-LOCAL-DETERMINISTIC",
    provider: "Pathfinder Substrate",
    runtime: "local-deterministic",
    deployment_mode: "LOCAL",
    model_id: "local-deterministic-kinematics/metonic-v1",
    endpoint: "substrate://in-process-avx512",
    capabilities: ["deterministic", "high_precision", "edge_offline"],
    trust_state: "APPROVED",
    credential_state: "NOT_REQUIRED",
    health_state: "HEALTHY",
    execution_location: "Local Host CPU V8 AVX-512 Substrate",
    trustRationale: "Operator Approved: Exact integer arithmetic, zero-drift kinematics & reproducible analytical PDE."
  },
  {
    rail_id: "RAIL-GEMINI-COGNITION",
    provider: "Google AI Studio",
    runtime: "cloud-gemini",
    deployment_mode: "HOSTED_EXTERNAL",
    model_id: "gemini-3.6-flash",
    endpoint: "https://generativelanguage.googleapis.com",
    capabilities: ["fast_reasoning", "evidence_synthesis", "boundary_permeability", "strict_json"],
    trust_state: "APPROVED",
    credential_state: "CONFIGURED",
    health_state: "HEALTHY",
    execution_location: "Google Cloud Gemini Core",
    trustRationale: "Operator Approved: Epistemic framing, constraint discovery & counterfactual ablation (Does NOT manufacture raw solver output)."
  },
  {
    rail_id: "RAIL-FPT-HPC",
    provider: "FPT AI Factory (Revoked)",
    runtime: "fpt-hpc-runtime-v4.1",
    deployment_mode: "HOSTED_EXTERNAL",
    model_id: "fpt-ai-cloud-hpc/multiphysics-cluster-v4",
    endpoint: "https://api.fpt.ai/hpc (Disabled)",
    capabilities: ["physical_simulation", "high_precision"],
    trust_state: "REVOKED",
    credential_state: "REVOKED",
    health_state: "REVOKED",
    execution_location: "Remote Cluster Pod (Decommissioned)",
    trustRationale: "REVOKED: FPT AI Factory trust boundary revoked by Operator. Preserved only for historical audit ledger."
  }
];

export const SYSTEM_CAPABILITY_REGISTRY: ModelCapability[] = [
  {
    id: "gemini-3.5-flash",
    name: "Gemini 3.5 Flash (Cognition & Framing)",
    provider: "Google AI Studio",
    trustState: "APPROVED",
    latencyMs: {
      avgMs: 180,
      p95Ms: 340,
      rating: "low"
    },
    hardwareRequirements: {
      targetDevice: "Cloud",
      minVramGB: 0,
      recommendedCpuCores: 2,
      bandwidthMbps: 10,
      offlineSupport: false
    },
    trustScore: 96,
    supportedDomains: ["physical", "engineered", "biological", "environmental", "conceptual", "musical", "hybrid"],
    capabilities: [
      "fast_reasoning",
      "evidence_synthesis",
      "boundary_permeability",
      "strict_json"
    ],
    costPer1kTokens: 0.00015,
    maxContextTokens: 1000000,
    activeStatus: "available"
  },
  {
    id: "nvidia-nim-physics",
    name: "NVIDIA NIM / TensorRT-LLM Physics Rail",
    provider: "NVIDIA NIM",
    trustState: "APPROVED",
    latencyMs: {
      avgMs: 45,
      p95Ms: 90,
      rating: "realtime"
    },
    hardwareRequirements: {
      targetDevice: "GPU",
      minVramGB: 16,
      recommendedCpuCores: 8,
      bandwidthMbps: 100,
      offlineSupport: false
    },
    trustScore: 99,
    supportedDomains: ["physical", "engineered", "environmental", "hybrid"],
    capabilities: [
      "physical_simulation",
      "high_precision",
      "deterministic"
    ],
    costPer1kTokens: 0.0005,
    maxContextTokens: 128000,
    activeStatus: "available"
  },
  {
    id: "rapids-cudf-sweep",
    name: "RAPIDS GPU Dataframe & Parameter Sweep Engine",
    provider: "NVIDIA NIM",
    trustState: "APPROVED",
    latencyMs: {
      avgMs: 25,
      p95Ms: 50,
      rating: "realtime"
    },
    hardwareRequirements: {
      targetDevice: "GPU",
      minVramGB: 24,
      recommendedCpuCores: 12,
      bandwidthMbps: 150,
      offlineSupport: true
    },
    trustScore: 99,
    supportedDomains: ["physical", "engineered", "environmental", "hybrid"],
    capabilities: [
      "physical_simulation",
      "deterministic",
      "high_precision",
      "edge_offline"
    ],
    costPer1kTokens: 0.0,
    maxContextTokens: 64000,
    activeStatus: "available"
  },
  {
    id: "open-source-vllm-mistral",
    name: "Open-Source vLLM Provider-Neutral Inference Rail",
    provider: "Open-Source Runtime",
    trustState: "EXPERIMENTAL",
    latencyMs: {
      avgMs: 65,
      p95Ms: 140,
      rating: "realtime"
    },
    hardwareRequirements: {
      targetDevice: "GPU",
      minVramGB: 8,
      recommendedCpuCores: 8,
      bandwidthMbps: 50,
      offlineSupport: true
    },
    trustScore: 92,
    supportedDomains: ["physical", "engineered", "biological", "environmental", "hybrid"],
    capabilities: [
      "fast_reasoning",
      "evidence_synthesis",
      "edge_offline"
    ],
    costPer1kTokens: 0.0,
    maxContextTokens: 64000,
    activeStatus: "available"
  },
  {
    id: "physics-pde-solver-v2",
    name: "Deterministic Stefan-Boltzmann & PDE Solver v2",
    provider: "Custom Deterministic Engine",
    trustState: "APPROVED",
    latencyMs: {
      avgMs: 12,
      p95Ms: 28,
      rating: "realtime"
    },
    hardwareRequirements: {
      targetDevice: "CPU",
      minVramGB: 2,
      recommendedCpuCores: 4,
      offlineSupport: true
    },
    trustScore: 100,
    supportedDomains: ["physical", "engineered", "environmental"],
    capabilities: [
      "deterministic",
      "high_precision",
      "physical_simulation",
      "edge_offline"
    ],
    costPer1kTokens: 0.0,
    maxContextTokens: 16000,
    activeStatus: "available"
  },
  {
    id: "local-deterministic-kinematics",
    name: "Local Deterministic Metonic Kinematics Substrate",
    provider: "Custom Deterministic Engine",
    trustState: "APPROVED",
    latencyMs: {
      avgMs: 5,
      p95Ms: 12,
      rating: "realtime"
    },
    hardwareRequirements: {
      targetDevice: "CPU",
      minVramGB: 1,
      recommendedCpuCores: 2,
      offlineSupport: true
    },
    trustScore: 100,
    supportedDomains: ["physical", "engineered"],
    capabilities: [
      "deterministic",
      "high_precision",
      "edge_offline"
    ],
    costPer1kTokens: 0.0,
    maxContextTokens: 8000,
    activeStatus: "available"
  },
  {
    id: "local-mistral-7b-q4",
    name: "Local Edge Mistral 7B Q4",
    provider: "Local Edge Runtime",
    trustState: "EXPERIMENTAL",
    latencyMs: {
      avgMs: 110,
      p95Ms: 210,
      rating: "realtime"
    },
    hardwareRequirements: {
      targetDevice: "GPU",
      minVramGB: 6,
      recommendedCpuCores: 8,
      offlineSupport: true
    },
    trustScore: 89,
    supportedDomains: ["physical", "engineered", "biological", "environmental", "hybrid"],
    capabilities: [
      "edge_offline",
      "fast_reasoning",
      "boundary_permeability"
    ],
    costPer1kTokens: 0.0,
    maxContextTokens: 32000,
    activeStatus: "available"
  },
  {
    id: "biomed-biobert-v1",
    name: "BioMed BioBERT Edge Neural",
    provider: "Local Edge Runtime",
    trustState: "EXPERIMENTAL",
    latencyMs: {
      avgMs: 85,
      p95Ms: 160,
      rating: "realtime"
    },
    hardwareRequirements: {
      targetDevice: "GPU",
      minVramGB: 4,
      recommendedCpuCores: 6,
      offlineSupport: true
    },
    trustScore: 95,
    supportedDomains: ["biological", "environmental", "hybrid"],
    capabilities: [
      "evidence_synthesis",
      "high_precision",
      "edge_offline"
    ],
    costPer1kTokens: 0.0,
    maxContextTokens: 16000,
    activeStatus: "available"
  },
  {
    id: "fpt-ai-cloud-hpc",
    name: "FPT AI Cloud HPC Pod (REVOKED - Historical Ledger Only)",
    provider: "FPT Neural (Revoked)",
    trustState: "REVOKED",
    latencyMs: {
      avgMs: 999,
      p95Ms: 999,
      rating: "batch"
    },
    hardwareRequirements: {
      targetDevice: "Cloud",
      minVramGB: 32,
      recommendedCpuCores: 16,
      bandwidthMbps: 200,
      offlineSupport: false
    },
    trustScore: 0,
    supportedDomains: [],
    capabilities: [],
    costPer1kTokens: 0.0,
    maxContextTokens: 0,
    activeStatus: "offline"
  }
];

export function selectBestFitModel(
  registry: ModelCapability[] = SYSTEM_CAPABILITY_REGISTRY,
  request: TaskModelSelectionRequest
): ModelSelectionResult {
  const evaluated: EvaluatedModelMatch[] = [];

  for (const model of registry) {
    let eligible = true;
    const reasons: string[] = [];
    let score = model.trustScore;

    // Filter out revoked trust state or offline models immediately
    if (model.trustState === "REVOKED" || model.activeStatus === "offline") {
      evaluated.push({
        modelId: model.id,
        modelName: model.name,
        score: 0,
        eligible: false,
        reasons: ["Ineligible: Compute rail trust state is REVOKED by Sovereign Operator."]
      });
      continue;
    }

    // Check offline requirement
    if (request.requireOffline && !model.hardwareRequirements.offlineSupport) {
      eligible = false;
      reasons.push("Ineligible: Requires local offline execution, but model relies on Cloud connection.");
    }

    // Check Max VRAM limit if specified
    if (request.maxVramGB !== undefined && model.hardwareRequirements.minVramGB > request.maxVramGB) {
      eligible = false;
      reasons.push(
        `Ineligible: Minimum VRAM requirement (${model.hardwareRequirements.minVramGB}GB) exceeds task limit (${request.maxVramGB}GB).`
      );
    }

    // Check Max Latency threshold if specified
    if (request.maxAllowedLatencyMs !== undefined && model.latencyMs.avgMs > request.maxAllowedLatencyMs) {
      eligible = false;
      reasons.push(
        `Ineligible: Average latency (${model.latencyMs.avgMs}ms) exceeds task max threshold (${request.maxAllowedLatencyMs}ms).`
      );
    }

    // Check Minimum Trust Score threshold
    if (request.minTrustScore !== undefined && model.trustScore < request.minTrustScore) {
      eligible = false;
      reasons.push(
        `Ineligible: Trust score (${model.trustScore}%) is below minimum required threshold (${request.minTrustScore}%).`
      );
    }

    // Domain Check
    if (model.supportedDomains && !model.supportedDomains.includes(request.twinDomain)) {
      eligible = false;
      reasons.push(`Ineligible: Domain '${request.twinDomain}' is not supported by this model capability profile.`);
    }

    if (eligible) {
      // Bonus points calculation
      // Latency speed bonus (up to 20 pts)
      const speedBonus = Math.max(0, Math.min(20, Math.round((500 - model.latencyMs.avgMs) / 20)));
      score += speedBonus;
      reasons.push(`+${speedBonus} pts: Latency fit (${model.latencyMs.avgMs}ms avg).`);

      // Required capability matching
      if (request.requiredCapabilities && request.requiredCapabilities.length > 0) {
        let matchedCaps = 0;
        for (const cap of request.requiredCapabilities) {
          if (model.capabilities.includes(cap as any)) {
            matchedCaps++;
            score += 15;
          }
        }
        reasons.push(`+${matchedCaps * 15} pts: Matched ${matchedCaps}/${request.requiredCapabilities.length} required capability tags.`);
      }

      // Offline bonus if offline requested & supported
      if (request.requireOffline && model.hardwareRequirements.offlineSupport) {
        score += 10;
        reasons.push("+10 pts: Zero-cloud offline edge capability satisfied.");
      }

      reasons.push(`Base Trust Score: ${model.trustScore}% [Trust State: ${model.trustState || "UNVERIFIED"}]`);
    }

    evaluated.push({
      modelId: model.id,
      modelName: model.name,
      score: Math.round(score),
      eligible,
      reasons
    });
  }

  // Filter eligible models or fallback
  const eligibleModels = evaluated.filter((e) => e.eligible);

  if (eligibleModels.length === 0) {
    // Fallback to active approved model with highest trust score
    const fallback = registry
      .filter(m => m.trustState !== "REVOKED" && m.activeStatus !== "offline")
      .reduce((prev, curr) => (curr.trustScore > prev.trustScore ? curr : prev), registry[0]);
    return {
      selectedModel: fallback,
      selectionScore: fallback.trustScore,
      matchRationales: [
        "WARNING: No candidate model satisfied 100% of stringent hardware or latency constraints.",
        `Fallback selected: ${fallback.name} (Trust State: ${fallback.trustState || "APPROVED"}, Score: ${fallback.trustScore}%)`
      ],
      evaluatedModels: evaluated
    };
  }

  // Pick highest scoring eligible model
  eligibleModels.sort((a, b) => b.score - a.score);
  const bestMatch = eligibleModels[0];
  const selectedModel = registry.find((m) => m.id === bestMatch.modelId) || registry[0];

  return {
    selectedModel,
    selectionScore: bestMatch.score,
    matchRationales: [
      `Optimal match: ${selectedModel.name} (${selectedModel.provider})`,
      `Composite Capability Score: ${bestMatch.score} points | Trust State: ${selectedModel.trustState || "APPROVED"}`,
      `Latency: ${selectedModel.latencyMs.avgMs}ms (${selectedModel.latencyMs.rating.toUpperCase()}) | Trust Score: ${selectedModel.trustScore}%`,
      `Target Device: ${selectedModel.hardwareRequirements.targetDevice} (${selectedModel.hardwareRequirements.minVramGB}GB VRAM, ${selectedModel.hardwareRequirements.recommendedCpuCores} cores)`
    ],
    evaluatedModels: evaluated
  };
}
