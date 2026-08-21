import React, { useState, useEffect, useMemo, useRef } from "react";
import { Compass, Shield, Activity, Eye, Play, Sparkles, Network, ArrowRight, HelpCircle, AlertTriangle, Layers, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DigitalTwinModel } from "../types";

interface ThreadGeometryFilterProps {
  activeTwin: DigitalTwinModel;
}

// Coordinate generator helpers
const getPolygonPath = (cx: number, cy: number, sides: number, radius: number, offsetRad: number = 0) => {
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = offsetRad + (i * 2 * Math.PI) / sides;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M ${points.join(" L ")} Z`;
};

const getStarPath = (cx: number, cy: number, points: number, outerRad: number, innerRad: number, offsetRad: number = 0) => {
  const pathParts = [];
  for (let i = 0; i < points * 2; i++) {
    const angle = offsetRad + (i * Math.PI) / points;
    const r = i % 2 === 0 ? outerRad : innerRad;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    pathParts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M ${pathParts.join(" L ")} Z`;
};

export const ThreadGeometryFilter: React.FC<ThreadGeometryFilterProps> = ({ activeTwin }) => {
  // Available Geo-Filters
  const FILTERS = [
    { id: "octagon", label: "1. Octagon", theme: "Boundaries / Governance", color: "#a855f7", border: "border-purple-900/40", text: "text-purple-400", desc: "Exposes system boundary envelope limits, compliance guardrails, and sovereign authorization gates." },
    { id: "square", label: "2. Square", theme: "Structure / Stability", color: "#3b82f6", border: "border-blue-900/40", text: "text-blue-400", desc: "Exposes physical support load paths, material columns, stiffeners, and hard architectural skeletons." },
    { id: "triangle", label: "3. Triangle", theme: "Direction / Intent", color: "#f43f5e", border: "border-rose-900/40", text: "text-rose-400", desc: "Exposes kinetic trajectories, flow vectors, force orientation, and active expansion gradients." },
    { id: "hexagon", label: "4. Hexagon", theme: "Connection / Flow", color: "#22c55e", border: "border-green-900/40", text: "text-green-400", desc: "Exposes mesh connections, coupling matrices, relational links, and flow network graphs." },
    { id: "circle", label: "5. Circle", theme: "State / Totality", color: "#0ea5e9", border: "border-sky-900/40", text: "text-sky-400", desc: "Exposes integrated macro-state, total volume, aggregate homeostasis, and global conservation properties." },
    { id: "pentagon", label: "6. Pentagon", theme: "Adaptation / Change", color: "#eab308", border: "border-yellow-900/40", text: "text-yellow-400", desc: "Exposes mutation thresholds, fault-tolerance rerouting profiles, and kinetic material adaptivity." },
    { id: "heptagon", label: "7. Heptagon", theme: "Time / Sequence", color: "#ec4899", border: "border-pink-900/40", text: "text-pink-400", desc: "Exposes temporal timelines, execution delays, diurnal cycles, and event coordination schemas." },
    { id: "star", label: "8. Star", theme: "Purpose / Meaning", color: "#f97316", border: "border-orange-900/40", text: "text-orange-400", desc: "Exposes structural target targets, design optimization thresholds, and core system teleology." }
  ];

  // Active toggled filters
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({
    octagon: true,
    square: true,
    triangle: false,
    hexagon: true,
    circle: false,
    pentagon: false,
    heptagon: false,
    star: false
  });

  // User input parameters
  const [threadFreq, setThreadFreq] = useState<number>(8); // Hz frequency
  const [bendFactor, setBendFactor] = useState<number>(45); // % Bending force
  const [alignAngle, setAlignAngle] = useState<number>(0); // Deg angle rotation
  const [activeSlice, setActiveSlice] = useState<string>("B"); // Slices A, B, C, D, E
  const [phase, setPhase] = useState<number>(0);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<"shapes" | "sliders">("shapes");

  // Pointer drag controls for the Sovereign Attention Signal Chamber coordinate grid rotation
  const viewportRef = useRef<HTMLDivElement>(null);
  const isDraggingAngle = useRef<boolean>(false);
  const startAngleOffset = useRef<number>(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!viewportRef.current) return;
    isDraggingAngle.current = true;
    try {
      viewportRef.current.setPointerCapture(e.pointerId);
    } catch (err) {
      console.warn("Pointer capture failed:", err);
    }

    const rect = viewportRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dragX = e.clientX - centerX;
    const dragY = e.clientY - centerY;
    let currentDragAngle = Math.atan2(dragY, dragX) * (180 / Math.PI);
    if (isNaN(currentDragAngle)) {
      currentDragAngle = 0;
    }
    
    startAngleOffset.current = currentDragAngle - alignAngle;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingAngle.current || !viewportRef.current) return;

    const rect = viewportRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dragX = e.clientX - centerX;
    const dragY = e.clientY - centerY;
    let currentDragAngle = Math.atan2(dragY, dragX) * (180 / Math.PI);
    if (isNaN(currentDragAngle)) {
      currentDragAngle = 0;
    }
    
    let targetAngle = Math.round(currentDragAngle - startAngleOffset.current);
    if (isNaN(targetAngle)) {
      targetAngle = 0;
    }
    
    // Normalize targetAngle to [-180, 180]
    while (targetAngle > 180) targetAngle -= 360;
    while (targetAngle < -180) targetAngle += 360;

    // Snapping to nearest 5 degrees for physical slider coherence
    const snappedAngle = Math.round(targetAngle / 5) * 5;
    if (!isNaN(snappedAngle)) {
      setAlignAngle(snappedAngle);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingAngle.current && viewportRef.current) {
      isDraggingAngle.current = false;
      try {
        viewportRef.current.releasePointerCapture(e.pointerId);
      } catch (err) {
        console.warn("Release pointer capture failed:", err);
      }
    }
  };

  // Time ticker for thread ripples
  useEffect(() => {
    let animId: number;
    const tick = () => {
      setPhase((prev) => (prev + 0.08) % (Math.PI * 2));
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectAll = (val: boolean) => {
    const next: Record<string, boolean> = {};
    FILTERS.forEach(f => next[f.id] = val);
    setActiveFilters(next);
  };

  const cx = 200;
  const cy = 200;
  const size = 400;

  // Derive Alignment Key matching criteria depending on active twin
  const getTargetTwinKey = () => {
    switch (activeTwin.id) {
      case "material-coupling-constructor":
        return {
          combo: ["square", "hexagon", "star"],
          angleRange: [-15, 15],
          bendRange: [30, 60],
          desc: "To reveal the hidden construction state, activate Square (Structure), Hexagon (Connection), and Star (Purpose). Align Angle to 0° with bending near 45%.",
          realization: "COUPLED MATTER CONTINUITY: Matter bonded between Terminus A & B exhibits strong multidimensional isostatic stability. Ground vectors are structurally locked."
        };
      case "termite-mound":
      case "termite-colony-ventilation":
        return {
          combo: ["triangle", "hexagon", "circle"],
          angleRange: [45, 75],
          bendRange: [60, 90],
          desc: "To reveal passive mound ventilation micro-structures, activate Triangle (Direction), Hexagon (Connection), and Circle (State). Set Align Angle to 60° and high Bending (75%).",
          realization: "THERMAL ADAPTABILITY COHERENCE: Passive atmospheric exchange tunnels align with ambient wind patterns. Symmetrical chimneys extract metabolic heat organically."
        };
      case "power-grid":
      case "power-grid-stability":
        return {
          combo: ["octagon", "hexagon", "pentagon"],
          angleRange: [-90, -60],
          bendRange: [20, 50],
          desc: "To observe high-impedance electrical distribution topologies, activate Octagon (Boundaries), Hexagon (Connection), and Pentagon (Adaptation). Align Angle to -75° with low-medium bending.",
          realization: "COHERENT PHASE SYNCHRONY: Power-flow links exhibit resilient network impedance. Dynamic load-shedding adapters hold grid frequency above decay barriers."
        };
      case "human-body":
      case "human-pathophysiology":
        return {
          combo: ["circle", "pentagon", "heptagon"],
          angleRange: [-140, -110],
          bendRange: [40, 70],
          desc: "To isolate arterial oxygenation homeostatic cycles, activate Circle (State), Pentagon (Adaptation), and Heptagon (Time). Align Angle near -120° and medium bending.",
          realization: "AUTONOMIC RESPONSE EQUILIBRIUM: Microvascular compliance matches respiratory rhythms. System-wide endocrine loops preserve cognitive viability thresholds."
        };
      default:
        return {
          combo: ["square", "triangle", "circle"],
          angleRange: [20, 40],
          bendRange: [40, 80],
          desc: "Initialize custom alignments by activating Square, Triangle, and Circle. Align Angle to 30°.",
          realization: "COGNITIVE ALIGNED CORRELATION: Unified structural perspective matches sensor telemetry values perfectly."
        };
    }
  };

  const alignmentKey = getTargetTwinKey();

  // Check if current setup matches the Alignment Key
  const isPerfectlyAligned = useMemo(() => {
    const activeKeys = Object.keys(activeFilters).filter((k) => activeFilters[k]);
    const comboMatches = 
      alignmentKey.combo.every(k => activeFilters[k]) &&
      activeKeys.length === alignmentKey.combo.length;

    const angleMatches = alignAngle >= alignmentKey.angleRange[0] && alignAngle <= alignmentKey.angleRange[1];
    const bendMatches = bendFactor >= alignmentKey.bendRange[0] && bendFactor <= alignmentKey.bendRange[1];

    return comboMatches && angleMatches && bendMatches;
  }, [activeFilters, alignAngle, bendFactor, alignmentKey]);

  const handleAutoAlignPreset = () => {
    const nextFilters: Record<string, boolean> = {};
    FILTERS.forEach((f) => {
      nextFilters[f.id] = alignmentKey.combo.includes(f.id);
    });
    setActiveFilters(nextFilters);

    // Set sliders to exact midpoint of target ranges
    const avgAngle = Math.round((alignmentKey.angleRange[0] + alignmentKey.angleRange[1]) / 2);
    const avgBend = Math.round((alignmentKey.bendRange[0] + alignmentKey.bendRange[1]) / 2);

    setAlignAngle(avgAngle);
    setBendFactor(avgBend);
    setThreadFreq(8);
    setShowAnalysis(true); // Automatically expand the telemetry section if they auto-align!
  };

  // Generate laser thread wave path that bends to active geometries
  const generateThreadPath = () => {
    const points = [];
    const steps = 60;
    
    // Geometry shape indices calculations for distortions
    const scaleFactor = bendFactor / 100;
    const rad = (alignAngle * Math.PI) / 180;
    const isSquare = activeFilters.square;
    const isTriangle = activeFilters.triangle;
    const isCircle = activeFilters.circle;
    const isHexagon = activeFilters.hexagon;

    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * size;
      
      // Calculate relative distance to center for dampening envelope
      const distFromCenter = (x - cx) / (size / 2.3);
      const envelope = 1 - Math.exp(-Math.pow(distFromCenter / 0.6, 2));

      // Standard sinusoidal attention signal wave
      let sineVal = Math.sin((x / (size / 3)) * threadFreq + phase + rad);
      
      // Geometric-bending rules
      if (isSquare) {
        // Appends a step/square profile to the wave
        sineVal = sineVal >= 0 ? Math.min(1, sineVal * 1.5) : Math.max(-1, sineVal * 1.5);
      }
      if (isTriangle) {
        // Appends jagged sawtooth pattern
        sineVal = (Math.abs(((x / 50 + phase / 2) % 2) - 1) - 0.5) * 2;
      }
      if (isCircle) {
        // Super smooth high amplitude loops
        sineVal = sineVal * 1.25;
      }
      if (isHexagon) {
        // Periodic discrete steps
        sineVal = Math.round(sineVal * 3) / 3;
      }

      // Compute y value. It ALWAYS passes directly through (cx, cy) due to the center envelope multiplier!
      const y = cy + sineVal * 30 * scaleFactor * envelope;
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return `M ${points.join(" L ")}`;
  };

  const threadPath = generateThreadPath();

  // Twin Specific observations by geometrical filter
  const getTwinSpecificDoc = (filterId: string) => {
    const name = activeTwin.name;
    const isMcc = activeTwin.id === "material-coupling-constructor";
    const isColony = activeTwin.id === "termite-mound" || activeTwin.id === "termite-colony-ventilation";
    const isPower = activeTwin.id === "power-grid" || activeTwin.id === "power-grid-stability";
    const isBody = activeTwin.id === "human-body" || activeTwin.id === "human-pathophysiology";

    switch (filterId) {
      case "octagon":
        if (isMcc) return "Terminus nodes boundaries (Point A to Point B coordinates) locked inside 400mm safe frame range.";
        if (isColony) return "Outer clay capsule thick walls, blocking external predatory moisture spikes and wind loads.";
        if (isPower) return "Relay protection zones and structural isolation barriers. Substation security envelopes.";
        if (isBody) return "Capillary endothelial boundaries, separating intravascular blood gases from target cellular tissue.";
        return "System boundary limits and governance envelopes.";
      case "square":
        if (isMcc) return "High structural steel chords and polymer tension stiffener lines. Maximum bending stress resistance.";
        if (isColony) return "Dry cellulose-mortared support pillars taking structural roof loads down into earth footings.";
        if (isPower) return "Substation reinforced high-voltage towers and generator mounting foundation brackets.";
        if (isBody) return "Rigid musculoskeletal spinal alignment, cardiac collagen matrices, and vascular wall tension layers.";
        return "Architectural loadpaths and skeleton vectors.";
      case "triangle":
        if (isMcc) return "Primary displacement vectors mapping diagonal forces under heavy material loading.";
        if (isColony) return "Upward thermal draft directional gradients pointing directly towards central stack chimneys.";
        if (isPower) return "Active dispatch force vectors, phase advancement trajectories holding network load pulls.";
        if (isBody) return "Arterial pressure gradient flow directions carrying rich gas compounds to central brain regions.";
        return "Direct kinetic force vectors and intent paths.";
      case "hexagon":
        if (isMcc) return "Carbon chord-wire mesh links and micro-coupling points aligned across structural centers.";
        if (isColony) return "Symmetrical tunnel crossroads patterns and pheromone signal pathways mapped across worker lanes.";
        if (isPower) return "Generator transmission connections graph. High-impedance link matrices.";
        if (isBody) return "Capillary alveolar networks, neural micro-synaptic networks, and hormonal feedback paths.";
        return "Mesh topology and multi-node connection paths.";
      case "circle":
        if (isMcc) return "Aggregate material mass, absolute gravity load, and conservation of material elements.";
        if (isColony) return "Consolidated colony carbon dioxide totals, aggregate breathing rate, and mass balance ratios.";
        if (isPower) return "Combined phase-angle coherence across all generators, system frequency stable at 50/60Hz.";
        if (isBody) return "Aggregated autonomic nervous system balance. Total systemic oxygen saturations.";
        return "Consolidated macro-state conservation values.";
      case "pentagon":
        if (isMcc) return "Dynamic material displacement adaptivity. High ductile stretch before hard material failure.";
        if (isColony) return "Clay micro-corrosion plastic repair. Tunnels shift shape as humidity patterns change.";
        if (isPower) return "Intelligent line switching triggers and self-healing grid isolation loops.";
        if (isBody) return "Vascular adaptation (vasodilation) response matching environmental oxygen pressure drops.";
        return "Material adaptivity and damage resilience.";
      case "heptagon":
        if (isMcc) return "Load application intervals, stress loading timelines, and sequence of material degradation.";
        if (isColony) return "Diurnal heat sequences, shift timetables of workers, and seasonal expansion timing loops.";
        if (isPower) return "Generator start times, transient sub-second grid oscillation timelines.";
        if (isBody) return "Heart action potential sequence timing, breath delay loops, and systemic transit cycles.";
        return "Sequential timespans and cycle durations.";
      case "star":
        if (isMcc) return "Objective isostatic optimization, structural alignment target between points A & B.";
        if (isColony) return "Royal chamber climate conservation, queen survival safety constraints preservation.";
        if (isPower) return "Absolute zero-grid-blackout security constraint, system-wide load equilibrium.";
        if (isBody) return "Brain perfusion security under high cardiovascular stress. Cell life maintenance.";
        return "Critical teleology metrics and design target optimization.";
      default:
        return "";
    }
  };

  // Rendering data for Slices below the SVG
  const SLICES_DATA = [
    { id: "A", label: "Slice A", type: "Order Lattice", desc: "Exposes the internal symmetrical layout structure." },
    { id: "B", label: "Slice B", type: "Fluid Flow Paths", desc: "Exposes current kinetic transfers passing across node networks." },
    { id: "C", label: "Slice C", type: "Hierarchy Weights", desc: "Highlights primary foundational nodes vs weak peripheral connectors." },
    { id: "D", label: "Slice D", type: "Frequency Timing", desc: "Exposes chronological oscillation patterns along current cycles." },
    { id: "E", label: "Slice E", type: "Teleology Purpose", desc: "Exposes structural force targets and structural goals." }
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-6" id="thread-geometry-experiment-panel">
      {/* HEADER EXPLANATION */}
      <div className="bg-[#050608]/90 border border-t-[3px] border-t-cyan-500 border-[#c5a05933] p-3 sm:p-4 rounded flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <Compass className="text-[#c5a059] animate-pulse" size={16} />
            <h2 className="text-[11px] sm:text-xs font-mono font-bold text-white uppercase tracking-widest">
              Digital Twin Geometric Filtering Experiment
            </h2>
          </div>
          <p className="text-[10px] text-[#819ab3] font-sans leading-relaxed max-w-3xl mt-1 hidden sm:block">
            “The geometry does not tell you what reality is. The geometry determines which layer of reality becomes visible. 
            A single thread enters the system (user attention/signal), passing through the center of every shape. 
            The thread bends to the active geometry filters, selecting what layer of the Digital Twin becomes navigable.”
          </p>
        </div>
        
        {/* State Status Badge */}
        <div className="flex flex-col items-start md:items-end shrink-0">
          <div className={`flex items-center gap-1.5 px-2 py-0.5 sm:py-1 text-[8px] font-mono rounded uppercase font-bold border tracking-widest ${
            isPerfectlyAligned 
              ? "bg-emerald-950/35 text-emerald-400 border-emerald-500/35 animate-bounce" 
              : "bg-[#c5a05922] text-[#c5a059] border-[#c5a059]/20"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isPerfectlyAligned ? "bg-emerald-400 animate-ping" : "bg-cyan-400"}`} />
            Alignment: {isPerfectlyAligned ? "COHERENT RATIO REACHED" : "DIVERGENT PERSPECTIVES"}
          </div>
          <span className="text-[7.5px] font-mono text-[#586f8a] mt-0.5 sm:mt-1">Jemma Governance Approved</span>
        </div>
      </div>

      {/* QUICK INITIATION PRESET BAR */}
      <div className="bg-[#030d1d]/90 border border-amber-500/30 p-2 sm:p-3 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 shadow-[0_0_12px_rgba(245,158,11,0.05)]">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-amber-950/40 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Zap className="text-amber-400 animate-pulse" size={12} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#e0e0e0] uppercase tracking-wider">
              Instant Geometric Initiation
            </span>
            <span className="text-[8.5px] sm:text-[9px] text-[#819ab3] font-sans leading-tight hidden lg:block">
              One-click preset alignment for "{activeTwin.name}" (auto-select filters, rotation and bending factor).
            </span>
          </div>
        </div>
        <button
          onClick={handleAutoAlignPreset}
          className={`w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 rounded text-[8.5px] sm:text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border ${
            isPerfectlyAligned
              ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              : "bg-amber-500 hover:bg-amber-400 text-black border-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.25)] active:scale-95"
          }`}
        >
          <Sparkles size={11} className={isPerfectlyAligned ? "animate-spin" : ""} />
          {isPerfectlyAligned ? "✓ Integrated State Aligned" : "⚡ Establish Coherence Alignment"}
        </button>
      </div>

      {/* MOBILE TABS SWITCHER */}
      <div className="xl:hidden flex border border-[#c5a05933] mb-1 bg-[#040812] rounded p-0.5 gap-0.5">
        <button
          onClick={() => setMobileTab("shapes")}
          className={`flex-1 py-1.5 text-[8.5px] font-mono uppercase tracking-wider font-semibold rounded text-center transition-all ${
            mobileTab === "shapes"
              ? "bg-cyan-950/30 text-[#c5a059] border border-[#c5a059]/30 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
              : "text-slate-400 hover:text-[#e0e0e0]"
          }`}
        >
          🎛️ Shape Filters
        </button>
        <button
          onClick={() => setMobileTab("sliders")}
          className={`flex-1 py-1.5 text-[8.5px] font-mono uppercase tracking-wider font-semibold rounded text-center transition-all ${
            mobileTab === "sliders"
              ? "bg-amber-950/30 text-yellow-500 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.15)]"
              : "text-slate-400 hover:text-[#e0e0e0]"
          }`}
        >
          ⚡ Wave Sliders
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 xl:gap-5">
        
        {/* LEFT COLUMN: CONTROL MATRIX (5 Cols) */}
        <div className="xl:col-span-5 flex flex-col gap-3">
          
          <div className={`${mobileTab === "shapes" ? "flex" : "hidden xl:flex"} flex-col gap-3 bg-[#050608]/95 border border-[#c5a05933] p-3 sm:p-4 rounded`}>
            <div className="flex justify-between items-center border-b border-[#c5a05933] pb-2">
              <span className="text-[10px] font-bold font-mono text-[#c5a059] uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={12} className="text-[#c5a059]" /> 1. Geometrical Shape Filters
              </span>
              <div className="flex gap-1.5">
                <button 
                  onClick={() => handleSelectAll(true)}
                  className="text-[8px] font-mono uppercase bg-slate-900 px-1.5 py-0.5 rounded border border-[#c5a05911] text-[#e0e0e0] hover:text-white"
                >
                  All
                </button>
                <button 
                  onClick={() => handleSelectAll(false)}
                  className="text-[8px] font-mono uppercase bg-slate-900 px-1.5 py-0.5 rounded border border-[#c5a05911] text-[#e0e0e0] hover:text-white"
                >
                  Clear
                </button>
              </div>
            </div>

            <p className="text-[9px] text-[#586e85] leading-relaxed font-sans">
              Toggle geometries to bend user attention waves and reveal structural vectors of <span className="text-[#c5a059] font-mono font-bold">"{activeTwin.name}"</span>.
            </p>

            {/* Filter grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-1.5 mt-1">
              {FILTERS.map((f) => {
                const isActive = activeFilters[f.id];
                const isTarget = alignmentKey.combo.includes(f.id);
                return (
                  <button
                    key={f.id}
                    onClick={() => toggleFilter(f.id)}
                    className={`flex flex-col text-left p-2 rounded border transition-all relative ${
                      isActive 
                        ? `bg-[#070e17] ${f.border} shadow-[inset_0_0_10px_rgba(30,58,138,0.15)]` 
                        : "bg-[#020408]/40 border-slate-950 hover:bg-[#03070e]/80"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                       <span className={`text-[9.5px] font-mono font-bold leading-tight ${isActive ? f.text : "text-slate-500"}`}>
                        {f.label.split(". ")[1]}
                      </span>
                      <div className="flex items-center gap-1">
                        {isTarget && (
                          <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" title="Target" />
                        )}
                        <span className={`w-2 h-1 text-[7px] rounded-sm uppercase tracking-widest leading-none block ${
                          isActive ? "bg-[#c5a059] shadow-[0_0_6px_rgba(197,160,89,0.6)]" : "bg-slate-900 border border-[#c5a05911]"
                        }`} />
                      </div>
                    </div>
                    <span className="text-[7.5px] font-mono text-[#526478] tracking-tight truncate w-full">{f.theme}</span>
                    <p className="text-[8.5px] text-[#788ba3] mt-1 leading-normal font-sans line-clamp-2 hidden sm:block">
                      {f.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PARAMETERS CONTROL PANEL */}
          <div className={`${mobileTab === "sliders" ? "flex" : "hidden xl:flex"} flex-col gap-3 bg-[#050608]/95 border border-[#c5a05933] p-3 sm:p-4 rounded`}>
            <span className="text-[10px] font-bold font-mono text-[#c5a059] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#c5a05933] pb-2">
              <Activity size={12} className="text-[#c5a059]" /> 2. Thread Wave Parameters
            </span>

            {/* Freq Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[8px] font-mono text-slate-400 uppercase">
                <span>Incoming Attention Freq</span>
                <span className="text-[#c5a059] font-bold">{threadFreq} Hz</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="24" 
                step="1"
                value={threadFreq}
                onChange={(e) => setThreadFreq(parseInt(e.target.value))}
                className="w-full accent-[#c5a059] bg-[#050608] h-2.5 md:h-1.5 py-1.5 md:py-1 rounded cursor-pointer"
              />
            </div>

            {/* Bending factor slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[8px] font-mono text-slate-400 uppercase">
                <span>Geometric Bending Strain</span>
                <span className="text-rose-400 font-bold">{bendFactor}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="1"
                value={bendFactor}
                onChange={(e) => setBendFactor(parseInt(e.target.value))}
                className="w-full accent-rose-500 bg-[#050608] h-2.5 md:h-1.5 py-1.5 md:py-1 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[7.5px] font-mono text-slate-600 mt-0.5">
                <span>0% Linear Direct</span>
                <span>Target: {alignmentKey.bendRange[0]}%-{alignmentKey.bendRange[1]}%</span>
                <span>100% Critical Bent</span>
              </div>
            </div>

            {/* Alignment Angle Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[8px] font-mono text-slate-400 uppercase">
                <span>Alignment Focus Angle</span>
                <span className="text-yellow-400 font-bold">{alignAngle}°</span>
              </div>
              <input 
                type="range" 
                min="-180" 
                max="180" 
                step="5"
                value={alignAngle}
                onChange={(e) => setAlignAngle(parseInt(e.target.value))}
                className="w-full accent-yellow-500 bg-[#050608] h-2.5 md:h-1.5 py-1.5 md:py-1 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[7.5px] font-mono text-slate-600 mt-0.5">
                <span>-180° Anti-phase</span>
                <span>Target: {alignmentKey.angleRange[0]}° to {alignmentKey.angleRange[1]}°</span>
                <span>+180° Absolute</span>
              </div>
            </div>
          </div>

          {/* SYSTEM ALIGNMENT STATUS */}
          <div className={`${mobileTab === "sliders" ? "flex" : "hidden xl:flex"} bg-[#050608]/95 border border-[#c5a05933] p-3 sm:p-4 rounded flex flex-col gap-1.5`}>
            <span className="text-[7.5px] font-mono text-[#c5a059] uppercase tracking-widest font-bold">Geometry Filter Hints</span>
            <p className="text-[9px] text-[#7187a1] leading-relaxed font-sans italic">
              {alignmentKey.desc}
            </p>
          </div>

        </div>

        {/* CENTER INTERACTIVE SIGNAL CHAMBER (7 Cols) */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          
          <div className="bg-[#050608]/95 border border-[#c5a05933] rounded flex flex-col relative overflow-hidden">
            
            {/* CANVAS INTERACTIVE TITLE */}
            <div className="flex justify-between items-center border-b border-[#c5a05933] px-4 py-3 bg-[#040811]/90 z-10 select-none">
              <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono text-white uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Sovereign Attention Signal Chamber
              </div>
              <div className="text-[8px] font-mono text-[#5f7b99] tracking-wider uppercase text-right flex flex-col items-end">
                <span>XY Spatial Lattice Core Projection</span>
                <span className="text-[#c5a059] text-[7.5px] font-semibold mt-0.5 tracking-normal">👈 drag grid directly or use sliders to rotate axis</span>
              </div>
            </div>

            {/* LARGE GEOMETRY VIEWPORT AREA (directly rotatable on mobile & desktop) */}
            <div 
              ref={viewportRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="h-[260px] sm:h-[320px] md:h-[430px] flex items-center justify-center relative bg-[#010306] cursor-grab active:cursor-grabbing select-none touch-none"
            >
              {/* Coordinate Grid system behind */}
              <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 pointer-events-none opacity-[0.02] border border-[#c5a059]/20">
                {Array.from({ length: 11 }).map((_, i) => (
                  <div key={i} className="border-t border-slate-500 w-full" style={{ gridRowStart: i }} />
                ))}
              </div>

              {/* Center Crosshair Coordinates */}
              <div className="absolute pointer-events-none select-none flex flex-col items-center justify-center z-10">
                <div className="w-4 h-4 border border-dashed border-white/20 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,1)]" />
                </div>
                <span className="text-[5.5px] font-mono text-slate-500 mt-0.5 uppercase tracking-widest">CENTER REFN</span>
              </div>

              {/* SVG POLYGONS AND THREAD */}
              <svg 
                viewBox="0 0 400 400" 
                className="w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] select-none pointer-events-none transition-transform duration-500"
                style={{ transform: `rotate(${alignAngle}deg)` }}
              >
                {/* SVG DEFINITIONS */}
                <defs>
                  <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#c5a059" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#c5a059" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="threadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
                    <stop offset="30%" stopColor="#ef4444" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#c5a059" stopOpacity="1" />
                    <stop offset="70%" stopColor="#ef4444" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                {/* Central Radial Light */}
                <circle cx={cx} cy={cy} r="160" fill="url(#centerGlow)" />

                {/* Draw concentric calibration circles */}
                <circle cx={cx} cy={cy} r="150" stroke="#c5a05933" strokeWidth="0.8" strokeDasharray="3,3" fill="none" />
                <circle cx={cx} cy={cy} r="100" stroke="#c5a05933" strokeWidth="0.8" strokeDasharray="4,6" fill="none" />
                <circle cx={cx} cy={cy} r="50" stroke="#c5a05933" strokeWidth="0.8" strokeDasharray="1,2" fill="none" />

                {/* Crosslines */}
                <line x1="20" y1={cy} x2="380" y2={cy} stroke="#c5a05933" strokeWidth="0.6" />
                <line x1={cx} y1="20" x2={cx} y2="380" stroke="#c5a05933" strokeWidth="0.6" />

                {/* RENDERING INDIVIDUAL ACTIVE SHAPES */}
                {/* 1. Octagon (Purple) */}
                {activeFilters.octagon && (
                  <path 
                    d={getPolygonPath(cx, cy, 8, 150, -Math.PI/8)} 
                    stroke="#a855f7" 
                    strokeWidth="1.2" 
                    fill="none" 
                    className="opacity-90 drop-shadow-[0_0_2px_rgba(168,85,247,0.4)]" 
                  />
                )}

                {/* 2. Square (Blue/Indigo) */}
                {activeFilters.square && (
                  <path 
                    d={getPolygonPath(cx, cy, 4, 150, -Math.PI/4)} 
                    stroke="#3b82f6" 
                    strokeWidth="1.2" 
                    fill="none" 
                    className="opacity-90 drop-shadow-[0_0_2px_rgba(59,130,246,0.4)]" 
                  />
                )}

                {/* 3. Triangle (Rose) */}
                {activeFilters.triangle && (
                  <path 
                    d={getPolygonPath(cx, cy, 3, 142, -Math.PI/2)} 
                    stroke="#f43f5e" 
                    strokeWidth="1.2" 
                    fill="none" 
                    className="opacity-90 drop-shadow-[0_0_2px_rgba(244,63,94,0.4)]" 
                  />
                )}

                {/* 4. Hexagon (Green) */}
                {activeFilters.hexagon && (
                  <path 
                    d={getPolygonPath(cx, cy, 6, 135, 0)} 
                    stroke="#22c55e" 
                    strokeWidth="1.2" 
                    fill="none" 
                    className="opacity-90 drop-shadow-[0_0_2px_rgba(34,197,94,0.4)]" 
                  />
                )}

                {/* 5. Circle (Sky Blue) */}
                {activeFilters.circle && (
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r="150" 
                    stroke="#0ea5e9" 
                    strokeWidth="1.1" 
                    fill="none" 
                    className="opacity-90 drop-shadow-[0_0_2px_rgba(14,165,233,0.4)]" 
                  />
                )}

                {/* 6. Pentagon (Yellow) */}
                {activeFilters.pentagon && (
                  <path 
                    d={getPolygonPath(cx, cy, 5, 146, -Math.PI/2)} 
                    stroke="#eab308" 
                    strokeWidth="1.2" 
                    fill="none" 
                    className="opacity-90 drop-shadow-[0_0_2px_rgba(234,179,8,0.4)]" 
                  />
                )}

                {/* 7. Heptagon (Pink) */}
                {activeFilters.heptagon && (
                  <path 
                    d={getPolygonPath(cx, cy, 7, 132, -Math.PI/2)} 
                    stroke="#ec4899" 
                    strokeWidth="1.2" 
                    fill="none" 
                    className="opacity-90 drop-shadow-[0_0_2px_rgba(236,72,153,0.4)]" 
                  />
                )}

                {/* 8. Star (Orange) */}
                {activeFilters.star && (
                  <path 
                    d={getStarPath(cx, cy, 8, 150, 70, -Math.PI/2)} 
                    stroke="#f97316" 
                    strokeWidth="1.2" 
                    fill="none" 
                    className="opacity-90 drop-shadow-[0_0_2px_rgba(249,115,22,0.4)]" 
                  />
                )}

                {/* Active vertices dots where the shapes intersect the alignment zones */}
                {((activeTwin as any).components || activeTwin.entities || []).map((comp: any, idx: number) => {
                  if (idx >= 8) return null;
                  const filterId = FILTERS[idx % FILTERS.length].id;
                  const isActive = activeFilters[filterId];
                  if (!isActive) return null;
                  
                  const a = (idx * Math.PI * 2) / 8;
                  const x = cx + 150 * Math.cos(a);
                  const y = cy + 150 * Math.sin(a);
                  
                  return (
                    <g key={comp.id}>
                      <circle cx={x} cy={y} r="4" fill={FILTERS[idx % FILTERS.length].color} className="animate-pulse" />
                      <circle cx={x} cy={y} r="8" stroke={FILTERS[idx % FILTERS.length].color} strokeWidth="0.5" fill="none" className="animate-ping" style={{ animationDuration: "3s" }} />
                    </g>
                  );
                })}

                {/* DYNAMIC SHADOWED SIGNAL THREAD PATH */}
                <path 
                  d={threadPath} 
                  stroke="url(#threadGradient)" 
                  strokeWidth={isPerfectlyAligned ? "3" : "2"} 
                  fill="none" 
                  className={`transition-all duration-300 ${
                    isPerfectlyAligned 
                      ? "drop-shadow-[0_0_12px_rgba(197,160,89,1)]" 
                      : "drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]"
                  }`}
                  style={{ transformOrigin: "200px 200px" }}
                />

                {/* Flow particles along the path under Slice B */}
                {activeSlice === "B" && (
                  <>
                    <circle r="4" fill="#c5a059" className="glow-gold">
                      <animateMotion dur="4s" repeatCount="indefinite" path={threadPath} />
                    </circle>
                    <circle r="3" fill="#ffffff" className="glow-white">
                      <animateMotion dur="6s" begin="2s" repeatCount="indefinite" path={threadPath} />
                    </circle>
                  </>
                )}

                {/* Perfect alignment golden focus aura */}
                {isPerfectlyAligned && (
                  <g className="animate-pulse">
                    <circle cx={cx} cy={cy} r="150" stroke="#10b981" strokeWidth="2" strokeDasharray="5,10" fill="none" />
                    <circle cx={cx} cy={cy} r="154" stroke="#c5a059" strokeWidth="0.5" fill="none" />
                  </g>
                )}

              </svg>

              {/* OVERLAY SENSORS REFF READOUTS */}
              <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
                <div className="bg-[#050608]/80 border border-[#c5a05922] px-2 py-1 rounded text-[8px] font-mono text-[#e0e0e0]">
                  <span className="text-amber-400 font-bold uppercase">Signal:</span> THREAD_ACTIVE_{threadFreq}Hz
                </div>
                <div className="bg-[#050608]/80 border border-[#c5a05922] px-2 py-1 rounded text-[8px] font-mono text-[#e0e0e0]">
                  <span className="text-rose-400 font-bold uppercase">Strain:</span> {bendFactor}% Bending Factor
                </div>
              </div>

              <div className="absolute top-4 right-4 flex flex-col gap-1 z-10 items-end">
                <div className="bg-[#050608]/80 border border-[#c5a05922] px-2 py-1 rounded text-[8px] font-mono text-[#e0e0e0] text-right">
                  <span className="text-[#c5a059] font-bold uppercase">Aligned Focus:</span> {alignAngle}° Rotation
                </div>
                <div className="bg-[#050608]/80 border border-[#c5a05922] px-2 py-1 rounded text-[8px] font-mono text-[#e0e0e0] text-right">
                  <span className="text-yellow-400 font-bold uppercase">Target:</span> {alignmentKey.combo.map(s => s.slice(0,3)).join("+")}
                </div>
              </div>

              {/* BOTTOM CENTER DECO ALIGNMENT SUCCESS BOARD */}
              <AnimatePresence>
                {isPerfectlyAligned && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute bottom-5 left-5 right-5 bg-emerald-950/80 border border-emerald-500/50 backdrop-blur p-3 rounded z-15 flex flex-col gap-1 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                  >
                    <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-emerald-300 uppercase">
                      <Sparkles size={11} className="text-emerald-400 animate-spin" />
                      COHERENCE PATHWAY LOCKED & SYNCED TO FIRESTORE
                    </div>
                    <p className="text-[10px] text-[#e0e0e0] leading-normal font-sans font-medium">
                      {alignmentKey.realization}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* SELECTION TABS: SLICE THROUGH THE CENTER RANGE */}
            <div className="bg-[#050608]/95 border-t border-[#c5a05933] p-3 flex flex-col gap-2">
              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                Select Slice Depth (Projections Through the Center)
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {SLICES_DATA.map((s) => {
                  const isActive = activeSlice === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveSlice(s.id)}
                      className={`py-1.5 px-2 text-[9px] font-mono text-center border rounded transition-all select-none ${
                        isActive
                          ? "bg-[#0b0c10] text-[#c5a059] border-[#c5a05933] font-bold shadow-[inset_0_0_6px_rgba(0,e5,ff,0.1)]"
                          : "bg-[#050608] border-[#c5a05922]/40 text-slate-500 hover:text-[#e0e0e0] hover:bg-[#050608]/60"
                      }`}
                    >
                      <div className="uppercase font-bold">{s.label}</div>
                      <div className="text-[7px] text-[#59718a] leading-none mt-0.5 truncate">{s.type}</div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* COLLAPSIBLE ADVANCED ANALYSIS SECTION FOR COMPACT MOBILE HUD */}
      <div className="border border-[#c5a05933] rounded-lg overflow-hidden bg-[#050608]/45 mt-2">
        <button
          onClick={() => setShowAnalysis(!showAnalysis)}
          className="w-full flex justify-between items-center px-4 py-3 bg-[#040812] hover:bg-[#070f21] transition-all text-left"
          id="toggle-advanced-observations"
        >
          <div className="flex items-center gap-2">
            <Layers className="text-[#c5a059] animate-pulse" size={14} />
            <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
              {showAnalysis ? "[-] Hide" : "[+] Show"} Slices & Analytics HUD ({Object.keys(activeFilters).filter(k=>activeFilters[k]).length} Active)
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#c5a059] bg-[#c5a05944] px-2 py-0.5 rounded border border-[#c5a05944] uppercase">
            {showAnalysis ? "Collapse System View" : "Expand Full View"}
          </span>
        </button>

        <AnimatePresence>
          {showAnalysis && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="border-t border-[#c5a05933] overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-1">
        
        {/* RIGHT PANEL: TELEMETRY AND ANALYSIS LENS (8 Cols) */}
        <div className="md:col-span-8 bg-[#050608]/95 border border-[#c5a05933] p-5 rounded flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-[#c5a05933] pb-2">
            <span className="text-[10px] font-bold font-mono text-[#c5a059] uppercase tracking-wider flex items-center gap-1.5">
              <Eye size={12} className="text-[#c5a059]" /> WHAT THE OPERATOR SEES THROUGH THE LENS
            </span>
            <span className="text-[8px] font-mono text-slate-500">Slice: {SLICES_DATA.find(s=>s.id === activeSlice)?.type}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Perspective A: Coherent Pattern */}
            <div className="p-3 bg-[#010408]/60 border border-[#c5a05922]/80 rounded flex flex-col gap-1">
              <div className="flex justify-between text-[8px] font-mono text-[#c5a059] uppercase tracking-wider font-bold">
                <span>A. Coherent Pattern</span>
                <span className="text-[#59718a]">Filter-surviving signal</span>
              </div>
              <p className="text-[9.5px] text-[#8e9fae] leading-relaxed font-sans mt-1">
                {isPerfectlyAligned 
                  ? `Signal matches maximum isostatic limits! The unified physical geometry is fully proven and resolved. No approximation needed.`
                  : `Divergent noise observed. You have selected ${Object.keys(activeFilters).filter(k=>activeFilters[k]).length} shape filters. Currently, ${alignmentKey.combo.filter(k=>activeFilters[k]).length} of ${alignmentKey.combo.length} necessary parameters align. Adjust shapes and align the thread parameters to lock focus.`
                }
              </p>
            </div>

            {/* Perspective B: Relationships */}
            <div className="p-3 bg-[#010408]/60 border border-[#c5a05922]/80 rounded flex flex-col gap-1">
              <div className="flex justify-between text-[8px] font-mono text-[#c5a059] uppercase tracking-wider font-bold">
                <span>B. Relationships & Material Coupling</span>
                <span className="text-[#59718a]">Connection patterns</span>
              </div>
              <p className="text-[9.5px] text-[#8e9fae] leading-relaxed font-sans mt-1">
                {activeFilters.hexagon
                  ? `Hexagonal connection channel enabled. Exposing precise node links for "${activeTwin.name}": ${getTwinSpecificDoc("hexagon")}`
                  : `Hexagonal connection matrix collapsed. Activate Hexagon (Connection/Flow) to display physical node links, paths and connection topologies.`
                }
              </p>
            </div>

            {/* Perspective C: Hierarchy */}
            <div className="p-3 bg-[#010408]/60 border border-[#c5a05922]/80 rounded flex flex-col gap-1">
              <div className="flex justify-between text-[8px] font-mono text-[#c5a059] uppercase tracking-wider font-bold">
                <span>C. Symmetrical Hierarchy</span>
                <span className="text-[#59718a]">Core vs Peripheral</span>
              </div>
              <p className="text-[9.5px] text-[#8e9fae] leading-relaxed font-sans mt-1">
                {activeFilters.square
                  ? `Square structural skeletal matrix resolved: ${getTwinSpecificDoc("square")}`
                  : `Skeletal lines offline. Toggle Square filter to resolve loadpaths coordinates and core structural grids.`
                }
              </p>
            </div>

            {/* Perspective D: Dynamics */}
            <div className="p-3 bg-[#010408]/60 border border-[#c5a05922]/80 rounded flex flex-col gap-1">
              <div className="flex justify-between text-[8px] font-mono text-[#c5a059] uppercase tracking-wider font-bold">
                <span>D. Temporal Cycles / Dynamics</span>
                <span className="text-[#59718a]">Time parameters</span>
              </div>
              <p className="text-[9.5px] text-[#8e9fae] leading-relaxed font-sans mt-1">
                {activeFilters.heptagon
                  ? `Time sequences activated. System diurnal steps mapping successfully: ${getTwinSpecificDoc("heptagon")}`
                  : `Chronography locked. To view timing sequences and operational loop intervals, enable Heptagon (Time/Sequence) geo-filter.`
                }
              </p>
            </div>

          </div>

          {/* ACTIVE FILTER ANALYSIS LIST */}
          <div className="bg-[#050608]/80 border border-[#c5a05922] rounded p-3 text-[10px] font-mono flex flex-col gap-2">
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Active Geometrical Observations:</span>
            <div className="flex flex-col gap-1.5 divide-y divide-slate-900/50">
              {Object.keys(activeFilters).filter((k)=>activeFilters[k]).map((key) => {
                const spec = FILTERS.find(f => f.id === key);
                return (
                  <div key={key} className="flex gap-2 py-1.5 first:pt-0">
                    <span className={`w-16 flex-shrink-0 font-bold uppercase text-[9px] ${spec?.text}`}>{spec?.label.split(". ")[1]}:</span>
                    <span className="text-[#e0e0e0] font-sans text-[9.5px]">{getTwinSpecificDoc(key)}</span>
                  </div>
                );
              })}
              {Object.keys(activeFilters).filter((k)=>activeFilters[k]).length === 0 && (
                <div className="text-center text-[#586e85] py-2">No active geometry lenses selected. The thread passes through completely unfiltered space.</div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: JEMMA GOVERNANCE MATRIX (4 Cols) */}
        <div className="md:col-span-4 bg-[#050608]/95 border border-[#cedbf0]/10 border-l-[3px] border-l-rose-500 p-5 rounded flex flex-col gap-3">
          <span className="text-[10px] font-bold font-mono text-rose-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-[#c5a05933] pb-2">
            <Shield size={12} className="text-rose-400" /> JEMMA CONSTITUTION LOCK
          </span>

          <p className="text-[9px] text-[#8296aa] leading-relaxed font-sans">
            Rigorous Digital Twin architecture constraints. Fallback algorithms are strictly audited to secure integrity.
          </p>

          <div className="flex flex-col gap-2.5 mt-1 font-mono text-[9px]">
            {/* Rule 1 */}
            <div className="p-2 bg-rose-950/10 border border-rose-950/40 rounded flex flex-col gap-0.5">
              <span className="text-rose-400 font-bold uppercase text-[7.5px] tracking-wider">I. Geometry Reality Lock</span>
              <p className="text-[#e0e0e0] font-sans leading-relaxed text-[8.5px]">
                The geometric models do not manufacture data. They act as spatial bandpass filters isolating targeted physical vectors.
              </p>
            </div>
            {/* Rule 2 */}
            <div className="p-2 bg-rose-950/10 border border-rose-950/40 rounded flex flex-col gap-0.5">
              <span className="text-rose-400 font-bold uppercase text-[7.5px] tracking-wider">II. True Boundary Checks</span>
              <p className="text-[#e0e0e0] font-sans leading-relaxed text-[8.5px]">
                Any unmeasured estimation presented as direct physical reality must trigger high warning alerts. Do not fake external physical solvers.
              </p>
            </div>
            {/* Rule 3 */}
            <div className="p-2 bg-[#050608] border border-[#c5a05922] rounded flex flex-col gap-0.5">
              <span className="text-slate-400 font-bold uppercase text-[7.5px] tracking-wider">III. Two Feet on the Floor</span>
              <p className="text-[#a1b4c7] font-sans leading-relaxed text-[8.5px]">
                No synthetic projections or pre-trained hallucinations. Prioritize pristine layout, precise spacing, and direct client validation state.
              </p>
            </div>
          </div>

          <div className="mt-2 p-2 bg-[#050608] border border-[#c5a05922] rounded text-center">
            <span className="text-[8px] font-mono text-rose-400 uppercase font-black block tracking-widest">
              COMPUTE INTEGRITY PROTOCOL
            </span>
            <span className="text-[10px] text-[#c5a059] font-mono font-bold mt-1 block">
              STATE STATUS: OBSERVING
            </span>
          </div>
        </div>

              </div>
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
