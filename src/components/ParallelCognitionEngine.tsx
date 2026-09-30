/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Pathfinder Substrate — Parallel Cognition Engine
 * Multi-Branch Specialist Reasoning & Epistemic Convergence
 * 
 * Flow:
 * Input / Evidence
 * → Claudia Decomposition
 * → Parallel Specialist Reasoning:
 *   [Astra (Physics), Orion (Counterfactuals), Simon/OpenAI (Meaning), Deterministic (Kinematics), Jemma (Provenance)]
 * → Jemma Cross-Branch Epistemic Audit (catches INFERRED leakage, causal overclaims, stale frames)
 * → Alice Synthesis & Framing
 * → Octagon Boolean Conjunction (P_source ∧ P_provenance ∧ P_physics ∧ P_safety ∧ P_authority)
 * → Sovereign Operator Authorization
 * → State Commitment → Aether Immutable Ledger
 */

import React, { useState } from "react";
import {
  Cpu,
  Shield,
  GitBranch,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Fingerprint,
  Lock,
  Terminal,
  Activity,
  Zap,
  Layers,
  Clock,
  Radio,
  Database,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Sparkles
} from "lucide-react";
import {
  ParallelBranchReceipt,
  OctagonPredicateConjunction,
  ParallelCognitionSession
} from "../types";

type SimulationScenario = "NOMINAL" | "TWR_COLLAPSE" | "COLD_ELECTROCHEMICAL" | "INFERRED_LEAKAGE" | "STALE_FRAME";

