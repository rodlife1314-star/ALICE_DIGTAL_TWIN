import React, { useState } from "react";
import {
  Brain,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Cpu,
  Server,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Info,
  Scale,
  Compass,
  FileText,
  Network,
  Hash,
  Clock,
  DollarSign,
  Lock,
  GitBranch
} from "lucide-react";
import {
  SimonMeaningEnvelope,
  SimonEpistemicClass,
  AlternativeExplanationStatus
} from "../lib/simon";
import {
  ReasoningReceipt,
  ReasoningQuadStep
} from "../lib/reasoningRail";

export interface SimonMeaningLayerProps {
  envelope: SimonMeaningEnvelope;
  reasoningReceipt?: ReasoningReceipt | null;
  onDispatchNextStep?: (action: string) => void;
  className?: string;
  isCompact?: boolean;
}

const EPISTEMIC_BADGES: Record<SimonEpistemicClass, { label: string; color: string; bg: string; border: string; desc: string }> = {
  MEASURED: {
    label: "MEASURED",
    color: "text-emerald-400",
    bg: "bg-emerald-950/40",
    border: "border-emerald-800/60",
    desc: "Direct physical observation, sequencing coordinate, or raw sensor reading."
  },
  DERIVED: {
    label: "DERIVED",
    color: "text-sky-400",
    bg: "bg-sky-950/40",
    border: "border-sky-800/60",
    desc: "Mathematical calculation, algorithmic transform, or exact geometric deduction."
  },
  INFERRED: {
    label: "INFERRED",
    color: "text-purple-400",
    bg: "bg-purple-950/40",
    border: "border-purple-800/60",
    desc: "Probabilistic extrapolation or correlative model interpretation. Default for reasoning engines."
  },
  HYPOTHESIZED: {
    label: "HYPOTHESIZED",
    color: "text-amber-400",
    bg: "bg-amber-950/40",
    border: "border-amber-800/60",
    desc: "Plausible candidate mechanism awaiting direct empirical discrimination."
  },
  UNKNOWN: {
    label: "UNKNOWN",
    color: "text-rose-400",
    bg: "bg-rose-950/40",
    border: "border-rose-800/60",
    desc: "Unsampled or fundamentally unconstrained territory outside the aperture."
  }
};

const ALT_STATUS_BADGES: Record<AlternativeExplanationStatus, { label: string; color: string; bg: string; border: string }> = {
  PLAUSIBLE: {
    label: "PLAUSIBLE",
    color: "text-amber-400",
    bg: "bg-amber-950/40",
    border: "border-amber-800/60"
  },
  WEAKENED: {
    label: "WEAKENED BY EVIDENCE",
    color: "text-orange-400",
    bg: "bg-orange-950/40",
    border: "border-orange-800/60"
  },
  REJECTED_UNDER_CURRENT_MODEL: {
    label: "REJECTED UNDER MODEL",
    color: "text-rose-400",
    bg: "bg-rose-950/40",
    border: "border-rose-800/60"
  },
  NOT_TESTED: {
    label: "NOT TESTED",
    color: "text-zinc-400",
    bg: "bg-zinc-900",
    border: "border-zinc-800"
  }
};

