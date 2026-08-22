/**
 * PATHFINDER NeMo SWITCHYARD CAPABILITY ROUTER
 * 
 * Epistemic Foundations:
 * 1. "capability routing ≠ authority routing"
 *    A router may decide where reasoning executes; it must NEVER independently decide
 *    whether the resulting action is authorized. Authority remains exclusively with the Sovereign Operator.
 * 2. Provider-Agnostic Semantic Targets:
 *    TASK → classify complexity → select capability tier → execute → validate → provenance.
 * 3. Quantization is Model Engineering:
 *    Model families differentiate across precision (e.g. BF16 vs NVFP4-QAD),
 *    active parameter MoE footprints, throughput benchmarks, and hardware deployment targets.
 */

export type CapabilityTier = 
  | "TIER_1_EXECUTION"       // Tool calls, JSON formatting, deterministic validation, subagent execution (e.g. Nemotron-3.5-Lightning 3B active MoE)
  | "TIER_2_DETERMINISTIC"   // Exact integer kinematics, PDE solvers, cuDF GPU dataframe sweeps
  | "TIER_3_FRONTIER_PLANNING"; // High-level counterfactual synthesis, multi-agent epistemic loop (e.g. Gemini 3.7 Flash)

export type SemanticCapability =
  | "GPU_DATAFRAME"
  | "GPU_VECTOR_SEARCH"
  | "GPU_PDE"
  | "COLUMNAR_ACCELERATION"
  | "EXACT_KINEMATICS"
  | "FAST_EXECUTION_MOE"
  | "FRONTIER_COGNITION"
  | "TAMPER_EVIDENT_HASHING";

export interface ModelArtifactSpec {
  id: string;
  modelFamily: string;
  checkpoint: string;
  precision: "NVFP4-QAD" | "BF16" | "FP8" | "INT8" | "EXACT_INTEGER";
  quantizationMethod: "QAD_Megatron_Bridge" | "Standard_Post_Training" | "Native_BF16" | "Deterministic_V8";
  totalParameters: string;
  activeParameters: string;
  hardwareTarget: "DGX_Spark" | "GeForce_Jetson_Orin" | "L40S" | "H100_SXM5" | "Local_CPU";
  memoryRequirementGb: number;
  tokensPerSec: number;
  benchmarkRecoveryRate: number; // e.g. 0.96 for QAD
  inferenceEngine: "vLLM" | "TensorRT_LLM" | "Ollama" | "Node_VM";
  capabilityTier: CapabilityTier;
  semanticCapabilities: SemanticCapability[];
  trustState: "APPROVED" | "EXPERIMENTAL" | "REVOKED";
}

export interface SwitchyardRoutingRequest {
  taskType: "tool_validation" | "kinematic_calculation" | "dataframe_sweep" | "pde_solve" | "counterfactual_planning" | "governance_audit";
  twinDomain: string;
  complexityScore: number; // 0.0 to 1.0 (e.g. <= 0.35 -> Tier 1, 0.35-0.75 -> Tier 2, > 0.75 -> Tier 3)
  latencyBudgetMs: number;
  costSensitivity: "LOW" | "BALANCED" | "HIGH";
  requiredCapabilities: SemanticCapability[];
}

export interface SwitchyardRoutingDecision {
  routingId: string;
  selectedModel: ModelArtifactSpec;
  capabilityTier: CapabilityTier;
  semanticTarget: string;
  routingRationale: string;
  estimatedLatencyMs: number;
  costReductionPercentage: number;
  authorityBoundaryNotice: string;
  timestamp: string;
}

