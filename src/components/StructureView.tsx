import React, { useState } from "react";
import {
  GitBranch,
  Layers,
  Zap,
  Sliders,
  Plus,
  ArrowRight,
  Shield,
  Activity,
  CheckCircle,
  AlertTriangle,
  Info,
  Radio,
  Filter,
  Trash2
} from "lucide-react";
import { DigitalTwin, TwinEntity, TwinRelationship, BoundaryRule } from "../types";

interface StructureViewProps {
  twin: DigitalTwin;
  onUpdateTwin: (updatedTwin: DigitalTwin) => void;
}

export function StructureView({ twin, onUpdateTwin }: StructureViewProps) {
  const entities = twin.entities || [];
  const relationships = twin.relationships || [];
  const boundary = twin.boundary || {
    description: "Defined boundary membrane limit",
    includedEntities: [],
    excludedEntities: [],
    inputs: [],
    outputs: [],
    permeabilityRules: []
  };

  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(
    entities[0]?.id || null
  );

  const [newRuleModalOpen, setNewRuleModalOpen] = useState(false);
  const [newRuleInput, setNewRuleInput] = useState("");
  const [newRuleCondition, setNewRuleCondition] = useState("");
  const [newRuleAction, setNewRuleAction] = useState<BoundaryRule["action"]>("permit");

  const selectedEntity = entities.find((e) => e.id === selectedEntityId) || null;

  // Upstream & Downstream relationships for selected entity
  const upstreamRels = relationships.filter((r) => r.targetId === selectedEntityId);
  const downstreamRels = relationships.filter((r) => r.sourceId === selectedEntityId);

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleInput || !newRuleCondition) return;

    const newRule: BoundaryRule = {
      id: `rule-${Date.now()}`,
      inputType: newRuleInput.toLowerCase().replace(/\s+/g, "_"),
      condition: newRuleCondition,
      action: newRuleAction
    };

    const updatedRules = [...(boundary.permeabilityRules || []), newRule];
    const updatedTwin: DigitalTwin = {
      ...twin,
      boundary: {
        ...boundary,
        permeabilityRules: updatedRules
      },
      updatedAt: new Date().toISOString()
    };

    onUpdateTwin(updatedTwin);
    setNewRuleModalOpen(false);
    setNewRuleInput("");
    setNewRuleCondition("");
  };

  const handleDeleteRule = (ruleId: string) => {
    const updatedRules = (boundary.permeabilityRules || []).filter((r) => r.id !== ruleId);
    onUpdateTwin({
      ...twin,
      boundary: {
        ...boundary,
        permeabilityRules: updatedRules
      },
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 space-y-8 text-[#E6E4DF]">
      {/* Title & Structure Architecture */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#22252D] pb-5 gap-4">
        <div>
          <div className="text-xs uppercase font-mono tracking-widest text-[#C5A059] mb-1 font-semibold">
            STRUCTURAL ARCHITECTURE & TOPOLOGY
          </div>
          <h1 className="text-2xl font-light text-[#E6E4DF] tracking-tight">
            Nodes, Relationships & Boundary Rules
          </h1>
          <p className="text-xs text-[#8A8F9A] mt-1 max-w-2xl">
            Interactive network of active twin entities, coupling mediums, directional flows, and spectrum-selective membrane rules.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded bg-[#13151A] border border-[#242935] text-[#509EE3]">
            {entities.length} Nodes
          </span>
          <span className="px-3 py-1.5 rounded bg-[#13151A] border border-[#242935] text-[#C5A059]">
            {relationships.length} Couplings
          </span>
        </div>
      </div>

      {/* Main Structural Topology Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Node-Edge Network Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-[#13151A] border border-[#22262F] rounded p-6 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-[#1F232D] pb-3">
            <span className="text-xs uppercase font-mono tracking-wider text-[#C5A059]">
              Network Topology & Coupling Field
            </span>
            <span className="text-[10px] text-[#737885] font-mono">
              Click node to inspect entity state
            </span>
          </div>

          {/* Interactive Topology Graph SVG */}
          <div className="relative w-full h-[380px] bg-[#0A0B0E] border border-[#1A1D25] rounded p-4 flex items-center justify-center overflow-hidden">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {relationships.map((rel, idx) => {
                const srcIdx = entities.findIndex((e) => e.id === rel.sourceId);
                const tgtIdx = entities.findIndex((e) => e.id === rel.targetId);
                if (srcIdx === -1 || tgtIdx === -1) return null;

                const total = entities.length;
                const angle1 = (srcIdx / total) * 2 * Math.PI - Math.PI / 2;
                const angle2 = (tgtIdx / total) * 2 * Math.PI - Math.PI / 2;

                const cx = 220;
                const cy = 180;
                const r = 120;

                const x1 = cx + r * Math.cos(angle1);
                const y1 = cy + r * Math.sin(angle1);
                const x2 = cx + r * Math.cos(angle2);
                const y2 = cy + r * Math.sin(angle2);

                const isHighlight =
                  rel.sourceId === selectedEntityId || rel.targetId === selectedEntityId;

                return (
                  <g key={rel.id || idx}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isHighlight ? "#C5A059" : "#2E3442"}
                      strokeWidth={isHighlight ? 2.5 : 1}
                      strokeDasharray={rel.direction === "one_way" ? "4" : "none"}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Circular Nodes Layout */}
            <div className="relative w-full h-full max-w-[440px] max-h-[360px]">
              {entities.map((entity, idx) => {
                const total = entities.length;
                const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
                const cx = 50; // percentage
                const cy = 50; // percentage
                const rx = 38; // radius %
                const ry = 36; // radius %

                const left = cx + rx * Math.cos(angle);
                const top = cy + ry * Math.sin(angle);

                const isSelected = entity.id === selectedEntityId;

                return (
                  <button
                    key={entity.id}
                    onClick={() => setSelectedEntityId(entity.id)}
                    style={{ left: `${left}%`, top: `${top}%` }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-3 rounded-lg border text-xs font-mono transition-all cursor-pointer z-10 flex items-center space-x-2 ${
                      isSelected
                        ? "bg-[#1E2330] border-[#C5A059] text-[#E6E4DF] shadow-lg scale-105"
                        : "bg-[#12141A] border-[#252A36] text-[#A0A4AB] hover:border-[#3E4658]"
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        entity.status === "warning"
                          ? "bg-[#F59E0B]"
                          : entity.status === "error"
                          ? "bg-[#EF4444]"
                          : "bg-[#4ADE80]"
                      }`}
                    />
                    <span className="font-medium whitespace-nowrap">{entity.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Relationships Coupling Table */}
          <div className="space-y-3">
            <span className="text-xs uppercase font-mono tracking-wider text-[#8A8F9A]">
              Entity Coupling Matrix
            </span>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {relationships.map((rel) => {
                const src = entities.find((e) => e.id === rel.sourceId)?.name || rel.sourceId;
                const tgt = entities.find((e) => e.id === rel.targetId)?.name || rel.targetId;
                return (
                  <div
                    key={rel.id}
                    className="bg-[#0F1014] border border-[#1E222A] rounded p-2.5 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-[#C5A059]">{src}</span>
                      <ArrowRight className="w-3 h-3 text-[#737885]" />
                      <span className="text-[#509EE3]">{tgt}</span>
                    </div>

                    <div className="flex items-center space-x-3 text-[10px] text-[#737885]">
                      <span>Medium: {rel.medium || "Direct"}</span>
                      <span>Strength: {Math.round((rel.strength || 1) * 100)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Entity Inspector & Membrane Permeability Rule Engine (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Entity Inspector Card */}
          <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-4">
            <div className="border-b border-[#22262F] pb-3">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#C5A059]">
                Entity Inspector
              </span>
              <h3 className="text-lg font-medium text-[#E6E4DF]">
                {selectedEntity ? selectedEntity.name : "Select an Entity"}
              </h3>
            </div>

            {selectedEntity ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#737885]">
                    Type & Purpose
                  </span>
                  <div className="text-[#E6E4DF] font-mono capitalize mt-0.5">
                    {selectedEntity.type}
                  </div>
                  {selectedEntity.description && (
                    <p className="text-[#A0A4AB] mt-1 leading-relaxed">
                      {selectedEntity.description}
                    </p>
                  )}
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono text-[#737885]">
                    Current State Parameters
                  </span>
                  <div className="bg-[#0F1014] border border-[#1E222A] p-3 rounded space-y-1.5 font-mono text-xs mt-1">
                    {Object.entries(selectedEntity.state).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between border-b border-[#181B22] pb-1 last:border-none">
                        <span className="text-[#8A8F9A]">{k}:</span>
                        <span className="text-[#509EE3] font-semibold">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upstream & Downstream Dependencies */}
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="bg-[#181A20] p-2.5 rounded border border-[#242935] space-y-1">
                    <span className="text-[#8A8F9A] font-mono text-[10px]">Upstream Inputs</span>
                    <div className="text-[#E6E4DF] font-mono">
                      {upstreamRels.length > 0
                        ? upstreamRels.map((r) => twin.entities.find((e) => e.id === r.sourceId)?.name).join(", ")
                        : "None"}
                    </div>
                  </div>
                  <div className="bg-[#181A20] p-2.5 rounded border border-[#242935] space-y-1">
                    <span className="text-[#8A8F9A] font-mono text-[10px]">Downstream Outputs</span>
                    <div className="text-[#E6E4DF] font-mono">
                      {downstreamRels.length > 0
                        ? downstreamRels.map((r) => twin.entities.find((e) => e.id === r.targetId)?.name).join(", ")
                        : "None"}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#8A8F9A]">Select a node on the left to inspect parameters.</p>
            )}
          </div>

          {/* Membrane / Selective Spectrum Rule Engine */}
          <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#22262F] pb-3">
              <div>
                <h3 className="text-base font-medium text-[#E6E4DF]">
                  Selective Spectrum Membrane Rules
                </h3>
                <p className="text-xs text-[#8A8F9A]">
                  Permeability gating rules governing inputs and boundary channels
                </p>
              </div>
              <button
                onClick={() => setNewRuleModalOpen(true)}
                className="flex items-center space-x-1 bg-[#1C202B] hover:bg-[#282E3E] text-xs text-[#C5A059] border border-[#3B3426] px-2.5 py-1.5 rounded transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Rule</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {twin.boundary.permeabilityRules && twin.boundary.permeabilityRules.length > 0 ? (
                twin.boundary.permeabilityRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="bg-[#0F1014] border border-[#1E222A] p-3 rounded flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="text-[#E6E4DF] font-medium capitalize">
                        {rule.inputType.replace("_", " ")}
                      </div>
                      <div className="text-[11px] text-[#8A8F9A] font-mono">
                        IF {rule.condition}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${
                          rule.action === "permit"
                            ? "bg-[#111A16] border-[#1C3527] text-[#4ADE80]"
                            : rule.action === "reject"
                            ? "bg-[#201314] border-[#3B1C1D] text-[#EF4444]"
                            : "bg-[#1A1810] border-[#3D341B] text-[#C5A059]"
                        }`}
                      >
                        {rule.action}
                      </span>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="text-[#737885] hover:text-[#EF4444] p-1 transition-colors cursor-pointer"
                        title="Remove Rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#8A8F9A] text-center py-4">No boundary rules defined yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add New Rule Modal */}
      {newRuleModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#13151A] border border-[#2E3442] rounded-lg max-w-md w-full p-6 space-y-4 text-[#E6E4DF]">
            <div className="border-b border-[#22262F] pb-3">
              <h3 className="text-lg font-medium">Add Membrane Permeability Rule</h3>
              <p className="text-xs text-[#8A8F9A]">Configure selective spectrum condition & action</p>
            </div>

            <form onSubmit={handleAddRule} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
                  Input Channel / Spectrum
                </label>
                <input
                  type="text"
                  placeholder="e.g. ambient_air, thermal_flux, charge_bias"
                  value={newRuleInput}
                  onChange={(e) => setNewRuleInput(e.target.value)}
                  className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
                  Condition / Threshold
                </label>
                <input
                  type="text"
                  placeholder="e.g. temperature > 22°C, freq < 80 Hz"
                  value={newRuleCondition}
                  onChange={(e) => setNewRuleCondition(e.target.value)}
                  className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
                  Action
                </label>
                <select
                  value={newRuleAction}
                  onChange={(e) => setNewRuleAction(e.target.value as BoundaryRule["action"])}
                  className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="permit">PERMIT (Allow through)</option>
                  <option value="reject">REJECT (Block / Divert)</option>
                  <option value="attenuate">ATTENUATE (Dampen signal)</option>
                  <option value="store">STORE (Retain in buffer)</option>
                  <option value="convert">CONVERT (Transform form)</option>
                  <option value="redirect">REDIRECT (Send to channel)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#22262F]">
                <button
                  type="button"
                  onClick={() => setNewRuleModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#8A8F9A] hover:text-[#E6E4DF] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0D0E11] text-xs font-semibold px-4 py-2 rounded shadow transition-colors cursor-pointer"
                >
                  Add Boundary Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