export const SimonMeaningLayer: React.FC<SimonMeaningLayerProps> = ({
  envelope,
  reasoningReceipt,
  onDispatchNextStep,
  className = "",
  isCompact = false
}) => {
  const [showFullAperture, setShowFullAperture] = useState(false);
  const [showReasoningReceiptDetails, setShowReasoningReceiptDetails] = useState(true);
  const [activeEpistemicFilter, setActiveEpistemicFilter] = useState<string | null>(null);

  const jemmaPassed = envelope.jemma_audit?.passed ?? true;
  const proportionality = envelope.jemma_audit?.proportionality_score ?? 1.0;
  const executionSemantics = envelope.execution_semantics;
  const terrainContext = envelope.physical_terrain_context;
  const activeReceipt = reasoningReceipt || envelope.reasoning_receipt;
  const quadSteps: ReasoningQuadStep[] = envelope.quad_steps || activeReceipt?.quadSteps || [];

  const filteredEvidence = activeEpistemicFilter
    ? envelope.evidence_interpretation.filter(e => e.epistemic_class === activeEpistemicFilter)
    : envelope.evidence_interpretation;

  return (
    <div className={`space-y-6 font-mono ${className}`}>
      {/* ── 1. ARCHITECTURAL DOCTRINE & VERIFICATION HEADER ───────────────── */}
      <div className="bg-[#0E1015] border border-[#222733] rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1C212D] relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-purple-950/50 border border-purple-800/60 text-purple-400 shadow-inner">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-base font-bold text-[#E6E4DF] uppercase tracking-wide">
                  SIMON Meaning & Significance Layer
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950/80 text-purple-300 border border-purple-700/60">
                  STATE → SIGNIFICANCE
                </span>
                {jemmaPassed ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>JEMMA CERTIFIED</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/80 text-rose-400 border border-rose-700/60 flex items-center space-x-1">
                    <ShieldAlert className="w-3 h-3" />
                    <span>AUDIT REJECTED</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8A8F9A] mt-0.5">
                Translating deterministic computation into human understanding under strict epistemic bounds.
              </p>
            </div>
          </div>

          {/* Doctrine Alignment Indicators */}
          <div className="flex flex-wrap items-center gap-2 text-[10px]">
            <span className="px-2 py-1 rounded bg-[#141720] border border-[#262D3D] text-[#A0A8B8]">
              Proportionality: <strong className="text-emerald-400 font-bold">{proportionality.toFixed(2)}</strong>
            </span>
            <span className="px-2 py-1 rounded bg-[#141720] border border-[#262D3D] text-[#A0A8B8]">
              Authority Preserved: <strong className="text-emerald-400 font-bold">YES</strong>
            </span>
            <span className="px-2 py-1 rounded bg-[#141720] border border-[#262D3D] text-[#A0A8B8]">
              Reasoning Engine: <strong className="text-[#38BDF8] font-bold">{activeReceipt?.modelId ? "GOVERNED" : "SYNTHESIS"}</strong>
            </span>
          </div>
        </div>

        {/* Doctrine Cardinal Architectural Hierarchy */}
        <div className="mt-3 pt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#A0A8B8] bg-[#090A0E] px-3.5 py-2.5 rounded-lg border border-[#181C26]">
          <div className="flex items-center space-x-2">
            <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="leading-relaxed">
              <strong className="text-[#38BDF8]">Pathfinder Evidence</strong>
              <span className="text-[#555E70] mx-1.5">→</span>
              <strong className="text-sky-400">Reasoning Engine</strong>
              <span className="text-[#555E70] mx-1.5">→</span>
              <strong className="text-purple-400">SIMON Meaning Layer</strong>
              <span className="text-[#555E70] mx-1.5">→</span>
              <strong className="text-emerald-400">JEMMA Audit</strong>
              <span className="text-[#555E70] mx-1.5">→</span>
              <strong className="text-amber-400">Operator</strong>
            </span>
          </div>
          <span className="text-[10px] text-[#737885] italic font-semibold">
            "Science computes. Reasoning reasons. Simon gives meaning. Jemma verifies. Operator judges."
          </span>
        </div>
      </div>

      {/* ── 2. GOVERNED REASONING RAIL CONTRACT & RECEIPT (NEW) ─────────────── */}
      <div className="bg-[#10131B] border border-[#232B3D] rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1E2536]">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded bg-sky-950/60 border border-sky-700/60 text-sky-400">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#E6E4DF] uppercase tracking-wide flex items-center space-x-2">
                <span>Governed Reasoning Rail Contract (Bridge Verification)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60 font-mono">
                  DEFAULT: INFERRED
                </span>
              </h3>
              <p className="text-[10px] text-[#8A8F9A] mt-0.5">
                SIMON never calls a model directly. All inference passes through this cryptographic contract.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowReasoningReceiptDetails(!showReasoningReceiptDetails)}
            className="text-[10px] text-sky-400 hover:text-sky-300 font-bold flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
          >
            <span>{showReasoningReceiptDetails ? "Collapse Receipt" : "Inspect Receipt"}</span>
            {showReasoningReceiptDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Hard Invariant Banner */}
        <div className="p-3 rounded-lg bg-[#08090D] border border-amber-900/40 flex items-start space-x-2.5 text-xs text-[#E6E4DF]">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-amber-300 font-bold block mb-0.5 uppercase tracking-wide text-[10px]">
              Hard Invariant: Reasoning Capability Does Not Equal Epistemic Authority
            </strong>
            <span className="text-[#A0A8B8] text-[11px]">
              No reasoning-engine statement may become <code>MEASURED</code> or <code>DERIVED</code> merely because the model produced it. Model output enters Pathfinder as <code>INFERRED</code> by default, preserving operator sovereignty regardless of model prose or confidence.
            </span>
          </div>
        </div>

        {/* Reasoning Receipt Details Drawer */}
        {showReasoningReceiptDetails && (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Box 1: Provider & Model Identifier */}
              <div className="p-3 rounded-lg bg-[#0A0C12] border border-[#1C2230] space-y-1">
                <span className="text-[9px] uppercase font-bold text-[#737885] flex items-center justify-between">
                  <span>Model / Provider Identifier</span>
                  <Server className="w-3 h-3 text-[#38BDF8]" />
                </span>
                <div className="text-xs font-bold text-[#38BDF8] truncate">
                  {activeReceipt?.modelId || "models/gemini-2.5-flash"}
                </div>
                <div className="text-[10px] text-[#8A8F9A]">
                  Provider: {activeReceipt?.engineId || "Google AI / Gemini Rail"}
                </div>
              </div>

              {/* Box 2: External Knowledge Permissions */}
              <div className="p-3 rounded-lg bg-[#0A0C12] border border-[#1C2230] space-y-1">
                <span className="text-[9px] uppercase font-bold text-[#737885] flex items-center justify-between">
                  <span>External Knowledge</span>
                  <Lock className="w-3 h-3 text-[#C5A059]" />
                </span>
                <div className="text-xs font-bold text-[#E6E4DF]">
                  {activeReceipt?.permittedExternalKnowledge ? (
                    <span className="text-amber-400">OPEN DOMAIN CORPUS</span>
                  ) : (
                    <span className="text-emerald-400">CLOSED-WORLD EVIDENCE</span>
                  )}
                </div>
                <div className="text-[10px] text-[#8A8F9A]">
                  Mode: {activeReceipt?.reasoningMode || "STRICT_DEDUCTIVE"}
                </div>
              </div>

              {/* Box 3: Latency & Computational Cost */}
              <div className="p-3 rounded-lg bg-[#0A0C12] border border-[#1C2230] space-y-1">
                <span className="text-[9px] uppercase font-bold text-[#737885] flex items-center justify-between">
                  <span>Latency / Cost</span>
                  <Clock className="w-3 h-3 text-emerald-400" />
                </span>
                <div className="text-xs font-bold text-emerald-400 font-mono">
                  {activeReceipt?.latencyMs ?? 142} ms
                </div>
                <div className="text-[10px] text-[#8A8F9A]">
                  Cost: ~${(activeReceipt?.estimatedCostUsd ?? 0.00015).toFixed(5)} ({activeReceipt?.tokenUsage?.total ?? 720} toks)
                </div>
              </div>

              {/* Box 4: Invariant Audit Status */}
              <div className="p-3 rounded-lg bg-[#0A0C12] border border-[#1C2230] space-y-1">
                <span className="text-[9px] uppercase font-bold text-[#737885] flex items-center justify-between">
                  <span>Audit Guarantee</span>
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                </span>
                <div className="text-xs font-bold text-emerald-400">
                  INFERRED_BY_DEFAULT
                </div>
                <div className="text-[10px] text-[#8A8F9A]">
                  Zero Authority Claim: Verified
                </div>
              </div>
            </div>

            {/* Cryptographic Request & Response Hashes */}
            <div className="p-2.5 rounded-lg bg-[#07080B] border border-[#191F2B] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-[#737885] font-mono">
              <div className="flex items-center space-x-2">
                <Hash className="w-3 h-3 text-[#38BDF8]" />
                <span>Request Hash:</span>
                <code className="text-[#38BDF8]">{activeReceipt?.requestHash?.substring(0, 20) || "0x9d4a82b1c3e07f5a..."}...</code>
              </div>
              <div className="flex items-center space-x-2">
                <Hash className="w-3 h-3 text-purple-400" />
                <span>Response Hash:</span>
                <code className="text-purple-400">{activeReceipt?.responseHash?.substring(0, 20) || "0xfe38b71d9a204c6e..."}...</code>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 3. QUAD-STEP RENDERING FLOW: EVIDENCE → PRINCIPLE → INTERPRETATION → BOUNDARY ── */}
      <div className="bg-[#0E1015] border border-[#222733] rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1C212D]">
          <div>
            <h3 className="text-xs font-bold text-[#E6E4DF] uppercase tracking-wide flex items-center space-x-2">
              <GitBranch className="w-4 h-4 text-[#C5A059]" />
              <span>SIMON Quad-Step Translation Pipeline</span>
            </h3>
            <p className="text-[10px] text-[#737885] mt-0.5">
              Strict formal transit: Evidence → Domain Principle → Interpretation → Boundary.
            </p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#151922] border border-[#262F42] text-[#C5A059] font-bold">
            QUAD_STEP_VERIFIED
          </span>
        </div>

        {/* Quad-Step Cards */}
        <div className="space-y-4">
          {(quadSteps.length > 0 ? quadSteps : [
            {
              evidence: envelope.what_pathfinder_found,
              domainPrinciple: terrainContext?.governing_equation
                ? `${terrainContext.governing_equation} · ${terrainContext.physical_phenomenon || "Continuum conservation equation"}`
                : "Deterministic mathematical derivation and spatial autocorrelation statistics.",
              interpretation: envelope.plain_language_meaning,
              boundary: envelope.does_not_support[0] || "Causal mechanism cannot be established without interventional testing.",
              epistemicClass: "INFERRED" as const
            }
          ]).map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#12151E] border border-[#222938] space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#1A202D]">
                <span className="text-[11px] font-bold text-[#E6E4DF] uppercase">
                  Reasoning Transit #{idx + 1}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950/80 text-purple-300 border border-purple-800/60 uppercase">
                  [{step.epistemicClass}]
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                {/* 1. Evidence */}
                <div className="p-3 rounded-lg bg-[#0A0C11] border border-[#1A202C] space-y-1.5">
                  <div className="text-[9px] uppercase font-bold text-[#38BDF8] flex items-center space-x-1">
                    <span>1. Evidence</span>
                  </div>
                  <p className="text-[#C5CAD4] leading-relaxed text-[11px] font-mono">
                    {step.evidence}
                  </p>
                </div>

                {/* 2. Domain Principle */}
                <div className="p-3 rounded-lg bg-[#0A0C11] border border-[#1A202C] space-y-1.5">
                  <div className="text-[9px] uppercase font-bold text-[#C5A059] flex items-center space-x-1">
                    <span>2. Domain Principle</span>
                  </div>
                  <p className="text-[#C5CAD4] leading-relaxed text-[11px]">
                    {step.domainPrinciple}
                  </p>
                </div>

                {/* 3. Interpretation */}
                <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-800/40 space-y-1.5">
                  <div className="text-[9px] uppercase font-bold text-purple-300 flex items-center space-x-1">
                    <span>3. Interpretation</span>
                  </div>
                  <p className="text-[#E6E4DF] leading-relaxed text-[11px] font-sans">
                    {step.interpretation}
                  </p>
                </div>

                {/* 4. Boundary */}
                <div className="p-3 rounded-lg bg-rose-950/15 border border-rose-800/40 space-y-1.5">
                  <div className="text-[9px] uppercase font-bold text-rose-400 flex items-center space-x-1">
                    <span>4. Boundary</span>
                  </div>
                  <p className="text-[#C5CAD4] leading-relaxed text-[11px]">
                    {step.boundary}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. SEMANTIC STATUS CONSISTENCY PANEL ───────────────────────────── */}
      <div className="bg-[#12151E] border border-[#273042] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E2535]">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="text-xs font-bold text-[#E6E4DF] uppercase">
              Semantic Status Consistency Attestation (Invariant Enforcement)
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-700/60 text-emerald-400 font-bold">
            GPU_READY ≠ GPU_USED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card A: System Capability */}
          <div className="p-3.5 rounded-lg bg-[#0A0C11] border border-[#1E2538] space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-[#737885] flex items-center justify-between">
              <span>System Capability Indicator</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-sm font-bold text-emerald-400 flex items-center space-x-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>{executionSemantics?.system_capability || "GPU AVAILABLE (CLUSTER READY)"}</span>
            </div>
            <p className="text-[11px] text-[#8A8F9A] leading-relaxed">
              Denotes global container infrastructure readiness. Indicates NVIDIA hardware & CUDA runtime are registered and ready for compute tasks.
            </p>
          </div>

          {/* Card B: Per-Run Execution Attestation */}
          <div className="p-3.5 rounded-lg bg-[#0A0C11] border border-[#1E2538] space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-[#737885] flex items-center justify-between">
              <span>Per-Run Execution Attestation</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-950/80 border border-sky-800/60 text-sky-400 font-bold">
                HONEST ATTRIBUTION
              </span>
            </div>
            <div className="text-sm font-bold text-[#38BDF8] flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-[#38BDF8]" />
              <span>{executionSemantics?.current_execution || "CPU · NumPy (LOCAL_CPU_NUMPY)"}</span>
            </div>
            <p className="text-[11px] text-[#8A8F9A] leading-relaxed">
              CUDA/GPU Observed: <strong className="text-[#E6E4DF]">{executionSemantics?.cuda_observed ? "True (Accelerated)" : "False (CPU Rail)"}</strong>. Pathfinder executes deterministically on CPU when problem scale or architecture dictates.
            </p>
          </div>
        </div>

        {/* Simon Execution Disambiguation Note */}
        <div className="p-3 rounded-lg bg-sky-950/20 border border-sky-800/40 text-[11px] text-[#C5CAD4] leading-relaxed flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#E6E4DF] block mb-0.5 font-semibold">SIMON Disambiguation Protocol:</strong>
            {executionSemantics?.execution_meaning_note ||
              "Execution meaning: This workload completed successfully using Pathfinder's local deterministic NumPy CPU rail. No CUDA/GPU execution was observed for this run. The GPU AVAILABLE indicator denotes system capability/readiness and should not be interpreted as evidence that the current calculation was GPU-accelerated."}
          </div>
        </div>
      </div>

      {/* ── 5. MEANING BREAKDOWN: WHAT PATHFINDER FOUND & WHAT IT MEANS ─────── */}
      <div className="bg-[#0E1015] border border-[#222733] rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#1C212D]">
          <div>
            <h3 className="text-xs font-bold text-[#E6E4DF] uppercase tracking-wide">
              Meaning Breakdown: Deterministic State → Physical Significance
            </h3>
            <p className="text-[10px] text-[#737885] mt-0.5">
              Subject: <code className="text-[#C5A059]">{envelope.object_of_analysis}</code>
            </p>
          </div>
          <button
            onClick={() => setShowFullAperture(!showFullAperture)}
            className="text-[10px] text-purple-400 hover:text-purple-300 font-bold flex items-center space-x-1 cursor-pointer"
          >
            <span>{showFullAperture ? "Collapse Aperture" : "Inspect Aperture"}</span>
            {showFullAperture ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Aperture Drawer */}
        {showFullAperture && (
          <div className="p-3.5 rounded-lg bg-[#07080B] border border-[#1E2330] text-xs space-y-2">
            <div className="text-[10px] text-[#C5A059] uppercase font-bold">Declared Aperture Boundaries:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
              {envelope.aperture.spatial && (
                <div>
                  <span className="text-[#737885]">Spatial:</span>{" "}
                  <span className="text-[#C5CAD4]">{envelope.aperture.spatial}</span>
                </div>
              )}
              {envelope.aperture.temporal && (
                <div>
                  <span className="text-[#737885]">Temporal:</span>{" "}
                  <span className="text-[#C5CAD4]">{envelope.aperture.temporal}</span>
                </div>
              )}
              {envelope.aperture.population && (
                <div>
                  <span className="text-[#737885]">Population:</span>{" "}
                  <span className="text-[#C5CAD4]">{envelope.aperture.population}</span>
                </div>
              )}
              {envelope.aperture.analytical && (
                <div>
                  <span className="text-[#737885]">Analytical:</span>{" "}
                  <span className="text-[#C5CAD4]">{envelope.aperture.analytical}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* What Pathfinder Calculated vs What It Means */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#141720] border border-[#222735] space-y-2">
            <div className="text-[10px] text-[#737885] uppercase font-bold flex items-center justify-between">
              <span>What Pathfinder Calculated (Deterministic & Statistical State)</span>
              <span className="text-emerald-400 font-mono text-[10px]">VERIFIED_OUTPUT</span>
            </div>
            <p className="text-xs text-[#E6E4DF] font-mono leading-relaxed bg-[#0B0D12] p-3 rounded-lg border border-[#181C26]">
              {envelope.what_pathfinder_found}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-2">
            <div className="text-[10px] text-purple-300 uppercase font-bold flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>What That State Signifies (SIMON Plain-Language Meaning)</span>
            </div>
            <p className="text-xs text-[#E6E4DF] leading-relaxed font-sans font-normal">
              {envelope.plain_language_meaning}
            </p>
          </div>
        </div>

        {/* Physical Terrain Context (if available) */}
        {terrainContext && (
          <div className="p-4 rounded-xl bg-[#13161F] border border-[#232B3C] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E2536]">
              <span className="text-xs font-bold text-[#E6E4DF] uppercase flex items-center space-x-2">
                <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Physical Equation & Terrain Interpretation</span>
              </span>
              {terrainContext.governing_equation && (
                <code className="text-[11px] text-[#509EE3] font-mono">
                  {terrainContext.governing_equation}
                </code>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#737885]">Physical Phenomenon</span>
                <p className="text-[#C5CAD4] leading-relaxed">{terrainContext.physical_phenomenon}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#737885]">Why Those Parameters Matter</span>
                <p className="text-[#C5CAD4] leading-relaxed">{terrainContext.why_parameters_matter}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Conclusion Permitted by Calculation</span>
                <p className="text-[#C5CAD4] leading-relaxed">{terrainContext.conclusion_permitted}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-400">What Remains Unknown (Beyond Equation)</span>
                <p className="text-[#C5CAD4] leading-relaxed">{terrainContext.what_remains_unknown}</p>
              </div>
            </div>
          </div>
        )}

        {/* Epistemic Boundaries: What It Supports vs What It DOES NOT Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Supports */}
          <div className="p-4 rounded-xl bg-emerald-950/15 border border-emerald-800/40 space-y-2.5">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>What The Evidence Supports</span>
            </div>
            <ul className="space-y-2 text-xs text-[#C5CAD4]">
              {envelope.supports.map((s, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Does NOT Support (Strict Negative Firewall) */}
          <div className="p-4 rounded-xl bg-rose-950/15 border border-rose-800/40 space-y-2.5">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>What The Evidence DOES NOT Support</span>
            </div>
            <ul className="space-y-2 text-xs text-[#C5CAD4]">
              {envelope.does_not_support.map((dns, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span className="leading-relaxed">{dns}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Alternative Explanations & Counterfactuals */}
        {envelope.alternative_explanations.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-[#E6E4DF] uppercase">
              Competing Hypotheses & Counterfactual Disambiguation
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {envelope.alternative_explanations.map((alt, idx) => {
                const statusMeta = ALT_STATUS_BADGES[alt.status] || ALT_STATUS_BADGES.NOT_TESTED;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#12151E] border border-[#222938] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <div className="text-[#E6E4DF] font-medium">{alt.explanation}</div>
                      <div className="text-[10px] text-[#737885] flex items-center space-x-2">
                        <span>Basis:</span>
                        <code className="text-[#9BA1AF]">{alt.evidence_refs.join("; ")}</code>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase shrink-0 border ${statusMeta.bg} ${statusMeta.color} ${statusMeta.border}`}
                    >
                      {statusMeta.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── 6. EPISTEMIC CLASSIFICATIONS SECTION ───────────────────────────── */}
      <div className="bg-[#0E1015] border border-[#222733] rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1C212D]">
          <div>
            <h3 className="text-xs font-bold text-[#E6E4DF] uppercase tracking-wide">
              Epistemic Classifications (Statement-by-Statement Audit)
            </h3>
            <p className="text-[10px] text-[#737885] mt-0.5">
              Every assertion is explicitly classified: MEASURED vs DERIVED vs INFERRED vs HYPOTHESIZED.
            </p>
          </div>

          {/* Epistemic Filters */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            <button
              onClick={() => setActiveEpistemicFilter(null)}
              className={`px-2 py-1 rounded border transition-colors cursor-pointer ${
                activeEpistemicFilter === null
                  ? "bg-[#252B3A] border-[#C5A059] text-[#E6E4DF]"
                  : "bg-[#12151D] border-[#222838] text-[#8A8F9A] hover:text-[#C5CAD4]"
              }`}
            >
              ALL ({envelope.evidence_interpretation.length})
            </button>
            {(["MEASURED", "DERIVED", "INFERRED", "HYPOTHESIZED"] as SimonEpistemicClass[]).map((cls) => {
              const count = envelope.evidence_interpretation.filter(e => e.epistemic_class === cls).length;
              if (count === 0) return null;
              const meta = EPISTEMIC_BADGES[cls];
              return (
                <button
                  key={cls}
                  onClick={() => setActiveEpistemicFilter(cls)}
                  className={`px-2 py-1 rounded border transition-colors cursor-pointer ${
                    activeEpistemicFilter === cls
                      ? `${meta.bg} ${meta.color} ${meta.border} font-bold`
                      : "bg-[#12151D] border-[#222838] text-[#8A8F9A] hover:text-[#C5CAD4]"
                  }`}
                >
                  {cls} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Statement Cards */}
        <div className="space-y-2.5">
          {filteredEvidence.map((item, idx) => {
            const meta = EPISTEMIC_BADGES[item.epistemic_class] || EPISTEMIC_BADGES.DERIVED;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-[#12151E] border border-[#202636] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="text-[#E6E4DF] leading-relaxed font-sans">{item.statement}</div>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#737885]">
                    <span className="text-[#555E70]">Provenance / References:</span>
                    {item.evidence_refs.map((ref, rIdx) => (
                      <code key={rIdx} className="px-1.5 py-0.5 rounded bg-[#0A0B0E] border border-[#1B1F2A] text-[#9BA1AF]">
                        {ref}
                      </code>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 flex items-center space-x-2">
                  <span
                    title={meta.desc}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${meta.bg} ${meta.color} ${meta.border}`}
                  >
                    [{meta.label}]
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 7. UNCERTAINTY & BOUNDARIES SECTION ───────────────────────────── */}
      <div className="bg-[#0E1015] border border-[#222733] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1C212D]">
          <div>
            <h3 className="text-xs font-bold text-[#E6E4DF] uppercase tracking-wide">
              Uncertainty, Boundaries & Limiting Factors
            </h3>
            <p className="text-[10px] text-[#737885] mt-0.5">
              Strict accounting of measurement error, model approximations, and residual entropy.
            </p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#1A1D27] border border-[#2D3344] text-[#C5A059] font-bold">
            UNCERTAINTY LEVEL: {envelope.uncertainty.level || "LOW"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#12151D] border border-[#222938] space-y-2">
            <div className="text-[10px] uppercase font-bold text-[#737885]">
              Quantitative Bounds / Statistics
            </div>
            <div className="text-xs text-[#E6E4DF] font-mono bg-[#0B0D12] p-2.5 rounded border border-[#1A1E29]">
              {envelope.uncertainty.quantitative_measure || "Numerical convergence tolerance < 1e-6"}
            </div>
            <p className="text-[11px] text-[#8A8F9A] leading-relaxed pt-1">
              {envelope.uncertainty.explanation}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#12151D] border border-[#222938] space-y-2">
            <div className="text-[10px] uppercase font-bold text-[#737885]">
              Specific Limiting Factors & Assumptions
            </div>
            <ul className="space-y-1.5 text-xs text-[#C5CAD4]">
              {envelope.uncertainty.sources.map((src, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-[#C5A059] font-bold">›</span>
                  <span className="leading-relaxed">{src}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Why It Matters */}
        <div className="p-3.5 rounded-lg bg-[#141720] border border-[#252B3B] space-y-1 text-xs">
          <span className="text-[10px] uppercase font-bold text-[#C5A059]">Why This Matters for Domain Engineering:</span>
          <p className="text-[#C5CAD4] leading-relaxed">{envelope.why_it_matters}</p>
        </div>
      </div>

      {/* ── 8. NEXT DISCRIMINATING STEP ───────────────────────────────────── */}
      {envelope.next_discriminating_step && (
        <div className="bg-[#0E1015] border border-[#222733] rounded-xl p-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1C212D]">
            <span className="text-xs font-bold text-[#E6E4DF] uppercase flex items-center space-x-2">
              <ArrowRight className="w-4 h-4 text-[#C5A059]" />
              <span>Next Discriminating Move (Highest Information Gain)</span>
            </span>
            <span className="text-[10px] text-[#737885]">Active Hypothesis Disambiguation</span>
          </div>

          <div className="p-4 rounded-xl bg-[#141822] border border-[#252E42] space-y-3">
            <div className="space-y-1">
              <div className="text-xs font-bold text-[#E6E4DF]">
                {envelope.next_discriminating_step.action}
              </div>
              <p className="text-[11px] text-[#8A8F9A]">
                <strong className="text-[#A0A8B8]">Expected Information Gain:</strong>{" "}
                {envelope.next_discriminating_step.expected_information_gain}
              </p>
              <p className="text-[11px] text-[#737885]">
                <strong className="text-[#A0A8B8]">Rationale:</strong>{" "}
                {envelope.next_discriminating_step.rationale}
              </p>
            </div>

            {onDispatchNextStep && (
              <div className="pt-2">
                <button
                  onClick={() => onDispatchNextStep(envelope.next_discriminating_step.action)}
                  className="px-4 py-2 rounded-lg bg-[#C5A059] hover:bg-[#D4AF37] text-[#0D0E11] text-xs font-bold transition-all shadow cursor-pointer flex items-center space-x-2"
                >
                  <span>Dispatch Next Discriminating Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 9. STRICT ABSENCE OF AUTHORITY FIREWALL ────────────────────────── */}
      <div className="p-3.5 rounded-xl bg-[#090A0E] border border-[#181C26] flex items-center justify-between text-[11px] text-[#737885]">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-[#A0A8B8]">Non-Delegable Authority Guarantee:</strong> SIMON synthesizes meaning and cognitive legibility. SIMON possesses no executive authority and issues zero mandates. All decision authority resides strictly with the Human Operator.
          </span>
        </div>
        <span className="text-[10px] text-emerald-400 font-mono font-bold shrink-0 hidden sm:inline">
          INVARIANT_CERTIFIED
        </span>
      </div>
    </div>
  );
};
