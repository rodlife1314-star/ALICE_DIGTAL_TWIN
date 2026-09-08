/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Pathfinder Substrate — Causal Workflow Engine (12-Stage Cognitive Pipeline)
 * Runtime State Machine Implementation
 * 
 * Stages:
 * 01: Signal Ingest → 02: Triage & S/N Filter → 03: Decomposition →
 * 04: Evidence & Separation → 05: Graph Traversal → 06: Compute & CBLI Lens →
 * 07: Jemma Adversarial Challenge → 08: Alice Synthesis → 09: Octagon Policy Gate →
 * 10: Operator Decision → 11: State Commitment → 12: Immutable Aether Memory
 */

import React, { useState } from "react";
import {
  Workflow,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  Eye,
  Network,
  Gauge,
  Sparkles,
  Scale,
  UserCheck,
  Check,
  Database,
  RefreshCw,
  FileText,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  Zap,
  Play,
  RotateCcw,
  Key,
  Lock,
  CornerDownRight,
  SkipForward
} from "lucide-react";
import { CausalSignalPipeline, PipelineStep } from "../types";
import {
  SAMPLE_CAUSAL_PIPELINES,
  stepForwardWorkflow,
  stepBackwardWorkflow,
  recordOperatorDecision,
  evaluateOctagonGate
} from "../lib/causalWorkflowRuntime";

