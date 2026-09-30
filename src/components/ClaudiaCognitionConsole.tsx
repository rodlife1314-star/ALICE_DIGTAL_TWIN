import React, { useState } from "react";
import {
  Cpu,
  Zap,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Server,
  Activity,
  Sparkles,
  RefreshCw,
  ArrowRight,
  Lock,
  Database,
  Terminal,
  Sliders
} from "lucide-react";
import { DigitalTwin } from "../types";

interface ClaudiaCognitionConsoleProps {
  twin: DigitalTwin;
}

interface ClaudiaCognitionResult {
  agentName: string;
  contract: {
    agentName: string;
    role: string;
    epistemicQuestion: string;
    domainScope: string;
    targetTwin: string;
    domain: string;
    taskType: string;
    operatorIntention: string;
  };
  context: {
    registeredCapabilitiesCount: number;
    availableFabrics: Array<{ id: string; name: string; status: string; latencyMs: number }>;
    requiredCapabilities: string[];
    candidateConstraint: string;
  };
  modelInvocation: {
    modelUsed: string;
    status: string;
    message?: string;
    error?: string;
  };
  structuredResult: {
    selectedModelId: string;
    selectedModelName: string;
    executionTarget: string;
    routingRationale: string;
    latencyEstimateMs: number;
    trustScore: number;
    hardwareAllocation: string;
    epistemicVerdict: string;
    passedGovernanceCheck: boolean;
    requiresOperatorApproval: boolean;
    stopConditionsVerified: string[];
    timestamp: string;
  };
}

