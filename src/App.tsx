import React, { useState, useEffect } from "react";
import { DigitalTwin } from "./types";
import { SEED_TWINS } from "./data/seedTwins";

import { Header, WorkspaceTab } from "./components/Header";
import { RepositoryView } from "./components/RepositoryView";
import { OverviewView } from "./components/OverviewView";
import { StructureView } from "./components/StructureView";
import { ObservationView } from "./components/ObservationView";
import { SimulationView } from "./components/SimulationView";
import { ConstraintDiscoveryView } from "./components/ConstraintDiscoveryView";
import { CapabilityRegistryView } from "./components/CapabilityRegistryView";
import { ComputeRegistry } from "./components/ComputeRegistry";
import { TimelineView } from "./components/TimelineView";
import { GovernanceView } from "./components/GovernanceView";
import { TwinObservatory } from "./components/TwinObservatory";
import { NewTwinModal } from "./components/NewTwinModal";
import { FooterSystemMonitor } from "./components/FooterSystemMonitor";

function normalizeTwin(t: any): DigitalTwin {
  if (!t) return t;
  return {
    ...t,
    boundary: {
      description: t.boundary?.description || "Defined boundary membrane limit",
      includedEntities: Array.isArray(t.boundary?.includedEntities) ? t.boundary.includedEntities : [],
      excludedEntities: Array.isArray(t.boundary?.excludedEntities) ? t.boundary.excludedEntities : [],
      inputs: Array.isArray(t.boundary?.inputs) ? t.boundary.inputs : [],
      outputs: Array.isArray(t.boundary?.outputs) ? t.boundary.outputs : [],
      permeabilityRules: Array.isArray(t.boundary?.permeabilityRules) ? t.boundary.permeabilityRules : []
    },
    entities: Array.isArray(t.entities) ? t.entities : [],
    relationships: Array.isArray(t.relationships) ? t.relationships : [],
    states: Array.isArray(t.states) ? t.states : [],
    observations: Array.isArray(t.observations) ? t.observations : [],
    interpretations: Array.isArray(t.interpretations) ? t.interpretations : [],
    simulations: Array.isArray(t.simulations) ? t.simulations : [],
    revisions: Array.isArray(t.revisions) ? t.revisions : [],
    pathfinderRecords: Array.isArray(t.pathfinderRecords) ? t.pathfinderRecords : [],
    sourceAssets: Array.isArray(t.sourceAssets) ? t.sourceAssets : [],
    activeFlows: Array.isArray(t.activeFlows) ? t.activeFlows : []
  };
}