export const ParallelCognitionEngine: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<SimulationScenario>("NOMINAL");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionStep, setExecutionStep] = useState<number>(0);
  // 0: Idle, 1: Claudia Decomposition, 2: Parallel Branches Returned, 3: Jemma Audit, 4: Alice Synthesis, 5: Octagon Conjunction, 6: Operator Gate, 7: Committed
  const [operatorSigned, setOperatorSigned] = useState<boolean>(false);
  const [operatorKey, setOperatorKey] = useState<string>("OP-SOV-ALPHA-909");
  const [branches, setBranches] = useState<ParallelBranchReceipt[]>([]);
  const [jemmaViolations, setJemmaViolations] = useState<string[]>([]);
  const [aetherReceipt, setAetherReceipt] = useState<string | null>(null);

  // Generate the 5 specialist branches based on active scenario
  const generateBranches = (scenario: SimulationScenario): ParallelBranchReceipt[] => {
    const isTwrFailure = scenario === "TWR_COLLAPSE";
    const isColdFailure = scenario === "COLD_ELECTROCHEMICAL";
    const isInferredLeak = scenario === "INFERRED_LEAKAGE";
    const isStale = scenario === "STALE_FRAME";

    return [
      // Branch 1: Electrochemical & Thermal Physics (Astra)
      {
        receiptId: `RCPT-ASTRA-NRG-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        branchId: "BRANCH_ENERGY",
        assignedAgent: "Astra (Electrochemical Physics Engine)",
        hypothesisTitle: "H1: Pack Arrhenius R_int allows 18-min loiter at 38.2°C under 14S load",
        epistemicTier: "DERIVED",
        provenanceHash: "0x8f21e0b...arrhenius-14s",
        executionDurationMs: 142,
        physicalPredicatesSatisfied: !isColdFailure,
        findings: isColdFailure ? [
          "CRITICAL: Pack core temperature -20°C induces exponential internal resistance spike",
          "R_int measured at 24.8 mΩ (nominal threshold <= 5.0 mΩ)",
          "Voltage sag under 80A burst exceeds 42.0V cutoff limit",
          "Physical predicate failure: P_physics(Energy) = FALSE"
        ] : [
          "Pack temperature stable at 38.2°C with active cooling margin",
          "Internal resistance R_int = 3.8 mΩ (well within 5.0 mΩ limit)",
          "Available instant power: 6,420 W exceeds cruise requirement of 3,120 W",
          "Electrochemical predicate satisfied: Arrhenius curve compliant"
        ],
        numericalMetrics: {
          "Pack Temp": isColdFailure ? "-20.0 °C" : "38.2 °C",
          "Internal R_int": isColdFailure ? "24.8 mΩ" : "3.8 mΩ",
          "Voltage Sag": isColdFailure ? "-7.4 V" : "-1.1 V",
          "Power Margin": isColdFailure ? "320 Wh" : "1,420 Wh"
        },
        receiptSignature: "ed25519-sig:astra-energy-valid"
      },

      // Branch 2: Aerodynamics & Kinematics (Astra / Kinematics)
      {
        receiptId: `RCPT-ASTRA-DYN-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        branchId: "BRANCH_DYNAMICS",
        assignedAgent: "Astra (Aerodynamics & Thrust)",
        hypothesisTitle: "H2: Collective rotor thrust (144.2N) maintains TWR >= 1.23 at ISA density alt",
        epistemicTier: "DERIVED",
        provenanceHash: "0x4c99a1f...rotor-isa-alt",
        executionDurationMs: 188,
        physicalPredicatesSatisfied: !isTwrFailure,
        findings: isTwrFailure ? [
          "CRITICAL: Collective thrust collapsed to 2.4 N under active flight regime",
          "Vehicle mass: 12.0 kg requires 117.7 N for steady weight support",
          "Calculated TWR = 0.01 (Absolute threshold >= 1.0)",
          "Physical predicate failure: P_physics(Dynamics) = FALSE"
        ] : [
          "Collective thrust 144.2 N across 6 coaxial rotors at 4,820 RPM",
          "Vehicle weight support: 117.7 N, yielding net TWR = 1.23",
          "ESC thermal margin: 46.8°C (limit 85.0°C)",
          "Aerodynamic lift predicate satisfied: TWR >= 1.0 compliant"
        ],
        numericalMetrics: {
          "Total Thrust": isTwrFailure ? "2.4 N" : "144.2 N",
          "Required Support": "117.7 N",
          "TWR Ratio": isTwrFailure ? "0.01" : "1.23",
          "ESC Peak Temp": "46.8 °C"
        },
        receiptSignature: "ed25519-sig:astra-dyn-valid"
      },

      // Branch 3: Counterfactual & Horizon Reserve (Orion)
      {
        receiptId: `RCPT-ORION-CF-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        branchId: "BRANCH_COUNTERFACTUAL",
        assignedAgent: "Orion (Counterfactual & Failure Horizon)",
        hypothesisTitle: "H3: Instantaneous single-rotor loss at t+15s preserves recovery path to Pad Delta",
        epistemicTier: isInferredLeak ? "INFERRED" : "INFERRED",
        provenanceHash: "0x33b1e9d...orion-mc-envelope",
        executionDurationMs: 235,
        physicalPredicatesSatisfied: true,
        findings: isInferredLeak ? [
          "WARNING: Orion speculative heuristic attempted direct feed to flight control loop",
          "Epistemic violation: INFERRED counterfactual attempted authority bypass",
          "Contamination caught by Jemma cross-branch audit filter"
        ] : [
          "1,000 Monte-Carlo injections: Motor 3 sudden stator short at t+15s",
          "Remaining 5 rotors redistribute yaw torque with 18% differential margin",
          "Glide & powered descent to Pad Delta uses 310 Wh (reserve remaining: 44%)",
          "Safety reserve predicate satisfied: P_safety = TRUE"
        ],
        numericalMetrics: {
          "Simulated Runs": "1,000",
          "Recovery Prob": "99.4%",
          "Pad Delta Reserve": "44.2%",
          "Yaw Saturation": "72%"
        },
        receiptSignature: "ed25519-sig:orion-cf-valid"
      },

      // Branch 4: Simon / OpenAI Advisory Semantic Interpretation
      {
        receiptId: `RCPT-SIMON-SEM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        branchId: "BRANCH_SIMON_REASONING",
        assignedAgent: "Simon / OpenAI Reasoning Rail",
        hypothesisTitle: "H4: Advisory semantic framing of sensor telemetry & boundary departure",
        epistemicTier: "INFERRED",
        provenanceHash: "0x7a2b9c4...simon-openai-bound",
        executionDurationMs: 310,
        physicalPredicatesSatisfied: true,
        findings: [
          "Semantic synthesis: Operational envelope matches nominal altitude loiter profile",
          "Confidence level: HIGH (basis: Concordant physical sensor streams)",
          "Explicit advisory notice: SIMON reasoning carries zero autonomous control authority",
          "Operator question: Confirm whether thermal drift correlates with ambient solar flux"
        ],
        numericalMetrics: {
          "Epistemic Class": "INFERRED",
          "Authority Level": "ADVISORY ONLY",
          "Proportionality": "1.00",
          "Jemma Audit": "COMPLIANT"
        },
        receiptSignature: "ed25519-sig:simon-advisory-valid"
      },

      // Branch 5: Sensor Disagreement & Provenance Ingestion (Jemma)
      {
        receiptId: `RCPT-JEMMA-SENS-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        branchId: "BRANCH_PROVENANCE",
        assignedAgent: "Jemma (Sensor Integrity & Provenance)",
        hypothesisTitle: "H5: BMP390 Baro and RTK GNSS altitude agree within 0.4m; CAN-FD fresh (<2500ms)",
        epistemicTier: "MEASURED",
        provenanceHash: "0x99dd42c...rtk-baro-merkle",
        executionDurationMs: 96,
        physicalPredicatesSatisfied: !isStale,
        findings: isStale ? [
          "CRITICAL: CAN-FD packet latency expired: 3,120 ms (threshold 2,500 ms)",
          "Stale telemetry frame cannot establish physical presence",
          "Source integrity predicate failure: P_source = FALSE"
        ] : [
          "RTK GNSS Carrier Phase Fix: 18 satellites tracked, DOP = 0.8",
          "Barometric vs GNSS altitude agreement: Delta = 0.22 m (threshold <= 0.8 m)",
          "CAN-FD packet latency: 14 ms (threshold <= 2,500 ms)",
          "Provenance source predicate satisfied: P_source = TRUE"
        ],
        numericalMetrics: {
          "Baro vs RTK": "0.22 m",
          "Packet Latency": isStale ? "3,120 ms" : "14 ms",
          "RTK Quality": "FIXED (18 SV)",
          "IMU RMS": "0.04 g"
        },
        receiptSignature: "ed25519-sig:jemma-sens-valid"
      }
    ];
  };

  // Evaluate Octagon Boolean Conjunction
  const evaluateOctagon = (
    scenario: SimulationScenario,
    isSigned: boolean
  ): OctagonPredicateConjunction => {
    const isTwrFailure = scenario === "TWR_COLLAPSE";
    const isColdFailure = scenario === "COLD_ELECTROCHEMICAL";
    const isInferredLeak = scenario === "INFERRED_LEAKAGE";
    const isStale = scenario === "STALE_FRAME";

    const pSource = !isStale;
    const pProvenance = !isInferredLeak;
    const pPhysics = !isTwrFailure && !isColdFailure;
    const pSafety = true;
    const pAuthority = isSigned;

    const overallPass = pSource && pProvenance && pPhysics && pSafety && pAuthority;

    let refusalCode: string | undefined;
    let refusalReason: string | undefined;

    if (!pSource) {
      refusalCode = "OCTAGON_ERR_TELEMETRY_HEARTBEAT_EXPIRED";
      refusalReason = "Telemetry frame stale (>2500ms). Source integrity failed: P_source = FALSE.";
    } else if (!pProvenance) {
      refusalCode = "OCTAGON_ERR_INFERRED_ACTUATOR_INTRUSION";
      refusalReason = "Inferred counterfactual attempted unadmitted authority path: P_provenance = FALSE.";
    } else if (!pPhysics) {
      if (isTwrFailure) {
        refusalCode = "OCTAGON_ERR_PHYSICS_TWR_DEFICIT";
        refusalReason = "Rotor thrust < vehicle weight (TWR = 0.01). Physical laws violated: P_physics = FALSE.";
      } else {
        refusalCode = "OCTAGON_ERR_THERMAL_ELECTROCHEMICAL_SAG";
        refusalReason = "Sub-zero pack temperature (-20°C) induces terminal voltage sag: P_physics = FALSE.";
      }
    } else if (!pSafety) {
      refusalCode = "OCTAGON_ERR_SAFETY_MARGIN_BREACH";
      refusalReason = "Safety reserve envelope compromised: P_safety = FALSE.";
    } else if (!pAuthority) {
      refusalCode = "OCTAGON_AWAITING_OPERATOR_SIGNATURE";
      refusalReason = "All 4 algorithmic predicates satisfied. Awaiting sovereign Operator authorization: P_authority = PENDING.";
    }

    return {
      pSource,
      pProvenance,
      pPhysics,
      pSafety,
      pAuthority,
      overallPass,
      refusalCode,
      refusalReason
    };
  };

  const octagonConjunction = evaluateOctagon(activeScenario, operatorSigned);

  // Execute the parallel workflow pipeline simulation
  const handleRunSimulation = () => {
    setIsRunning(true);
    setExecutionStep(1); // Decomposition
    setOperatorSigned(false);
    setAetherReceipt(null);
    setJemmaViolations([]);

    const newBranches = generateBranches(activeScenario);
    setBranches(newBranches);

    setTimeout(() => {
      setExecutionStep(2); // Branches returned

      setTimeout(() => {
        setExecutionStep(3); // Jemma Audit
        const violations: string[] = [];
        if (activeScenario === "INFERRED_LEAKAGE") {
          violations.push("EPISTEMIC_CONTAMINATION: INFERRED branch attempted direct bypass into authoritative actuator control register.");
        }
        if (activeScenario === "STALE_FRAME") {
          violations.push("PROVENANCE_BREACH: Telemetry packet age exceeds 2,500ms max latency window.");
        }
        setJemmaViolations(violations);

        setTimeout(() => {
          setExecutionStep(4); // Alice Synthesis

          setTimeout(() => {
            setExecutionStep(5); // Octagon Conjunction
            setIsRunning(false);
          }, 400);
        }, 400);
      }, 400);
    }, 500);
  };

  const handleSovereignSign = () => {
    if (!operatorKey) return;
    setOperatorSigned(true);
    setExecutionStep(6); // Operator Authorized

    // Write Aether ledger receipt
    const seed = `AETHER-${activeScenario}-${operatorKey}-${Date.now()}`;
    const hash = "0x" + Array.from({ length: 64 }, (_, i) => 
      ((i * 23 + seed.charCodeAt(i % seed.length)) % 16).toString(16)
    ).join("");
    setAetherReceipt(hash);
  };

  const handleReset = () => {
    setExecutionStep(0);
    setOperatorSigned(false);
    setBranches([]);
    setJemmaViolations([]);
    setAetherReceipt(null);
  };

  return (
    <div className="bg-[#0D0E11] p-6 rounded-2xl border border-[#22252D] text-[#E6E4DF] space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-[#22252D] gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#251D33] border border-[#483766] rounded-xl flex items-center justify-center text-[#C084FC] shadow-sm">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-medium tracking-tight text-[#E6E4DF]">
                Parallel Cognition Engine
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#251D33] text-[#C084FC] border border-[#483766] uppercase">
                Convergence Architecture
              </span>
            </div>
            <p className="text-xs text-[#8A8F9A] mt-0.5">
              Input → Claudia Decomposition → Parallel Specialists (Astra, Orion, Simon/OpenAI, Kinematics, Jemma) → Jemma Epistemic Audit → Alice Synthesis → Octagon Conjunction → Operator Authority → Aether Ledger.
            </p>
          </div>
        </div>

        {/* Scenario Selector & Run Control */}
        <div className="flex items-center space-x-3">
          <select
            value={activeScenario ?? "NOMINAL"}
            onChange={(e) => {
              setActiveScenario(e.target.value as SimulationScenario);
              setExecutionStep(0);
              setOperatorSigned(false);
              setAetherReceipt(null);
            }}
            className="bg-[#14161C] border border-[#282C37] rounded-lg px-3 py-1.5 text-xs text-[#E6E4DF] focus:outline-none"
          >
            <option value="NOMINAL">Nominal Flight Loiter (All Predicates Valid)</option>
            <option value="TWR_COLLAPSE">Adversarial: Thrust-to-Weight Ratio Collapse</option>
            <option value="COLD_ELECTROCHEMICAL">Adversarial: Sub-Zero Thermal Battery Sag</option>
            <option value="INFERRED_LEAKAGE">Adversarial: Inferred Heuristic Actuator Intrusion</option>
            <option value="STALE_FRAME">Adversarial: Stale CAN-FD Telemetry Frame (&gt;2.5s)</option>
          </select>

          <button
            onClick={handleRunSimulation}
            disabled={isRunning}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded bg-[#C084FC] hover:bg-[#D8B4FE] disabled:opacity-40 text-[#0D0E11] text-xs font-semibold shadow transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? "Simulating..." : "Execute Pipeline"}</span>
          </button>

          <button
            onClick={handleReset}
            title="Reset"
            className="p-1.5 rounded bg-[#181B22] hover:bg-[#20252F] text-[#8A8F9A] hover:text-[#E6E4DF] transition-colors border border-[#292E3B] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cognitive Pipeline Flow Visualization */}
      <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-xs">
        {[
          { step: 1, title: "01 · Claudia Decompose", desc: "Split problem into specialist domains" },
          { step: 2, title: "02 · Parallel Branches", desc: "5 concurrent specialist engines" },
          { step: 3, title: "03 · Jemma Audit", desc: "Cross-branch contamination check" },
          { step: 4, title: "04 · Alice Synthesis", desc: "Frames operational trade-offs" },
          { step: 5, title: "05 · Octagon Gate", desc: "Boolean conjunction evaluation" },
          { step: 6, title: "06 · Operator Gate", desc: "Sovereign signature validation" },
          { step: 7, title: "07 · Aether Ledger", desc: "Append-only cryptographic receipt" }
        ].map(item => {
          const isActive = executionStep === item.step;
          const isDone = executionStep > item.step;
          let color = "bg-[#14161C] border-[#22262F] text-[#6A707E]";
          if (isDone) color = "bg-[#111A16] border-[#1C3527] text-[#4ADE80]";
          else if (isActive) color = "bg-[#251D33] border-[#7E5BAA] text-[#C084FC] ring-1 ring-[#C084FC]/50";

          return (
            <div key={item.step} className={`p-2.5 rounded border ${color} transition-all space-y-1`}>
              <span className="text-[10px] font-mono font-bold block">{item.title}</span>
              <span className="text-[9px] text-[#A0A4AB] leading-tight block truncate">{item.desc}</span>
            </div>
          );
        })}
      </div>

      {/* 5 Parallel Specialist Branch Receipts */}
      {branches.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-wider text-[#8A8F9A] flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#C084FC]" />
              <span>Parallel Specialist Branch Receipts ({branches.length})</span>
            </span>
            <span className="text-[10px] font-mono text-[#A0A4AB]">
              Epistemic Isolation Strictly Maintained
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {branches.map(branch => {
              const satisfiesPhysics = branch.physicalPredicatesSatisfied;
              return (
                <div
                  key={branch.receiptId}
                  className={`bg-[#13151A] border rounded-xl p-4 space-y-3 ${
                    satisfiesPhysics ? "border-[#22262F]" : "border-[#451A1D] bg-[#161012]"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-[#1E222A] pb-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#C084FC]">
                        {branch.assignedAgent.split("(")[0]}
                      </span>
                      <p className="text-[11px] font-mono text-[#8A8F9A] truncate max-w-[200px]">
                        {branch.assignedAgent.split("(")[1]?.replace(")", "")}
                      </p>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      branch.epistemicTier === "MEASURED"
                        ? "bg-[#111A16] text-[#4ADE80] border border-[#1C3527]"
                        : branch.epistemicTier === "DERIVED"
                        ? "bg-[#161B26] text-[#509EE3] border border-[#2B354A]"
                        : "bg-[#251D33] text-[#C084FC] border border-[#483766]"
                    }`}>
                      {branch.epistemicTier}
                    </span>
                  </div>

                  <p className="text-xs text-[#E6E4DF] font-medium leading-snug">
                    {branch.hypothesisTitle}
                  </p>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono text-[#8A8F9A]">Key Findings</span>
                    <ul className="text-[11px] space-y-1 text-[#A0A4AB]">
                      {branch.findings.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <span className={f.startsWith("CRITICAL") || f.startsWith("WARNING") ? "text-[#F87171]" : "text-[#4ADE80]"}>•</span>
                          <span className="leading-tight">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-[#1E222A] text-[10px] font-mono">
                    {Object.entries(branch.numericalMetrics).map(([k, v]) => (
                      <div key={k} className="bg-[#0D0E11] px-2 py-1 rounded">
                        <span className="text-[#8A8F9A] block truncate">{k}</span>
                        <span className="text-[#E6E4DF] font-semibold">{v}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#6A707E] pt-1">
                    <span className="truncate max-w-[140px]">{branch.provenanceHash}</span>
                    <span>{branch.executionDurationMs}ms</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Jemma Cross-Branch Epistemic Audit Section */}
      {executionStep >= 3 && (
        <div className={`p-4 rounded-xl border ${
          jemmaViolations.length === 0
            ? "bg-[#111A16] border-[#1C3527]"
            : "bg-[#251214] border-[#451A1D]"
        } space-y-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldAlert className={`w-4 h-4 ${jemmaViolations.length === 0 ? "text-[#4ADE80]" : "text-[#F87171]"}`} />
              <span className="text-xs font-mono font-bold text-[#E6E4DF]">
                Jemma Cross-Branch Epistemic Audit
              </span>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
              jemmaViolations.length === 0
                ? "bg-[#132219] text-[#4ADE80] border border-[#234A31]"
                : "bg-[#3B1518] text-[#F87171] border border-[#5E2227]"
            }`}>
              {jemmaViolations.length === 0 ? "AUDIT PASS: ZERO CONTAMINATION" : "AUDIT REJECTION: INVARIANT BREACH"}
            </span>
          </div>

          {jemmaViolations.length === 0 ? (
            <p className="text-xs text-[#A0A4AB]">
              All 5 branches verified. No unlabelled inferences leaked into actuator control. Simon reasoning confirmed purely advisory. Provenance hashes bound to physical sensors.
            </p>
          ) : (
            <div className="space-y-1.5 text-xs text-[#FCA5A5]">
              {jemmaViolations.map((v, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <span>⚠</span>
                  <span className="font-mono">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Octagon Conjunction & Operator Authority */}
      {executionStep >= 5 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Octagon Predicate Conjunction Card */}
          <div className="lg:col-span-2 bg-[#13151A] border border-[#22262F] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#E6E4DF] flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#509EE3]" />
                <span>Octagon Conjunction Gate (P_source ∧ P_provenance ∧ P_physics ∧ P_safety ∧ P_authority)</span>
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                octagonConjunction.overallPass
                  ? "bg-[#111A16] text-[#4ADE80] border border-[#1C3527]"
                  : "bg-[#251214] text-[#F87171] border border-[#451A1D]"
              }`}>
                {octagonConjunction.overallPass ? "ALL PREDICATES SATISFIED" : octagonConjunction.refusalCode || "CONJUNCTION REFUSAL"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className={`p-2 rounded border ${octagonConjunction.pSource ? "bg-[#111A16] border-[#1C3527]" : "bg-[#251214] border-[#451A1D]"}`}>
                <span className="text-[10px] font-mono font-bold block">P_source</span>
                <span className="text-[11px] text-[#A0A4AB]">{octagonConjunction.pSource ? "PASS: Fresh" : "FAIL: Stale"}</span>
              </div>
              <div className={`p-2 rounded border ${octagonConjunction.pProvenance ? "bg-[#111A16] border-[#1C3527]" : "bg-[#251214] border-[#451A1D]"}`}>
                <span className="text-[10px] font-mono font-bold block">P_provenance</span>
                <span className="text-[11px] text-[#A0A4AB]">{octagonConjunction.pProvenance ? "PASS: Bound" : "FAIL: Heuristic"}</span>
              </div>
              <div className={`p-2 rounded border ${octagonConjunction.pPhysics ? "bg-[#111A16] border-[#1C3527]" : "bg-[#251214] border-[#451A1D]"}`}>
                <span className="text-[10px] font-mono font-bold block">P_physics</span>
                <span className="text-[11px] text-[#A0A4AB]">{octagonConjunction.pPhysics ? "PASS: Valid" : "FAIL: Breach"}</span>
              </div>
              <div className={`p-2 rounded border ${octagonConjunction.pSafety ? "bg-[#111A16] border-[#1C3527]" : "bg-[#251214] border-[#451A1D]"}`}>
                <span className="text-[10px] font-mono font-bold block">P_safety</span>
                <span className="text-[11px] text-[#A0A4AB]">{octagonConjunction.pSafety ? "PASS: Margin" : "FAIL: Deficit"}</span>
              </div>
              <div className={`p-2 rounded border ${octagonConjunction.pAuthority ? "bg-[#111A16] border-[#1C3527]" : "bg-[#241B0E] border-[#483315]"}`}>
                <span className="text-[10px] font-mono font-bold block">P_authority</span>
                <span className="text-[11px] text-[#A0A4AB]">{octagonConjunction.pAuthority ? "PASS: Signed" : "PENDING"}</span>
              </div>
            </div>

            {octagonConjunction.refusalReason && (
              <p className="text-xs text-[#FCA5A5] bg-[#1E1113] p-2.5 rounded border border-[#3E1A1E]">
                {octagonConjunction.refusalReason}
              </p>
            )}
          </div>

          {/* Sovereign Operator Authority Card */}
          <div className="bg-[#141A16] border border-[#1C3527] rounded-xl p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-[#4ADE80]" />
                <h4 className="text-sm font-semibold text-[#E6E4DF]">Sovereign Operator</h4>
              </div>
              <p className="text-xs text-[#A0A4AB]">
                Acceleration ≠ Authority. State transitions require explicit cryptographic operator signature.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-mono text-[#8A8F9A] block mb-1">
                  Operator Signature Key
                </label>
                <input
                  type="text"
                  value={operatorKey ?? ""}
                  onChange={(e) => setOperatorKey(e.target.value)}
                  className="w-full bg-[#0D0E11] border border-[#282C37] rounded px-3 py-1.5 font-mono text-xs text-[#4ADE80] focus:outline-none"
                />
              </div>

              <button
                onClick={handleSovereignSign}
                disabled={operatorSigned || !octagonConjunction.pSource || !octagonConjunction.pProvenance || !octagonConjunction.pPhysics}
                className="w-full py-2 rounded bg-[#4ADE80] hover:bg-[#22C55E] disabled:opacity-40 text-[#0D0E11] font-semibold text-xs shadow transition-colors cursor-pointer"
              >
                {operatorSigned ? "Authorized & Sealed" : "Sign & Authorize State Commit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Aether Ledger Receipt Banner */}
      {aetherReceipt && (
        <div className="bg-[#0F1219] border border-[#1E2638] p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#509EE3] flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>Aether Immutable Ledger Receipt (Commit Recorded)</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161B26] text-[#509EE3] border border-[#2B354A]">
              SHA-256 HASH CHAIN SEALED
            </span>
          </div>
          <p className="text-xs font-mono text-[#A0A4AB] break-all bg-[#090A0E] p-2.5 rounded border border-[#1A1E29]">
            {aetherReceipt}
          </p>
        </div>
      )}
    </div>
  );
};
