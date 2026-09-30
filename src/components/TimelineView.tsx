import React, { useState } from "react";
import {
  Clock,
  GitBranch,
  Layers,
  CheckCircle,
  Plus,
  User,
  ArrowRight,
  ShieldCheck,
  FileCode,
  RotateCcw
} from "lucide-react";
import { DigitalTwin, TwinRevision } from "../types";

interface TimelineViewProps {
  twin: DigitalTwin;
  onUpdateTwin: (updatedTwin: DigitalTwin) => void;
}

export function TimelineView({ twin, onUpdateTwin }: TimelineViewProps) {
  const [newRevisionModalOpen, setNewRevisionModalOpen] = useState(false);
  const [revTitle, setRevTitle] = useState("");
  const [revDesc, setRevDesc] = useState("");
  const [revSummary, setRevSummary] = useState("");

  const handleCreateRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revTitle || !revSummary) return;

    const newRev: TwinRevision = {
      id: `rev-${Date.now()}`,
      title: revTitle,
      description: revDesc || "Operator manual revision checkpoint.",
      author: "Operator",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      changeSummary: revSummary
    };

    const updatedTwin: DigitalTwin = {
      ...twin,
      revisions: [newRev, ...twin.revisions],
      updatedAt: new Date().toISOString()
    };

    onUpdateTwin(updatedTwin);
    setNewRevisionModalOpen(false);
    setRevTitle("");
    setRevDesc("");
    setRevSummary("");
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 space-y-8 text-[#E6E4DF]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#22252D] pb-5 gap-4">
        <div>
          <div className="text-xs uppercase font-mono tracking-widest text-[#C5A059] mb-1 font-semibold">
            TIMELINE & REVISION PROVENANCE
          </div>
          <h1 className="text-2xl font-light text-[#E6E4DF] tracking-tight">
            Twin Evolution & Historical Audit Trail
          </h1>
          <p className="text-xs text-[#8A8F9A] mt-1 max-w-2xl">
            Traceable timeline of state transitions, simulation runs, Operator interventions, and saved revisions.
          </p>
        </div>

        <button
          onClick={() => setNewRevisionModalOpen(true)}
          className="flex items-center space-x-1.5 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0D0E11] text-xs font-semibold px-4 py-2 rounded shadow transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Save Revision Checkpoint</span>
        </button>
      </div>

      {/* Main Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Chronological Event Feed (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <span className="text-xs uppercase font-mono tracking-wider text-[#8A8F9A]">
            Chronological Events & Decisions
          </span>

          <div className="relative border-l border-[#262B37] pl-6 space-y-6 ml-3">
            {twin.revisions.map((rev, idx) => (
              <div key={rev.id} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#C5A059] border-2 border-[#0D0E11] ring-4 ring-[#1A1810]" />

                <div className="bg-[#13151A] border border-[#22262F] rounded p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C1810] text-[#C5A059] border border-[#3D341B] uppercase font-bold">
                      REVISION CHECKPOINT #{twin.revisions.length - idx}
                    </span>
                    <span className="text-[10px] font-mono text-[#737885]">
                      {rev.timestamp}
                    </span>
                  </div>

                  <h3 className="text-base font-medium text-[#E6E4DF]">
                    {rev.title}
                  </h3>

                  <p className="text-xs text-[#A0A4AB] leading-relaxed">
                    {rev.description}
                  </p>

                  <div className="pt-2 border-t border-[#1F232D] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#8A8F9A]">Author: {rev.author}</span>
                    <span className="text-[#509EE3]">{rev.changeSummary}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active State History & Provenance Integrity (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-4">
            <div className="border-b border-[#22262F] pb-3">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#C5A059]">
                State Snapshots
              </span>
              <h3 className="text-base font-medium text-[#E6E4DF]">
                Recorded Twin States
              </h3>
            </div>

            <div className="space-y-3">
              {twin.states.map((st) => (
                <div
                  key={st.id}
                  className="bg-[#181A20] border border-[#242A38] rounded p-3 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[#E6E4DF] font-medium">{st.name}</span>
                    {st.active && (
                      <span className="text-[10px] font-mono text-[#4ADE80] bg-[#111A16] px-2 py-0.5 rounded border border-[#1C3527]">
                        ACTIVE STATE
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-[#737885]">
                    {st.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Revision Modal */}
      {newRevisionModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#13151A] border border-[#2E3442] rounded-lg max-w-md w-full p-6 space-y-4 text-[#E6E4DF]">
            <div className="border-b border-[#22262F] pb-3">
              <h3 className="text-lg font-medium">Save Revision Checkpoint</h3>
              <p className="text-xs text-[#8A8F9A]">Commit current twin state to provenance history</p>
            </div>

            <form onSubmit={handleCreateRevision} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
                  Revision Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Boundary Rule Update, Calibrated Heat Capacity"
                  value={revTitle ?? ""}
                  onChange={(e) => setRevTitle(e.target.value)}
                  className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
                  Description
                </label>
                <textarea
                  placeholder="Detailed context regarding changes..."
                  value={revDesc ?? ""}
                  onChange={(e) => setRevDesc(e.target.value)}
                  className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#C5A059] h-20 resize-none"
                />
              </div>

              <div>
                <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
                  Change Summary / Diff
                </label>
                <input
                  type="text"
                  placeholder="e.g. Added 2 membrane rules, updated core temperature"
                  value={revSummary ?? ""}
                  onChange={(e) => setRevSummary(e.target.value)}
                  className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#22262F]">
                <button
                  type="button"
                  onClick={() => setNewRevisionModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#8A8F9A] hover:text-[#E6E4DF] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0D0E11] text-xs font-semibold px-4 py-2 rounded shadow transition-colors cursor-pointer"
                >
                  Commit Revision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
