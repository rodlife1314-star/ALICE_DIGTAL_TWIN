import React, { useState } from "react";
import { X, Plus, Layers, Shield } from "lucide-react";
import { DigitalTwin, DigitalTwinDomain } from "../types";

interface NewTwinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTwin: (newTwin: DigitalTwin) => void;
}

export function NewTwinModal({ isOpen, onClose, onCreateTwin }: NewTwinModalProps) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState<DigitalTwinDomain>("biological");
  const [purpose, setPurpose] = useState("");
  const [boundaryDesc, setBoundaryDesc] = useState("");
  const [includedEntitiesText, setIncludedEntitiesText] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !purpose || !boundaryDesc) return;

    const entitiesList = includedEntitiesText
      ? includedEntitiesText.split("\n").filter(Boolean)
      : ["Core Subsystem Primary Entity"];

    const newTwin: DigitalTwin = {
      id: `twin-${Date.now()}`,
      name,
      domain,
      description: purpose,
      purpose,
      boundary: {
        description: boundaryDesc,
        includedEntities: entitiesList,
        excludedEntities: ["Exogenous Far-Field Environment"],
        inputs: [{ id: "inp-1", name: "Energy & Material Intake", type: "mixed", rate: "Nominal" }],
        outputs: [{ id: "out-1", name: "System Dissipation / Work", type: "mixed", rate: "Nominal" }],
        permeabilityRules: [
          {
            id: `rule-${Date.now()}`,
            inputType: "ambient_inputs",
            condition: "within operational threshold",
            action: "permit"
          }
        ]
      },
      sourceAssets: [
        {
          id: `asset-${Date.now()}`,
          name: "initial_telemetry_stream.json",
          type: "telemetry",
          size: "1.2 MB",
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
        }
      ],
      entities: entitiesList.map((entName, i) => ({
        id: `ent-${Date.now()}-${i}`,
        name: entName,
        type: "primary_node",
        state: { status: "nominal", capacity: "100%" },
        description: `Active node representation for ${entName}.`,
        status: "active"
      })),
      relationships: entitiesList.length > 1
        ? [
            {
              id: `rel-${Date.now()}`,
              sourceId: `ent-${Date.now()}-0`,
              targetId: `ent-${Date.now()}-1`,
              relationshipType: "functional_coupling",
              medium: "direct",
              strength: 0.9,
              latency: 10,
              direction: "two_way"
            }
          ]
        : [],
      states: [
        {
          id: `st-${Date.now()}`,
          name: "Initial Baseline State",
          metrics: { status: "Nominal" },
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
          active: true
        }
      ],
      observations: [
        {
          id: `obs-${Date.now()}`,
          fact: `Initial digital twin constructed for domain [${domain}].`,
          value: "Baseline Established",
          isFact: true,
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
          quality: "measured"
        }
      ],
      interpretations: [],
      simulations: [],
      revisions: [
        {
          id: `rev-${Date.now()}`,
          title: "Initial Twin Construction",
          description: "Constructed digital twin structure and boundary conditions.",
          author: "Operator",
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
          changeSummary: "Established initial twin anatomy."
        }
      ],
      pathfinderRecords: [
        {
          id: `pf-${Date.now()}`,
          question: `What is the operational boundary and state capacity of ${name}?`,
          evidence: ["Operator boundary definition"],
          investigation: "Constructed baseline entities and initial permeability rules.",
          challenge: "Verify sensor feed resolution.",
          decision: "Approve initial digital twin creation.",
          commitStatus: "committed",
          createdAt: new Date().toISOString().replace("T", " ").substring(0, 16)
        }
      ],
      activeFlows: [
        { stage: "COLLECTION", title: "Input Gathering", description: "Collects raw input signals and materials across system boundary.", rateOrVolume: "Nominal intake", lossOrEfficiency: "98% collection" },
        { stage: "STORAGE", title: "State Storage Buffer", description: "Retains internal energy, state variables, and data buffers.", rateOrVolume: "100% capacity", lossOrEfficiency: "Zero leakage" },
        { stage: "TRANSFORMATION", title: "Core Processing Engine", description: "Transforms inputs into domain output states.", rateOrVolume: "Active conversion", lossOrEfficiency: "95% efficiency" },
        { stage: "DISTRIBUTION", title: "Effluent / Work Output", description: "Distributes energy and material outputs to downstream channels.", rateOrVolume: "Regulated discharge", lossOrEfficiency: "Controlled flow" }
      ],
      integrityStatus: "STABLE",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    onCreateTwin(newTwin);
    onClose();
    setName("");
    setPurpose("");
    setBoundaryDesc("");
    setIncludedEntitiesText("");
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#13151A] border border-[#2E3442] rounded-lg max-w-lg w-full p-6 space-y-5 text-[#E6E4DF] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#22262F] pb-3">
          <div>
            <h2 className="text-xl font-light tracking-tight text-[#E6E4DF]">
              Construct Digital Twin
            </h2>
            <p className="text-xs text-[#8A8F9A] mt-0.5">
              Define identity, domain, boundary limits, and core entities
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#737885] hover:text-[#E6E4DF] p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
              Digital Twin Name
            </label>
            <input
              type="text"
              placeholder="e.g. Subterranean Hydro-Thermal Network, Non-Oxygen Biosphere"
              value={name ?? ""}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#C5A059]"
              required
            />
          </div>

          <div>
            <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
              Domain Classification
            </label>
            <select
              value={domain ?? "biological"}
              onChange={(e) => setDomain(e.target.value as DigitalTwinDomain)}
              className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#C5A059] capitalize"
            >
              <option value="biological">Biological (Ecosystem / Swarm / Physiology)</option>
              <option value="physical">Physical (Mechanical / Thermal / Hydro)</option>
              <option value="environmental">Environmental (Climate / Hydrological / Urban)</option>
              <option value="engineered">Engineered (Materials / Hardware / Microfluidics)</option>
              <option value="musical">Musical (Acoustic / Multi-track / Soundfield)</option>
              <option value="conceptual">Conceptual (Data Flow / Mathematical / Cybernetic)</option>
              <option value="hybrid">Hybrid (Cross-Domain Complex System)</option>
            </select>
          </div>

          <div>
            <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
              Purpose & Objective
            </label>
            <textarea
              placeholder="What does this digital duplicate observe, simulate, or govern?"
              value={purpose ?? ""}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#C5A059] h-20 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
              Boundary & Membrane Definition
            </label>
            <textarea
              placeholder="Describe physical, spatial, acoustic, or data limits of the twin..."
              value={boundaryDesc ?? ""}
              onChange={(e) => setBoundaryDesc(e.target.value)}
              className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#C5A059] h-20 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
              Initial Included Entities (One per line)
            </label>
            <textarea
              placeholder="e.g. Primary Reservoir&#10;Thermal Exchange Channel&#10;Pressure Regulator Valve"
              value={includedEntitiesText ?? ""}
              onChange={(e) => setIncludedEntitiesText(e.target.value)}
              className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#C5A059] h-20 resize-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#22262F]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#8A8F9A] hover:text-[#E6E4DF] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0D0E11] text-xs font-semibold px-5 py-2 rounded shadow transition-colors cursor-pointer"
            >
              Construct Digital Twin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
