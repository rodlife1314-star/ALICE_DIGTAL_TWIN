import React, { useState, useEffect } from "react";
import {
  Layers,
  Eye,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Shield,
  Activity,
  Compass,
  Database,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Sparkles,
  Info,
  Maximize2,
  ChevronRight,
  Flame,
  Cpu,
  Atom,
  Sun,
  CloudRain,
  Wind,
  Thermometer,
  ExternalLink,
  GitCommit,
  Scissors,
  SplitSquareVertical,
  ActivitySquare,
  Zap,
  Gauge,
  Check,
  X,
  Server,
  FileCheck,
  CornerDownRight,
  HelpCircle
} from "lucide-react";
import { DigitalTwin } from "../types";
import { 
  SpatialScene, 
  SpatialVisualNode, 
  SpatialEvidenceClassification, 
  PathfinderSpatialScale,
  LOD_LABELS,
  RenderQualityProfile,
  SpatialComputeRequest,
  SpatialComputeResult
} from "../types/spatial";
import { getSpatialAdapterForTwin } from "../spatial/SpatialRegistry";
import { SpatialSceneCanvas, getClassificationVisualMeta, getFieldSourceMeta } from "../spatial/SpatialSceneCanvas";
import { NvidiaSpatialComputeRail } from "../spatial/NvidiaSpatialCompute";

interface TwinObservatoryProps {
  twin: DigitalTwin;
  onNavigateToTab?: (tab: any) => void;
}

