import React, { useState } from "react";
import {
  Shield,
  Cpu,
  Zap,
  Activity,
  Server,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  GitBranch,
  Terminal,
  Database,
  Lock,
  Compass,
  RotateCcw,
  Sliders,
  TrendingUp,
  RefreshCw,
  Clock,
  HardDrive
} from "lucide-react";
import {
  DigitalTwin,
  EvidenceEnvelope,
  EpistemicClass,
  ExecutionDomain,
  ExecutionReceipt,
  EpistemicStoreType
} from "../types";
import { AERIAL_VEHICLE_EVIDENCE_ENVELOPES } from "../data/seedAerialTwin";
import { SYSTEM_CAPABILITY_REGISTRY } from "../data/seedCapabilityRegistry";

interface EvidenceEnvelopeViewProps {
  twin?: DigitalTwin | null;
  onUpdateTwin?: (twin: DigitalTwin) => void;
  onNavigateToTab?: (tab: any) => void;
}

export function EvidenceEnvelopeView({ twin, onUpdateTwin, onNavigateToTab }: EvidenceEnvelopeViewProps) {
  // Use twin envelopes or fallback to aerial envelopes
  const envelopes: EvidenceEnvelope[] = (twin?.evidenceEnvelopes && twin.evidenceEnvelopes.length > 0)
    ? twin.evidenceEnvelopes
    : AERIAL_VEHICLE_EVIDENCE_ENVELOPES;

  const [selectedEnvelopeId, setSelectedEnvelopeId] = useState<string>(envelopes[0]?.id || "env-aerial-01-battery-temp");
  const [filterClass, setFilterClass] = useState<string>("ALL");
  const [filterDomain, setFilterDomain] = useState<string>("ALL");

  // Weave Router 2.0 Interactive Simulation State
  const [taskDifficulty, setTaskDifficulty] = useState<"EASY" | "MEDIUM" | "HARD" | "CRITICAL">("MEDIUM");
  const [selectedTaskType, setSelectedTaskType] = useState<string>("ridge_downdraft");
  const [isSimulatingRoute, setIsSimulatingRoute] = useState<boolean>(false);
  const [routingStage, setRoutingStage] = useState<"IDLE" | "CLASSIFY" | "ROUTE" | "OBSERVE" | "ESCALATE" | "OCTAGON_CHECK" | "RECEIPT_COMMITTED">("IDLE");
  const [routeLog, setRouteLog] = useState<string[]>([
    "Ready. Select a tactical workload and trigger the Weave Router 2.0 loop."
  ]);

  // CUDA-X GPU Fallback Audit State
  const [gpuFallbackSimulated, setGpuFallbackSimulated] = useState<boolean>(false);

  const selectedEnvelope = envelopes.find((e) => e.id === selectedEnvelopeId) || envelopes[0];

  const filteredEnvelopes = envelopes.filter((e) => {
    if (filterClass !== "ALL" && e.epistemicClass !== filterClass) return false;
    if (filterDomain !== "ALL" && e.executionDomain !== filterDomain) return false;
    return true;
  });

  // Weave Router 2.0 Simulation Runner
  const handleRunWeaveRouter = () => {
    setIsSimulatingRoute(true);
    setRoutingStage("CLASSIFY");
    setRouteLog([
      `[T+00ms] TASK INTAKE: ${selectedTaskType.toUpperCase()} (Initial difficulty: ${taskDifficulty})`,
      "[T+15ms] CLASSIFY: Analyzing task payload, latency deadline (300ms), and power budget..."
    ]);

    setTimeout(() => {
      setRoutingStage("ROUTE");
      setRouteLog((prev) => [
        ...prev,
        "[T+45ms] ROUTE (Claudia): Target candidate evaluated: NVIDIA Jetson Orin Nano (Edge)",
        "  -> Observed task success rate: 98.6% | Measured cost: $0.00002/task | Power: 14W",
        "[T+60ms] DISPATCH: Executing initial heuristic inference on local edge rail..."
      ]);

      setTimeout(() => {
        setRoutingStage("OBSERVE");
        if (taskDifficulty === "HARD" || taskDifficulty === "CRITICAL") {
          setRouteLog((prev) => [
            ...prev,
            "[T+110ms] OBSERVE: Edge inference encountered severe turbulence shear & dynamic stall risk.",
            "  -> Escalation trigger matched: taskDifficulty >= HARD. Escalation target = rapids-cudf-sweep (GPU Fabric)",
            "[T+125ms] ESCALATE: Claudia migrating workload from VEHICLE_EDGE to REMOTE_GPU..."
          ]);

          setTimeout(() => {
            setRoutingStage("ESCALATE");
            setRouteLog((prev) => [
              ...prev,
              "[T+170ms] INFRASTRUCTURE EXECUTION: NVIDIA RTX 4090 GPU Node dispatched.",
              "  -> 500,000 cell aerodynamic sweep evaluated in 38.1ms. Navier-Stokes residuals: 1.2e-6.",
              "[T+210ms] OCTAGON_CHECK: Predicate check initiated -> Router != Flight Authority."
            ]);

            setTimeout(() => {
              setRoutingStage("OCTAGON_CHECK");
              setRouteLog((prev) => [
                ...prev,
                "[T+220ms] OCTAGON VERDICT: State trajectory x_t in Omega_safe verified.",
                "  -> Permission GRANTED: Deflection 4.2° East authorized. Reserve endurance +3.2 min.",
                "[T+235ms] AETHER COMMIT: Immutable Execution Receipt signed and committed to append-only ledger."
              ]);
              setRoutingStage("RECEIPT_COMMITTED");
              setIsSimulatingRoute(false);
            }, 600);
          }, 600);
        } else {
          setRouteLog((prev) => [
            ...prev,
            "[T+95ms] OBSERVE: Edge heuristic converged within 0.85ms (nominal latency envelope).",
            "[T+110ms] OCTAGON_CHECK: Claudia proposal verified against Omega_safe.",
            "[T+120ms] RECEIPT COMMITTED: Local edge execution attested and recorded to Aether ledger."
          ]);
          setRoutingStage("RECEIPT_COMMITTED");
          setIsSimulatingRoute(false);
        }
      }, 700);
    }, 600);
  };

  const getEpistemicClassBadge = (eClass: EpistemicClass) => {
    switch (eClass) {
      case "MEASURED":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#112418] text-[#4ADE80] border border-[#1C3E26]">MEASURED (Physical)</span>;
      case "DERIVED":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#111F2D] text-[#60A5FA] border border-[#1E3A5F]">DERIVED (Exact Physics)</span>;
      case "SIMULATED":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#26152F] text-[#C084FC] border border-[#48235E]">SIMULATED (PDE / CFD)</span>;
      case "INFERRED":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#261F13] text-[#FBBF24] border border-[#4A3B18]">INFERRED (Cognitive AI)</span>;
    }
  };

  const getDomainBadge = (domain: ExecutionDomain) => {
    switch (domain) {
      case "VEHICLE_EDGE":
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#1E293B] text-[#38BDF8] border border-[#334155]">VEHICLE_EDGE (&lt;15W)</span>;
      case "LOCAL":
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#1C1F26] text-[#E6E4DF] border border-[#2E3440]">LOCAL (45W)</span>;
      case "LAN_NODE":
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#1B2721] text-[#34D399] border border-[#264436]">LAN_NODE</span>;
      case "REMOTE_GPU":
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#281524] text-[#F472B6] border border-[#4C2442]">REMOTE_GPU (350W)</span>;
      case "CLOUD":
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#231E15] text-[#F59E0B] border border-[#48371C]">CLOUD (250W)</span>;
    }
  };

  const getStoreBadge = (store: EpistemicStoreType) => {
    switch (store) {
      case "AETHER_EVIDENCE":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#111A16] text-[#4ADE80] border border-[#1C3527]">Aether Evidence (Append-Only)</span>;
      case "ASTRA_STATE":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0F1E2E] text-[#60A5FA] border border-[#1B3550]">Astra State (Durable LSTC)</span>;
      case "CLAUDIA_PROPOSAL":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#241B0E] text-[#FBBF24] border border-[#443012]">Claudia (Advisory Proposal)</span>;
      case "OCTAGON_PERMISSION":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#261111] text-[#F87171] border border-[#451B1B]">Octagon Sovereign Gate</span>;
      case "OPERATOR_ACTION":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1A1426] text-[#C084FC] border border-[#34244D]">Operator Action</span>;
    }
  };

  return (
    <div className="space-y-8 text-[#E6E4DF] pb-16">
      {/* Header Banner */}
      <div className="bg-[#14171F] border border-[#22252D] rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30 rounded text-[11px] font-bold tracking-wide uppercase">
                Pathfinder Architecture
              </span>
              <span className="text-xs text-[#8A8F9A]">18 September 2026 Research Brief</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#FAF9F5]">
              Extended Evidence Envelope & Heterogeneous Fabric
            </h1>
            <p className="text-xs text-[#8A8F9A] max-w-3xl leading-relaxed">
              Enforcing orthogonal lineage separation: <span className="text-[#FAF9F5] font-semibold">Epistemic Class</span> × <span className="text-[#FAF9F5] font-semibold">Execution Domain</span> × <span className="text-[#FAF9F5] font-semibold">Execution Receipt</span>. 
              Eliminating epistemic impersonation across onboard Jetson telemetry, local deterministic physics, GPU multi-physics simulation, and cognitive advisory routing.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-[#0D0E11] p-3 rounded-lg border border-[#22252D] text-xs">
            <div className="space-y-0.5">
              <div className="text-[10px] uppercase tracking-wider text-[#8A8F9A]">Active Vehicle Substrate</div>
              <div className="font-semibold text-[#FAF9F5]">{twin?.name || "AERIAL-VEHICLE-01"}</div>
            </div>
            <div className="h-7 w-[1px] bg-[#22252D]" />
            <div className="space-y-0.5">
              <div className="text-[10px] uppercase tracking-wider text-[#8A8F9A]">Constitutional Invariant</div>
              <div className="font-mono text-[11px] text-[#4ADE80]">Router ≠ Authority</div>
            </div>
          </div>
        </div>

        {/* 3 Orthogonal Axioms Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#1F232E] text-xs">
          <div className="p-3 bg-[#0D0E11] rounded border border-[#1F232E] space-y-1.5">
            <div className="flex items-center space-x-1.5 text-[#C5A059] font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>1. Epistemic Class (Truth Modality)</span>
            </div>
            <p className="text-[#8A8F9A] text-[11px] leading-relaxed">
              <strong className="text-[#FAF9F5]">MEASURED</strong> (sensors) ≠ <strong className="text-[#FAF9F5]">DERIVED</strong> (exact physics) ≠ <strong className="text-[#FAF9F5]">SIMULATED</strong> (CFD/PDE) ≠ <strong className="text-[#FAF9F5]">INFERRED</strong> (AI model). No layer may impersonate another.
            </p>
          </div>

          <div className="p-3 bg-[#0D0E11] rounded border border-[#1F232E] space-y-1.5">
            <div className="flex items-center space-x-1.5 text-[#38BDF8] font-semibold">
              <Server className="w-3.5 h-3.5" />
              <span>2. Execution Domain (Physical Locus)</span>
            </div>
            <p className="text-[#8A8F9A] text-[11px] leading-relaxed">
              <strong className="text-[#FAF9F5]">VEHICLE_EDGE</strong> (Jetson 15W) → <strong className="text-[#FAF9F5]">LOCAL</strong> (Workstation 45W) → <strong className="text-[#FAF9F5]">REMOTE_GPU</strong> (Cluster 350W) → <strong className="text-[#FAF9F5]">CLOUD</strong>. Explicit hardware bounds.
            </p>
          </div>

          <div className="p-3 bg-[#0D0E11] rounded border border-[#1F232E] space-y-1.5">
            <div className="flex items-center space-x-1.5 text-[#4ADE80] font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>3. Execution Receipt & Fallback Audit</span>
            </div>
            <p className="text-[#8A8F9A] text-[11px] leading-relaxed">
              Artifact + hardware + runtime + inputs + output + latency + power + provenance. The label "GPU pipeline" is <strong className="text-[#FAF9F5]">never accepted without hardware receipt proof</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: 4-Stream Lineage Engine (7 cols) */}
        <div className="xl:col-span-7 space-y-6">
          <div className="bg-[#14171F] border border-[#22252D] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#22252D]">
              <div>
                <h2 className="text-base font-bold text-[#FAF9F5] flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-[#C5A059]" />
                  <span>AERIAL-VEHICLE-01 Lineage Separation</span>
                </h2>
                <p className="text-xs text-[#8A8F9A]">
                  Four simultaneous streams preserving lineage without impersonation.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-2 text-xs">
                <select
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  className="bg-[#0D0E11] border border-[#22252D] text-[#E6E4DF] px-2 py-1 rounded text-xs focus:outline-none"
                >
                  <option value="ALL">Class: All</option>
                  <option value="MEASURED">MEASURED</option>
                  <option value="DERIVED">DERIVED</option>
                  <option value="SIMULATED">SIMULATED</option>
                  <option value="INFERRED">INFERRED</option>
                </select>

                <select
                  value={filterDomain}
                  onChange={(e) => setFilterDomain(e.target.value)}
                  className="bg-[#0D0E11] border border-[#22252D] text-[#E6E4DF] px-2 py-1 rounded text-xs focus:outline-none"
                >
                  <option value="ALL">Domain: All</option>
                  <option value="VEHICLE_EDGE">VEHICLE_EDGE</option>
                  <option value="LOCAL">LOCAL</option>
                  <option value="REMOTE_GPU">REMOTE_GPU</option>
                  <option value="CLOUD">CLOUD</option>
                </select>
              </div>
            </div>

            {/* Stream Selector Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredEnvelopes.map((env, idx) => {
                const isSelected = env.id === selectedEnvelopeId;
                return (
                  <div
                    key={env.id}
                    onClick={() => setSelectedEnvelopeId(env.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#1A1E29] border-[#C5A059] shadow-sm ring-1 ring-[#C5A059]/40"
                        : "bg-[#0D0E11] border-[#22252D] hover:border-[#333846]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-[#8A8F9A]">STREAM 0{idx + 1}</span>
                      {getEpistemicClassBadge(env.epistemicClass)}
                    </div>

                    <div className="font-semibold text-sm text-[#FAF9F5] mb-1 font-mono">
                      {env.variableName}
                    </div>

                    <div className="flex items-baseline space-x-2 my-1.5">
                      <span className="text-xl font-bold font-mono text-[#FAF9F5]">
                        {typeof env.value === "number" ? env.value.toLocaleString() : "Advisory"}
                      </span>
                      <span className="text-xs text-[#8A8F9A] font-mono">{env.units}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 mt-2 border-t border-[#1C1F26]">
                      {getDomainBadge(env.executionDomain)}
                      <span className="text-[#8A8F9A] font-mono">
                        {env.executionReceipt.latency.elapsedMs}ms · {env.executionReceipt.hardware.powerEnvelopeWatts}W
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Execution Receipt Inspector for Selected Stream */}
            {selectedEnvelope && (
              <div className="mt-4 p-5 bg-[#0D0E11] rounded-xl border border-[#22252D] space-y-4">
                <div className="flex items-center justify-between border-b border-[#1C1F26] pb-3">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-[#C5A059]" />
                    <span className="font-semibold text-sm text-[#FAF9F5]">
                      Execution Receipt & Attested Provenance
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#8A8F9A]">
                    {selectedEnvelope.executionReceipt.receiptId}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 bg-[#14171F] rounded border border-[#1C1F26] space-y-1">
                    <div className="text-[10px] uppercase text-[#8A8F9A]">Hardware Device</div>
                    <div className="font-medium text-[#FAF9F5] truncate">
                      {selectedEnvelope.executionReceipt.hardware.device}
                    </div>
                    <div className="text-[10px] text-[#8A8F9A]">
                      {selectedEnvelope.executionReceipt.hardware.architecture || "Standard Node"}
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#14171F] rounded border border-[#1C1F26] space-y-1">
                    <div className="text-[10px] uppercase text-[#8A8F9A]">Runtime Engine</div>
                    <div className="font-medium text-[#FAF9F5] truncate">
                      {selectedEnvelope.executionReceipt.runtime.engine}
                    </div>
                    <div className="text-[10px] text-[#8A8F9A]">
                      {selectedEnvelope.executionReceipt.runtime.version}
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#14171F] rounded border border-[#1C1F26] space-y-1">
                    <div className="text-[10px] uppercase text-[#8A8F9A]">Latency & Compute</div>
                    <div className="font-medium text-[#4ADE80] font-mono">
                      {selectedEnvelope.executionReceipt.latency.elapsedMs} ms total
                    </div>
                    <div className="text-[10px] text-[#8A8F9A]">
                      Compute: {selectedEnvelope.executionReceipt.latency.computeMs}ms | Xfer: {selectedEnvelope.executionReceipt.latency.transferMs || 0}ms
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#14171F] rounded border border-[#1C1F26] space-y-1">
                    <div className="text-[10px] uppercase text-[#8A8F9A]">Power Envelope</div>
                    <div className="font-medium text-[#F59E0B] font-mono">
                      {selectedEnvelope.executionReceipt.hardware.powerEnvelopeWatts} W budget
                    </div>
                    <div className="text-[10px] text-[#8A8F9A]">
                      Avg: {selectedEnvelope.executionReceipt.power.averageWatts}W ({selectedEnvelope.executionReceipt.power.measuredJoules || 0} J)
                    </div>
                  </div>
                </div>

                {/* NemoClaw Store & Mutation Rule Information */}
                <div className="p-3 bg-[#14171F] rounded-lg border border-[#1C1F26] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase tracking-wider text-[#8A8F9A]">
                      NemoClaw Epistemic Store & Mutation Constraint
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStoreBadge(selectedEnvelope.epistemicStore)}
                      <span className="text-[11px] font-mono text-[#8A8F9A]">
                        Rule: <strong className="text-[#FAF9F5]">{selectedEnvelope.mutationRule}</strong>
                      </span>
                    </div>
                  </div>

                  {selectedEnvelope.longTermMissionStateBound && (
                    <div className="flex items-center space-x-1.5 text-[#60A5FA] bg-[#0F1E2E] px-2.5 py-1 rounded border border-[#1B3550] text-[11px]">
                      <Lock className="w-3 h-3" />
                      <span>LocalLSTC: Durable Astra Mission State</span>
                    </div>
                  )}
                </div>

                {/* Raw Artifact & Verification Hash */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="text-[10px] uppercase tracking-wider text-[#8A8F9A]">Artifact Manifest & Cryptographic Signature</div>
                  <div className="p-2.5 bg-[#08090C] rounded border border-[#1C1F26] text-[#8A8F9A] space-y-1 overflow-x-auto">
                    <div>Summary: <span className="text-[#FAF9F5]">{selectedEnvelope.executionReceipt.artifact.rawSummary}</span></div>
                    <div>Content Hash: <span className="text-[#4ADE80]">{selectedEnvelope.executionReceipt.artifact.contentHash}</span></div>
                    <div>Signature: <span className="text-[#38BDF8]">{selectedEnvelope.executionReceipt.provenance.immutableSignature}</span></div>
                    <div>Attestation: <span className="text-[#E6E4DF]">{selectedEnvelope.executionReceipt.provenance.operatorAttestation || "System Verified"}</span></div>
                  </div>
                </div>

                {/* CUDA-X / cuDF Fallback Audit Panel (if applicable) */}
                {selectedEnvelope.executionReceipt.cudaXFallbackAudit && (
                  <div className="p-3.5 bg-[#171321] rounded-lg border border-[#39284D] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-[#C084FC] font-semibold">
                        <Cpu className="w-4 h-4" />
                        <span>CUDA-X / cuDF Dataframe Verification Receipt</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        gpuFallbackSimulated
                          ? "bg-[#381B1B] text-[#F87171] border border-[#5C2A2A]"
                          : "bg-[#112418] text-[#4ADE80] border border-[#1C3E26]"
                      }`}>
                        {gpuFallbackSimulated ? "ACTUAL: CPU_FALLBACK" : "ACTUAL: GPU"}
                      </span>
                    </div>

                    <p className="text-[#8A8F9A] text-[11px]">
                      "The label 'GPU pipeline' is not evidence that a particular operation actually ran on the GPU."
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                      <div className="p-2 bg-[#0D0E11] rounded border border-[#2B1F3D]">
                        <span className="text-[#8A8F9A] block text-[9px]">REQUESTED</span>
                        <span className="text-[#FAF9F5]">{selectedEnvelope.executionReceipt.cudaXFallbackAudit.requestedCapability}</span>
                      </div>
                      <div className="p-2 bg-[#0D0E11] rounded border border-[#2B1F3D]">
                        <span className="text-[#8A8F9A] block text-[9px]">BACKEND</span>
                        <span className="text-[#FAF9F5]">{selectedEnvelope.executionReceipt.cudaXFallbackAudit.selectedBackend}</span>
                      </div>
                      <div className="p-2 bg-[#0D0E11] rounded border border-[#2B1F3D]">
                        <span className="text-[#8A8F9A] block text-[9px]">THROUGHPUT</span>
                        <span className="text-[#4ADE80]">{(selectedEnvelope.executionReceipt.cudaXFallbackAudit.bytesProcessed! / (1024 * 1024)).toFixed(1)} MB</span>
                      </div>
                      <div className="p-2 bg-[#0D0E11] rounded border border-[#2B1F3D]">
                        <span className="text-[#8A8F9A] block text-[9px]">EXECUTION TIME</span>
                        <span className={gpuFallbackSimulated ? "text-[#F87171]" : "text-[#4ADE80]"}>
                          {gpuFallbackSimulated ? "142.4 ms (CPU)" : "42.6 ms (GPU)"}
                        </span>
                      </div>
                    </div>

                    {gpuFallbackSimulated && (
                      <div className="p-2 bg-[#2D1616] rounded border border-[#5C2A2A] text-[11px] text-[#FCA5A5] font-mono">
                        Fallback Audit Alert: VRAM spillover prevented by cuDF runtime. Fallback reason: "GPU memory allocation threshold exceeded; computation completed deterministically on host CPU Arrow memory."
                      </div>
                    )}

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => setGpuFallbackSimulated(!gpuFallbackSimulated)}
                        className="px-2.5 py-1 bg-[#261E33] hover:bg-[#342947] text-[#C084FC] rounded text-[11px] font-semibold transition-colors cursor-pointer border border-[#483461]"
                      >
                        {gpuFallbackSimulated ? "Reset to Native GPU Execution" : "Simulate GPU VRAM Contention / Fallback"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Weave Router 2.0 & NemoClaw Stores (5 cols) */}
        <div className="xl:col-span-5 space-y-6">
          {/* Weave Router 2.0 Dynamic Routing Console */}
          <div className="bg-[#14171F] border border-[#22252D] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#22252D]">
              <div>
                <h2 className="text-base font-bold text-[#FAF9F5] flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-[#38BDF8]" />
                  <span>Weave Router 2.0 Empirical Engine</span>
                </h2>
                <p className="text-xs text-[#8A8F9A]">
                  Classify → Route → Observe → Escalate/Recover
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1E293B] text-[#38BDF8] border border-[#334155]">
                ROUTER ≠ AUTHORITY
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase text-[#8A8F9A] block mb-1">Tactical Workload</label>
                  <select
                    value={selectedTaskType}
                    onChange={(e) => setSelectedTaskType(e.target.value)}
                    disabled={isSimulatingRoute}
                    className="w-full bg-[#0D0E11] border border-[#22252D] text-[#E6E4DF] px-2.5 py-1.5 rounded focus:outline-none"
                  >
                    <option value="ridge_downdraft">Ridge Downdraft Dynamic Re-route</option>
                    <option value="thermal_recovery">LiPo Low-SOC Thermal Recovery</option>
                    <option value="cfd_shear_sweep">500k-Cell Crosswind Shear CFD</option>
                    <option value="glide_scram">Octagon Emergency Glide Scram</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-[#8A8F9A] block mb-1">Task Difficulty</label>
                  <select
                    value={taskDifficulty}
                    onChange={(e) => setTaskDifficulty(e.target.value as any)}
                    disabled={isSimulatingRoute}
                    className="w-full bg-[#0D0E11] border border-[#22252D] text-[#E6E4DF] px-2.5 py-1.5 rounded focus:outline-none"
                  >
                    <option value="EASY">EASY (Edge Heuristic)</option>
                    <option value="MEDIUM">MEDIUM (Standard Escalation)</option>
                    <option value="HARD">HARD (Forces GPU Fabric Escalation)</option>
                    <option value="CRITICAL">CRITICAL (Octagon Intervention)</option>
                  </select>
                </div>
              </div>

              {/* Empirical Model Comparison Table */}
              <div className="p-3 bg-[#0D0E11] rounded-lg border border-[#22252D] space-y-2">
                <div className="text-[10px] uppercase tracking-wider text-[#8A8F9A] font-mono">
                  Candidate Rails (Empirical Weave Metrics)
                </div>
                <div className="space-y-1.5">
                  {SYSTEM_CAPABILITY_REGISTRY.slice(0, 4).map((model) => (
                    <div key={model.id} className="flex items-center justify-between text-[11px] p-1.5 bg-[#14171F] rounded border border-[#1C1F26]">
                      <div className="truncate max-w-[140px]">
                        <span className="font-semibold text-[#FAF9F5]">{model.name.split(" ")[0]}</span>
                        <span className="text-[9px] text-[#8A8F9A] block">{model.provider}</span>
                      </div>
                      <div className="font-mono text-right text-[10px] text-[#8A8F9A]">
                        <span className="text-[#4ADE80] font-semibold">{model.observed_task_success || 95}% success</span>
                        <span className="block">{model.latencyMs.avgMs}ms · ${model.measured_cost_per_completed_task || 0.0001}/task</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Execution Simulator Log */}
              <div className="p-3 bg-[#08090C] rounded-lg border border-[#1C1F26] font-mono text-[11px] space-y-1 min-h-[140px] max-h-[180px] overflow-y-auto">
                <div className="flex items-center justify-between text-[9px] text-[#8A8F9A] pb-1 border-b border-[#1C1F26] mb-1">
                  <span>AETHER ROUTING TELEMETRY STREAM</span>
                  <span className="text-[#38BDF8]">STAGE: {routingStage}</span>
                </div>
                {routeLog.map((log, i) => (
                  <div key={i} className="text-[#8A8F9A] leading-relaxed">
                    {log.startsWith("  ->") ? (
                      <span className="text-[#4ADE80]">{log}</span>
                    ) : log.includes("OCTAGON") || log.includes("VERDICT") ? (
                      <span className="text-[#FBBF24] font-semibold">{log}</span>
                    ) : log.includes("ESCALATE") ? (
                      <span className="text-[#C084FC]">{log}</span>
                    ) : (
                      <span className="text-[#E6E4DF]">{log}</span>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleRunWeaveRouter}
                disabled={isSimulatingRoute}
                className="w-full py-2.5 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0D0E11] rounded text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSimulatingRoute ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Weave Dynamic Routing Loop...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Execute Classify → Route → Observe → Escalate Loop</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* NemoClaw Store Architecture Card */}
          <div className="bg-[#14171F] border border-[#22252D] rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-[#22252D]">
              <Database className="w-4 h-4 text-[#4ADE80]" />
              <h3 className="text-sm font-bold text-[#FAF9F5]">
                NemoClaw Memory Architecture (Distinct Stores)
              </h3>
            </div>

            <p className="text-xs text-[#8A8F9A] leading-relaxed">
              "Different epistemic objects deserve different stores and mutation rules. Resist turning Aether into a generic vector-memory bucket."
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-[#0D0E11] rounded border border-[#1C1F26] space-y-1">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#4ADE80] font-semibold">Aether Store</span>
                  <span className="text-[10px] text-[#8A8F9A]">APPEND_ONLY_AUDIT</span>
                </div>
                <p className="text-[11px] text-[#8A8F9A]">
                  Immutable telemetry history & cryptographic execution receipts. Never mutated, never overwritten.
                </p>
              </div>

              <div className="p-2.5 bg-[#0D0E11] rounded border border-[#1C1F26] space-y-1">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#60A5FA] font-semibold">Astra State Store (LocalLSTC)</span>
                  <span className="text-[10px] text-[#8A8F9A]">DURABLE_TRANSACTION</span>
                </div>
                <p className="text-[11px] text-[#8A8F9A]">
                  Durable vehicle state and mission progress. Preserved across cycles, not re-invented every turn from LLM context.
                </p>
              </div>

              <div className="p-2.5 bg-[#0D0E11] rounded border border-[#1C1F26] space-y-1">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#FBBF24] font-semibold">Claudia Proposal Store</span>
                  <span className="text-[10px] text-[#8A8F9A]">EPHEMERAL_PROPOSAL</span>
                </div>
                <p className="text-[11px] text-[#8A8F9A]">
                  Exploratory candidate actions and routing suggestions. Carries zero physical actuation authority until Octagon gate.
                </p>
              </div>

              <div className="p-2.5 bg-[#0D0E11] rounded border border-[#1C1F26] space-y-1">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#F87171] font-semibold">Octagon Permission Gate</span>
                  <span className="text-[10px] text-[#8A8F9A]">SOVEREIGN_GATE</span>
                </div>
                <p className="text-[11px] text-[#8A8F9A]">
                  Validates state bounds <span className="font-mono text-[#FAF9F5]">x_t ∈ Ω_safe</span>. Deterministic stop if out of bounds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
