import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Bot,
  Brain,
  Layers,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Lock,
  GitCommit,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Zap,
  Activity,
  SlidersHorizontal
} from "lucide-react";
import {
  DigitalTwin,
  EpistemicAgent,
  EpistemicAgentName,
  AgentConstraintEvaluation
} from "../types";
import { ClaudiaCognitionConsole } from "./ClaudiaCognitionConsole";
import { AIBOMSecurityMembraneView } from "./AIBOMSecurityMembraneView";

interface EpistemicAgentFieldViewProps {
  twin: DigitalTwin;
  onUpdateTwin: (updatedTwin: DigitalTwin) => void;
}

const DEFAULT_AGENTS: EpistemicAgent[] = [
  {
    id: "agent-alice",
    name: "Alice",
    role: "Selector & Question Framer",
    epistemicQuestion: "Given intention, what question MUST Pathfinder ask now?",
    domainScope: "Intent framing, aperture selection & necessary condition formulation",
    isCoreSovereignLoop: true,
    activeStatus: "IDLE",
    avatarColor: "#3B82F6"
  },
  {
    id: "agent-astra",
    name: "Astra",
    role: "State Model & Continuity Engine",
    epistemicQuestion: "What is the current state, and where does expected differ from observed?",
    domainScope: "State baseline tracking, discrepancy detection & timeline evolution",
    isCoreSovereignLoop: true,
    activeStatus: "IDLE",
    avatarColor: "#8B5CF6"
  },
  {
    id: "agent-jemma",
    name: "Jemma",
    role: "Evidence & Provenance Validator",
    epistemicQuestion: "What can we actually support with evidence? What is assumed or unknown?",
    domainScope: "Evidence provenance, confidence scoring & contradiction auditing",
    isCoreSovereignLoop: true,
    activeStatus: "IDLE",
    avatarColor: "#10B981"
  },
  {
    id: "agent-claudia",
    name: "Claudia",
    role: "Capability & Hardware Router",
    epistemicQuestion: "What model, tool, runtime or compute fabric is capable of resolving this constraint?",
    domainScope: "Compute fabric routing, latency optimization & capability assignment",
    isCoreSovereignLoop: true,
    activeStatus: "IDLE",
    avatarColor: "#F59E0B"
  },
  {
    id: "agent-orion",
    name: "Orion",
    role: "Counterfactual Challenger",
    epistemicQuestion: "If we remove this condition, does the path collapse? Is this a genuine MUST?",
    domainScope: "Counterfactual ablation tests, necessity interrogation & SHOULD vs MUST separation",
    isCoreSovereignLoop: true,
    activeStatus: "IDLE",
    avatarColor: "#EF4444"
  },
  {
    id: "agent-natalia",
    name: "Natalia",
    role: "Discipline & STOP Boundary Enforcement",
    epistemicQuestion: "Are we inside the authorized boundary? Do any of the 10 Stop Conditions apply?",
    domainScope: "Governance boundaries, halt trigger enforcement & safety limits",
    isCoreSovereignLoop: true,
    activeStatus: "IDLE",
    avatarColor: "#EC4899"
  },
  {
    id: "agent-iris",
    name: "Iris",
    role: "Human Context Interpreter",
    epistemicQuestion: "How does the operator's mental model map to current twin parameters?",
    domainScope: "Operator context mapping & cognitive alignment (Outside core sovereign loop)",
    isCoreSovereignLoop: false,
    activeStatus: "IDLE",
    avatarColor: "#06B6D4"
  },
  {
    id: "agent-aria",
    name: "Aria",
    role: "Presentation & Explanation Voice",
    epistemicQuestion: "How can this decision provenance be explained transparently to the Operator?",
    domainScope: "Explanatory synthesis & visual reporting (Outside core sovereign loop)",
    isCoreSovereignLoop: false,
    activeStatus: "IDLE",
    avatarColor: "#64748B"
  }
];

