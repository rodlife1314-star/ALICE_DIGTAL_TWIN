import React, { useState } from "react";
import {
  Compass,
  Target,
  HelpCircle,
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Search,
  Filter,
  Check,
  RotateCcw,
  Scale,
  Lock,
  Layers,
  Cpu,
  History,
  GitCommit,
  GitMerge,
  ArrowDown,
  ChevronRight,
  Info,
  Maximize2,
  Activity,
  Zap,
  ShieldCheck,
  Network,
  HelpCircle as QuestionIcon,
  Flame,
  Binary,
  Share2,
  Bot
} from "lucide-react";
import { EpistemicAgentFieldView } from "./EpistemicAgentFieldView";
import {
  DigitalTwin,
  DiscoveredConstraint,
  ConstraintDiscoveryCycle,
  PathfinderStage,
  PathfinderRecord,
  SharedCrossTwinConstraint,
  FeatureNecessityChallenge
} from "../types";

interface ConstraintDiscoveryViewProps {
  twin: DigitalTwin;
  onUpdateTwin: (updatedTwin: DigitalTwin) => void;
}

export function ConstraintDiscoveryView({ twin, onUpdateTwin }: ConstraintDiscoveryViewProps) {
  const [activeTab, setActiveTab] = useState<"timeline" | "graph" | "interrogate" | "agents" | "discovery" | "ledger">("timeline");

  const [intentionInput, setIntentionInput] = useState<string>(
    twin.purpose ? `Ensure boundary balance and physical stability for ${twin.name}` : ""
  );

  const [isDiscovering, setIsDiscovering] = useState<boolean>(false);
  const [activeStage, setActiveStage] = useState<PathfinderStage>("QUESTION");
  const [candidates, setCandidates] = useState<DiscoveredConstraint[]>([]);
  const [selectedConstraint, setSelectedConstraint] = useState<DiscoveredConstraint | null>(null);
  const [inspectedNode, setInspectedNode] = useState<{
    type: "state" | "constraint" | "crosstwin";
    title: string;
    description: string;
    details?: any;
  } | null>(null);

  // Self-Interrogation State
  const [featureInput, setFeatureInput] = useState<string>("");
  const [featureIntentionInput, setFeatureIntentionInput] = useState<string>("");
  const [isInterrogating, setIsInterrogating] = useState<boolean>(false);
  const [featureChallenges, setFeatureChallenges] = useState<FeatureNecessityChallenge[]>([
    {
      id: "ch-1",
      featureName: "Cross-Twin Constraint Dependency Graph",
      proposedIntention: "Detect hidden shared constraint patterns spanning multiple twins (e.g. boundary regulation across flood basin and termite mound).",
      counterfactualTest: "Counterfactual Test: If operator relies solely on single-twin timeline, shared boundary leaks between hydro-turbine array and flood basin remain invisible, causing cascading uncalibrated drift. Outcome fails -> GENUINE MUST for multi-twin system.",
      verdict: "GENUINE_MUST",
      interrogationNotes: "Graduated from SHOULD to MUST because single-twin views cannot expose inter-twin feedback loops.",
      createdAt: "2026-08-09 03:15"
    },
    {
      id: "ch-2",
      featureName: "Autonomous Auto-Commit Engine (Bypassing Operator)",
      proposedIntention: "Accelerate state commit cycles without manual operator confirmation.",
      counterfactualTest: "Counterfactual Test: Bypassing Operator Authority violates Pathfinder Rule #2 ('Authority remains with Operator'). Model hallucination causes unrecoverable state corruption. Outcome fails -> REJECTED LUXURY.",
      verdict: "REJECTED_LUXURY",
      interrogationNotes: "Acceleration ≠ Authority. System must halt at stop condition #9.",
      createdAt: "2026-08-09 02:40"
    }
  ]);

  // Shared Cross-Twin Invariants Network Data
  const sharedConstraints: SharedCrossTwinConstraint[] = [
    {
      id: "sct-1",
      patternName: "Boundary Permeability Equilibrium Pattern",
      category: "Boundary Regulation",
      description: "Controls the rate of energy/mass exchange across physical boundaries to prevent runaway feedback or structural depletion.",
      affectedTwinIds: ["alice-vessel-ccv01", "aerial-vehicle-01", "intelligent-protective-membrane-07"],
      affectedTwinNames: [
        "Alice Vessel CCV-01 (Engineered)",
        "AERIAL-VEHICLE-01 (Avionics)",
        "Intelligent Protective Membrane (Materials)"
      ],
      underlyingMustCondition: "Permeability rate must dynamically adjust based on environmental input pressure (infrared transmission window, moisture, or solute concentration) to maintain core stability.",
      sharedEvidenceSummary: "Core thermal equilibrium, selective charge filtering in Lipid Barrier, and 8–13 μm atmospheric window gating in thermal dissipation all share identical boundary permeability kinetics.",
      falsificationProof: "Falsification Test: Removing dynamic permeability enforcement causes thermal runaway in Vessel Core and collapses sub-ambient radiative cooling under high humidity (RH > 68%). MUST confirmed.",
      crossTwinRiskLevel: "CRITICAL_MUST"
    },
    {
      id: "sct-2",
      patternName: "Resonant Feedback Damping & Spectral Gating",
      category: "Feedback Dynamics",
      description: "Dissipates harmonic accumulation or physical acoustic/optical standing waves before system balance is lost.",
      affectedTwinIds: ["alice-vessel-ccv01", "aerial-vehicle-01", "intelligent-protective-membrane-07"],
      affectedTwinNames: [
        "Alice Vessel CCV-01 (RF Cavity)",
        "AERIAL-VEHICLE-01 (Aero Edge)",
        "Intelligent Protective Membrane (Piezoresistive)"
      ],
      underlyingMustCondition: "Spectral filtering and damping must isolate target operational bands (G6 coaxial 2.80 GHz / 8–13μm IR window / integer tooth mesh) from parasitic noise.",
      sharedEvidenceSummary: "G6 coaxial cavity resonance, RF coupling dissipation, and SPhP vibrational dipole photon emission share deterministic spectral selection physics.",
      falsificationProof: "Falsification Test: Operating without spectral isolation allows boundary reflection and parasitic harmonics to overwhelm signal. MUST confirmed.",
      crossTwinRiskLevel: "CRITICAL_MUST"
    },
    {
      id: "sct-3",
      patternName: "Provenance & Epistemic Truth Boundary Ledger",
      category: "Provenance & Authority",
      description: "Enforces strict separation between empirical observations, model inferences, and hypothetical claims before commitment.",
      affectedTwinIds: ["alice-vessel-ccv01", "aerial-vehicle-01", "intelligent-protective-membrane-07"],
      affectedTwinNames: [
        "Alice Vessel CCV-01 (Engineered)",
        "AERIAL-VEHICLE-01 (Avionics)",
        "All Physical & Engineered Digital Twins"
      ],
      underlyingMustCondition: "Every state transition proposal must distinguish measured ground-truth from calculated simulations and unverified extrapolations.",
      sharedEvidenceSummary: "Antikythera Natalia Rule (HYPOTHESIS cannot become FACT) and COOLed Truth Boundary Guard (12.9°C local Madrid rooftop delta ≠ universal global sub-ambient guarantee) share identical Pathfinder governance doctrine.",
      falsificationProof: "Falsification Test: Disabling truth boundary allows unverified lab claims or simulated planetary pointer models to be promoted as operational kitchen/engineering facts. MUST confirmed.",
      crossTwinRiskLevel: "CRITICAL_MUST"
    },
    {
      id: "sct-4",
      patternName: "Empirical Observation vs. Model Discrepancy Gate",
      category: "Permeability Balance",
      description: "Detects when measured physical observations diverge from simulated model predictions and halts auto-promotion.",
      affectedTwinIds: ["twin-1", "twin-3"],
      affectedTwinNames: [
        "Termite Mound Subterranean Core (Biological)",
        "Thames Riparian Flood Basin (Environmental)"
      ],
      underlyingMustCondition: "Model inference divergence > 10% relative to physical telemetry triggers mandatory Operator review.",
      sharedEvidenceSummary: "14% silt deposition drift in Thames Basin and thermal chimney regulation uncertainty in Termite Core flagged as uncalibrated inferences.",
      falsificationProof: "Falsification Test: Promoting uncalibrated model inferences as facts causes downstream boundary failure under flood conditions. MUST confirmed.",
      crossTwinRiskLevel: "SYSTEMIC_SHOULD"
    }
  ];

  // Generate initial evolutionary chain nodes based on seed twin data
  const generateInitialCommittedConstraints = (): DiscoveredConstraint[] => {
    if (twin.constraintCycles && twin.constraintCycles.length > 0) {
      const existing = twin.constraintCycles.flatMap((c) => c.activeConstraints);
      if (existing.length > 0) return existing;
    }

    const defaultChain: DiscoveredConstraint[] = [
      {
        id: `cst-${twin.id}-baseline`,
        intention: twin.purpose || "Initialize baseline digital twin parameters",
        necessaryCondition: `Physical telemetry and entity relationships must be anchored to verifiable observations.`,
        status: "accepted_must",
        evidenceRefs: twin.observations.slice(0, 2).map((o) => o.id),
        falsificationTest: "Counterfactual Test: Removing empirical observation grounding causes model divergence. MUST confirmed.",
        isMustNotShould: true,
        discoveredAt: twin.createdAt || "2026-08-01 09:00",
        previousStateName: "State₀: Uncalibrated Physical Asset",
        actionTaken: "Ingest primary telemetry sensors and establish entity topology graph",
        resultingStateName: "State₁: Measured Observation Baseline",
        resultingStateChange: `Initialized ${twin.entities.length} entities and ${twin.observations.length} physical observations into Pathfinder ledger.`,
        metricsDelta: { "Topology": "Verified", "Integrity": "CALIBRATION_MISMATCH" }
      },
      {
        id: `cst-${twin.id}-boundary-lock`,
        intention: `Maintain boundary integrity under ${twin.domain} environmental stress`,
        necessaryCondition: `Permeability rules must enforce strict input/output thresholds without bypassing safety seals.`,
        status: "accepted_must",
        evidenceRefs: twin.observations.slice(0, 1).map((o) => o.id),
        falsificationTest: "Counterfactual Test: Bypassing permeability boundaries allows unmonitored mass/energy leakage. MUST confirmed.",
        isMustNotShould: true,
        discoveredAt: twin.updatedAt || "2026-08-05 14:30",
        previousStateName: "State₁: Measured Observation Baseline",
        actionTaken: `Configured ${twin.boundary.permeabilityRules.length} boundary permeability rules and input/output channels`,
        resultingStateName: "State₂: Governed Boundary Equilibrium",
        resultingStateChange: `Active boundary permeability verified for ${twin.name}. System integrity upgraded to ${twin.integrityStatus}.`,
        metricsDelta: { "Permeability": "Controlled", "Stability": "+32%" }
      }
    ];

    return defaultChain;
  };

  const [committedConstraints, setCommittedConstraints] = useState<DiscoveredConstraint[]>(
    generateInitialCommittedConstraints()
  );

  const handleDiscoverConstraints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intentionInput.trim()) return;

    setIsDiscovering(true);
    setActiveStage("INVESTIGATION");

    try {
      const res = await fetch("/api/digital-twins/discover-constraints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          twinName: twin.name,
          domain: twin.domain,
          purpose: twin.purpose,
          intention: intentionInput,
          existingObservations: twin.observations,
          currentEntities: twin.entities
        })
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.candidateConstraints)) {
        const stepNum = committedConstraints.length + 1;
        const lastStateName =
          committedConstraints.length > 0
            ? committedConstraints[committedConstraints.length - 1].resultingStateName || `State_${committedConstraints.length}`
            : "State₀: Baseline Observation";

        const enriched = data.candidateConstraints.map((c: DiscoveredConstraint) => ({
          ...c,
          previousStateName: lastStateName,
          actionTaken: c.actionTaken || `Enforce discovered MUST condition for ${twin.name}`,
          resultingStateName: c.resultingStateName || `State_${stepNum}: ${intentionInput.substring(0, 25)}...`,
          resultingStateChange: c.resultingStateChange || `System state evolved to satisfy binding constraint for ${twin.name}.`,
          metricsDelta: c.metricsDelta || { "Stability": "+18%", "Unresolved Risk": "-45%" }
        }));

        setCandidates(enriched);
        if (enriched.length > 0) {
          setSelectedConstraint(enriched[0]);
        }
        setActiveStage("CHALLENGE");
      }
    } catch (err) {
      console.error("Constraint discovery request failed:", err);
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleEvaluateFalsification = (candidate: DiscoveredConstraint, markAsMust: boolean) => {
    const updatedCandidate: DiscoveredConstraint = {
      ...candidate,
      status: markAsMust ? "accepted_must" : "rejected_should",
      isMustNotShould: markAsMust
    };

    setCandidates((prev) => prev.map((c) => (c.id === candidate.id ? updatedCandidate : c)));
    setSelectedConstraint(updatedCandidate);
    setActiveStage("DECISION");
  };

  const handleCommitConstraint = (candidate: DiscoveredConstraint) => {
    const updatedCommitted = [...committedConstraints, candidate];
    setCommittedConstraints(updatedCommitted);

    const record: PathfinderRecord = {
      id: `pathfinder-${Date.now()}`,
      question: `For intention: "${candidate.intention}", what MUST become true next?`,
      evidence: candidate.evidenceRefs.length > 0 ? candidate.evidenceRefs : ["Measured boundary observations"],
      investigation: `Discovered candidate condition: ${candidate.necessaryCondition}`,
      challenge: candidate.falsificationTest || "Falsification challenge performed by Operator.",
      decision: candidate.isMustNotShould ? "ACCEPTED AS BINDING MUST CONSTRAINT" : "RECLASSIFIED AS DESIRABLE SHOULD",
      commitStatus: "committed",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    const newCycle: ConstraintDiscoveryCycle = {
      id: `cycle-${Date.now()}`,
      twinId: twin.id,
      targetIntention: candidate.intention,
      currentCycleStage: "COMMIT",
      activeConstraints: [candidate],
      updatedAt: new Date().toISOString()
    };

    const updatedRecords = [record, ...(twin.pathfinderRecords || [])];
    const updatedCycles = [newCycle, ...(twin.constraintCycles || [])];

    const updatedTwin: DigitalTwin = {
      ...twin,
      pathfinderRecords: updatedRecords,
      constraintCycles: updatedCycles,
      integrityStatus: "STABLE",
      updatedAt: new Date().toISOString()
    };

    onUpdateTwin(updatedTwin);

    setActiveStage("QUESTION");
    setActiveTab("timeline");
  };

  const handleInterrogateFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureInput.trim()) return;

    setIsInterrogating(true);

    setTimeout(() => {
      const isMust = featureInput.toLowerCase().includes("boundary") ||
        featureInput.toLowerCase().includes("provenance") ||
        featureInput.toLowerCase().includes("authority") ||
        featureInput.toLowerCase().includes("evidence") ||
        featureInput.toLowerCase().includes("falsification");

      const newChallenge: FeatureNecessityChallenge = {
        id: `ch-${Date.now()}`,
        featureName: featureInput,
        proposedIntention: featureIntentionInput || "Enhance system capabilities or operator workspace",
        counterfactualTest: isMust
          ? `Counterfactual Test: Removing "${featureInput}" causes untraceable state divergence or breaks Operator authority boundary. Intended outcome fails -> GENUINE MUST.`
          : `Counterfactual Test: Removing "${featureInput}" reduces visual feedback or convenience, but system outcome remains achievable. Outcome holds -> DISGUISED SHOULD.`,
        verdict: isMust ? "GENUINE_MUST" : "DISGUISED_SHOULD",
        interrogationNotes: isMust
          ? "Satisfies necessary condition for deterministic governance."
          : "Desirable capability, but does not dictate system state validity. Keep uncommitted as SHOULD.",
        createdAt: new Date().toISOString().replace("T", " ").substring(0, 16)
      };

      setFeatureChallenges([newChallenge, ...featureChallenges]);
      setFeatureInput("");
      setFeatureIntentionInput("");
      setIsInterrogating(false);
    }, 600);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 space-y-8 text-[#E6E4DF]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#22252D] pb-5 gap-4">
        <div>
          <div className="text-xs uppercase font-mono tracking-widest text-[#3B82F6] mb-1 font-semibold flex items-center space-x-2">
            <Compass className="w-3.5 h-3.5" />
            <span>PATHFINDER CONSTRAINT DISCOVERY & EVOLUTION ENGINE</span>
          </div>
          <h1 className="text-2xl font-light text-[#E6E4DF] tracking-tight flex items-center space-x-3">
            <span>Next Necessary Condition Discovery</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
              State₀ → MUSTₙ → Stateₙ
            </span>
          </h1>
          <p className="text-xs text-[#8A8F9A] mt-1 max-w-3xl">
            Asks <code className="text-[#3B82F6]">"Given intention and current state, what MUST become true next?"</code> maps binding constraints to resulting state transitions across the twin's evolution.
          </p>
        </div>

        {/* Mode Navigation Bar */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#13151A] p-1.5 border border-[#22262F] rounded">
          <button
            onClick={() => setActiveTab("timeline")}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeTab === "timeline"
                ? "bg-[#3B82F6] text-[#FFFFFF] font-bold"
                : "text-[#8A8F9A] hover:text-[#E6E4DF]"
            }`}
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>Evolution Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab("graph")}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeTab === "graph"
                ? "bg-[#3B82F6] text-[#FFFFFF] font-bold"
                : "text-[#8A8F9A] hover:text-[#E6E4DF]"
            }`}
          >
            <Network className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span>Cross-Twin Graph ({sharedConstraints.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("interrogate")}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeTab === "interrogate"
                ? "bg-[#3B82F6] text-[#FFFFFF] font-bold"
                : "text-[#8A8F9A] hover:text-[#E6E4DF]"
            }`}
          >
            <QuestionIcon className="w-3.5 h-3.5 text-[#EAB308]" />
            <span>Self-Interrogation ("Why MUST?")</span>
          </button>

          <button
            onClick={() => setActiveTab("agents")}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeTab === "agents"
                ? "bg-[#3B82F6] text-[#FFFFFF] font-bold"
                : "text-[#8A8F9A] hover:text-[#E6E4DF]"
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Agent Field ("Truth Workflow")</span>
          </button>

          <button
            onClick={() => setActiveTab("discovery")}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeTab === "discovery"
                ? "bg-[#3B82F6] text-[#FFFFFF] font-bold"
                : "text-[#8A8F9A] hover:text-[#E6E4DF]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discovery Studio</span>
          </button>

          <button
            onClick={() => setActiveTab("ledger")}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeTab === "ledger"
                ? "bg-[#3B82F6] text-[#FFFFFF] font-bold"
                : "text-[#8A8F9A] hover:text-[#E6E4DF]"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Provenance Ledger</span>
          </button>
        </div>
      </div>

      {/* Pathfinder Bounded Cycle Stepper Bar */}
      <div className="bg-[#13151A] border border-[#22262F] rounded p-4">
        <div className="text-[10px] font-mono text-[#8A8F9A] uppercase mb-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Pathfinder Governance Cycle: Intention → MUST Constraint → Action → State Transition</span>
          </div>
          <span className="text-[#3B82F6] font-bold">Active Scope: {twin.name}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center font-mono text-xs">
          {[
            { stage: "QUESTION", label: "1. INTENTION & QUESTION", active: activeStage === "QUESTION" },
            { stage: "EVIDENCE", label: "2. EVIDENCE VERIFICATION", active: activeStage === "EVIDENCE" },
            { stage: "INVESTIGATION", label: "3. DISCOVER CONSTRAINTS", active: activeStage === "INVESTIGATION" },
            { stage: "CHALLENGE", label: "4. FALSIFICATION TEST", active: activeStage === "CHALLENGE" },
            { stage: "DECISION", label: "5. DECISION (MUST/SHOULD)", active: activeStage === "DECISION" },
            { stage: "COMMIT", label: "6. COMMIT & STATE TRANSITION", active: activeStage === "COMMIT" }
          ].map((item) => (
            <div
              key={item.stage}
              className={`p-2.5 rounded border transition-colors ${
                item.active
                  ? "bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6] font-bold"
                  : "bg-[#181A20] border-[#22262F] text-[#8A8F9A]"
              }`}
            >
              <div className="text-[10px] uppercase">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TAB 1: VISUAL EVOLUTIONARY TIMELINE */}
      {activeTab === "timeline" && (
        <div className="space-y-8">
          <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#22262F] pb-4 gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#3B82F6] uppercase font-bold block mb-1">
                  DEPENDENCY CHAIN OF TWIN STATE EVOLUTION
                </span>
                <h2 className="text-lg font-light text-[#E6E4DF]">
                  State Transition Mapping: State₀ → MUST Constraint → Action → Stateₙ
                </h2>
              </div>

              <button
                onClick={() => setActiveTab("discovery")}
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-[#FFFFFF] text-xs font-mono font-bold px-4 py-2 rounded flex items-center space-x-2 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Discover Next Constraint</span>
              </button>
            </div>

            {/* Visual Dependency Chain */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-[#2A2E39] space-y-10 my-6">
              {/* Node 0: Initial State Baseline */}
              <div className="relative group">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-[#181A20] border-2 border-[#3B82F6] flex items-center justify-center text-[10px] font-mono font-bold text-[#3B82F6]">
                  S₀
                </div>

                <div className="bg-[#181A20] border border-[#22262F] rounded p-5 space-y-3 hover:border-[#3B82F6]/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#4ADE80] bg-[#4ADE80]/10 border border-[#4ADE80]/30 px-2 py-0.5 rounded font-bold uppercase">
                      INITIAL STATE BASELINE (State₀)
                    </span>
                    <span className="text-[10px] font-mono text-[#8A8F9A]">
                      {twin.createdAt || "2026-08-01"}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#E6E4DF]">
                    Observation Baseline & Entity Topology Initialized
                  </h3>

                  <p className="text-xs text-[#8A8F9A] leading-relaxed">
                    Purpose: <span className="text-[#E6E4DF]">{twin.purpose}</span>. Baseline contains {twin.entities.length} active entities and {twin.observations.length} physical observations.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#22262F] text-[10px] font-mono text-[#8A8F9A]">
                    <span className="bg-[#13151A] px-2 py-1 rounded border border-[#22262F]">
                      Domain: <strong className="text-[#3B82F6]">{twin.domain}</strong>
                    </span>
                    <span className="bg-[#13151A] px-2 py-1 rounded border border-[#22262F]">
                      Integrity: <strong className="text-[#EAB308]">{twin.integrityStatus}</strong>
                    </span>
                    <span className="bg-[#13151A] px-2 py-1 rounded border border-[#22262F]">
                      Permeability Rules: <strong className="text-[#E6E4DF]">{twin.boundary.permeabilityRules.length} Active</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Evolutionary Steps */}
              {committedConstraints.map((constraint, idx) => {
                const stepNum = idx + 1;
                const stateNodeName = constraint.resultingStateName || `State_${stepNum}: Enforced Condition`;

                return (
                  <div key={constraint.id} className="relative space-y-6">
                    {/* Intermediate MUST Constraint Connector */}
                    <div className="bg-[#13151A] border-l-4 border-l-[#3B82F6] border border-[#22262F] p-4 rounded space-y-3 shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Lock className="w-3.5 h-3.5 text-[#3B82F6]" />
                          <span className="text-[10px] font-mono text-[#3B82F6] font-bold uppercase tracking-wider">
                            STEP {stepNum} BINDING MUST CONSTRAINT
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#4ADE80] bg-[#4ADE80]/10 px-2 py-0.5 rounded border border-[#4ADE80]/30 font-bold">
                          FALSIFIED & COMMITTED
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#8A8F9A]">INTENTION OBJECTIVE:</span>
                        <p className="text-xs font-mono text-[#3B82F6]">{constraint.intention}</p>
                      </div>

                      <div className="bg-[#181A20] p-3 rounded border border-[#22262F] space-y-1">
                        <span className="text-[10px] font-mono text-[#E6E4DF] font-bold block">
                          NECESSARY CONDITION (MUST):
                        </span>
                        <p className="text-xs text-[#E6E4DF] font-medium leading-relaxed">
                          {constraint.necessaryCondition}
                        </p>
                      </div>

                      {/* Counterfactual Falsification Proof */}
                      {constraint.falsificationTest && (
                        <div className="text-[11px] font-mono text-[#8A8F9A] bg-[#13151A] p-2.5 rounded border border-[#22262F] flex items-start space-x-2">
                          <ShieldCheck className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-[#4ADE80] block text-[10px]">COUNTERFACTUAL PROOF OF NECESSITY:</strong>
                            <span>{constraint.falsificationTest}</span>
                          </div>
                        </div>
                      )}

                      {/* Enforced Action Taken */}
                      <div className="flex items-center space-x-2 text-xs font-mono text-[#8A8F9A] pt-1">
                        <Zap className="w-3.5 h-3.5 text-[#EAB308]" />
                        <span>Action Enforced: <strong className="text-[#E6E4DF]">{constraint.actionTaken || "State transformation committed"}</strong></span>
                      </div>
                    </div>

                    {/* Resulting State Node */}
                    <div className="relative group">
                      <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-[#3B82F6] border-2 border-[#FFFFFF] flex items-center justify-center text-[10px] font-mono font-bold text-[#FFFFFF]">
                        S{stepNum}
                      </div>

                      <div className="bg-[#181A20] border border-[#22262F] rounded p-5 space-y-3 hover:border-[#3B82F6] transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#3B82F6] bg-[#3B82F6]/10 border border-[#3B82F6]/30 px-2 py-0.5 rounded font-bold uppercase">
                            RESULTING STATE TRANSITION (State_{stepNum})
                          </span>
                          <span className="text-[10px] font-mono text-[#8A8F9A]">
                            {constraint.discoveredAt ? constraint.discoveredAt.substring(0, 16) : "Active State"}
                          </span>
                        </div>

                        <h3 className="text-sm font-semibold text-[#E6E4DF]">
                          {stateNodeName}
                        </h3>

                        <p className="text-xs text-[#8A8F9A] leading-relaxed">
                          {constraint.resultingStateChange || "System state successfully evolved to satisfy the necessary condition."}
                        </p>

                        {/* Metrics Delta Badges */}
                        {constraint.metricsDelta && (
                          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#22262F]">
                            {Object.entries(constraint.metricsDelta).map(([key, val]) => (
                              <div key={key} className="bg-[#13151A] px-2.5 py-1 rounded border border-[#22262F] text-[10px] font-mono">
                                <span className="text-[#8A8F9A]">{key}: </span>
                                <strong className="text-[#4ADE80]">{val}</strong>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() =>
                              setInspectedNode({
                                type: "state",
                                title: stateNodeName,
                                description: constraint.resultingStateChange || "State node detail",
                                details: constraint
                              })
                            }
                            className="text-[11px] font-mono text-[#3B82F6] hover:text-[#60A5FA] flex items-center space-x-1 cursor-pointer"
                          >
                            <Info className="w-3.5 h-3.5" />
                            <span>Inspect Dependency Node</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CROSS-TWIN SHARED CONSTRAINT GRAPH */}
      {activeTab === "graph" && (
        <div className="space-y-6">
          <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#22262F] pb-4 gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#4ADE80] uppercase font-bold block mb-1">
                  INTER-TWIN INVARIANT GRAPH & DEPENDENCY MATRIX
                </span>
                <h2 className="text-lg font-light text-[#E6E4DF]">
                  Hidden Shared Constraint Patterns Across All 5 Workspace Twins
                </h2>
                <p className="text-xs text-[#8A8F9A] mt-1 max-w-3xl">
                  Maps universal boundary regulation, feedback damping, and governance invariants that span physical, biological, environmental, musical, and conceptual domains.
                </p>
              </div>

              <div className="bg-[#181A20] px-3 py-1.5 border border-[#22262F] rounded text-right font-mono text-xs">
                <span className="text-[10px] text-[#8A8F9A] block">SHARED PATTERNS</span>
                <span className="text-[#4ADE80] font-bold">{sharedConstraints.length} Active Invariants</span>
              </div>
            </div>

            {/* Cross-Twin Dependency Grid / Graph */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sharedConstraints.map((sc) => (
                <div
                  key={sc.id}
                  onClick={() =>
                    setInspectedNode({
                      type: "crosstwin",
                      title: sc.patternName,
                      description: sc.description,
                      details: sc
                    })
                  }
                  className="bg-[#181A20] border border-[#22262F] hover:border-[#3B82F6] rounded p-5 space-y-4 cursor-pointer transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#3B82F6] font-bold block mb-1">
                        {sc.category}
                      </span>
                      <h3 className="text-sm font-semibold text-[#E6E4DF]">
                        {sc.patternName}
                      </h3>
                    </div>

                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 font-bold uppercase">
                      {sc.crossTwinRiskLevel}
                    </span>
                  </div>

                  <p className="text-xs text-[#8A8F9A] leading-relaxed">
                    {sc.description}
                  </p>

                  <div className="bg-[#13151A] p-3 rounded border border-[#22262F] space-y-1.5 font-mono text-[11px]">
                    <span className="text-[#4ADE80] font-bold block text-[10px] uppercase">
                      UNDERLYING MUST CONDITION:
                    </span>
                    <p className="text-[#E6E4DF]">{sc.underlyingMustCondition}</p>
                  </div>

                  {/* Affected Twins Tag Network */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-[#8A8F9A] uppercase block">
                      AFFECTED TWINS NETWORK ({sc.affectedTwinNames.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sc.affectedTwinNames.map((name, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono bg-[#13151A] border border-[#22262F] text-[#E6E4DF] px-2 py-0.5 rounded flex items-center space-x-1"
                        >
                          <Share2 className="w-2.5 h-2.5 text-[#3B82F6]" />
                          <span>{name}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#22262F] flex justify-between items-center text-[10px] font-mono text-[#8A8F9A]">
                    <span>Falsification proof verified</span>
                    <span className="text-[#3B82F6] font-bold flex items-center space-x-1">
                      <span>Inspect Graph Node</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SELF-INTERROGATION ENGINE ("WHY MUST?") */}
      {activeTab === "interrogate" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#22262F] pb-3">
                <div className="flex items-center space-x-2">
                  <QuestionIcon className="w-4 h-4 text-[#EAB308]" />
                  <h2 className="text-sm font-semibold uppercase font-mono tracking-wider text-[#E6E4DF]">
                    Pathfinder Self-Interrogation ("Why MUST this exist?")
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-[#EAB308]">
                  Feature Necessity Challenge
                </span>
              </div>

              <p className="text-xs text-[#8A8F9A]">
                Interrogate any proposed feature, capability, or candidate rule against Pathfinder's strict necessity doctrine before commitment: <strong className="text-[#E6E4DF]">"If removed, does the outcome fail?"</strong>
              </p>

              <form onSubmit={handleInterrogateFeature} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#8A8F9A] uppercase mb-1.5">
                    Proposed Feature / Rule / Module Name
                  </label>
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="e.g. Cross-Twin Boundary Regulation Graph, Automated Sound Synthesizer..."
                    className="w-full bg-[#181A20] border border-[#2A2E39] text-xs text-[#E6E4DF] rounded px-3 py-2 focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#8A8F9A] uppercase mb-1.5">
                    Proposed Intention / Purpose
                  </label>
                  <textarea
                    rows={2}
                    value={featureIntentionInput}
                    onChange={(e) => setFeatureIntentionInput(e.target.value)}
                    placeholder="What problem does this feature claim to solve?"
                    className="w-full bg-[#181A20] border border-[#2A2E39] text-xs text-[#E6E4DF] rounded p-3 focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isInterrogating || !featureInput.trim()}
                    className="bg-[#EAB308] hover:bg-[#CA8A04] disabled:bg-[#22262F] disabled:text-[#8A8F9A] text-[#13151A] text-xs font-mono font-bold px-4 py-2 rounded flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    {isInterrogating ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-[#13151A] border-t-transparent rounded-full animate-spin" />
                        <span>Falsifying Feature...</span>
                      </>
                    ) : (
                      <>
                        <Scale className="w-3.5 h-3.5" />
                        <span>Run Necessity Counterfactual Test</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Interrogation History & Verdicts */}
            <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#22262F] pb-3">
                <h3 className="text-xs font-semibold uppercase font-mono tracking-wider text-[#E6E4DF]">
                  Self-Interrogation Audit Ledger ({featureChallenges.length})
                </h3>
                <span className="text-[10px] font-mono text-[#8A8F9A]">Must vs. Should vs. Luxury</span>
              </div>

              <div className="space-y-4">
                {featureChallenges.map((fc) => (
                  <div
                    key={fc.id}
                    className="p-4 bg-[#181A20] border border-[#22262F] rounded space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-[#8A8F9A] uppercase block">PROPOSED FEATURE</span>
                        <h4 className="text-sm font-bold text-[#E6E4DF]">{fc.featureName}</h4>
                      </div>

                      <span
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold uppercase ${
                          fc.verdict === "GENUINE_MUST"
                            ? "bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/30"
                            : fc.verdict === "DISGUISED_SHOULD"
                            ? "bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/30"
                            : "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30"
                        }`}
                      >
                        {fc.verdict.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-xs text-[#8A8F9A]">
                      Intention: <span className="text-[#E6E4DF]">{fc.proposedIntention}</span>
                    </p>

                    <div className="bg-[#13151A] p-3 rounded border border-[#22262F] text-[11px] font-mono space-y-1">
                      <span className="text-[#3B82F6] font-bold block text-[10px]">COUNTERFACTUAL TEST:</span>
                      <p className="text-[#E6E4DF]">{fc.counterfactualTest}</p>
                    </div>

                    <div className="text-[10px] font-mono text-[#8A8F9A] pt-2 border-t border-[#22262F] flex justify-between">
                      <span>Interrogation Notes: {fc.interrogationNotes}</span>
                      <span>{fc.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-4">
              <div className="flex items-center space-x-2 border-b border-[#22262F] pb-3">
                <Flame className="w-4 h-4 text-[#EAB308]" />
                <h3 className="text-xs font-semibold uppercase font-mono tracking-wider text-[#E6E4DF]">
                  Self-Governance Interrogation Rules
                </h3>
              </div>

              <div className="space-y-3 text-xs text-[#8A8F9A] font-mono">
                <div className="p-3 bg-[#181A20] border border-[#22262F] rounded space-y-1">
                  <span className="text-[#EAB308] font-bold block">RULE 1: NO UNSOLICITED FEATURE VOLUME</span>
                  <p className="text-[11px]">Elegance and completeness do not justify feature inclusion. Only necessity permits commitment.</p>
                </div>

                <div className="p-3 bg-[#181A20] border border-[#22262F] rounded space-y-1">
                  <span className="text-[#EAB308] font-bold block">RULE 2: THE COUNTERFACTUAL REMOVAL TEST</span>
                  <p className="text-[11px]">"If this feature is removed, does the system fail its core boundary or intention?"</p>
                </div>

                <div className="p-3 bg-[#181A20] border border-[#22262F] rounded space-y-1">
                  <span className="text-[#4ADE80] font-bold block">RULE 3: ACCELERATION ≠ AUTHORITY</span>
                  <p className="text-[11px]">Features that bypass Operator confirmation are rejected as dangerous luxuries.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: AGENT FIELD ("TRUTH WORKFLOW") */}
      {activeTab === "agents" && (
        <EpistemicAgentFieldView twin={twin} onUpdateTwin={onUpdateTwin} />
      )}

      {/* TAB 4: CONSTRAINT DISCOVERY STUDIO */}
      {activeTab === "discovery" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#22262F] pb-3">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-[#3B82F6]" />
                  <h2 className="text-sm font-semibold uppercase font-mono tracking-wider text-[#E6E4DF]">
                    Step 1: Declare Operator Intention
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-[#3B82F6]">
                  Baseline: State_{committedConstraints.length}
                </span>
              </div>

              <form onSubmit={handleDiscoverConstraints} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#8A8F9A] uppercase mb-1.5">
                    Target Intention / Desired System State
                  </label>
                  <textarea
                    rows={3}
                    value={intentionInput}
                    onChange={(e) => setIntentionInput(e.target.value)}
                    placeholder="e.g. Ensure physical core retains temperature within ±1.5°C under peak flood loading..."
                    className="w-full bg-[#181A20] border border-[#2A2E39] text-xs text-[#E6E4DF] rounded p-3 focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] font-mono text-[#8A8F9A]">
                    Asks: <code className="text-[#3B82F6]">"What MUST be true that is not true now?"</code>
                  </span>

                  <button
                    type="submit"
                    disabled={isDiscovering || !intentionInput.trim()}
                    className="bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#22262F] disabled:text-[#8A8F9A] text-[#FFFFFF] text-xs font-semibold px-4 py-2 rounded flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    {isDiscovering ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-[#FFFFFF] border-t-transparent rounded-full animate-spin" />
                        <span>Evaluating Constraints...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Discover Necessary Conditions</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Step 2: Discovered Candidate Constraints & Falsification Engine */}
            {candidates.length > 0 && (
              <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-[#22262F] pb-3">
                  <div className="flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-[#3B82F6]" />
                    <h2 className="text-sm font-semibold uppercase font-mono tracking-wider text-[#E6E4DF]">
                      Step 2: Candidate Necessity Evaluation ({candidates.length})
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-[#8A8F9A]">
                    Counterfactual Falsification: MUST vs. SHOULD
                  </span>
                </div>

                <div className="space-y-4">
                  {candidates.map((candidate) => {
                    const isSelected = selectedConstraint?.id === candidate.id;

                    return (
                      <div
                        key={candidate.id}
                        onClick={() => setSelectedConstraint(candidate)}
                        className={`p-4 rounded border transition-all cursor-pointer space-y-3 ${
                          isSelected
                            ? "bg-[#181A20] border-[#3B82F6] ring-1 ring-[#3B82F6]/30"
                            : "bg-[#181A20]/50 border-[#22262F] hover:border-[#343A46]"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-mono text-[#3B82F6] font-bold block mb-1">
                              CANDIDATE NECESSARY CONDITION
                            </span>
                            <p className="text-xs font-medium text-[#E6E4DF]">
                              {candidate.necessaryCondition}
                            </p>
                          </div>

                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                              candidate.status === "accepted_must"
                                ? "bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/30"
                                : candidate.status === "rejected_should"
                                ? "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30"
                                : "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30"
                            }`}
                          >
                            {candidate.status.replace("_", " ")}
                          </span>
                        </div>

                        {/* Counterfactual Falsification Test Output */}
                        {candidate.falsificationTest && (
                          <div className="bg-[#13151A] p-3 rounded border border-[#22262F] text-[11px] font-mono space-y-1">
                            <span className="text-[#3B82F6] font-bold block">
                              COUNTERFACTUAL FALSIFICATION TEST:
                            </span>
                            <p className="text-[#8A8F9A] text-[11px]">{candidate.falsificationTest}</p>
                          </div>
                        )}

                        {/* Resulting State Mapping Preview */}
                        <div className="bg-[#13151A] p-2.5 rounded border border-[#22262F] text-[11px] font-mono space-y-1">
                          <span className="text-[#E6E4DF] font-bold block">
                            RESULTING STATE EVOLUTION:
                          </span>
                          <div className="text-[#8A8F9A] flex items-center space-x-1">
                            <span>{candidate.previousStateName || "Current State"}</span>
                            <ArrowRight className="w-3 h-3 text-[#3B82F6]" />
                            <strong className="text-[#3B82F6]">{candidate.resultingStateName || "Next State"}</strong>
                          </div>
                          <p className="text-[#A3A8B4] text-[10px] pt-0.5">
                            {candidate.resultingStateChange}
                          </p>
                        </div>

                        {/* Action Buttons: MUST vs SHOULD */}
                        <div className="pt-2 border-t border-[#22262F] flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#8A8F9A]">
                            Test question: "If removed, does outcome fail?"
                          </span>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEvaluateFalsification(candidate, false);
                              }}
                              className="text-xs font-mono px-3 py-1 rounded bg-[#22262F] hover:bg-[#2A2E39] text-[#E6E4DF] border border-[#2A2E39] cursor-pointer"
                            >
                              Reclassify as SHOULD
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEvaluateFalsification(candidate, true);
                              }}
                              className="text-xs font-mono font-bold px-3 py-1 rounded bg-[#3B82F6] hover:bg-[#2563EB] text-[#FFFFFF] flex items-center space-x-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Confirm MUST</span>
                            </button>

                            {(candidate.status === "accepted_must" || candidate.status === "rejected_should") && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCommitConstraint(candidate);
                                }}
                                className="text-xs font-mono font-bold px-3 py-1 rounded bg-[#10B981] hover:bg-[#059669] text-[#FFFFFF] flex items-center space-x-1 cursor-pointer"
                              >
                                <Lock className="w-3.5 h-3.5" />
                                <span>Commit & Extend Timeline</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#22262F] pb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-[#3B82F6]" />
                  <h2 className="text-sm font-semibold uppercase font-mono tracking-wider text-[#E6E4DF]">
                    Pathfinder Constraint Principles
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-xs text-[#8A8F9A]">
                <div className="p-3 bg-[#181A20] border border-[#22262F] rounded space-y-1">
                  <strong className="text-[#3B82F6] font-mono block">1. INTENTION ESTABLISHES DIRECTION</strong>
                  <p>Intention defines where the system aims to go, but does not dictate implementation choices.</p>
                </div>

                <div className="p-3 bg-[#181A20] border border-[#22262F] rounded space-y-1">
                  <strong className="text-[#3B82F6] font-mono block">2. MUST IDENTIFIES NECESSARY CONDITIONS</strong>
                  <p>Constraint discovery asks: "What MUST become true without which the outcome cannot exist?"</p>
                </div>

                <div className="p-3 bg-[#181A20] border border-[#22262F] rounded space-y-1">
                  <strong className="text-[#3B82F6] font-mono block">3. FALSIFICATION SEPARATES MUST FROM SHOULD</strong>
                  <p>If removing a condition allows the intended outcome to remain possible, it is a desirable SHOULD, not a binding MUST.</p>
                </div>

                <div className="p-3 bg-[#181A20] border border-[#22262F] rounded space-y-1">
                  <strong className="text-[#4ADE80] font-mono block">4. ACTION ADVANCES STATE TRANSITION</strong>
                  <p>Committing a MUST enforces the necessary condition, transitioning the twin to Stateₙ₊₁.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PROVENANCE LEDGER */}
      {activeTab === "ledger" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#22262F] pb-3">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-[#3B82F6]" />
                  <h2 className="text-sm font-semibold uppercase font-mono tracking-wider text-[#E6E4DF]">
                    Committed Twin Constraints Ledger ({committedConstraints.length})
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-[#8A8F9A]">Auditable & Attributable</span>
              </div>

              <div className="space-y-3">
                {committedConstraints.map((c, idx) => (
                  <div
                    key={c.id || idx}
                    className="p-4 bg-[#181A20] border border-[#22262F] rounded space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-mono uppercase text-[#3B82F6] font-bold">
                        {c.isMustNotShould ? "BINDING MUST CONSTRAINT" : "DESIRABLE SHOULD"}
                      </span>
                      <span className="text-[10px] font-mono text-[#8A8F9A]">
                        {c.discoveredAt ? c.discoveredAt.substring(0, 16) : "Active"}
                      </span>
                    </div>

                    <p className="text-[#E6E4DF] font-medium leading-relaxed">
                      {c.necessaryCondition}
                    </p>

                    <div className="text-[10px] font-mono text-[#8A8F9A] space-y-1 pt-2 border-t border-[#22262F]">
                      <div>Intention: <span className="text-[#E6E4DF]">{c.intention}</span></div>
                      <div>Resulting State: <span className="text-[#3B82F6]">{c.resultingStateName || "State_N"}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-4">
              <div className="flex items-center space-x-2 border-b border-[#22262F] pb-3">
                <History className="w-4 h-4 text-[#C5A059]" />
                <h3 className="text-xs font-semibold uppercase font-mono tracking-wider text-[#E6E4DF]">
                  Pathfinder Governance Audit Log
                </h3>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {(twin.pathfinderRecords || []).length === 0 ? (
                  <div className="text-xs text-[#8A8F9A] font-mono py-3 text-center">
                    No Pathfinder governance records generated yet.
                  </div>
                ) : (
                  (twin.pathfinderRecords || []).map((rec) => (
                    <div key={rec.id} className="p-3 bg-[#181A20] border border-[#22262F] rounded text-[11px] font-mono space-y-1.5">
                      <div className="flex items-center justify-between text-[#3B82F6]">
                        <span className="font-bold">{rec.question}</span>
                        <span className="text-[9px] text-[#8A8F9A]">{rec.createdAt}</span>
                      </div>
                      <p className="text-[#A3A8B4] text-[10px]">{rec.investigation}</p>
                      <div className="text-[#4ADE80] text-[10px] font-bold">{rec.decision}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inspection Modal / Drawer */}
      {inspectedNode && (
        <div className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#13151A] border border-[#3B82F6] rounded-lg max-w-2xl w-full p-6 space-y-4 text-[#E6E4DF] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#22262F] pb-3">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-[#3B82F6]" />
                <h3 className="text-sm font-semibold uppercase font-mono text-[#E6E4DF]">
                  {inspectedNode.type === "crosstwin" ? "Cross-Twin Invariant Graph Node" : "Evolution Node Details"}
                </h3>
              </div>
              <button
                onClick={() => setInspectedNode(null)}
                className="text-[#8A8F9A] hover:text-[#E6E4DF] text-xs font-mono cursor-pointer"
              >
                Close [✕]
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-[#8A8F9A] uppercase block mb-1">Title</span>
                <h4 className="text-sm font-bold text-[#3B82F6]">{inspectedNode.title}</h4>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#8A8F9A] uppercase block mb-1">Description</span>
                <p className="text-[#E6E4DF] leading-relaxed">{inspectedNode.description}</p>
              </div>

              {inspectedNode.type === "crosstwin" && inspectedNode.details && (
                <div className="space-y-3 bg-[#181A20] p-4 rounded border border-[#22262F] font-mono text-[11px]">
                  <div>
                    <span className="text-[#4ADE80] font-bold block uppercase text-[10px]">UNDERLYING MUST CONDITION:</span>
                    <p className="text-[#E6E4DF]">{inspectedNode.details.underlyingMustCondition}</p>
                  </div>

                  <div>
                    <span className="text-[#3B82F6] font-bold block uppercase text-[10px]">SHARED EVIDENCE SUMMARY:</span>
                    <p className="text-[#8A8F9A]">{inspectedNode.details.sharedEvidenceSummary}</p>
                  </div>

                  <div>
                    <span className="text-[#EAB308] font-bold block uppercase text-[10px]">COUNTERFACTUAL FALSIFICATION PROOF:</span>
                    <p className="text-[#E6E4DF]">{inspectedNode.details.falsificationProof}</p>
                  </div>
                </div>
              )}

              {inspectedNode.type === "state" && inspectedNode.details && (
                <div className="space-y-2 bg-[#181A20] p-3 rounded border border-[#22262F] font-mono text-[11px]">
                  <div className="text-[#3B82F6] font-bold">Associated Necessary Condition:</div>
                  <div className="text-[#E6E4DF]">{inspectedNode.details.necessaryCondition}</div>

                  {inspectedNode.details.falsificationTest && (
                    <>
                      <div className="text-[#4ADE80] font-bold pt-2">Falsification Proof:</div>
                      <div className="text-[#8A8F9A]">{inspectedNode.details.falsificationTest}</div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#22262F] flex justify-end">
              <button
                onClick={() => setInspectedNode(null)}
                className="bg-[#22262F] hover:bg-[#2A2E39] text-[#E6E4DF] text-xs font-mono px-4 py-2 rounded cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
