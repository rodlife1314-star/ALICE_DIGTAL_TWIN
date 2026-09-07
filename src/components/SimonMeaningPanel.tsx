import React, { useState, useEffect } from "react";
import {
  Brain,
  Network,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Play,
  Server,
  Lock,
  Compass,
  AlertTriangle,
  GitBranch,
  Clock,
  ArrowRight,
  Scale
} from "lucide-react";
import {
  SimonMeaningEnvelope,
  generateSimonMeaningForSpatialIsoform,
  generateSimonMeaningForPoissonElectrostatics,
  synthesizeSimonMeaning,
  auditSimonEnvelope
} from "../lib/simon";
import {
  ReasoningReceipt,
  ReasoningRequest,
  ReasoningTask,
  executeReasoningRail,
  convertReasoningReceiptToSimonEnvelope,
  generateDeterministicReasoningFallback
} from "../lib/reasoningRail";
import { SimonMeaningLayer } from "./SimonMeaningLayer";

interface SimonMeaningPanelProps {
  initialEnvelope?: SimonMeaningEnvelope | null;
  onDispatchNextStep?: (action: string) => void;
}

export function SimonMeaningPanel({
  initialEnvelope,
  onDispatchNextStep
}: SimonMeaningPanelProps) {
  const [activePreset, setActivePreset] = useState<string>("poisson_boltzmann");

  // Reasoning Rail configuration
  const [selectedTask, setSelectedTask] = useState<ReasoningTask>("INTERPRET");
  const [selectedEngine, setSelectedEngine] = useState<string>("gemini-provider");
  const [reasoningMode, setReasoningMode] = useState<"STRICT_DEDUCTIVE" | "ABDUCTIVE_HYPOTHESIS" | "COUNTERFACTUAL_ANALYSIS" | "PHYSICAL_ANALOGY">("STRICT_DEDUCTIVE");
  const [permittedExternalKnowledge, setPermittedExternalKnowledge] = useState<boolean>(false);
  const [isReasoningExecuting, setIsReasoningExecuting] = useState<boolean>(false);
  const [reasoningReceipt, setReasoningReceipt] = useState<ReasoningReceipt | null>(() => {
    // Generate initial receipt matching initial envelope
    return generateDeterministicReasoningFallback({
      question: "What does the observed electrical double-layer potential distribution signify for ion exclusion?",
      evidenceRefs: ["Pore radius 1.2 nm", "Surface charge -45 mV", "Debye length 0.8 nm"],
      aperture: { spatial: "Nanopore lumen (1.2 nm radius)" },
      permittedExternalKnowledge: false,
      task: "INTERPRET"
    });
  });

  const [envelope, setEnvelope] = useState<SimonMeaningEnvelope>(() => {
    if (initialEnvelope) return initialEnvelope;
    return generateSimonMeaningForPoissonElectrostatics({
      poreRadiusNm: 1.2,
      surfaceChargeMv: -45.0,
      debyeLengthNm: 0.8,
      executionClass: "LOCAL_CPU_NUMPY",
      cudaObserved: false
    });
  });

  const [showAdversarialLab, setShowAdversarialLab] = useState(false);
  const [adversarialTestPhrase, setAdversarialTestPhrase] = useState(
    "Exon 5b causes differential synaptogenesis in deep midbrain."
  );
  const [simulatedAuditResult, setSimulatedAuditResult] = useState<any | null>(null);

  // Sync if initialEnvelope changes externally
  useEffect(() => {
    if (initialEnvelope) {
      setEnvelope(initialEnvelope);
      if (initialEnvelope.reasoning_receipt) {
        setReasoningReceipt(initialEnvelope.reasoning_receipt as any);
      }
    }
  }, [initialEnvelope]);

  const handleSelectPreset = (presetId: string) => {
    setActivePreset(presetId);
    let newEnv: SimonMeaningEnvelope;
    let fallbackReceipt: ReasoningReceipt;

    if (presetId === "poisson_boltzmann") {
      newEnv = generateSimonMeaningForPoissonElectrostatics({
        poreRadiusNm: 1.2,
        surfaceChargeMv: -45.0,
        debyeLengthNm: 0.8,
        executionClass: "LOCAL_CPU_NUMPY",
        cudaObserved: false
      });
      fallbackReceipt = generateDeterministicReasoningFallback({
        question: "What does the observed electrical double-layer potential distribution signify for ion exclusion?",
        evidenceRefs: ["Pore radius 1.2 nm", "Surface charge -45 mV", "Debye length 0.8 nm"],
        aperture: { spatial: "Nanopore lumen (1.2 nm radius)" },
        permittedExternalKnowledge,
        task: selectedTask,
        preferredEngineId: selectedEngine
      });
    } else if (presetId === "spatial_isoform") {
      newEnv = generateSimonMeaningForSpatialIsoform({
        gene: "Snap25",
        targetIsoform: "Snap25-201",
        cellType: "excitatory_neuron",
        moranI: 0.1718,
        expectedI: -0.0084,
        constrainedPVal: 0.0014,
        apertureNm: 500
      });
      fallbackReceipt = generateDeterministicReasoningFallback({
        question: "Does Snap25-201 spatial clustering signify cell-autonomous gene regulation or microenvironment spatial patterning?",
        evidenceRefs: ["Moran's I = 0.1718", "Constrained permutation p = 0.0014", "Spl-ISO-Seq2 500nm"],
        aperture: { spatial: "Coronal cortex (500 nm resolution)" },
        permittedExternalKnowledge,
        task: selectedTask,
        preferredEngineId: selectedEngine
      });
    } else if (presetId === "noaa_sst") {
      newEnv = synthesizeSimonMeaning(
        "noaa_avhrr_pathfinder_sst",
        {
          mean_sst_c: 18.24,
          skin_sst_c: 18.07,
          bulk_sst_c: 18.24,
          sst_anomaly_k: +0.48,
          execution_class: "LOCAL_CPU_NUMPY",
          cuda_observed: false
        },
        { t_11_k: 295.4, t_12_k: 293.8, satellite_zenith_deg: 32.0 }
      );
      fallbackReceipt = generateDeterministicReasoningFallback({
        question: newEnv.question,
        evidenceRefs: ["NOAA AVHRR Pathfinder 4km", "SST anomaly +0.48K", "Bulk 18.24°C", "JEMMA Verified"],
        aperture: newEnv.aperture,
        permittedExternalKnowledge,
        task: selectedTask,
        preferredEngineId: selectedEngine
      });
    } else if (presetId === "sdo_space_weather") {
      newEnv = synthesizeSimonMeaning(
        "solar_sdo_coronagraph_flux",
        {
          cme_velocity_kms: 728.0,
          predicted_l1_transit_hours: 42.1,
          solar_wind_dynamic_pressure_npa: 2.15,
          estimated_geomagnetic_kp_index: 5.2,
          execution_class: "LOCAL_CPU_NUMPY",
          cuda_observed: false
        },
        { aia_193_flux_dn_s: 4250.0, initial_cme_speed_kms: 850.0 }
      );
      fallbackReceipt = generateDeterministicReasoningFallback({
        question: newEnv.question,
        evidenceRefs: ["NASA SDO AIA 193Å", "CME speed 728 km/s", "Transit 42.1h", "JEMMA Verified"],
        aperture: newEnv.aperture,
        permittedExternalKnowledge,
        task: selectedTask,
        preferredEngineId: selectedEngine
      });
    } else if (presetId === "weathernext_era5") {
      newEnv = synthesizeSimonMeaning(
        "deepmind_weathernext_era5_audit",
        {
          forecast_rmse_k: 0.81,
          era5_reanalysis_correlation: 0.988,
          moisture_mass_conservation_error_pct: 0.038,
          execution_class: "LOCAL_CPU_NUMPY",
          cuda_observed: false
        },
        { forecast_lead_hours: 72, ensemble_members: 64 }
      );
      fallbackReceipt = generateDeterministicReasoningFallback({
        question: newEnv.question,
        evidenceRefs: ["DeepMind WeatherNext 3", "ECMWF ERA5 Ground Truth", "RMSE 0.81K", "JEMMA Verified"],
        aperture: newEnv.aperture,
        permittedExternalKnowledge,
        task: selectedTask,
        preferredEngineId: selectedEngine
      });
    } else {
      newEnv = synthesizeSimonMeaning(
        "kinematic_exact_integer",
        {
          nominal_teeth: 38,
          perturbed_teeth: 39,
          tooth_delta: 1,
          center_displacement_mm: 0.25,
          interference_binding: true,
          rational_ratio_departure_exact: "39/38",
          execution_class: "LOCAL_DETERMINISTIC",
          cuda_observed: false
        }
      );
      fallbackReceipt = generateDeterministicReasoningFallback({
        question: "Does tooth count perturbation from 38 to 39 produce continuous kinematic motion or physical binding?",
        evidenceRefs: ["Nominal 38T vs Perturbed 39T", "Center displacement 0.25 mm"],
        aperture: { spatial: "Spur gear pitch cylinder" },
        permittedExternalKnowledge,
        task: selectedTask,
        preferredEngineId: selectedEngine
      });
    }

    setEnvelope(newEnv);
    setReasoningReceipt(fallbackReceipt);
  };

  // Dispatch live Reasoning Engine call via governed ReasoningRail contract
  const handleExecuteReasoningRail = async () => {
    setIsReasoningExecuting(true);
    const req: ReasoningRequest = {
      requestId: `REQ-REASONING-${Date.now()}`,
      question: envelope.question,
      evidenceRefs: envelope.provenance_refs.length > 0
        ? envelope.provenance_refs
        : [envelope.what_pathfinder_found.substring(0, 48)],
      aperture: envelope.aperture,
      permittedExternalKnowledge,
      task: selectedTask,
      reasoningMode,
      preferredEngineId: selectedEngine,
      evidencePayload: {
        what_pathfinder_found: envelope.what_pathfinder_found,
        object_of_analysis: envelope.object_of_analysis,
        physical_terrain_context: envelope.physical_terrain_context
      }
    };

    try {
      const receipt = await executeReasoningRail(req);
      setReasoningReceipt(receipt);

      // Re-synthesize SIMON Meaning Envelope incorporating the Reasoning Receipt
      const updatedEnvelope = convertReasoningReceiptToSimonEnvelope(receipt, {
        question: envelope.question,
        object_of_analysis: envelope.object_of_analysis,
        aperture: envelope.aperture,
        what_pathfinder_found: envelope.what_pathfinder_found,
        provenance_refs: envelope.provenance_refs,
        execution_class: envelope.execution_semantics?.current_execution,
        cuda_observed: envelope.execution_semantics?.cuda_observed,
        uncertainty: envelope.uncertainty,
        terrainContext: envelope.physical_terrain_context
      });

      // Attach reasoning fields
      updatedEnvelope.reasoning_receipt = receipt as any;
      updatedEnvelope.quad_steps = receipt.quadSteps;

      setEnvelope(updatedEnvelope);
    } catch (err) {
      console.error("Reasoning rail execution error:", err);
    } finally {
      setIsReasoningExecuting(false);
    }
  };

  const runAdversarialSimulation = (testType: "causal_predicate" | "reasoning_epistemic_breach") => {
    if (testType === "causal_predicate") {
      const poisonedEnvelope: SimonMeaningEnvelope = {
        ...envelope,
        plain_language_meaning: `${envelope.plain_language_meaning} In addition, ${adversarialTestPhrase}`
      };

      const evidence = {
        envelope_id: "EVID-ADVERSARIAL-TEST",
        question: envelope.question,
        aperture: envelope.aperture,
        provenance: {
          source: "Adversarial Stress Test",
          timestamp: new Date().toISOString(),
          verification_level: "VERIFIED" as const
        },
        constraints: ["Observational spatial transcriptomics without interventional gene knockout"]
      };

      const audit = auditSimonEnvelope(poisonedEnvelope, evidence);
      setSimulatedAuditResult(audit);
    } else {
      // Adversarial attack: Model falsely claims MEASURED or DERIVED
      const modelClaimingMeasuredEnvelope: SimonMeaningEnvelope = {
        ...envelope,
        reasoning_receipt: {
          engineId: "rogue-adversarial-model",
          modelId: "uncalibrated-llm",
          reasoningMode: "PROBABILISTIC",
          permittedExternalKnowledge: true,
          requestHash: "0xad910...",
          responseHash: "0x0012f...",
          latencyMs: 120,
          inferredByDefault: true,
          invariantAttestation: "Reasoning capability does not equal epistemic authority.",
          assertions: [
            {
              statement: "The pore is permanently blocked by counter-ions under all conditions.",
              epistemicClass: "MEASURED" as any, // BREACH: Model claiming measured!
              evidenceRefs: ["Pore 1.2nm"],
              domainPrinciples: ["Electrostatics"],
              alternatives: [],
              uncertainty: "None"
            }
          ]
        }
      };

      const evidence = {
        envelope_id: "EVID-ADVERSARIAL-BREACH",
        question: envelope.question,
        aperture: envelope.aperture,
        provenance: {
          source: "Adversarial Invariant Breach Test",
          timestamp: new Date().toISOString(),
          verification_level: "VERIFIED" as const
        },
        constraints: []
      };

      const audit = auditSimonEnvelope(modelClaimingMeasuredEnvelope, evidence);
      setSimulatedAuditResult(audit);
    }
  };

  return (
    <div className="space-y-6 font-mono text-[#E6E4DF]">
      {/* ── 1. ARCHITECTURAL TRANSIT PIPELINE BANNER ──────────────────────── */}
      <div className="bg-[#0B0D13] border border-[#1E2536] rounded-xl p-4 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-sky-950/60 border border-sky-800/60 text-sky-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#737885] uppercase font-bold tracking-wider block">
                Pathfinder Governed Transit Architecture
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold mt-0.5">
                <span className="text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-800/40">
                  1. Science Rail (Computes)
                </span>
                <span className="text-[#555E70]">→</span>
                <span className="text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                  2. Reasoning Rail (Reasons)
                </span>
                <span className="text-[#555E70]">→</span>
                <span className="text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40">
                  3. SIMON (Gives Meaning)
                </span>
                <span className="text-[#555E70]">→</span>
                <span className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                  4. JEMMA (Audits Bridge)
                </span>
                <span className="text-[#555E70]">→</span>
                <span className="text-[#E6E4DF] bg-[#1B2130] px-2 py-0.5 rounded border border-[#2D364D]">
                  5. Operator (Decides)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-[#A0A8B8] bg-[#12151F] px-3 py-1.5 rounded-lg border border-[#22293C] shrink-0">
            <Scale className="w-4 h-4 text-[#C5A059]" />
            <span>Hard Invariant: <strong className="text-amber-400">Reasoning ≠ Epistemic Authority</strong></span>
          </div>
        </div>
      </div>

      {/* ── 2. REASONING RAIL CONTROL CENTER ──────────────────────────────── */}
      <div className="bg-[#0E1015] border border-[#222733] rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#1C212D]">
          <div>
            <h3 className="text-xs font-bold text-[#E6E4DF] uppercase tracking-wide flex items-center space-x-2">
              <Network className="w-4 h-4 text-[#38BDF8]" />
              <span>Governed Reasoning Rail Adapter & Engine Dispatch</span>
            </h3>
            <p className="text-[10px] text-[#737885] mt-0.5">
              Route semantic inference through the governed ReasoningRail contract. Output enters as INFERRED by default.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExecuteReasoningRail}
              disabled={isReasoningExecuting}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#C5A059] hover:bg-[#D4AF37] text-[#0D0E11] text-xs font-bold transition-all shadow cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isReasoningExecuting ? "Inference In Transit..." : "Invoke Governed Reasoning Engine"}</span>
            </button>
          </div>
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Col 1: Reasoning Task */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#737885] uppercase font-bold block">
              Reasoning Task
            </label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value as ReasoningTask)}
              className="w-full bg-[#141720] border border-[#222838] rounded-lg px-3 py-2 text-xs text-[#E6E4DF] focus:outline-none focus:border-[#C5A059] cursor-pointer"
            >
              <option value="INTERPRET">INTERPRET (Derive Significance)</option>
              <option value="COMPARE_HYPOTHESES">COMPARE_HYPOTHESES (Compete Models)</option>
              <option value="COUNTERFACTUAL">COUNTERFACTUAL (Falsification)</option>
              <option value="EXPLAIN_MECHANISM">EXPLAIN_MECHANISM (Formulate Physics)</option>
              <option value="NEXT_EXPERIMENT">NEXT_EXPERIMENT (Information Gain)</option>
            </select>
          </div>

          {/* Col 2: Reasoning Engine */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#737885] uppercase font-bold block">
              Approved Engine
            </label>
            <select
              value={selectedEngine}
              onChange={(e) => setSelectedEngine(e.target.value)}
              className="w-full bg-[#141720] border border-[#222838] rounded-lg px-3 py-2 text-xs text-[#38BDF8] focus:outline-none focus:border-[#C5A059] cursor-pointer"
            >
              <option value="gemini-provider">Gemini 2.5 Flash (Google AI)</option>
              <option value="gemini-pro-provider">Gemini 2.5 Pro (Deep Inference)</option>
              <option value="pathfinder-governed-reasoner">Pathfinder Governed Domain Reasoner</option>
              <option value="local-deterministic-mock">Air-Gapped Local Solver (Deterministic)</option>
            </select>
          </div>

          {/* Col 3: Reasoning Mode */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#737885] uppercase font-bold block">
              Reasoning Mode
            </label>
            <select
              value={reasoningMode}
              onChange={(e) => setReasoningMode(e.target.value as any)}
              className="w-full bg-[#141720] border border-[#222838] rounded-lg px-3 py-2 text-xs text-[#E6E4DF] focus:outline-none focus:border-[#C5A059] cursor-pointer"
            >
              <option value="STRICT_DEDUCTIVE">STRICT_DEDUCTIVE (Bound by axioms)</option>
              <option value="ABDUCTIVE_HYPOTHESIS">ABDUCTIVE_HYPOTHESIS (Best explanation)</option>
              <option value="COUNTERFACTUAL_ANALYSIS">COUNTERFACTUAL_ANALYSIS (Knockout test)</option>
              <option value="PHYSICAL_ANALOGY">PHYSICAL_ANALOGY (Continuum transfer)</option>
            </select>
          </div>

          {/* Col 4: Permitted External Knowledge */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#737885] uppercase font-bold block">
              External Knowledge Permissions
            </label>
            <div className="flex items-center space-x-2 pt-1.5">
              <input
                type="checkbox"
                id="externalKnowledgeToggle"
                checked={permittedExternalKnowledge}
                onChange={(e) => setPermittedExternalKnowledge(e.target.checked)}
                className="w-4 h-4 rounded bg-[#141720] border-[#222838] text-[#C5A059] focus:ring-0 cursor-pointer"
              />
              <label htmlFor="externalKnowledgeToggle" className="text-[11px] text-[#C5CAD4] cursor-pointer select-none">
                {permittedExternalKnowledge ? (
                  <span className="text-amber-400 font-bold">Open Scientific Corpus</span>
                ) : (
                  <span className="text-emerald-400 font-bold">Strict Closed-World Evidence</span>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Workload Presets Row */}
        <div className="pt-2 border-t border-[#181C26] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-[#737885] uppercase font-bold mr-1">
              Evidence Workload:
            </span>
            <button
              onClick={() => handleSelectPreset("poisson_boltzmann")}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer border ${
                activePreset === "poisson_boltzmann"
                  ? "bg-purple-950/60 border-purple-500/60 text-purple-300 shadow-sm"
                  : "bg-[#141720] border-[#222838] text-[#8A8F9A] hover:text-[#C5CAD4]"
              }`}
            >
              <span>Nanopore Poisson-Boltzmann</span>
            </button>

            <button
              onClick={() => handleSelectPreset("spatial_isoform")}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer border ${
                activePreset === "spatial_isoform"
                  ? "bg-purple-950/60 border-purple-500/60 text-purple-300 shadow-sm"
                  : "bg-[#141720] border-[#222838] text-[#8A8F9A] hover:text-[#C5CAD4]"
              }`}
            >
              <span>Spatial Isoform (Snap25-201)</span>
            </button>

            <button
              onClick={() => handleSelectPreset("kinematics")}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer border ${
                activePreset === "kinematics"
                  ? "bg-purple-950/60 border-purple-500/60 text-purple-300 shadow-sm"
                  : "bg-[#141720] border-[#222838] text-[#8A8F9A] hover:text-[#C5CAD4]"
              }`}
            >
              <span>Kinematic Gear Mesh</span>
            </button>

            <button
              onClick={() => handleSelectPreset("noaa_sst")}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer border ${
                activePreset === "noaa_sst"
                  ? "bg-sky-950/60 border-sky-500/60 text-sky-300 shadow-sm"
                  : "bg-[#141720] border-[#222838] text-[#8A8F9A] hover:text-[#C5CAD4]"
              }`}
            >
              <span>NOAA 4km SST (JEMMA)</span>
            </button>

            <button
              onClick={() => handleSelectPreset("sdo_space_weather")}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer border ${
                activePreset === "sdo_space_weather"
                  ? "bg-amber-950/60 border-amber-500/60 text-amber-300 shadow-sm"
                  : "bg-[#141720] border-[#222838] text-[#8A8F9A] hover:text-[#C5CAD4]"
              }`}
            >
              <span>Solar SDO CME (JEMMA)</span>
            </button>

            <button
              onClick={() => handleSelectPreset("weathernext_era5")}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer border ${
                activePreset === "weathernext_era5"
                  ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300 shadow-sm"
                  : "bg-[#141720] border-[#222838] text-[#8A8F9A] hover:text-[#C5CAD4]"
              }`}
            >
              <span>DeepMind WeatherNext / ERA5</span>
            </button>
          </div>

          <button
            onClick={() => setShowAdversarialLab(!showAdversarialLab)}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer border ${
              showAdversarialLab
                ? "bg-rose-950/60 border-rose-700/80 text-rose-300"
                : "bg-[#181C26] border-[#2B3346] text-[#A0A8B8] hover:text-[#E6E4DF]"
            }`}
          >
            {showAdversarialLab ? "Close Adversarial Lab" : "Adversarial Red-Team Lab"}
          </button>
        </div>
      </div>

      {/* ── 3. ADVERSARIAL RED-TEAMING SIMULATOR (COLLAPSIBLE) ────────────────── */}
      {showAdversarialLab && (
        <div className="bg-[#130E14] border border-rose-900/50 rounded-xl p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-rose-900/40">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase">
              <ShieldAlert className="w-4 h-4" />
              <span>JEMMA Adversarial Red-Teaming & Invariant Breach Simulator</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300 font-mono">
              STRESS_TEST_MODE
            </span>
          </div>

          <p className="text-xs text-[#A0A8B8] leading-relaxed">
            Test JEMMA&apos;s dual pre- and post-audit gates against simulated epistemic breaches, including unverified causal predicates and reasoning models attempting to claim <code>MEASURED</code> or <code>DERIVED</code> status.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Test 1: Causal Predicate Injection */}
            <div className="p-3.5 rounded-lg bg-[#0A070B] border border-rose-950 space-y-2">
              <span className="text-[10px] uppercase font-bold text-rose-400 block">
                Test 1: Unverified Causal Predicate Injection
              </span>
              <input
                type="text"
                value={adversarialTestPhrase}
                onChange={(e) => setAdversarialTestPhrase(e.target.value)}
                className="w-full bg-[#181018] border border-rose-900/60 rounded p-2 text-xs text-[#E6E4DF] font-mono focus:outline-none"
              />
              <button
                onClick={() => runAdversarialSimulation("causal_predicate")}
                className="w-full py-1.5 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-bold transition-all cursor-pointer"
              >
                Inject Causal Phrase & Run Audit
              </button>
            </div>

            {/* Test 2: Reasoning Model Falsely Claiming Measured Status */}
            <div className="p-3.5 rounded-lg bg-[#0A070B] border border-rose-950 space-y-2">
              <span className="text-[10px] uppercase font-bold text-rose-400 block">
                Test 2: Model Claiming [MEASURED] Epistemic Class
              </span>
              <p className="text-[11px] text-[#8A8F9A]">
                Simulates an uncalibrated reasoning model asserting its inferred synthesis as <code>MEASURED</code> physical truth.
              </p>
              <button
                onClick={() => runAdversarialSimulation("reasoning_epistemic_breach")}
                className="w-full py-1.5 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-bold transition-all cursor-pointer"
              >
                Test Invariant: REASONING_CANNOT_BE_MEASURED_OR_DERIVED
              </button>
            </div>
          </div>

          {/* Adversarial Audit Result Card */}
          {simulatedAuditResult && (
            <div
              className={`p-4 rounded-xl border text-xs space-y-2 ${
                simulatedAuditResult.passed
                  ? "bg-emerald-950/20 border-emerald-800 text-emerald-300"
                  : "bg-rose-950/40 border-rose-700 text-rose-200"
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>
                  JEMMA Audit Decision: {simulatedAuditResult.passed ? "PASSED (Compliance Verified)" : "REJECTED (Epistemic Firewall Triggered)"}
                </span>
                <span>Score: {simulatedAuditResult.proportionality_score}</span>
              </div>

              {simulatedAuditResult.violations.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="font-bold text-[11px] text-rose-400">Violations Caught by JEMMA:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#C5CAD4]">
                    {simulatedAuditResult.violations.map((v: string, idx: number) => (
                      <li key={idx} className="font-mono">{v}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── 4. PRIMARY SIMON MEANING LAYER COMPONENT ───────────────────────── */}
      <SimonMeaningLayer
        envelope={envelope}
        reasoningReceipt={reasoningReceipt}
        onDispatchNextStep={onDispatchNextStep}
      />
    </div>
  );
}
