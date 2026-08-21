import React, { useState } from "react";
import {
  Eye,
  Plus,
  FileText,
  Database,
  CheckCircle,
  HelpCircle,
  Search,
  Filter,
  Trash2,
  Paperclip,
  Clock,
  ShieldAlert
} from "lucide-react";
import { DigitalTwin, Observation, SourceAsset } from "../types";

interface ObservationViewProps {
  twin: DigitalTwin;
  onUpdateTwin: (updatedTwin: DigitalTwin) => void;
}

export function ObservationView({ twin, onUpdateTwin }: ObservationViewProps) {
  const [filterType, setFilterType] = useState<"all" | "facts" | "inferences">("all");
  const [newObsModalOpen, setNewObsModalOpen] = useState(false);

  const [newFactText, setNewFactText] = useState("");
  const [newValueText, setNewValueText] = useState("");
  const [newIsFact, setNewIsFact] = useState<boolean>(true);
  const [newQuality, setNewQuality] = useState<Observation["quality"]>("measured");

  const filteredObservations = twin.observations.filter((obs) => {
    if (filterType === "facts") return obs.isFact;
    if (filterType === "inferences") return !obs.isFact;
    return true;
  });

  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFactText || !newValueText) return;

    const newObs: Observation = {
      id: `obs-${Date.now()}`,
      fact: newFactText,
      value: newValueText,
      isFact: newIsFact,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      quality: newQuality
    };

    const updatedTwin: DigitalTwin = {
      ...twin,
      observations: [newObs, ...twin.observations],
      updatedAt: new Date().toISOString()
    };

    onUpdateTwin(updatedTwin);
    setNewObsModalOpen(false);
    setNewFactText("");
    setNewValueText("");
  };

  const handleDeleteObservation = (id: string) => {
    const updatedObs = twin.observations.filter((o) => o.id !== id);
    onUpdateTwin({
      ...twin,
      observations: updatedObs,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 space-y-8 text-[#E6E4DF]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#22252D] pb-5 gap-4">
        <div>
          <div className="text-xs uppercase font-mono tracking-widest text-[#509EE3] mb-1 font-semibold">
            OBSERVATION & EVIDENCE LEDGER
          </div>
          <h1 className="text-2xl font-light text-[#E6E4DF] tracking-tight">
            Measured Facts vs. Inferred Claims
          </h1>
          <p className="text-xs text-[#8A8F9A] mt-1 max-w-2xl">
            Strict separation of empirical sensor measurements from unverified model inferences.
          </p>
        </div>

        <button
          onClick={() => setNewObsModalOpen(true)}
          className="flex items-center space-x-1.5 bg-[#509EE3] hover:bg-[#3B82F6] text-[#0D0E11] text-xs font-semibold px-4 py-2 rounded shadow transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record Observation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Fact vs Inference Ledger (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filter Pills */}
          <div className="flex items-center justify-between bg-[#111317] border border-[#22252D] p-3 rounded text-xs">
            <span className="text-[#8A8F9A] font-mono">
              Showing {filteredObservations.length} of {twin.observations.length} observations
            </span>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  filterType === "all"
                    ? "bg-[#282E3E] text-[#E6E4DF]"
                    : "text-[#8A8F9A] hover:text-[#E6E4DF]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType("facts")}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  filterType === "facts"
                    ? "bg-[#111A16] text-[#4ADE80] border border-[#1C3527]"
                    : "text-[#8A8F9A] hover:text-[#E6E4DF]"
                }`}
              >
                Measured Facts
              </button>
              <button
                onClick={() => setFilterType("inferences")}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  filterType === "inferences"
                    ? "bg-[#20180F] text-[#F59E0B] border border-[#3B2815]"
                    : "text-[#8A8F9A] hover:text-[#E6E4DF]"
                }`}
              >
                Inferences
              </button>
            </div>
          </div>

          {/* Observations List */}
          <div className="space-y-3">
            {filteredObservations.map((obs) => (
              <div
                key={obs.id}
                className="bg-[#13151A] border border-[#22262F] rounded p-4 space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border uppercase ${
                        obs.isFact
                          ? "bg-[#111A16] border-[#1C3527] text-[#4ADE80]"
                          : "bg-[#20180F] border-[#3B2815] text-[#F59E0B]"
                      }`}
                    >
                      {obs.isFact ? "EMPIRICAL FACT" : "INFERRED CLAIM"}
                    </span>

                    {obs.quality && (
                      <span className="text-[10px] text-[#737885] font-mono bg-[#181A20] px-2 py-0.5 rounded border border-[#242935] capitalize">
                        Quality: {obs.quality}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 text-[11px] text-[#737885] font-mono">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{obs.timestamp}</span>
                    </span>

                    <button
                      onClick={() => handleDeleteObservation(obs.id)}
                      className="hover:text-[#EF4444] transition-colors cursor-pointer"
                      title="Delete observation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-[#E6E4DF] leading-relaxed font-light">
                  {obs.fact}
                </p>

                <div className="pt-2 border-t border-[#1F232D] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#8A8F9A]">Value / Reading:</span>
                  <span className="text-[#509EE3] font-semibold">{obs.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Source Assets & Telemetry Feeds (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-4">
            <div className="border-b border-[#22262F] pb-3">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#C5A059]">
                Evidence Provenance
              </span>
              <h3 className="text-base font-medium text-[#E6E4DF]">
                Source Assets Register
              </h3>
              <p className="text-xs text-[#8A8F9A]">
                Imported files, sensor telemetry, and 3D geometries
              </p>
            </div>

            <div className="space-y-3">
              {twin.sourceAssets && twin.sourceAssets.length > 0 ? (
                twin.sourceAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="bg-[#181A20] border border-[#252B38] rounded p-3 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-[#E6E4DF] font-medium">
                        <Paperclip className="w-3.5 h-3.5 text-[#509EE3]" />
                        <span className="truncate max-w-[180px]">{asset.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#737885]">
                        {asset.size}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#737885] font-mono">
                      <span className="capitalize">Type: {asset.type}</span>
                      <span>{asset.timestamp}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#8A8F9A] text-center py-4">No source assets registered.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Record Observation Modal */}
      {newObsModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#13151A] border border-[#2E3442] rounded-lg max-w-md w-full p-6 space-y-4 text-[#E6E4DF]">
            <div className="border-b border-[#22262F] pb-3">
              <h3 className="text-lg font-medium">Record Evidence Observation</h3>
              <p className="text-xs text-[#8A8F9A]">Add an empirical fact or inferred claim</p>
            </div>

            <form onSubmit={handleAddObservation} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
                  Observation Statement / Fact
                </label>
                <textarea
                  placeholder="Describe the measured phenomenon or observation..."
                  value={newFactText}
                  onChange={(e) => setNewFactText(e.target.value)}
                  className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#509EE3] h-20 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
                  Measured Value / Metric Reading
                </label>
                <input
                  type="text"
                  placeholder="e.g. 29.8°C, 0.42 m/s, 98.7% rejection"
                  value={newValueText}
                  onChange={(e) => setNewValueText(e.target.value)}
                  className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#509EE3]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
                    Category
                  </label>
                  <select
                    value={newIsFact ? "fact" : "inference"}
                    onChange={(e) => setNewIsFact(e.target.value === "fact")}
                    className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#509EE3]"
                  >
                    <option value="fact">Empirical Fact (Measured)</option>
                    <option value="inference">Inferred Claim (Assumption)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
                    Quality Level
                  </label>
                  <select
                    value={newQuality}
                    onChange={(e) => setNewQuality(e.target.value as Observation["quality"])}
                    className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#509EE3]"
                  >
                    <option value="measured">Measured (Direct Lab/Field)</option>
                    <option value="sensor">Sensor Feed (Telemetry)</option>
                    <option value="inferred">Inferred (Calculated)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#22262F]">
                <button
                  type="button"
                  onClick={() => setNewObsModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#8A8F9A] hover:text-[#E6E4DF] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#509EE3] hover:bg-[#3B82F6] text-[#0D0E11] text-xs font-semibold px-4 py-2 rounded shadow transition-colors cursor-pointer"
                >
                  Commit Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
