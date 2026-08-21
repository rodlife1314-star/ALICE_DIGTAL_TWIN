import React, { useState } from "react";
import {
  Cpu,
  Shield,
  Zap,
  Activity,
  Server,
  HardDrive,
  CheckCircle2,
  XCircle,
  Sliders,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  Info,
  Check,
  Globe,
  Lock,
  AlertTriangle,
  Terminal,
  ShieldCheck,
  ShieldAlert,
  HelpCircle
} from "lucide-react";
import {
  DigitalTwin,
  ModelCapability,
  TaskModelSelectionRequest,
  ModelSelectionResult,
  DigitalTwinDomain,
  InferenceRail,
  RailTrustState
} from "../types";
import { SYSTEM_CAPABILITY_REGISTRY, SYSTEM_INFERENCE_RAILS, selectBestFitModel } from "../data/seedCapabilityRegistry";

interface CapabilityRegistryViewProps {
  twin: DigitalTwin;
  onUpdateTwin: (updatedTwin: DigitalTwin) => void;
}

export function CapabilityRegistryView({ twin, onUpdateTwin }: CapabilityRegistryViewProps) {
  const registry = twin.capabilityRegistry && twin.capabilityRegistry.length > 0
    ? twin.capabilityRegistry
    : SYSTEM_CAPABILITY_REGISTRY;

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Interactive Task Selection Simulator State
  const [taskType, setTaskType] = useState<TaskModelSelectionRequest["taskType"]>("simulation");
  const [taskDomain, setTaskDomain] = useState<DigitalTwinDomain>(twin.domain || "physical");
  const [maxLatency, setMaxLatency] = useState<number>(300);
  const [minTrustScore, setMinTrustScore] = useState<number>(90);
  const [maxVram, setMaxVram] = useState<number>(12);
  const [requireOffline, setRequireOffline] = useState<boolean>(false);
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([
    "physical_simulation",
    "fast_reasoning"
  ]);

  const taskRequest: TaskModelSelectionRequest = {
    taskType,
    twinDomain: taskDomain,
    maxAllowedLatencyMs: maxLatency,
    minTrustScore,
    maxVramGB: maxVram,
    requireOffline,
    requiredCapabilities: selectedCapabilities
  };

  const selectionResult: ModelSelectionResult = selectBestFitModel(registry, taskRequest);
  const bestModel = selectionResult.selectedModel;

  const handleAssignActiveModel = (model: ModelCapability) => {
    if (model.trustState === "REVOKED") return;
    const updated: DigitalTwin = {
      ...twin,
      selectedModelId: model.id,
      selectedModelCapability: model,
      updatedAt: new Date().toISOString()
    };
    onUpdateTwin(updated);
  };

  const toggleCapabilityTag = (cap: string) => {
    if (selectedCapabilities.includes(cap)) {
      setSelectedCapabilities(selectedCapabilities.filter(c => c !== cap));
    } else {
      setSelectedCapabilities([...selectedCapabilities, cap]);
    }
  };

  const filteredModels = registry.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.id.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedCategory === "all") return matchesSearch;
    if (selectedCategory === "approved") return matchesSearch && (model.trustState === "APPROVED" || !model.trustState);
    if (selectedCategory === "experimental") return matchesSearch && model.trustState === "EXPERIMENTAL";
    if (selectedCategory === "cloud") return matchesSearch && model.hardwareRequirements.targetDevice === "Cloud";
    if (selectedCategory === "offline") return matchesSearch && model.hardwareRequirements.offlineSupport;
    if (selectedCategory === "deterministic") return matchesSearch && model.capabilities.includes("deterministic");
    if (selectedCategory === "revoked") return matchesSearch && model.trustState === "REVOKED";
    return matchesSearch;
  });

  const getTrustBadge = (state?: RailTrustState) => {
    switch (state) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#14291E] border border-[#2D5A3D] text-[#4ADE80]">
            <ShieldCheck className="w-3 h-3" />
            <span>APPROVED</span>
          </span>
        );
      case "EXPERIMENTAL":
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#261F38] border border-[#4F3F73] text-[#C084FC]">
            <Sparkles className="w-3 h-3 text-[#A855F7]" />
            <span>EXPERIMENTAL</span>
          </span>
        );
      case "REVOKED":
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#331518] border border-[#662028] text-[#F87171]">
            <ShieldAlert className="w-3 h-3" />
            <span>REVOKED</span>
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2E2412] border border-[#59441B] text-[#FCD34D]">
            <AlertTriangle className="w-3 h-3" />
            <span>SUSPENDED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1C1F26] border border-[#282C37] text-[#9CA3AF]">
            <span>UNVERIFIED</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 space-y-8 text-[#E6E4DF]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#22252D] pb-5 gap-4">
        <div>
          <div className="text-xs uppercase font-mono tracking-widest text-[#3B82F6] mb-1 font-semibold flex items-center space-x-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>PATHFINDER COMPUTE RAIL REGISTRY & TRUST BOUNDARY</span>
          </div>
          <h1 className="text-2xl font-light text-[#E6E4DF] tracking-tight">
            Sovereign Compute Topology & Inference Contract
          </h1>
          <p className="text-xs text-[#8A8F9A] mt-1 max-w-3xl">
            Formalizes the Pathfinder trust topology: <strong>Gemini Cognition/Framing</strong> (Approved), <strong>NVIDIA Accelerated Compute</strong> (Approved), <strong>Provider-Agnostic Open-Source Inference</strong> (Experimental), and <strong>FPT AI Factory</strong> (Revoked).
          </p>
        </div>

        {twin.selectedModelCapability && (
          <div className="bg-[#13151A] border border-[#3B82F6]/30 px-4 py-2 rounded flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
            <div>
              <div className="text-[10px] uppercase font-mono text-[#8A8F9A]">Active Assigned Model</div>
              <div className="text-xs font-semibold text-[#E6E4DF] flex items-center space-x-2">
                <span>{twin.selectedModelCapability.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1E2330] text-[#3B82F6]">
                  {twin.selectedModelCapability.trustScore}% Trust
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sovereign Invariant Banner */}
      <div className="bg-[#141824] border-l-4 border-[#3B82F6] p-4 rounded-r flex items-start space-x-3 text-xs font-mono">
        <ShieldCheck className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-[#93C5FD] uppercase tracking-wider block">
            SOVEREIGN COMPUTE LAW: ACCELERATION ≠ AUTHORITY
          </span>
          <p className="text-[#A3ADC2] leading-relaxed">
            Hypothesis → Workload Spec → Compute Rail → Raw Result → Jemma Validation → Orion Challenge → Operator Authority → Ledger Admission.
            No model, accelerator, or API provider may promote its own output to validated twin truth.
          </p>
        </div>
      </div>

      {/* Common Inference Rails Architecture Grid */}
      <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#22262F] pb-4 gap-2">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-[#3B82F6]" />
            <h2 className="text-sm font-semibold uppercase font-mono tracking-wider text-[#E6E4DF]">
              Common Inference Rails (InferenceRail Specification)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#8A8F9A]">
            Provider adapters decoupled below Pathfinder cognition boundary
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SYSTEM_INFERENCE_RAILS.map((rail) => {
            const isRevoked = rail.trust_state === "REVOKED";
            return (
              <div
                key={rail.rail_id}
                className={`p-4 rounded border font-mono text-xs space-y-3 flex flex-col justify-between ${
                  isRevoked
                    ? "bg-[#181112] border-[#4A1D24] opacity-80"
                    : rail.trust_state === "APPROVED"
                    ? "bg-[#161B26] border-[#2B354D]"
                    : "bg-[#1A1626] border-[#3F3359]"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#8A8F9A] uppercase tracking-wider">{rail.rail_id}</span>
                    {getTrustBadge(rail.trust_state)}
                  </div>

                  <div>
                    <h3 className="font-bold text-[#E6E4DF] text-sm">{rail.provider}</h3>
                    <span className="text-[11px] text-[#38BDF8]">{rail.model_id}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] py-2 border-y border-[#22283A]">
                    <div>
                      <span className="text-[#8A8F9A] block">RUNTIME</span>
                      <span className="text-[#E6E4DF]">{rail.runtime}</span>
                    </div>
                    <div>
                      <span className="text-[#8A8F9A] block">DEPLOY MODE</span>
                      <span className="text-[#E6E4DF]">{rail.deployment_mode}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-[#8A8F9A]">
                    <span className="text-[#737885] block">EXECUTION LOCATION</span>
                    <span className="text-[#A3ADC2]">{rail.execution_location}</span>
                  </div>

                  <p className="text-[11px] text-[#A0A8BC] leading-snug italic pt-1">
                    "{rail.trustRationale}"
                  </p>
                </div>

                <div className="pt-2 border-t border-[#22283A] flex items-center justify-between text-[10px]">
                  <span className="text-[#8A8F9A]">Credential: <strong className={rail.credential_state === "REVOKED" ? "text-[#EF4444]" : "text-[#4ADE80]"}>{rail.credential_state}</strong></span>
                  <span className="text-[#8A8F9A]">Health: <strong className={rail.health_state === "REVOKED" ? "text-[#EF4444]" : "text-[#4ADE80]"}>{rail.health_state}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Best-Fit Selection Engine Simulator */}
      <div className="bg-[#13151A] border border-[#22262F] rounded p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#22262F] pb-4 gap-2">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#3B82F6]" />
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#E6E4DF]">
              Best-Fit Model Selection Router Engine
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#8A8F9A]">
            Evaluates candidate models against hardware, latency & trust constraints
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 space-y-5 border-r lg:border-[#22262F] lg:pr-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-[#8A8F9A] uppercase mb-1">
                  Task Classification
                </label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value as any)}
                  className="w-full bg-[#181A20] border border-[#2A2E39] text-xs text-[#E6E4DF] rounded px-3 py-2 focus:outline-none focus:border-[#3B82F6]"
                >
                  <option value="simulation">Physical Scenario Simulation</option>
                  <option value="evidence_verification">Evidence & Observation Verification</option>
                  <option value="realtime_telemetry">Realtime Sensor Telemetry Processing</option>
                  <option value="boundary_check">Boundary Permeability Enforcement</option>
                  <option value="interpretation">Hypothesis & Claims Reasoning</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#8A8F9A] uppercase mb-1">
                  Target Twin Domain
                </label>
                <select
                  value={taskDomain}
                  onChange={(e) => setTaskDomain(e.target.value as any)}
                  className="w-full bg-[#181A20] border border-[#2A2E39] text-xs text-[#E6E4DF] rounded px-3 py-2 focus:outline-none focus:border-[#3B82F6]"
                >
                  <option value="physical">Physical Domain</option>
                  <option value="biological">Biological Domain</option>
                  <option value="engineered">Engineered Domain</option>
                  <option value="environmental">Environmental Domain</option>
                  <option value="conceptual">Conceptual Domain</option>
                  <option value="musical">Musical Domain</option>
                  <option value="hybrid">Hybrid Domain</option>
                </select>
              </div>
            </div>

            {/* Hardware & Latency Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#181A20] p-4 rounded border border-[#22262F]">
              <div>
                <div className="flex justify-between items-center text-[11px] font-mono mb-1">
                  <span className="text-[#8A8F9A]">MAX LATENCY</span>
                  <span className="text-[#3B82F6] font-bold">{maxLatency} ms</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={maxLatency}
                  onChange={(e) => setMaxLatency(Number(e.target.value))}
                  className="w-full accent-[#3B82F6] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-[11px] font-mono mb-1">
                  <span className="text-[#8A8F9A]">MIN TRUST SCORE</span>
                  <span className="text-[#3B82F6] font-bold">{minTrustScore}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="99"
                  step="1"
                  value={minTrustScore}
                  onChange={(e) => setMinTrustScore(Number(e.target.value))}
                  className="w-full accent-[#3B82F6] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-[11px] font-mono mb-1">
                  <span className="text-[#8A8F9A]">MAX VRAM</span>
                  <span className="text-[#3B82F6] font-bold">{maxVram} GB</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="32"
                  step="2"
                  value={maxVram}
                  onChange={(e) => setMaxVram(Number(e.target.value))}
                  className="w-full accent-[#3B82F6] cursor-pointer"
                />
              </div>
            </div>

            {/* Required Capability Tags Selector */}
            <div>
              <label className="block text-[11px] font-mono text-[#8A8F9A] uppercase mb-2">
                Required Capability Requirements
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "fast_reasoning",
                  "physical_simulation",
                  "evidence_synthesis",
                  "boundary_permeability",
                  "strict_json",
                  "high_precision",
                  "deterministic",
                  "edge_offline"
                ].map((cap) => {
                  const isSelected = selectedCapabilities.includes(cap);
                  return (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => toggleCapabilityTag(cap)}
                      className={`text-xs font-mono px-3 py-1.5 rounded transition-all cursor-pointer flex items-center space-x-1.5 ${
                        isSelected
                          ? "bg-[#3B82F6] text-[#FFFFFF] font-semibold"
                          : "bg-[#181A20] text-[#8A8F9A] border border-[#2A2E39] hover:text-[#E6E4DF]"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{cap}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="requireOffline"
                checked={requireOffline}
                onChange={(e) => setRequireOffline(e.target.checked)}
                className="w-4 h-4 rounded border-[#2A2E39] accent-[#3B82F6] cursor-pointer"
              />
              <label htmlFor="requireOffline" className="text-xs font-mono text-[#E6E4DF] cursor-pointer">
                Strict Zero-Cloud / Edge Offline Execution Enforced
              </label>
            </div>
          </div>

          {/* Router Decision & Selected Model Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 bg-[#181A20] p-5 rounded border border-[#22262F]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#22262F]">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#3B82F6]" />
                  <span className="text-xs font-mono font-bold text-[#E6E4DF] uppercase">
                    Optimal Selected Model Match
                  </span>
                </div>
                {getTrustBadge(bestModel.trustState)}
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#8A8F9A] block">
                    {bestModel.provider}
                  </span>
                  <h3 className="text-lg font-semibold text-[#E6E4DF] tracking-tight">
                    {bestModel.name}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-[#13151A] p-3 rounded border border-[#22262F] text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-[#8A8F9A] block">AVG LATENCY</span>
                    <span className="text-[#4ADE80] font-bold">{bestModel.latencyMs.avgMs} ms</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8A8F9A] block">TRUST RATING</span>
                    <span className="text-[#3B82F6] font-bold">{bestModel.trustScore}% Verified</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8A8F9A] block">TARGET HARDWARE</span>
                    <span className="text-[#E6E4DF]">{bestModel.hardwareRequirements.targetDevice}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8A8F9A] block">ZERO-CLOUD EDGE</span>
                    <span className={bestModel.hardwareRequirements.offlineSupport ? "text-[#4ADE80]" : "text-[#8A8F9A]"}>
                      {bestModel.hardwareRequirements.offlineSupport ? "Supported" : "Cloud Only"}
                    </span>
                  </div>
                </div>

                {/* Selection Rationale */}
                <div className="space-y-1.5 text-xs font-mono">
                  <span className="text-[10px] uppercase font-bold text-[#8A8F9A] block">
                    Match Rationales:
                  </span>
                  <ul className="space-y-1 text-[#A3A8B4]">
                    {selectionResult.matchRationales.map((rat, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-[#3B82F6]">•</span>
                        <span>{rat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#22262F] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#8A8F9A]">
                Model ID: <code className="text-[#E6E4DF]">{bestModel.id}</code>
              </span>

              <button
                onClick={() => handleAssignActiveModel(bestModel)}
                disabled={bestModel.trustState === "REVOKED"}
                className="flex items-center space-x-1.5 bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#22262F] text-[#FFFFFF] text-xs font-semibold px-3 py-1.5 rounded transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Assign to Active Twin</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Model Candidate Evaluation Matrix & Registry Inventory */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-[#C5A059]" />
            <h2 className="text-sm font-semibold uppercase font-mono tracking-wider text-[#E6E4DF]">
              Capability Registry Inventory & Evaluation Matrix ({filteredModels.length})
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8A8F9A] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search models, providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#13151A] border border-[#22262F] text-xs text-[#E6E4DF] pl-8 pr-3 py-1.5 rounded focus:outline-none focus:border-[#3B82F6] w-48"
              />
            </div>

            <div className="flex items-center bg-[#13151A] border border-[#22262F] rounded p-0.5 text-xs font-mono">
              {["all", "approved", "experimental", "offline", "cloud", "revoked"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded cursor-pointer capitalize ${
                    selectedCategory === cat ? "bg-[#22262F] text-[#E6E4DF] font-bold" : "text-[#8A8F9A] hover:text-[#E6E4DF]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Model Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredModels.map((model) => {
            const evalMatch = selectionResult.evaluatedModels.find((e) => e.modelId === model.id);
            const isAssigned = twin.selectedModelId === model.id;
            const isRevoked = model.trustState === "REVOKED";

            return (
              <div
                key={model.id}
                className={`bg-[#13151A] border rounded p-5 space-y-4 flex flex-col justify-between transition-all ${
                  isRevoked
                    ? "border-[#4A1D24] bg-[#181112] opacity-80"
                    : isAssigned
                    ? "border-[#3B82F6] ring-1 ring-[#3B82F6]/50 shadow-lg"
                    : evalMatch?.eligible
                    ? "border-[#22262F] hover:border-[#343A46]"
                    : "border-[#2A2020] opacity-75"
                }`}
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-[#8A8F9A] block">
                        {model.provider}
                      </span>
                      <h3 className="text-base font-medium text-[#E6E4DF] tracking-tight">
                        {model.name}
                      </h3>
                    </div>

                    <div className="flex flex-col items-end space-y-1">
                      {getTrustBadge(model.trustState)}
                      {isAssigned && (
                        <span className="text-[9px] font-mono text-[#4ADE80] font-bold uppercase tracking-wider">
                          ACTIVE TWIN MODEL
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hardware & Latency Spec Chips */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#22262F] text-[11px] font-mono">
                    <div>
                      <span className="text-[9px] text-[#8A8F9A] block">AVG LATENCY</span>
                      <span className="text-[#E6E4DF] font-semibold">{model.latencyMs.avgMs} ms</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-[#8A8F9A] block">TARGET DEV</span>
                      <span className="text-[#E6E4DF] font-semibold">{model.hardwareRequirements.targetDevice}</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-[#8A8F9A] block">MIN VRAM</span>
                      <span className="text-[#E6E4DF] font-semibold">
                        {model.hardwareRequirements.minVramGB > 0 ? `${model.hardwareRequirements.minVramGB} GB` : "Cloud"}
                      </span>
                    </div>
                  </div>

                  {/* Capabilities Tags */}
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#8A8F9A] block mb-1">
                      Registered Capabilities:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {model.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1C1F26] text-[#A3A8B4] border border-[#282C37]"
                        >
                          {cap}
                        </span>
                      ))}
                      {model.capabilities.length === 0 && (
                        <span className="text-[10px] font-mono text-[#EF4444]">None (Revoked Rail)</span>
                      )}
                    </div>
                  </div>

                  {/* Evaluation Result for Current Simulator Task */}
                  {evalMatch && (
                    <div className="bg-[#181A20] p-2.5 rounded border border-[#22262F] text-[11px] font-mono space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[#8A8F9A]">Task Router Score:</span>
                        <span className={`font-bold ${evalMatch.eligible ? "text-[#4ADE80]" : "text-[#EF4444]"}`}>
                          {evalMatch.eligible ? `${evalMatch.score} pts` : "INELIGIBLE"}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#8A8F9A] line-clamp-2">
                        {evalMatch.reasons[0] || "Fully meets task criteria"}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action */}
                <div className="pt-3 border-t border-[#22262F] flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-[10px] font-mono text-[#8A8F9A]">
                    {model.hardwareRequirements.offlineSupport ? (
                      <span className="text-[#4ADE80] flex items-center space-x-1">
                        <Lock className="w-3 h-3" />
                        <span>Zero-Cloud Edge</span>
                      </span>
                    ) : (
                      <span className="text-[#509EE3] flex items-center space-x-1">
                        <Globe className="w-3 h-3" />
                        <span>Cloud API</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAssignActiveModel(model)}
                    disabled={isAssigned || isRevoked}
                    className={`text-xs font-mono font-semibold px-3 py-1 rounded transition-colors cursor-pointer ${
                      isRevoked
                        ? "bg-[#2A1417] text-[#EF4444] border border-[#522026] cursor-not-allowed"
                        : isAssigned
                        ? "bg-[#1E2330] text-[#3B82F6] cursor-default border border-[#3B82F6]/30"
                        : "bg-[#22262F] hover:bg-[#343A46] text-[#E6E4DF]"
                    }`}
                  >
                    {isRevoked ? "Revoked Rail" : isAssigned ? "Active Model" : "Select Model"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