export function TwinObservatory({ twin, onNavigateToTab }: TwinObservatoryProps) {
  const adapter = getSpatialAdapterForTwin(twin);

  // Multi-Scale LOD & Viewing State
  const [activeScale, setActiveScale] = useState<PathfinderSpatialScale>(2);
  const [isAutoLOD, setIsAutoLOD] = useState<boolean>(true);
  const [explodedFactor, setExplodedFactor] = useState<number>(0.0);
  const [sectionalCutPlane, setSectionalCutPlane] = useState<"NONE" | "Y_PLANE" | "Z_PLANE">("NONE");
  const [sectionalCutPosition, setSectionalCutPosition] = useState<number>(0.0);
  const [activeFieldOverlay, setActiveFieldOverlay] = useState<"NONE" | "TEMPERATURE" | "CO2_CONCENTRATION" | "ELECTRIC_POTENTIAL" | "IR_FLUX">("NONE");
  const [qualityProfile, setQualityProfile] = useState<RenderQualityProfile>("balanced");

  // NVIDIA Acceleration Compute Rail State
  const [isComputeModalOpen, setIsComputeModalOpen] = useState<boolean>(false);
  const [isExecutingCompute, setIsExecutingCompute] = useState<boolean>(false);
  const [lastComputeResult, setLastComputeResult] = useState<SpatialComputeResult | null>(null);
  const [isSolverActive, setIsSolverActive] = useState<boolean>(false);

  // Operator interactive boundary parameters
  const [operatorParams, setOperatorParams] = useState<Record<string, any>>({
    // COOLed parameters
    timeOfDayHours: 12.0,
    ambientTempC: 34.0,
    peakSolarIrradianceWm2: 960,
    precipitableWaterVaporMm: 14,
    relativeHumidityPct: 35,
    atmosphericWindowCloudCoverPct: 0,
    convectiveHeatCoeffHc: 6.0,
    metasurfaceEmissivity8to13: 0.96,
    solarReflectance: 0.965,

    // Membrane parameters
    surfacePotentialMv: -60,
    poreDiameterNm: 1.8,
    isBreachTriggered: false,
    speciesConcentration: 120,

    // Antikythera parameters
    crankAngleDeg: 45,
    backlashMm: 0.05,
    sarosToothHypothesis: "MODEL_A_223",

    // Termite parameters
    windSpeedMps: 3.2,
    isChimneySealed: false,

    // Sixes parameters
    serviceCovers: 40,
    isAllergenQuarantined: true,

    // Aerial Vehicle parameters
    airspeedMps: 14.2,
    angleAttackDeg: 3.4,
    altitudeAglM: 120.0,
    crosswindGustMps: 2.5,
    throttlePct: 65,
    isOctagonArmed: true,

    // Multi-scale viewing parameters
    explodedFactor: 0.0,
    sectionalCutPlane: "NONE",
    sectionalCutPosition: 0.0,
    activeFieldOverlay: "NONE",
    qualityProfile: "balanced",
    nvidiaSolverActive: false
  });

  const [scene, setScene] = useState<SpatialScene>(() => adapter.buildScene(twin, {
    ...operatorParams,
    explodedFactor,
    sectionalCutPlane,
    sectionalCutPosition,
    activeFieldOverlay,
    qualityProfile,
    nvidiaSolverActive: isSolverActive
  }, activeScale));

  const [selectedNode, setSelectedNode] = useState<SpatialVisualNode | null>(null);
  const [evidenceFilter, setEvidenceFilter] = useState<SpatialEvidenceClassification | "ALL">("ALL");
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [isDiurnalPlaying, setIsDiurnalPlaying] = useState<boolean>(false);
  const [governanceNotice, setGovernanceNotice] = useState<string | null>(null);
  const [snrRoute, setSnrRoute] = useState<"STOP" | "HOLD" | "SURFACE" | "MONITOR" | "DISCARD">("SURFACE");

  // Diurnal auto-cycle playback
  useEffect(() => {
    if (!isDiurnalPlaying) return;
    const interval = setInterval(() => {
      setOperatorParams(prev => {
        const nextTime = (prev.timeOfDayHours + 0.2) % 24;
        return { ...prev, timeOfDayHours: Number(nextTime.toFixed(1)) };
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isDiurnalPlaying]);

  // Re-build scene when parameters, LOD, or viewing modes change
  useEffect(() => {
    const combinedParams = {
      ...operatorParams,
      explodedFactor,
      sectionalCutPlane,
      sectionalCutPosition,
      activeFieldOverlay,
      qualityProfile,
      nvidiaSolverActive: isSolverActive
    };
    const nextScene = adapter.buildScene(twin, combinedParams, activeScale);
    const result = adapter.applyOperatorChange(combinedParams, nextScene);
    setScene(nextScene);
    setGovernanceNotice(result.governanceAlert || null);
    setSnrRoute(result.snrStatus);

    if (selectedNode) {
      const refreshed = nextScene.nodes.find(n => n.id === selectedNode.id);
      if (refreshed) setSelectedNode(refreshed);
    }
  }, [twin, operatorParams, activeScale, explodedFactor, sectionalCutPlane, sectionalCutPosition, activeFieldOverlay, qualityProfile, isSolverActive]);

  const updateParam = (key: string, val: any) => {
    setOperatorParams(prev => ({ ...prev, [key]: val }));
  };

  const isVessel = twin.id === "alice-vessel-ccv01" || twin.id.includes("vessel");
  const isAerial = (twin.id === "aerial-vehicle-01" || twin.id.includes("aerial") || twin.name.includes("AERIAL") || (twin.domain === "aerospace" && !isVessel)) && !isVessel;
  const isMembrane = twin.id === "intelligent-protective-membrane-07" || twin.name.includes("Membrane");
  const isSixes = twin.id === "project-sixes-culinary-08" || twin.name.includes("SIXES");

  const formatHours = (hrs: number) => {
    const h = Math.floor(hrs);
    const m = Math.floor((hrs % 1) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  // Determine active physics domain for NVIDIA compute
  const getPhysicsDomainForTwin = () => {
    if (isVessel || isAerial) return "bio_aerodynamics";
    if (isMembrane) return "electrochemistry";
    if (isSixes) return "fluid_emulsion";
    return "electrochemistry";
  };

  // Execute NVIDIA Spatial Compute
  const handleExecuteNvidiaCompute = async () => {
    setIsExecutingCompute(true);
    const domain = getPhysicsDomainForTwin();
    const req: SpatialComputeRequest = {
      twinId: twin.id,
      spatialScale: activeScale,
      physicsDomain: domain as any,
      targetEntityId: selectedNode?.id || "canonical-assembly",
      boundaryConditions: {
        ...operatorParams
      },
      requestedResolution: activeScale === 4 ? "Microstructure 512x512 Grid" : "System Mesh 128³",
      timeWindow: {
        start: 0,
        end: 10,
        step: 0.05
      },
      convergenceTolerance: 1e-5
    };

    try {
      const res = await NvidiaSpatialComputeRail.executeSpatialCompute(req);
      setLastComputeResult(res);
    } catch (e) {
      console.error("Spatial compute error", e);
    } finally {
      setIsExecutingCompute(false);
    }
  };

  // Sovereign Operator Gate: Commit Solver Result into Canonical Twin State
  const [operatorOverrideRationale, setOperatorOverrideRationale] = useState<string>("");
  const [showOverrideInput, setShowOverrideInput] = useState<boolean>(false);

  const handlePromoteSolverResult = (isOverride = false) => {
    if (!lastComputeResult) return;
    if (!lastComputeResult.convergenceStatus && !isOverride) {
      return; // Strictly blocked by epistemic law
    }
    setIsSolverActive(true);
    updateParam("nvidiaSolverActive", true);
    setIsComputeModalOpen(false);
    setShowOverrideInput(false);
  };

  const handleRouteToHold = () => {
    if (!lastComputeResult) return;
    setSnrRoute("HOLD");
    setGovernanceNotice(`Compute receipt ${lastComputeResult.computeReceipt.receiptId} routed to HOLD: Mathematical residual (${lastComputeResult.finalResidual.toExponential(2)}) exceeded requested tolerance (${lastComputeResult.requestedTolerance.toExponential(2)}). Canonical promotion rejected.`);
    setIsComputeModalOpen(false);
  };

  // Find primary active field node for overlay provenance
  const activeFieldNode = scene.nodes.find(n => n.fieldData && n.fieldData.fieldSource);
  const primaryFieldSource = isSolverActive ? "SOLVER" : (activeFieldNode?.fieldData?.fieldSource || "PROCEDURAL_DEMO");

  return (
    <div className="space-y-6 text-[#E6E4DF]">
      {/* Observatory Header with Sovereign Law */}
      <div className="bg-[#13151A] border border-[#2B303C] rounded-lg p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#509EE3]/15 text-[#509EE3] border border-[#509EE3]/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded tracking-wider uppercase flex items-center space-x-1">
              <Atom className="w-3.5 h-3.5 mr-1" />
              PATHFINDER MULTI-SCALE SPATIAL OBSERVATORY
            </span>
            <span className="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
              {LOD_LABELS[activeScale].name}
            </span>
            {isSolverActive ? (
              lastComputeResult?.convergenceStatus ? (
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono px-2 py-0.5 rounded font-bold flex items-center space-x-1">
                  <Cpu className="w-3 h-3" />
                  <span>NVIDIA SOLVER VERIFIED</span>
                </span>
              ) : (
                <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-mono px-2 py-0.5 rounded font-bold flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>OVERRIDE (NON-CONVERGED HOLD)</span>
                </span>
              )
            ) : (
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-mono px-2 py-0.5 rounded font-bold flex items-center space-x-1">
                <Activity className="w-3 h-3" />
                <span>CLIENT PROCEDURAL / DEMO</span>
              </span>
            )}
            {snrRoute === "STOP" && (
              <span className="bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/50 text-[10px] font-mono px-2 py-0.5 rounded font-bold animate-pulse">
                STOP INVARIANT SEALED
              </span>
            )}
          </div>
          <h2 className="text-xl font-light text-[#E6E4DF] tracking-tight flex items-center space-x-2">
            <span>{scene.title}</span>
          </h2>
          <p className="text-xs text-[#A0A4AB] leading-relaxed">
            {scene.description}
          </p>
        </div>

        {/* Epistemic Truth Counter & NVIDIA Compute Dispatch Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => setIsComputeModalOpen(true)}
            className={`px-3.5 py-2.5 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              isSolverActive
                ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80"
                : "bg-gradient-to-r from-[#1E293B] to-[#0F172A] border-[#38BDF8]/40 text-[#38BDF8] hover:border-[#38BDF8] shadow-lg shadow-sky-950/40"
            }`}
          >
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>{isSolverActive ? "SOLVER RECEIPT ACTIVE" : "DISPATCH NVIDIA COMPUTE"}</span>
          </button>

          <div className="bg-[#181A20] border border-[#2A2E39] rounded-lg p-3 font-mono text-xs shrink-0 flex items-center space-x-4">
            <div className="text-center">
              <div className="text-[9px] text-[#10B981] uppercase font-bold">Observed</div>
              <div className="text-base font-bold text-[#E6E4DF]">{scene.truthLedgerSummary.observedCount}</div>
            </div>
            <div className="h-6 w-px bg-[#2B303C]" />
            <div className="text-center">
              <div className="text-[9px] text-[#F59E0B] uppercase font-bold">Reconstruct</div>
              <div className="text-base font-bold text-[#E6E4DF]">{scene.truthLedgerSummary.reconstructedCount}</div>
            </div>
            <div className="h-6 w-px bg-[#2B303C]" />
            <div className="text-center">
              <div className="text-[9px] text-[#8B5CF6] uppercase font-bold">Inferred</div>
              <div className="text-base font-bold text-[#E6E4DF]">{scene.truthLedgerSummary.inferredCount}</div>
            </div>
            <div className="h-6 w-px bg-[#2B303C]" />
            <div className="text-center">
              <div className="text-[9px] text-[#06B6D4] uppercase font-bold">Simulated</div>
              <div className="text-base font-bold text-[#E6E4DF]">{scene.truthLedgerSummary.simulatedCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Scale Hierarchical Level of Detail (PSS-0 to PSS-4) Navigation Bar */}
      <div className="bg-[#13151A] border border-[#262B35] rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-[#C5A059]" />
          <span className="text-[#E6E4DF] font-bold text-[11px] uppercase">Pathfinder Spatial Scale (PSS):</span>
        </div>

        {/* PSS Scale Selector Buttons (PSS-0 to PSS-4) */}
        <div className="flex flex-wrap items-center gap-1.5">
          {([0, 1, 2, 3, 4] as PathfinderSpatialScale[]).map((level) => (
            <button
              key={level}
              onClick={() => {
                setActiveScale(level);
                setIsAutoLOD(false);
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                activeScale === level
                  ? "bg-[#509EE3] text-[#0D0E11] shadow-lg shadow-[#509EE3]/20"
                  : "bg-[#181A20] text-[#8A8F9A] hover:text-[#E6E4DF] border border-[#262B35]"
              }`}
              title={LOD_LABELS[level].description}
            >
              {LOD_LABELS[level].name}
            </button>
          ))}

          <div className="h-4 w-px bg-[#2B303C] mx-1" />

          {/* Auto Proximity-Driven Scale Toggle */}
          <button
            onClick={() => setIsAutoLOD(!isAutoLOD)}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${
              isAutoLOD
                ? "bg-[#10B981] text-[#0D0E11] shadow-lg shadow-[#10B981]/20"
                : "bg-[#181A20] text-[#8A8F9A] border border-[#262B35]"
            }`}
            title="Automatically adapt Spatial Scale based on camera distance and inquiry depth"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAutoLOD ? "AUTO PROXIMITY PSS (ON)" : "MANUAL SCALE"}</span>
          </button>
        </div>
      </div>

      {/* Field Provenance Banner when Overlay is active */}
      {activeFieldOverlay !== "NONE" && (
        <div className={`p-3 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs ${
          isSolverActive
            ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
            : "bg-amber-950/40 border-amber-500/50 text-amber-200"
        }`}>
          <div className="flex items-center space-x-2.5">
            {isSolverActive ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <div>
              <div className="flex items-center space-x-2">
                <strong className="uppercase font-bold tracking-wide">
                  {isSolverActive ? "SOLVER-GENERATED FIELD · RECEIPT VERIFIED" : "PROCEDURAL / ILLUSTRATIVE OVERLAY · NOT CONVERGED"}
                </strong>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${getFieldSourceMeta(primaryFieldSource).color}`}>
                  {getFieldSourceMeta(primaryFieldSource).badge}
                </span>
              </div>
              <p className="text-[11px] opacity-80 mt-0.5">
                {isSolverActive 
                  ? `Active Field: ${activeFieldOverlay} computed via ${lastComputeResult?.solverMetadata.solverName || "NVIDIA Warp FVM"} (Residual: ${lastComputeResult?.fieldData.residual || "|f(x)| < 1e-5"}).`
                  : "Rendering fidelity does not equal solver fidelity. Overlay is procedurally calculated on client until external NVIDIA physics rail is executed."}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {!isSolverActive && (
              <button
                onClick={() => setIsComputeModalOpen(true)}
                className="px-2.5 py-1 rounded bg-amber-500 text-black font-bold text-[11px] hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Compute Real Field
              </button>
            )}
          </div>
        </div>
      )}

      {/* Advanced Scientific Viewing Modes: Exploded View, Sectional Cut, Field Heatmap */}
      <div className="bg-[#13151A] border border-[#262B35] rounded-lg p-3.5 grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        {/* Exploded View Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-[#8A8F9A]">
            <span className="flex items-center space-x-1">
              <SplitSquareVertical className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>EXPLODED VIEW</span>
            </span>
            <span className="text-[#F59E0B] font-bold">{Math.round(explodedFactor * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.0}
            max={1.0}
            step={0.05}
            value={explodedFactor ?? 0}
            onChange={(e) => setExplodedFactor(Number(e.target.value))}
            className="w-full accent-[#F59E0B] cursor-pointer"
          />
        </div>

        {/* Sectional Cut Plane */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-[#8A8F9A]">
            <span className="flex items-center space-x-1">
              <Scissors className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>SECTIONAL SLICE</span>
            </span>
            <span className="text-[#06B6D4] font-bold">{sectionalCutPlane}</span>
          </div>
          <div className="flex items-center space-x-1">
            {(["NONE", "Y_PLANE", "Z_PLANE"] as const).map((plane) => (
              <button
                key={plane}
                onClick={() => setSectionalCutPlane(plane)}
                className={`flex-1 py-1 rounded text-[10px] font-bold cursor-pointer ${
                  sectionalCutPlane === plane
                    ? "bg-[#06B6D4] text-[#0D0E11]"
                    : "bg-[#181A20] text-[#8A8F9A] border border-[#262B35]"
                }`}
              >
                {plane === "NONE" ? "OFF" : plane === "Y_PLANE" ? "Y-SLICE" : "Z-SLICE"}
              </button>
            ))}
          </div>
        </div>

        {/* Field Heatmap Overlay */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-[#8A8F9A]">
            <span className="flex items-center space-x-1">
              <ActivitySquare className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>FIELD HEATMAP</span>
            </span>
            <span className="text-[#A78BFA] font-bold">{activeFieldOverlay}</span>
          </div>
          <select
            value={activeFieldOverlay ?? "NONE"}
            onChange={(e) => setActiveFieldOverlay(e.target.value as any)}
            className="w-full bg-[#181A20] text-[#E6E4DF] border border-[#262B35] rounded px-2 py-1 text-[10px] cursor-pointer"
          >
            <option value="NONE">NONE (SURFACE MATERIALS)</option>
            <option value="TEMPERATURE">TEMPERATURE FIELD (°C)</option>
            <option value="ELECTRIC_POTENTIAL">ELECTRIC POTENTIAL (mV)</option>
            <option value="CO2_CONCENTRATION">CO2 / BIO CONCENTRATION</option>
            <option value="IR_FLUX">IR RADIATIVE FLUX DENSITY</option>
          </select>
        </div>

        {/* Quality & GPU Performance Profile */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-[#8A8F9A]">
            <span className="flex items-center space-x-1">
              <Gauge className="w-3.5 h-3.5 text-[#10B981]" />
              <span>GPU INSTANCING / PROFILE</span>
            </span>
            <span className="text-[#10B981] font-bold">{qualityProfile.toUpperCase()}</span>
          </div>
          <select
            value={qualityProfile ?? "balanced"}
            onChange={(e) => setQualityProfile(e.target.value as any)}
            className="w-full bg-[#181A20] text-[#E6E4DF] border border-[#262B35] rounded px-2 py-1 text-[10px] cursor-pointer"
          >
            <option value="low_power_mobile">MOBILE / ECO (200 INSTANCES)</option>
            <option value="balanced">BALANCED (1000 INSTANCES)</option>
            <option value="scientific_high_fidelity">SCIENTIFIC HIGH-FIDELITY (FULL)</option>
          </select>
        </div>
      </div>

      {/* Diurnal Timeline (when applicable) */}

      {/* Governance Invariant Alert Banner */}
      {governanceNotice && (
        <div className="bg-[#2A1215] border border-[#7F1D1D] rounded-lg p-3 flex items-center space-x-3 text-xs font-mono text-[#FCA5A5] animate-pulse">
          <AlertTriangle className="w-5 h-5 text-[#EF4444] shrink-0" />
          <span>{governanceNotice}</span>
        </div>
      )}

      {/* Main Observatory Workspace: 3D Multi-Scale Viewport + Operator Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 3D Spatial Canvas (3 Columns) */}
        <div className="lg:col-span-3 h-[600px] relative rounded-lg border border-[#262B35] shadow-2xl">
          <SpatialSceneCanvas
            scene={scene}
            selectedNodeId={selectedNode?.id || null}
            onSelectNode={setSelectedNode}
            evidenceFilter={evidenceFilter}
            isSimulating={isSimulating}
            activeLOD={activeScale}
            onLODChange={setActiveScale}
            isAutoLOD={isAutoLOD}
          />

          {/* Floating Canvas Controls Overlay + Solver Fidelity Telemetry Strip */}
          <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-10">
            <div className="bg-[#13151A]/90 backdrop-blur-md border border-[#2B303C] rounded-lg p-2 flex items-center space-x-2 font-mono text-xs pointer-events-auto">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`p-1.5 rounded transition-colors cursor-pointer flex items-center space-x-1 ${
                  isSimulating ? "bg-[#10B981] text-[#0D0E11] font-bold" : "bg-[#262B35] text-[#8A8F9A]"
                }`}
              >
                {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isSimulating ? "SIMULATING" : "PAUSED"}</span>
              </button>
              <div className="h-4 w-px bg-[#2B303C]" />
              <button
                onClick={() => {
                  setOperatorParams({
                    timeOfDayHours: 12.0,
                    ambientTempC: 34.0,
                    peakSolarIrradianceWm2: 960,
                    precipitableWaterVaporMm: 14,
                    relativeHumidityPct: 35,
                    atmosphericWindowCloudCoverPct: 0,
                    convectiveHeatCoeffHc: 6.0,
                    metasurfaceEmissivity8to13: 0.96,
                    solarReflectance: 0.965,
                    surfacePotentialMv: -60,
                    poreDiameterNm: 1.8,
                    isBreachTriggered: false,
                    speciesConcentration: 120,
                    crankAngleDeg: 45,
                    backlashMm: 0.05,
                    sarosToothHypothesis: "MODEL_A_223",
                    windSpeedMps: 3.2,
                    isChimneySealed: false,
                    serviceCovers: 40,
                    isAllergenQuarantined: true,
                    nvidiaSolverActive: false
                  });
                  setIsSolverActive(false);
                  setExplodedFactor(0.0);
                  setSectionalCutPlane("NONE");
                }}
                className="p-1.5 rounded hover:bg-[#262B35] text-[#8A8F9A] hover:text-[#E6E4DF] transition-colors cursor-pointer flex items-center space-x-1"
                title="Reset Boundary Parameters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Real-time Solver Fidelity & State Telemetry Badge */}
            <div className="bg-[#13151A]/90 backdrop-blur-md border border-[#2B303C] rounded-lg px-3 py-1.5 font-mono text-[10px] flex items-center space-x-3 pointer-events-auto text-[#A0A4AB]">
              <div>
                <span className="text-[#8A8F9A] uppercase">Active Scale: </span>
                <strong className="text-[#38BDF8]">{LOD_LABELS[activeScale].name}</strong>
              </div>
              <div className="h-3 w-px bg-[#2B303C]" />
              <div>
                <span className="text-[#8A8F9A] uppercase">Solver State: </span>
                <strong className={
                  isSolverActive 
                    ? (lastComputeResult?.convergenceStatus ? "text-emerald-400" : "text-red-400") 
                    : "text-amber-400"
                }>
                  {isSolverActive 
                    ? (lastComputeResult?.convergenceStatus ? "NV-WARP CONVERGED" : "NV-WARP (HOLD / NON-CONVERGED)") 
                    : "CLIENT PROCEDURAL"}
                </strong>
              </div>
              <div className="h-3 w-px bg-[#2B303C]" />
              <div>
                <span className="text-[#8A8F9A] uppercase">Residual: </span>
                <strong className="text-[#FBBF24]">
                  {isSolverActive ? (lastComputeResult?.fieldData.residual || "3.1e-5 (L2)") : "N/A (Procedural)"}
                </strong>
              </div>
            </div>
          </div>

          {/* Non-Negotiable Truth Filter Bar */}
          <div className="absolute bottom-3 left-3 right-3 bg-[#13151A]/90 backdrop-blur-md border border-[#2B303C] rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] z-10">
            <div className="flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="text-[#8A8F9A] uppercase font-bold">Truth Classification Filter:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {[
                { key: "ALL", label: "ALL SCENE NODES" },
                { key: "OBSERVED_GEOMETRY", label: "OBSERVED" },
                { key: "MEASURED_STATE", label: "MEASURED" },
                { key: "EVIDENCE_SUPPORTED_RECONSTRUCTION", label: "RECONSTRUCTED" },
                { key: "MODEL_PARAMETER_ASSUMED", label: "ASSUMED / PARAM" },
                { key: "MODEL_INFERRED_STRUCTURE", label: "INFERRED" },
                { key: "SIMULATED_BEHAVIOUR", label: "SIMULATED" }
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setEvidenceFilter(f.key as any)}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    evidenceFilter === f.key
                      ? "bg-[#C5A059] text-[#0D0E11] font-bold"
                      : "bg-[#181A20] text-[#8A8F9A] hover:text-[#E6E4DF]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Operator Controls & Selected Node Truth Inspector (1 Column) */}
        <div className="space-y-4">
          {/* Active Operator Boundary Parameters */}
          <div className="bg-[#13151A] border border-[#262B35] rounded-lg p-4 font-mono text-xs space-y-4 max-h-[320px] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#22252D]">
              <span className="text-[#C5A059] font-bold uppercase flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Operator Boundary Parameters</span>
              </span>
              <span className="text-[10px] text-[#8A8F9A]">Intervene</span>
            </div>

            {/* Membrane-specific Controls */}
            {isMembrane && (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[11px] text-[#8A8F9A] mb-1">
                    <span>SURFACE POTENTIAL</span>
                    <span className="text-[#509EE3] font-bold">{operatorParams?.surfacePotentialMv ?? -60} mV</span>
                  </div>
                  <input
                    type="range"
                    min={-100}
                    max={50}
                    step={5}
                    value={operatorParams?.surfacePotentialMv ?? -60}
                    onChange={(e) => updateParam("surfacePotentialMv", Number(e.target.value))}
                    className="w-full accent-[#509EE3] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-[#8A8F9A] mb-1">
                    <span>PORE DIAMETER</span>
                    <span className="text-[#10B981] font-bold">{operatorParams?.poreDiameterNm ?? 1.8} nm</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={4.0}
                    step={0.1}
                    value={operatorParams?.poreDiameterNm ?? 1.8}
                    onChange={(e) => updateParam("poreDiameterNm", Number(e.target.value))}
                    className="w-full accent-[#10B981] cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-[#22252D]">
                  <label className="flex items-center space-x-2 text-[11px] cursor-pointer text-[#F87171]">
                    <input
                      type="checkbox"
                      checked={Boolean(operatorParams?.isBreachTriggered)}
                      onChange={(e) => updateParam("isBreachTriggered", e.target.checked)}
                      className="accent-[#EF4444]"
                    />
                    <span className="font-bold">Trigger Toxic Invariant Breach</span>
                  </label>
                  <span className="text-[9px] text-[#737885] block mt-0.5">Tests Region E instant hard-seal & STOP boundary</span>
                </div>
              </div>
            )}

            {/* Sixes Culinary Controls */}
            {isSixes && (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[11px] text-[#8A8F9A] mb-1">
                    <span>SERVICE COVERS</span>
                    <span className="text-[#C5A059] font-bold">{operatorParams?.serviceCovers ?? 40} covers</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={120}
                    step={10}
                    value={operatorParams?.serviceCovers ?? 40}
                    onChange={(e) => updateParam("serviceCovers", Number(e.target.value))}
                    className="w-full accent-[#C5A059] cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-[#22252D]">
                  <label className="flex items-center space-x-2 text-[11px] cursor-pointer text-[#10B981]">
                    <input
                      type="checkbox"
                      checked={Boolean(operatorParams?.isAllergenQuarantined)}
                      onChange={(e) => updateParam("isAllergenQuarantined", e.target.checked)}
                      className="accent-[#10B981]"
                    />
                    <span className="font-bold">Enforce Allergen Isolation Ring</span>
                  </label>
                </div>
              </div>
            )}

            {/* Aerial Vehicle-specific Controls */}
            {isAerial && (
              <div className="space-y-3">
                {/* Octagon Sovereign Safety Gate Indicator & Switch */}
                <div className="p-2.5 rounded bg-[#1C1F28] border border-[#10B981]/40 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] text-[#10B981] font-bold uppercase">
                    <span>OCTAGON SOVEREIGN FLIGHT GOVERNOR:</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                      operatorParams.isOctagonArmed 
                        ? (operatorParams.angleAttackDeg > 13.5 || operatorParams.airspeedMps < 9.5 ? "bg-red-950 text-red-400 border border-red-800" : "bg-emerald-950 text-emerald-400 border border-emerald-800")
                        : "bg-amber-950 text-amber-400 border border-amber-800"
                    }`}>
                      {operatorParams.isOctagonArmed 
                        ? (operatorParams.angleAttackDeg > 13.5 || operatorParams.airspeedMps < 9.5 ? "BREACH FLOW STALL" : "ARMED (x_t ∈ Ω_safe)")
                        : "DISARMED BY OPERATOR"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      onClick={() => updateParam("isOctagonArmed", true)}
                      className={`p-1.5 rounded text-[10px] font-bold border transition-colors cursor-pointer text-center ${
                        operatorParams.isOctagonArmed
                          ? "bg-emerald-600 text-black border-emerald-400 font-extrabold shadow-md"
                          : "bg-[#12141A] text-[#8A8F9A] border-[#2A2E39] hover:text-[#E6E4DF]"
                      }`}
                    >
                      ARMED
                      <span className="block text-[8px] opacity-80">Containment Bound</span>
                    </button>
                    <button
                      onClick={() => updateParam("isOctagonArmed", false)}
                      className={`p-1.5 rounded text-[10px] font-bold border transition-colors cursor-pointer text-center ${
                        !operatorParams.isOctagonArmed
                          ? "bg-amber-600 text-white border-amber-400 font-extrabold shadow-md"
                          : "bg-[#12141A] text-[#8A8F9A] border-[#2A2E39] hover:text-[#E6E4DF]"
                      }`}
                    >
                      DISARM
                      <span className="block text-[8px] opacity-80">Manual Bypass</span>
                    </button>
                  </div>
                  <p className="text-[9px] text-[#A0A4AB] leading-tight">
                    {operatorParams.isOctagonArmed
                      ? "Octagon sovereign governor bounds all flight vectors within safe stall, altitude, and thermal margins. Fail-closed: Return-To-Home glide."
                      : "Operator bypass active. Autonomous routines will proceed without bounded envelope enforcement."}
                  </p>
                </div>

                {/* Airspeed (TAS) */}
                <div>
                  <div className="flex justify-between text-[11px] text-[#8A8F9A] mb-1">
                    <span>INDICATED AIRSPEED (TAS)</span>
                    <span className={`font-bold ${(operatorParams?.airspeedMps ?? 14.2) < 9.5 ? "text-red-400" : "text-[#38BDF8]"}`}>
                      {operatorParams?.airspeedMps ?? 14.2} m/s
                      {(operatorParams?.airspeedMps ?? 14.2) < 9.5 && " (STALL HAZARD)"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={8.0}
                    max={26.0}
                    step={0.2}
                    value={operatorParams?.airspeedMps ?? 14.2}
                    onChange={(e) => updateParam("airspeedMps", Number(e.target.value))}
                    className="w-full accent-[#38BDF8] cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-[#606572] mt-0.5">
                    <span>Stall: 9.5 m/s</span>
                    <span>Nominal: 14.2 m/s</span>
                    <span>Sprint: 24.0 m/s</span>
                  </div>
                </div>

                {/* Angle of Attack (AoA) */}
                <div>
                  <div className="flex justify-between text-[11px] text-[#8A8F9A] mb-1">
                    <span>ANGLE OF ATTACK (AoA)</span>
                    <span className={`font-bold ${(operatorParams?.angleAttackDeg ?? 3.4) > 13.5 ? "text-red-400" : "text-[#F59E0B]"}`}>
                      {operatorParams?.angleAttackDeg ?? 3.4}°
                      {(operatorParams?.angleAttackDeg ?? 3.4) > 13.5 && " (FLOW SEPARATION)"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-2.0}
                    max={16.0}
                    step={0.2}
                    value={operatorParams?.angleAttackDeg ?? 3.4}
                    onChange={(e) => updateParam("angleAttackDeg", Number(e.target.value))}
                    className="w-full accent-[#F59E0B] cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-[#606572] mt-0.5">
                    <span>Cruise: 3.4°</span>
                    <span>Max L/D: 4.8°</span>
                    <span>Stall Limit: 13.5°</span>
                  </div>
                </div>

                {/* Throttle Percentage */}
                <div>
                  <div className="flex justify-between text-[11px] text-[#8A8F9A] mb-1">
                    <span>PROPULSION THROTTLE</span>
                    <span className={`font-bold ${(operatorParams?.throttlePct ?? 65) > 90 ? "text-amber-400" : "text-[#10B981]"}`}>
                      {operatorParams?.throttlePct ?? 65}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={operatorParams?.throttlePct ?? 65}
                    onChange={(e) => updateParam("throttlePct", Number(e.target.value))}
                    className="w-full accent-[#10B981] cursor-pointer"
                  />
                </div>

                {/* Crosswind Gust */}
                <div>
                  <div className="flex justify-between text-[11px] text-[#8A8F9A] mb-1">
                    <span>CROSSWIND GUST COMPONENT</span>
                    <span className="text-[#A78BFA] font-bold">{operatorParams?.crosswindGustMps ?? 2.5} m/s</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    step={0.5}
                    value={operatorParams?.crosswindGustMps ?? 2.5}
                    onChange={(e) => updateParam("crosswindGustMps", Number(e.target.value))}
                    className="w-full accent-[#A78BFA] cursor-pointer"
                  />
                </div>

                {/* Altitude AGL */}
                <div>
                  <div className="flex justify-between text-[11px] text-[#8A8F9A] mb-1">
                    <span>CORRIDOR ALTITUDE AGL</span>
                    <span className="text-[#38BDF8] font-bold">{operatorParams?.altitudeAglM ?? 120.0} m</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={400}
                    step={10}
                    value={operatorParams?.altitudeAglM ?? 120.0}
                    onChange={(e) => updateParam("altitudeAglM", Number(e.target.value))}
                    className="w-full accent-[#38BDF8] cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Selected Node Truth & Multi-Scale Epistemic Inspector */}
          <div className="bg-[#13151A] border border-[#262B35] rounded-lg p-4 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#22252D]">
              <span className="text-[#509EE3] font-bold uppercase flex items-center space-x-1.5">
                <Database className="w-3.5 h-3.5" />
                <span>Multi-Scale Truth Inspector</span>
              </span>
              <span className="text-[10px] text-[#8A8F9A]">Component Level</span>
            </div>

            {selectedNode ? (
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-bold text-[#E6E4DF]">{selectedNode.name}</div>
                  <div className="text-[10px] text-[#8A8F9A] flex items-center justify-between mt-0.5">
                    <span>Scale: {LOD_LABELS[selectedNode.lodLevel].name}</span>
                    <span>Node ID: {selectedNode.id}</span>
                  </div>
                </div>

                {/* Truth Classification Badge */}
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold border ${getClassificationVisualMeta(selectedNode.classification).badgeBg}`}>
                    {getClassificationVisualMeta(selectedNode.classification).label}
                  </span>
                </div>

                {/* Active Field Data Indicator & Source Verification (if present) */}
                {selectedNode.fieldData && (
                  <div className="bg-[#181A20] p-2.5 rounded border border-[#8B5CF6]/30 space-y-1.5 text-[10px]">
                    <div className="flex justify-between items-center">
                      <span className="text-[#A78BFA] uppercase font-bold">{selectedNode.fieldData.fieldType.replace('_', ' ')}:</span>
                      <strong className="text-[#E6E4DF]">{selectedNode.fieldData.scalarValue} {selectedNode.fieldData.unit}</strong>
                    </div>
                    <div className="flex justify-between items-center text-[9px] pt-1 border-t border-[#2A2E39]">
                      <span className="text-[#8A8F9A]">Source:</span>
                      <span className={`px-1.5 py-0.2 rounded font-bold border ${getFieldSourceMeta(selectedNode.fieldData.fieldSource).color}`}>
                        {getFieldSourceMeta(selectedNode.fieldData.fieldSource).badge}
                      </span>
                    </div>
                    {selectedNode.fieldData.solverRunId && (
                      <div className="text-[8px] text-[#737885] flex justify-between">
                        <span>Run ID: {selectedNode.fieldData.solverRunId}</span>
                        <span>Res: {selectedNode.fieldData.residual || "< 1e-4"}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Observed vs Simulated Delta Card (When Available) */}
                {selectedNode.observedVsSimulatedDelta && (
                  <div className="bg-[#181A20] p-2.5 rounded border border-[#3B82F6]/30 space-y-1.5 text-[11px]">
                    <div className="text-[9px] text-[#38BDF8] uppercase font-bold flex items-center justify-between">
                      <span>Observed vs Simulated Delta:</span>
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                        selectedNode.observedVsSimulatedDelta.validationStatus === "VALIDATED" 
                          ? "bg-[#064E3B] text-[#34D399]" 
                          : "bg-[#78350F] text-[#FBBF24]"
                      }`}>
                        {selectedNode.observedVsSimulatedDelta.validationStatus}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                      <div className="bg-[#111317] p-1.5 rounded border border-[#22252D]">
                        <span className="text-[#8A8F9A] block text-[8px]">OBSERVED VALUE</span>
                        <strong className="text-[#10B981]">{selectedNode.observedVsSimulatedDelta.observedValue} {selectedNode.observedVsSimulatedDelta.unit}</strong>
                      </div>
                      <div className="bg-[#111317] p-1.5 rounded border border-[#22252D]">
                        <span className="text-[#8A8F9A] block text-[8px]">SIMULATED VALUE</span>
                        <strong className="text-[#06B6D4]">{selectedNode.observedVsSimulatedDelta.simulatedValue} {selectedNode.observedVsSimulatedDelta.unit}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Classification Revision History Card (Immutable Audit Trail) */}
                {selectedNode.classificationHistory && selectedNode.classificationHistory.length > 0 && (
                  <div className="bg-[#181A20] p-2.5 rounded border border-[#8B5CF6]/30 space-y-1.5 text-[10px]">
                    <div className="text-[9px] text-[#A78BFA] uppercase font-bold flex items-center justify-between">
                      <span className="flex items-center space-x-1">
                        <GitCommit className="w-3 h-3 text-[#A78BFA]" />
                        <span>Classification Revision History ({selectedNode.classificationHistory.length})</span>
                      </span>
                      <span className="text-[8px] text-[#8A8F9A]">IMMUTABLE LEDGER</span>
                    </div>
                    <div className="space-y-1.5 max-h-28 overflow-y-auto">
                      {selectedNode.classificationHistory.map((rev, rIdx) => (
                        <div key={rIdx} className="bg-[#111317] p-1.5 rounded border border-[#262B35] space-y-0.5">
                          <div className="flex justify-between text-[#E6E4DF] text-[9px] font-bold">
                            <span className="text-[#F59E0B]">{rev.fromClassification}</span>
                            <span>→</span>
                            <span className="text-[#8B5CF6]">{rev.toClassification}</span>
                          </div>
                          <p className="text-[#A0A4AB] text-[9px] leading-tight">{rev.rationale}</p>
                          <div className="text-[8px] text-[#737885] flex justify-between pt-0.5">
                            <span>Auth: {rev.authorizingOperator}</span>
                            <span>{new Date(rev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Live Node Metrics */}
                {selectedNode.liveMetrics && (
                  <div className="bg-[#181A20] p-2.5 rounded border border-[#262B35] space-y-1 text-[11px]">
                    <div className="text-[9px] text-[#8A8F9A] uppercase font-bold">Live Component & Field Telemetry:</div>
                    {Object.entries(selectedNode.liveMetrics).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-[#A0A4AB]">
                        <span>{k}:</span>
                        <strong className="text-[#E6E4DF]">{String(v)}</strong>
                      </div>
                    ))}
                  </div>
                )}

                {/* Provenance Ledger Ref */}
                {selectedNode.provenanceRef && (
                  <div className="bg-[#181A20] p-2.5 rounded border border-[#262B35] space-y-1.5 text-[10px] text-[#8A8F9A]">
                    <div className="text-[#C5A059] font-bold uppercase flex items-center justify-between">
                      <span>Evidence Anchor:</span>
                      {selectedNode.provenanceRef.evidenceId && (
                        <span className="text-[8px] text-[#509EE3] font-mono">{selectedNode.provenanceRef.evidenceId}</span>
                      )}
                    </div>
                    {selectedNode.provenanceRef.sourceAsset && (
                      <div>Source: <span className="text-[#E6E4DF]">{selectedNode.provenanceRef.sourceAsset}</span></div>
                    )}
                    {selectedNode.provenanceRef.attributionNote && (
                      <div className="text-[#FBBF24] text-[9px] bg-[#2A200B] p-1.5 rounded border border-[#78350F]">
                        {selectedNode.provenanceRef.attributionNote}
                      </div>
                    )}
                    {selectedNode.provenanceRef.confidenceScore && (
                      <div>Confidence: <strong className="text-[#4ADE80]">{selectedNode.provenanceRef.confidenceScore}%</strong></div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-[#737885] space-y-2">
                <Eye className="w-6 h-6 mx-auto opacity-50" />
                <p className="text-[11px]">Click any 3D node or zoom in to inspect its component-level epistemic truth classification, physics equations, and provenance anchor.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkpoint Evidence Audit Status Strip */}
      <div className="bg-[#13151A] border border-[#22252D] rounded-lg p-3 font-mono text-[11px] flex flex-wrap items-center justify-between gap-3 text-[#A0A4AB]">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-[#C5A059]" />
          <span className="text-[#E6E4DF] font-bold uppercase">Substrate Epistemic Audit Labels:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[10px]">
          <div className="bg-[#181A20] px-2 py-1 rounded border border-[#2B303C]">
            <span className="text-[#8A8F9A]">Spatial Scale: </span>
            <strong className="text-[#34D399]">PSS-0 TO PSS-4 FROZEN</strong>
          </div>
          <div className="bg-[#181A20] px-2 py-1 rounded border border-[#2B303C]">
            <span className="text-[#8A8F9A]">NVIDIA Physics Rail: </span>
            <strong className={isSolverActive ? "text-emerald-400" : "text-amber-400"}>
              {isSolverActive ? "SOLVER RECEIPT COMMITTED" : "UNVALIDATED PROCEDURAL"}
            </strong>
          </div>
          <div className="bg-[#181A20] px-2 py-1 rounded border border-[#2B303C]">
            <span className="text-[#8A8F9A]">Measured anchors: </span>
            <strong className="text-[#22D3EE]">LAB ASSAY / SENSOR ATTESTED</strong>
          </div>
          <div className="bg-[#181A20] px-2 py-1 rounded border border-[#2B303C]">
            <span className="text-[#8A8F9A]">Historical reconstructions: </span>
            <strong className="text-[#A78BFA]">IMMUTABLE REVISION LEDGER</strong>
          </div>
        </div>
      </div>

      {/* Governing Equations Strip */}
      <div className="bg-[#13151A] border border-[#22252D] rounded-lg p-4 font-mono text-xs space-y-2">
        <div className="text-[10px] text-[#C5A059] uppercase font-bold flex items-center space-x-1.5">
          <FileText className="w-3.5 h-3.5" />
          <span>Active Governing Physics & Epistemic Equations</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {scene.governingEquations.map((eq, idx) => (
            <div key={idx} className="bg-[#181A20] p-2.5 rounded border border-[#262B35] text-[#A0A8B8] text-[11px]">
              {eq}
            </div>
          ))}
        </div>
      </div>

      {/* NVIDIA SPATIAL COMPUTE ACCELERATION MODAL */}
      {isComputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#111317] border border-[#38BDF8]/40 rounded-xl max-w-2xl w-full p-6 space-y-5 font-mono shadow-2xl text-xs">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#262B35]">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-sky-950/80 border border-sky-500/50 text-sky-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#E6E4DF] flex items-center space-x-2">
                    <span>NVIDIA Spatial Physics Acceleration Rail</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[9px]">
                      READY
                    </span>
                  </h3>
                  <p className="text-[10px] text-[#8A8F9A]">
                    Deterministic high-fidelity compute handoff (Warp / Modulus / PhysX / Isaac Sim)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsComputeModalOpen(false)}
                className="p-1 rounded text-[#8A8F9A] hover:text-[#E6E4DF] hover:bg-[#1E232E] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Compute Manifest & Boundary Input Config */}
            <div className="bg-[#181A20] p-3.5 rounded-lg border border-[#2A2E39] space-y-2.5">
              <div className="text-[10px] text-[#C5A059] uppercase font-bold flex items-center space-x-1">
                <Server className="w-3.5 h-3.5" />
                <span>Compute Dispatch Request Manifest</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-[#8A8F9A]">Target Twin: </span>
                  <strong className="text-[#E6E4DF]">{twin.name}</strong>
                </div>
                <div>
                  <span className="text-[#8A8F9A]">Spatial Scale: </span>
                  <strong className="text-[#38BDF8]">{LOD_LABELS[activeScale].name}</strong>
                </div>
                <div>
                  <span className="text-[#8A8F9A]">Physics Domain: </span>
                  <strong className="text-[#F59E0B] uppercase">{getPhysicsDomainForTwin().replace('_', ' ')}</strong>
                </div>
                <div>
                  <span className="text-[#8A8F9A]">Solver Engine: </span>
                  <strong className="text-[#34D399]">NVIDIA Warp PDE / Modulus</strong>
                </div>
                <div>
                  <span className="text-[#8A8F9A]">Mesh Resolution: </span>
                  <strong className="text-[#E6E4DF]">{activeScale === 4 ? "512x512 Micro-Grid" : "128³ Finite Volume"}</strong>
                </div>
                <div>
                  <span className="text-[#8A8F9A]">Convergence Tol: </span>
                  <strong className="text-[#A78BFA]">1.0 × 10⁻⁵ (L2 norm)</strong>
                </div>
              </div>
            </div>

            {/* Execution Trigger */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-[#8A8F9A]">
                Execution generates cryptographic Compute Receipt before state promotion.
              </span>
              <button
                onClick={handleExecuteNvidiaCompute}
                disabled={isExecutingCompute}
                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isExecutingCompute ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>Executing CUDA Kernels...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>EXECUTE ON NVIDIA ACCELERATION RAIL</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Compute Receipt Result Card */}
            {lastComputeResult && (
              <div className={`border rounded-lg p-4 space-y-3.5 ${
                lastComputeResult.convergenceStatus 
                  ? "bg-[#0D1017] border-emerald-500/50 shadow-lg shadow-emerald-950/20" 
                  : "bg-[#160B0D] border-red-500/60 shadow-lg shadow-red-950/30"
              }`}>
                {/* Receipt Status & Epistemic Verification Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#2A2024]">
                  <div className="flex items-center space-x-2">
                    {lastComputeResult.convergenceStatus ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    )}
                    <div>
                      <div className="flex items-center space-x-2">
                        <strong className={`text-xs font-bold uppercase tracking-wider ${
                          lastComputeResult.convergenceStatus ? "text-emerald-300" : "text-red-400"
                        }`}>
                          {lastComputeResult.convergenceStatus 
                            ? "STATUS: CONVERGED · VERIFIED RECEIPT" 
                            : "STATUS: NOT CONVERGED / RECEIPT UNVERIFIED"}
                        </strong>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold border ${
                          lastComputeResult.convergenceStatus
                            ? "bg-emerald-950 text-emerald-300 border-emerald-500/50"
                            : "bg-red-950 text-red-300 border-red-500/50"
                        }`}>
                          {lastComputeResult.convergenceStatus ? "TOLERANCE MET" : "HOLD · CONVERGENCE CLAIM CONFLICT"}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#A0A4AB] block mt-0.5 font-mono">
                        Provider Job: {lastComputeResult.providerJobId} · Rail: {lastComputeResult.computeReceipt.rail}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] text-[#8A8F9A] block uppercase font-bold">Stopping Criterion</span>
                    <span className={`text-[10px] font-bold ${
                      lastComputeResult.convergenceStatus ? "text-emerald-400" : "text-amber-400"
                    }`}>
                      {lastComputeResult.stoppingCriterion} ({lastComputeResult.iterationsExecuted} iters)
                    </span>
                  </div>
                </div>

                {/* Mathematical Inequality & Tolerance Ratio Box */}
                <div className={`p-3 rounded-lg border text-[11px] font-mono space-y-2 ${
                  lastComputeResult.convergenceStatus 
                    ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-200" 
                    : "bg-red-950/40 border-red-500/40 text-red-200"
                }`}>
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold border-b border-white/10 pb-1.5">
                    <span>Mathematical Convergence Contract:</span>
                    <span className="font-mono">
                      {lastComputeResult.finalResidual.toExponential(2)} {lastComputeResult.convergenceStatus ? "≤" : ">"} {lastComputeResult.requestedTolerance.toExponential(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
                    <div className="bg-[#111317]/80 p-2 rounded border border-white/10">
                      <span className="text-[#8A8F9A] block text-[8px] uppercase">Requested Tolerance</span>
                      <strong className="text-[#E6E4DF] text-xs">{lastComputeResult.requestedTolerance.toExponential(2)}</strong>
                    </div>
                    <div className="bg-[#111317]/80 p-2 rounded border border-white/10">
                      <span className="text-[#8A8F9A] block text-[8px] uppercase">Final Residual (|f(x)| L2)</span>
                      <strong className={`text-xs font-bold ${lastComputeResult.convergenceStatus ? "text-emerald-400" : "text-red-400"}`}>
                        {lastComputeResult.finalResidual.toExponential(2)}
                      </strong>
                    </div>
                    <div className="bg-[#111317]/80 p-2 rounded border border-white/10">
                      <span className="text-[#8A8F9A] block text-[8px] uppercase">Tolerance Ratio</span>
                      <strong className={`text-xs font-bold ${lastComputeResult.convergenceStatus ? "text-emerald-400" : "text-red-400"}`}>
                        {lastComputeResult.toleranceRatio}× {lastComputeResult.convergenceStatus ? "(Within limit)" : "above limit"}
                      </strong>
                    </div>
                  </div>

                  {!lastComputeResult.convergenceStatus && (
                    <div className="text-[10px] text-red-300/90 pt-1 leading-relaxed">
                      <strong>Epistemic Law:</strong> Since {lastComputeResult.finalResidual.toExponential(2)} &gt; {lastComputeResult.requestedTolerance.toExponential(2)}, the run has not converged. The run is classified as <code>COMPUTE-CLAIMED / VALIDATION FAILED / HOLD</code>. Promotion into canonical twin state is blocked without explicit Sovereign Operator override rationale.
                    </div>
                  )}
                </div>

                {/* Epistemic Routing Path */}
                <div className="bg-[#12141A] p-2.5 rounded border border-[#2B303C] text-[10px] font-mono flex flex-wrap items-center gap-1.5 text-[#A0A4AB]">
                  <span className="text-[#8A8F9A] font-bold uppercase">Routing:</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#181A20] text-[#E6E4DF] border border-[#2B303C]">COMPUTE RECEIPT</span>
                  <span className="text-[#8A8F9A]">→</span>
                  <span className={`px-1.5 py-0.5 rounded font-bold border ${
                    lastComputeResult.convergenceStatus 
                      ? "bg-emerald-950 text-emerald-300 border-emerald-500/40" 
                      : "bg-red-950 text-red-400 border-red-500/40"
                  }`}>
                    {lastComputeResult.epistemicRoute}
                  </span>
                  <span className="text-[#8A8F9A]">→</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#181A20] text-[#E6E4DF] border border-[#2B303C]">
                    {lastComputeResult.convergenceStatus ? "CONVERGENCE VERIFIED" : "CONVERGENCE CLAIM CONFLICT"}
                  </span>
                  <span className="text-[#8A8F9A]">→</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#181A20] text-[#E6E4DF] border border-[#2B303C]">
                    {lastComputeResult.convergenceStatus ? "READY FOR CANONICAL PROMOTION" : "NO CANONICAL PROMOTION"}
                  </span>
                </div>

                {/* High-Fidelity Execution & Hardware Attestation Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="bg-[#181A20] p-2.5 rounded border border-[#2A2E39] space-y-1">
                    <span className="text-[#C5A059] font-bold block uppercase text-[9px]">Solver & Hardware Execution:</span>
                    <div>Framework: <strong className="text-[#E6E4DF]">{lastComputeResult.solverFramework} {lastComputeResult.solverVersion}</strong></div>
                    <div>Hardware: <strong className="text-[#38BDF8]">{lastComputeResult.hardwareReportedByProvider}</strong></div>
                    <div>Mesh Shape: <strong className="text-[#A78BFA]">[{lastComputeResult.meshShape.join(', ')}]</strong> (3D Field)</div>
                    <div className="text-[9px] text-[#737885] truncate">Artifact: {lastComputeResult.fieldArtifactReference}</div>
                  </div>

                  <div className="bg-[#181A20] p-2.5 rounded border border-[#2A2E39] space-y-1">
                    <span className="text-[#C5A059] font-bold block uppercase text-[9px]">Execution Profiling (Timing):</span>
                    <div className="flex justify-between text-[#A0A4AB]">
                      <span>Remote Round-Trip:</span>
                      <strong className="text-[#E6E4DF]">{lastComputeResult.executionBreakdown.remoteRoundTripTimeMs} ms</strong>
                    </div>
                    <div className="flex justify-between text-[#A0A4AB]">
                      <span>Queue Latency:</span>
                      <strong className="text-[#E6E4DF]">{lastComputeResult.executionBreakdown.queueTimeMs} ms</strong>
                    </div>
                    <div className="flex justify-between text-[#A0A4AB]">
                      <span>GPU Kernel Time:</span>
                      <strong className="text-[#34D399] font-bold">{lastComputeResult.executionBreakdown.kernelTimeMs} ms</strong>
                    </div>
                    <div className="flex justify-between text-[#A0A4AB]">
                      <span>Total Wall Time:</span>
                      <strong className="text-[#E6E4DF]">{lastComputeResult.executionBreakdown.wallTimeMs} ms</strong>
                    </div>
                  </div>
                </div>

                {/* Canonical 64-Character SHA-256 Hashes & Cryptographic Attestation */}
                <div className="bg-[#101216] p-3 rounded border border-[#262B35] space-y-2 text-[10px] font-mono">
                  <div className="flex items-center justify-between text-[9px] text-[#C5A059] uppercase font-bold border-b border-[#22252D] pb-1">
                    <span>Canonical 64-Hex SHA-256 Hashes & Attestation:</span>
                    <span className="text-[#34D399]">TPM 2.0 Signed</span>
                  </div>

                  <div className="space-y-1">
                    <div>
                      <span className="text-[#8A8F9A] block text-[9px]">INPUT MANIFEST HASH (64-HEX):</span>
                      <code className="text-[#38BDF8] text-[9px] break-all select-all font-mono block bg-[#181A20] p-1 rounded border border-[#2B303C]">
                        {lastComputeResult.inputManifestHash}
                      </code>
                    </div>

                    <div>
                      <span className="text-[#8A8F9A] block text-[9px]">RAW OUTPUT HASH (64-HEX):</span>
                      <code className="text-[#A78BFA] text-[9px] break-all select-all font-mono block bg-[#181A20] p-1 rounded border border-[#2B303C]">
                        {lastComputeResult.rawOutputHash}
                      </code>
                    </div>

                    <div>
                      <span className="text-[#8A8F9A] block text-[9px]">IMMUTABLE RECEIPT DIGEST HASH (64-HEX):</span>
                      <code className="text-[#C5A059] text-[9px] break-all select-all font-mono block bg-[#181A20] p-1 rounded border border-[#2B303C]">
                        {lastComputeResult.receiptHash}
                      </code>
                    </div>
                  </div>

                  <div className="text-[8px] text-[#737885] pt-1 flex flex-wrap justify-between border-t border-[#22252D]">
                    <span>CA: {lastComputeResult.providerSignatureOrVerifiableAttestation.signer}</span>
                    <span>Sig: {lastComputeResult.providerSignatureOrVerifiableAttestation.signature.slice(0, 36)}...</span>
                  </div>
                </div>

                {/* Doctrine Reminder */}
                <div className="p-2.5 rounded bg-[#181A20] border border-[#262B35] text-[10px] text-[#A0A4AB] italic leading-tight text-center">
                  "Acceleration does not create authority. Presentation does not create evidence. The Operator reads the residual."
                </div>

                {/* Sovereign Operator Authority Promotion & Gate Controls */}
                <div className="pt-2 border-t border-[#262B35] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-[10px] text-[#A0A4AB] leading-tight">
                      <strong className="text-[#E6E4DF]">Sovereign Operator Authority:</strong>
                      {lastComputeResult.convergenceStatus ? (
                        <span className="text-emerald-400 block mt-0.5">Verified solver receipt met convergence limit. Ready for promotion to canonical twin state.</span>
                      ) : (
                        <span className="text-red-400 block mt-0.5">Residual exceeds tolerance (3.10× limit). Canonical promotion is blocked under HOLD doctrine.</span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {/* Action 1: Route to HOLD */}
                      <button
                        onClick={handleRouteToHold}
                        className="px-3 py-2 rounded-lg bg-[#2A1719] hover:bg-[#3D2024] text-red-300 border border-red-500/40 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                        title="Route compute receipt to HOLD and log non-convergence into audit ledger"
                      >
                        <Shield className="w-3.5 h-3.5 text-red-400" />
                        <span>ROUTE TO HOLD</span>
                      </button>

                      {/* Action 2: Standard Promotion (Disabled if non-converged) */}
                      {lastComputeResult.convergenceStatus ? (
                        <button
                          onClick={() => handlePromoteSolverResult(false)}
                          className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-emerald-950/50"
                        >
                          <Check className="w-4 h-4" />
                          <span>AUTHORIZE & PROMOTE RECEIPT</span>
                        </button>
                      ) : (
                        <div className="relative group">
                          <button
                            disabled={true}
                            className="px-4 py-2 rounded-lg bg-gray-800 text-gray-500 border border-gray-700 font-bold text-xs flex items-center justify-center space-x-1.5 cursor-not-allowed opacity-60"
                          >
                            <X className="w-4 h-4 text-red-500" />
                            <span>PROMOTION BLOCKED (NON-CONVERGED)</span>
                          </button>
                          <div className="absolute bottom-full right-0 mb-1 hidden group-hover:block bg-black/95 text-red-300 text-[9px] p-2 rounded border border-red-500/40 w-64 shadow-xl pointer-events-none z-50 font-mono">
                            Epistemic gate active: Cannot promote non-converged state (3.10e-5 &gt; 1.00e-5). Use Sovereign Override if manual justification is required.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sovereign Operator Emergency Override Section (When non-converged) */}
                  {!lastComputeResult.convergenceStatus && (
                    <div className="pt-2 border-t border-[#2A2024] space-y-2">
                      {!showOverrideInput ? (
                        <div className="flex justify-end">
                          <button
                            onClick={() => setShowOverrideInput(true)}
                            className="text-[10px] text-[#A0A4AB] hover:text-[#E6E4DF] underline cursor-pointer"
                          >
                            Enter Sovereign Operator Manual Override Rationale...
                          </button>
                        </div>
                      ) : (
                        <div className="bg-[#1C1215] p-3 rounded-lg border border-amber-500/40 space-y-2 font-mono text-xs">
                          <div className="flex justify-between items-center text-[10px] text-amber-400 font-bold">
                            <span>MANDATORY SOVEREIGN OVERRIDE JUSTIFICATION:</span>
                            <button onClick={() => setShowOverrideInput(false)} className="text-[#8A8F9A] hover:text-white">Cancel</button>
                          </div>
                          <p className="text-[9px] text-[#A0A4AB]">
                            Documenting why this non-converged compute state is promoted into canonical twin memory. This justification is permanently logged to the immutable audit ledger.
                          </p>
                          <textarea
                            value={operatorOverrideRationale ?? ""}
                            onChange={(e) => setOperatorOverrideRationale(e.target.value)}
                            placeholder="e.g., Authorized exploratory boundary analysis under transient conditions; known asymptotic behavior acceptable for initial thermal envelope..."
                            className="w-full bg-[#111317] border border-[#3A2A2E] rounded p-2 text-xs text-[#E6E4DF] focus:outline-none focus:border-amber-400 font-mono"
                            rows={2}
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={() => handlePromoteSolverResult(true)}
                              disabled={operatorOverrideRationale.trim().length < 10}
                              className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs disabled:opacity-40 cursor-pointer"
                            >
                              Commit Override to Ledger & Promote
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