export const CausalWorkflowEngine: React.FC = () => {
  const [pipelines, setPipelines] = useState<CausalSignalPipeline[]>(SAMPLE_CAUSAL_PIPELINES);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>(SAMPLE_CAUSAL_PIPELINES[0].id);
  const [operatorKey, setOperatorKey] = useState<string>("OP-SOV-ALPHA-909");
  const [runtimeStatusMessage, setRuntimeStatusMessage] = useState<string | null>(null);

  const activePipeline = pipelines.find(p => p.id === selectedPipelineId) || pipelines[0];
  const currentStep = activePipeline.steps[activePipeline.currentStepIndex] || activePipeline.steps[0];
  const octagonEvaluation = evaluateOctagonGate(activePipeline, !!activePipeline.operatorSigned);

  const updatePipeline = (updated: CausalSignalPipeline) => {
    setPipelines(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleStepForward = () => {
    const result = stepForwardWorkflow(activePipeline, operatorKey);
    updatePipeline(result.pipeline);
    setRuntimeStatusMessage(result.message);
  };

  const handleStepBackward = () => {
    const updated = stepBackwardWorkflow(activePipeline);
    updatePipeline(updated);
    setRuntimeStatusMessage(`Stepped back to Stage ${updated.steps[updated.currentStepIndex].stepNumber}`);
  };

  const handleRunToGate = () => {
    let curr = activePipeline;
    let iterations = 0;
    while (curr.currentStepIndex < 8 && iterations < 12) { // 8 is index of Stage 09
      const res = stepForwardWorkflow(curr, operatorKey);
      if (!res.success) break;
      curr = res.pipeline;
      iterations++;
    }
    updatePipeline(curr);
    setRuntimeStatusMessage(`Fast-forwarded to Octagon Policy Gate (Stage ${curr.steps[curr.currentStepIndex].stepNumber})`);
  };

  const handleReset = () => {
    const original = SAMPLE_CAUSAL_PIPELINES.find(p => p.id === activePipeline.id);
    if (original) {
      updatePipeline(JSON.parse(JSON.stringify(original)));
      setRuntimeStatusMessage("Reset pipeline to default initial state.");
    }
  };

  const handleOperatorDecision = (decision: "APPROVE" | "HOLD" | "REJECT") => {
    const res = recordOperatorDecision(activePipeline, decision, operatorKey);
    updatePipeline(res.pipeline);
    setRuntimeStatusMessage(res.message);
  };

  return (
    <div className="bg-[#0D0E11] p-6 rounded-2xl border border-[#22252D] text-[#E6E4DF] space-y-6">
      {/* Header & Pipeline Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-[#22252D] gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#161B26] border border-[#2B354A] rounded-xl flex items-center justify-center text-[#509EE3] shadow-sm">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-medium tracking-tight text-[#E6E4DF]">
                Causal Workflow Engine
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#161B26] text-[#509EE3] border border-[#2B354A] uppercase">
                12-Stage State Machine
              </span>
            </div>
            <p className="text-xs text-[#8A8F9A] mt-0.5">
              Deterministic cognitive pipeline: Ingest → Triage → Decomposition → Evidence → Graph → Compute → Adversarial Challenge → Synthesis → Octagon Gate → Sovereign Operator → Commit → Aether Memory.
            </p>
          </div>
        </div>

        {/* Pipeline Selector Dropdown */}
        <div className="flex items-center space-x-3">
          <select
            value={selectedPipelineId}
            onChange={(e) => setSelectedPipelineId(e.target.value)}
            className="bg-[#14161C] border border-[#282C37] rounded-lg px-3 py-1.5 text-xs text-[#E6E4DF] focus:outline-none focus:border-[#509EE3]"
          >
            {pipelines.map(p => (
              <option key={p.id} value={p.id}>
                {p.title.length > 55 ? p.title.substring(0, 52) + "..." : p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pipeline Metadata Bar & Runtime Controls */}
      <div className="bg-[#13151A] border border-[#22262F] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#8A8F9A]">Pipeline:</span>
          <span className="font-semibold text-[#E6E4DF]">{activePipeline.title}</span>
          <span className="text-[#3A3F4D]">|</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1C202A] text-[#A0A8B8] border border-[#2B313F]">
            {activePipeline.category}
          </span>
          <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
            activePipeline.materiality === "CRITICAL"
              ? "bg-[#251214] text-[#F87171] border-[#451A1D]"
              : "bg-[#211910] text-[#F59E0B] border-[#3D2C1B]"
          }`}>
            Materiality: {activePipeline.materiality}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#111A16] text-[#4ADE80] border border-[#1C3527]">
            {activePipeline.epistemicState}
          </span>
        </div>

        {/* Interactive Step Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleStepBackward}
            disabled={activePipeline.currentStepIndex <= 0}
            className="flex items-center space-x-1 px-3 py-1.5 rounded bg-[#181B22] hover:bg-[#20252F] disabled:opacity-40 text-xs text-[#A0A8B8] transition-colors border border-[#292E3B] cursor-pointer"
          >
            <span>Back</span>
          </button>

          <button
            onClick={handleRunToGate}
            disabled={activePipeline.currentStepIndex >= 8}
            className="flex items-center space-x-1 px-3 py-1.5 rounded bg-[#1A2233] hover:bg-[#243048] disabled:opacity-40 text-xs text-[#509EE3] transition-colors border border-[#2F4060] cursor-pointer font-medium"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Run to Gate 09</span>
          </button>

          <button
            onClick={handleStepForward}
            disabled={activePipeline.currentStepIndex >= activePipeline.steps.length - 1}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded bg-[#C5A059] hover:bg-[#D4AF37] disabled:opacity-40 text-xs text-[#0D0E11] font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <span>Step Forward</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleReset}
            title="Reset Pipeline"
            className="p-1.5 rounded bg-[#181B22] hover:bg-[#20252F] text-[#8A8F9A] hover:text-[#E6E4DF] transition-colors border border-[#292E3B] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {runtimeStatusMessage && (
        <div className="text-xs font-mono px-3 py-2 rounded bg-[#141824] border border-[#223048] text-[#70A5E8] flex items-center justify-between">
          <span>{runtimeStatusMessage}</span>
          <button onClick={() => setRuntimeStatusMessage(null)} className="text-[#8A8F9A] hover:text-[#E6E4DF]">✕</button>
        </div>
      )}

      {/* 12-Stage Visual Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#8A8F9A]">
          <span>Pipeline Stage Progress ({activePipeline.currentStepIndex + 1} of 12)</span>
          <span className="text-[#C5A059] font-medium">{currentStep.stepNumber} · {currentStep.name}</span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
          {activePipeline.steps.map((step, idx) => {
            const isCompleted = step.status === "COMPLETED";
            const isActive = step.status === "ACTIVE";
            const isHalted = step.status === "HALTED";

            let bg = "bg-[#14161C] border-[#22262F] text-[#6A707E]";
            if (isCompleted) bg = "bg-[#111A16] border-[#1C3527] text-[#4ADE80]";
            else if (isActive) bg = "bg-[#2A2312] border-[#785C1C] text-[#FBBF24] ring-1 ring-[#FBBF24]/50";
            else if (isHalted) bg = "bg-[#251214] border-[#451A1D] text-[#F87171]";

            return (
              <div
                key={step.stepNumber}
                onClick={() => {
                  const copy = { ...activePipeline, currentStepIndex: idx };
                  updatePipeline(copy);
                }}
                className={`p-2 rounded border text-center transition-all cursor-pointer ${bg} flex flex-col items-center justify-center space-y-1`}
              >
                <span className="text-[10px] font-mono font-bold">{step.stepNumber}</span>
                <span className="text-[9px] truncate max-w-full font-sans leading-tight">
                  {step.name.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Stage Deep-Dive Card */}
      <div className="bg-[#13151A] border border-[#22262F] rounded-xl p-6 space-y-6">
        {/* Stage Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#1E222A] gap-3">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-mono font-bold text-[#C5A059] bg-[#1F1B12] px-3 py-1 rounded border border-[#3E341E]">
              {currentStep.stepNumber}
            </span>
            <div>
              <h3 className="text-lg font-medium text-[#E6E4DF] flex items-center space-x-2">
                <span>{currentStep.name}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  currentStep.status === "COMPLETED"
                    ? "bg-[#111A16] text-[#4ADE80] border border-[#1C3527]"
                    : currentStep.status === "ACTIVE"
                    ? "bg-[#241B0E] text-[#F59E0B] border border-[#483315]"
                    : currentStep.status === "HALTED"
                    ? "bg-[#251214] text-[#F87171] border border-[#451A1D]"
                    : "bg-[#16181F] text-[#8A8F9A] border border-[#262A35]"
                }`}>
                  {currentStep.status}
                </span>
              </h3>
              <p className="text-xs text-[#8A8F9A] mt-0.5">
                Actor: <span className="text-[#509EE3] font-mono">{currentStep.actor}</span> ({currentStep.role})
              </p>
            </div>
          </div>

          {currentStep.refusalCriteria && (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded bg-[#251214] border border-[#451A1D] text-xs text-[#FCA5A5]">
              <ShieldAlert className="w-4 h-4 shrink-0 text-[#F87171]" />
              <span>{currentStep.refusalCriteria}</span>
            </div>
          )}
        </div>

        {/* Stage Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          {/* Action Summary & Execution Details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono text-[#8A8F9A] tracking-wider">
                Action Summary
              </span>
              <p className="text-sm text-[#E6E4DF] leading-relaxed bg-[#0F1014] p-3 rounded border border-[#1E222A]">
                {currentStep.actionSummary}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono text-[#8A8F9A] tracking-wider">
                Verification Details
              </span>
              <p className="text-xs text-[#A0A4AB] leading-relaxed bg-[#0F1014] p-3 rounded border border-[#1E222A]">
                {currentStep.details}
              </p>
            </div>

            {currentStep.outputs && currentStep.outputs.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono text-[#8A8F9A] tracking-wider">
                  Attested Outputs
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentStep.outputs.map((out, i) => (
                    <span
                      key={i}
                      className="font-mono text-[11px] px-2.5 py-1 rounded bg-[#161922] text-[#8CB4F5] border border-[#232B3E]"
                    >
                      {out}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contextual Rail Information */}
          <div className="bg-[#0F1014] border border-[#1E222A] p-4 rounded-xl space-y-4">
            <span className="text-[10px] uppercase font-mono text-[#C5A059] tracking-wider font-bold">
              Cognitive Stage Invariant
            </span>
            <div className="text-xs text-[#A0A4AB] space-y-3 leading-relaxed">
              {currentStep.stepNumber === "01" && (
                <p>Raw observation captured into immutable ingress buffer. No semantic mutation or categorization permitted at entry.</p>
              )}
              {currentStep.stepNumber === "02" && (
                <p>Signal-to-Noise gating. Filters noise from genuine systemic shocks. Materiality determines whether full multi-agent governance is triggered.</p>
              )}
              {currentStep.stepNumber === "03" && (
                <p>Decomposes problem into non-overlapping sub-rails to prevent conflation of raw materials with final integration.</p>
              )}
              {currentStep.stepNumber === "04" && (
                <p>Epistemic hygiene: MEASURED physical records are separated from INFERRED market models. UNKNOWN states explicitly preserved.</p>
              )}
              {currentStep.stepNumber === "05" && (
                <p>Topological graph walk reveals second-order and third-order structural bottlenecks and dependency shortest paths.</p>
              )}
              {currentStep.stepNumber === "06" && (
                <p>Deterministic calculations evaluate capacity, latency, and integrity. BigInt exact arithmetic prevents floating-point rounding drift.</p>
              )}
              {currentStep.stepNumber === "07" && (
                <p>Jemma Red-Team challenge: Falsification engine audits claims. Missing balance sheets or unverified supply halts the pipeline.</p>
              )}
              {currentStep.stepNumber === "08" && (
                <p>Alice frames candidate operational choices with explicit trade-offs. Preserves non-sovereign advisory role.</p>
              )}
              {currentStep.stepNumber === "09" && (
                <div className="space-y-2 text-[#E6E4DF]">
                  <p className="text-[#FBBF24] font-medium">Core Invariant: Score ≠ Evidence</p>
                  <p className="text-[11px] text-[#A0A4AB]">
                    Octagon evaluates required predicates (Provenance, Physics, Safety, Authority). A composite ML/RAPIDS score of 99.4/100 cannot override a failed predicate.
                  </p>
                </div>
              )}
              {currentStep.stepNumber === "10" && (
                <div className="space-y-2 text-[#E6E4DF]">
                  <p className="text-[#4ADE80] font-medium">Sovereign Operator Authority</p>
                  <p className="text-[11px] text-[#A0A4AB]">
                    Only the sovereign human can commit changes to canonical reality. Agents lack mutation rights.
                  </p>
                </div>
              )}
              {currentStep.stepNumber === "11" && (
                <p>Delta Engine updates canonical twin state only after validating cryptographic signature. No unilateral agent commits.</p>
              )}
              {currentStep.stepNumber === "12" && (
                <p>Aether Ledger: All traces, challenges, and operator authorization are hashed into an immutable append-only record.</p>
              )}
            </div>
          </div>
        </div>

        {/* Stage 09: Octagon Policy Gate Special View */}
        {currentStep.stepNumber === "09" && (
          <div className="bg-[#111318] border border-[#2B313F] p-4 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#E6E4DF] flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#509EE3]" />
                <span>Octagon Policy Predicates (P_source ∧ P_provenance ∧ P_physics ∧ P_safety ∧ P_authority)</span>
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                octagonEvaluation.overallPass
                  ? "bg-[#111A16] text-[#4ADE80] border border-[#1C3527]"
                  : "bg-[#251214] text-[#F87171] border border-[#451A1D]"
              }`}>
                {octagonEvaluation.overallPass ? "ALL PREDICATES SATISFIED" : octagonEvaluation.refusalCode || "PREDICATE REFUSAL"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
              <div className={`p-2.5 rounded border ${octagonEvaluation.pSource ? "bg-[#111A16] border-[#1C3527]" : "bg-[#251214] border-[#451A1D]"}`}>
                <span className="text-[10px] font-mono font-bold block">P_source</span>
                <span className="text-[11px] text-[#A0A4AB]">{octagonEvaluation.pSource ? "PASS: Fresh Ingress" : "FAIL: Stale Frame"}</span>
              </div>
              <div className={`p-2.5 rounded border ${octagonEvaluation.pProvenance ? "bg-[#111A16] border-[#1C3527]" : "bg-[#251214] border-[#451A1D]"}`}>
                <span className="text-[10px] font-mono font-bold block">P_provenance</span>
                <span className="text-[11px] text-[#A0A4AB]">{octagonEvaluation.pProvenance ? "PASS: Verified Ledger" : "FAIL: Jemma Objection"}</span>
              </div>
              <div className={`p-2.5 rounded border ${octagonEvaluation.pPhysics ? "bg-[#111A16] border-[#1C3527]" : "bg-[#251214] border-[#451A1D]"}`}>
                <span className="text-[10px] font-mono font-bold block">P_physics</span>
                <span className="text-[11px] text-[#A0A4AB]">{octagonEvaluation.pPhysics ? "PASS: Laws Upheld" : "FAIL: Invariant Breach"}</span>
              </div>
              <div className={`p-2.5 rounded border ${octagonEvaluation.pSafety ? "bg-[#111A16] border-[#1C3527]" : "bg-[#251214] border-[#451A1D]"}`}>
                <span className="text-[10px] font-mono font-bold block">P_safety</span>
                <span className="text-[11px] text-[#A0A4AB]">{octagonEvaluation.pSafety ? "PASS: Safe Margin" : "FAIL: Limit Exceeded"}</span>
              </div>
              <div className={`p-2.5 rounded border ${octagonEvaluation.pAuthority ? "bg-[#111A16] border-[#1C3527]" : "bg-[#241B0E] border-[#483315]"}`}>
                <span className="text-[10px] font-mono font-bold block">P_authority</span>
                <span className="text-[11px] text-[#A0A4AB]">{octagonEvaluation.pAuthority ? "PASS: Signed" : "PENDING: Operator"}</span>
              </div>
            </div>

            {octagonEvaluation.refusalReason && (
              <p className="text-xs text-[#FCA5A5] bg-[#1E1113] p-2.5 rounded border border-[#3E1A1E]">
                {octagonEvaluation.refusalReason}
              </p>
            )}
          </div>
        )}

        {/* Stage 10: Sovereign Operator Decision Panel */}
        {currentStep.stepNumber === "10" && (
          <div className="bg-[#141A16] border border-[#1C3527] p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-[#4ADE80]" />
                <h4 className="text-sm font-semibold text-[#E6E4DF]">Sovereign Operator Authority Gate</h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#111A16] text-[#4ADE80] border border-[#1C3527] font-bold">
                SOLE LEGITIMATE MUTATION PATH
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 text-xs">
              <div className="w-full sm:w-auto flex-1">
                <label className="text-[10px] uppercase font-mono text-[#8A8F9A] block mb-1">
                  Cryptographic Operator Signature Key
                </label>
                <input
                  type="text"
                  value={operatorKey}
                  onChange={(e) => setOperatorKey(e.target.value)}
                  className="w-full bg-[#0D0E11] border border-[#282C37] rounded px-3 py-1.5 font-mono text-xs text-[#4ADE80] focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-4 sm:pt-0">
                <button
                  onClick={() => handleOperatorDecision("APPROVE")}
                  className="px-4 py-2 rounded bg-[#4ADE80] hover:bg-[#22C55E] text-[#0D0E11] font-semibold text-xs shadow transition-colors cursor-pointer"
                >
                  Sovereign Approve
                </button>
                <button
                  onClick={() => handleOperatorDecision("HOLD")}
                  className="px-3 py-2 rounded bg-[#241B0E] hover:bg-[#382B17] text-[#F59E0B] border border-[#483315] text-xs transition-colors cursor-pointer"
                >
                  Hold
                </button>
                <button
                  onClick={() => handleOperatorDecision("REJECT")}
                  className="px-3 py-2 rounded bg-[#251214] hover:bg-[#3D1A1F] text-[#F87171] border border-[#451A1D] text-xs transition-colors cursor-pointer"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stage 12: Immutable Aether Memory Ledger View */}
        {activePipeline.ledgerReceiptHash && (
          <div className="bg-[#0F1219] border border-[#1E2638] p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#509EE3] flex items-center space-x-2">
                <Database className="w-4 h-4" />
                <span>Aether Immutable Ledger Receipt</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161B26] text-[#509EE3] border border-[#2B354A]">
                APPEND-ONLY AUDIT BLOCK
              </span>
            </div>
            <p className="text-xs font-mono text-[#A0A4AB] break-all bg-[#090A0E] p-2.5 rounded border border-[#1A1E29]">
              {activePipeline.ledgerReceiptHash}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
