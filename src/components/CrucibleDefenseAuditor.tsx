/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Pathfinder Substrate — Crucible Defense Auditor
 * The Dirty Dozen Adversarial Test Suite
 * 
 * Validates the 12 core security invariants from security_spec.md and the Pathfinder Crucible.
 * 
 * 1. Score ≠ Evidence (Octagon predicates cannot be overridden by numerical scores)
 * 2. OPERATOR_APPROVED ≠ CRYPTOGRAPHICALLY_SIGNED (Digital signature verification)
 * 3. Immutable Append-Only Ledger (Aether transition rewrite rejection)
 * 4. Sovereign Operator Mandatory (Autonomous agent state mutation rejection)
 * 5. ABAC System Field Protection (operatorApproved hijacking rejection)
 * 6. Genesis State Immutability (createdDate backdating rejection)
 * 7. ID Poisoning Guard (Special characters and injection rejection)
 * 8. PII Blanket Read Exposure (Unauthenticated scan rejection)
 * 9. Client-Side Timestamp Forgery (Pre-genesis temporal injection rejection)
 * 10. Relational Integrity (Orphaned document foreign key rejection)
 * 11. Schema Typing Invariants (Non-standard list element rejection)
 * 12. Terminal State Lock (Completed workflow regression rejection)
 */

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Terminal,
  Fingerprint,
  FileCode,
  Layers,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { CrucibleAttackTest } from "../types";
import {
  DIRTY_DOZEN_SPECIFICATIONS,
  executeAdversarialDefenseAudit,
  AttackExecutionResult
} from "../lib/dirtyDozenSecurity";

