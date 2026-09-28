import React, { useState, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { DigitalTwin } from "./types";
import { SEED_TWINS } from "./data/seedTwins";
import {
  auth,
  loginWithGoogle,
  logoutUser,
  saveTwinToFirestore,
  deleteTwinFromFirestore,
  subscribeToTwins
} from "./lib/firebase";

import { Header, WorkspaceTab } from "./components/Header";
import { RepositoryView } from "./components/RepositoryView";
import { OverviewView } from "./components/OverviewView";
import { StructureView } from "./components/StructureView";
import { ObservationView } from "./components/ObservationView";
import { SimulationView } from "./components/SimulationView";
import { GeometricArchitectureView } from "./components/GeometricArchitectureView";
import { EvidenceEnvelopeView } from "./components/EvidenceEnvelopeView";
import { ConstraintDiscoveryView } from "./components/ConstraintDiscoveryView";
import { CapabilityRegistryView } from "./components/CapabilityRegistryView";
import { ComputeRegistry } from "./components/ComputeRegistry";
import { TimelineView } from "./components/TimelineView";
import { GovernanceView } from "./components/GovernanceView";
import { TwinObservatory } from "./components/TwinObservatory";
import { NewTwinModal } from "./components/NewTwinModal";
import { FooterSystemMonitor } from "./components/FooterSystemMonitor";

// Alice Vessel Modules
import { SimulationParameters } from "./lib/physics-engine";
import { CockpitArtefactTwinView } from "./alice-vessel/components/CockpitArtefactTwinView";
import { AliceTwinCockpitJourney } from "./alice-vessel/components/AliceTwinCockpitJourney";
import VesselEngineArchitecture from "./alice-vessel/components/VesselEngineArchitecture";
import CCV01VehicleStudio from "./alice-vessel/components/CCV01VehicleStudio";
import { VolumetricCavityTransformer } from "./alice-vessel/components/VolumetricCavityTransformer";
import { TransportMediumView } from "./alice-vessel/components/TransportMediumView";

// Pathfinder Cognition Modules
import JemmaChallenge from "./cognition/components/JemmaChallenge";
import OctagonSection from "./cognition/components/OctagonSection";
import SubstrateDeltaSection from "./cognition/components/SubstrateDeltaSection";
import SimonSection from "./cognition/components/SimonSection";
import { Pathway, OctagonAudit } from "./cognition/types";
import {
  SubstrateDelta,
  saveSubstrateDelta,
  deleteSubstrateDelta,
  getSubstrateDeltas
} from "./cognition/services/firebase";

const CANONICAL_PATHWAY: Pathway = {
  id: "pathway-g6-coherence",
  name: "G_6 Coaxial Resonance & Boundary Containment",
  type: "standard",
  description: "Maintain G_6 hexagonal boundary symmetry while testing non-zero transverse vectoring within Octagon containment limits.",
  pros: ["Zero transverse shear at idle", "High Q-factor cavity resonance", "Operator sovereign gating preserved"],
  cons: ["Requires active corridor impedance matching (377.0 Ohm)", "Thermal bloom risk under elevated heating"],
  governingRule: "Governance Rule 1.01: State containment x_t in Omega_safe must hold deterministically before physical actuation.",
  traceableFindings: [
    {
      statement: "Hexagonal G_6 boundary cancels transverse Poynting flux identically under coaxial symmetry.",
      status: "evidenced",
      source: "AliceVessel.FieldGeometry a2ddbd0"
    },
    {
      statement: "Wall thermal sensors indicate 312.4 K nominal test bench baseline.",
      status: "evidenced",
      source: "Sensor Array Bench RTD-4402"
    }
  ]
};

const CANONICAL_OCTAGON_AUDIT: OctagonAudit = {
  complianceLevel: "COMPLIANT_CONTAINED",
  operatorSovereigntyNotes: "Autonomous routine sweeps permitted within Omega_safe bounds. Physical actuation and baseline promotions require sovereign operator authorization.",
  guidelinesChecked: [
    "Epistemic Separation: MEASURED strictly guarded by PhysicalAcquisitionProof",
    "Badge Invariant: INFERRED separated from SIMULATED",
    "Matter Stack Ordering: Function -> Material -> Structure -> Object -> Sensing -> Twin -> Validation",
    "Octagon Containment: Real-time state vector x_t in Omega_safe",
    "Upstream Invalidation: Any parameter alteration invalidates downstream proposals",
    "Promotion Authority: Sovereign Human Operator signature required for ledger commit"
  ]
};

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
    activeFlows: Array.isArray(t.activeFlows) ? t.activeFlows : [],
    evidenceEnvelopes: Array.isArray(t.evidenceEnvelopes) ? t.evidenceEnvelopes : []
  };
}