export function ClaudiaCognitionConsole({ twin }: ClaudiaCognitionConsoleProps) {
  const [operatorIntention, setOperatorIntention] = useState<string>(
    "Maintain thermoregulatory & structural equilibrium under fluctuating load"
  );
  const [taskType, setTaskType] = useState<string>("simulation_routing");
  const [candidateConstraint, setCandidateConstraint] = useState<string>(
    twin.constraints?.[0]?.necessaryCondition 
      ? twin.constraints[0].necessaryCondition
      : twin.boundary?.description || "Thermal & pressure boundary limits must remain within ±2.5%"
  );
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [cognitionResult, setCognitionResult] = useState<ClaudiaCognitionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [operatorApproved, setOperatorApproved] = useState<boolean>(false);

  const handleExecuteClaudiaCognition = async () => {
    setIsExecuting(true);
    setErrorMsg(null);
    setOperatorApproved(false);

    try {
      const response = await fetch("/api/agents/claudia/cognition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          twinName: twin.name,
          domain: twin.domain || "physical",
          purpose: twin.purpose || twin.description,
          operatorIntention,
          taskType,
          candidateConstraint,
          requiredCapabilities: ["physical_simulation", "fast_reasoning"]
        })
      });

      const data = await response.json();
      if (data.success) {
        setCognitionResult(data);
      } else {
        setErrorMsg(data.error || "Failed to execute Claudia Cognition contract.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error connecting to Claudia Cognition server.");
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="bg-[#13151A] border border-[#22262F] rounded-lg p-6 space-y-6 text-[#E6E4DF]">
      {/* Claudia Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#22262F] gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-[#3B82F6] uppercase tracking-wider">
                EPISTEMIC AGENT: CLAUDIA
              </span>
              <span className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 text-[9px] font-mono px-2 py-0.5 rounded font-bold">
                ROUTER ACTIVE
              </span>
            </div>
            <h3 className="text-base font-semibold text-[#E6E4DF]">
              Claudia Cognition & Hardware Routing Engine
            </h3>
          </div>
        </div>

        <div className="bg-[#181A20] px-3.5 py-2 rounded border border-[#22262F] font-mono text-xs text-right">
          <span className="text-[#8A8F9A] text-[10px] block">EPISTEMIC QUESTION OWNERSHIP:</span>
          <span className="text-[#EAB308] italic font-medium">
            "What model, runtime or hardware fabric resolves this constraint?"
          </span>
        </div>
      </div>

      {/* Contract Specification Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="space-y-1.5">
          <label className="text-[#8A8F9A] text-[10px] uppercase font-bold block flex items-center space-x-1">
            <Sliders className="w-3 h-3 text-[#3B82F6]" />
            <span>OPERATOR DIRECTIVE / INTENTION</span>
          </label>
          <input
            type="text"
            value={operatorIntention ?? ""}
            onChange={(e) => setOperatorIntention(e.target.value)}
            className="w-full bg-[#181A20] border border-[#2A2E39] text-[#E6E4DF] rounded px-3 py-2 focus:outline-none focus:border-[#3B82F6]"
            placeholder="Operator intention..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[#8A8F9A] text-[10px] uppercase font-bold block flex items-center space-x-1">
            <Activity className="w-3 h-3 text-[#EAB308]" />
            <span>TASK TYPE</span>
          </label>
          <select
            value={taskType ?? "simulation_routing"}
            onChange={(e) => setTaskType(e.target.value)}
            className="w-full bg-[#181A20] border border-[#2A2E39] text-[#E6E4DF] rounded px-3 py-2 focus:outline-none focus:border-[#3B82F6]"
          >
            <option value="simulation_routing">simulation_routing (Latency & Fast Reasoning)</option>
            <option value="constraint_discovery">constraint_discovery (Deep Structural Reasoning)</option>
            <option value="falsification_challenge">falsification_challenge (Counterfactual Testing)</option>
            <option value="capability_benchmark">capability_benchmark (Hardware Profiling)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[#8A8F9A] text-[10px] uppercase font-bold block flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-[#4ADE80]" />
            <span>CANDIDATE CONSTRAINT</span>
          </label>
          <input
            type="text"
            value={candidateConstraint ?? ""}
            onChange={(e) => setCandidateConstraint(e.target.value)}
            className="w-full bg-[#181A20] border border-[#2A2E39] text-[#E6E4DF] rounded px-3 py-2 focus:outline-none focus:border-[#3B82F6]"
            placeholder="Candidate constraint under evaluation..."
          />
        </div>
      </div>

      {/* Action Execution Button */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-mono text-[#8A8F9A]">
          Pipeline: Operator Input → Claudia Contract → Context → Model Invocation → Structured Result → Gate
        </span>

        <button
          onClick={handleExecuteClaudiaCognition}
          disabled={isExecuting}
          className="bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#22262F] text-[#FFFFFF] font-mono text-xs font-bold px-6 py-2.5 rounded flex items-center space-x-2 transition-colors cursor-pointer"
        >
          {isExecuting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Invoking Claudia Cognition Engine...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Execute Claudia Cognition Contract</span>
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] rounded text-xs font-mono flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Live Cognition Structured Output */}
      {cognitionResult && (
        <div className="bg-[#181A20] border border-[#3B82F6]/30 rounded-lg p-5 space-y-5 animate-fadeIn">
          {/* Status Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#22262F]">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-[#10B981]" />
              <span className="text-xs font-mono font-bold text-[#E6E4DF]">
                CLAUDIA COGNITION EVALUATION COMPLETE
              </span>
              <span className="bg-[#3B82F6]/10 text-[#3B82F6] text-[10px] font-mono px-2 py-0.5 rounded border border-[#3B82F6]/30">
                Model: {cognitionResult.modelInvocation.modelUsed}
              </span>
            </div>

            <div className="text-[10px] font-mono text-[#8A8F9A] flex items-center space-x-3">
              <span>Latency: <strong className="text-[#4ADE80]">{cognitionResult.structuredResult.latencyEstimateMs}ms</strong></span>
              <span>Trust Score: <strong className="text-[#3B82F6]">{cognitionResult.structuredResult.trustScore}%</strong></span>
            </div>
          </div>

          {/* Contract & Context Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-[#13151A] p-3.5 rounded border border-[#22262F] space-y-2">
              <span className="text-[10px] text-[#3B82F6] uppercase font-bold block flex items-center space-x-1">
                <Terminal className="w-3 h-3" />
                <span>1. CLAUDIA CONTRACT SPECIFICATION</span>
              </span>
              <div className="space-y-1 text-[#8A8F9A]">
                <div>Target Twin: <strong className="text-[#E6E4DF]">{cognitionResult.contract.targetTwin}</strong></div>
                <div>Domain Scope: <strong className="text-[#E6E4DF]">{cognitionResult.contract.domainScope}</strong></div>
                <div>Directive: <strong className="text-[#E6E4DF]">{cognitionResult.contract.operatorIntention}</strong></div>
              </div>
            </div>

            <div className="bg-[#13151A] p-3.5 rounded border border-[#22262F] space-y-2">
              <span className="text-[10px] text-[#EAB308] uppercase font-bold block flex items-center space-x-1">
                <Server className="w-3 h-3" />
                <span>2. COMPUTE FABRIC & CONTEXT</span>
              </span>
              <div className="space-y-1 text-[#8A8F9A]">
                <div>Capability Registry Count: <strong className="text-[#E6E4DF]">{cognitionResult.context.registeredCapabilitiesCount} Models</strong></div>
                <div>Available Fabrics: <strong className="text-[#E6E4DF]">{cognitionResult.context.availableFabrics.map(f => f.name).join(", ")}</strong></div>
                <div>Constraint evaluated: <strong className="text-[#E6E4DF]">{cognitionResult.context.candidateConstraint}</strong></div>
              </div>
            </div>
          </div>

          {/* Structured Routing Result */}
          <div className="bg-[#13151A] p-4 rounded border border-[#22262F] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#22262F] pb-2">
              <span className="text-[11px] text-[#4ADE80] font-bold uppercase flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5" />
                <span>3. STRUCTURED ROUTING DECISION & VERDICT</span>
              </span>
              <span className="text-[10px] text-[#8A8F9A]">
                Hardware: {cognitionResult.structuredResult.hardwareAllocation}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[#8A8F9A] text-[10px] block">SELECTED EXECUTION TARGET:</span>
                <p className="text-[#E6E4DF] font-bold text-sm">
                  {cognitionResult.structuredResult.selectedModelName}
                </p>
                <span className="text-[#3B82F6] text-[11px] block">
                  Target: {cognitionResult.structuredResult.executionTarget}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[#8A8F9A] text-[10px] block">EPISTEMIC VERDICT:</span>
                <p className="text-[#E6E4DF] text-[11px] leading-relaxed">
                  {cognitionResult.structuredResult.epistemicVerdict}
                </p>
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-[#22262F]">
              <span className="text-[#8A8F9A] text-[10px] block uppercase">ROUTING RATIONALE:</span>
              <p className="text-[#E6E4DF] text-xs leading-relaxed italic bg-[#181A20] p-3 rounded border border-[#22262F]">
                "{cognitionResult.structuredResult.routingRationale}"
              </p>
            </div>
          </div>

          {/* Governance Authority Gate */}
          <div className="bg-[#13151A] p-4 rounded border border-[#EAB308]/40 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-5 h-5 text-[#EAB308] shrink-0" />
              <div>
                <span className="text-[#EAB308] font-bold block uppercase text-[11px]">
                  GOVERNANCE GATE: OPERATOR AUTHORIZATION
                </span>
                <p className="text-[#8A8F9A] text-[11px]">
                  Claudia has proposed hardware target <strong className="text-[#E6E4DF]">{cognitionResult.structuredResult.executionTarget}</strong>. Claudia cannot commit compute without Operator sanction.
                </p>
              </div>
            </div>

            {operatorApproved ? (
              <div className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 px-4 py-2 rounded font-bold flex items-center space-x-1.5 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
                <span>ROUTING SANCTIONED BY OPERATOR</span>
              </div>
            ) : (
              <button
                onClick={() => setOperatorApproved(true)}
                className="bg-[#EAB308] hover:bg-[#CA8A04] text-[#13151A] font-bold px-5 py-2 rounded flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sanction Compute Target</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
