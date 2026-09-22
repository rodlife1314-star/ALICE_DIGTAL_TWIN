import React, { useState } from "react";
import {
  Shield,
  HelpCircle,
  FileCheck,
  Search,
  AlertOctagon,
  CheckCircle,
  Plus,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Check
} from "lucide-react";
import { DigitalTwin, PathfinderRecord, PathfinderStage } from "../types";
import { JemmaSubstrateReviewPanel } from "./JemmaSubstrateReviewPanel";

interface GovernanceViewProps {
  twin: DigitalTwin;
  onUpdateTwin: (updatedTwin: DigitalTwin) => void;
}

export function GovernanceView({ twin, onUpdateTwin }: GovernanceViewProps) {
  const [activeGovernanceTab, setActiveGovernanceTab] = useState<"jemma_substrate" | "pathfinder_cycle">("jemma_substrate");
  const [newPfModalOpen, setNewPfModalOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [evidenceText, setEvidenceText] = useState("");
  const [investigation, setInvestigation] = useState("");
  const [challenge, setChallenge] = useState("");
  const [decision, setDecision] = useState("");

  const records = twin.pathfinderRecords || [];

  const handleCreatePathfinderRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !decision) return;

    const newRecord: PathfinderRecord = {
      id: `pf-${Date.now()}`,
      question,
      evidence: evidenceText ? evidenceText.split("\n") : ["Direct sensor observation"],
      investigation: investigation || "Evaluated state dynamics against empirical observations.",
      challenge: challenge || "Verified boundary limits and model constraints.",
      decision,
      commitStatus: "committed",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    const updatedTwin: DigitalTwin = {
      ...twin,
      pathfinderRecords: [newRecord, ...records],
      updatedAt: new Date().toISOString()
    };

    onUpdateTwin(updatedTwin);
    setNewPfModalOpen(false);
    setQuestion("");
    setEvidenceText("");
    setInvestigation("");
    setChallenge("");
    setDecision("");
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 space-y-8 text-[#E6E4DF]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#22252D] pb-5 gap-4">
        <div>
          <div className="text-xs uppercase font-mono tracking-widest text-[#4ADE80] mb-1 font-semibold flex items-center space-x-2">
            <span>PATHFINDER GOVERNANCE & INTEGRITY LAYER</span>
            <span>•</span>
            <span className="text-[#C5A059]">
              {twin.id === "project-sixes-culinary-08" ? "Chef / Operator Authority" : "Sovereign Operator Authority"}
            </span>
          </div>
          <h1 className="text-2xl font-light text-[#E6E4DF] tracking-tight">
            Cognitive Cycle & Human Authority
          </h1>
          <p className="text-xs text-[#8A8F9A] mt-1 max-w-2xl">
            Governed cycle: QUESTION → EVIDENCE → INVESTIGATION → CHALLENGE → DECISION → COMMIT.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-[#14161C] p-1 rounded-lg border border-[#222733] text-xs">
            <button
              onClick={() => setActiveGovernanceTab("jemma_substrate")}
              className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                activeGovernanceTab === "jemma_substrate"
                  ? "bg-[#1E2330] text-[#E6E4DF] shadow-sm font-semibold"
                  : "text-[#8A8F9A] hover:text-[#C8CAD0]"
              }`}
            >
              Jemma Substrate Review & BOE (Ω_safe)
            </button>
            <button
              onClick={() => setActiveGovernanceTab("pathfinder_cycle")}
              className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                activeGovernanceTab === "pathfinder_cycle"
                  ? "bg-[#1E2330] text-[#E6E4DF] shadow-sm font-semibold"
                  : "text-[#8A8F9A] hover:text-[#C8CAD0]"
              }`}
            >
              Pathfinder 6-Stage Records ({records.length})
            </button>
          </div>

          <button
            onClick={() => setNewPfModalOpen(true)}
            className="flex items-center space-x-1.5 bg-[#4ADE80] hover:bg-[#22C55E] text-[#0D0E11] text-xs font-semibold px-4 py-2 rounded shadow transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Query</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Jemma Substrate Review & Bounded Operational Envelope */}
      {activeGovernanceTab === "jemma_substrate" && (
        <JemmaSubstrateReviewPanel />
      )}

      {/* Mode 2: Pathfinder 6-Stage Cycle Records */}
      {activeGovernanceTab === "pathfinder_cycle" && (
        <>
          {/* Pathfinder 6-Stage Visual Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { stage: "QUESTION", desc: "What are we examining?", color: "#509EE3" },
          { stage: "EVIDENCE", desc: "What info is available?", color: "#C5A059" },
          { stage: "INVESTIGATION", desc: "What changes exist?", color: "#A855F7" },
          { stage: "CHALLENGE", desc: "What is uncertain?", color: "#F59E0B" },
          { stage: "DECISION", desc: "What does Operator accept?", color: "#4ADE80" },
          { stage: "COMMIT", desc: "What enters recorded state?", color: "#10B981" }
        ].map((item, i) => (
          <div
            key={item.stage}
            className="bg-[#13151A] border border-[#22262F] rounded p-3 text-center space-y-1 relative"
          >
            <span
              style={{ color: item.color }}
              className="text-[10px] uppercase font-mono font-bold tracking-wider"
            >
              0{i + 1} · {item.stage}
            </span>
            <p className="text-[11px] text-[#8A8F9A] leading-tight">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Pathfinder Records Grid */}
      <div className="space-y-4">
        <span className="text-xs uppercase font-mono tracking-wider text-[#8A8F9A]">
          Active Pathfinder Governed Decisions ({records.length})
        </span>

        <div className="space-y-4">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#1E222A] pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#4ADE80]" />
                  <h3 className="text-base font-medium text-[#E6E4DF]">
                    {rec.question}
                  </h3>
                </div>

                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#111A16] border border-[#1C3527] text-[#4ADE80] font-bold uppercase">
                  {rec.commitStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Evidence & Investigation */}
                <div className="space-y-3">
                  <div className="bg-[#0F1014] border border-[#1E222A] p-3 rounded space-y-1">
                    <span className="text-[10px] uppercase font-mono text-[#C5A059] font-bold">
                      02 · EVIDENCE BOUND
                    </span>
                    <ul className="text-[#A0A4AB] space-y-0.5 list-disc list-inside">
                      {rec.evidence.map((ev, i) => (
                        <li key={i}>{ev}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#0F1014] border border-[#1E222A] p-3 rounded space-y-1">
                    <span className="text-[10px] uppercase font-mono text-[#A855F7] font-bold">
                      03 · INVESTIGATION & CORRELATION
                    </span>
                    <p className="text-[#A0A4AB] leading-relaxed">{rec.investigation}</p>
                  </div>
                </div>

                {/* Challenge & Operator Decision */}
                <div className="space-y-3">
                  <div className="bg-[#0F1014] border border-[#1E222A] p-3 rounded space-y-1">
                    <span className="text-[10px] uppercase font-mono text-[#F59E0B] font-bold">
                      04 · OPERATOR CHALLENGE
                    </span>
                    <p className="text-[#A0A4AB] leading-relaxed">{rec.challenge}</p>
                  </div>

                  <div className="bg-[#111A16] border border-[#1C3527] p-3 rounded space-y-1">
                    <span className="text-[10px] uppercase font-mono text-[#4ADE80] font-bold">
                      05 · OPERATOR APPROVED DECISION
                    </span>
                    <p className="text-[#E6E4DF] font-medium leading-relaxed">{rec.decision}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </>
      )}

      {/* Pathfinder Modal */}
      {newPfModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#13151A] border border-[#2E3442] rounded-lg max-w-lg w-full p-6 space-y-4 text-[#E6E4DF]">
            <div className="border-b border-[#22262F] pb-3">
              <h3 className="text-lg font-medium">New Pathfinder Governed Query</h3>
              <p className="text-xs text-[#8A8F9A]">Run the 6-stage evidence and decision cycle</p>
            </div>

            <form onSubmit={handleCreatePathfinderRecord} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
                  01 · Analytical Question
                </label>
                <input
                  type="text"
                  placeholder="e.g. What is causing thermal buildup in the breeding core?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#4ADE80]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
                  02 · Evidence Available (One per line)
                </label>
                <textarea
                  placeholder="e.g. Airflow dropped from 0.58 to 0.42 m/s&#10;Core temp rose +0.7°C"
                  value={evidenceText}
                  onChange={(e) => setEvidenceText(e.target.value)}
                  className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#4ADE80] h-16 resize-none"
                />
              </div>

              <div>
                <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
                  03 · Investigation & Findings
                </label>
                <textarea
                  placeholder="Describe detected relationships and changes..."
                  value={investigation}
                  onChange={(e) => setInvestigation(e.target.value)}
                  className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#4ADE80] h-16 resize-none"
                />
              </div>

              <div>
                <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
                  04 · Challenge / Uncertainties
                </label>
                <input
                  type="text"
                  placeholder="e.g. Is rise caused by reduced airflow or increased egg metabolism?"
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#4ADE80]"
                />
              </div>

              <div>
                <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
                  05 · Operator Approved Decision
                </label>
                <textarea
                  placeholder="Final decision accepted by the Operator..."
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#4ADE80] h-16 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#22262F]">
                <button
                  type="button"
                  onClick={() => setNewPfModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#8A8F9A] hover:text-[#E6E4DF] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#4ADE80] hover:bg-[#22C55E] text-[#0D0E11] text-xs font-semibold px-4 py-2 rounded shadow transition-colors cursor-pointer"
                >
                  Commit Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