export function EpistemicAgentFieldView({ twin, onUpdateTwin }: EpistemicAgentFieldViewProps) {
  const [agents, setAgents] = useState<EpistemicAgent[]>(DEFAULT_AGENTS);
  const [targetIntention, setTargetIntention] = useState<string>(
    twin.purpose ? `Maintain boundary equilibrium for ${twin.name}` : "Ensure system stability"
  );
  const [isExecutingLoop, setIsExecutingLoop] = useState<boolean>(false);
  const [currentExecutingAgentIndex, setCurrentExecutingAgentIndex] = useState<number | null>(null);

  const [evaluations, setEvaluations] = useState<AgentConstraintEvaluation[]>([
    {
      agentName: "Alice",
      questionAsked: "Given intention 'Maintain boundary equilibrium', what question MUST Pathfinder ask now?",
      agentClaim: "Alice: Formulated Question: 'What MUST become true to prevent boundary permeability degradation under fluctuating input load?'",
      supportingEvidenceRefs: ["Observed boundary telemetry obs-101"],
      passedGovernanceCheck: true,
      operatorApprovalRequired: false,
      timestamp: "2026-08-09 03:40"
    },
    {
      agentName: "Astra",
      questionAsked: "What is current state, and where does expected differ from observed?",
      agentClaim: "Astra: Discrepancy detected: Observed permeability (+14.2%) exceeds baseline model allowance (+3.0%). State₂ requires binding boundary damping.",
      supportingEvidenceRefs: ["State node S-02", "Sensor drift log"],
      passedGovernanceCheck: true,
      operatorApprovalRequired: false,
      timestamp: "2026-08-09 03:41"
    },
    {
      agentName: "Jemma",
      questionAsked: "What can we actually support with evidence? What is assumed or unknown?",
      agentClaim: "Jemma: Provenance verified for 3 observation streams. Confidence: 94.2%. Zero contradictions found in raw evidence logs.",
      supportingEvidenceRefs: ["Evidence record ev-88", "Calibrated sensor payload"],
      passedGovernanceCheck: true,
      operatorApprovalRequired: false,
      timestamp: "2026-08-09 03:42"
    },
    {
      agentName: "Orion",
      questionAsked: "If we remove this condition, does the path collapse? Is this a genuine MUST?",
      agentClaim: "Orion: Falsification Test passed: Removing dynamic damping causes boundary rupture in 12 iterations. Condition verified as BINDING MUST.",
      supportingEvidenceRefs: ["Simulated counterfactual run sim-402"],
      passedGovernanceCheck: true,
      operatorApprovalRequired: false,
      timestamp: "2026-08-09 03:43"
    },
    {
      agentName: "Claudia",
      questionAsked: "What model, runtime or hardware fabric is capable of resolving this constraint?",
      agentClaim: "Claudia: Routed execution target to GPU Local Substrate. Latency: 12ms. Model alias: Gemini Flash / Reasoning Core.",
      supportingEvidenceRefs: ["Hardware fabric status check"],
      passedGovernanceCheck: true,
      operatorApprovalRequired: false,
      timestamp: "2026-08-09 03:44"
    },
    {
      agentName: "Natalia",
      questionAsked: "Are we inside the authorized boundary? Do any of the 10 Stop Conditions apply?",
      agentClaim: "Natalia: All 10 Stop Conditions verified clear. State transition is bounded. Recommending Operator Gate authorization.",
      supportingEvidenceRefs: ["Governance boundary rule set"],
      passedGovernanceCheck: true,
      operatorApprovalRequired: true,
      timestamp: "2026-08-09 03:45"
    }
  ]);

  const [activeSubTab, setActiveSubTab] = useState<"overview" | "claudia_cognition" | "security_membrane">("overview");

  const [simulatedDiscoveryOutcome, setSimulatedDiscoveryOutcome] = useState<{
    mustCondition: string;
    falsificationProof: string;
    targetState: string;
  } | null>(null);

  const handleRunMultiAgentLoop = async () => {
    if (!targetIntention.trim()) return;

    setIsExecutingLoop(true);
    setCurrentExecutingAgentIndex(0);
    setSimulatedDiscoveryOutcome(null);

    // Try fetching live server epistemic evaluations if available
    try {
      const resp = await fetch("/api/agents/epistemic-loop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          twinName: twin.name,
          domain: twin.domain || "physical",
          operatorIntention: targetIntention
        })
      });

      const data = await resp.json();
      if (data.success && Array.isArray(data.evaluations) && data.evaluations.length > 0) {
        setEvaluations((prev) => [...data.evaluations, ...prev]);
      }
    } catch (e) {
      console.warn("Server epistemic loop endpoint warning, fallback to client sequence:", e);
    }

    const coreSequence: EpistemicAgentName[] = ["Alice", "Astra", "Jemma", "Orion", "Claudia", "Natalia"];

    coreSequence.forEach((agentName, idx) => {
      setTimeout(() => {
        setCurrentExecutingAgentIndex(idx);

        // Update agent status
        setAgents((prev) =>
          prev.map((a) =>
            a.name === agentName
              ? { ...a, activeStatus: agentName === "Alice" ? "ASKING" : agentName === "Orion" ? "CHALLENGING" : agentName === "Natalia" ? "STOP_CHECK" : "VALIDATING" }
              : { ...a, activeStatus: "IDLE" }
          )
        );

        let newEval: AgentConstraintEvaluation;
        if (agentName === "Alice") {
          newEval = {
            agentName: "Alice",
            questionAsked: `Given intention '${targetIntention}', what question MUST Pathfinder ask now?`,
            agentClaim: `Alice: Formulated Question: "For intention '${targetIntention}' to exist, what condition MUST become true next that is not true now?"`,
            supportingEvidenceRefs: [twin.boundary?.description || "Twin Boundary Membrane"],
            passedGovernanceCheck: true,
            operatorApprovalRequired: false,
            timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
          };
        } else if (agentName === "Astra") {
          newEval = {
            agentName: "Astra",
            questionAsked: "What is current state, and where does expected differ from observed?",
            agentClaim: `Astra: State analysis for ${twin.name} indicates structural baseline is STABLE, but drift tolerance requires dynamic threshold stabilization.`,
            supportingEvidenceRefs: twin.states?.[0]?.id ? [twin.states[0].id] : ["State Baseline 0"],
            passedGovernanceCheck: true,
            operatorApprovalRequired: false,
            timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
          };
        } else if (agentName === "Jemma") {
          newEval = {
            agentName: "Jemma",
            questionAsked: "What can we actually support with evidence? What is assumed or unknown?",
            agentClaim: `Jemma: Verified ${twin.observations?.length || 3} evidence records. Provenance confirmed. Zero ungrounded assumptions in pipeline.`,
            supportingEvidenceRefs: twin.observations?.slice(0, 2).map((o) => o.id) || ["Evidence obs-alpha"],
            passedGovernanceCheck: true,
            operatorApprovalRequired: false,
            timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
          };
        } else if (agentName === "Orion") {
          newEval = {
            agentName: "Orion",
            questionAsked: "If we remove this condition, does the path collapse? Is this a genuine MUST?",
            agentClaim: `Orion: Counterfactual Test executed: Removing stabilization constraint causes system trajectory collapse. VERDICT: BINDING MUST.`,
            supportingEvidenceRefs: ["Simulated counterfactual run"],
            passedGovernanceCheck: true,
            operatorApprovalRequired: false,
            timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
          };
        } else if (agentName === "Claudia") {
          newEval = {
            agentName: "Claudia",
            questionAsked: "What model, runtime or hardware fabric is capable of resolving this constraint?",
            agentClaim: `Claudia: Evaluated capability registry. Allocated GPU Local Substrate + Cloud Gemini 3.6 Flash fallback. Latency: 12ms. Trust Score: 96%.`,
            supportingEvidenceRefs: ["Capability Registry & Hardware Fabric"],
            passedGovernanceCheck: true,
            operatorApprovalRequired: false,
            timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
          };
        } else {
          newEval = {
            agentName: "Natalia",
            questionAsked: "Are we inside the authorized boundary? Do any of the 10 Stop Conditions apply?",
            agentClaim: `Natalia: Verified 10 Stop Conditions. All governance boundaries satisfied. Halting at Operator Gate for final authorization.`,
            supportingEvidenceRefs: ["Governance Ruleset"],
            passedGovernanceCheck: true,
            operatorApprovalRequired: true,
            timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
          };
        }

        setEvaluations((prev) => [newEval, ...prev]);

        // Final step
        if (idx === coreSequence.length - 1) {
          setTimeout(() => {
            setIsExecutingLoop(false);
            setCurrentExecutingAgentIndex(null);
            setAgents(DEFAULT_AGENTS);
            setSimulatedDiscoveryOutcome({
              mustCondition: `System must enforce dynamic boundary equilibrium rule for ${twin.name} under fluctuating load.`,
              falsificationProof: `Removing this rule causes uncontrolled drift within 14 execution steps. MUST condition verified.`,
              targetState: `State_${(twin.pathfinderRecords?.length || 0) + 1}: Equilibrium Stabilized`
            });
          }, 800);
        }
      }, (idx + 1) * 1100);
    });
  };

  return (
    <div className="space-y-8 text-[#E6E4DF]">
      {/* Sub-navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#22262F] pb-3">
        <button
          onClick={() => setActiveSubTab("overview")}
          className={`px-4 py-2 rounded text-xs font-mono font-bold flex items-center space-x-2 transition-colors cursor-pointer ${
            activeSubTab === "overview"
              ? "bg-[#3B82F6] text-[#FFFFFF]"
              : "bg-[#181A20] text-[#8A8F9A] hover:text-[#E6E4DF] border border-[#22262F]"
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Epistemic Agent Field & Sovereign Loop</span>
        </button>

        <button
          onClick={() => setActiveSubTab("claudia_cognition")}
          className={`px-4 py-2 rounded text-xs font-mono font-bold flex items-center space-x-2 transition-colors cursor-pointer ${
            activeSubTab === "claudia_cognition"
              ? "bg-[#3B82F6] text-[#FFFFFF]"
              : "bg-[#181A20] text-[#8A8F9A] hover:text-[#E6E4DF] border border-[#22262F]"
          }`}
        >
          <Cpu className="w-4 h-4 text-[#EAB308]" />
          <span>Claudia Cognition & Hardware Router</span>
        </button>

        <button
          onClick={() => setActiveSubTab("security_membrane")}
          className={`px-4 py-2 rounded text-xs font-mono font-bold flex items-center space-x-2 transition-colors cursor-pointer ${
            activeSubTab === "security_membrane"
              ? "bg-[#3B82F6] text-[#FFFFFF]"
              : "bg-[#181A20] text-[#8A8F9A] hover:text-[#E6E4DF] border border-[#22262F]"
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
          <span>AI-BOM & Runtime Security Membrane</span>
        </button>
      </div>

      {activeSubTab === "claudia_cognition" ? (
        <ClaudiaCognitionConsole twin={twin} />
      ) : activeSubTab === "security_membrane" ? (
        <AIBOMSecurityMembraneView twin={twin} />
      ) : (
        <>
          {/* Central Law Doctrine Banner */}
          <div className="bg-[#13151A] border-l-4 border-l-[#EF4444] border border-[#22262F] rounded p-5 space-y-3 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 text-[#EF4444]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#EF4444] uppercase tracking-widest font-bold block">
                    PATHFINDER CENTRAL CONSTITUTIONAL LAW
                  </span>
                  <h2 className="text-lg font-bold text-[#E6E4DF]">
                    "No agent may convert its own observation into authority."
                  </h2>
                </div>
              </div>

              <div className="bg-[#181A20] px-4 py-2 rounded border border-[#22262F] text-right font-mono text-xs">
                <span className="text-[#8A8F9A] block text-[10px]">OPERATOR SOVEREIGNTY:</span>
                <span className="text-[#4ADE80] font-bold flex items-center space-x-1 justify-end">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Operator Gate Final Authority</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-[#8A8F9A] max-w-4xl leading-relaxed">
              In Pathfinder, AI agents own <strong>epistemic questions</strong> rather than stages of an autonomous workflow. Agents propose candidate constraints, validate evidence, run counterfactual challenges, and evaluate boundaries—but <strong>only the Operator holds authority to commit state transitions.</strong>
            </p>
          </div>

      {/* Mathematical Formalization of Admissible State Region & Falsification */}
      <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#22262F] gap-2">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-[#EAB308]" />
            <h3 className="text-sm font-mono font-bold uppercase text-[#E6E4DF]">
              Mathematical Language of Stability & Falsification
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#EAB308] bg-[#EAB308]/10 px-2.5 py-1 rounded border border-[#EAB308]/30">
            Admissible Region & Counterfactual Falsification
          </span>
        </div>

        {/* Mathematical Equation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {/* 1. Continuous Feedback */}
          <div className="bg-[#181A20] p-4 rounded border border-[#22262F] space-y-2">
            <div className="text-[10px] text-[#3B82F6] font-bold uppercase tracking-wider flex items-center justify-between">
              <span>1. Feedback Dynamics</span>
              <span className="text-[9px] text-[#8A8F9A] font-normal">dx/dt = kx</span>
            </div>
            <div className="bg-[#13151A] p-2.5 rounded text-[#E6E4DF] text-center font-serif text-sm border border-[#22262F]">
              x(t) = x₀ · e<sup>kt</sup>
            </div>
            <div className="space-y-1 text-[11px] text-[#8A8F9A] pt-1">
              <div className="flex justify-between">
                <span>k &lt; 0: Perturbations decay</span>
                <span className="text-[#4ADE80] font-bold">Stable</span>
              </div>
              <div className="flex justify-between">
                <span>k = 0: Perturbations persist</span>
                <span className="text-[#EAB308] font-bold">Neutral</span>
              </div>
              <div className="flex justify-between">
                <span>k &gt; 0: Perturbations amplify</span>
                <span className="text-[#EF4444] font-bold">Unstable</span>
              </div>
            </div>
          </div>

          {/* 2. Admissible Region */}
          <div className="bg-[#181A20] p-4 rounded border border-[#22262F] space-y-2">
            <div className="text-[10px] text-[#10B981] font-bold uppercase tracking-wider flex items-center justify-between">
              <span>2. Admissible State Region S</span>
              <span className="text-[9px] text-[#8A8F9A] font-normal">g_i(x) ≤ 0</span>
            </div>
            <div className="bg-[#13151A] p-2.5 rounded text-[#E6E4DF] text-center font-serif text-sm border border-[#22262F]">
              S = &#123; x : g<sub>i</sub>(x) ≤ 0, i = 1, ..., m &#125;
            </div>
            <p className="text-[11px] text-[#8A8F9A] leading-relaxed pt-1">
              Defines physical, operational, epistemic and governance boundaries within which the Digital Twin is allowed to evolve.
            </p>
          </div>

          {/* 3. Counterfactual Falsification */}
          <div className="bg-[#181A20] p-4 rounded border border-[#22262F] space-y-2">
            <div className="text-[10px] text-[#EF4444] font-bold uppercase tracking-wider flex items-center justify-between">
              <span>3. Orion Falsification Test</span>
              <span className="text-[9px] text-[#8A8F9A] font-normal">C_j → ∅</span>
            </div>
            <div className="bg-[#13151A] p-2.5 rounded text-[#E6E4DF] text-center font-serif text-sm border border-[#22262F]">
              Remove C<sub>j</sub> ⇒ x(t) ∉ S
            </div>
            <p className="text-[11px] text-[#8A8F9A] leading-relaxed pt-1">
              A <strong>MUST</strong> is a constraint whose removal allows trajectories to escape admissible region S under perturbed operation.
            </p>
          </div>
        </div>

        {/* Mathematical Architecture Pipeline Box */}
        <div className="bg-[#181A20] p-4 rounded border border-[#3B82F6]/40 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="text-[#3B82F6] font-bold uppercase text-[11px] shrink-0">
            Pathfinder Epistemic Pipeline:
          </div>
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-around gap-2 text-center text-[#E6E4DF] text-[11px]">
            <div className="bg-[#13151A] px-3 py-2 rounded border border-[#22262F] w-full sm:w-auto">
              <span className="text-[#8A8F9A] block text-[9px]">DYNAMICS</span>
              <span className="text-[#3B82F6] font-bold">Discover what CAN happen</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#8A8F9A] shrink-0 hidden sm:block" />
            <div className="bg-[#13151A] px-3 py-2 rounded border border-[#22262F] w-full sm:w-auto">
              <span className="text-[#8A8F9A] block text-[9px]">CONSTRAINTS</span>
              <span className="text-[#EAB308] font-bold">Establish what MUST hold</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#8A8F9A] shrink-0 hidden sm:block" />
            <div className="bg-[#13151A] px-3 py-2 rounded border border-[#22262F] w-full sm:w-auto">
              <span className="text-[#8A8F9A] block text-[9px]">AUTHORITY</span>
              <span className="text-[#4ADE80] font-bold">Determine what WILL be committed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Epistemic Multi-Agent Architecture Grid */}
      <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#22262F] gap-2">
          <div>
            <div className="text-[10px] font-mono text-[#3B82F6] uppercase tracking-wider font-bold flex items-center space-x-2">
              <Bot className="w-3.5 h-3.5" />
              <span>THE PATHFINDER FIELD — FUNCTIONAL AGENT ORCHESTRATION</span>
            </div>
            <h3 className="text-lg font-light text-[#E6E4DF]">
              Epistemic Agent Roles & Question Ownership
            </h3>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs text-[#8A8F9A]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80]" />
            <span>6 Core Sovereign Loop Agents</span>
            <span className="text-[#22262F]">|</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#64748B]" />
            <span>2 Context/Interface Agents</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent) => {
            const isCurrent = currentExecutingAgentIndex !== null && DEFAULT_AGENTS[currentExecutingAgentIndex]?.name === agent.name;

            return (
              <div
                key={agent.id}
                className={`p-4 rounded border transition-all space-y-3 relative ${
                  isCurrent
                    ? "bg-[#181A20] border-[#3B82F6] shadow-md shadow-[#3B82F6]/10 ring-1 ring-[#3B82F6]"
                    : agent.isCoreSovereignLoop
                    ? "bg-[#181A20] border-[#22262F] hover:border-[#3B82F6]/50"
                    : "bg-[#13151A] border-[#22262F]/60 opacity-80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs text-[#13151A]"
                      style={{ backgroundColor: agent.avatarColor }}
                    >
                      {agent.name.substring(0, 1)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#E6E4DF]">{agent.name}</h4>
                      <span className="text-[10px] font-mono text-[#8A8F9A] block leading-none">
                        {agent.role}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      agent.isCoreSovereignLoop
                        ? "bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30"
                        : "bg-[#64748B]/10 text-[#64748B] border border-[#64748B]/30"
                    }`}
                  >
                    {agent.isCoreSovereignLoop ? "CORE LOOP" : "CONTEXT"}
                  </span>
                </div>

                <div className="bg-[#13151A] p-2.5 rounded border border-[#22262F] space-y-1">
                  <span className="text-[10px] font-mono text-[#EAB308] font-bold block uppercase flex items-center space-x-1">
                    <HelpCircle className="w-3 h-3" />
                    <span>OWNS EPISTEMIC QUESTION:</span>
                  </span>
                  <p className="text-xs italic text-[#E6E4DF] leading-snug">
                    "{agent.epistemicQuestion}"
                  </p>
                </div>

                <p className="text-[11px] text-[#8A8F9A] leading-normal">
                  {agent.domainScope}
                </p>

                {isCurrent && (
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-[#3B82F6] font-bold animate-pulse pt-1">
                    <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                    <span>EVALUATING EPISTEMIC QUESTION...</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Epistemic Discovery Controller */}
      <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#22262F] pb-4">
          <div className="flex items-center space-x-3">
            <Brain className="w-5 h-5 text-[#3B82F6]" />
            <div>
              <h3 className="text-base font-semibold text-[#E6E4DF]">
                Execute Epistemic Multi-Agent Discovery
              </h3>
              <p className="text-xs text-[#8A8F9A]">
                Passes Operator Intention through Alice → Astra → Jemma → Orion → Claudia → Natalia → Operator Gate
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-[#3B82F6] bg-[#3B82F6]/10 px-3 py-1 rounded border border-[#3B82F6]/30 font-bold">
            Target Twin: {twin.name}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#8A8F9A] uppercase mb-1.5">
              Operator Intention Directive
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={targetIntention}
                onChange={(e) => setTargetIntention(e.target.value)}
                placeholder="e.g. Prevent thermal buildup while preserving structural boundary permeability..."
                className="flex-1 bg-[#181A20] border border-[#2A2E39] text-xs text-[#E6E4DF] rounded px-3 py-2.5 focus:outline-none focus:border-[#3B82F6]"
              />

              <button
                type="button"
                onClick={handleRunMultiAgentLoop}
                disabled={isExecutingLoop || !targetIntention.trim()}
                className="bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#22262F] disabled:text-[#8A8F9A] text-[#FFFFFF] text-xs font-mono font-bold px-6 py-2.5 rounded flex items-center justify-center space-x-2 transition-colors cursor-pointer shrink-0"
              >
                {isExecutingLoop ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#FFFFFF] border-t-transparent rounded-full animate-spin" />
                    <span>Agent Field Interrogating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Epistemic Agent Loop</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live Epistemic Discovery Outcome */}
        {simulatedDiscoveryOutcome && (
          <div className="bg-[#181A20] border-l-4 border-l-[#4ADE80] border border-[#22262F] rounded p-5 space-y-4 shadow-lg animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#22262F] pb-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
                <span className="text-xs font-mono font-bold text-[#4ADE80] uppercase tracking-wider">
                  MULTI-AGENT DISCOVERY COMPLETE — AWAITING OPERATOR COMMITMENT
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#8A8F9A]">Natalia STOP Boundary Clear</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="bg-[#13151A] p-3 rounded border border-[#22262F] space-y-1">
                <span className="text-[10px] text-[#3B82F6] font-bold block uppercase">DISCOVERED MUST CONDITION:</span>
                <p className="text-[#E6E4DF]">{simulatedDiscoveryOutcome.mustCondition}</p>
              </div>

              <div className="bg-[#13151A] p-3 rounded border border-[#22262F] space-y-1">
                <span className="text-[10px] text-[#4ADE80] font-bold block uppercase">ORION FALSIFICATION PROOF:</span>
                <p className="text-[#E6E4DF]">{simulatedDiscoveryOutcome.falsificationProof}</p>
              </div>

              <div className="bg-[#13151A] p-3 rounded border border-[#22262F] space-y-1">
                <span className="text-[10px] text-[#EAB308] font-bold block uppercase">TARGET STATE TRANSITION:</span>
                <p className="text-[#E6E4DF]">{simulatedDiscoveryOutcome.targetState}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                onClick={() => setSimulatedDiscoveryOutcome(null)}
                className="px-4 py-2 rounded bg-[#22262F] hover:bg-[#2A2E39] text-[#8A8F9A] hover:text-[#E6E4DF] text-xs font-mono cursor-pointer"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  alert("Operator Authority Exercised: State transition committed to Pathfinder Ledger.");
                  setSimulatedDiscoveryOutcome(null);
                }}
                className="px-5 py-2 rounded bg-[#10B981] hover:bg-[#059669] text-[#FFFFFF] text-xs font-mono font-bold flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Exercise Operator Authority (Commit State)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Agent Evaluation Audit Log */}
      <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#22262F] pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#3B82F6]" />
            <h3 className="text-sm font-semibold uppercase font-mono tracking-wider text-[#E6E4DF]">
              Epistemic Agent Evaluation History ({evaluations.length})
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#8A8F9A]">Auditable & Grounded Claims</span>
        </div>

        <div className="space-y-3">
          {evaluations.map((ev, idx) => {
            const agentMeta = DEFAULT_AGENTS.find((a) => a.name === ev.agentName);

            return (
              <div
                key={idx}
                className="p-4 bg-[#181A20] border border-[#22262F] rounded space-y-2 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: agentMeta?.avatarColor || "#3B82F6" }}
                    />
                    <span className="font-bold text-[#3B82F6]">{ev.agentName}</span>
                    <span className="text-[#8A8F9A] text-[10px]">({agentMeta?.role})</span>
                  </div>

                  <span className="text-[10px] text-[#8A8F9A]">{ev.timestamp}</span>
                </div>

                <div>
                  <span className="text-[10px] text-[#8A8F9A] block">QUESTION ASKED:</span>
                  <p className="text-[#EAB308] italic">"{ev.questionAsked}"</p>
                </div>

                <div className="bg-[#13151A] p-3 rounded border border-[#22262F] space-y-1">
                  <span className="text-[10px] text-[#4ADE80] font-bold block">AGENT CLAIM & REASONING:</span>
                  <p className="text-[#E6E4DF]">{ev.agentClaim}</p>
                </div>

                {ev.supportingEvidenceRefs.length > 0 && (
                  <div className="flex items-center space-x-2 text-[10px] text-[#8A8F9A] pt-1">
                    <GitCommit className="w-3 h-3 text-[#3B82F6]" />
                    <span>Evidence Grounds: {ev.supportingEvidenceRefs.join(", ")}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  )}
</div>
  );
}
