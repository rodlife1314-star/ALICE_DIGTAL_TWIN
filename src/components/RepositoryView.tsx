import React, { useState } from "react";
import {
  Layers,
  Plus,
  ArrowRight,
  Shield,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Trash2,
  Activity,
  Globe,
  Cpu,
  Music,
  TreeDeciduous,
  Box,
  Compass,
  GitCommit
} from "lucide-react";
import { DigitalTwin, DigitalTwinDomain } from "../types";
import { RepositorySettings } from "./RepositorySettings";

interface RepositoryViewProps {
  twins: DigitalTwin[];
  activeTwinId: string | null;
  onSelectTwin: (id: string) => void;
  onOpenNewTwinModal: () => void;
  onDeleteTwin: (id: string) => void;
}

export function RepositoryView({
  twins,
  activeTwinId,
  onSelectTwin,
  onOpenNewTwinModal,
  onDeleteTwin
}: RepositoryViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");

  const totalTwins = twins.length;
  const requiringReview = twins.filter(
    (t) => t.integrityStatus !== "STABLE" || (t.observations && t.observations.some((o) => !o.isFact))
  ).length;

  const filteredTwins = twins.filter((twin) => {
    const matchesSearch =
      twin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      twin.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      twin.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain =
      selectedDomain === "all" || twin.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  const getDomainIcon = (domain: DigitalTwinDomain) => {
    switch (domain) {
      case "biological":
        return <TreeDeciduous className="w-4 h-4 text-[#509EE3]" />;
      case "engineered":
        return <Cpu className="w-4 h-4 text-[#C5A059]" />;
      case "environmental":
        return <Globe className="w-4 h-4 text-[#4ADE80]" />;
      case "musical":
        return <Music className="w-4 h-4 text-[#F472B6]" />;
      case "physical":
        return <Box className="w-4 h-4 text-[#FB923C]" />;
      default:
        return <Compass className="w-4 h-4 text-[#A0A4AB]" />;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 space-y-8 text-[#E6E4DF]">
      {/* Workspace Header / Landing Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#22252D] pb-6 gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#C5A059] font-mono mb-1 font-semibold">
            DIGITAL TWIN REPOSITORY
          </div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[#E6E4DF]">
            Digital Twin Workspace
          </h1>
          <p className="text-sm text-[#8A8F9A] mt-1 max-w-3xl leading-relaxed">
            A domain-neutral, evidence-governed environment for constructing, observing, simulating and evolving digital duplicates.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenNewTwinModal}
            className="flex items-center space-x-2 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0D0E11] text-xs font-semibold px-4 py-2 rounded shadow transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Twin</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#13151A] border border-[#22262F] rounded p-5 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#8A8F9A] font-mono font-medium">
              Active Digital Twins
            </div>
            <div className="text-3xl font-light text-[#E6E4DF] mt-1 font-mono">
              {totalTwins}
            </div>
            <div className="text-xs text-[#509EE3] mt-1">Ready for observation & simulation</div>
          </div>
          <div className="w-10 h-10 rounded bg-[#181C24] border border-[#2B313E] flex items-center justify-center text-[#509EE3]">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#13151A] border border-[#22262F] rounded p-5 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#8A8F9A] font-mono font-medium">
              Requiring Operator Review
            </div>
            <div className="text-3xl font-light text-[#F59E0B] mt-1 font-mono">
              {requiringReview}
            </div>
            <div className="text-xs text-[#8A8F9A] mt-1">Unresolved constraints or inferences</div>
          </div>
          <div className="w-10 h-10 rounded bg-[#1F1912] border border-[#3D2C1B] flex items-center justify-center text-[#F59E0B]">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#13151A] border border-[#22262F] rounded p-5 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#8A8F9A] font-mono font-medium">
              Governance Status
            </div>
            <div className="text-3xl font-light text-[#4ADE80] mt-1 font-mono">
              GOVERNED
            </div>
            <div className="text-xs text-[#8A8F9A] mt-1">Pathfinder provenance active</div>
          </div>
          <div className="w-10 h-10 rounded bg-[#121E17] border border-[#1C3B29] flex items-center justify-center text-[#4ADE80]">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#111317] border border-[#22252D] rounded p-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#737885]" />
          <input
            type="text"
            placeholder="Search by twin name, purpose, or boundary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] pl-9 pr-3 py-2 rounded focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1 text-xs">
          {["all", "biological", "engineered", "environmental", "musical", "physical"].map(
            (domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`px-3 py-1.5 rounded text-xs capitalize transition-colors cursor-pointer ${
                  selectedDomain === domain
                    ? "bg-[#C5A059] text-[#0D0E11] font-semibold"
                    : "bg-[#181A20] border border-[#2B303C] text-[#8A8F9A] hover:text-[#E6E4DF]"
                }`}
              >
                {domain}
              </button>
            )
          )}
        </div>
      </div>

      {/* Twins Repository List / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTwins.map((twin) => {
          const isSelected = twin.id === activeTwinId;
          return (
            <div
              key={twin.id}
              className={`bg-[#13151A] border rounded p-6 flex flex-col justify-between transition-all space-y-4 ${
                isSelected
                  ? "border-[#C5A059] shadow-lg bg-[#15181F]"
                  : "border-[#22262F] hover:border-[#383E4B]"
              }`}
            >
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded bg-[#181A20] border border-[#2A2E39]">
                      {getDomainIcon(twin.domain)}
                    </span>
                    <span className="text-[11px] uppercase tracking-widest font-mono text-[#8A8F9A] capitalize">
                      {twin.domain} system
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                        twin.integrityStatus === "STABLE"
                          ? "bg-[#111A16] border-[#1C3527] text-[#4ADE80]"
                          : "bg-[#20180F] border-[#3B2815] text-[#F59E0B]"
                      }`}
                    >
                      {twin.integrityStatus}
                    </span>
                  </div>
                </div>

                {/* Title and Description */}
                <div>
                  <h3 className="text-lg font-medium text-[#E6E4DF] tracking-tight">
                    {twin.name}
                  </h3>
                  <p className="text-xs text-[#A0A4AB] mt-1 line-clamp-2 leading-relaxed">
                    {twin.purpose}
                  </p>
                </div>

                {/* Boundary Summary */}
                <div className="bg-[#0F1014] border border-[#1E222A] rounded p-3 space-y-1.5 text-xs">
                  <div className="text-[10px] uppercase font-mono text-[#737885] tracking-wider font-medium">
                    Boundary / Membrane
                  </div>
                  <p className="text-[#A0A4AB] text-xs line-clamp-2">
                    {twin.boundary?.description || "Defined system boundary and membrane limits."}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(twin.boundary?.includedEntities || []).slice(0, 3).map((ent, idx) => (
                      <span
                        key={idx}
                        className="bg-[#181C24] border border-[#262D3B] text-[10px] text-[#8A8F9A] px-2 py-0.5 rounded font-mono"
                      >
                        {ent}
                      </span>
                    ))}
                    {(twin.boundary?.includedEntities || []).length > 3 && (
                      <span className="text-[10px] text-[#737885] font-mono py-0.5">
                        +{(twin.boundary?.includedEntities || []).length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Anatomy Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono py-1">
                  <div className="bg-[#161820] p-2 rounded border border-[#242935]">
                    <div className="text-sm text-[#E6E4DF]">{(twin.entities || []).length}</div>
                    <div className="text-[10px] text-[#737885]">Entities</div>
                  </div>
                  <div className="bg-[#161820] p-2 rounded border border-[#242935]">
                    <div className="text-sm text-[#E6E4DF]">{(twin.observations || []).length}</div>
                    <div className="text-[10px] text-[#737885]">Observations</div>
                  </div>
                  <div className="bg-[#161820] p-2 rounded border border-[#242935]">
                    <div className="text-sm text-[#E6E4DF]">{(twin.simulations || []).length}</div>
                    <div className="text-[10px] text-[#737885]">Simulations</div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-[#1F222B] flex items-center justify-between">
                <span className="text-[10px] text-[#737885] font-mono">
                  Updated {twin.updatedAt.split(" ")[0] || "Today"}
                </span>

                <div className="flex items-center space-x-2">
                  {twins.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Remove twin "${twin.name}"?`)) {
                          onDeleteTwin(twin.id);
                        }
                      }}
                      className="p-1.5 text-[#737885] hover:text-[#EF4444] hover:bg-[#201314] rounded transition-colors cursor-pointer"
                      title="Remove Twin"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => onSelectTwin(twin.id)}
                    className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#C5A059] text-[#0D0E11]"
                        : "bg-[#1C202B] hover:bg-[#282E3E] text-[#E6E4DF] border border-[#2E3545]"
                    }`}
                  >
                    <span>{isSelected ? "Active Twin" : "Enter Twin"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Local Git Repository & Synchronisation Settings Substrate */}
      <div className="pt-6 border-t border-[#22252D]">
        <RepositorySettings />
      </div>
    </div>
  );
}
