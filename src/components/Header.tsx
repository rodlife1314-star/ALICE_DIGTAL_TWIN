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
  HelpCircle,
  Cloud,
  LogIn,
  LogOut,
  User as UserIcon,
  Loader2,
  Box,
  Radio,
  Sliders,
  ShieldCheck,
  Flame,
  FileCheck,
  Zap,
  BookOpen
} from "lucide-react";
import { User } from "firebase/auth";
import { DigitalTwin } from "../types";

export type WorkspaceTab =
  | "repository"
  | "observatory"
  | "cockpit_seat"
  | "overview"
  | "structure"
  | "observation"
  | "simulation"
  | "geometry"
  | "envelope"
  | "constraints"
  | "capabilities"
  | "compute"
  | "timeline"
  | "governance"
  // Alice Vessel Modules
  | "vessel_operator"
  | "vessel_engine"
  | "vessel_ccv01"
  | "vessel_cavity"
  | "vessel_transport"
  // Pathfinder Cognition Modules
  | "cognition_jemma"
  | "cognition_octagon"
  | "cognition_delta"
  | "cognition_simon";

interface HeaderProps {
  twins: DigitalTwin[];
  activeTwinId: string | null;
  activeTab: WorkspaceTab;
  onSelectTwin: (id: string) => void;
  onSelectTab: (tab: WorkspaceTab) => void;
  onOpenNewTwinModal: () => void;
  user?: User | null;
  onLogin?: () => void;
  onLogout?: () => void;
  isCloudConnected?: boolean;
  isSigningIn?: boolean;
}

