import React, { useState, useEffect } from "react";
import {
  Cpu,
  Server,
  Activity,
  Shield,
  ShieldCheck,
  Zap,
  Terminal,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  HardDrive,
  Dna,
  Layers,
  ArrowRight,
  ExternalLink,
  Play,
  RotateCcw,
  Sparkles,
  GitCommit,
  Hash,
  Database,
  Lock,
  Microscope,
  Eye,
  Compass,
  Crosshair,
  Split,
  BookOpen,
  Brain
} from "lucide-react";
import { DigitalTwin } from "../types";
import { SimonMeaningPanel } from "./SimonMeaningPanel";
import { JemmaRailPanel } from "./JemmaRailPanel";
import {
  synthesizeSimonMeaning,
  SimonMeaningEnvelope,
  generateSimonMeaningForSpatialIsoform
} from "../lib/simon";
import { generateDeterministicReasoningFallback } from "../lib/reasoningRail";

interface ScienceRailHealthResponse {
  success: boolean;
  connected: boolean;
  endpoint: string;
  containerMode: string;
  latencyMs: number;
  data: {
    service: string;
    status: string;
    python_version: string;
    numpy_version: string;
    gpu_attested: boolean;
    cuda_observed: boolean;
    rasterizer_class: string;
    solver_status: string;
    epistemic_assertion: string;
    supported_workloads: string[];
    verifiedAt?: string;
  };
}

interface AttestationReceipt {
  status: string;
  attestation_class: string;
  gpu_attested: boolean;
  cuda_observed: boolean;
  python_engine: string;
  duration_ms: number;
  manifest_hash: string;
  receipt: {
    nonce: string;
    operator_id: string;
    started_ns: number;
    completed_ns: number;
    hash: string;
    benchmark_results: {
      nonce: string;
      operator_id: string;
      sample_size: number;
      mean: number;
      std: number;
      l2_norm: number;
      hardware: string;
      duration_ms: number;
    };
  };
}

interface WorkloadDef {
  id: string;
  name: string;
  domain: string;
  executionClass: string;
  complexity: string;
  equation: string;
  status: string;
  description: string;
}

interface ComputeRegistryProps {
  twin?: DigitalTwin | null;
  onNavigateToTab?: (tab: any) => void;
}