export const SWITCHYARD_MODEL_CATALOG: ModelArtifactSpec[] = [
  {
    id: "nemotron-3.5-lightning-nvfp4-qad",
    modelFamily: "NVIDIA Nemotron 3.5 Lightning",
    checkpoint: "nemotron-3.5-lightning-30b-moe-qad",
    precision: "NVFP4-QAD",
    quantizationMethod: "QAD_Megatron_Bridge",
    totalParameters: "30B MoE",
    activeParameters: "3B Active",
    hardwareTarget: "GeForce_Jetson_Orin",
    memoryRequirementGb: 22,
    tokensPerSec: 145,
    benchmarkRecoveryRate: 0.964,
    inferenceEngine: "TensorRT_LLM",
    capabilityTier: "TIER_1_EXECUTION",
    semanticCapabilities: ["FAST_EXECUTION_MOE", "COLUMNAR_ACCELERATION"],
    trustState: "APPROVED"
  },
  {
    id: "nemotron-3.5-lightning-bf16",
    modelFamily: "NVIDIA Nemotron 3.5 Lightning",
    checkpoint: "nemotron-3.5-lightning-30b-moe-bf16",
    precision: "BF16",
    quantizationMethod: "Native_BF16",
    totalParameters: "30B MoE",
    activeParameters: "3B Active",
    hardwareTarget: "DGX_Spark",
    memoryRequirementGb: 66,
    tokensPerSec: 68,
    benchmarkRecoveryRate: 1.0,
    inferenceEngine: "vLLM",
    capabilityTier: "TIER_1_EXECUTION",
    semanticCapabilities: ["FAST_EXECUTION_MOE"],
    trustState: "APPROVED"
  },
  {
    id: "cuda-x-cudf-gpu-dataframe",
    modelFamily: "CUDA-X Data Science Engine",
    checkpoint: "cudf-columnar-engine-v24.12",
    precision: "EXACT_INTEGER",
    quantizationMethod: "Deterministic_V8",
    totalParameters: "N/A (Algorithmic)",
    activeParameters: "N/A",
    hardwareTarget: "L40S",
    memoryRequirementGb: 16,
    tokensPerSec: 10000,
    benchmarkRecoveryRate: 1.0,
    inferenceEngine: "TensorRT_LLM",
    capabilityTier: "TIER_2_DETERMINISTIC",
    semanticCapabilities: ["GPU_DATAFRAME", "COLUMNAR_ACCELERATION", "GPU_VECTOR_SEARCH"],
    trustState: "APPROVED"
  },
  {
    id: "local-v8-exact-kinematics",
    modelFamily: "Pathfinder Local Kinematic Substrate",
    checkpoint: "deterministic-kinematics-v2",
    precision: "EXACT_INTEGER",
    quantizationMethod: "Deterministic_V8",
    totalParameters: "N/A (Integer Arithmetic)",
    activeParameters: "N/A",
    hardwareTarget: "Local_CPU",
    memoryRequirementGb: 0.1,
    tokensPerSec: 50000,
    benchmarkRecoveryRate: 1.0,
    inferenceEngine: "Node_VM",
    capabilityTier: "TIER_2_DETERMINISTIC",
    semanticCapabilities: ["EXACT_KINEMATICS", "TAMPER_EVIDENT_HASHING"],
    trustState: "APPROVED"
  },
  {
    id: "gemini-3.7-flash-frontier",
    modelFamily: "Google Gemini 3.7 Flash Core",
    checkpoint: "gemini-3.7-flash-preview",
    precision: "BF16",
    quantizationMethod: "Native_BF16",
    totalParameters: "Frontier MoE",
    activeParameters: "Frontier",
    hardwareTarget: "H100_SXM5",
    memoryRequirementGb: 80,
    tokensPerSec: 110,
    benchmarkRecoveryRate: 1.0,
    inferenceEngine: "vLLM",
    capabilityTier: "TIER_3_FRONTIER_PLANNING",
    semanticCapabilities: ["FRONTIER_COGNITION"],
    trustState: "APPROVED"
  }
];

export class NeMoSwitchyardRouter {
  /**
   * Evaluates task complexity, required capabilities, and latency constraints
   * to dispatch to the optimal capability tier.
   */
  public static routeTask(request: SwitchyardRoutingRequest): SwitchyardRoutingDecision {
    const routingId = `swy-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    
    // 1. Determine Tier based on complexity and task type
    let targetTier: CapabilityTier = "TIER_1_EXECUTION";
    if (request.taskType === "kinematic_calculation" || request.taskType === "dataframe_sweep" || request.taskType === "pde_solve") {
      targetTier = "TIER_2_DETERMINISTIC";
    } else if (request.taskType === "counterfactual_planning" || request.complexityScore > 0.75) {
      targetTier = "TIER_3_FRONTIER_PLANNING";
    } else {
      targetTier = "TIER_1_EXECUTION";
    }

    // 2. Filter matching models
    const candidates = SWITCHYARD_MODEL_CATALOG.filter(m => 
      m.capabilityTier === targetTier && 
      m.trustState === "APPROVED" &&
      request.requiredCapabilities.every(cap => m.semanticCapabilities.includes(cap) || targetTier === "TIER_3_FRONTIER_PLANNING")
    );

    const chosenModel = candidates[0] || SWITCHYARD_MODEL_CATALOG.find(m => m.capabilityTier === targetTier) || SWITCHYARD_MODEL_CATALOG[0];

    // Compute estimated metrics
    const costReduction = targetTier === "TIER_1_EXECUTION" ? 74 : (targetTier === "TIER_2_DETERMINISTIC" ? 95 : 0);
    const estimatedLatencyMs = targetTier === "TIER_2_DETERMINISTIC" ? 4 : (targetTier === "TIER_1_EXECUTION" ? 18 : 120);

    const rationale = `Switchyard routed task '${request.taskType}' (Complexity: ${(request.complexityScore * 100).toFixed(0)}%) to ${chosenModel.modelFamily} (${chosenModel.precision}, ${chosenModel.activeParameters}) at ${chosenModel.hardwareTarget}. Expected latency: ${estimatedLatencyMs}ms. Cost saving: ${costReduction}%.`;

    return {
      routingId,
      selectedModel: chosenModel,
      capabilityTier: targetTier,
      semanticTarget: chosenModel.id,
      routingRationale: rationale,
      estimatedLatencyMs,
      costReductionPercentage: costReduction,
      authorityBoundaryNotice: "CAPABILITY ROUTING ONLY: Execution does NOT grant operational authority. Promotion to committed state requires Sovereign Operator gate.",
      timestamp: new Date().toISOString()
    };
  }
}