export function Header({
  twins,
  activeTwinId,
  activeTab,
  onSelectTwin,
  onSelectTab,
  onOpenNewTwinModal,
  user,
  onLogin,
  onLogout,
  isCloudConnected = true,
  isSigningIn = false
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
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Firebase Cloud Sync Status */}
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-[#10141D] border border-[#1C2536] text-[11px] font-mono">
            <Cloud className={`w-3.5 h-3.5 ${isCloudConnected ? "text-[#4ADE80]" : "text-[#F59E0B]"}`} />
            <span className="hidden lg:inline text-[#8A8F9A]">Firestore:</span>
            <span className={isCloudConnected ? "text-[#4ADE80] font-semibold" : "text-[#F59E0B]"}>
              {isCloudConnected ? "Live" : "Offline"}
            </span>
          </div>

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

          {/* User Auth Control */}
          {user ? (
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded bg-[#14171F] border border-[#22252D] text-xs">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "Operator"}
                  className="w-5 h-5 rounded-full border border-[#C5A059]"
                />
              ) : (
                <UserIcon className="w-3.5 h-3.5 text-[#C5A059]" />
              )}
              <span className="hidden xl:inline text-[#FAF9F5] font-mono text-[11px] max-w-[120px] truncate">
                {user.email || user.displayName || "Operator"}
              </span>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="text-[#8A8F9A] hover:text-[#FAF9F5] p-0.5 rounded cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              disabled={isSigningIn}
              className={`flex items-center space-x-1.5 border text-xs px-2.5 py-1.5 rounded transition-colors ${
                isSigningIn
                  ? "bg-[#14161C] border-[#22252D] text-[#8A8F9A] cursor-wait"
                  : "bg-[#1A1E29] hover:bg-[#232938] border-[#2C3345] text-[#E6E4DF] cursor-pointer"
              }`}
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-[#C5A059] animate-spin" />
                  <span className="hidden sm:inline">Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="hidden sm:inline">Sign In</span>
                </>
              )}
            </button>
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
          id="cockpit_seat"
          label="Cockpit Seat (Mobile HUD)"
          icon={<Compass className="w-3.5 h-3.5 text-[#C5A059]" />}
          active={activeTab === "cockpit_seat"}
          onClick={() => onSelectTab("cockpit_seat")}
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
          id="geometry"
          label="Geometric Architecture"
          icon={<Compass className="w-3.5 h-3.5 text-[#509EE3]" />}
          active={activeTab === "geometry"}
          onClick={() => onSelectTab("geometry")}
        />
        <TabButton
          id="envelope"
          label="Evidence Envelopes"
          icon={<Shield className="w-3.5 h-3.5 text-[#4ADE80]" />}
          active={activeTab === "envelope"}
          onClick={() => onSelectTab("envelope")}
        />

        {/* Divider: Alice Vessel */}
        <div className="h-4 w-px bg-[#262B35] mx-1 shrink-0" />
        <span className="text-[10px] uppercase font-mono tracking-wider text-[#A08850] px-1 font-semibold hidden md:inline shrink-0">
          Alice Vessel:
        </span>

        <TabButton
          id="vessel_operator"
          label="Cockpit & Object Stack"
          icon={<Sliders className="w-3.5 h-3.5 text-[#C5A059]" />}
          active={activeTab === "vessel_operator"}
          onClick={() => onSelectTab("vessel_operator")}
        />
        <TabButton
          id="vessel_engine"
          label="Engine & Field Modes"
          icon={<Zap className="w-3.5 h-3.5 text-[#E6A23C]" />}
          active={activeTab === "vessel_engine"}
          onClick={() => onSelectTab("vessel_engine")}
        />
        <TabButton
          id="vessel_ccv01"
          label="CCV-01 Vehicle"
          icon={<Radio className="w-3.5 h-3.5 text-[#67C23A]" />}
          active={activeTab === "vessel_ccv01"}
          onClick={() => onSelectTab("vessel_ccv01")}
        />
        <TabButton
          id="vessel_cavity"
          label="Cavity Transformer"
          icon={<Box className="w-3.5 h-3.5 text-[#409EFF]" />}
          active={activeTab === "vessel_cavity"}
          onClick={() => onSelectTab("vessel_cavity")}
        />
        <TabButton
          id="vessel_transport"
          label="Transport Medium"
          icon={<Activity className="w-3.5 h-3.5 text-[#909399]" />}
          active={activeTab === "vessel_transport"}
          onClick={() => onSelectTab("vessel_transport")}
        />

        {/* Divider: Pathfinder Cognition */}
        <div className="h-4 w-px bg-[#262B35] mx-1 shrink-0" />
        <span className="text-[10px] uppercase font-mono tracking-wider text-[#509EE3] px-1 font-semibold hidden md:inline shrink-0">
          Cognition:
        </span>

        <TabButton
          id="cognition_jemma"
          label="Jemma Frictions"
          icon={<Flame className="w-3.5 h-3.5 text-[#F56C6C]" />}
          active={activeTab === "cognition_jemma"}
          onClick={() => onSelectTab("cognition_jemma")}
        />
        <TabButton
          id="cognition_octagon"
          label="Octagon Safety Gate"
          icon={<ShieldCheck className="w-3.5 h-3.5 text-[#67C23A]" />}
          active={activeTab === "cognition_octagon"}
          onClick={() => onSelectTab("cognition_octagon")}
        />
        <TabButton
          id="cognition_delta"
          label="Substrate Delta Ledger"
          icon={<FileCheck className="w-3.5 h-3.5 text-[#409EFF]" />}
          active={activeTab === "cognition_delta"}
          onClick={() => onSelectTab("cognition_delta")}
        />
        <TabButton
          id="cognition_simon"
          label="Cognition Pathways"
          icon={<BookOpen className="w-3.5 h-3.5 text-[#E6A23C]" />}
          active={activeTab === "cognition_simon"}
          onClick={() => onSelectTab("cognition_simon")}
        />

        {/* Divider: Substrate System Tools */}
        <div className="h-4 w-px bg-[#262B35] mx-1 shrink-0" />

        <TabButton
          id="compute"
          label="Compute Rail"
          icon={<Cpu className="w-3.5 h-3.5 text-[#C5A059]" />}
          active={activeTab === "compute"}
          onClick={() => onSelectTab("compute")}
        />
        <TabButton
          id="governance"
          label="Governance"
          icon={<Shield className="w-3.5 h-3.5" />}
          active={activeTab === "governance"}
          onClick={() => onSelectTab("governance")}
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
