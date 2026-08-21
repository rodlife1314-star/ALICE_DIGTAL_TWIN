import React, { useState } from "react";
import {
  Compass,
  Layers,
  ArrowRight,
  Shield,
  Activity,
  CheckCircle,
  AlertTriangle,
  Info,
  Sliders,
  Database,
  RefreshCw,
  Box,
  Cpu,
  CornerDownRight,
  Zap,
  Filter,
  Eye
} from "lucide-react";
import { DigitalTwin } from "../types";
import { IntelligentMembraneView } from "./IntelligentMembraneView";
import { SixesCulinaryStudio } from "../domains/sixes/SixesCulinaryStudio";

interface OverviewViewProps {
  twin: DigitalTwin;
  onNavigateToTab: (tab: any) => void;
}

export function OverviewView({ twin, onNavigateToTab }: OverviewViewProps) {
  const isIntelligentMembrane = twin.id === "intelligent-protective-membrane-07";
  const isProjectSixes = twin.id === "project-sixes-culinary-08" || twin.domain === "biological" && twin.name.includes("Project SIXES");
  const [viewMode, setViewMode] = useState<"membrane_console" | "sixes_studio" | "standard_flow">(
    isIntelligentMembrane ? "membrane_console" : isProjectSixes ? "sixes_studio" : "standard_flow"
  );

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 space-y-8 text-[#E6E4DF]">
      {/* Twin Active Banner */}
      <div className="bg-[#13151A] border border-[#22262F] rounded p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-mono tracking-widest text-[#C5A059] px-2 py-0.5 rounded bg-[#1C1810] border border-[#3B3220]">
              {twin.domain} Domain Twin
            </span>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded border ${
                twin.integrityStatus === "STABLE"
                  ? "bg-[#111A16] border-[#1C3527] text-[#4ADE80]"
                  : "bg-[#20180F] border-[#3B2815] text-[#F59E0B]"
              }`}
            >
              {twin.integrityStatus}
            </span>
            {isIntelligentMembrane && (
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#509EE3] font-bold">
                4-SCALE NERVOUS SYSTEM
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-light text-[#E6E4DF] tracking-tight">
            {twin.name}
          </h1>

          <p className="text-sm text-[#A0A4AB] leading-relaxed">
            {twin.purpose}
          </p>
        </div>

        {/* Quick Module Access Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          {isIntelligentMembrane && (
            <div className="bg-[#181A20] p-1 rounded border border-[#2B303C] flex space-x-1 font-mono text-xs mr-2">
              <button
                onClick={() => setViewMode("membrane_console")}
                className={`px-2.5 py-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === "membrane_console"
                    ? "bg-[#509EE3] text-[#0D0E11] font-bold"
                    : "text-[#8A8F9A] hover:text-[#E6E4DF]"
                }`}
              >
                4-Scale Console
              </button>
              <button
                onClick={() => setViewMode("standard_flow")}
                className={`px-2.5 py-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === "standard_flow"
                    ? "bg-[#509EE3] text-[#0D0E11] font-bold"
                    : "text-[#8A8F9A] hover:text-[#E6E4DF]"
                }`}
              >
                System Flows
              </button>
            </div>
          )}

          {isProjectSixes && (
            <div className="bg-[#181A20] p-1 rounded border border-[#2B303C] flex space-x-1 font-mono text-xs mr-2">
              <button
                onClick={() => setViewMode("sixes_studio")}
                className={`px-2.5 py-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === "sixes_studio"
                    ? "bg-[#C5A059] text-[#0D0E11] font-bold"
                    : "text-[#8A8F9A] hover:text-[#E6E4DF]"
                }`}
              >
                SIXES Studio
              </button>
              <button
                onClick={() => setViewMode("standard_flow")}
                className={`px-2.5 py-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === "standard_flow"
                    ? "bg-[#C5A059] text-[#0D0E11] font-bold"
                    : "text-[#8A8F9A] hover:text-[#E6E4DF]"
                }`}
              >
                System Flows
              </button>
            </div>
          )}

          <button
            onClick={() => onNavigateToTab("observatory")}
            className="flex items-center space-x-1.5 bg-[#509EE3]/15 hover:bg-[#509EE3]/25 border border-[#509EE3]/40 text-xs text-[#509EE3] font-bold px-3 py-2 rounded transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Launch 3D Observatory</span>
          </button>

          <button
            onClick={() => onNavigateToTab("structure")}
            className="flex items-center space-x-1.5 bg-[#181A20] hover:bg-[#222630] border border-[#2B303C] text-xs text-[#E6E4DF] px-3 py-2 rounded transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Structure</span>
          </button>
          <button
            onClick={() => onNavigateToTab("simulation")}
            className="flex items-center space-x-1.5 bg-[#181A20] hover:bg-[#222630] border border-[#2B303C] text-xs text-[#E6E4DF] px-3 py-2 rounded transition-colors cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5 text-[#509EE3]" />
            <span>Simulate</span>
          </button>
          <button
            onClick={() => onNavigateToTab("governance")}
            className="flex items-center space-x-1.5 bg-[#181A20] hover:bg-[#222630] border border-[#2B303C] text-xs text-[#E6E4DF] px-3 py-2 rounded transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span>Governance</span>
          </button>
        </div>
      </div>

      {/* Render Intelligent Membrane View if active and requested */}
      {isIntelligentMembrane && viewMode === "membrane_console" ? (
        <IntelligentMembraneView twin={twin} onNavigateToTab={onNavigateToTab} />
      ) : null}

      {/* Render Project SIXES Culinary Studio if active and requested */}
      {isProjectSixes && viewMode === "sixes_studio" ? (
        <SixesCulinaryStudio twin={twin} onNavigateToTab={onNavigateToTab} />
      ) : null}

      {/* Reusable Flow Model: COLLECTION -> STORAGE -> TRANSFORMATION -> DISTRIBUTION */}
      {viewMode === "standard_flow" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-[#E6E4DF]">
                System Flow Model
              </h2>
              <p className="text-xs text-[#8A8F9A]">
                COLLECTION → STORAGE → TRANSFORMATION → DISTRIBUTION
              </p>
            </div>
          </div>

          {twin.activeFlows && twin.activeFlows.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {twin.activeFlows.map((flow, idx) => (
                <div
                  key={idx}
                  className="bg-[#13151A] border border-[#22262F] rounded p-5 relative overflow-hidden flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#1E222A] pb-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#C5A059]">
                      0{idx + 1} · {flow.stage}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-[#E6E4DF]">
                      {flow.title}
                    </h4>
                    <p className="text-xs text-[#8A8F9A] mt-1 leading-relaxed">
                      {flow.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#1C1F28] space-y-1 text-xs font-mono">
                    <div className="text-[#509EE3] text-[11px]">{flow.rateOrVolume}</div>
                    <div className="text-[#737885] text-[10px]">{flow.lossOrEfficiency}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#13151A] border border-[#22262F] rounded p-6 text-center text-xs text-[#8A8F9A]">
              Flow dynamics being computed for this digital twin.
            </div>
          )}
        </div>
      )}

      {/* Two Column Grid: Boundary / Membrane & Entities Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Boundary / Membrane System */}
        <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#22262F] pb-3">
            <div>
              <h3 className="text-base font-medium text-[#E6E4DF]">
                Twin Boundary & Membrane Rules
              </h3>
              <p className="text-xs text-[#8A8F9A]">
                Explicit system limits, input/output channels, and permeability controls
              </p>
            </div>
            <Filter className="w-4 h-4 text-[#C5A059]" />
          </div>

          <p className="text-xs text-[#A0A4AB] leading-relaxed bg-[#0F1014] p-3 rounded border border-[#1E222A]">
            {twin.boundary?.description || "Defined system boundary and membrane limits."}
          </p>

          {/* Included / Excluded Entities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#4ADE80]">
                Included Entities ({(twin.boundary?.includedEntities || []).length})
              </span>
              <div className="space-y-1">
                {(twin.boundary?.includedEntities || []).map((ent, i) => (
                  <div
                    key={i}
                    className="bg-[#181C24] border border-[#252C3B] p-2 rounded text-[#E6E4DF]"
                  >
                    {ent}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#F59E0B]">
                Excluded / Exogenous ({(twin.boundary?.excludedEntities || []).length})
              </span>
              <div className="space-y-1">
                {(twin.boundary?.excludedEntities || []).map((ent, i) => (
                  <div
                    key={i}
                    className="bg-[#181A20] border border-[#22252F] p-2 rounded text-[#737885] italic"
                  >
                    {ent}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Permeability Rules */}
          {twin.boundary?.permeabilityRules && twin.boundary.permeabilityRules.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#1F232D]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#C5A059]">
                Selective Permeability & Spectrum Rules
              </span>
              <div className="space-y-2">
                {twin.boundary.permeabilityRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="bg-[#161820] border border-[#252B38] p-3 rounded flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="text-[#E6E4DF] font-medium capitalize">
                        {rule.inputType.replace("_", " ")}
                      </div>
                      <div className="text-[11px] text-[#8A8F9A] font-mono mt-0.5">
                        IF {rule.condition}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded border ${
                        rule.action === "permit"
                          ? "bg-[#111A16] border-[#1C3527] text-[#4ADE80]"
                          : rule.action === "reject"
                          ? "bg-[#201314] border-[#3B1C1D] text-[#EF4444]"
                          : rule.action === "store"
                          ? "bg-[#1A1810] border-[#3D341B] text-[#C5A059]"
                          : "bg-[#142230] border-[#1E364E] text-[#509EE3]"
                      }`}
                    >
                      {rule.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Entities Summary & Latest Observations */}
        <div className="space-y-6">
          {/* Active Entities Snapshot */}
          <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#22262F] pb-3">
              <div>
                <h3 className="text-base font-medium text-[#E6E4DF]">
                  Core Twin Entities ({twin.entities.length})
                </h3>
                <p className="text-xs text-[#8A8F9A]">
                  Active internal states & status metrics
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab("structure")}
                className="text-xs text-[#C5A059] hover:underline cursor-pointer flex items-center space-x-1"
              >
                <span>View Full Structure</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {twin.entities.map((entity) => (
                <div
                  key={entity.id}
                  className="bg-[#181A20] border border-[#242935] rounded p-3 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="text-[#E6E4DF] font-medium">{entity.name}</div>
                    <div className="text-[10px] text-[#737885] font-mono capitalize">
                      Type: {entity.type}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-right">
                    <div className="font-mono text-[11px] text-[#509EE3]">
                      {Object.entries(entity.state)[0]
                        ? `${Object.entries(entity.state)[0][0]}: ${Object.entries(entity.state)[0][1]}`
                        : "Active"}
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        entity.status === "warning"
                          ? "bg-[#F59E0B]"
                          : entity.status === "error"
                          ? "bg-[#EF4444]"
                          : "bg-[#4ADE80]"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Observations */}
          <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#22262F] pb-3">
              <div>
                <h3 className="text-base font-medium text-[#E6E4DF]">
                  Latest Observations
                </h3>
                <p className="text-xs text-[#8A8F9A]">
                  Measured facts vs. inferred claims
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab("observation")}
                className="text-xs text-[#509EE3] hover:underline cursor-pointer flex items-center space-x-1"
              >
                <span>Observation Ledger</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {twin.observations.slice(0, 3).map((obs) => (
                <div
                  key={obs.id}
                  className="bg-[#161820] border border-[#232834] rounded p-3 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        obs.isFact
                          ? "bg-[#111A16] text-[#4ADE80] border border-[#1C3527]"
                          : "bg-[#20180F] text-[#F59E0B] border border-[#3B2815]"
                      }`}
                    >
                      {obs.isFact ? "MEASURED FACT" : "INFERRED CLAIM"}
                    </span>
                    <span className="text-[10px] text-[#737885] font-mono">
                      {obs.timestamp}
                    </span>
                  </div>
                  <p className="text-[#E6E4DF]">{obs.fact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