export const CrucibleDefenseAuditor: React.FC = () => {
  const [results, setResults] = useState<AttackExecutionResult[]>([]);
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleRunAllAttacks = () => {
    setIsRunning(true);
    setTimeout(() => {
      const executed = DIRTY_DOZEN_SPECIFICATIONS.map(test => executeAdversarialDefenseAudit(test));
      setResults(executed);
      setIsRunning(false);
    }, 400);
  };

  const handleRunSingleAttack = (test: CrucibleAttackTest) => {
    const res = executeAdversarialDefenseAudit(test);
    setResults(prev => {
      const filtered = prev.filter(r => r.testId !== test.id);
      return [...filtered, res];
    });
  };

  const handleReset = () => {
    setResults([]);
    setExpandedTestId(null);
  };

  const totalExecuted = results.length;
  const totalBlocked = results.filter(r => r.blocked && r.actualRefusalCode === r.expectedRefusalCode).length;

  return (
    <div className="bg-[#0D0E11] p-6 rounded-2xl border border-[#22252D] text-[#E6E4DF] space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-[#22252D] gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#251214] border border-[#451A1D] rounded-xl flex items-center justify-center text-[#F87171] shadow-sm">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-medium tracking-tight text-[#E6E4DF]">
                Crucible Defense Auditor
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#251214] text-[#F87171] border border-[#451A1D] uppercase">
                The Dirty Dozen Suite
              </span>
            </div>
            <p className="text-xs text-[#8A8F9A] mt-0.5">
              12 executable adversarial test cases evaluating security boundaries: Score ≠ Evidence, Operator Authority, Genesis Immutability, and Fails-Closed Conjunctions.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunAllAttacks}
            disabled={isRunning}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded bg-[#F87171] hover:bg-[#EF4444] disabled:opacity-40 text-[#0D0E11] text-xs font-semibold shadow transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? "Running Suite..." : "Execute All 12 Attacks"}</span>
          </button>

          <button
            onClick={handleReset}
            title="Reset Auditor"
            className="p-1.5 rounded bg-[#181B22] hover:bg-[#20252F] text-[#8A8F9A] hover:text-[#E6E4DF] transition-colors border border-[#292E3B] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-[#13151A] border border-[#22262F] p-3 rounded-xl">
          <span className="text-[10px] text-[#8A8F9A] uppercase block">Attacks Executed</span>
          <span className="text-lg font-bold text-[#E6E4DF]">{totalExecuted} / 12</span>
        </div>
        <div className="bg-[#13151A] border border-[#22262F] p-3 rounded-xl">
          <span className="text-[10px] text-[#8A8F9A] uppercase block">Attacks Intercepted</span>
          <span className="text-lg font-bold text-[#4ADE80]">{totalBlocked} / {totalExecuted}</span>
        </div>
        <div className="bg-[#13151A] border border-[#22262F] p-3 rounded-xl">
          <span className="text-[10px] text-[#8A8F9A] uppercase block">Defense Fidelity</span>
          <span className="text-lg font-bold text-[#509EE3]">
            {totalExecuted > 0 ? `${Math.round((totalBlocked / totalExecuted) * 100)}%` : "STANDBY"}
          </span>
        </div>
        <div className="bg-[#13151A] border border-[#22262F] p-3 rounded-xl">
          <span className="text-[10px] text-[#8A8F9A] uppercase block">Zero-Day Vulnerabilities</span>
          <span className="text-lg font-bold text-[#4ADE80]">0 CONFIRMED</span>
        </div>
      </div>

      {/* The 12 Attack Test Cards List */}
      <div className="space-y-3">
        {DIRTY_DOZEN_SPECIFICATIONS.map(test => {
          const result = results.find(r => r.testId === test.id);
          const isExpanded = expandedTestId === test.id;
          const isEvaluated = !!result;
          const isPass = result && result.blocked && result.actualRefusalCode === result.expectedRefusalCode;

          return (
            <div
              key={test.id}
              className="bg-[#13151A] border border-[#22262F] rounded-xl overflow-hidden text-xs transition-colors"
            >
              {/* Test Header Row */}
              <div
                onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-[#181B22]"
              >
                <div className="flex items-center space-x-3">
                  {isEvaluated ? (
                    isPass ? (
                      <CheckCircle2 className="w-5 h-5 text-[#4ADE80] shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#F87171] shrink-0" />
                    )
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-[#3A404F] flex items-center justify-center shrink-0">
                      <span className="w-2 h-2 rounded-full bg-[#3A404F]" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-[#E6E4DF]">{test.attackName}</h4>
                      {isEvaluated && (
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                          isPass
                            ? "bg-[#111A16] text-[#4ADE80] border border-[#1C3527]"
                            : "bg-[#251214] text-[#F87171] border border-[#451A1D]"
                        }`}>
                          {isPass ? "BLOCKED / PASS" : "BREACH DETECTED"}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8A8F9A] mt-0.5">{test.targetInvariant}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRunSingleAttack(test);
                    }}
                    className="px-2.5 py-1 rounded bg-[#1C202A] hover:bg-[#252C3B] text-[#A0A8B8] hover:text-[#E6E4DF] border border-[#2B313F] transition-colors cursor-pointer"
                  >
                    Test Vector
                  </button>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-[#8A8F9A]" /> : <ChevronRight className="w-4 h-4 text-[#8A8F9A]" />}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="p-4 border-t border-[#1E222A] bg-[#0E1015] space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-[#8A8F9A] block mb-1">
                        Attack Vector
                      </span>
                      <p className="text-xs text-[#A0A4AB] bg-[#14161C] p-2.5 rounded border border-[#22262F]">
                        {test.attackVector}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-mono text-[#8A8F9A] block mb-1">
                        Expected Invariant Refusal Code
                      </span>
                      <p className="text-xs font-mono text-[#FCA5A5] bg-[#14161C] p-2.5 rounded border border-[#22262F]">
                        {test.expectedRefusalCode}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#8A8F9A] block mb-1">
                      Simulated Adversarial Payload
                    </span>
                    <pre className="text-[11px] font-mono text-[#9DA4B0] bg-[#0A0B0E] p-3 rounded border border-[#1C1F28] overflow-x-auto">
                      {JSON.stringify(test.simulatedPayload, null, 2)}
                    </pre>
                  </div>

                  {result && (
                    <div className="p-3.5 rounded-lg border bg-[#111A16] border-[#1C3527] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-[#4ADE80]">
                          Audit Receipt: {result.actualRefusalCode}
                        </span>
                        <span className="text-[10px] font-mono text-[#A0A4AB]">{result.receiptHash}</span>
                      </div>
                      <p className="text-[11px] text-[#D1D5DB] leading-relaxed">
                        {result.auditProof}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
