import React from "react";
import {
  Layers,
  Activity,
  Plus,
  Shield,
  CheckCircle,
  AlertTriangle,
  Compass,
  Eye,
  GitBranch,
  Cpu,
  Clock,
  Settings,
  HelpCircle
} from "lucide-react";
import { DigitalTwin } from "../types";

export type WorkspaceTab =
  | "repository"
  | "observatory"
  | "overview"
  | "structure"
  | "observation"
  | "simulation"
  | "constraints"
  | "capabilities"
  | "timeline"
  | "governance";

interface HeaderProps {
  twins: DigitalTwin[];
  activeTwinId: string | null;
  activeTab: WorkspaceTab;
  onSelectTwin: (id: string) => void;
  onSelectTab: (tab: WorkspaceTab) => void;
  onOpenNewTwinModal: () => void;
}

export function Header({
  twins,
  activeTwinId,
  activeTab,
  onSelectTwin,
  onSelectTab,
  onOpenNewTwinModal
}: HeaderProps) {
  const activeTwin = twins.find((t) => t.id === activeTwinId) || null;

  return (
    <header className="bg-[#0D0E11] border-b border-[#22252D] text-[#E6E4DF] sticky top-0 z-40">
      {/* Top Bar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand & Active Twin Switcher */}
        <div className="flex items-center space-x-4">
          <div
            onClick={() => onSelectTab("repository")}
            className="flex items-center space-x-2.5 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded bg-[#1A1D24] border border-[#343A46] flex items-center justify-center text-[#C5A059] shadow-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                PATHFINDER
              </div>
              <div className="text-xs font-medium tracking-tight text-[#E6E4DF]">
                Digital Twin Substrate
              </div>
            </div>
          </div>

          <div className="h-5 w-[1px] bg-[#22252D] hidden sm:block" />

          {/* Active Twin Selector */}
          <div className="hidden sm:flex items-center space-x-2 bg-[#14161C] border border-[#262B35] rounded px-3 py-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#737885] font-medium">
              Twin:
            </span>
            <select
              value={activeTwinId || ""}
              onChange={(e) => {
                if (e.target.value === "NEW") {
                  onOpenNewTwinModal();
                } else {
                  onSelectTwin(e.target.value);
                }
              }}
              className="bg-transparent text-xs text-[#E6E4DF] focus:outline-none cursor-pointer font-medium"
            >
              <option value="" disabled className="bg-[#14161C] text-[#8A8F9A]">
                Select Active Twin...
              </option>
              {twins.map((t) => (
                <option key={t.id} value={t.id} className="bg-[#14161C] text-[#E6E4DF]">
                  {t.name} ({t.domain})
                </option>
              ))}
              <option value="NEW" className="bg-[#1A1D24] text-[#C5A059] font-medium">
                + Create New Twin...
              </option>
            </select>
          </div>
        </div>

        {/* System State & Quick Action */}
        <div className="flex items-center space-x-3">
          {activeTwin && (
            <div className="hidden md:flex items-center space-x-2 px-2.5 py-1 rounded bg-[#131720] border border-[#1E2533] text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#509EE3] animate-pulse" />
              <span className="text-[#A0A8B8] font-mono capitalize">{activeTwin.domain} Domain</span>
            </div>
          )}

          {activeTwin && (
            <div
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded border text-[11px] font-mono ${
                activeTwin.integrityStatus === "STABLE"
                  ? "bg-[#111A16] border-[#1C3527] text-[#4ADE80]"
                  : "bg-[#20180F] border-[#3B2815] text-[#F59E0B]"
              }`}
            >
              {activeTwin.integrityStatus === "STABLE" ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <AlertTriangle className="w-3 h-3" />
              )}
              <span>{activeTwin.integrityStatus}</span>
            </div>
          )}

          <button
            onClick={onOpenNewTwinModal}
            className="flex items-center space-x-1.5 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0D0E11] text-xs font-semibold px-3 py-1.5 rounded shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Twin</span>
          </button>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center space-x-1 overflow-x-auto scrollbar-none border-t border-[#1C1F26] text-xs">
        <TabButton
          id="repository"
          label="Repository"
          icon={<Layers className="w-3.5 h-3.5" />}
          active={activeTab === "repository"}
          onClick={() => onSelectTab("repository")}
        />
        <TabButton
          id="observatory"
          label="Twin Observatory (3D)"
          icon={<Eye className="w-3.5 h-3.5 text-[#509EE3]" />}
          active={activeTab === "observatory"}
          onClick={() => onSelectTab("observatory")}
          disabled={!activeTwinId}
        />
        <TabButton
          id="overview"
          label="Overview"
          icon={<Compass className="w-3.5 h-3.5" />}
          active={activeTab === "overview"}
          onClick={() => onSelectTab("overview")}
          disabled={!activeTwinId}
        />
        <TabButton
          id="structure"
          label="Structure"
          icon={<GitBranch className="w-3.5 h-3.5" />}
          active={activeTab === "structure"}
          onClick={() => onSelectTab("structure")}
          disabled={!activeTwinId}
        />
        <TabButton
          id="observation"
          label="Observation"
          icon={<Eye className="w-3.5 h-3.5" />}
          active={activeTab === "observation"}
          onClick={() => onSelectTab("observation")}
          disabled={!activeTwinId}
        />
        <TabButton
          id="simulation"
          label="Simulation"
          icon={<Cpu className="w-3.5 h-3.5" />}
          active={activeTab === "simulation"}
          onClick={() => onSelectTab("simulation")}
          disabled={!activeTwinId}
        />
        <TabButton
          id="constraints"
          label="Constraint Discovery"
          icon={<Compass className="w-3.5 h-3.5" />}
          active={activeTab === "constraints"}
          onClick={() => onSelectTab("constraints")}
          disabled={!activeTwinId}
        />
        <TabButton
          id="capabilities"
          label="Capability Registry"
          icon={<Settings className="w-3.5 h-3.5" />}
          active={activeTab === "capabilities"}
          onClick={() => onSelectTab("capabilities")}
          disabled={!activeTwinId}
        />
        <TabButton
          id="timeline"
          label="Timeline"
          icon={<Clock className="w-3.5 h-3.5" />}
          active={activeTab === "timeline"}
          onClick={() => onSelectTab("timeline")}
          disabled={!activeTwinId}
        />
        <TabButton
          id="governance"
          label="Governance"
          icon={<Shield className="w-3.5 h-3.5" />}
          active={activeTab === "governance"}
          onClick={() => onSelectTab("governance")}
          disabled={!activeTwinId}
        />
      </div>
    </header>
  );
}

function TabButton({
  id,
  label,
  icon,
  active,
  onClick,
  disabled = false
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center space-x-1.5 px-3.5 py-2.5 font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
        active
          ? "border-[#C5A059] text-[#E6E4DF] bg-[#14161C]"
          : disabled
          ? "border-transparent text-[#424754] cursor-not-allowed"
          : "border-transparent text-[#8A8F9A] hover:text-[#C8CAD0] hover:bg-[#12141A]"
      }`}
    >
      <span className={active ? "text-[#C5A059]" : "text-[#737885]"}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
