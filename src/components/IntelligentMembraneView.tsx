import React, { useState } from "react";
import {
  Shield,
  Activity,
  Zap,
  Layers,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Radio,
  FileText,
  Sliders,
  Crosshair,
  Lock,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Info,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { DigitalTwin } from "../types";
import { AttentionGateConsole } from "./AttentionGateConsole";
import { ActiveMembraneSurfaceView } from "./ActiveMembraneSurfaceView";

interface IntelligentMembraneViewProps {
  twin: DigitalTwin;
  onNavigateToTab?: (tab: any) => void;
}

type ScaleKey = "electronic" | "network" | "coating" | "wearable";

export function IntelligentMembraneView({ twin, onNavigateToTab }: IntelligentMembraneViewProps) {
  const [subView, setSubView] = useState<"architecture_canvas" | "attention_gate" | "active_decision_surface">("architecture_canvas");
  const [selectedScale, setSelectedScale] = useState<ScaleKey>("wearable");
  const [simImpactX, setSimImpactX] = useState<number>(4);
  const [simImpactY, setSimImpactY] = useState<number>(3);
  const [projectileVelocity, setProjectileVelocity] = useState<number>(720); // m/s
  const [isStriking, setIsStriking] = useState<boolean>(false);
  const [hasStruck, setHasStruck] = useState<boolean>(true);
  const [activeSurrogateTab, setActiveSurrogateTab] = useState<"comparison" | "gates">("comparison");

  // Generate 8x8 sensor nodes
  const nodes = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const dist = Math.sqrt(Math.pow(r - simImpactY, 2) + Math.pow(c - simImpactX, 2));
      let strain = 0;
      let impedanceDelta = 0;
      let status = "nominal";

      if (hasStruck) {
        if (dist < 0.8) {
          strain = 3.8;
          impedanceDelta = -42.5;
          status = "fracture_delamination";
        } else if (dist < 2.0) {
          strain = 1.6;
          impedanceDelta = -21.0;
          status = "shockwave_compression";
        } else if (dist < 3.8) {
          strain = 0.45;
          impedanceDelta = -6.2;
          status = "elastic_deflection";
        }
      }

      nodes.push({ r, c, dist, strain, impedanceDelta, status });
    }
  }

  const handleSimulateStrike = (r: number, c: number) => {
    setSimImpactY(r);
    setSimImpactX(c);
    setIsStriking(true);
    setTimeout(() => {
      setIsStriking(false);
      setHasStruck(true);
    }, 400);
  };

  const calculatedIntegrity = hasStruck
    ? Math.max(0.72, 1.0 - (projectileVelocity / 950) * 0.28).toFixed(2)
    : "1.00";

  return (
    <div className="space-y-8">
      {/* Sovereign Intent & Doctrine Header */}
      <div className="bg-[#13151A] border border-[#2B303C] rounded-lg p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-4xl">
            <div className="flex items-center space-x-2.5">
              <span className="bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded tracking-wider uppercase">
                PATHFINDER DIGITAL TWIN ARCHITECTURE
              </span>
              <span className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                EVIDENCE-GATED
              </span>
              <span className="bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                4-SCALE NERVOUS SYSTEM
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-[#E6E4DF]">
              Intelligent Protective Membrane
            </h2>

            <p className="text-sm text-[#A0A4AB] leading-relaxed">
              Translates the unusually dense electronic topology of reference multi-bond complexes (e.g. Co–U–Co) into a functional, self-reporting 
              <strong className="text-[#E6E4DF]"> “nervous system”</strong> embedded within protective armor. 
              Screens safe, non-actinide <strong className="text-[#509EE3]">Tungsten/Molybdenum</strong> and <strong className="text-[#4ADE80]">Hafnium/Zirconium</strong> molecular networks for distributed strain telemetry, blind crack detection, and in-situ delamination alerts.
            </p>
          </div>

          <div className="bg-[#181A20] border border-[#2A2E39] rounded-lg p-4 font-mono text-xs text-right shrink-0 lg:max-w-xs space-y-2">
            <div className="flex flex-wrap justify-end gap-1 bg-[#13151A] p-1 rounded border border-[#262A35]">
              <button
                type="button"
                onClick={() => setSubView("architecture_canvas")}
                className={`px-2 py-1 rounded text-[10px] sm:text-[11px] transition-colors cursor-pointer ${
                  subView === "architecture_canvas"
                    ? "bg-[#509EE3] text-[#0D0E11] font-bold"
                    : "text-[#8A8F9A] hover:text-[#E6E4DF]"
                }`}
              >
                4-Scale Fabric
              </button>
              <button
                type="button"
                onClick={() => setSubView("attention_gate")}
                className={`px-2 py-1 rounded text-[10px] sm:text-[11px] transition-colors cursor-pointer ${
                  subView === "attention_gate"
                    ? "bg-[#C5A059] text-[#0D0E11] font-bold"
                    : "text-[#8A8F9A] hover:text-[#E6E4DF]"
                }`}
              >
                signalToNoise()
              </button>
              <button
                type="button"
                onClick={() => setSubView("active_decision_surface")}
                className={`px-2 py-1 rounded text-[10px] sm:text-[11px] transition-colors cursor-pointer ${
                  subView === "active_decision_surface"
                    ? "bg-[#10B981] text-[#0D0E11] font-bold"
                    : "text-[#8A8F9A] hover:text-[#E6E4DF]"
                }`}
              >
                Active Surface (5-Layer)
              </button>
            </div>
            <span className="text-[10px] text-[#C5A059] font-bold block uppercase tracking-wider">
              GOVERNING PRINCIPLE
            </span>
            <p className="text-[11px] text-[#8A8F9A] italic leading-snug">
              “The membrane no longer merely separates two environments. It interprets the boundary between them.”
            </p>
          </div>
        </div>
      </div>

      {/* Render Subviews */}
      {subView === "active_decision_surface" ? (
        <ActiveMembraneSurfaceView twinId={twin.id} />
      ) : subView === "attention_gate" ? (
        <AttentionGateConsole twinId={twin.id} />
      ) : (
        <>
          {/* 4-Scale Architecture Explorer */}
      <div className="bg-[#13151A] border border-[#22262F] rounded-lg p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#22262F] gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-[#509EE3]/10 border border-[#509EE3]/30 flex items-center justify-center text-[#509EE3]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#8A8F9A] font-bold tracking-wider">
                HIERARCHICAL DOMAIN COUPLING
              </span>
              <h3 className="text-base font-semibold text-[#E6E4DF]">
                The 4 Progressive Engineering Scales
              </h3>
            </div>
          </div>

          {/* Scale Switcher Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-[#181A20] p-1 rounded border border-[#2A2E39] font-mono text-xs">
            <button
              onClick={() => setSelectedScale("electronic")}
              className={`px-3 py-1.5 rounded text-left transition-all ${
                selectedScale === "electronic"
                  ? "bg-[#509EE3] text-[#0D0E11] font-bold shadow"
                  : "text-[#8A8F9A] hover:text-[#E6E4DF]"
              }`}
            >
              1. Electronic
            </button>
            <button
              onClick={() => setSelectedScale("network")}
              className={`px-3 py-1.5 rounded text-left transition-all ${
                selectedScale === "network"
                  ? "bg-[#509EE3] text-[#0D0E11] font-bold shadow"
                  : "text-[#8A8F9A] hover:text-[#E6E4DF]"
              }`}
            >
              2. Molecular Network
            </button>
            <button
              onClick={() => setSelectedScale("coating")}
              className={`px-3 py-1.5 rounded text-left transition-all ${
                selectedScale === "coating"
                  ? "bg-[#509EE3] text-[#0D0E11] font-bold shadow"
                  : "text-[#8A8F9A] hover:text-[#E6E4DF]"
              }`}
            >
              3. Functional Coating
            </button>
            <button
              onClick={() => setSelectedScale("wearable")}
              className={`px-3 py-1.5 rounded text-left transition-all ${
                selectedScale === "wearable"
                  ? "bg-[#509EE3] text-[#0D0E11] font-bold shadow"
                  : "text-[#8A8F9A] hover:text-[#E6E4DF]"
              }`}
            >
              4. Wearable System
            </button>
          </div>
        </div>

        {/* Selected Scale Detail Card */}
        {selectedScale === "electronic" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn">
            <div className="md:col-span-2 bg-[#181A20] border border-[#262B35] rounded-lg p-5 space-y-4">
              <div className="flex items-center space-x-2 text-[#509EE3]">
                <Zap className="w-4 h-4" />
                <h4 className="font-mono text-sm font-bold text-[#E6E4DF]">
                  1. Electronic Scale (Quantum Topology & Band Distortion)
                </h4>
              </div>
              <p className="text-xs text-[#A0A4AB] leading-relaxed">
                Investigates directional orbital overlap across σ, π, and δ interactions. Establishes the fundamental physical relationship between mechanical strain, metal–metal bond distortion, and the pre-failure electronic response.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-[#13151A] p-3 rounded border border-[#22262F] font-mono text-xs">
                  <span className="text-[10px] text-[#8A8F9A] block">ORBITAL INTERACTIONS</span>
                  <span className="text-[#E6E4DF] font-bold">σ, π, δ Overlap</span>
                </div>
                <div className="bg-[#13151A] p-3 rounded border border-[#22262F] font-mono text-xs">
                  <span className="text-[10px] text-[#8A8F9A] block">REDOX GAUGE FACTOR</span>
                  <span className="text-[#4ADE80] font-bold">14.8 @ 1% Strain</span>
                </div>
                <div className="bg-[#13151A] p-3 rounded border border-[#22262F] font-mono text-xs">
                  <span className="text-[10px] text-[#8A8F9A] block">ELECTRONIC PRECURSOR</span>
                  <span className="text-[#EAB308] font-bold">45 μs Lead Time</span>
                </div>
              </div>
            </div>

            <div className="bg-[#181A20] border border-[#262B35] rounded-lg p-5 space-y-3 font-mono text-xs">
              <span className="text-[11px] text-[#509EE3] font-bold block uppercase">KEY INVESTIGATION VECTORS</span>
              <ul className="space-y-2 text-[#8A8F9A] text-[11px]">
                <li className="flex items-start space-x-2">
                  <ChevronRight className="w-3.5 h-3.5 text-[#509EE3] shrink-0 mt-0.5" />
                  <span>Directional orbital delocalisation under axial & shear strain</span>
                </li>
                <li className="flex items-start space-x-2">
                  <ChevronRight className="w-3.5 h-3.5 text-[#509EE3] shrink-0 mt-0.5" />
                  <span>Redox-state shifts accompanying atomic coordinate displacement</span>
                </li>
                <li className="flex items-start space-x-2">
                  <ChevronRight className="w-3.5 h-3.5 text-[#509EE3] shrink-0 mt-0.5" />
                  <span>Electronic resistance change preceding physical bond rupture</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {selectedScale === "network" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn">
            <div className="md:col-span-2 bg-[#181A20] border border-[#262B35] rounded-lg p-5 space-y-4">
              <div className="flex items-center space-x-2 text-[#4ADE80]">
                <Layers className="w-4 h-4" />
                <h4 className="font-mono text-sm font-bold text-[#E6E4DF]">
                  2. Molecular-Network Scale (MOF, COF & Polymer Integration)
                </h4>
              </div>
              <p className="text-xs text-[#A0A4AB] leading-relaxed">
                Anchors deformation-sensitive molecular motifs into 2D Covalent Organic Frameworks (COFs), Metal-Organic Frameworks (MOFs), and flexible polymer backbones. Verifies signal survival under cyclic fatigue and environmental exposure (O2, moisture, thermal cycling).
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-[#13151A] p-3 rounded border border-[#22262F] font-mono text-xs">
                  <span className="text-[10px] text-[#8A8F9A] block">SCAFFOLD TOPOLOGY</span>
                  <span className="text-[#E6E4DF] font-bold">2D COF-606 (2.4nm)</span>
                </div>
                <div className="bg-[#13151A] p-3 rounded border border-[#22262F] font-mono text-xs">
                  <span className="text-[10px] text-[#8A8F9A] block">CYCLIC ENDURANCE</span>
                  <span className="text-[#4ADE80] font-bold">&gt;10,000 Cycles</span>
                </div>
                <div className="bg-[#13151A] p-3 rounded border border-[#22262F] font-mono text-xs">
                  <span className="text-[10px] text-[#8A8F9A] block">O2/MOISTURE BARRIER</span>
                  <span className="text-[#10B981] font-bold">PASS (500h 85/85)</span>
                </div>
              </div>
            </div>

            <div className="bg-[#181A20] border border-[#262B35] rounded-lg p-5 space-y-3 font-mono text-xs">
              <span className="text-[11px] text-[#4ADE80] font-bold block uppercase">KEY INVESTIGATION VECTORS</span>
              <ul className="space-y-2 text-[#8A8F9A] text-[11px]">
                <li className="flex items-start space-x-2">
                  <ChevronRight className="w-3.5 h-3.5 text-[#4ADE80] shrink-0 mt-0.5" />
                  <span>Polymer & substrate covalent surface grafting density</span>
                </li>
                <li className="flex items-start space-x-2">
                  <ChevronRight className="w-3.5 h-3.5 text-[#4ADE80] shrink-0 mt-0.5" />
                  <span>Inter-motif charge transport across conjugated 2D sheets</span>
                </li>
                <li className="flex items-start space-x-2">
                  <ChevronRight className="w-3.5 h-3.5 text-[#4ADE80] shrink-0 mt-0.5" />
                  <span>Mechanical compliance without scaffold delamination</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {selectedScale === "coating" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn">
            <div className="md:col-span-2 bg-[#181A20] border border-[#262B35] rounded-lg p-5 space-y-4">
              <div className="flex items-center space-x-2 text-[#EAB308]">
                <Activity className="w-4 h-4" />
                <h4 className="font-mono text-sm font-bold text-[#E6E4DF]">
                  3. Functional-Coating Scale (Piezoresistive & Impedance Matrix)
                </h4>
              </div>
              <p className="text-xs text-[#A0A4AB] leading-relaxed">
                Transforms the molecular network into a macroscopic sensing coating. Provides spatially resolved strain fields, blind internal delamination mapping, and high-frequency AC impedance spectroscopy to pinpoint damage in real-time.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-[#13151A] p-3 rounded border border-[#22262F] font-mono text-xs">
                  <span className="text-[10px] text-[#8A8F9A] block">NODE MATRIX</span>
                  <span className="text-[#E6E4DF] font-bold">64-Node (8x8 Array)</span>
                </div>
                <div className="bg-[#13151A] p-3 rounded border border-[#22262F] font-mono text-xs">
                  <span className="text-[10px] text-[#8A8F9A] block">SPATIAL RESOLUTION</span>
                  <span className="text-[#4ADE80] font-bold">1.8 mm Precision</span>
                </div>
                <div className="bg-[#13151A] p-3 rounded border border-[#22262F] font-mono text-xs">
                  <span className="text-[10px] text-[#8A8F9A] block">BLIND DELAMINATION</span>
                  <span className="text-[#EAB308] font-bold">&gt;0.4 mm² Detection</span>
                </div>
              </div>
            </div>

            <div className="bg-[#181A20] border border-[#262B35] rounded-lg p-5 space-y-3 font-mono text-xs">
              <span className="text-[11px] text-[#EAB308] font-bold block uppercase">KEY INVESTIGATION VECTORS</span>
              <ul className="space-y-2 text-[#8A8F9A] text-[11px]">
                <li className="flex items-start space-x-2">
                  <ChevronRight className="w-3.5 h-3.5 text-[#EAB308] shrink-0 mt-0.5" />
                  <span>Spatially resolved AC impedance spectroscopy (100 Hz – 1 MHz)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <ChevronRight className="w-3.5 h-3.5 text-[#EAB308] shrink-0 mt-0.5" />
                  <span>Signal drift compensation & thermal hysteresis decoupling</span>
                </li>
                <li className="flex items-start space-x-2">
                  <ChevronRight className="w-3.5 h-3.5 text-[#EAB308] shrink-0 mt-0.5" />
                  <span>Coating adhesion, flexibility, and shear fatigue resistance</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {selectedScale === "wearable" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn">
            <div className="md:col-span-2 bg-[#181A20] border border-[#262B35] rounded-lg p-5 space-y-4">
              <div className="flex items-center space-x-2 text-[#C5A059]">
                <Shield className="w-4 h-4" />
                <h4 className="font-mono text-sm font-bold text-[#E6E4DF]">
                  4. Wearable-System Scale (Multi-Layer Protective Laminate)
                </h4>
              </div>
              <p className="text-xs text-[#A0A4AB] leading-relaxed">
                Full integration into multi-layer ballistic and impact armor (SiC Ceramic strike face + Aramid backing). Reconstructs projectile impact telemetry, calculates residual integrity, and enforces strict non-toxic material containment.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-[#13151A] p-3 rounded border border-[#22262F] font-mono text-xs">
                  <span className="text-[10px] text-[#8A8F9A] block">ARMOR LAMINATE</span>
                  <span className="text-[#E6E4DF] font-bold">SiC + Kevlar-29</span>
                </div>
                <div className="bg-[#13151A] p-3 rounded border border-[#22262F] font-mono text-xs">
                  <span className="text-[10px] text-[#8A8F9A] block">TELEMETRY LATENCY</span>
                  <span className="text-[#4ADE80] font-bold">12 μs Response</span>
                </div>
                <div className="bg-[#13151A] p-3 rounded border border-[#22262F] font-mono text-xs">
                  <span className="text-[10px] text-[#8A8F9A] block">RESIDUAL HEALTH</span>
                  <span className="text-[#C5A059] font-bold">{calculatedIntegrity} Index</span>
                </div>
              </div>
            </div>

            <div className="bg-[#181A20] border border-[#262B35] rounded-lg p-5 space-y-3 font-mono text-xs">
              <span className="text-[11px] text-[#C5A059] font-bold block uppercase">KEY INVESTIGATION VECTORS</span>
              <ul className="space-y-2 text-[#8A8F9A] text-[11px]">
                <li className="flex items-start space-x-2">
                  <ChevronRight className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>Real-time impact load, yaw, and energy dissipation telemetry</span>
                </li>
                <li className="flex items-start space-x-2">
                  <ChevronRight className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>Multi-layer ceramic/aramid sensor fusion & delamination alert</span>
                </li>
                <li className="flex items-start space-x-2">
                  <ChevronRight className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>Thermal comfort, electrical safety, and zero cytotoxic exposure</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Ballistic Strike & 64-Node Sensor Telemetry Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sensor Matrix Display */}
        <div className="lg:col-span-7 bg-[#13151A] border border-[#22262F] rounded-lg p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#22262F]">
            <div className="flex items-center space-x-2.5">
              <Crosshair className="w-4 h-4 text-[#509EE3]" />
              <span className="text-xs font-mono font-bold text-[#E6E4DF] uppercase">
                64-Node Distributed Sensor Matrix (8x8 Grid)
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#8A8F9A]">
              Click any node to simulate kinetic strike
            </span>
          </div>

          {/* 8x8 Grid Visualizer */}
          <div className="relative bg-[#0D0E11] border border-[#22252D] rounded-lg p-4 flex items-center justify-center">
            <div className="grid grid-cols-8 gap-2 w-full max-w-[420px] aspect-square">
              {nodes.map((n, idx) => {
                const isCentroid = n.r === simImpactY && n.c === simImpactX;
                let bgStyle = "bg-[#181A20] border-[#2A2E39] text-[#737885]";
                
                if (hasStruck) {
                  if (n.status === "fracture_delamination") {
                    bgStyle = "bg-[#EF4444]/30 border-[#EF4444] text-[#EF4444] animate-pulse";
                  } else if (n.status === "shockwave_compression") {
                    bgStyle = "bg-[#EAB308]/20 border-[#EAB308]/60 text-[#EAB308]";
                  } else if (n.status === "elastic_deflection") {
                    bgStyle = "bg-[#3B82F6]/15 border-[#3B82F6]/40 text-[#509EE3]";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSimulateStrike(n.r, n.c)}
                    className={`rounded border flex flex-col items-center justify-center p-1 font-mono text-[9px] transition-all cursor-pointer hover:scale-105 ${bgStyle} ${
                      isCentroid ? "ring-2 ring-[#EF4444] shadow-lg shadow-[#EF4444]/30" : ""
                    }`}
                  >
                    <span className="font-bold">{n.r},{n.c}</span>
                    {hasStruck && n.strain > 0 ? (
                      <span className="text-[7px] leading-tight">
                        {n.impedanceDelta.toFixed(0)}%
                      </span>
                    ) : (
                      <span className="text-[7px] text-[#4ADE80]">0.0%</span>
                    )}
                  </button>
                );
              })}
            </div>

            {isStriking && (
              <div className="absolute inset-0 bg-[#EF4444]/20 backdrop-blur-xs flex items-center justify-center rounded-lg animate-pulse">
                <span className="bg-[#EF4444] text-black font-mono font-bold text-xs px-3 py-1 rounded shadow">
                  RECONSTRUCTING STRAIN WAVEFRONT...
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-[#8A8F9A] pt-2 border-t border-[#22262F] gap-2">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                <span className="text-[10px]">Delamination Zone</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
                <span className="text-[10px]">Shockwave Shear</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                <span className="text-[10px]">Elastic Field</span>
              </span>
            </div>
            <span>Array Sampling: <strong className="text-[#E6E4DF]">100 kHz</strong></span>
          </div>
        </div>

        {/* Dynamic Telemetry & Impact Controls */}
        <div className="lg:col-span-5 bg-[#13151A] border border-[#22262F] rounded-lg p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#22262F]">
              <span className="text-xs font-mono font-bold text-[#E6E4DF] uppercase flex items-center space-x-2">
                <Activity className="w-4 h-4 text-[#4ADE80]" />
                <span>Live Impact Telemetry</span>
              </span>
              <span className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                SYSTEM ONLINE
              </span>
            </div>

            {/* Velocity Slider */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-[#8A8F9A]">
                <span>PROJECTILE VELOCITY</span>
                <span className="text-[#E6E4DF] font-bold">{projectileVelocity} m/s</span>
              </div>
              <input
                type="range"
                min={300}
                max={950}
                step={10}
                value={projectileVelocity ?? 550}
                onChange={(e) => setProjectileVelocity(Number(e.target.value) || 550)}
                className="w-full accent-[#509EE3] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#737885]">
                <span>300 m/s (Handgun)</span>
                <span>720 m/s (Rifle)</span>
                <span>950 m/s (AP Ballistic)</span>
              </div>
            </div>

            {/* Reconstructed Telemetry Cards */}
            <div className="grid grid-cols-2 gap-2.5 font-mono text-xs pt-1">
              <div className="bg-[#181A20] p-3 rounded border border-[#262B35] space-y-1">
                <span className="text-[10px] text-[#8A8F9A] block">IMPACT CENTROID</span>
                <span className="text-[#E6E4DF] font-bold text-sm">
                  Node [{simImpactY}, {simImpactX}]
                </span>
                <span className="text-[10px] text-[#4ADE80] block">±1.4 mm accuracy</span>
              </div>

              <div className="bg-[#181A20] p-3 rounded border border-[#262B35] space-y-1">
                <span className="text-[10px] text-[#8A8F9A] block">TELEMETRY LATENCY</span>
                <span className="text-[#509EE3] font-bold text-sm">11.8 μs</span>
                <span className="text-[10px] text-[#8A8F9A] block">100 kHz Bus</span>
              </div>

              <div className="bg-[#181A20] p-3 rounded border border-[#262B35] space-y-1">
                <span className="text-[10px] text-[#8A8F9A] block">BLIND DELAMINATION</span>
                <span className="text-[#EF4444] font-bold text-sm">
                  {hasStruck ? "0.72 mm²" : "0.00 mm²"}
                </span>
                <span className="text-[10px] text-[#EF4444] block">
                  {hasStruck ? "ALERT TRIGGERED" : "NOMINAL"}
                </span>
              </div>

              <div className="bg-[#181A20] p-3 rounded border border-[#262B35] space-y-1">
                <span className="text-[10px] text-[#8A8F9A] block">RESIDUAL INTEGRITY</span>
                <span className="text-[#C5A059] font-bold text-sm">
                  {(Number(calculatedIntegrity) * 100).toFixed(0)}%
                </span>
                <span className="text-[10px] text-[#C5A059] block">Laminate Intact</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleSimulateStrike(simImpactY, simImpactX)}
            className="w-full bg-[#509EE3] hover:bg-[#3B82F6] text-[#0D0E11] font-mono text-xs font-bold py-2.5 rounded flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Re-fire Ballistic Impact Simulation</span>
          </button>
        </div>
      </div>

      {/* Non-Actinide Surrogate Screening Matrix */}
      <div className="bg-[#13151A] border border-[#22262F] rounded-lg p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#22262F] gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#8A8F9A] font-bold tracking-wider">
                MATERIAL GOVERNANCE & TOXICOLOGY
              </span>
              <h3 className="text-base font-semibold text-[#E6E4DF]">
                Non-Actinide Substitution Search Space
              </h3>
            </div>
          </div>

          <div className="flex space-x-1.5 bg-[#181A20] p-1 rounded border border-[#2A2E39] font-mono text-xs">
            <button
              onClick={() => setActiveSurrogateTab("comparison")}
              className={`px-3 py-1 rounded transition-colors ${
                activeSurrogateTab === "comparison"
                  ? "bg-[#C5A059] text-black font-bold"
                  : "text-[#8A8F9A] hover:text-[#E6E4DF]"
              }`}
            >
              Substitution Matrix
            </button>
            <button
              onClick={() => setActiveSurrogateTab("gates")}
              className={`px-3 py-1 rounded transition-colors ${
                activeSurrogateTab === "gates"
                  ? "bg-[#C5A059] text-black font-bold"
                  : "text-[#8A8F9A] hover:text-[#E6E4DF]"
              }`}
            >
              Safety & Migration Gates
            </button>
          </div>
        </div>

        {activeSurrogateTab === "comparison" && (
          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#22262F] text-[#8A8F9A] text-[11px] bg-[#181A20]/50">
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4 text-[#E6E4DF]">Co–U–Co Reference</th>
                  <th className="py-3 px-4 text-[#509EE3]">W/Mo Candidates</th>
                  <th className="py-3 px-4 text-[#4ADE80]">Hf/Zr Candidates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#22262F] text-[12px]">
                <tr>
                  <td className="py-3 px-4 font-bold text-[#8A8F9A]">Principal Orbitals</td>
                  <td className="py-3 px-4 text-[#E6E4DF]">Uranium 5f/6d with cobalt 3d</td>
                  <td className="py-3 px-4 text-[#509EE3]">Directional 5d/4d interactions</td>
                  <td className="py-3 px-4 text-[#4ADE80]">Group 4 5d/4d interactions</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#8A8F9A]">Electronic Objective</td>
                  <td className="py-3 px-4 text-[#E6E4DF]">Establish reference delocalisation & distortion response</td>
                  <td className="py-3 px-4 text-[#509EE3]">Prioritise conductivity & redox sensitivity</td>
                  <td className="py-3 px-4 text-[#4ADE80]">Prioritise chemical, environmental & thermal stability</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#8A8F9A]">Principal Limitation</td>
                  <td className="py-3 px-4 text-[#EF4444]">Radioactivity, heavy-metal toxicity & complex handling</td>
                  <td className="py-3 px-4 text-[#EAB308]">Behaviour may not reproduce full 5f/6d actinide overlap</td>
                  <td className="py-3 px-4 text-[#EAB308]">Potentially weaker electronic delocalisation</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#8A8F9A]">Pathfinder Twin Status</td>
                  <td className="py-3 px-4">
                    <span className="bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 px-2 py-0.5 rounded text-[10px] font-bold">
                      Reference Physics Only
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 px-2 py-0.5 rounded text-[10px] font-bold">
                      Screening Candidate (Scale 2-3)
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 px-2 py-0.5 rounded text-[10px] font-bold">
                      Screening Candidate (Scale 2-4)
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeSurrogateTab === "gates" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs animate-fadeIn">
            <div className="bg-[#181A20] p-4 rounded border border-[#10B981]/30 space-y-2">
              <div className="flex items-center space-x-2 text-[#10B981]">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-bold">1. Cytotoxicity & Leaching Gate</span>
              </div>
              <p className="text-[#8A8F9A] text-[11px] leading-relaxed">
                Tested against sweat, saline, and abrasion. Heavy-metal leaching &lt;0.00 ppm; zero cytotoxic migration into skin or atmosphere.
              </p>
              <div className="pt-2 text-[10px] text-[#10B981] font-bold">STATUS: GATE PASSED</div>
            </div>

            <div className="bg-[#181A20] p-4 rounded border border-[#10B981]/30 space-y-2">
              <div className="flex items-center space-x-2 text-[#10B981]">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-bold">2. Environmental Stability Gate</span>
              </div>
              <p className="text-[#8A8F9A] text-[11px] leading-relaxed">
                Hf/Zr coordination network sustains 500 hrs at 85°C / 85% RH and 10,000 bend cycles with &lt;0.02% baseline resistance drift.
              </p>
              <div className="pt-2 text-[10px] text-[#10B981] font-bold">STATUS: GATE PASSED</div>
            </div>

            <div className="bg-[#181A20] p-4 rounded border border-[#EF4444]/40 space-y-2">
              <div className="flex items-center space-x-2 text-[#EF4444]">
                <Lock className="w-4 h-4" />
                <span className="font-bold">3. Actinide Exclusion Gate</span>
              </div>
              <p className="text-[#8A8F9A] text-[11px] leading-relaxed">
                Zero radioactive uranium compounds permitted in physical prototyping or wearable laminates. Reference physics strictly computational.
              </p>
              <div className="pt-2 text-[10px] text-[#EF4444] font-bold">STATUS: STRICTLY ENFORCED</div>
            </div>
          </div>
        )}
      </div>

      {/* Hypothesis Evaluation Pipeline & Evidence-Gated Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hypotheses H1 - H4 */}
        <div className="bg-[#13151A] border border-[#22262F] rounded-lg p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#22262F]">
            <div className="flex items-center space-x-2.5">
              <FileText className="w-4 h-4 text-[#509EE3]" />
              <span className="text-xs font-mono font-bold text-[#E6E4DF] uppercase">
                Hypothesis Evaluation Pipeline
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#8A8F9A]">H1 — H4 Lifecycle</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-[#181A20] p-3.5 rounded border border-[#262B35] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[#509EE3] font-bold">H1 — Electronic Response</span>
                <span className="bg-[#10B981]/10 text-[#10B981] text-[9px] px-2 py-0.5 rounded border border-[#10B981]/30">VERIFIED</span>
              </div>
              <p className="text-[#8A8F9A] text-[11px]">
                Dense metal–metal interactions produce strong, repeatable electronic bandgap compression under controlled deformation.
              </p>
            </div>

            <div className="bg-[#181A20] p-3.5 rounded border border-[#262B35] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[#4ADE80] font-bold">H2 — Network Integration</span>
                <span className="bg-[#10B981]/10 text-[#10B981] text-[9px] px-2 py-0.5 rounded border border-[#10B981]/30">VERIFIED</span>
              </div>
              <p className="text-[#8A8F9A] text-[11px]">
                Molecular motifs anchored in 2D COFs and polymers preserve electronic response across 10,000 cycles without loss of flexibility.
              </p>
            </div>

            <div className="bg-[#181A20] p-3.5 rounded border border-[#262B35] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[#EAB308] font-bold">H3 — Coating Function</span>
                <span className="bg-[#10B981]/10 text-[#10B981] text-[9px] px-2 py-0.5 rounded border border-[#10B981]/30">VERIFIED</span>
              </div>
              <p className="text-[#8A8F9A] text-[11px]">
                64-node coating detects strain, microcracking, and delamination with 1.8 mm spatial accuracy and 45 μs precursor lead time.
              </p>
            </div>

            <div className="bg-[#181A20] p-3.5 rounded border border-[#262B35] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[#C5A059] font-bold">H4 — Wearable-System Value</span>
                <span className="bg-[#10B981]/10 text-[#10B981] text-[9px] px-2 py-0.5 rounded border border-[#10B981]/30">VALIDATED</span>
              </div>
              <p className="text-[#8A8F9A] text-[11px]">
                Laminate integration provides real-time impact telemetry without reducing ballistic protection or adding unacceptable mass (+2.1%).
              </p>
            </div>
          </div>
        </div>

        {/* Evidence-Gated Progression Ladder (1 to 7) */}
        <div className="bg-[#13151A] border border-[#22262F] rounded-lg p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#22262F]">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span className="text-xs font-mono font-bold text-[#E6E4DF] uppercase">
                Evidence-Gated Progression Ladder
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#8A8F9A]">7 Strict Gates</span>
          </div>

          <div className="space-y-2 font-mono text-xs max-h-[340px] overflow-y-auto pr-1">
            {[
              { gate: 1, text: "Reference electronic structure reproduced computationally (DFT 10-bond density)", status: "PASSED" },
              { gate: 2, text: "Surrogate demonstrates deformation-sensitive electronic behaviour (W/Mo GF 14.8)", status: "PASSED" },
              { gate: 3, text: "Molecular behaviour survives environmental and fatigue testing (Hf/Zr 10k cycles)", status: "PASSED" },
              { gate: 4, text: "Network integration preserves a usable signal (2D COF-606 scaffold)", status: "PASSED" },
              { gate: 5, text: "Coating detects blind damage events repeatably (>0.4 mm² delamination)", status: "PASSED" },
              { gate: 6, text: "Laminate integration does not compromise mechanical protection (SiC + Aramid)", status: "PASSED" },
              { gate: 7, text: "Wearable system correctly locates and classifies damage under 720 m/s impact", status: "VALIDATED" }
            ].map((g) => (
              <div
                key={g.gate}
                className="flex items-center justify-between p-2.5 bg-[#181A20] rounded border border-[#262B35]"
              >
                <div className="flex items-center space-x-2.5 pr-2">
                  <span className="w-5 h-5 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center font-bold text-[10px] shrink-0">
                    {g.gate}
                  </span>
                  <span className="text-[11px] text-[#E6E4DF] leading-tight">{g.text}</span>
                </div>
                <span className="text-[9px] bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 px-2 py-0.5 rounded font-bold shrink-0">
                  {g.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
