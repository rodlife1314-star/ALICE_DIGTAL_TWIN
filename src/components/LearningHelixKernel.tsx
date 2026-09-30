/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Pathfinder Substrate — Learning Helix Kernel
 * Educational & Learner Terrain
 * 
 * Double Helix Architecture:
 * - Learner Strand: Observe → Attempt → Error → Reflect → Integrate → Transfer
 * - Teaching Strand: Elicit → Model → Diagnose → Scaffold → Validate → Fade Support
 * - 6 Inter-Strand Base Pairs:
 *   01: Encounter (Observe ↔ Elicit)
 *   02: Diagnosis (Attempt ↔ Model)
 *   03: Feedback (Error ↔ Diagnose)
 *   04: Evidence (Reflect ↔ Scaffold)
 *   05: Transfer Challenge (Integrate ↔ Validate)
 *   06: Fade Support (Transfer ↔ Fade Support)
 */

import React, { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Shield,
  Layers,
  Cpu,
  Compass,
  MessageSquare,
  Award
} from "lucide-react";
import { HelixSimulationScenario, LearningBasePair } from "../types";

export const LearningHelixKernel: React.FC = () => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const [activeBasePairIndex, setActiveBasePairIndex] = useState<number>(0);
  const [learnerInput, setLearnerInput] = useState<string>("");
  const [learnerReflection, setLearnerReflection] = useState<string>("");
  const [feedbackState, setFeedbackState] = useState<{
    submitted: boolean;
    diagnosed: boolean;
    feedbackText: string;
    isPass: boolean;
  }>({
    submitted: false,
    diagnosed: false,
    feedbackText: "",
    isPass: false
  });

  const SCENARIOS: HelixSimulationScenario[] = [
    {
      scenarioId: "helix-antikythera-mechanics",
      domain: "Deterministic Kinematics & Gear Train Precision",
      targetCompetency: "Distinguishing exact rational ratios from floating-point approximations in clockwork trains",
      pedagogicalObjective: "Demonstrate why a 39T perturbation against nominal 38T causes catastrophic +2.63% tooth interference and lunar pointer desynchronization.",
      currentStageIndex: activeBasePairIndex,
      scaffoldingLevel: "MEDIUM",
      learnerHistory: [],
      activeBasePair: {
        pairId: "pair-1-encounter",
        pairType: "ENCOUNTER",
        learnerState: "Observe",
        teachingState: "Elicit",
        prompt: "Examine Fragment B radiography: Sector tooth count shows 39 teeth on gear e1, but nominal historical template specifies 38 teeth. What physical consequence occurs at the axle center distance if 39 teeth are fitted without altering module m=0.35mm?",
        expectedEvidenceCriterion: "Pitch circle diameter increases by m = 0.35mm, exceeding backlash clearance and producing mechanical interference/binding.",
        scaffoldHint: "Recall: d = m * z, center distance a = (d1 + d2) / 2. If z increases from 38 to 39, what happens to d1?"
      }
    },
    {
      scenarioId: "helix-cryo-qubit",
      domain: "Quantum Hardware & Cryogenic Dilution",
      targetCompetency: "Thermal photon flux suppression and Johnson-Nyquist noise in superconducting transmon cavities",
      pedagogicalObjective: "Recognize that a 15mK stage thermal leak of 4µW causes exponential dephasing (T2) collapse.",
      currentStageIndex: activeBasePairIndex,
      scaffoldingLevel: "HIGH",
      learnerHistory: [],
      activeBasePair: {
        pairId: "pair-1-encounter",
        pairType: "ENCOUNTER",
        learnerState: "Observe",
        teachingState: "Elicit",
        prompt: "The mixing chamber thermometer displays 22 mK instead of 11 mK nominal. Active superconducting transmon qubit T2 coherence dropped from 140µs to 28µs. What is the dominant dephasing mechanism causing this loss?",
        expectedEvidenceCriterion: "Thermal photon occupation in the readout resonator causing stochastic AC Stark dephasing.",
        scaffoldHint: "Consider the Bose-Einstein distribution n_th = 1 / (exp(hf/kT) - 1) at 5 GHz when temperature doubles from 11mK to 22mK."
      }
    },
    {
      scenarioId: "helix-model4-sla",
      domain: "Contractual SLA & Commercial Manufacturing Optimization",
      targetCompetency: "Balancing production throughput margin against liquidated damage breach penalties",
      pedagogicalObjective: "Evaluate whether expediting Birmingham casting line at £12,000 overtime is rational against £42,500 delivery penalty.",
      currentStageIndex: activeBasePairIndex,
      scaffoldingLevel: "LOW",
      learnerHistory: [],
      activeBasePair: {
        pairId: "pair-1-encounter",
        pairType: "ENCOUNTER",
        learnerState: "Observe",
        teachingState: "Elicit",
        prompt: "Order #BM-9921 faces a 72-hour delay due to foundry refractory maintenance. SLA specifies £42,500 liquidated damages if missed. Premium express freight and dual-shift retooling cost £16,200. Propose an authoritative operational decision.",
        expectedEvidenceCriterion: "Authorize £16,200 expedition expenditure because net loss reduction equals £26,300 (£42,500 - £16,200) and preserves client enterprise goodwill.",
        scaffoldHint: "Compare absolute financial delta of incurring overtime cost versus paying breach penalty."
      }
    }
  ];

  const currentScenario = SCENARIOS[selectedScenarioIndex];

  const BASE_PAIRS_LIST: { id: string; name: string; learner: string; teacher: string; bridge: string }[] = [
    { id: "01", name: "ENCOUNTER", learner: "Observe", teacher: "Elicit", bridge: "Sensory Engagement" },
    { id: "02", name: "DIAGNOSIS", learner: "Attempt", teacher: "Model", bridge: "Initial Mental Model" },
    { id: "03", name: "FEEDBACK", learner: "Error", teacher: "Diagnose", bridge: "Cognitive Dissonance" },
    { id: "04", name: "EVIDENCE", learner: "Reflect", teacher: "Scaffold", bridge: "Grounded Integration" },
    { id: "05", name: "TRANSFER CHALLENGE", learner: "Integrate", teacher: "Validate", bridge: "Cross-Domain Shift" },
    { id: "06", name: "FADE SUPPORT", learner: "Transfer", teacher: "Fade Support", bridge: "Autonomous Mastery" }
  ];

  const handleEvaluateAttempt = () => {
    if (!learnerInput.trim()) return;

    // Pedagogical evaluation logic
    const text = learnerInput.toLowerCase();
    let isPass = false;
    let feedback = "";

    if (selectedScenarioIndex === 0) {
      // Antikythera mechanics
      if (text.includes("pitch") || text.includes("diameter") || text.includes("interference") || text.includes("binding") || text.includes("center distance") || text.includes("backlash")) {
        isPass = true;
        feedback = "Correct physical derivation. Increasing tooth count by 1 increases pitch diameter by module m=0.35mm, exceeding the gear backlash margin and producing mechanical binding (Candidate Binding MUST).";
      } else {
        feedback = "Incomplete kinematic basis. Remember the fundamental pitch circle formula: d = m * z. Consider how gear tooth count dictates center distance.";
      }
    } else if (selectedScenarioIndex === 1) {
      // Cryo qubit
      if (text.includes("stark") || text.includes("photon") || text.includes("thermal") || text.includes("resonator") || text.includes("dephasing")) {
        isPass = true;
        feedback = "Exact quantum electrodynamics diagnosis. Thermal population in the readout resonator causes photon number fluctuations, which induce stochastic AC Stark shift and destroy T2 phase coherence.";
      } else {
        feedback = "Consider the relationship between microwave cavity frequency (5-7 GHz) and thermal occupation n_th at 22 mK.";
      }
    } else {
      // Model 4 SLA
      if (text.includes("16,200") || text.includes("overtime") || text.includes("authorize") || text.includes("net") || text.includes("penalty") || text.includes("margin")) {
        isPass = true;
        feedback = "Authoritative economic synthesis. Incurring the £16,200 expedition expense saves £26,300 in unhedged contractual liquidated damages and satisfies SLA reliability standards.";
      } else {
        feedback = "Calculate the direct cost-benefit trade-off: Compare the cost of dual-shift overtime against the penalty fee.";
      }
    }

    setFeedbackState({
      submitted: true,
      diagnosed: true,
      feedbackText: feedback,
      isPass
    });
  };

  const handleNextBasePair = () => {
    if (activeBasePairIndex < BASE_PAIRS_LIST.length - 1) {
      setActiveBasePairIndex(prev => prev + 1);
      setLearnerInput("");
      setFeedbackState({ submitted: false, diagnosed: false, feedbackText: "", isPass: false });
    }
  };

  const handlePrevBasePair = () => {
    if (activeBasePairIndex > 0) {
      setActiveBasePairIndex(prev => prev - 1);
      setLearnerInput("");
      setFeedbackState({ submitted: false, diagnosed: false, feedbackText: "", isPass: false });
    }
  };

  return (
    <div className="bg-[#0D0E11] p-6 rounded-2xl border border-[#22252D] text-[#E6E4DF] space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-[#22252D] gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#14221A] border border-[#234A31] rounded-xl flex items-center justify-center text-[#4ADE80] shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-medium tracking-tight text-[#E6E4DF]">
                Learning Helix Kernel
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#14221A] text-[#4ADE80] border border-[#234A31] uppercase">
                Double Helix Terrain
              </span>
            </div>
            <p className="text-xs text-[#8A8F9A] mt-0.5">
              Authentic pedagogical architecture: Interlocking Learner Strand (Observe → Attempt → Error → Reflect → Integrate → Transfer) and Teaching Strand (Elicit → Model → Diagnose → Scaffold → Validate → Fade).
            </p>
          </div>
        </div>

        {/* Scenario Selector */}
        <div className="flex items-center space-x-3">
          <select
            value={selectedScenarioIndex ?? 0}
            onChange={(e) => {
              setSelectedScenarioIndex(Number(e.target.value));
              setActiveBasePairIndex(0);
              setLearnerInput("");
              setFeedbackState({ submitted: false, diagnosed: false, feedbackText: "", isPass: false });
            }}
            className="bg-[#14161C] border border-[#282C37] rounded-lg px-3 py-1.5 text-xs text-[#E6E4DF] focus:outline-none"
          >
            {SCENARIOS.map((sc, i) => (
              <option key={sc.scenarioId} value={i}>
                {sc.domain}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setActiveBasePairIndex(0);
              setLearnerInput("");
              setLearnerReflection("");
              setFeedbackState({ submitted: false, diagnosed: false, feedbackText: "", isPass: false });
            }}
            title="Restart Scenario"
            className="p-1.5 rounded bg-[#181B22] hover:bg-[#20252F] text-[#8A8F9A] hover:text-[#E6E4DF] transition-colors border border-[#292E3B] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scenario Overview Card */}
      <div className="bg-[#13151A] border border-[#22262F] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#E6E4DF]">{currentScenario.domain}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C202A] text-[#A0A8B8] border border-[#2B313F]">
              Scaffold: {currentScenario.scaffoldingLevel}
            </span>
          </div>
          <p className="text-xs text-[#8A8F9A] max-w-3xl">
            {currentScenario.pedagogicalObjective}
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handlePrevBasePair}
            disabled={activeBasePairIndex <= 0}
            className="px-3 py-1.5 rounded bg-[#181B22] hover:bg-[#20252F] disabled:opacity-40 text-xs text-[#A0A8B8] border border-[#292E3B] cursor-pointer"
          >
            Prev Pair
          </button>
          <button
            onClick={handleNextBasePair}
            disabled={activeBasePairIndex >= BASE_PAIRS_LIST.length - 1}
            className="px-3 py-1.5 rounded bg-[#4ADE80] hover:bg-[#22C55E] disabled:opacity-40 text-[#0D0E11] text-xs font-semibold shadow border border-transparent cursor-pointer"
          >
            Next Pair
          </button>
        </div>
      </div>

      {/* 6 Base Pairs Double Helix Progress Track */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#8A8F9A]">
          <span>Double Helix Base Pair ({activeBasePairIndex + 1} of 6)</span>
          <span className="text-[#4ADE80] font-medium">
            Learner: {BASE_PAIRS_LIST[activeBasePairIndex].learner} ↔ Teacher: {BASE_PAIRS_LIST[activeBasePairIndex].teacher}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {BASE_PAIRS_LIST.map((pair, idx) => {
            const isActive = activeBasePairIndex === idx;
            const isCompleted = activeBasePairIndex > idx;
            let bg = "bg-[#14161C] border-[#22262F] text-[#6A707E]";
            if (isCompleted) bg = "bg-[#111A16] border-[#1C3527] text-[#4ADE80]";
            else if (isActive) bg = "bg-[#14221A] border-[#2E6B44] text-[#4ADE80] ring-1 ring-[#4ADE80]/50";

            return (
              <div
                key={pair.id}
                onClick={() => setActiveBasePairIndex(idx)}
                className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${bg} flex flex-col justify-between space-y-1.5`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold">Pair {pair.id}</span>
                  <span className="text-[9px] font-mono uppercase">{pair.name}</span>
                </div>
                <div className="text-[10px] space-y-0.5 border-t border-[#1F242F] pt-1 text-left">
                  <p className="text-[#E6E4DF]"><span className="text-[#8A8F9A]">L:</span> {pair.learner}</p>
                  <p className="text-[#509EE3]"><span className="text-[#8A8F9A]">T:</span> {pair.teacher}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Learner & Teaching Dialogue Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Teaching Agent Rail (Elicit / Model / Scaffold) */}
        <div className="bg-[#13151A] border border-[#22262F] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E222A] pb-3">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-xs font-mono font-bold text-[#E6E4DF]">
                Teaching Rail: {BASE_PAIRS_LIST[activeBasePairIndex].teacher}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#211910] text-[#F59E0B] border border-[#3D2C1B]">
              Bridge: {BASE_PAIRS_LIST[activeBasePairIndex].bridge}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono text-[#8A8F9A] block mb-1">
                Pedagogical Prompt & Elicitation
              </span>
              <p className="text-sm text-[#E6E4DF] bg-[#0F1014] p-3 rounded border border-[#1E222A] leading-relaxed">
                {currentScenario.activeBasePair.prompt}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-[#8A8F9A] block mb-1">
                Scaffold Hint (Adaptive Assistance)
              </span>
              <p className="text-xs text-[#9DA4B0] bg-[#0F1014] p-3 rounded border border-[#1E222A] leading-relaxed">
                💡 {currentScenario.activeBasePair.scaffoldHint}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-[#8A8F9A] block mb-1">
                Target Mastery Criterion
              </span>
              <p className="text-xs text-[#8A8F9A] font-mono bg-[#0B0C0F] p-2.5 rounded border border-[#1A1D24]">
                {currentScenario.activeBasePair.expectedEvidenceCriterion}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Learner Interaction Sandbox (Attempt / Reflect) */}
        <div className="bg-[#13151A] border border-[#22262F] rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E222A] pb-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-[#4ADE80]" />
                <span className="text-xs font-mono font-bold text-[#E6E4DF]">
                  Learner Sandbox: {BASE_PAIRS_LIST[activeBasePairIndex].learner}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#111A16] text-[#4ADE80] border border-[#1C3527]">
                Active Exploration
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-[#8A8F9A] block">
                Formulate Technical Hypothesis or Operational Decision:
              </label>
              <textarea
                value={learnerInput ?? ""}
                onChange={(e) => setLearnerInput(e.target.value)}
                placeholder="Enter your empirical reasoning or quantitative calculation..."
                rows={4}
                className="w-full bg-[#0D0E11] border border-[#282C37] rounded-lg p-3 text-xs text-[#E6E4DF] focus:outline-none focus:border-[#4ADE80] font-mono leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={handleEvaluateAttempt}
                disabled={!learnerInput.trim()}
                className="flex items-center space-x-1.5 px-4 py-2 rounded bg-[#4ADE80] hover:bg-[#22C55E] disabled:opacity-40 text-[#0D0E11] font-semibold text-xs shadow transition-colors cursor-pointer"
              >
                <span>Submit Formulation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Diagnostic Feedback Display */}
            {feedbackState.diagnosed && (
              <div className={`p-3.5 rounded-lg border ${
                feedbackState.isPass
                  ? "bg-[#111A16] border-[#1C3527] text-[#4ADE80]"
                  : "bg-[#211910] border-[#3D2C1B] text-[#F59E0B]"
              } text-xs space-y-1`}>
                <div className="flex items-center space-x-1.5 font-bold">
                  {feedbackState.isPass ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{feedbackState.isPass ? "Formulation Validated" : "Pedagogical Diagnostic Feedback"}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#D1D5DB]">
                  {feedbackState.feedbackText}
                </p>
              </div>
            )}
          </div>

          {/* Epistemic Hygiene Notice */}
          <div className="pt-3 border-t border-[#1E222A] flex items-center justify-between text-[10px] font-mono text-[#8A8F9A]">
            <span>Doctrine: Active Attempt ≠ Passive Consumption</span>
            <span>Reflective Verification Required</span>
          </div>
        </div>
      </div>
    </div>
  );
};