export function App() {
  const [twins, setTwins] = useState<DigitalTwin[]>(() => SEED_TWINS.map(normalizeTwin));
  const [activeTwinId, setActiveTwinId] = useState<string | null>(() => {
    return localStorage.getItem("pathfinder_active_twin_id") || "alice-vessel-ccv01";
  });
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("overview");
  const [isNewTwinModalOpen, setIsNewTwinModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  // Alice Vessel Physics Engine State
  const [vesselParams, setVesselParams] = useState<SimulationParameters>({
    geometry: "G6",
    sourceFrequency: 2.8,
    sourcePower: 45,
    sourceHeight: 12.0,
    sourceOffsetX: 0,
    sourceOffsetY: 0,
    motionPreset: "static",
    motionSpeed: 1.0,
    permittivity: 2.2,
    conductivity: 0.15,
    boundaryReflection: 0.45,
    couplingConstant: 0.35,
    radius: 175,
    vesselMode: "cruise_gamma_0",
    activeCorridor: "corridor_solar_wind"
  });

  const [nodalTelemetry] = useState<{
    powers: number[];
    efficiency: number;
    uniformity: number;
  }>({
    powers: [5.2, 5.1, 5.3, 5.0, 5.2, 5.1],
    efficiency: 0.69,
    uniformity: 0.96
  });

  // Pathfinder Cognition State
  const [substrateDeltas, setSubstrateDeltas] = useState<SubstrateDelta[]>([]);
  const [loadingDeltas, setLoadingDeltas] = useState<boolean>(false);
  const [selectedPathway, setSelectedPathway] = useState<Pathway | null>(CANONICAL_PATHWAY);
  const [cognitionPathways] = useState<Pathway[]>([
    CANONICAL_PATHWAY,
    {
      id: "pathway-conservative-hold",
      name: "Coaxial Symmetric Inertial Hold",
      type: "conservative",
      description: "Lock source offset dr=0.0mm to preserve zero transverse shear across outer boundary lattice.",
      pros: ["Zero boundary shear stress", "Optimal cavity Q-factor (~42,000)", "No thermal ejection hazard"],
      cons: ["Zero directional vectoring capability", "Fixed corridor transit vector"],
      governingRule: "Governance 2.04: Symmetric hold minimizes entropy dissipation under uncertain coupling.",
      traceableFindings: [
        {
          statement: "Stationary reticle alignment yields 100% coaxial symmetry across all 6 nodal receivers.",
          status: "evidenced",
          source: "AliceVessel.FieldGeometry a2ddbd0"
        }
      ]
    },
    {
      id: "pathway-aggressive-vector",
      name: "Asymmetric Poynting Direct Vectoring",
      type: "aggressive",
      description: "Drive source offset dx=+12px, dy=-8px to induce non-zero transverse momentum flux for rapid corridor departure.",
      pros: ["High transverse thrust vector", "Rapid transition between corridor rail junctions"],
      cons: ["Elevated boundary shear loads", "Potential thermal bloom risk if conductivity > 0.2 S/m"],
      governingRule: "Governance 4.12: Aggressive vectoring requires confirmed edge telemetry buffer verification.",
      traceableFindings: [
        {
          statement: "Transverse force reaches 14.8 N at maximum aperture displacement.",
          status: "evidenced",
          source: "Simulation Model PDE-G6"
        }
      ]
    }
  ]);

  // Load Substrate Deltas from Firestore
  useEffect(() => {
    const userId = user?.uid || "sovereign-operator";
    setLoadingDeltas(true);
    getSubstrateDeltas(userId)
      .then((deltas) => setSubstrateDeltas(deltas))
      .catch((err) => console.warn("Failed to load deltas from Firestore:", err))
      .finally(() => setLoadingDeltas(false));
  }, [user]);

  const handleAddDelta = async (delta: Omit<SubstrateDelta, "id" | "userId">) => {
    const userId = user?.uid || "sovereign-operator";
    try {
      const id = await saveSubstrateDelta({ ...delta, userId });
      setSubstrateDeltas((prev) => [{ ...delta, id, userId, timestamp: new Date() }, ...prev]);
    } catch (err) {
      console.error("Failed to add substrate delta:", err);
    }
  };

  const handleDeleteDelta = async (id: string) => {
    try {
      await deleteSubstrateDelta(id);
      setSubstrateDeltas((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Failed to delete substrate delta:", err);
    }
  };

  // Sync activeTwinId to localStorage
  useEffect(() => {
    if (activeTwinId) {
      localStorage.setItem("pathfinder_active_twin_id", activeTwinId);
    }
  }, [activeTwinId]);

  // Auth State Listener
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("[FIREBASE AUTH] Auth state tracking unavailable:", e);
    }
  }, []);

  // Real-time Firestore Twin Synchronization
  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;
    try {
      unsubscribeSnapshot = subscribeToTwins(
        (remoteTwins) => {
          if (remoteTwins && remoteTwins.length > 0) {
            const normalized = remoteTwins.map(normalizeTwin);
            setTwins(normalized);
            setIsCloudConnected(true);

            const savedTwinId = localStorage.getItem("pathfinder_active_twin_id");
            if (savedTwinId && normalized.some((t) => t.id === savedTwinId)) {
              setActiveTwinId(savedTwinId);
            } else if (!activeTwinId) {
              setActiveTwinId(normalized[0].id);
            }
          }
        },
        (err) => {
          console.warn("[FIRESTORE] Real-time listener offline or restricted:", err.message);
          setIsCloudConnected(false);
        }
      );
    } catch (err) {
      console.warn("[FIRESTORE] Failed to initialize live snapshot listener:", err);
      setIsCloudConnected(false);
    }

    return () => {
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  // Load twins from server API as fallback initial fetch
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
            } else if (normalized.some(t => t.id === "alice-vessel-ccv01")) {
              setActiveTwinId("alice-vessel-ccv01");
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

  const handleLogin = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    try {
      await loginWithGoogle();
    } catch {
      // Ignored or handled gracefully
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  const handleUpdateTwin = async (updatedTwin: DigitalTwin) => {
    setTwins((prev) => prev.map((t) => (t.id === updatedTwin.id ? updatedTwin : t)));

    // Save directly to Firestore with error envelope
    try {
      await saveTwinToFirestore(updatedTwin);
      setIsCloudConnected(true);
    } catch (err) {
      console.warn("[FIRESTORE SYNC] Direct Firestore write deferred:", err);
    }

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
      await saveTwinToFirestore(newTwin);
      setIsCloudConnected(true);
    } catch (err) {
      console.warn("[FIRESTORE CREATE] Direct Firestore write deferred:", err);
    }

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
      await deleteTwinFromFirestore(id);
    } catch (err) {
      console.warn("[FIRESTORE DELETE] Direct Firestore delete deferred:", err);
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
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isCloudConnected={isCloudConnected}
        isSigningIn={isSigningIn}
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

        {activeTab === "cockpit_seat" && (
          <div className="w-full h-[calc(100dvh-3.5rem)] overflow-hidden">
            <AliceTwinCockpitJourney
              initialSpace="chair"
              onNavigateToTab={(tab) => setActiveTab(tab as WorkspaceTab)}
            />
          </div>
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

        {activeTab === "geometry" && (
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
            <GeometricArchitectureView />
          </div>
        )}

        {activeTab === "envelope" && (
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
            <EvidenceEnvelopeView
              twin={activeTwin}
              onUpdateTwin={handleUpdateTwin}
              onNavigateToTab={setActiveTab}
            />
          </div>
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

        {/* ALICE VESSEL PHYSICAL & EXPERIMENTAL VIEWS */}
        {activeTab === "vessel_operator" && (
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
            <CockpitArtefactTwinView
              params={vesselParams}
              onParamsChange={setVesselParams}
              nodalTelemetry={nodalTelemetry}
            />
          </div>
        )}

        {activeTab === "vessel_engine" && (
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
            <VesselEngineArchitecture
              params={vesselParams}
              onUpdateParams={(updates) => setVesselParams((prev) => ({ ...prev, ...updates }))}
              onSelectGeometry={(geom) => setVesselParams((prev) => ({ ...prev, geometry: geom }))}
              onNavigateToWorkbench={() => setActiveTab("vessel_operator")}
            />
          </div>
        )}

        {activeTab === "vessel_ccv01" && (
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
            <CCV01VehicleStudio
              onNavigateToWorkbench={() => setActiveTab("vessel_operator")}
            />
          </div>
        )}

        {activeTab === "vessel_cavity" && (
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
            <VolumetricCavityTransformer />
          </div>
        )}

        {activeTab === "vessel_transport" && (
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
            <TransportMediumView />
          </div>
        )}

        {/* PATHFINDER COGNITION & OCTAGON GOVERNANCE VIEWS */}
        {activeTab === "cognition_jemma" && (
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
            <div className="bg-[#14161C] border border-[#22252D] rounded-xl p-5">
              <h2 className="text-sm font-mono font-semibold text-[#F56C6C] tracking-wide uppercase mb-1">
                Jemma Epistemic Friction Detector & Governance Remediation
              </h2>
              <p className="text-xs text-[#8A8F9A]">
                Identifies epistemic friction (authority gaps, deductive voids, cognitive contradictions) in active reasoning pathways, enabling the operator to commit validated substrate deltas to Firestore.
              </p>
            </div>
            <JemmaChallenge
              selectedPath={selectedPathway}
              userId={user?.uid || "sovereign-operator"}
              onDeltaLogged={() => {
                getSubstrateDeltas(user?.uid || "sovereign-operator").then(setSubstrateDeltas);
              }}
            />
          </div>
        )}

        {activeTab === "cognition_octagon" && (
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
            <div className="bg-[#14161C] border border-[#22252D] rounded-xl p-5">
              <h2 className="text-sm font-mono font-semibold text-[#67C23A] tracking-wide uppercase mb-1">
                Octagon Safety Gate & Autonomous Sweep Containment
              </h2>
              <p className="text-xs text-[#8A8F9A]">
                The Octagon evaluates candidate state transitions against bounded containment invariants (x_t in Omega_safe). The machine cannot grant itself promotion authority; sovereign operator confirmation is required.
              </p>
            </div>
            <OctagonSection audit={CANONICAL_OCTAGON_AUDIT} />
          </div>
        )}

        {activeTab === "cognition_delta" && (
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
            <div className="bg-[#14161C] border border-[#22252D] rounded-xl p-5">
              <h2 className="text-sm font-mono font-semibold text-[#409EFF] tracking-wide uppercase mb-1">
                Substrate Delta Ledger
              </h2>
              <p className="text-xs text-[#8A8F9A]">
                Persistent Firestore record of internalized governance rules, learned failure modes, and authorized state promotions.
              </p>
            </div>
            <SubstrateDeltaSection
              deltas={substrateDeltas}
              onAddDelta={handleAddDelta}
              onDeleteDelta={handleDeleteDelta}
              loading={loadingDeltas}
            />
          </div>
        )}

        {activeTab === "cognition_simon" && (
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
            <div className="bg-[#14161C] border border-[#22252D] rounded-xl p-5">
              <h2 className="text-sm font-mono font-semibold text-[#E6A23C] tracking-wide uppercase mb-1">
                Simon Cognitive Reasoning & Tension Mapping
              </h2>
              <p className="text-xs text-[#8A8F9A]">
                Evaluates conservative, standard, and aggressive pathways across multi-domain jurisdictions.
              </p>
            </div>
            <SimonSection
              pathways={cognitionPathways}
              selectedPathId={selectedPathway?.id || null}
              onSelectPath={(p) => setSelectedPathway(p)}
            />
          </div>
        )}

        {!activeTwin &&
          ![
            "repository",
            "geometry",
            "envelope",
            "compute",
            "governance",
            "vessel_operator",
            "vessel_engine",
            "vessel_ccv01",
            "vessel_cavity",
            "vessel_transport",
            "cognition_jemma",
            "cognition_octagon",
            "cognition_delta",
            "cognition_simon"
          ].includes(activeTab) && (
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
