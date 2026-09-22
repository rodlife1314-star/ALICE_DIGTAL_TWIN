import React, { useState, useEffect } from "react";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Zap,
  Activity,
  ArrowRight,
  Database,
  Lock,
  RotateCcw,
  Sliders,
  Cpu,
  Layers,
  AlertOctagon,
  FileCheck,
  Terminal,
  Clock,
  Sparkles,
  Info
} from "lucide-react";
import {
  DEFAULT_BOUNDED_OPERATIONAL_ENVELOPE,
  JEMMA_FUSIONALITY_SUBSTRATE_REVIEW,
  EPISTEMIC_TIERS,
  runReflexControlCycle,
  validateEpistemicSeparation
} from "../lib/boundedOperationalEnvelope";
import { ReflexControlCycle, EpistemicTier } from "../types";

export function JemmaSubstrateReviewPanel() {
  const [activeSubTab, setActiveSubTab] = useState<"review" | "cockpit" | "epistemic">("review");
  const [envelope, setEnvelope] = useState(DEFAULT_BOUNDED_OPERATIONAL_ENVELOPE);
  const [reflexHistory, setReflexHistory] = useState<ReflexControlCycle[]>(() => [
    runReflexControlCycle(DEFAULT_BOUNDED_OPERATIONAL_ENVELOPE, false)
  ]);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [simulatedBreachTriggered, setSimulatedBreachTriggered] = useState(false);

  const latestCycle = reflexHistory[0] || null;

  // Auto reflex runner loop (when active)
  useEffect(() => {
    if (!isAutoRunning) return;
    const interval = setInterval(() => {
      setReflexHistory(prev => [
        runReflexControlCycle(envelope, simulatedBreachTriggered),
        ...prev.slice(0, 19)
      ]);
    }, 400);
    return () => clearInterval(interval);
  }, [isAutoRunning, envelope, simulatedBreachTriggered]);

  const handleStepOnce = (breach: boolean = false) => {
    const cycle = runReflexControlCycle(envelope, breach);
    setReflexHistory(prev => [cycle, ...prev.slice(0, 19)]);
    setSimulatedBreachTriggered(breach);
  };

  return (
    <div className="bg-[#12141A] border border-[#222733] rounded-xl p-6 space-y-6 text-[#E6E4DF]">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#1E2330] pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
            <Shield className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span>JEMMA SUBSTRATE ARCHITECTURE REVIEW</span>
            <span>•</span>
            <span className="text-[#509EE3]">SOVEREIGN TEMPORAL KERNEL</span>
          </div>
          <h2 className="text-xl font-light tracking-tight text-[#E6E4DF] mt-1">
            Bounded Operational Envelope (Ω_safe) & Reflex Speed
          </h2>
          <p className="text-xs text-[#8A8F9A] mt-1 max-w-3xl">
            Human authorises the envelope at governance cadence; machine executes deterministic reflex control at sub-second speed.
            Invariant: <code className="text-[#4ADE80] font-mono">x_t ∉ Ω_safe ⇒ STOP</code>.
          </p>
        </div>

        {/* Disposition Badge */}
        <div className="flex items-center space-x-3">
          <div className="bg-[#181D26] border border-[#2A3344] px-4 py-2 rounded-lg text-right">
            <div className="text-[10px] uppercase font-mono text-[#8A8F9A]">Substrate Disposition</div>
            <div className="text-sm font-mono font-bold text-[#4ADE80] flex items-center space-x-1.5 justify-end">
              <CheckCircle className="w-4 h-4 text-[#4ADE80]" />
              <span>ADAPT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center space-x-2 border-b border-[#1E2330] pb-3 text-xs">
        <button
          onClick={() => setActiveSubTab("review")}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeSubTab === "review"
              ? "bg-[#1C2230] text-[#E6E4DF] border border-[#333E54]"
              : "text-[#8A8F9A] hover:text-[#C8CAD0]"
          }`}
        >
          1. Substrate Review & Synthesis
        </button>
        <button
          onClick={() => setActiveSubTab("cockpit")}
          className={`px-3 py-1.5 rounded font-medium transition-colors flex items-center space-x-1.5 ${
            activeSubTab === "cockpit"
              ? "bg-[#1C2230] text-[#E6E4DF] border border-[#333E54]"
              : "text-[#8A8F9A] hover:text-[#C8CAD0]"
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>2. Live Ω_safe Reflex Cockpit (100Hz)</span>
        </button>
        <button
          onClick={() => setActiveSubTab("epistemic")}
          className={`px-3 py-1.5 rounded font-medium transition-colors flex items-center space-x-1.5 ${
            activeSubTab === "epistemic"
              ? "bg-[#1C2230] text-[#E6E4DF] border border-[#333E54]"
              : "text-[#8A8F9A] hover:text-[#C8CAD0]"
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#A855F7]" />
          <span>3. Epistemic Separation Quad</span>
        </button>
      </div>

      {/* SUBTAB 1: REVIEW & SYNTHESIS */}
      {activeSubTab === "review" && (
        <div className="space-y-6 text-xs">
          {/* Core Axiom Callout */}
          <div className="bg-[#161B24] border-l-4 border-[#C5A059] p-4 rounded-r-lg space-y-2">
            <div className="text-[11px] font-mono text-[#C5A059] font-bold uppercase tracking-wider">
              PATHFINDER LAW OF TEMPORAL AUTHORITY
            </div>
            <blockquote className="text-sm italic text-[#E6E4DF] font-serif leading-relaxed">
              &ldquo;Authority is not the same thing as intervention frequency. A human can remain sovereign without
              physically touching every state transition. The authority lives in the boundary conditions:
              <span className="text-[#4ADE80] font-semibold not-italic font-mono ml-1">
                Authority defines the permissible state-space (Ω_safe).
              </span> The machine may move rapidly inside it. It may never redefine it.&rdquo;
            </blockquote>
          </div>

          {/* Mathematical Pipeline Box */}
          <div className="bg-[#0F1218] border border-[#232B3B] p-4 rounded-lg space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8F9A] font-bold">
              Refined Sovereign Pipeline with Timescale Decoupling
            </span>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#E6E4DF] py-2">
              <span className="px-2.5 py-1.5 rounded bg-[#1A202C] border border-[#2D3748] text-[#C5A059] font-bold">
                Human defines Ω_safe
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#718096]" />
              <span className="px-2.5 py-1.5 rounded bg-[#1A202C] border border-[#2D3748] text-[#F59E0B]">
                Agent recommends u*
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#718096]" />
              <span className="px-2.5 py-1.5 rounded bg-[#1A202C] border border-[#2D3748] text-[#509EE3]">
                Policy verifies (u* ∈ Ω_safe)
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#718096]" />
              <span className="px-2.5 py-1.5 rounded bg-[#111C16] border border-[#1E3827] text-[#4ADE80] font-bold">
                System acts within Ω_safe
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#718096]" />
              <span className="px-2.5 py-1.5 rounded bg-[#1A202C] border border-[#2D3748] text-[#A855F7]">
                Ledger records trajectory
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] font-mono text-[#F87171] bg-[#221316] border border-[#3D1D24] p-2 rounded">
              <AlertOctagon className="w-4 h-4 text-[#F87171] shrink-0" />
              <span>Hard Fail-Closed Invariant: x_t ∉ Ω_safe ⇒ STOP (Immediate deterministic interrupt, zero negotiation)</span>
            </div>
          </div>

          {/* 4-Tier Epistemic Audit Table */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8F9A] font-bold">
              Substrate Epistemic Audit (Adversarial Extraction)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* OBSERVED */}
              <div className="bg-[#141720] border border-[#222838] p-4 rounded-lg space-y-2">
                <div className="text-[10px] font-mono font-bold uppercase text-[#509EE3] flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#509EE3]" />
                  <span>OBSERVED (Source Facts)</span>
                </div>
                <ul className="text-[#A0A8B8] space-y-1.5 list-disc list-inside text-[11px]">
                  {JEMMA_FUSIONALITY_SUBSTRATE_REVIEW.epistemicAudit.observed.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* DERIVED */}
              <div className="bg-[#141720] border border-[#222838] p-4 rounded-lg space-y-2">
                <div className="text-[10px] font-mono font-bold uppercase text-[#C5A059] flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                  <span>DERIVED (Systems Engineering Implications)</span>
                </div>
                <ul className="text-[#A0A8B8] space-y-1.5 list-disc list-inside text-[11px]">
                  {JEMMA_FUSIONALITY_SUBSTRATE_REVIEW.epistemicAudit.derived.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* ANALOGY */}
              <div className="bg-[#141720] border border-[#222838] p-4 rounded-lg space-y-2">
                <div className="text-[10px] font-mono font-bold uppercase text-[#A855F7] flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#A855F7]" />
                  <span>ANALOGY (Parallels with Pathfinder)</span>
                </div>
                <ul className="text-[#A0A8B8] space-y-1.5 list-disc list-inside text-[11px]">
                  {JEMMA_FUSIONALITY_SUBSTRATE_REVIEW.epistemicAudit.analogy.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* SPECULATIVE REJECTED */}
              <div className="bg-[#1C1417] border border-[#382026] p-4 rounded-lg space-y-2">
                <div className="text-[10px] font-mono font-bold uppercase text-[#F87171] flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F87171]" />
                  <span>SPECULATIVE REJECTED (Unsound Leaps)</span>
                </div>
                <ul className="text-[#D1A0A8] space-y-1.5 list-disc list-inside text-[11px]">
                  {JEMMA_FUSIONALITY_SUBSTRATE_REVIEW.epistemicAudit.speculativeRejected.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Minimum Architectural Change Box */}
          <div className="bg-[#131720] border border-[#263248] p-4 rounded-lg space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#4ADE80] font-bold">
              Minimum Architectural Change Required for Pathfinder
            </span>
            <p className="text-[#C8D0DF] leading-relaxed text-xs">
              {JEMMA_FUSIONALITY_SUBSTRATE_REVIEW.minimumArchitecturalChange}
            </p>
          </div>
        </div>
      )}

      {/* SUBTAB 2: LIVE REFLEX COCKPIT */}
      {activeSubTab === "cockpit" && (
        <div className="space-y-6 text-xs">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0F1218] p-4 rounded-lg border border-[#222838]">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] animate-pulse" />
              <span className="font-mono text-xs text-[#E6E4DF] font-medium">
                Reflex Loop Cadence: {envelope.reflexLoopFrequencyHz} Hz (10 ms period)
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleStepOnce(false)}
                className="px-3 py-1.5 rounded bg-[#1E2535] hover:bg-[#283248] text-[#E6E4DF] font-medium border border-[#303D56] cursor-pointer"
              >
                Step Reflex Cycle (Normal)
              </button>
              <button
                onClick={() => handleStepOnce(true)}
                className="px-3 py-1.5 rounded bg-[#2D161A] hover:bg-[#3D1E24] text-[#F87171] font-medium border border-[#52252D] cursor-pointer"
              >
                Inject Out-of-Envelope Anomaly (Breach)
              </button>
              <button
                onClick={() => setIsAutoRunning(!isAutoRunning)}
                className={`px-3 py-1.5 rounded font-semibold cursor-pointer ${
                  isAutoRunning
                    ? "bg-[#F59E0B] text-[#0D0E11]"
                    : "bg-[#4ADE80] text-[#0D0E11]"
                }`}
              >
                {isAutoRunning ? "Pause Auto-Loop" : "Run Continuous 100Hz Loop"}
              </button>
            </div>
          </div>

          {/* Current State & Envelope Verification Grid */}
          {latestCycle && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* 1. MEASURED */}
              <div className="bg-[#131722] border border-[#222B3D] p-3 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#509EE3]">01 · MEASURED</span>
                  <span className="text-[9px] font-mono text-[#73829C]">Sensor TC-09</span>
                </div>
                <div className="text-lg font-mono font-bold text-[#E6E4DF]">
                  {latestCycle.measuredState.value} {latestCycle.measuredState.units}
                </div>
                <p className="text-[10px] text-[#8A95AA]">{latestCycle.measuredState.variableName}</p>
                <div className="text-[9px] font-mono text-[#509EE3] truncate">
                  {latestCycle.measuredState.immutableSignature}
                </div>
              </div>

              {/* 2. ESTIMATED */}
              <div className="bg-[#18161D] border border-[#2B2438] p-3 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#C5A059]">02 · ESTIMATED</span>
                  <span className="text-[9px] font-mono text-[#73829C]">Kalman Observer</span>
                </div>
                <div className="text-lg font-mono font-bold text-[#E6E4DF]">
                  {latestCycle.estimatedCoreState.value} {latestCycle.estimatedCoreState.units}
                </div>
                <p className="text-[10px] text-[#8A95AA]">{latestCycle.estimatedCoreState.variableName}</p>
                <div className="text-[9px] font-mono text-[#C5A059] truncate">
                  {latestCycle.estimatedCoreState.immutableSignature}
                </div>
              </div>

              {/* 3. SIMULATED */}
              <div className="bg-[#18131E] border border-[#2E203C] p-3 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#A855F7]">03 · SIMULATED</span>
                  <span className="text-[9px] font-mono text-[#73829C]">PDE Forward 50ms</span>
                </div>
                <div className="text-lg font-mono font-bold text-[#E6E4DF]">
                  {latestCycle.simulatedTrajectory.value} {latestCycle.simulatedTrajectory.units}
                </div>
                <p className="text-[10px] text-[#8A95AA]">{latestCycle.simulatedTrajectory.variableName}</p>
                <div className="text-[9px] font-mono text-[#A855F7] truncate">
                  {latestCycle.simulatedTrajectory.immutableSignature}
                </div>
              </div>

              {/* 4. RECOMMENDED */}
              <div className="bg-[#1A1612] border border-[#33261C] p-3 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#F59E0B]">04 · RECOMMENDED</span>
                  <span className="text-[9px] font-mono text-[#73829C]">Agent Policy</span>
                </div>
                <div className="text-lg font-mono font-bold text-[#E6E4DF]">
                  {latestCycle.agentRecommendedAction.value} {latestCycle.agentRecommendedAction.units}
                </div>
                <p className="text-[10px] text-[#8A95AA]">{latestCycle.agentRecommendedAction.variableName}</p>
                <div className="text-[9px] font-mono text-[#F59E0B] truncate">
                  {latestCycle.agentRecommendedAction.immutableSignature}
                </div>
              </div>
            </div>
          )}

          {/* Live Verdict & Execution Status Banner */}
          {latestCycle && (
            <div
              className={`p-4 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                latestCycle.insideEnvelope
                  ? "bg-[#101D17] border-[#1C3E2A] text-[#4ADE80]"
                  : "bg-[#271216] border-[#4A1E27] text-[#F87171]"
              }`}
            >
              <div className="flex items-center space-x-3">
                {latestCycle.insideEnvelope ? (
                  <CheckCircle className="w-6 h-6 text-[#4ADE80] shrink-0" />
                ) : (
                  <AlertOctagon className="w-6 h-6 text-[#F87171] shrink-0" />
                )}
                <div>
                  <div className="font-mono text-xs uppercase font-bold tracking-wider">
                    {latestCycle.insideEnvelope
                      ? "CYCLE COMPLIANT WITH Ω_safe · ACTUATE REFLEX"
                      : "CRITICAL BREACH DETECTED · DETERMINISTIC STOP TRIGGERED"}
                  </div>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    {latestCycle.insideEnvelope
                      ? `Agent actuation of ${latestCycle.agentRecommendedAction.value} kV is within safe voltage/temperature envelope. Reflex execution latency: ${latestCycle.latencyMs}ms.`
                      : `State variable or recommended action exceeded authorized envelope limits. Non-learning safety rails halted actuation fail-closed in ${latestCycle.latencyMs}ms.`}
                  </p>
                </div>
              </div>

              <div className="font-mono text-[10px] bg-black/40 px-3 py-1.5 rounded self-start md:self-auto shrink-0">
                Commit: {latestCycle.ledgerCommitHash}
              </div>
            </div>
          )}

          {/* Recent Reflex Cycle Execution Ledger */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8F9A] font-bold">
              Sub-second Reflex Execution Ledger (Last {reflexHistory.length} Cycles)
            </span>
            <div className="border border-[#222838] rounded-lg overflow-hidden font-mono text-[11px]">
              <div className="bg-[#141720] px-4 py-2 border-b border-[#222838] grid grid-cols-6 text-[#73829C] text-[10px] font-bold">
                <span>CYCLE ID</span>
                <span>MEASURED</span>
                <span>ESTIMATED</span>
                <span>RECOMMENDED</span>
                <span>LATENCY</span>
                <span>STATUS / ACTION</span>
              </div>
              <div className="divide-y divide-[#1B202D] max-h-56 overflow-y-auto">
                {reflexHistory.map((c) => (
                  <div
                    key={c.cycleId}
                    className={`px-4 py-2 grid grid-cols-6 items-center ${
                      c.insideEnvelope ? "hover:bg-[#141924]" : "bg-[#1E1114] text-[#F87171]"
                    }`}
                  >
                    <span className="text-[#8A95AA] truncate">{c.cycleId}</span>
                    <span className="text-[#509EE3]">{c.measuredState.value}°C</span>
                    <span className="text-[#C5A059]">{c.estimatedCoreState.value}°C</span>
                    <span className="text-[#F59E0B]">{c.agentRecommendedAction.value} kV</span>
                    <span className="text-[#8A95AA]">{c.latencyMs} ms</span>
                    <span
                      className={`font-bold ${
                        c.insideEnvelope ? "text-[#4ADE80]" : "text-[#F87171]"
                      }`}
                    >
                      {c.executionAction}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: EPISTEMIC SEPARATION QUAD */}
      {activeSubTab === "epistemic" && (
        <div className="space-y-6 text-xs">
          {/* Epistemic Invariant Box */}
          <div className="bg-[#161B26] border border-[#28354D] p-5 rounded-lg space-y-3">
            <div className="flex items-center space-x-2 text-[#4ADE80] font-mono text-xs font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>THE PATHFINDER EPISTEMIC NON-CONFLATION LAW</span>
            </div>
            <div className="text-base font-mono font-bold text-[#E6E4DF] bg-[#0E1218] p-3 rounded border border-[#1E2536] text-center">
              MEASURED ≠ ESTIMATED ≠ SIMULATED ≠ RECOMMENDED
            </div>
            <p className="text-xs text-[#A0A8B8] leading-relaxed">
              A derived or predicted state must never quietly become &ldquo;reality&rdquo; merely because downstream software
              consumes it. Every datum entering the Digital Twin substrate must maintain its provenance pedigree and epistemic tag.
            </p>
          </div>

          {/* 4 Cards Detailing Each Tier */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(EPISTEMIC_TIERS).map(([tierKey, config]) => (
              <div
                key={tierKey}
                className="bg-[#13161F] border border-[#222838] p-4 rounded-lg space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span
                    style={{ color: config.badgeColor }}
                    className="font-mono text-xs font-bold uppercase tracking-wider"
                  >
                    [{config.label}]
                  </span>
                  <span className="text-[10px] font-mono text-[#73829C]">IMMUTABLE CLASS</span>
                </div>
                <p className="text-xs text-[#C8D0DF] leading-relaxed">{config.description}</p>
                <div className="bg-[#0C0E14] p-2.5 rounded border border-[#1A1F2C] text-[11px] font-mono text-[#8A95AA]">
                  {tierKey === "MEASURED" && "Example: Sensor T = 742.0°C [MEASURED, Thermocouple]"}
                  {tierKey === "ESTIMATED" && "Example: State estimator T_core ≈ 811.2°C [ESTIMATED, Kalman Filter]"}
                  {tierKey === "SIMULATED" && "Example: Twin forward trajectory T_{t+5s} = 846.1°C [SIMULATED, PDE Solver]"}
                  {tierKey === "RECOMMENDED" && "Example: Agent actuator command u* = -7.2 kV [RECOMMENDED, RL Policy]"}
                </div>
              </div>
            ))}
          </div>

          {/* Validation Rule Invariant Attestation */}
          <div className="bg-[#111A16] border border-[#1C3A28] p-4 rounded-lg space-y-2 text-[#4ADE80]">
            <div className="text-[11px] font-mono font-bold uppercase">Substrate Attestation</div>
            <p className="text-xs text-[#A3E6BA] leading-relaxed">
              Pathfinder guarantees that neural networks, PDE physics solvers, and candidate optimizers cannot emit
              tokens or states tagged as [MEASURED]. Only physical sensor telemetry authenticated via hardware cryptochips
              is granted [MEASURED] epistemic standing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
