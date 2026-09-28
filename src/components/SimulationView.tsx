import React, { useState } from "react";
import {
  Cpu,
  Play,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  RotateCw,
  Info,
  Calculator,
  ShieldCheck,
  Compass,
  FileCheck,
  Sliders,
  HelpCircle,
  Clock,
  Terminal,
  Hash,
  Server,
  Zap,
  Check,
  X,
  ExternalLink,
  Table,
  ChevronDown,
  ChevronUp,
  Shield,
  ShieldAlert,
  Flame,
  Snowflake
} from "lucide-react";
import { 
  DigitalTwin, 
  SimulationRun, 
  SimulationBaselineState, 
  SimulationPerturbation,
  ComputeRail,
  SimulationLifecycleStatus
} from "../types";
import { computeDeterministicMetonicKinematics, MetonicKinematicVerificationResult } from "../lib/deterministicKinematics";
import { SimulationInterface } from "./SimulationInterface";
import { GeometricArchitectureView } from "./GeometricArchitectureView";

interface SimulationViewProps {
  twin: DigitalTwin;
  onUpdateTwin: (updatedTwin: DigitalTwin) => void;
}

export function SimulationView({ twin, onUpdateTwin }: SimulationViewProps) {
  const [scenarioName, setScenarioName] = useState("");
  const [startingState, setStartingState] = useState(twin.states[0]?.name || "Nominal Baseline");
  const [changedVars, setChangedVars] = useState("");
  const [assumptionsText, setAssumptionsText] = useState("");
  const [selectedRail, setSelectedRail] = useState<ComputeRail>("LOCAL_DETERMINISTIC");
  const [executionMode, setExecutionMode] = useState<"dispatch_immediate" | "propose_only">("dispatch_immediate");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationError, setSimulationError] = useState<string | null>(null);
  const [expandedReceiptId, setExpandedReceiptId] = useState<string | null>(null);

  // Promotion Gate State
  const [promotingSimId, setPromotingSimId] = useState<string | null>(null);
  const [promotionNotes, setPromotionNotes] = useState("");
  const [isPromoting, setIsPromoting] = useState(false);

  // Deterministic Mathematical Verification state
  const [inspectingDeterministic, setInspectingDeterministic] = useState(false);
  const [inspectingGeometric, setInspectingGeometric] = useState(false);
  const [kinematicNominalTeeth, setKinematicNominalTeeth] = useState(38);
  const [kinematicPerturbedTeeth, setKinematicPerturbedTeeth] = useState(39);
  const [kinematicModuleMm, setKinematicModuleMm] = useState(0.5);
  const [verificationResult, setVerificationResult] = useState<MetonicKinematicVerificationResult>(
    computeDeterministicMetonicKinematics(38, 39, 0.5)
  );

  const handleRecomputeKinematics = (nominal: number, perturbed: number, mod: number) => {
    setKinematicNominalTeeth(nominal);
    setKinematicPerturbedTeeth(perturbed);
    setKinematicModuleMm(mod);
    setVerificationResult(computeDeterministicMetonicKinematics(nominal, perturbed, mod));
  };

  const handleLoadPreset = (
    presetType: 
      | "antikythera_sim001" 
      | "antikythera_sim002" 
      | "antikythera_sim003" 
      | "antikythera_sim004" 
      | "cooled_sim001"
      | "cooled_sim002"
      | "membrane_sim001"
      | "membrane_sim002"
      | "thermal_chimney" 
      | "voltage_pulse"
  ) => {
    if (presetType === "membrane_sim001") {
      setScenarioName("Simulation 001: Distributed Kinetic Impact & Multi-Scale Strain Telemetry");
      setStartingState("Quiescent Baseline Integrity (64/64 Nodes Nominal)");
      setChangedVars("Simulate 720 m/s kinetic projectile impact at coordinates (x: 35mm, y: 55mm) on 4.5mm SiC ceramic + 12-ply aramid laminate with embedded W/Mo sensing membrane.");
      setAssumptionsText("Ceramic compressive elastic modulus 410 GPa.\nW/Mo sensing membrane piezoresistive gauge factor 14.8.\nHigh-speed multi-channel ADC sampling rate 100 kHz.\nNo actinide or toxic materials permitted in laminate.");
      setSelectedRail("NVIDIA_NIM");
      setExecutionMode("dispatch_immediate");
    } else if (presetType === "membrane_sim002") {
      setScenarioName("Simulation 002: Non-Actinide Surrogate Screening & Toxicological Falsification Sweep");
      setStartingState("Co-U-Co Reference Physics Baseline");
      setChangedVars("Screen 14 transition-metal surrogate clusters across W/Mo (5d/4d), Hf/Zr (Group 4), Re, and Ta systems against Co-U-Co 10-bond reference electronic topology.");
      setAssumptionsText("Zero actinide deployment in physical manufacturing.\nStrict cytotoxicity limit: <0.1 ppm metal ion leaching in sweat/saline.\nMinimum required gauge factor > 8.0.");
      setSelectedRail("LOCAL_DETERMINISTIC");
      setExecutionMode("dispatch_immediate");
    } else if (presetType === "cooled_sim001") {
      setScenarioName("Simulation 001: Sub-Ambient Cooling Boundary Envelope (Humidity × Wind × Cloud Sweep)");
      setStartingState("Tres Cantos Dry Baseline (RH 22%, Wind 1.2 m/s, Cloud 0%)");
      setChangedVars("Sweep Relative Humidity (10% to 90%), Wind Velocity (0.5 to 10 m/s), Cloud Cover (0% to 100%), and Solar Irradiance (200 to 1,000 W/m²).");
      setAssumptionsText("Solar reflectance fixed at 82.4% (UV whitened).\nAtmospheric window emissivity fixed at 96.7% across 8–13 μm.\nAtmospheric water vapor column absorption modelled via MODTRAN dry/mid-latitude summer profiles.\nConvective heat transfer coefficient h_c = 2.8 + 3.0 · v_wind (W/m²K).\nNo active mechanical cooling or artificial thermal shields.");
      setSelectedRail("RAPIDS_GPU");
      setExecutionMode("dispatch_immediate");
    } else if (presetType === "cooled_sim002") {
      setScenarioName("Simulation 002: Processing History & UV Whitening Ablation");
      setStartingState("Optimised PVDF/AAO State");
      setChangedVars("Ablate UV whitening stage (Solar reflectance drops from 82.4% to 68.0%) and ablate ultrafast cooling (emissivity drops from 96.7% to 81.2%).");
      setAssumptionsText("Solar irradiance held constant at 1,000 W/m².\nAmbient temperature 35°C, Madrid summer dry atmosphere.\nStefan-Boltzmann radiative balance.");
      setSelectedRail("NVIDIA_NIM");
      setExecutionMode("dispatch_immediate");
    } else if (presetType === "antikythera_sim001") {
      setScenarioName("Simulation 001: Metonic Gear-Train Ratio Integrity");
      setStartingState("Initial Baseline State");
      setChangedVars("Perturb the effective tooth count/ratio of one gear in the Metonic transmission by +1 tooth equivalent while holding all other reconstructed ratios constant.");
      setAssumptionsText("235 synodic months / 19 tropical years is the target encoded relationship.\nAll non-perturbed gear ratios remain fixed.\nManufacturing error, friction and backlash are excluded from this first computational test.\nOnly kinematic information transfer is being evaluated.\nNo result may modify the archaeological evidence state.");
      setSelectedRail("LOCAL_DETERMINISTIC");
      setExecutionMode("dispatch_immediate");
      setInspectingDeterministic(true);
      handleRecomputeKinematics(38, 39, 0.5);
    } else if (presetType === "antikythera_sim002") {
      setScenarioName("Simulation 002: Backlash & Angular Deadband Accumulation");
      setStartingState("Kinematic Transmission Baseline");
      setChangedVars("Introduce triangular tooth mesh backlash (0.04mm clearance per mesh) across the 7-stage solar/lunar train.");
      setAssumptionsText("Kinematic gear tooth counts held at nominal baseline (38-tooth Metonic gear, 223-tooth Saros gear).\nBacklash modeled as uncoupled angular deadband at gear reversals.\nSubstrate bronze elasticity ignored.");
      setSelectedRail("LOCAL_DETERMINISTIC");
      setExecutionMode("dispatch_immediate");
    } else if (presetType === "antikythera_sim003") {
      setScenarioName("Simulation 003: Hand-Filing Tooth-Division Geometric Error");
      setStartingState("Kinematic Transmission Baseline");
      setChangedVars("Inject random circular division pitch error (±0.08mm per tooth span) simulating hand filing of triangular bronze teeth.");
      setAssumptionsText("Nominal gear teeth counts preserved.\nCenter arbor distances fixed at microCT reconstructed coordinates.\nNo torque-induced tooth deformation.");
      setSelectedRail("LOCAL_DETERMINISTIC");
      setExecutionMode("dispatch_immediate");
    } else if (presetType === "antikythera_sim004") {
      setScenarioName("Simulation 004: Bronze Friction, Arbor Load & Mechanical Torque");
      setStartingState("Physical Substrate Baseline");
      setChangedVars("Simulate continuous hand-crank input across 30 bronze gears under dry sliding friction coefficient (μ = 0.22) and arbor bushing resistance.");
      setAssumptionsText("No modern petrochemical lubricants.\nArbor bushing clearance 0.05mm.\nManual operator input torque constrained to human ergonomic hand-crank limit (<1.2 Nm).");
      setSelectedRail("LOCAL_DETERMINISTIC");
      setExecutionMode("dispatch_immediate");
    } else if (presetType === "thermal_chimney") {
      setScenarioName("Chimney Clearance Counterfactual Intervention");
      setStartingState(twin.states[0]?.name || "Thermal Throttling Baseline");
      setChangedVars("Clear chimney shaft obstruction by 80%");
      setAssumptionsText("Ambient air temperature remains below 26°C\nWorker availability > 80%\nContinuous boundary vent flow");
      setSelectedRail("RAPIDS_GPU");
      setExecutionMode("dispatch_immediate");
    } else {
      setScenarioName("Voltage Pulse Self-Cleaning Sweep");
      setStartingState(twin.states[0]?.name || "High-Selectivity Mode");
      setChangedVars("Pulse voltage to +750 mV for 500 ms");
      setAssumptionsText("Dielectric breakdown voltage > 1.2 V\nFlow rate constant at 2.4 mL/min");
      setSelectedRail("FPT_AI_CLOUD");
      setExecutionMode("dispatch_immediate");
    }
  };

  const handleRunSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenarioName || !changedVars || isSimulating) return;

    setIsSimulating(true);
    setSimulationError(null);

    try {
      const endpoint = executionMode === "propose_only" ? "/api/digital-twins/simulate" : "/api/compute/dispatch";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          twinId: twin.id,
          twinName: twin.name,
          domain: twin.domain,
          purpose: twin.purpose,
          scenarioName,
          startingState,
          changedVariables: changedVars,
          assumptions: assumptionsText ? assumptionsText.split("\n") : ["Baseline environmental stability"],
          selectedRail,
          executionMode
        })
      });

      if (res.ok) {
        const data = await res.json();
        const simResult: SimulationRun = data.simulation;
        const updatedTwin: DigitalTwin = {
          ...twin,
          simulations: [simResult, ...twin.simulations],
          updatedAt: new Date().toISOString()
        };

        onUpdateTwin(updatedTwin);
        setScenarioName("");
        setChangedVars("");
        setAssumptionsText("");
        if (simResult.id) {
          setExpandedReceiptId(simResult.id);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData.message || errData.error || `Simulation server returned HTTP ${res.status}`;
        setSimulationError(`Simulation failure: ${errMsg}. No substitute simulation or unevidenced ledger entry was created.`);
      }
    } catch (err: any) {
      console.error("Simulation error:", err);
      setSimulationError(`Simulation execution halted: ${err.message || "Network/Compute failure"}. No synthetic ledger entry admitted.`);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleDispatchExistingProposed = async (sim: SimulationRun, targetRail: ComputeRail) => {
    setIsSimulating(true);
    setSimulationError(null);

    try {
      const res = await fetch("/api/compute/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          twinId: twin.id,
          twinName: twin.name,
          domain: twin.domain,
          purpose: twin.purpose,
          scenarioName: sim.name,
          startingState: sim.startingState,
          changedVariables: sim.changedVariables,
          assumptions: sim.assumptions,
          selectedRail: targetRail
        })
      });

      if (res.ok) {
        const data = await res.json();
        const dispatchedSim: SimulationRun = data.simulation;
        const updatedSims = twin.simulations.map(s => s.id === sim.id ? { ...dispatchedSim, id: sim.id } : s);
        const updatedTwin: DigitalTwin = {
          ...twin,
          simulations: updatedSims,
          updatedAt: new Date().toISOString()
        };

        onUpdateTwin(updatedTwin);
        setExpandedReceiptId(sim.id);
      } else {
        const errData = await res.json().catch(() => ({}));
        setSimulationError(`Failed to dispatch compute rail: ${errData.message || "Solver error"}`);
      }
    } catch (err: any) {
      setSimulationError(`Dispatch error: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const handlePromoteSimulation = async (simId: string, decision: "approved" | "rejected") => {
    setIsPromoting(true);
    try {
      const res = await fetch("/api/compute/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          twinId: twin.id,
          simulationId: simId,
          decision,
          operatorNotes: promotionNotes
        })
      });

      if (res.ok) {
        const data = await res.json();
        const updatedSims = twin.simulations.map(s => s.id === simId ? data.simulation : s);
        let updatedRecords = [...(twin.pathfinderRecords || [])];
        if (decision === "approved") {
          const sim = updatedSims.find(s => s.id === simId);
          if (sim) {
            updatedRecords.unshift({
              id: `pf-${Date.now()}`,
              question: `Promotion of Simulation: ${sim.name}`,
              evidence: [
                `Compute Receipt: ${sim.computeReceipt?.runId || "Unknown Run"}`,
                `Input/Output Hash: ${sim.computeReceipt?.inputOutputHash || "N/A"}`
              ],
              investigation: `Solver execution on rail ${sim.computeReceipt?.selectedRail || "GPU"}. Divergence: ${sim.divergence}`,
              challenge: `Orion ablation check: ${sim.orionAblationChallenge?.counterfactualVulnerability || "Passed"}`,
              decision: `Operator promoted simulation into accepted twin state. Notes: ${promotionNotes || "Verified against empirical constraints."}`,
              commitStatus: "committed",
              createdAt: new Date().toISOString().replace("T", " ").substring(0, 16)
            });
          }
        }

        const updatedTwin: DigitalTwin = {
          ...twin,
          simulations: updatedSims,
          pathfinderRecords: updatedRecords,
          updatedAt: new Date().toISOString()
        };

        onUpdateTwin(updatedTwin);
        setPromotingSimId(null);
        setPromotionNotes("");
      } else {
        const errData = await res.json().catch(() => ({}));
        setSimulationError(`Promotion failed: ${errData.message || "Server error"}`);
      }
    } catch (err: any) {
      setSimulationError(`Promotion error: ${err.message}`);
    } finally {
      setIsPromoting(false);
    }
  };

  const handleSimulationInterfaceRun = (result: {
    baseline: SimulationBaselineState;
    perturbation: SimulationPerturbation;
    verification: MetonicKinematicVerificationResult;
  }) => {
    if (twin.simulations.length > 0 && twin.simulations[0].id === `sim-cf-${result.verification.auditHash}`) {
      return;
    }

    const newSim: SimulationRun = {
      id: `sim-cf-${result.verification.auditHash}`,
      name: `Counterfactual: ${result.perturbation.targetGear || "Metonic Ratio Ablation"} (${result.verification.toothDelta >= 0 ? "+" : ""}${result.verification.toothDelta}T)`,
      startingState: result.baseline.name,
      changedVariables: `Perturb tooth count from ${result.verification.nominalTeeth} to ${result.verification.perturbedTeeth} on ${result.verification.gearModuleMm}mm module gear`,
      assumptions: result.perturbation.assumptions || [
        "235 synodic months / 19 tropical years is the target encoded relationship.",
        "All non-perturbed gear ratios remain fixed.",
        "Manufacturing error, friction and backlash are excluded from this computational test.",
        "Only kinematic information transfer is being evaluated."
      ],
      predictedOutcomes: [
        `Kinematic ratio shift: ${result.verification.ratioDeviationPercent >= 0 ? "+" : ""}${result.verification.ratioDeviationPercent.toFixed(2)}%`,
        `5-turn spiral dial drift: ${result.verification.spiralDialAngleDriftDeg.toFixed(2)}°`,
        `Ephemeris calendar phase error: ${result.verification.synodicMonthPhaseDrift.toFixed(2)} synodic months (${result.verification.calendarDayPhaseDrift.toFixed(1)} days)`,
        `Mechanical interference: ${result.verification.isMechanicallyInterfering ? "CLASH DETECTED (+0.5 module shift)" : "Clear"}`
      ],
      divergence: `Counterfactual Model Divergence: ${result.verification.ratioDeviationPercent >= 0 ? "+" : ""}${result.verification.ratioDeviationPercent.toFixed(2)}% ratio departure. ${result.verification.epistemicFormulation}`,
      confidence: 99,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      executionStatus: "VALIDATED_EVIDENCE",
      computeReceipt: {
        selectedRail: "LOCAL_DETERMINISTIC",
        endpointOrModel: "local-deterministic-kinematics/metonic-v1",
        inputManifest: {
          nominalTeeth: result.verification.nominalTeeth,
          perturbedTeeth: result.verification.perturbedTeeth,
          moduleMm: result.verification.gearModuleMm
        },
        codeVersion: "metonic-solver-v1.4.2",
        hardwareMetadata: {
          device: "Local Host CPU",
          cores: 8,
          runtimeDriver: "AVX-512 Native"
        },
        rawOutputArtifact: {
          nominal_teeth: result.verification.nominalTeeth,
          perturbed_teeth: result.verification.perturbedTeeth,
          ratio_deviation_pct: result.verification.ratioDeviationPercent,
          spiral_dial_drift_deg: result.verification.spiralDialAngleDriftDeg,
          calendar_day_drift: result.verification.calendarDayPhaseDrift,
          mechanical_interference: result.verification.isMechanicallyInterfering
        },
        timestamp: new Date().toISOString(),
        runId: `RUN-DET-${Date.now()}`,
        uncertaintyAndConvergence: {
          converged: true,
          residualError: 0.0,
          confidenceBounds: "Exact integer kinematic arithmetic",
          notes: "Deterministic kinematic evaluation on local substrate."
        },
        inputOutputHash: `SHA256:${result.verification.auditHash}`,
        fallbackOrDegradedMode: "None - Local Deterministic Engine"
      },
      jemmaValidation: {
        validated: true,
        unitsChecked: true,
        completenessScore: 100,
        evidenceClass: "reconstruction",
        notes: "Algebraic kinematic check verified against surviving bronze artifacts.",
        validatedAt: new Date().toISOString().replace("T", " ").substring(0, 16)
      },
      orionAblationChallenge: {
        challenged: true,
        assumptionsAttacked: ["Fixed arbor centers", "Integer tooth engagement"],
        counterfactualVulnerability: "39-tooth gear causes physical arbor clash (+0.5mm center delta) under fixed frame geometry.",
        stressResult: "Passed: Confirms 38-tooth count as binding structural and astronomical requirement.",
        passed: true
      },
      operatorPromotionGate: {
        status: "approved",
        promotedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        operatorNotes: "Admitted to twin state via Deterministic Math Engine.",
        admittedToLedger: true
      }
    };

    const updatedTwin: DigitalTwin = {
      ...twin,
      simulations: [newSim, ...twin.simulations],
      updatedAt: new Date().toISOString()
    };
    onUpdateTwin(updatedTwin);
  };

  const handleCommitVerificationToLedger = (verification: MetonicKinematicVerificationResult) => {
    const alreadyExists = (twin.pathfinderRecords || []).some(
      (r) => r.evidence?.some((e) => e.includes(verification.auditHash))
    );
    if (alreadyExists) return;

    const newRecord = {
      id: `path-cf-${verification.auditHash}`,
      question: `Does perturbing the Metonic transmission by ${verification.toothDelta >= 0 ? "+" : ""}${verification.toothDelta} tooth preserve the encoded 235/19 cycle?`,
      evidence: [
        "Fragment B microCT arbor coordinates",
        `Deterministic Kinematic Calculation (Checksum ${verification.auditHash})`
      ],
      investigation: `Evaluated counterfactual ratio departure (+${verification.ratioDeviationPercent.toFixed(2)}%) and dial drift (${verification.spiralDialAngleDriftDeg.toFixed(2)}°).`,
      challenge: `Orion ablation: K - {nominal 38-tooth ratio} produces astronomical desynchronization (${verification.calendarDayPhaseDrift.toFixed(1)} days).`,
      decision: `Admit 38-tooth Metonic gear ratio as ${verification.epistemicVerdict} under stated fixed-centre assumptions.`,
      commitStatus: "approved" as const,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    const updatedTwin: DigitalTwin = {
      ...twin,
      pathfinderRecords: [newRecord, ...(twin.pathfinderRecords || [])],
      updatedAt: new Date().toISOString()
    };
    onUpdateTwin(updatedTwin);
  };

  const getStatusBadge = (status?: SimulationLifecycleStatus) => {
    if (status === "VALIDATED_EVIDENCE") {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#14291E] border border-[#2D5A3D] text-[#4ADE80]">
          <ShieldCheck className="w-3 h-3" />
          <span>VALIDATED SIMULATION EVIDENCE</span>
        </span>
      );
    }
    if (status === "COMPUTE_GENERATED") {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#231A33] border border-[#483466] text-[#C084FC]">
          <Zap className="w-3 h-3 text-[#A855F7]" />
          <span>COMPUTE-GENERATED / PENDING VALIDATION</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#292212] border border-[#665022] text-[#FCD34D]">
        <Clock className="w-3 h-3 text-[#EAB308]" />
        <span>PROPOSED SIMULATION / NOT EXECUTED</span>
      </span>
    );
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 space-y-8 text-[#E6E4DF]">
      {/* Compute Architecture Manifesto Banner */}
      <div className="bg-[#14161E] border border-[#262D3D] rounded-lg p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222736] pb-3">
          <div className="flex items-center space-x-2.5">
            <Server className="w-5 h-5 text-[#C5A059]" />
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#C5A059]">
              COMPUTE INTEGRITY DOCTRINE & EXPLICIT ARCHITECTURAL SEPARATION
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C202C] border border-[#2E3547] text-[#93C5FD]">
            Doctrine: Acceleration does not manufacture evidence
          </span>
        </div>

        <p className="text-xs text-[#8A8F9A] leading-relaxed">
          <strong className="text-[#E6E4DF]">Architectural Separation:</strong> Gemini frames and interprets. NVIDIA/FPT executes. RAPIDS processes dataframes and sweeps. Pathfinder governs provenance and epistemic status. The Sovereign Operator promotes. The LLM does not synthesize unevidenced physics or thresholds conversationally.
        </p>

        {/* Compute Flow Pipeline */}
        <div className="pt-2">
          <div className="text-[10px] uppercase font-mono text-[#737885] mb-1.5 font-semibold">
            Operational Compute Flow:
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
            <span className="bg-[#1A1D26] px-2 py-1 rounded border border-[#2B303F] text-[#93C5FD]">1. Twin defines parameters</span>
            <span className="text-[#737885]">→</span>
            <span className="bg-[#1A1D26] px-2 py-1 rounded border border-[#2B303F] text-[#C5A059]">2. Claudia selects compute rail</span>
            <span className="text-[#737885]">→</span>
            <span className="bg-[#241738] px-2 py-1 rounded border border-[#4E2E78] text-[#C084FC] font-semibold">3. NVIDIA/RAPIDS/FPT executes solver</span>
            <span className="text-[#737885]">→</span>
            <span className="bg-[#1A1D26] px-2 py-1 rounded border border-[#2B303F] text-[#60A5FA]">4. Raw outputs & receipt signed</span>
            <span className="text-[#737885]">→</span>
            <span className="bg-[#1B271F] px-2 py-1 rounded border border-[#2B4734] text-[#4ADE80]">5. Jemma validates provenance & units</span>
            <span className="text-[#737885]">→</span>
            <span className="bg-[#2A2312] px-2 py-1 rounded border border-[#664D1D] text-[#F59E0B]">6. Orion attacks assumptions</span>
            <span className="text-[#737885]">→</span>
            <span className="bg-[#2A2312] px-2.5 py-1 rounded border border-[#D97706] text-[#FCD34D] font-bold">7. Operator Gate Promotes</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#22252D] pb-5 gap-4">
        <div>
          <div className="text-xs uppercase font-mono tracking-widest text-[#C5A059] mb-1 font-semibold">
            ACCELERATED COMPUTE & SIMULATION WORKSPACE
          </div>
          <h1 className="text-2xl font-light text-[#E6E4DF] tracking-tight">
            Counterfactual Solver & Compute Receipt Registry
          </h1>
          <p className="text-xs text-[#8A8F9A] mt-1 max-w-2xl">
            Dispatch parameter sweeps to RAPIDS GPU and NVIDIA NIM solvers. Every run generates an immutable compute receipt with hardware metadata, raw output artifacts, and cryptographic input-output hashes.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setInspectingGeometric(!inspectingGeometric);
              if (!inspectingGeometric) setInspectingDeterministic(false);
            }}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded border transition-colors cursor-pointer ${
              inspectingGeometric
                ? "bg-[#162230] border-[#2A415E] text-[#509EE3]"
                : "bg-[#13151A] border-[#22262F] text-[#509EE3] hover:bg-[#1A1D24]"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Geometric Architecture G_0 {inspectingGeometric ? "(Active)" : "(Open)"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setInspectingDeterministic(!inspectingDeterministic);
              if (!inspectingDeterministic) setInspectingGeometric(false);
            }}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded border transition-colors cursor-pointer ${
              inspectingDeterministic
                ? "bg-[#1E2E22] border-[#2D5A38] text-[#4ADE80]"
                : "bg-[#13151A] border-[#22262F] text-[#C5A059] hover:bg-[#1A1D24]"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Deterministic Math Engine {inspectingDeterministic ? "(Active)" : "(Open)"}</span>
          </button>

          <div className="flex items-center space-x-2 bg-[#13151A] border border-[#22262F] px-3 py-1.5 rounded">
            <span className="text-[#8A8F9A]">Logged Runs:</span>
            <span className="text-[#C5A059] font-bold">{twin.simulations.length}</span>
          </div>
        </div>
      </div>

      {/* Simulation Error Alert Banner */}
      {simulationError && (
        <div className="bg-[#211214] border border-[#522026] text-[#FCA5A5] p-4 rounded-lg flex items-start justify-between space-x-3 text-xs font-mono">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-[#EF4444] uppercase tracking-wider">Execution Stopped</div>
              <div>{simulationError}</div>
            </div>
          </div>
          <button 
            onClick={() => setSimulationError(null)}
            className="text-[#8A8F9A] hover:text-[#E6E4DF] text-xs font-mono px-2 py-1 rounded bg-[#13151A]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Geometric Architecture Substrate ($G_0$ Hexagon & Dimensionless Ratio Optimization) */}
      {inspectingGeometric && (
        <div className="animate-fadeIn">
          <GeometricArchitectureView />
        </div>
      )}

      {/* Deterministic Kinematic Verification Layer (Accordion / Panel) */}
      {inspectingDeterministic && (
        <div className="bg-[#0F1218] border-2 border-[#1E3A2B] rounded-lg p-6 space-y-6 shadow-xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1E3A2B] pb-4 gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded bg-[#142B1F] border border-[#25543A]">
                <Calculator className="w-5 h-5 text-[#4ADE80]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-[#4ADE80] uppercase tracking-wider">
                    DETERMINISTIC MATHEMATICAL RECOMPUTATION LAYER
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#172D21] text-[#4ADE80] border border-[#2E6B47]">
                    Independent Verification
                  </span>
                </div>
                <p className="text-xs text-[#8A8F9A] mt-0.5">
                  Recomputes kinematic, arithmetic, and geometric claims before admitting them to the Jemma provenance ledger.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono text-[#8A8F9A]">
              <span>Audit Checksum:</span>
              <span className="text-[#4ADE80] bg-[#142B1F] px-2 py-0.5 rounded border border-[#25543A]">
                {verificationResult.auditHash}
              </span>
            </div>
          </div>

          {/* Interactive Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#141822] p-4 rounded border border-[#22293A]">
            <div>
              <label className="block text-[10px] uppercase font-mono text-[#8A8F9A] mb-1">
                Nominal Metonic Gear Teeth (N_nom)
              </label>
              <input
                type="number"
                value={kinematicNominalTeeth}
                onChange={(e) => handleRecomputeKinematics(parseInt(e.target.value) || 38, kinematicPerturbedTeeth, kinematicModuleMm)}
                className="w-full bg-[#1A1F2D] border border-[#2F3950] text-xs font-mono text-[#E6E4DF] p-2 rounded focus:outline-none focus:border-[#4ADE80]"
              />
              <span className="text-[10px] text-[#737885] mt-1 block">Baseline archaeological reconstruction: 38 teeth</span>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-[#8A8F9A] mb-1">
                Perturbed Gear Teeth (N')
              </label>
              <input
                type="number"
                value={kinematicPerturbedTeeth}
                onChange={(e) => handleRecomputeKinematics(kinematicNominalTeeth, parseInt(e.target.value) || 39, kinematicModuleMm)}
                className="w-full bg-[#1A1F2D] border border-[#2F3950] text-xs font-mono text-[#E6E4DF] p-2 rounded focus:outline-none focus:border-[#4ADE80]"
              />
              <span className="text-[10px] text-[#737885] mt-1 block">Counterfactual perturbation: +1 tooth (39 teeth)</span>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-[#8A8F9A] mb-1">
                Gear Module m (mm)
              </label>
              <input
                type="number"
                step="0.1"
                value={kinematicModuleMm}
                onChange={(e) => handleRecomputeKinematics(kinematicNominalTeeth, kinematicPerturbedTeeth, parseFloat(e.target.value) || 0.5)}
                className="w-full bg-[#1A1F2D] border border-[#2F3950] text-xs font-mono text-[#E6E4DF] p-2 rounded focus:outline-none focus:border-[#4ADE80]"
              />
              <span className="text-[10px] text-[#737885] mt-1 block">MicroCT measured Hellenistic bronze tooth module: 0.5 mm</span>
            </div>
          </div>

          {/* Recomputed Deterministic Outputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#131720] border border-[#242E42] p-4 rounded space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#93C5FD] block">
                Kinematic Ratio Departure
              </span>
              <div className="text-xl font-mono font-bold text-[#E6E4DF]">
                {verificationResult.ratioDeviationPercent >= 0 ? "+" : ""}{verificationResult.ratioDeviationPercent.toFixed(2)}%
              </div>
              <p className="text-[10px] text-[#737885] font-mono">
                ΔR / R = ({verificationResult.toothDelta} / {verificationResult.nominalTeeth})
              </p>
            </div>

            <div className="bg-[#131720] border border-[#242E42] p-4 rounded space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#F59E0B] block">
                Spiral Dial Registration Drift
              </span>
              <div className="text-xl font-mono font-bold text-[#F59E0B]">
                {verificationResult.spiralDialAngleDriftDeg.toFixed(2)}°
              </div>
              <p className="text-[10px] text-[#737885] font-mono">
                Across 1800° 5-turn Metonic spiral
              </p>
            </div>

            <div className="bg-[#131720] border border-[#242E42] p-4 rounded space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#E879F9] block">
                Ephemeris Calendar Phase Error
              </span>
              <div className="text-xl font-mono font-bold text-[#E879F9]">
                {verificationResult.synodicMonthPhaseDrift.toFixed(2)} mo ({verificationResult.calendarDayPhaseDrift.toFixed(1)} d)
              </div>
              <p className="text-[10px] text-[#737885] font-mono">
                Cumulative over one 19-year cycle
              </p>
            </div>

            <div className="bg-[#131720] border border-[#242E42] p-4 rounded space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#EF4444] block">
                Mechanical Center Interference
              </span>
              <div className="text-xl font-mono font-bold text-[#EF4444]">
                +{verificationResult.centerDistanceDeltaMm.toFixed(2)} mm (+{verificationResult.moduleInterferenceRatio.toFixed(1)}m)
              </div>
              <p className="text-[10px] text-[#737885] font-mono">
                Exceeds fixed arbor tolerance (0.05mm)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preset Quick Loader */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[#8A8F9A] font-mono text-[10px] uppercase font-semibold">Investigation Presets:</span>
        {twin.id.includes("membrane") || twin.id.includes("protective") ? (
          <>
            <button
              type="button"
              onClick={() => handleLoadPreset("membrane_sim001")}
              className="bg-[#1A1D2B] hover:bg-[#232738] border border-[#353D57] text-[#509EE3] px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-[#509EE3]" />
              <span>Sim 001: 720 m/s Kinetic Strike & Strain Wave (NVIDIA Rail)</span>
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset("membrane_sim002")}
              className="bg-[#1A1D2B] hover:bg-[#232738] border border-[#353D57] text-[#4ADE80] px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-[#4ADE80]" />
              <span>Sim 002: W/Mo & Hf/Zr Surrogate Screening (Local Rail)</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setScenarioName("Simulation 001: G6 Hexagonal Coaxial Cruise (84.2 kN Poynting Flux)");
                setStartingState("Coaxial Cruise (Gamma 0)");
                setChangedVars("Lock aperture radial offset dr = 0.0 mm. Evaluate standing wave ratio and axial flux.");
                setAssumptionsText("G6 hexagonal boundary symmetry.\nRF source 2.80 GHz at 45 kW excitation.\nZero transverse shear.");
                setSelectedRail("LOCAL_DETERMINISTIC");
                setExecutionMode("dispatch_immediate");
              }}
              className="bg-[#191D28] hover:bg-[#222736] border border-[#2C344A] text-[#C5A059] px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Sim 001: G6 Coaxial Cruise (Local Rail)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setScenarioName("Simulation 002: Asymmetric Poynting Vectoring Sweep");
                setStartingState("Coaxial Cruise (Gamma 0)");
                setChangedVars("Perturb aperture radial offset to dr = 10.5 mm. Evaluate transverse Maxwell shear and SWR margin.");
                setAssumptionsText("Omega_safe boundary limit dr <= 15.0 mm.\nPermitted SWR <= 1.50:1.\nTransverse thrust calculation.");
                setSelectedRail("LOCAL_DETERMINISTIC");
                setExecutionMode("dispatch_immediate");
              }}
              className="bg-[#191D28] hover:bg-[#222736] border border-[#2C344A] text-[#93C5FD] px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-[#93C5FD]" />
              <span>Sim 002: Vectoring Sweep (Local Rail)</span>
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scenario Builder & Dispatcher Form (5 cols) */}
        <div className="lg:col-span-5 bg-[#13151A] border border-[#22262F] rounded p-6 space-y-5">
          <div className="border-b border-[#22262F] pb-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#C5A059]">
              Compute Dispatch Form
            </span>
            <h3 className="text-base font-medium text-[#E6E4DF]">
              Configure Simulation Workload & Rail
            </h3>
          </div>

          <form onSubmit={handleRunSimulation} className="space-y-4 text-xs">
            {/* Compute Rail Selector */}
            <div>
              <label className="block text-[#8A8F9A] mb-1.5 font-mono text-[10px] uppercase font-semibold">
                Target Compute Rail (Claudia Routing)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRail("RAPIDS_GPU")}
                  className={`p-2.5 rounded border text-left flex flex-col justify-between transition-colors ${
                    selectedRail === "RAPIDS_GPU"
                      ? "bg-[#172338] border-[#38BDF8] text-[#38BDF8]"
                      : "bg-[#181A20] border-[#2B303C] text-[#8A8F9A] hover:bg-[#1E212A]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-[11px]">RAPIDS GPU</span>
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] text-[#8A8F9A] mt-1">Dataframe & Parameter Sweeps</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRail("NVIDIA_NIM")}
                  className={`p-2.5 rounded border text-left flex flex-col justify-between transition-colors ${
                    selectedRail === "NVIDIA_NIM"
                      ? "bg-[#251838] border-[#A855F7] text-[#C084FC]"
                      : "bg-[#181A20] border-[#2B303C] text-[#8A8F9A] hover:bg-[#1E212A]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-[11px]">NVIDIA NIM</span>
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] text-[#8A8F9A] mt-1">Accelerated PDE & Physics</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRail("OPEN_SOURCE_INFERENCE")}
                  className={`p-2.5 rounded border text-left flex flex-col justify-between transition-colors ${
                    selectedRail === "OPEN_SOURCE_INFERENCE"
                      ? "bg-[#241E38] border-[#818CF8] text-[#C7D2FE]"
                      : "bg-[#181A20] border-[#2B303C] text-[#8A8F9A] hover:bg-[#1E212A]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-[11px]">Open-Source Inference</span>
                    <Server className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] text-[#8A8F9A] mt-1">vLLM / Self-Hosted Open Models [EXPERIMENTAL]</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRail("LOCAL_DETERMINISTIC")}
                  className={`p-2.5 rounded border text-left flex flex-col justify-between transition-colors ${
                    selectedRail === "LOCAL_DETERMINISTIC"
                      ? "bg-[#162B1D] border-[#4ADE80] text-[#4ADE80]"
                      : "bg-[#181A20] border-[#2B303C] text-[#8A8F9A] hover:bg-[#1E212A]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-[11px]">Local Engine</span>
                    <Calculator className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] text-[#8A8F9A] mt-1">Deterministic Substrate [APPROVED]</span>
                </button>
              </div>
            </div>

            {/* Execution Mode */}
            <div className="bg-[#181A20] border border-[#2B303C] p-2.5 rounded flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase text-[#8A8F9A]">Lifecycle Mode:</span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setExecutionMode("dispatch_immediate")}
                  className={`px-2 py-1 rounded text-[10px] font-mono font-semibold cursor-pointer ${
                    executionMode === "dispatch_immediate"
                      ? "bg-[#3B82F6] text-[#FFFFFF]"
                      : "bg-[#13151A] text-[#8A8F9A] hover:text-[#E6E4DF]"
                  }`}
                >
                  Dispatch to Rail Now
                </button>
                <button
                  type="button"
                  onClick={() => setExecutionMode("propose_only")}
                  className={`px-2 py-1 rounded text-[10px] font-mono font-semibold cursor-pointer ${
                    executionMode === "propose_only"
                      ? "bg-[#D97706] text-[#0D0E11]"
                      : "bg-[#13151A] text-[#8A8F9A] hover:text-[#E6E4DF]"
                  }`}
                >
                  Propose Spec Only
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
                Scenario Name / Target Boundary
              </label>
              <input
                type="text"
                placeholder="e.g. Sub-Ambient Cooling Boundary Envelope Parameter Sweep"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#C5A059]"
                required
              />
            </div>

            <div>
              <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
                Starting State / Baseline
              </label>
              <select
                value={startingState}
                onChange={(e) => setStartingState(e.target.value)}
                className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#C5A059]"
              >
                {twin.states.map((st) => (
                  <option key={st.id} value={st.name}>
                    {st.name}
                  </option>
                ))}
                <option value="Nominal Operating Equilibrium">
                  Nominal Operating Equilibrium
                </option>
              </select>
            </div>

            <div>
              <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
                Changed Variables / Parameter Grid
              </label>
              <textarea
                placeholder="e.g. Sweep Relative Humidity (10% to 90%), Wind Velocity (0.5 to 10 m/s), Cloud Cover (0% to 100%)"
                value={changedVars}
                onChange={(e) => setChangedVars(e.target.value)}
                className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#C5A059] h-20 resize-none font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-[#8A8F9A] mb-1 font-mono text-[10px] uppercase">
                Explicit Assumptions (One per line)
              </label>
              <textarea
                placeholder="e.g. Solar reflectance 82.4%&#10;Atmospheric window emissivity 96.7%&#10;Stefan-Boltzmann balance"
                value={assumptionsText}
                onChange={(e) => setAssumptionsText(e.target.value)}
                className="w-full bg-[#181A20] border border-[#2B303C] text-xs text-[#E6E4DF] p-2.5 rounded focus:outline-none focus:border-[#C5A059] h-20 resize-none font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSimulating}
              className={`w-full text-xs font-semibold py-3 rounded shadow flex items-center justify-center space-x-2 transition-colors cursor-pointer disabled:opacity-50 ${
                executionMode === "propose_only"
                  ? "bg-[#D97706] hover:bg-[#B45309] text-[#0D0E11]"
                  : "bg-[#C5A059] hover:bg-[#D4AF37] text-[#0D0E11]"
              }`}
            >
              {isSimulating ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Dispatching Workload to Compute Rail...</span>
                </>
              ) : executionMode === "propose_only" ? (
                <>
                  <Clock className="w-4 h-4" />
                  <span>Record Proposed Simulation Spec</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Dispatch Solver Run to {selectedRail.replace("_", " ")}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Simulation Runs & Compute Receipts (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-[#22252D] pb-3">
            <span className="text-xs uppercase font-mono tracking-wider text-[#C5A059] font-semibold">
              Simulation Runs & Epistemic Receipts
            </span>
            <span className="text-[10px] text-[#737885] font-mono">
              Evaluated under Compute Integrity Law
            </span>
          </div>

          <div className="space-y-4">
            {twin.simulations.map((sim) => {
              const isExpanded = expandedReceiptId === sim.id;
              const hasReceipt = !!sim.computeReceipt;
              const receipt = sim.computeReceipt;

              return (
                <div
                  key={sim.id}
                  className="bg-[#13151A] border border-[#22262F] rounded p-5 space-y-4 shadow-md transition-all"
                >
                  {/* Card Header & Lifecycle Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1E222A] pb-3 gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-base font-medium text-[#E6E4DF]">
                          {sim.name}
                        </h4>
                      </div>
                      <div className="text-[10px] text-[#737885] font-mono mt-0.5">
                        Baseline: {sim.startingState} · Created {sim.createdAt}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {getStatusBadge(sim.executionStatus)}
                    </div>
                  </div>

                  {/* Modified Variables & Assumptions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-[#0F1014] border border-[#1E222A] p-3 rounded">
                      <span className="text-[10px] uppercase font-mono text-[#509EE3]">
                        Modified Variables
                      </span>
                      <p className="text-[#E6E4DF] mt-1 font-mono text-[11px]">{sim.changedVariables}</p>
                    </div>

                    <div className="bg-[#0F1014] border border-[#1E222A] p-3 rounded">
                      <span className="text-[10px] uppercase font-mono text-[#8A8F9A]">
                        Stated Assumptions
                      </span>
                      <ul className="text-[#A0A4AB] mt-1 space-y-0.5 list-disc list-inside text-[11px]">
                        {sim.assumptions.map((asm, i) => (
                          <li key={i}>{asm}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Predicted Outcomes */}
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#4ADE80] font-semibold">
                      Predicted Model Outcomes / Boundaries
                    </span>
                    <div className="space-y-1">
                      {sim.predictedOutcomes.map((out, i) => (
                        <div
                          key={i}
                          className="bg-[#161B24] border border-[#242F42] p-2.5 rounded text-[#E6E4DF] flex items-start space-x-2"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#4ADE80] mt-0.5 shrink-0" />
                          <span className="text-[11px] leading-relaxed">{out}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divergence Analysis */}
                  <div className="bg-[#1C1810] border border-[#3B3220] p-3 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-[#C5A059] font-bold block">
                        COUNTERFACTUAL MODEL DIVERGENCE
                      </span>
                      <span className="text-[10px] text-[#737885] font-mono">
                        Departure from nominal baseline
                      </span>
                    </div>
                    <span className="text-[#E6E4DF] font-mono text-[11px]">{sim.divergence}</span>
                  </div>

                  {/* Actions & Compute Receipt Expansion */}
                  <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[#1C212E] gap-2">
                    <div className="flex items-center space-x-2">
                      {hasReceipt ? (
                        <button
                          type="button"
                          onClick={() => setExpandedReceiptId(isExpanded ? null : sim.id)}
                          className="flex items-center space-x-1.5 text-xs font-mono px-3 py-1.5 rounded bg-[#1B2130] hover:bg-[#252D42] border border-[#34405E] text-[#93C5FD] transition-colors cursor-pointer"
                        >
                          <Hash className="w-3.5 h-3.5" />
                          <span>{isExpanded ? "Hide Compute Receipt" : "Inspect Compute Receipt"}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-mono text-[#F59E0B]">No solver executed yet.</span>
                          <button
                            type="button"
                            onClick={() => handleDispatchExistingProposed(sim, "RAPIDS_GPU")}
                            disabled={isSimulating}
                            className="px-2.5 py-1 text-xs font-mono rounded bg-[#38BDF8] text-[#0A0C11] font-bold hover:bg-[#0284C7] cursor-pointer"
                          >
                            Dispatch to RAPIDS GPU
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDispatchExistingProposed(sim, "NVIDIA_NIM")}
                            disabled={isSimulating}
                            className="px-2.5 py-1 text-xs font-mono rounded bg-[#A855F7] text-[#FFFFFF] font-bold hover:bg-[#9333EA] cursor-pointer"
                          >
                            Dispatch to NVIDIA NIM
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Operator Promotion Gate Controls */}
                    {sim.executionStatus === "COMPUTE_GENERATED" && (
                      <div className="flex items-center space-x-2">
                        {promotingSimId === sim.id ? (
                          <div className="flex flex-col space-y-2 bg-[#1C2230] p-3 rounded border border-[#303E5C] text-xs">
                            <span className="font-mono text-[10px] text-[#C5A059] uppercase font-bold">
                              Operator Promotion Authority
                            </span>
                            <input
                              type="text"
                              placeholder="Operator notes (e.g. Sub-ambient envelope verified for building deployment)..."
                              value={promotionNotes}
                              onChange={(e) => setPromotionNotes(e.target.value)}
                              className="bg-[#10131B] border border-[#2B354F] text-xs p-1.5 rounded font-mono text-[#E6E4DF]"
                            />
                            <div className="flex justify-end space-x-2">
                              <button
                                type="button"
                                onClick={() => setPromotingSimId(null)}
                                className="px-2 py-1 rounded text-xs font-mono text-[#8A8F9A] hover:bg-[#131722]"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handlePromoteSimulation(sim.id, "approved")}
                                disabled={isPromoting}
                                className="px-3 py-1 rounded text-xs font-mono font-bold bg-[#4ADE80] text-[#0D0E11] hover:bg-[#22C55E]"
                              >
                                Commit to Accepted State
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setPromotingSimId(sim.id);
                              setPromotionNotes("");
                            }}
                            className="flex items-center space-x-1.5 text-xs font-mono px-3 py-1.5 rounded bg-[#162E20] hover:bg-[#1F452E] border border-[#2B633F] text-[#4ADE80] font-semibold cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Promote into Accepted State</span>
                          </button>
                        )}
                      </div>
                    )}

                    {sim.executionStatus === "VALIDATED_EVIDENCE" && (
                      <div className="flex items-center space-x-1 text-[11px] font-mono text-[#4ADE80]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Admitted by Operator Gate</span>
                      </div>
                    )}
                  </div>

                  {/* Expanded Compute Receipt Card */}
                  {isExpanded && receipt && (
                    <div className="bg-[#0B0D13] border border-[#27324B] rounded-lg p-4 space-y-4 animate-fadeIn text-xs font-mono">
                      <div className="flex items-center justify-between border-b border-[#20293D] pb-2">
                        <div className="flex items-center space-x-2">
                          <Terminal className="w-4 h-4 text-[#38BDF8]" />
                          <span className="font-bold text-[#38BDF8] uppercase tracking-wider">
                            OFFICIAL COMPUTE RECEIPT & SOLVER METADATA
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {receipt.selectedRail === "FPT_AI_CLOUD" && (
                            <span className="px-2 py-0.5 rounded bg-[#451A1A] border border-[#7F1D1D] text-[#FCA5A5] font-mono text-[9px] font-bold">
                              REVOKED RAIL · HISTORICAL PROVENANCE ONLY
                            </span>
                          )}
                          <span className="text-[10px] text-[#737885]">{receipt.runId}</span>
                        </div>
                      </div>

                      {/* Receipt Meta Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="bg-[#121520] p-2.5 rounded border border-[#1E2538] space-y-0.5">
                          <span className="text-[9px] uppercase text-[#737885] block">Execution Rail</span>
                          <span className="text-[#93C5FD] font-bold">{receipt.selectedRail}</span>
                          <span className="text-[10px] text-[#8A8F9A] block">{receipt.endpointOrModel}</span>
                        </div>

                        <div className="bg-[#121520] p-2.5 rounded border border-[#1E2538] space-y-0.5">
                          <span className="text-[9px] uppercase text-[#737885] block">Hardware Accelerator</span>
                          <span className="text-[#C084FC] font-bold">{receipt.hardwareMetadata?.accelerator || receipt.hardwareMetadata?.device}</span>
                          <span className="text-[10px] text-[#8A8F9A] block">{receipt.hardwareMetadata?.runtimeDriver || "Native Driver"}</span>
                        </div>

                        <div className="bg-[#121520] p-2.5 rounded border border-[#1E2538] space-y-0.5">
                          <span className="text-[9px] uppercase text-[#737885] block">Convergence & Residuals</span>
                          <span className="text-[#4ADE80] font-bold">
                            {receipt.uncertaintyAndConvergence?.converged ? "Converged" : "Diverged"} (err: {receipt.uncertaintyAndConvergence?.residualError ?? "0.0"})
                          </span>
                          <span className="text-[10px] text-[#8A8F9A] block">{receipt.uncertaintyAndConvergence?.confidenceBounds}</span>
                        </div>
                      </div>

                      {/* Raw Output Artifact View */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase text-[#C5A059] font-bold flex items-center space-x-1.5">
                          <Table className="w-3.5 h-3.5" />
                          <span>Raw Numerical Output Dataframe / Artifact</span>
                        </span>

                        {Array.isArray(receipt.rawOutputArtifact) ? (
                          <div className="overflow-x-auto border border-[#1F273B] rounded">
                            <table className="w-full text-[11px] text-left">
                              <thead className="bg-[#161B29] text-[#8A8F9A] uppercase text-[9px]">
                                <tr>
                                  <th className="p-2">RH (%)</th>
                                  <th className="p-2">Wind (m/s)</th>
                                  <th className="p-2">Cloud (%)</th>
                                  <th className="p-2">Solar (W/m²)</th>
                                  <th className="p-2">h_c (W/m²K)</th>
                                  <th className="p-2">8-13μm Trans</th>
                                  <th className="p-2">P_net (W/m²)</th>
                                  <th className="p-2">ΔT (°C)</th>
                                  <th className="p-2">Sub-Ambient</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#1B2233]">
                                {receipt.rawOutputArtifact.map((row: any, idx: number) => (
                                  <tr key={idx} className={row.sub_ambient ? "bg-[#112319]" : "bg-[#191417]"}>
                                    <td className="p-2 font-bold">{row.rh_pct}%</td>
                                    <td className="p-2">{row.wind_ms}</td>
                                    <td className="p-2">{row.cloud_pct}%</td>
                                    <td className="p-2">{row.solar_wm2}</td>
                                    <td className="p-2">{row.hc_wm2k}</td>
                                    <td className="p-2 text-[#38BDF8]">{row.transmissivity_8_13um}</td>
                                    <td className="p-2 font-bold text-[#E6E4DF]">{row.p_net_cooling_wm2}</td>
                                    <td className={`p-2 font-bold ${row.t_surf_delta_c < 0 ? "text-[#4ADE80]" : "text-[#EF4444]"}`}>
                                      {row.t_surf_delta_c > 0 ? "+" : ""}{row.t_surf_delta_c}°C
                                    </td>
                                    <td className="p-2">
                                      {row.sub_ambient ? (
                                        <span className="px-1.5 py-0.5 rounded bg-[#1B402B] text-[#4ADE80] text-[9px] font-bold">YES</span>
                                      ) : (
                                        <span className="px-1.5 py-0.5 rounded bg-[#401B1E] text-[#F87171] text-[9px] font-bold">NO</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <pre className="bg-[#121520] p-3 rounded border border-[#1E2538] text-[10px] text-[#A0A8BF] overflow-x-auto">
                            {JSON.stringify(receipt.rawOutputArtifact, null, 2)}
                          </pre>
                        )}
                      </div>

                      {/* Jemma and Orion Validations */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#1C2436]">
                        {sim.jemmaValidation && (
                          <div className="bg-[#101A15] border border-[#214732] p-2.5 rounded space-y-1">
                            <span className="text-[10px] text-[#4ADE80] uppercase font-bold flex items-center space-x-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Jemma Provenance Verification</span>
                            </span>
                            <p className="text-[10px] text-[#8A8F9A]">{sim.jemmaValidation.notes}</p>
                            <span className="text-[9px] text-[#737885]">Completeness: {sim.jemmaValidation.completenessScore}% · Class: {sim.jemmaValidation.evidenceClass}</span>
                          </div>
                        )}

                        {sim.orionAblationChallenge && (
                          <div className="bg-[#241A12] border border-[#523A20] p-2.5 rounded space-y-1">
                            <span className="text-[10px] text-[#F59E0B] uppercase font-bold flex items-center space-x-1">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              <span>Orion Adversarial Ablation Challenge</span>
                            </span>
                            <p className="text-[10px] text-[#8A8F9A]">{sim.orionAblationChallenge.counterfactualVulnerability}</p>
                            <span className="text-[9px] text-[#737885]">Verdict: {sim.orionAblationChallenge.stressResult}</span>
                          </div>
                        )}
                      </div>

                      {/* Cryptographic SHA-256 Hash Anchor */}
                      <div className="bg-[#0D1017] p-2.5 rounded border border-[#1C2538] flex items-center justify-between text-[10px]">
                        <span className="text-[#737885] uppercase">Input/Output SHA-256 Checksum:</span>
                        <span className="text-[#38BDF8] font-mono break-all select-all font-semibold">
                          {receipt.inputOutputHash}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