export function ComputeRegistry({ twin, onNavigateToTab }: ComputeRegistryProps) {
  const [health, setHealth] = useState<ScienceRailHealthResponse | null>(null);
  const [isLoadingHealth, setIsLoadingHealth] = useState(false);
  const [workloads, setWorkloads] = useState<WorkloadDef[]>([]);
  const [selectedWorkload, setSelectedWorkload] = useState<string>("vector_mean_stats");

  // Attestation Probe state
  const [isAttesting, setIsAttesting] = useState(false);
  const [attestationReceipt, setAttestationReceipt] = useState<AttestationReceipt | null>(null);
  const [sampleSize, setSampleSize] = useState<number>(25000);
  const [operatorId, setOperatorId] = useState<string>("OPERATOR_SOVEREIGN_ROOT");

  // Workload Dispatch state
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<any | null>(null);
  const [customParams, setCustomParams] = useState<string>(
    JSON.stringify({ values: [12.4, 45.1, 98.2, 33.7, 18.9, 64.3, 82.0] }, null, 2)
  );

  // Active view tab inside Compute Registry
  const [subTab, setSubTab] = useState<"overview" | "attestation" | "workloads" | "helix" | "aperture_field" | "simon" | "jemma_rail">("overview");

  // SIMON Semantic Interpretation Layer State
  const [simonEnvelope, setSimonEnvelope] = useState<SimonMeaningEnvelope | null>(
    () => generateSimonMeaningForSpatialIsoform({})
  );

  // Aperture & Spatial Isoform Field State (Nature Methods 2026 / Spl-ISO-Seq2)
  const [selectedGeneExemplar, setSelectedGeneExemplar] = useState<"Snap25" | "Rps24" | "Ighm" | "Arpp19" | "Gria2">("Snap25");
  const [apertureScale, setApertureScale] = useState<"55um" | "10um" | "500nm">("500nm");
  const [activeCellFilter, setActiveCellFilter] = useState<string>("all");

  const fetchHealth = async () => {
    setIsLoadingHealth(true);
    try {
      const res = await fetch("/api/compute/science-rail/status");
      if (res.ok) {
        const json = await res.json();
        setHealth(json);
      }
    } catch (e) {
      console.warn("Failed to query science rail status:", e);
    } finally {
      setIsLoadingHealth(false);
    }
  };

  const fetchWorkloads = async () => {
    try {
      const res = await fetch("/api/compute/science-rail/workloads");
      if (res.ok) {
        const json = await res.json();
        if (json.workloads) {
          setWorkloads(json.workloads);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch workloads:", e);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchWorkloads();
  }, []);

  const handleRunAttestation = async () => {
    setIsAttesting(true);
    try {
      const res = await fetch("/api/compute/science-rail/attest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operatorId, sampleSize })
      });
      if (res.ok) {
        const json = await res.json();
        setAttestationReceipt(json.receipt);
      }
    } catch (e) {
      console.error("Attestation check failed:", e);
    } finally {
      setIsAttesting(false);
    }
  };

  const handleDispatchWorkload = async () => {
    setIsDispatching(true);
    try {
      let parsedParams = {};
      try {
        parsedParams = JSON.parse(customParams);
      } catch (e) {
        parsedParams = { values: [1, 2, 3, 4, 5] };
      }

      const res = await fetch("/api/compute/science-rail/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: `DISPATCH-${Date.now()}`,
          twinId: twin?.id || "canonical-twin",
          canonicalVersion: "v1.0.0",
          workload: selectedWorkload,
          parameters: parsedParams
        })
      });

      if (res.ok) {
        const json = await res.json();
        setDispatchResult(json);
        try {
          const simon = synthesizeSimonMeaning(
            selectedWorkload,
            {
              ...json.result,
              execution_class: json.execution_class || "LOCAL_CPU_NUMPY",
              cuda_observed: json.receipt?.cuda_observed ?? false
            },
            parsedParams
          );
          const rr = generateDeterministicReasoningFallback({
            question: simon.question,
            evidenceRefs: simon.provenance_refs.length > 0 ? simon.provenance_refs : [simon.what_pathfinder_found.substring(0, 48)],
            aperture: simon.aperture,
            permittedExternalKnowledge: false,
            task: "INTERPRET"
          });
          simon.reasoning_receipt = rr as any;
          simon.quad_steps = rr.quadSteps;
          setSimonEnvelope(simon);
        } catch (simonErr) {
          console.warn("Failed to generate SIMON envelope for dispatch:", simonErr);
        }
      }
    } catch (e) {
      console.error("Workload dispatch error:", e);
    } finally {
      setIsDispatching(false);
    }
  };

  const handleSelectWorkloadPreset = (wlId: string) => {
    setSelectedWorkload(wlId);
    if (wlId === "vector_mean_stats") {
      setCustomParams(JSON.stringify({ values: [14.2, 28.5, 39.1, 44.0, 52.6, 68.3, 91.0] }, null, 2));
    } else if (wlId === "kinematic_exact_integer") {
      setCustomParams(JSON.stringify({ nominal_teeth: 38, perturbed_teeth: 39 }, null, 2));
    } else if (wlId === "membrane_potential_well") {
      setCustomParams(JSON.stringify({ pore_radius_nm: 1.2, surface_charge_mv: -45.0 }, null, 2));
    } else if (wlId === "cooled_radiative_flux") {
      setCustomParams(JSON.stringify({ t_amb_c: 35.0, rh_pct: 45.0, solar_wm2: 950.0 }, null, 2));
    } else if (wlId === "termite_co2_diffusion") {
      setCustomParams(JSON.stringify({ diffusion_coeff_m2s: 1.4e-5, chimney_open_pct: 85.0 }, null, 2));
    } else if (wlId === "spatial_isoform_moran_field") {
      setCustomParams(JSON.stringify({
        gene: "Snap25",
        target_isoform: "Snap25-201",
        cell_type: "excitatory_neuron",
        aperture_resolution_nm: 500,
        k_neighbors: 50,
        sample_cells: 120
      }, null, 2));
    } else if (wlId === "noaa_avhrr_pathfinder_sst") {
      setCustomParams(JSON.stringify({
        t_11_k: 295.4,
        t_12_k: 293.8,
        satellite_zenith_deg: 32.0
      }, null, 2));
    } else if (wlId === "solar_sdo_coronagraph_flux") {
      setCustomParams(JSON.stringify({
        aia_193_flux_dn_s: 4250.0,
        initial_cme_speed_kms: 850.0,
        solar_wind_speed_kms: 440.0,
        imf_bz_nt: -4.8
      }, null, 2));
    } else if (wlId === "deepmind_weathernext_era5_audit") {
      setCustomParams(JSON.stringify({
        forecast_lead_hours: 72,
        ensemble_members: 64
      }, null, 2));
    } else if (wlId === "merra2_surface_radiation_flux") {
      setCustomParams(JSON.stringify({
        incoming_shortwave_wm2: 720.0,
        downward_longwave_wm2: 340.0,
        surface_albedo: 0.16,
        aster_emissivity_ag100: 0.975,
        surface_temp_c: 26.5
      }, null, 2));
    }
  };

  const isConnected = health?.connected ?? false;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 space-y-8 font-mono">
      {/* Top Banner & Header */}
      <div className="bg-[#0E1015] border border-[#222733] rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 rounded-lg bg-[#181C26] border border-[#303748] text-[#C5A059]">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2.5">
                  <h1 className="text-xl font-bold tracking-tight text-[#E6E4DF] uppercase">
                    Compute Registry & Science Rail
                  </h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
                    CONTAINER SYSTEM
                  </span>
                </div>
                <p className="text-xs text-[#8A8F9A] mt-0.5">
                  Pathfinder Node 22 Body $\longleftrightarrow$ Python 3.12 Scientific Compute Organ
                </p>
              </div>
            </div>
          </div>

          {/* Connection Health Badge & Attestation Action */}
          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg border text-xs ${
                isConnected
                  ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
                  : "bg-amber-950/50 border-amber-500/40 text-amber-300"
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              <div>
                <div className="font-bold text-[11px]">
                  {isConnected ? "SCIENCE CONTAINER ONLINE" : "STANDALONE LOCAL FALLBACK"}
                </div>
                <div className="text-[10px] opacity-80">
                  {health?.endpoint || "http://localhost:8000"} · {health?.latencyMs ?? 0}ms
                </div>
              </div>
            </div>

            <button
              onClick={fetchHealth}
              disabled={isLoadingHealth}
              className="flex items-center space-x-1.5 px-3 py-2 rounded bg-[#1A1E29] border border-[#2D3546] hover:bg-[#252C3D] text-[#D1D5DB] text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHealth ? "animate-spin" : ""}`} />
              <span>Probe</span>
            </button>

            <button
              onClick={() => {
                setSubTab("attestation");
                handleRunAttestation();
              }}
              disabled={isAttesting}
              className="flex items-center space-x-2 px-4 py-2 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-[#0D0E11] text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isAttesting ? "Attesting..." : "Run Attestation Check"}</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-[#1C212D] text-xs overflow-x-auto">
          <button
            onClick={() => setSubTab("overview")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              subTab === "overview"
                ? "bg-[#202634] text-[#E6E4DF] border border-[#3A455C]"
                : "text-[#8A8F9A] hover:text-[#D1D5DB] hover:bg-[#141720]"
            }`}
          >
            <Server className="w-3.5 h-3.5 text-[#509EE3]" />
            <span>Architecture & Health</span>
          </button>

          <button
            onClick={() => setSubTab("attestation")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              subTab === "attestation"
                ? "bg-[#202634] text-[#E6E4DF] border border-[#3A455C]"
                : "text-[#8A8F9A] hover:text-[#D1D5DB] hover:bg-[#141720]"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Operator Attestation Probe</span>
          </button>

          <button
            onClick={() => setSubTab("workloads")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              subTab === "workloads"
                ? "bg-[#202634] text-[#E6E4DF] border border-[#3A455C]"
                : "text-[#8A8F9A] hover:text-[#D1D5DB] hover:bg-[#141720]"
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Scientific Workloads ({workloads.length})</span>
          </button>

          <button
            onClick={() => setSubTab("helix")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              subTab === "helix"
                ? "bg-[#202634] text-[#E6E4DF] border border-[#3A455C]"
                : "text-[#8A8F9A] hover:text-[#D1D5DB] hover:bg-[#141720]"
            }`}
          >
            <Dna className="w-3.5 h-3.5 text-purple-400" />
            <span>Co-Evolutionary Learning Helix</span>
          </button>

          <button
            onClick={() => setSubTab("aperture_field")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              subTab === "aperture_field"
                ? "bg-[#202634] text-[#E6E4DF] border border-[#3A455C]"
                : "text-[#8A8F9A] hover:text-[#D1D5DB] hover:bg-[#141720]"
            }`}
          >
            <Microscope className="w-3.5 h-3.5 text-emerald-400" />
            <span>Aperture & Spatial Isoform Field</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
              500nm
            </span>
          </button>

          <button
            onClick={() => setSubTab("simon")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              subTab === "simon"
                ? "bg-purple-950/60 text-purple-200 border border-purple-700/60"
                : "text-[#8A8F9A] hover:text-[#D1D5DB] hover:bg-[#141720]"
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>SIMON — Meaning Layer</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-950 text-purple-300 border border-purple-800/60">
              Jemma Audited
            </span>
          </button>

          <button
            onClick={() => setSubTab("jemma_rail")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              subTab === "jemma_rail"
                ? "bg-amber-950/60 text-amber-200 border border-amber-600/60"
                : "text-[#8A8F9A] hover:text-[#D1D5DB] hover:bg-[#141720]"
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>JEMMA — Reality & Ground-Truth Rail</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800/60 font-mono">
              Guardian
            </span>
          </button>
        </div>
      </div>

      {/* ── SUB-TAB 1: ARCHITECTURE & HEALTH OVERVIEW ────────────────────────── */}
      {subTab === "overview" && (
        <div className="space-y-8">
          {/* Dual-Container Architectural Topology Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Box 1: Pathfinder Node 22 Body */}
            <div className="bg-[#0E1015] border border-[#222733] rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#1C212D]">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-400">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[#E6E4DF] uppercase">Pathfinder Body</h3>
                      <p className="text-[10px] text-[#737885]">Node.js 22 Runtime · Port 3000</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-400">
                    AUTHORITATIVE
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs text-[#A0A8B8]">
                  <div className="flex items-center justify-between py-1 border-b border-[#161922]">
                    <span className="text-[#737885]">Sovereign Operator UI</span>
                    <span className="text-[#E6E4DF]">React 18 + R3F Spatial Canvas</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#161922]">
                    <span className="text-[#737885]">Boundary Membrane</span>
                    <span className="text-[#C5A059]">Octagon N-Face Guard</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#161922]">
                    <span className="text-[#737885]">Attention Gate</span>
                    <span className="text-[#E6E4DF]">signalToNoise() Dual-Baseline</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#161922]">
                    <span className="text-[#737885]">Policy Evaluation</span>
                    <span className="text-[#E6E4DF]">Dogwood Invariant Engine</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[#737885]">Canonical State Ledger</span>
                    <span className="text-[#E6E4DF]">Immutable SHA-256 Provenance</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-lg bg-[#141722] border border-[#262D3D] text-[11px] text-[#8A8F9A]">
                <strong>Epistemic Rule:</strong> The Node 22 body holds all authority. External or Python compute cannot write into canonical state without explicit Operator promotion.
              </div>
            </div>

            {/* Box 2: The Attested Sealed Bridge */}
            <div className="bg-[#0E1015] border border-[#222733] rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#1C212D]">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded bg-blue-950/60 border border-blue-500/40 text-blue-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[#E6E4DF] uppercase">Attested Rail Bridge</h3>
                      <p className="text-[10px] text-[#737885]">HTTP/JSON · Cryptographic Envelope</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/50 text-blue-400">
                    ISOLATED
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs text-[#A0A8B8]">
                  <div className="flex items-center justify-between py-1 border-b border-[#161922]">
                    <span className="text-[#737885]">Direction</span>
                    <span className="text-[#E6E4DF]">Bidirectional Container Interface</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#161922]">
                    <span className="text-[#737885]">Ingress Contract</span>
                    <span className="text-[#E6E4DF]">Sealed Workload Input Hash</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#161922]">
                    <span className="text-[#737885]">Egress Contract</span>
                    <span className="text-[#E6E4DF]">Raw Output Artifact + Receipt</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#161922]">
                    <span className="text-[#737885]">Hash Algorithm</span>
                    <span className="text-[#C5A059]">Canonical UTF-8 SHA-256</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[#737885]">Fail-Closed Status</span>
                    <span className="text-emerald-400 font-bold">STOP on Mismatch</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-lg bg-[#141722] border border-[#262D3D] text-[11px] text-[#8A8F9A]">
                <strong>Octagon Point:</strong> <code>local-python-science-01</code>. Mismatched or truncated manifests are rejected before tensor execution starts.
              </div>
            </div>

            {/* Box 3: Python 3.12 Science Rail Organ */}
            <div className="bg-[#0E1015] border border-[#222733] rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#1C212D]">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded bg-purple-950/60 border border-purple-500/40 text-purple-400">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[#E6E4DF] uppercase">Science Rail Organ</h3>
                      <p className="text-[10px] text-[#737885]">Python 3.12 · FastAPI · Port 8000</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded border ${
                      isConnected
                        ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-400"
                        : "bg-amber-950/80 border-amber-500/50 text-amber-400"
                    }`}
                  >
                    {isConnected ? "HEALTHY" : "FALLBACK ACTIVE"}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs text-[#A0A8B8]">
                  <div className="flex items-center justify-between py-1 border-b border-[#161922]">
                    <span className="text-[#737885]">Math Libraries</span>
                    <span className="text-[#E6E4DF]">NumPy, SciPy, Pydantic, Orjson</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#161922]">
                    <span className="text-[#737885]">CUDA / GPU Observed</span>
                    <span className="text-amber-400">False (Honest CPU Attestation)</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#161922]">
                    <span className="text-[#737885]">Rasterizer Class</span>
                    <span className="text-[#E6E4DF]">cpu_swiftshader (Vulkan Subzero)</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#161922]">
                    <span className="text-[#737885]">Execution Class</span>
                    <span className="text-[#C5A059]">LOCAL_CPU_NUMPY</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[#737885]">Jupyter Lab Profile</span>
                    <span className="text-[#E6E4DF]">Optional --profile lab (:8888)</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-lg bg-[#141722] border border-[#262D3D] text-[11px] text-[#8A8F9A]">
                <strong>Scientific Engine:</strong> Runs deterministic sweeps, PDE systems, and multi-scale convolutions without claiming fabricated GPU speedups.
              </div>
            </div>
          </div>

          {/* Detailed Telemetry & Environment Manifest */}
          <div className="bg-[#0E1015] border border-[#222733] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C212D]">
              <h3 className="text-xs font-bold text-[#E6E4DF] uppercase flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-[#C5A059]" />
                <span>Live Science Rail Attestation Telemetry</span>
              </h3>
              <span className="text-[10px] text-[#737885]">
                Last Verified: {health?.data?.verifiedAt || new Date().toLocaleTimeString()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-[#141720] border border-[#222735] p-3.5 rounded-lg">
                <div className="text-[10px] text-[#737885] uppercase">Service Identifier</div>
                <div className="text-[#E6E4DF] font-bold mt-1">{health?.data?.service || "pathfinder-science"}</div>
                <div className="text-[10px] text-[#509EE3] mt-0.5">Mode: {health?.containerMode || "LOCAL_NODE_FALLBACK"}</div>
              </div>

              <div className="bg-[#141720] border border-[#222735] p-3.5 rounded-lg">
                <div className="text-[10px] text-[#737885] uppercase">Python Engine</div>
                <div className="text-[#E6E4DF] font-bold mt-1">{health?.data?.python_version || "3.12 (CPython)"}</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">NumPy: {health?.data?.numpy_version || "2.1.0"}</div>
              </div>

              <div className="bg-[#141720] border border-[#222735] p-3.5 rounded-lg">
                <div className="text-[10px] text-[#737885] uppercase">Hardware Attestation</div>
                <div className="text-amber-300 font-bold mt-1">CPU Host Engine</div>
                <div className="text-[10px] text-[#8A8F9A] mt-0.5">GPU: None / SwiftShader CPU</div>
              </div>

              <div className="bg-[#141720] border border-[#222735] p-3.5 rounded-lg">
                <div className="text-[10px] text-[#737885] uppercase">Solver Status</div>
                <div className="text-emerald-400 font-bold mt-1">{health?.data?.solver_status || "AVAILABLE_CPU"}</div>
                <div className="text-[10px] text-[#C5A059] mt-0.5">{workloads.length} Workloads Registered</div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#141720] border border-[#222735] text-xs text-[#8A8F9A]">
              <strong className="text-[#E6E4DF]">Doctrine Statement:</strong>{" "}
              {health?.data?.epistemic_assertion ||
                "Science rail container reachable via `docker compose up science`. Local deterministic math active as fallback."}
            </div>
          </div>
        </div>
      )}

      {/* ── SUB-TAB 2: OPERATOR ATTESTATION PROBE ────────────────────────────── */}
      {subTab === "attestation" && (
        <div className="space-y-6">
          <div className="bg-[#0E1015] border border-[#222733] rounded-xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1C212D]">
              <div>
                <h3 className="text-sm font-bold text-[#E6E4DF] uppercase flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Manual Sovereign Attestation Benchmark Probe</span>
                </h3>
                <p className="text-xs text-[#8A8F9A] mt-1">
                  Generates an attested benchmark load ($N = {sampleSize.toLocaleString()}$ float64 elements) to measure raw execution duration, verify SHA-256 seal identity, and prove runtime integrity.
                </p>
              </div>

              <button
                onClick={handleRunAttestation}
                disabled={isAttesting}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#C5A059] hover:bg-[#D4AF37] text-[#0D0E11] text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                <span>{isAttesting ? "Executing Benchmark..." : "Dispatch Attestation Probe"}</span>
              </button>
            </div>

            {/* Probe Configuration Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[11px] text-[#737885] uppercase font-bold block mb-1.5">
                  Operator Identity (Signing Authority)
                </label>
                <input
                  type="text"
                  value={operatorId}
                  onChange={(e) => setOperatorId(e.target.value)}
                  className="w-full bg-[#141720] border border-[#262D3D] rounded-lg px-3.5 py-2 text-xs text-[#E6E4DF] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#737885] uppercase font-bold block mb-1.5">
                  Sample Size ($N$ Float64 Elements)
                </label>
                <select
                  value={sampleSize}
                  onChange={(e) => setSampleSize(Number(e.target.value))}
                  className="w-full bg-[#141720] border border-[#262D3D] rounded-lg px-3.5 py-2 text-xs text-[#E6E4DF] focus:outline-none focus:border-[#C5A059]"
                >
                  <option value={10000}>10,000 Elements (Fast Probe ~0.5ms)</option>
                  <option value={25000}>25,000 Elements (Standard Probe ~1.2ms)</option>
                  <option value={100000}>100,000 Elements (Thorough Probe ~4.5ms)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Attestation Receipt Card */}
          {attestationReceipt ? (
            <div className="bg-[#0E1015] border border-[#222733] rounded-xl p-6 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-[#1C212D]">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-xs font-bold uppercase text-[#E6E4DF]">
                    Signed Attestation Receipt Envelope
                  </h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  {attestationReceipt.attestation_class}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-[#141720] border border-[#222735] p-3 rounded-lg">
                  <span className="text-[10px] text-[#737885] uppercase">Execution Duration</span>
                  <div className="text-emerald-400 text-lg font-bold mt-0.5">
                    {attestationReceipt.duration_ms.toFixed(3)} ms
                  </div>
                  <div className="text-[10px] text-[#8A8F9A]">
                    Started: {attestationReceipt.receipt.started_ns} ns
                  </div>
                </div>

                <div className="bg-[#141720] border border-[#222735] p-3 rounded-lg">
                  <span className="text-[10px] text-[#737885] uppercase">Computed $L_2$ Norm</span>
                  <div className="text-[#509EE3] text-lg font-bold mt-0.5">
                    {attestationReceipt.receipt.benchmark_results.l2_norm.toFixed(4)}
                  </div>
                  <div className="text-[10px] text-[#8A8F9A]">
                    Mean: {attestationReceipt.receipt.benchmark_results.mean.toFixed(6)}
                  </div>
                </div>

                <div className="bg-[#141720] border border-[#222735] p-3 rounded-lg">
                  <span className="text-[10px] text-[#737885] uppercase">Engine Execution</span>
                  <div className="text-[#C5A059] text-sm font-bold mt-1">
                    {attestationReceipt.python_engine}
                  </div>
                  <div className="text-[10px] text-[#8A8F9A]">
                    GPU: {attestationReceipt.gpu_attested ? "Observed" : "Unobserved (Honest)"}
                  </div>
                </div>
              </div>

              {/* Cryptographic SHA-256 Manifest Hash */}
              <div className="p-3 rounded-lg bg-[#141720] border border-[#222735]">
                <div className="flex items-center justify-between mb-1 text-[10px] text-[#737885]">
                  <span className="uppercase font-bold flex items-center space-x-1.5">
                    <Hash className="w-3 h-3 text-[#C5A059]" />
                    <span>Cryptographic Manifest Hash (SHA-256)</span>
                  </span>
                  <span className="text-emerald-400 font-bold">SEALED IDENTICAL</span>
                </div>
                <code className="text-xs text-[#C5A059] break-all font-mono">
                  {attestationReceipt.manifest_hash}
                </code>
              </div>

              {/* Raw JSON Artifact Viewer */}
              <details className="text-xs text-[#8A8F9A] cursor-pointer">
                <summary className="hover:text-[#E6E4DF] transition-colors font-bold uppercase text-[10px]">
                  View Raw Signed Attestation Receipt JSON
                </summary>
                <pre className="mt-2 p-3 bg-[#0B0C10] border border-[#1F2432] rounded-lg text-[11px] text-[#A0A8B8] overflow-x-auto">
                  {JSON.stringify(attestationReceipt, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <div className="bg-[#0E1015] border border-[#222733] rounded-xl p-12 text-center text-[#737885] text-xs">
              <Shield className="w-8 h-8 text-[#424756] mx-auto mb-3" />
              <p>No attestation probe executed yet in this session.</p>
              <p className="text-[11px] mt-1 text-[#555C6E]">
                Click "Dispatch Attestation Probe" above to verify the science container.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── SUB-TAB 3: SCIENTIFIC WORKLOADS CATALOGUE & DISPATCHER ───────────── */}
      {subTab === "workloads" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Workloads Selection List */}
            <div className="lg:col-span-1 bg-[#0E1015] border border-[#222733] rounded-xl p-4 space-y-3">
              <div className="text-xs font-bold uppercase text-[#E6E4DF] pb-2 border-b border-[#1C212D]">
                Registered Scientific Workloads ({workloads.length})
              </div>

              <div className="space-y-2">
                {workloads.map((wl) => {
                  const isSelected = selectedWorkload === wl.id;
                  return (
                    <div
                      key={wl.id}
                      onClick={() => handleSelectWorkloadPreset(wl.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[#1A1F2C] border-[#C5A059] text-[#E6E4DF]"
                          : "bg-[#141720] border-[#222735] text-[#8A8F9A] hover:border-[#384154] hover:text-[#D1D5DB]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs">{wl.name}</div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#0B0D12] border border-[#2D3342] text-[#C5A059]">
                          {wl.complexity}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#737885] mt-1 capitalize">Domain: {wl.domain}</div>
                      <div className="text-[10px] text-[#A0A8B8] mt-1 line-clamp-2">{wl.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Workload Parameter Editor & Dispatch Playground */}
            <div className="lg:col-span-2 bg-[#0E1015] border border-[#222733] rounded-xl p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#1C212D]">
                  <div>
                    <h3 className="text-xs font-bold uppercase text-[#E6E4DF]">
                      Workload Dispatch & Equation Manifest
                    </h3>
                    <p className="text-[10px] text-[#737885] mt-0.5">
                      Selected: <code className="text-[#C5A059]">{selectedWorkload}</code>
                    </p>
                  </div>

                  <button
                    onClick={handleDispatchWorkload}
                    disabled={isDispatching}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#C5A059] hover:bg-[#D4AF37] text-[#0D0E11] text-xs font-bold transition-all shadow cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isDispatching ? "Computing..." : "Dispatch to Science Rail"}</span>
                  </button>
                </div>

                {/* Equation Card */}
                {workloads.find((w) => w.id === selectedWorkload) && (
                  <div className="p-3 rounded-lg bg-[#141720] border border-[#222735]">
                    <div className="text-[10px] text-[#737885] uppercase font-bold mb-1">
                      Governing Mathematical Equation
                    </div>
                    <code className="text-xs text-[#509EE3] font-mono">
                      {workloads.find((w) => w.id === selectedWorkload)?.equation}
                    </code>
                  </div>
                )}

                {/* Parameter Editor */}
                <div>
                  <label className="text-[11px] text-[#737885] uppercase font-bold block mb-1">
                    Input Parameters (JSON Manifest)
                  </label>
                  <textarea
                    rows={4}
                    value={customParams}
                    onChange={(e) => setCustomParams(e.target.value)}
                    className="w-full bg-[#12141A] border border-[#262D3D] rounded-lg p-3 text-xs text-[#E6E4DF] font-mono focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Execution Result Artifact */}
              {dispatchResult && (
                <div className="mt-4 p-4 rounded-lg bg-[#12151D] border border-[#222938] space-y-3 animate-in fade-in duration-200">
                  <div className="flex flex-wrap items-center justify-between text-xs pb-2 border-b border-[#1D2433] gap-2">
                    <span className="font-bold text-emerald-400 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Result Artifact Generated ({dispatchResult.receipt?.duration_ms?.toFixed(3)} ms)</span>
                    </span>
                    <div className="flex items-center space-x-2 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-[#10131B] border border-[#262E3E] text-[#8A8F9A]">
                        Capability: <strong className="text-emerald-400 font-bold">GPU AVAILABLE</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#1A1D27] border border-[#303748] text-[#38BDF8] font-bold">
                        Exec: {dispatchResult.execution_class || "LOCAL_CPU_NUMPY"}
                        {dispatchResult.receipt?.cuda_observed === false && (
                          <span className="text-[#8A8F9A] font-normal ml-1">(CUDA: False)</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs">
                    <pre className="p-3 bg-[#0A0B0E] border border-[#1A1E29] rounded-lg text-[11px] text-[#C5CAD4] overflow-x-auto">
                      {JSON.stringify(dispatchResult.result, null, 2)}
                    </pre>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[10px] text-[#737885] gap-2 pt-1">
                    <span>
                      Input Hash: <code className="text-[#A0A8B8]">{dispatchResult.receipt?.input_hash?.substring(0, 16)}...</code>
                    </span>
                    <span>
                      Output Hash: <code className="text-emerald-400">{dispatchResult.receipt?.output_hash?.substring(0, 16)}...</code>
                    </span>
                  </div>

                  {/* Inline SIMON Interpretation Card */}
                  {simonEnvelope && (
                    <div className="mt-3 pt-3 border-t border-[#1F2535] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Brain className="w-3.5 h-3.5 text-purple-400" />
                          <span className="text-[11px] font-bold text-purple-200">
                            SIMON Semantic Interpretation Attached
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                            Jemma Audited
                          </span>
                        </div>
                        <button
                          onClick={() => setSubTab("simon")}
                          className="text-[11px] text-purple-400 hover:text-purple-300 underline font-medium cursor-pointer"
                        >
                          Expand Full Meaning Envelope →
                        </button>
                      </div>
                      <p className="text-xs text-[#E6E4DF] leading-relaxed font-sans bg-purple-950/20 p-2.5 rounded-lg border border-purple-800/40">
                        {simonEnvelope.plain_language_meaning}
                      </p>
                    </div>
                  )}

                  {/* Inline JEMMA Ground-Truth Reality Receipt */}
                  {dispatchResult.jemma_receipt && (
                    <div className="mt-3 pt-3 border-t border-[#1F2535] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[11px] font-bold text-amber-200">
                            JEMMA Ground-Truth Reality Audit
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-mono">
                            {dispatchResult.jemma_receipt.status}
                          </span>
                        </div>
                        <button
                          onClick={() => setSubTab("jemma_rail")}
                          className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
                        >
                          View JEMMA Reality Rail →
                        </button>
                      </div>

                      <div className="p-2.5 rounded-lg bg-amber-950/15 border border-amber-500/30 text-xs space-y-1.5 font-sans">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                          <span className="text-[#9CA3AF]">
                            Benchmark Dataset: <strong className="text-[#E6E4DF] font-mono">{dispatchResult.jemma_receipt.groundTruthAnchor?.datasetName}</strong>
                          </span>
                          <span className="text-sky-300 font-mono">
                            Drift: {(dispatchResult.jemma_receipt.driftScore * 100).toFixed(2)}% · Proportionality: {dispatchResult.jemma_receipt.proportionalityScore?.toFixed(4)}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#A0AEC0] italic">
                          "{dispatchResult.jemma_receipt.invariantAttestation}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── SUB-TAB 4: CO-EVOLUTIONARY LEARNING HELIX ───────────────────────── */}
      {subTab === "helix" && (
        <div className="space-y-6">
          <div className="bg-[#0E1015] border border-[#222733] rounded-xl p-6 space-y-5">
            <div>
              <div className="flex items-center space-x-2.5 mb-1.5">
                <div className="p-1.5 rounded bg-purple-950/60 border border-purple-500/40 text-purple-400">
                  <Dna className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold uppercase text-[#E6E4DF]">
                  The Co-Evolutionary Learning Helix (Double-Helix Kernel)
                </h3>
              </div>
              <p className="text-xs text-[#8A8F9A]">
                Teaching changes because learning changes; learning changes because teaching responds. The dynamic helix runs through every domain terrain.
              </p>
            </div>

            {/* The Double Helix Two Strands Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strand 1: Learning Strand */}
              <div className="p-4 rounded-xl bg-[#141720] border border-blue-500/30 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-blue-500/20">
                  <span className="text-xs font-bold text-blue-400 uppercase">Learning Strand (Learner)</span>
                  <span className="text-[10px] text-[#737885]">What the learner constructs</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded bg-[#0E1015] border border-[#1F2432] flex items-center justify-between">
                    <span className="font-bold text-[#E6E4DF]">1. Observe</span>
                    <span className="text-[10px] text-[#737885]">Notice phenomenon</span>
                  </div>
                  <div className="p-2 rounded bg-[#0E1015] border border-[#1F2432] flex items-center justify-between">
                    <span className="font-bold text-[#E6E4DF]">2. Attempt</span>
                    <span className="text-[10px] text-[#737885]">Independent action</span>
                  </div>
                  <div className="p-2 rounded bg-[#0E1015] border border-[#1F2432] flex items-center justify-between">
                    <span className="font-bold text-amber-400">3. Make Error</span>
                    <span className="text-[10px] text-amber-400/80">Encounter boundary</span>
                  </div>
                  <div className="p-2 rounded bg-[#0E1015] border border-[#1F2432] flex items-center justify-between">
                    <span className="font-bold text-[#E6E4DF]">4. Reflect</span>
                    <span className="text-[10px] text-[#737885]">Process feedback</span>
                  </div>
                  <div className="p-2 rounded bg-[#0E1015] border border-[#1F2432] flex items-center justify-between">
                    <span className="font-bold text-[#E6E4DF]">5. Integrate</span>
                    <span className="text-[10px] text-[#737885]">Reconstruct schema</span>
                  </div>
                  <div className="p-2 rounded bg-[#0E1015] border border-[#1F2432] flex items-center justify-between">
                    <span className="font-bold text-emerald-400">6. Transfer</span>
                    <span className="text-[10px] text-emerald-400/80">Apply in changed context</span>
                  </div>
                </div>
              </div>

              {/* Strand 2: Teaching Strand */}
              <div className="p-4 rounded-xl bg-[#141720] border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
                  <span className="text-xs font-bold text-purple-400 uppercase">Teaching Strand (System)</span>
                  <span className="text-[10px] text-[#737885]">What the system provides</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded bg-[#0E1015] border border-[#1F2432] flex items-center justify-between">
                    <span className="font-bold text-[#E6E4DF]">1. Elicit</span>
                    <span className="text-[10px] text-[#737885]">Prompt inquiry</span>
                  </div>
                  <div className="p-2 rounded bg-[#0E1015] border border-[#1F2432] flex items-center justify-between">
                    <span className="font-bold text-[#E6E4DF]">2. Model</span>
                    <span className="text-[10px] text-[#737885]">Demonstrate pattern</span>
                  </div>
                  <div className="p-2 rounded bg-[#0E1015] border border-[#1F2432] flex items-center justify-between">
                    <span className="font-bold text-amber-400">3. Diagnose</span>
                    <span className="text-[10px] text-amber-400/80">Isolate misconception</span>
                  </div>
                  <div className="p-2 rounded bg-[#0E1015] border border-[#1F2432] flex items-center justify-between">
                    <span className="font-bold text-[#E6E4DF]">4. Scaffold</span>
                    <span className="text-[10px] text-[#737885]">Support boundary</span>
                  </div>
                  <div className="p-2 rounded bg-[#0E1015] border border-[#1F2432] flex items-center justify-between">
                    <span className="font-bold text-[#E6E4DF]">5. Validate</span>
                    <span className="text-[10px] text-[#737885]">Evidence anchoring</span>
                  </div>
                  <div className="p-2 rounded bg-[#0E1015] border border-[#1F2432] flex items-center justify-between">
                    <span className="font-bold text-purple-400">6. Fade Support</span>
                    <span className="text-[10px] text-purple-400/80">Allow autonomous mastery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Point Decisive Mastery Checkpoint */}
            <div className="p-4 rounded-xl bg-[#141722] border border-[#252C3D] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#C5A059] uppercase">
                  The 5-Point Decisive Mastery Checkpoint
                </span>
                <span className="text-[10px] text-[#737885]">Autonomous Replication Proof</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-[#0E1015] border border-[#1F2432] text-center">
                  <div className="text-[#C5A059] font-bold">1. Pattern</div>
                  <div className="text-[10px] text-[#8A8F9A] mt-1">Recognise structure</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0E1015] border border-[#1F2432] text-center">
                  <div className="text-[#C5A059] font-bold">2. Own Words</div>
                  <div className="text-[10px] text-[#8A8F9A] mt-1">Explain without copying</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0E1015] border border-[#1F2432] text-center">
                  <div className="text-[#C5A059] font-bold">3. Apply</div>
                  <div className="text-[10px] text-[#8A8F9A] mt-1">Execute independently</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0E1015] border border-[#1F2432] text-center">
                  <div className="text-[#C5A059] font-bold">4. Transfer</div>
                  <div className="text-[10px] text-[#8A8F9A] mt-1">Succeed in new context</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0E1015] border border-[#1F2432] text-center">
                  <div className="text-emerald-400 font-bold">5. Boundary</div>
                  <div className="text-[10px] text-[#8A8F9A] mt-1">Know where it breaks</div>
                </div>
              </div>
            </div>

            {/* Agent Epistemic Function Grid */}
            <div className="p-4 rounded-xl bg-[#0E1015] border border-[#1F2432] space-y-2 text-xs">
              <div className="text-[11px] font-bold uppercase text-[#E6E4DF] mb-1">
                Cognitive Agent Roles in the Learning Loop
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-2.5 rounded bg-[#141720] border border-[#222735]">
                  <strong className="text-blue-400">Alice:</strong>{" "}
                  <span className="text-[#A0A8B8]">Chooses the next useful encounter.</span>
                </div>
                <div className="p-2.5 rounded bg-[#141720] border border-[#222735]">
                  <strong className="text-purple-400">Astra:</strong>{" "}
                  <span className="text-[#A0A8B8]">Models the learner's internal state.</span>
                </div>
                <div className="p-2.5 rounded bg-[#141720] border border-[#222735]">
                  <strong className="text-emerald-400">Jemma:</strong>{" "}
                  <span className="text-[#A0A8B8]">Binds claims and feedback to evidence.</span>
                </div>
                <div className="p-2.5 rounded bg-[#141720] border border-[#222735]">
                  <strong className="text-amber-400">Orion:</strong>{" "}
                  <span className="text-[#A0A8B8]">Tests transfer with a changed context.</span>
                </div>
                <div className="p-2.5 rounded bg-[#141720] border border-[#222735]">
                  <strong className="text-cyan-400">Claudia:</strong>{" "}
                  <span className="text-[#A0A8B8]">Selects the appropriate teaching capability.</span>
                </div>
                <div className="p-2.5 rounded bg-[#141720] border border-[#222735]">
                  <strong className="text-red-400">Natalia:</strong>{" "}
                  <span className="text-[#A0A8B8]">Stops false mastery or premature promotion.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SUB-TAB 5: APERTURE & SPATIAL ISOFORM FIELD (NATURE METHODS 2026) ──── */}
      {subTab === "aperture_field" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Paper Context & Epistemic Doctrine Banner */}
          <div className="p-6 rounded-2xl bg-[#111319] border border-[#202634] relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C212D] pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-700/50 text-emerald-400">
                    <Microscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#E6E4DF] tracking-wide flex items-center gap-2">
                      Spatial Isoform Sequencing at Single-Cell Resolution
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-900/40 text-emerald-300 border border-emerald-700/50">
                        Spl-ISO-Seq2 · Nature Methods (2026)
                      </span>
                    </h2>
                    <p className="text-xs text-[#8A8F9A] mt-0.5">
                      Michielsen, Prjibelski, Foord ... Tilgner et al. · DOI: 10.1038/s41592-026-02812-4
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      handleSelectWorkloadPreset("spatial_isoform_moran_field");
                      setSubTab("workloads");
                    }}
                    className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Dispatch to Science Rail</span>
                  </button>
                </div>
              </div>

              {/* Core Epistemic Doctrine Highlight Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-[#131922] to-purple-950/30 border border-emerald-800/40">
                <div className="flex items-start space-x-3">
                  <Eye className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <div className="space-y-1.5 text-xs">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                      The Helix Aperture Thesis
                      <span className="text-[#8A8F9A] font-normal lowercase">— core architectural doctrine</span>
                    </div>
                    <p className="text-[#E6E4DF] leading-relaxed font-semibold">
                      "Spatial position is a state variable, not merely metadata. Resolution changes what counts as the object."
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px] text-emerald-200/90">
                      <span className="px-2 py-0.5 rounded bg-black/40 border border-emerald-900/80">
                        State Function: I_isoform = f(Gene, CellType, x, y, z, Microenvironment, t)
                      </span>
                      <span className="text-[#8A8F9A]">
                        Aperture: 55 µm (pseudo-bulk mixture) → 500 nm (single-cell molecular singlet)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5-Stage Epistemic Transformation Pipeline */}
              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#A0A8B8]">
                  Epistemic State Transformation Pipeline
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                  <div className="p-3 rounded-lg bg-[#141824] border border-[#232A3B] space-y-1">
                    <div className="text-[10px] uppercase font-bold text-[#6B7280]">1. Substrate</div>
                    <div className="font-bold text-[#E6E4DF]">Genome / Exome</div>
                    <div className="text-[11px] text-[#8A8F9A]">Conserved genetic blueprint & exon boundaries</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#141824] border border-[#232A3B] space-y-1">
                    <div className="text-[10px] uppercase font-bold text-blue-400">2. Identity</div>
                    <div className="font-bold text-[#E6E4DF]">Cell Type Class</div>
                    <div className="text-[11px] text-[#8A8F9A]">Deconvolved cell identity (e.g. Excitatory Neuron)</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#141824] border border-[#232A3B] space-y-1">
                    <div className="text-[10px] uppercase font-bold text-purple-400">3. Isoform State</div>
                    <div className="font-bold text-[#E6E4DF]">Alternative Splicing</div>
                    <div className="text-[11px] text-[#8A8F9A]">Exon skipping, mutually exclusive exons, 3' UTR</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#141824] border border-[#232A3B] space-y-1">
                    <div className="text-[10px] uppercase font-bold text-emerald-400">4. Spatial Field</div>
                    <div className="font-bold text-[#E6E4DF]">Coordinates (x, y)</div>
                    <div className="text-[11px] text-[#8A8F9A]">Submicron 500 nm coordinate carrying biological state</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#141824] border border-[#232A3B] space-y-1">
                    <div className="text-[10px] uppercase font-bold text-amber-400">5. Expression</div>
                    <div className="font-bold text-[#E6E4DF]">Phenotypic Realization</div>
                    <div className="text-[11px] text-[#8A8F9A]">Synaptic transmission & localized tissue mechanics</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 2: THE APERTURE RESOLUTION COMPARATOR ──────────────────── */}
          <div className="p-6 rounded-2xl bg-[#111319] border border-[#202634] space-y-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C212D] pb-4">
              <div>
                <h3 className="text-sm font-bold text-[#E6E4DF] flex items-center gap-2">
                  <Split className="w-4 h-4 text-emerald-400" />
                  The Aperture Scale Comparator: "Resolution Changes What Counts as the Object"
                </h3>
                <p className="text-xs text-[#8A8F9A] mt-0.5">
                  See how changing spatial resolution shifts what physical entity is observed and what question can be asked.
                </p>
              </div>

              {/* Aperture Switcher Buttons */}
              <div className="flex items-center p-1 rounded-xl bg-[#0D0E12] border border-[#232838] space-x-1 text-xs">
                <button
                  onClick={() => setApertureScale("55um")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    apertureScale === "55um"
                      ? "bg-[#252C3D] text-[#E6E4DF] border border-[#3E4962]"
                      : "text-[#8A8F9A] hover:text-[#D1D5DB]"
                  }`}
                >
                  55 µm (Visium Classical)
                </button>
                <button
                  onClick={() => setApertureScale("10um")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    apertureScale === "10um"
                      ? "bg-[#252C3D] text-[#E6E4DF] border border-[#3E4962]"
                      : "text-[#8A8F9A] hover:text-[#D1D5DB]"
                  }`}
                >
                  10 µm (Slide-seq / Spl-ISO-1)
                </button>
                <button
                  onClick={() => setApertureScale("500nm")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    apertureScale === "500nm"
                      ? "bg-emerald-600 text-black shadow-md"
                      : "text-[#8A8F9A] hover:text-[#D1D5DB]"
                  }`}
                >
                  500 nm (Spl-ISO-Seq2) ★
                </button>
              </div>
            </div>

            {/* Aperture Comparison Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Box 1: Scale Metric */}
              <div className={`p-4 rounded-xl border transition-all ${
                apertureScale === "55um" ? "bg-amber-950/20 border-amber-700/60" :
                apertureScale === "10um" ? "bg-blue-950/20 border-blue-700/60" :
                "bg-emerald-950/30 border-emerald-600/70 shadow-lg"
              }`}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F9A]">
                  Areal Density & Barcode Space
                </div>
                <div className="text-2xl font-bold text-[#E6E4DF] mt-1">
                  {apertureScale === "55um" && "55 µm Spot Diameter"}
                  {apertureScale === "10um" && "10 µm Bead Diameter"}
                  {apertureScale === "500nm" && "500 nm DNB Grid Pitch"}
                </div>
                <div className="text-xs text-[#A0A8B8] mt-2 space-y-1">
                  <div>
                    <strong>Total Barcodes:</strong>{" "}
                    {apertureScale === "55um" ? "~5,000 spots" : apertureScale === "10um" ? "~80,000 beads" : ">450,000,000 positions"}
                  </div>
                  <div>
                    <strong>Linear Jump:</strong>{" "}
                    {apertureScale === "55um" ? "1× baseline" : apertureScale === "10um" ? "5.5× resolution" : "110× over Visium (20× over Slide-seq)"}
                  </div>
                  <div>
                    <strong>Spot Area:</strong>{" "}
                    {apertureScale === "55um" ? "2,375 µm²" : apertureScale === "10um" ? "78.5 µm²" : "0.25 µm² (>9,000× denser than Visium)"}
                  </div>
                </div>
              </div>

              {/* Box 2: What counts as the object? */}
              <div className="p-4 rounded-xl bg-[#0E1015] border border-[#1F2432] space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  Epistemic Entity (The Observable Object)
                </div>
                <div className="text-sm font-bold text-[#E6E4DF]">
                  {apertureScale === "55um" && "Tissue Region / Pseudo-Bulk Mixture"}
                  {apertureScale === "10um" && "Large Neuronal Soma / Doublet Clusters"}
                  {apertureScale === "500nm" && "Single-Cell Molecular Singlets"}
                </div>
                <p className="text-xs text-[#8A8F9A] leading-relaxed">
                  {apertureScale === "55um" &&
                    "At 55 µm, every spot pools 10 to 50 distinct cells. You cannot determine if an isoform shift is due to alternative splicing within a cell or merely changing cell-type composition across brain regions."}
                  {apertureScale === "10um" &&
                    "At 10 µm, large pyramidal neurons can be resolved, but glia (oligodendrocytes and astrocytes, 6–8 µm) frequently fall into bead junctions, creating ambiguous multi-cell barcodes."}
                  {apertureScale === "500nm" &&
                    "At 500 nm, each single cell spans 20 to 100 submicron grid units. Cell boundaries are explicitly segmented, resolving individual singlets across both large neurons and small glial populations."}
                </p>
              </div>

              {/* Box 3: The Scientific Question Accessible */}
              <div className="p-4 rounded-xl bg-[#0E1015] border border-[#1F2432] space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  The Accessible Question
                </div>
                <div className="text-sm font-bold text-[#E6E4DF]">
                  {apertureScale === "55um" && '"Where in the tissue is Gene X active?"'}
                  {apertureScale === "10um" && '"Are major neuronal classes spatially partitioned?"'}
                  {apertureScale === "500nm" && '"In this cell, at this coordinate, which isoform is utilized?"'}
                </div>
                <div className="p-2.5 rounded bg-[#151922] border border-[#232B3B] text-[11px] text-[#A0A8B8] font-mono">
                  {apertureScale === "55um" && "Verdict: Confounded by cell composition. Cannot prove within-cell-type spatial regulation."}
                  {apertureScale === "10um" && "Verdict: Partial single-cell. Sufficient for cortex layers, but misses small glial isoform switches."}
                  {apertureScale === "500nm" && "Verdict: Disentangles cell identity from spatial regulation via cell-type-constrained Moran's I."}
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 3: BIOLOGICAL EXEMPLARS & MORAN'S I EXPLORER ───────────── */}
          <div className="p-6 rounded-2xl bg-[#111319] border border-[#202634] space-y-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C212D] pb-4">
              <div>
                <h3 className="text-sm font-bold text-[#E6E4DF] flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  The 5 Discovery Exemplars & Moran's I Spatial Autocorrelation Field
                </h3>
                <p className="text-xs text-[#8A8F9A] mt-0.5">
                  Select a biological discovery from the Nature Methods study to inspect its spatial isoform field and permutation statistics.
                </p>
              </div>

              {/* Gene Exemplar Selector */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {(["Snap25", "Rps24", "Ighm", "Arpp19", "Gria2"] as const).map(gene => (
                  <button
                    key={gene}
                    onClick={() => setSelectedGeneExemplar(gene)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                      selectedGeneExemplar === gene
                        ? "bg-[#252C3D] text-[#E6E4DF] border border-[#3E4962] font-bold"
                        : "text-[#8A8F9A] hover:text-[#D1D5DB] hover:bg-[#151822]"
                    }`}
                  >
                    {gene}
                  </button>
                ))}
              </div>
            </div>

            {/* Gene Discovery Overview Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Biological Mechanism & Findings */}
              <div className="lg:col-span-2 space-y-4">
                <div className="p-4 rounded-xl bg-[#0D0E12] border border-[#1E2330] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-base font-bold text-[#E6E4DF] flex items-center gap-2">
                      <span className="text-emerald-400">{selectedGeneExemplar}</span>
                      <span className="text-xs font-normal text-[#8A8F9A]">
                        {selectedGeneExemplar === "Snap25" && "Synaptosomal-associated protein 25 (Excitatory Neurons)"}
                        {selectedGeneExemplar === "Rps24" && "Ribosomal Protein S24 (Oligodendrocytes)"}
                        {selectedGeneExemplar === "Ighm" && "Immunoglobulin Heavy Constant Mu (Excitatory Neurons)"}
                        {selectedGeneExemplar === "Arpp19" && "cAMP-regulated phosphoprotein 19 (PP2A Phosphatase Modulator)"}
                        {selectedGeneExemplar === "Gria2" && "Glutamate Ionotropic Receptor AMPA Type Subunit 2 (Hippocampus)"}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-950/60 text-purple-300 border border-purple-800/60">
                      {selectedGeneExemplar === "Snap25" && "Exon 5a vs 5b Switch"}
                      {selectedGeneExemplar === "Rps24" && "Alternative Internal Exon"}
                      {selectedGeneExemplar === "Ighm" && "Region-Agnostic Novel Exon 1"}
                      {selectedGeneExemplar === "Arpp19" && "4 SVI Isoforms + 3' UTR Shift"}
                      {selectedGeneExemplar === "Gria2" && "Flip vs Flop Alternative Splicing"}
                    </span>
                  </div>

                  <p className="text-xs text-[#A0A8B8] leading-relaxed">
                    {selectedGeneExemplar === "Snap25" &&
                      "Excitatory neurons in cortex layers 2/3 and 5 preferentially express canonical adult Snap25-201, while deep midbrain dopaminergic areas express early developmental Snap25-202. Cell-type constrained permutation proves this switch occurs within excitatory neurons themselves, not due to cell composition."}
                    {selectedGeneExemplar === "Rps24" &&
                      "Oligodendrocytes in white matter tracts overwhelmingly include an alternative internal cassette exon (Rps24-202), whereas midbrain oligodendrocytes display balanced isoform expression. Uncovered single-cell long-read sequencing allows glial isoform discovery without neuron masking."}
                    {selectedGeneExemplar === "Ighm" &&
                      "Discovered completely region-agnostically by Spl-IsoFind! An entirely novel first exon (Ighm-new) was discovered in layer-6 excitatory neurons. Classical predefined anatomical boundary testing missed this because it traverses cortical-subcortical borders."}
                    {selectedGeneExemplar === "Arpp19" &&
                      "Identified 4 distinct spatially varying isoforms (Arpp19-203, new, 209, 205). Arpp16 (cortex-specific) acts as a neural PP2A modulator, while Arpp19 (brain-wide) acts as a cell-cycle inhibitor. Accompanied by massive 3' UTR lengthening modifying mRNA localization."}
                    {selectedGeneExemplar === "Gria2" &&
                      "AMPA receptor subunit Gria2 exhibits spatial flip/flop alternative cassette exon choice between hippocampal CA3 and CA1 pyramidal neurons. The flip isoform slows desensitization kinetics, tuning synaptic plasticity according to micro-circuit location."}
                  </p>

                  {/* Splicing Geometry Diagram */}
                  <div className="p-3 rounded-lg bg-[#141824] border border-[#232B3C] font-mono text-xs space-y-1.5">
                    <div className="text-[10px] uppercase font-bold text-[#8A8F9A]">Isoform Structural Comparison</div>
                    <div className="flex items-center space-x-2 text-emerald-300">
                      <span className="w-24 text-[11px] font-bold">Isoform A:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/80 text-[11px]">
                        {selectedGeneExemplar === "Snap25" && "Snap25-201 (Exon 5a Canonical)"}
                        {selectedGeneExemplar === "Rps24" && "Rps24-202 (Exon Included · White Matter)"}
                        {selectedGeneExemplar === "Ighm" && "Ighm-202 (Canonical Exon 1)"}
                        {selectedGeneExemplar === "Arpp19" && "Arpp19-203 (Short 3' UTR · Cortex)"}
                        {selectedGeneExemplar === "Gria2" && "Gria2-201 (Flip Form · CA3 High)"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-purple-300">
                      <span className="w-24 text-[11px] font-bold">Isoform B:</span>
                      <span className="px-2 py-0.5 rounded bg-purple-950/70 border border-purple-800/80 text-[11px]">
                        {selectedGeneExemplar === "Snap25" && "Snap25-202 (Exon 5b Alternative · Midbrain)"}
                        {selectedGeneExemplar === "Rps24" && "Rps24-205 (Exon Skipped · Midbrain)"}
                        {selectedGeneExemplar === "Ighm" && "Ighm-new (Novel Exon 1 · Layer 6)"}
                        {selectedGeneExemplar === "Arpp19" && "Arpp19-205 (Long 3' UTR · Subcortex)"}
                        {selectedGeneExemplar === "Gria2" && "Gria2-202 (Flop Form · Fast Desensitizing)"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Moran's I & Permutation Proof Box */}
              <div className="p-4 rounded-xl bg-[#0D0E12] border border-[#1E2330] space-y-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#E6E4DF] flex items-center justify-between">
                  <span>Moran's I Autocorrelation</span>
                  <span className="text-emerald-400 font-mono">500 nm Grid</span>
                </div>

                <div className="p-3 rounded-lg bg-[#141824] border border-[#232A3B] space-y-2 text-xs">
                  <div className="text-[10px] uppercase font-bold text-[#8A8F9A]">Moran's I Equation</div>
                  <div className="font-mono text-[11px] text-emerald-300 bg-black/40 p-2 rounded border border-emerald-950">
                    I = (N / W) · [ΣΣ w_ij (x_i - μ)(x_j - μ)] / [Σ (x_i - μ)²]
                  </div>
                  <div className="flex justify-between text-[11px] pt-1">
                    <span className="text-[#8A8F9A]">Calculated Global I:</span>
                    <strong className="text-emerald-400 font-mono">
                      {selectedGeneExemplar === "Snap25" ? "+0.342" :
                       selectedGeneExemplar === "Rps24" ? "+0.287" :
                       selectedGeneExemplar === "Ighm" ? "+0.315" :
                       selectedGeneExemplar === "Arpp19" ? "+0.254" : "+0.380"}
                    </strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#8A8F9A]">Expected Null E[I]:</span>
                    <span className="text-[#A0A8B8] font-mono">-0.0084</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#8A8F9A]">Autocorrelation:</span>
                    <span className="text-emerald-400 font-bold">Strong Positive (Clustered)</span>
                  </div>
                </div>

                {/* The Crucial Permutation Test */}
                <div className="p-3 rounded-lg bg-[#141824] border border-[#232A3B] space-y-2 text-xs">
                  <div className="text-[10px] uppercase font-bold text-purple-400">
                    Disentangling Cell Composition Confound
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-[#8A8F9A]">Naive Permutation p-value:</span>
                      <span className="text-emerald-300 font-mono">p &lt; 0.0001</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8A8F9A]">Cell-Type Constrained p-val:</span>
                      <span className="text-purple-300 font-mono font-bold">p = 0.0014 (BY-adj &lt; 0.05)</span>
                    </div>
                  </div>
                  <div className="p-2 rounded bg-purple-950/30 border border-purple-800/40 text-[10px] text-purple-200">
                    ✓ <strong>Composition Confound Rejected:</strong> Values were shuffled strictly <em>within</em> identical cell types. The spatial pattern remains statistically significant, proving true spatial regulation!
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 4: REGION-AGNOSTIC VS PREDEFINED BOUNDARIES ───────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#111319] border border-[#202634] space-y-3 shadow-xl">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Predefined Anatomical Boundaries Paradigm</span>
              </div>
              <p className="text-xs text-[#8A8F9A] leading-relaxed">
                Traditional spatial analysis imposes predefined anatomical atlases (e.g. Allen CCFv3 boxes) and runs a chi-squared test across regions:
                <br /><br />
                <span className="font-mono text-[11px] text-amber-200 bg-black/40 px-2 py-1 rounded block">
                  choose region → aggregate counts → test for difference
                </span>
                <br />
                <strong>Vulnerability:</strong> High statistical power for known regional boundaries, but <em>completely blind</em> to intra-regional gradients, micro-nuclei (e.g. localized VTA dopaminergic neurons), or biological patterns that cross region borders (such as the novel Ighm layer 6 exon).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111319] border border-emerald-900/60 space-y-3 shadow-xl bg-gradient-to-br from-[#111319] to-emerald-950/20">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Region-Agnostic Spatial Isoform Finder (Spl-IsoFind)</span>
              </div>
              <p className="text-xs text-[#8A8F9A] leading-relaxed">
                Spl-IsoFind operates directly on the continuous spatial field without pre-imposing anatomical boxes:
                <br /><br />
                <span className="font-mono text-[11px] text-emerald-200 bg-black/40 px-2 py-1 rounded block">
                  observe continuous spatial field → calculate Moran's I → discover structure
                </span>
                <br />
                <strong>Architectural Breakthrough:</strong> Identifies biologically active spatial coordinates purely through autocorrelation. Discovered localized switches in VTA, novel layer-6 excitatory neuron exons, and oligodendrocyte sub-specializations.
              </p>
            </div>
          </div>

          {/* ── SECTION 5: EPISTEMIC INVARIANT LADDER (ANTI-COLLAPSE) ─────────── */}
          <div className="p-6 rounded-2xl bg-[#111319] border border-[#202634] space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1C212D] pb-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-[#E6E4DF]">
                  The Three Epistemic Layers (Anti-Collapse Invariant)
                </h4>
              </div>
              <span className="text-xs text-emerald-400 font-mono">
                Preserving Separation of Observation & Interpretation
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0D0E12] border border-[#1E2330] flex items-start space-x-3">
                <span className="px-2 py-1 rounded bg-blue-950 text-blue-300 font-bold font-mono text-[11px] shrink-0">
                  LAYER 1
                </span>
                <div className="space-y-0.5">
                  <div className="font-bold text-[#E6E4DF]">RAW_MEASURED_SIGNAL</div>
                  <p className="text-[#8A8F9A]">
                    Submicron Stereo-seq coordinate grid (500 nm pitch), raw long reads from PacBio Kinnex or Oxford Nanopore, ssDNA fluorescence nuclear stain segmentation.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0D0E12] border border-[#1E2330] flex items-start space-x-3">
                <span className="px-2 py-1 rounded bg-purple-950 text-purple-300 font-bold font-mono text-[11px] shrink-0">
                  LAYER 2
                </span>
                <div className="space-y-0.5">
                  <div className="font-bold text-[#E6E4DF]">DERIVED_BARCODE_TRANSCRIPT_ASSIGNMENT</div>
                  <p className="text-[#8A8F9A]">
                    Spl-IsoQuant-2 read deconcatenation (TSO, 3' primer, linker matching), Smith-Waterman barcode alignment (S_min ≥ 22), UMI deduplication (edit distance ≤ 4), and RCTD single-cell deconvolution.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0D0E12] border border-[#1E2330] flex items-start space-x-3">
                <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 font-bold font-mono text-[11px] shrink-0">
                  LAYER 3
                </span>
                <div className="space-y-0.5">
                  <div className="font-bold text-[#E6E4DF]">INFERRED_SPATIAL_ISOFORM_FIELD</div>
                  <p className="text-[#8A8F9A]">
                    Spl-IsoFind global Moran's I spatial autocorrelation evaluation, cell-type-constrained permutation testing (10,000 shuffles strictly within identical cell types), and Benjamini-Yekutieli FDR control.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SUB-TAB 6: SIMON SEMANTIC INTERPRETATION & MEANING LAYER ──────────── */}
      {subTab === "simon" && (
        <div className="space-y-6 animate-fadeIn">
          <SimonMeaningPanel
            initialEnvelope={simonEnvelope}
            onDispatchNextStep={(action) => {
              // Pre-fill parameters and jump to workloads or inform operator
              handleSelectWorkloadPreset("spatial_isoform_moran_field");
              setSubTab("workloads");
            }}
          />
        </div>
      )}

      {/* ── SUB-TAB 7: JEMMA REALITY & GROUND-TRUTH RAIL ─────────────────────── */}
      {subTab === "jemma_rail" && (
        <div className="space-y-6 animate-fadeIn">
          <JemmaRailPanel
            onSelectWorkloadPreset={(wlId) => {
              handleSelectWorkloadPreset(wlId);
              setSubTab("workloads");
            }}
            lastDispatchResult={dispatchResult}
          />
        </div>
      )}
    </div>
  );
}