export function App() {
  const [twins, setTwins] = useState<DigitalTwin[]>(() => SEED_TWINS.map(normalizeTwin));
  const [activeTwinId, setActiveTwinId] = useState<string | null>(() => {
    return localStorage.getItem("pathfinder_active_twin_id") || "antikythera-mechanism-05";
  });
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("overview");
  const [isNewTwinModalOpen, setIsNewTwinModalOpen] = useState(false);

  // Sync activeTwinId to localStorage
  useEffect(() => {
    if (activeTwinId) {
      localStorage.setItem("pathfinder_active_twin_id", activeTwinId);
    }
  }, [activeTwinId]);

  // Load twins from server API or initialize with SEED_TWINS
  useEffect(() => {
    async function fetchTwins() {
      try {
        const res = await fetch("/api/twins");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const normalized = data.map(normalizeTwin);
            setTwins(normalized);

            const savedTwinId = localStorage.getItem("pathfinder_active_twin_id");
            if (savedTwinId && normalized.some(t => t.id === savedTwinId)) {
              setActiveTwinId(savedTwinId);
            } else if (normalized.some(t => t.id === "antikythera-mechanism-05")) {
              setActiveTwinId("antikythera-mechanism-05");
            } else if (!activeTwinId) {
              setActiveTwinId(normalized[0].id);
            }
          }
        }
      } catch (err) {
        console.warn("Using local default digital twins repository.");
      }
    }
    fetchTwins();
  }, []);

  const activeTwin = twins.find((t) => t.id === activeTwinId) || null;

  const handleSelectTwin = (id: string) => {
    setActiveTwinId(id);
    setActiveTab("overview");
  };

  const handleUpdateTwin = async (updatedTwin: DigitalTwin) => {
    setTwins((prev) => prev.map((t) => (t.id === updatedTwin.id ? updatedTwin : t)));

    // Persist to server API
    try {
      const res = await fetch("/api/twins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTwin)
      });
      if (!res.ok) {
        console.warn(`[TWIN SYNC] Server returned status ${res.status} while saving twin ${updatedTwin.id}`);
      }
    } catch (err) {
      console.warn("[TWIN SYNC] Local-first state preserved; background server sync deferred:", err);
    }
  };

  const handleCreateTwin = async (newTwin: DigitalTwin) => {
    setTwins((prev) => [newTwin, ...prev]);
    setActiveTwinId(newTwin.id);
    setActiveTab("overview");

    try {
      const res = await fetch("/api/twins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTwin)
      });
      if (!res.ok) {
        console.warn(`[TWIN CREATE] Server returned status ${res.status} while creating twin ${newTwin.id}`);
      }
    } catch (err) {
      console.warn("[TWIN CREATE] Local-first state preserved; background server sync deferred:", err);
    }
  };

  const handleDeleteTwin = async (id: string) => {
    setTwins((prev) => prev.filter((t) => t.id !== id));
    if (activeTwinId === id) {
      const remaining = twins.filter((t) => t.id !== id);
      setActiveTwinId(remaining[0]?.id || null);
      setActiveTab("repository");
    }

    try {
      await fetch(`/api/twins/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete twin on server:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#E6E4DF] font-sans antialiased selection:bg-[#C5A059] selection:text-[#0D0E11]">
      {/* Header with Navigation & Twin Selector */}
      <Header
        twins={twins}
        activeTwinId={activeTwinId}
        activeTab={activeTab}
        onSelectTwin={handleSelectTwin}
        onSelectTab={setActiveTab}
        onOpenNewTwinModal={() => setIsNewTwinModalOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="pb-24">
        {activeTab === "repository" && (
          <RepositoryView
            twins={twins}
            activeTwinId={activeTwinId}
            onSelectTwin={handleSelectTwin}
            onOpenNewTwinModal={() => setIsNewTwinModalOpen(true)}
            onDeleteTwin={handleDeleteTwin}
          />
        )}

        {activeTab === "observatory" && activeTwin && (
          <TwinObservatory twin={activeTwin} onNavigateToTab={setActiveTab} />
        )}

        {activeTab === "overview" && activeTwin && (
          <OverviewView twin={activeTwin} onNavigateToTab={setActiveTab} />
        )}

        {activeTab === "structure" && activeTwin && (
          <StructureView twin={activeTwin} onUpdateTwin={handleUpdateTwin} />
        )}

        {activeTab === "observation" && activeTwin && (
          <ObservationView twin={activeTwin} onUpdateTwin={handleUpdateTwin} />
        )}

        {activeTab === "simulation" && activeTwin && (
          <SimulationView twin={activeTwin} onUpdateTwin={handleUpdateTwin} />
        )}

        {activeTab === "constraints" && activeTwin && (
          <ConstraintDiscoveryView twin={activeTwin} onUpdateTwin={handleUpdateTwin} />
        )}

        {activeTab === "capabilities" && activeTwin && (
          <CapabilityRegistryView twin={activeTwin} onUpdateTwin={handleUpdateTwin} />
        )}

        {activeTab === "compute" && (
          <ComputeRegistry twin={activeTwin} onNavigateToTab={setActiveTab} />
        )}

        {activeTab === "timeline" && activeTwin && (
          <TimelineView twin={activeTwin} onUpdateTwin={handleUpdateTwin} />
        )}

        {activeTab === "governance" && activeTwin && (
          <GovernanceView twin={activeTwin} onUpdateTwin={handleUpdateTwin} />
        )}

        {!activeTwin && activeTab !== "repository" && (
          <div className="max-w-[1600px] mx-auto px-6 py-20 text-center space-y-4">
            <p className="text-[#8A8F9A] text-sm">No active digital twin selected.</p>
            <button
              onClick={() => setActiveTab("repository")}
              className="bg-[#C5A059] text-[#0D0E11] text-xs font-semibold px-4 py-2 rounded"
            >
              Return to Repository
            </button>
          </div>
        )}
      </main>

      {/* Persistent GPU & Compute System Health Monitor Footer */}
      <FooterSystemMonitor />

      {/* Construct New Twin Modal */}
      <NewTwinModal
        isOpen={isNewTwinModalOpen}
        onClose={() => setIsNewTwinModalOpen(false)}
        onCreateTwin={handleCreateTwin}
      />
    </div>
  );
}

export default App;
