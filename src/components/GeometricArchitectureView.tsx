import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Compass,
  Zap,
  Sliders,
  RotateCcw,
  Shield,
  Activity,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Info,
  Maximize2,
  Minimize2,
  Box,
  Share2
} from "lucide-react";
import {
  GeometricArchitectureState,
  CANDIDATE_GEOMETRIES,
  solveGeometricArchitecture,
  sweepDimensionlessRatio,
  computeGeometricSensitivity
} from "../lib/geometricArchitecture";

export function GeometricArchitectureView() {
  // Geometric parameters
  const [h, setH] = useState(50); // meters
  const [r, setR] = useState(50); // meters
  const [sourcePowerKw, setSourcePowerKw] = useState(100); // kW
  const [attenuationAlpha, setAttenuationAlpha] = useState(0.002); // 1/m
  const [beamDirectivityExp, setBeamDirectivityExp] = useState(1.2);
  const [receiverApertureM2, setReceiverApertureM2] = useState(8.0);

  // Symmetry perturbation controls
  const [perturbedNodeIndex, setPerturbedNodeIndex] = useState(3);
  const [deltaR, setDeltaR] = useState(0); // m
  const [deltaThetaDeg, setDeltaThetaDeg] = useState(0); // deg
  const [deltaH, setDeltaH] = useState(0); // m

  // Active view tab
  const [activeTab, setActiveTab] = useState<"visualizer" | "ratio_optimization" | "comparison" | "sensitivity">("visualizer");

  // Build state object
  const geoConfig: GeometricArchitectureState = useMemo(() => ({
    h,
    r,
    rho: r / (h > 0 ? h : 0.001),
    pathLength: Math.sqrt(h * h + r * r),
    elevationAngleDeg: (Math.atan2(h, r) * 180) / Math.PI,
    chordDistance: 2 * r * Math.sin(Math.PI / 6),
    sourcePowerKw,
    attenuationAlpha,
    beamDirectivityExp,
    receiverApertureM2,
    isSymmetric: deltaR === 0 && deltaThetaDeg === 0 && deltaH === 0,
    perturbation: {
      perturbedNodeIndex,
      deltaR,
      deltaThetaDeg,
      deltaH
    }
  }), [h, r, sourcePowerKw, attenuationAlpha, beamDirectivityExp, receiverApertureM2, perturbedNodeIndex, deltaR, deltaThetaDeg, deltaH]);

  // Solve current architecture
  const solution = useMemo(() => solveGeometricArchitecture(geoConfig), [geoConfig]);

  // Sweep dimensionless ratio rho = r / h
  const sweep = useMemo(() => sweepDimensionlessRatio(
    h,
    0.2,
    2.5,
    30,
    sourcePowerKw,
    attenuationAlpha,
    beamDirectivityExp,
    receiverApertureM2
  ), [h, sourcePowerKw, attenuationAlpha, beamDirectivityExp, receiverApertureM2]);

  // Compute sensitivity gradients
  const sensitivity = useMemo(() => computeGeometricSensitivity(geoConfig), [geoConfig]);

  // Canvas ref for 2D/pseudo-3D orthographic projection
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render diagram on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Coordinate space mapping
    const centerX = width * 0.48;
    const centerY = height * 0.58;
    // Projection scale: fit radius of ~120m into canvas
    const maxDimension = Math.max(r, h, 60) * 1.6;
    const scale = Math.min(width, height) / (maxDimension * 2.2);

    // Isometry / slant angles
    const slantX = 1.0;
    const slantY = 0.5; // squish Y to give 3D perspective of z=0 ground plane

    // Draw ground coordinate grid / ring boundary
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, r * scale, r * scale * slantY, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "#252B3A";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Source Node N_0 at (0, 0, h)
    const effectiveH = h + deltaH;
    const sourceScreenX = centerX;
    const sourceScreenY = centerY - effectiveH * scale * 0.9;

    // Draw vertical mast / height datum line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(sourceScreenX, sourceScreenY);
    ctx.strokeStyle = "#4ADE80";
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Mast ground base point
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#2D3748";
    ctx.fill();

    // Projected ground node coordinates
    const screenNodes = solution.nodes.map(n => {
      const sx = centerX + n.x * scale * slantX;
      const sy = centerY + n.y * scale * slantY;
      return { ...n, sx, sy };
    });

    // Draw Hexagonal chords (between adjacent nodes k -> k+1)
    ctx.beginPath();
    for (let k = 0; k < screenNodes.length; k++) {
      const curr = screenNodes[k];
      const next = screenNodes[(k + 1) % screenNodes.length];
      if (k === 0) ctx.moveTo(curr.sx, curr.sy);
      else ctx.lineTo(curr.sx, curr.sy);
    }
    ctx.closePath();
    ctx.strokeStyle = geoConfig.isSymmetric ? "#C5A059" : "#F59E0B";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Draw propagation rays from Source N_0 to each Receiver N_k
    screenNodes.forEach((n, idx) => {
      const isPerturbed = !geoConfig.isSymmetric && idx === perturbedNodeIndex;
      ctx.beginPath();
      ctx.moveTo(sourceScreenX, sourceScreenY);
      ctx.lineTo(n.sx, n.sy);
      ctx.strokeStyle = isPerturbed ? "rgba(248, 113, 113, 0.7)" : "rgba(80, 158, 227, 0.4)";
      ctx.lineWidth = isPerturbed ? 2.5 : 1.2;
      ctx.stroke();

      // Power reception glow halo around receiver node
      const powerRadius = Math.min(18, Math.max(5, n.receivedPowerKw * 1.5));
      const grad = ctx.createRadialGradient(n.sx, n.sy, 2, n.sx, n.sy, powerRadius);
      grad.addColorStop(0, isPerturbed ? "rgba(248, 113, 113, 0.9)" : "rgba(80, 158, 227, 0.8)");
      grad.addColorStop(1, "rgba(80, 158, 227, 0.0)");
      ctx.beginPath();
      ctx.arc(n.sx, n.sy, powerRadius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Node marker circle
      ctx.beginPath();
      ctx.arc(n.sx, n.sy, isPerturbed ? 6 : 4.5, 0, Math.PI * 2);
      ctx.fillStyle = isPerturbed ? "#F87171" : "#509EE3";
      ctx.fill();
      ctx.strokeStyle = "#0B0C0E";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label N_k
      ctx.fillStyle = isPerturbed ? "#FCA5A5" : "#E6E4DF";
      ctx.font = "bold 11px monospace";
      ctx.fillText(`N_${idx}`, n.sx + 8, n.sy + 4);

      // Value label: P_k
      ctx.fillStyle = isPerturbed ? "#F87171" : "#8A95AA";
      ctx.font = "9px monospace";
      ctx.fillText(`${n.receivedPowerKw.toFixed(2)} kW`, n.sx + 8, n.sy + 16);
    });

    // Draw Source Node N_0
    const sourceGrad = ctx.createRadialGradient(sourceScreenX, sourceScreenY, 2, sourceScreenX, sourceScreenY, 22);
    sourceGrad.addColorStop(0, "rgba(74, 222, 128, 1)");
    sourceGrad.addColorStop(0.4, "rgba(74, 222, 128, 0.6)");
    sourceGrad.addColorStop(1, "rgba(74, 222, 128, 0)");
    ctx.beginPath();
    ctx.arc(sourceScreenX, sourceScreenY, 22, 0, Math.PI * 2);
    ctx.fillStyle = sourceGrad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(sourceScreenX, sourceScreenY, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#4ADE80";
    ctx.fill();
    ctx.strokeStyle = "#0B0C0E";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label N_0
    ctx.fillStyle = "#4ADE80";
    ctx.font = "bold 12px monospace";
    ctx.fillText(`N_0 (Source, h=${effectiveH}m)`, sourceScreenX + 12, sourceScreenY - 6);
    ctx.fillStyle = "#8A95AA";
    ctx.font = "10px monospace";
    ctx.fillText(`${sourcePowerKw} kW radiated`, sourceScreenX + 12, sourceScreenY + 8);

    // Annotations overlay: elevation angle & chord
    ctx.fillStyle = "#C5A059";
    ctx.font = "10px monospace";
    ctx.fillText(`Chord s = ${solution.nominalChordDistanceM.toFixed(1)}m (= r)`, centerX - 60, centerY + (r * scale * slantY) + 20);
    ctx.fillText(`Elevation α = ${solution.nominalElevationAngleDeg.toFixed(1)}°`, sourceScreenX - 110, sourceScreenY + 25);
  }, [solution, geoConfig, h, r, deltaH, deltaR, deltaThetaDeg, sourcePowerKw, perturbedNodeIndex]);

  const handleResetToCanonical = () => {
    setH(50);
    setR(50);
    setDeltaR(0);
    setDeltaThetaDeg(0);
    setDeltaH(0);
  };

  const handleApplyOptimalRho = () => {
    const newR = Math.round(sweep.optimalRadiusM);
    setR(newR);
    setDeltaR(0);
    setDeltaThetaDeg(0);
    setDeltaH(0);
  };

  return (
    <div className="bg-[#12141A] border border-[#222733] rounded-xl p-6 space-y-6 text-[#E6E4DF]">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#1E2330] pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
            <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>PATHFINDER GEOMETRIC ARCHITECTURE SUBSTRATE</span>
            <span>•</span>
            <span className="text-[#509EE3]">G_0 REFERENCE BASELINE</span>
          </div>
          <h2 className="text-xl font-light tracking-tight text-[#E6E4DF] mt-1">
            Elevated Source $N_0(0,0,h)$ & 6-Node Hexagonal Receiver Ring $R_6(r)$
          </h2>
          <p className="text-xs text-[#8A8F9A] mt-1 max-w-3xl">
            Symmetric spatial baseline with identical propagation path d = √(h² + r²), 60° angular separation,
            and chord spacing s = r. Governed by dimensionless ratio ρ = r/h.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleResetToCanonical}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#181D26] hover:bg-[#222838] text-xs font-mono text-[#C5A059] border border-[#2A3344] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Canonical (h=50m, r=50m, ρ=1)</span>
          </button>
          <button
            onClick={handleApplyOptimalRho}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#132219] hover:bg-[#1A3324] text-xs font-mono text-[#4ADE80] border border-[#1E432A] cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Set Optimal ρ* ({sweep.optimalRho})</span>
          </button>
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex items-center space-x-2 border-b border-[#1E2330] pb-3 text-xs">
        <button
          onClick={() => setActiveTab("visualizer")}
          className={`px-3 py-1.5 rounded font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
            activeTab === "visualizer"
              ? "bg-[#1C2230] text-[#E6E4DF] border border-[#333E54]"
              : "text-[#8A8F9A] hover:text-[#C8CAD0]"
          }`}
        >
          <Box className="w-3.5 h-3.5 text-[#509EE3]" />
          <span>1. Geometric Visualizer & Core Metrics</span>
        </button>
        <button
          onClick={() => setActiveTab("ratio_optimization")}
          className={`px-3 py-1.5 rounded font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
            activeTab === "ratio_optimization"
              ? "bg-[#1C2230] text-[#E6E4DF] border border-[#333E54]"
              : "text-[#8A8F9A] hover:text-[#C8CAD0]"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-[#4ADE80]" />
          <span>2. Dimensionless Ratio ρ = r/h Optimization</span>
        </button>
        <button
          onClick={() => setActiveTab("sensitivity")}
          className={`px-3 py-1.5 rounded font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
            activeTab === "sensitivity"
              ? "bg-[#1C2230] text-[#E6E4DF] border border-[#333E54]"
              : "text-[#8A8F9A] hover:text-[#C8CAD0]"
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>3. Symmetry Breaking & Sensitivity Lab</span>
        </button>
        <button
          onClick={() => setActiveTab("comparison")}
          className={`px-3 py-1.5 rounded font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
            activeTab === "comparison"
              ? "bg-[#1C2230] text-[#E6E4DF] border border-[#333E54]"
              : "text-[#8A8F9A] hover:text-[#C8CAD0]"
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>4. Candidate Geometries Taxonomy</span>
        </button>
      </div>

      {/* TAB 1: VISUALIZER & CORE METRICS */}
      {activeTab === "visualizer" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interactive Canvas */}
            <div className="lg:col-span-7 bg-[#0B0D12] border border-[#1E2330] rounded-lg p-3 relative flex flex-col items-center justify-center">
              <canvas
                ref={canvasRef}
                width={560}
                height={400}
                className="w-full max-w-[560px] h-[400px] block"
              />
              <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#73829C] border-t border-[#1C222E] pt-2 px-2">
                <span>Elevation Model: N_0(0,0,{h+deltaH}) · 6 Receivers on z=0 plane</span>
                <span className="text-[#C5A059]">
                  {geoConfig.isSymmetric ? "Strict Hexagonal D_6h Symmetry" : "Symmetry Broken (ΔG Active)"}
                </span>
              </div>
            </div>

            {/* Geometry Parameters & Math Box */}
            <div className="lg:col-span-5 space-y-4">
              {/* Core Dimension Sliders */}
              <div className="bg-[#0F1218] border border-[#222838] p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#C5A059] uppercase font-bold">Geometry Controls (G)</span>
                  <span className="text-[10px] font-mono text-[#509EE3]">[MEASURED / SPECIFIED]</span>
                </div>

                {/* Height Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-[#8A8F9A]">Source Elevation (h):</span>
                    <span className="text-[#E6E4DF] font-bold">{h} m</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    step="5"
                    value={h}
                    onChange={(e) => setH(Number(e.target.value))}
                    className="w-full accent-[#4ADE80] cursor-pointer"
                  />
                </div>

                {/* Radius Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-[#8A8F9A]">Receiver Ring Radius (r):</span>
                    <span className="text-[#E6E4DF] font-bold">{r} m</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    step="5"
                    value={r}
                    onChange={(e) => setR(Number(e.target.value))}
                    className="w-full accent-[#509EE3] cursor-pointer"
                  />
                </div>

                {/* Source Power Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-[#8A8F9A]">Source Radiated Power (P_0):</span>
                    <span className="text-[#E6E4DF] font-bold">{sourcePowerKw} kW</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={sourcePowerKw}
                    onChange={(e) => setSourcePowerKw(Number(e.target.value))}
                    className="w-full accent-[#C5A059] cursor-pointer"
                  />
                </div>
              </div>

              {/* Mathematical Invariants Summary Card */}
              <div className="bg-[#141822] border border-[#232B3B] p-4 rounded-lg space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#4ADE80]">
                  <span>Mathematical Invariants of G_0</span>
                  <span className="text-[#A855F7]">[ESTIMATED / CALCULATED]</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-[#0C0E14] p-2 rounded border border-[#1C2330]">
                    <span className="text-[#73829C] block text-[10px]">Dimensionless Ratio (ρ = r/h)</span>
                    <span className="text-[#E6E4DF] text-sm font-bold">{solution.dimensionlessRatioRho.toFixed(3)}</span>
                    <span className="text-[10px] text-[#C5A059] block">
                      {solution.dimensionlessRatioRho < 0.95 ? "Steep (< 1)" : solution.dimensionlessRatioRho > 1.05 ? "Wide (> 1)" : "Canonical 45° (≈ 1.0)"}
                    </span>
                  </div>

                  <div className="bg-[#0C0E14] p-2 rounded border border-[#1C2330]">
                    <span className="text-[#73829C] block text-[10px]">Path Length (d = √(h²+r²))</span>
                    <span className="text-[#509EE3] text-sm font-bold">{solution.nominalPathLength.toFixed(2)} m</span>
                    <span className="text-[10px] text-[#73829C] block">Equal for all nodes</span>
                  </div>

                  <div className="bg-[#0C0E14] p-2 rounded border border-[#1C2330]">
                    <span className="text-[#73829C] block text-[10px]">Elevation Slant Angle (α)</span>
                    <span className="text-[#C5A059] text-sm font-bold">{solution.nominalElevationAngleDeg.toFixed(1)}°</span>
                    <span className="text-[10px] text-[#73829C] block">atan(h / r)</span>
                  </div>

                  <div className="bg-[#0C0E14] p-2 rounded border border-[#1C2330]">
                    <span className="text-[#73829C] block text-[10px]">Adjacent Chord Spacing (s)</span>
                    <span className="text-[#4ADE80] text-sm font-bold">{solution.nominalChordDistanceM.toFixed(1)} m</span>
                    <span className="text-[10px] text-[#4ADE80] block">s = 2r sin(π/6) = r</span>
                  </div>
                </div>

                {/* Transfer Efficiency & Power Box */}
                <div className="bg-[#111C16] border border-[#1E3B28] p-2.5 rounded text-[11px] flex items-center justify-between">
                  <div>
                    <span className="text-[#8A95AA] block text-[10px]">Total Captured Power (∑ P_k)</span>
                    <span className="text-base font-bold text-[#4ADE80]">
                      {solution.totalReceivedPowerKw.toFixed(2)} kW
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#8A95AA] block text-[10px]">Transfer Efficiency (η)</span>
                    <span className="text-base font-bold text-[#4ADE80]">
                      {solution.transferEfficiencyPct.toFixed(2)} %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Node Reception Spectrum Table */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8F9A] font-bold">
              Hexagonal Ring Nodes State Vector (k = 0..5)
            </span>
            <div className="border border-[#222838] rounded-lg overflow-hidden font-mono text-xs">
              <div className="bg-[#141720] px-4 py-2 border-b border-[#222838] grid grid-cols-7 text-[#73829C] text-[10px] font-bold">
                <span>NODE</span>
                <span>AZIMUTH (θ_k)</span>
                <span>COORDINATES (x, y, z)</span>
                <span>PATH LENGTH (d_k)</span>
                <span>ELEVATION (α_k)</span>
                <span>CHORD TO NEXT (s_k)</span>
                <span>RECEIVED (P_k)</span>
              </div>
              <div className="divide-y divide-[#1B202D]">
                {solution.nodes.map((n, idx) => {
                  const isPerturbed = !geoConfig.isSymmetric && idx === perturbedNodeIndex;
                  return (
                    <div
                      key={n.id}
                      className={`px-4 py-2 grid grid-cols-7 items-center ${
                        isPerturbed ? "bg-[#251316] text-[#F87171]" : "hover:bg-[#151924]"
                      }`}
                    >
                      <span className="font-bold text-[#509EE3] flex items-center space-x-1">
                        <span>{n.name}</span>
                        {isPerturbed && <span className="text-[9px] text-[#F87171] font-bold">[ΔG]</span>}
                      </span>
                      <span>{n.thetaDeg.toFixed(1)}°</span>
                      <span className="text-[#8A95AA]">({n.x.toFixed(1)}, {n.y.toFixed(1)}, {n.z})</span>
                      <span className="text-[#E6E4DF]">{n.distanceFromSource.toFixed(2)} m</span>
                      <span className="text-[#C5A059]">{n.elevationAngleDeg.toFixed(1)}°</span>
                      <span className="text-[#4ADE80]">{n.chordToNextNode.toFixed(2)} m</span>
                      <span className="font-bold text-[#E6E4DF]">{n.receivedPowerKw.toFixed(3)} kW</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIMENSIONLESS RATIO RHO OPTIMIZATION */}
      {activeTab === "ratio_optimization" && (
        <div className="space-y-6 text-xs">
          <div className="bg-[#161B26] border-l-4 border-[#4ADE80] p-4 rounded-r-lg space-y-2">
            <div className="text-[11px] font-mono text-[#4ADE80] font-bold uppercase tracking-wider">
              MATHEMATICAL OBJECTIVE: ρ* = argmax_ρ η(ρ)
            </div>
            <p className="text-xs text-[#C8D0DF] leading-relaxed">
              &ldquo;We are no longer asking: &apos;What shape looks right?&apos; We are asking:
              <strong className="text-[#4ADE80] ml-1">
                Which geometric ratio maximises useful transfer under the physical constraints?
              </strong>&rdquo;
              The dimensionless parameter <code className="text-[#C5A059] font-mono font-bold">ρ = r / h</code> dictates
              the tradeoff between geometric spreading losses, beam inclination directivity $\cos(\alpha)^\beta$, and atmospheric attenuation.
            </p>
          </div>

          {/* Optimal Metrics Display */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-[#111C16] border border-[#1E3E28] p-3 rounded-lg">
              <span className="text-[10px] font-mono uppercase text-[#73829C] block">Optimal Ratio (ρ*)</span>
              <span className="text-xl font-mono font-bold text-[#4ADE80]">{sweep.optimalRho}</span>
              <span className="text-[10px] text-[#A3E6BA] block mt-0.5">Peak transmission locus</span>
            </div>
            <div className="bg-[#111C16] border border-[#1E3E28] p-3 rounded-lg">
              <span className="text-[10px] font-mono uppercase text-[#73829C] block">Peak Efficiency η(ρ*)</span>
              <span className="text-xl font-mono font-bold text-[#4ADE80]">{sweep.maxEfficiencyPct.toFixed(2)} %</span>
              <span className="text-[10px] text-[#A3E6BA] block mt-0.5">Under aperture & medium limits</span>
            </div>
            <div className="bg-[#131722] border border-[#222B3D] p-3 rounded-lg">
              <span className="text-[10px] font-mono uppercase text-[#73829C] block">Optimal Ring Radius (r*)</span>
              <span className="text-xl font-mono font-bold text-[#509EE3]">{sweep.optimalRadiusM.toFixed(1)} m</span>
              <span className="text-[10px] text-[#8A95AA] block mt-0.5">At current h = {h}m</span>
            </div>
            <div className="bg-[#18161D] border border-[#2B2438] p-3 rounded-lg">
              <span className="text-[10px] font-mono uppercase text-[#73829C] block">Optimal Elevation (α*)</span>
              <span className="text-xl font-mono font-bold text-[#C5A059]">{sweep.optimalElevationDeg.toFixed(1)}°</span>
              <span className="text-[10px] text-[#8A95AA] block mt-0.5">Slant angle from receiver</span>
            </div>
          </div>

          {/* Sweep Curve Table / Bar Plot Representation */}
          <div className="bg-[#0F1218] border border-[#222838] p-4 rounded-lg space-y-3 font-mono">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#8A8F9A] uppercase font-bold">Transfer Efficiency η vs. Dimensionless Ratio ρ</span>
              <span className="text-[#4ADE80] text-[10px]">Sweep: ρ ∈ [0.2, 2.5] in 30 steps</span>
            </div>

            <div className="space-y-1 max-h-72 overflow-y-auto pr-2">
              {sweep.points.map((pt) => {
                const isOptimal = Math.abs(pt.rho - sweep.optimalRho) < 0.02;
                const isCurrent = Math.abs(pt.rho - solution.dimensionlessRatioRho) < 0.05;
                const barWidth = Math.max(2, (pt.efficiencyPct / (sweep.maxEfficiencyPct || 1)) * 100);

                return (
                  <div
                    key={pt.rho}
                    onClick={() => setR(Math.round(pt.r))}
                    className={`flex items-center space-x-3 text-[11px] p-1.5 rounded cursor-pointer transition-colors ${
                      isOptimal
                        ? "bg-[#14261C] border border-[#254A34]"
                        : isCurrent
                        ? "bg-[#182230] border border-[#2A3A54]"
                        : "hover:bg-[#141720]"
                    }`}
                  >
                    <span className="w-14 text-right text-[#C5A059] font-bold">ρ = {pt.rho.toFixed(2)}</span>
                    <span className="w-16 text-[#73829C] text-[10px]">r={pt.r}m</span>
                    <span className="w-16 text-[#73829C] text-[10px]">d={pt.pathLength}m</span>
                    <span className="w-16 text-[#73829C] text-[10px]">α={pt.elevationAngleDeg}°</span>

                    {/* Visual Bar */}
                    <div className="flex-1 bg-[#1A1F2C] h-4 rounded overflow-hidden relative">
                      <div
                        style={{ width: `${barWidth}%` }}
                        className={`h-full ${
                          isOptimal ? "bg-[#4ADE80]" : isCurrent ? "bg-[#509EE3]" : "bg-[#333E54]"
                        }`}
                      />
                      <span className="absolute right-2 top-0 text-[10px] font-bold text-[#E6E4DF] leading-4">
                        {pt.efficiencyPct.toFixed(2)}% ({pt.totalReceivedPowerKw.toFixed(2)} kW)
                      </span>
                    </div>

                    {isOptimal && (
                      <span className="text-[9px] bg-[#4ADE80] text-[#0D0E11] px-1.5 py-0.5 rounded font-bold">
                        OPTIMAL ρ*
                      </span>
                    )}
                    {isCurrent && !isOptimal && (
                      <span className="text-[9px] bg-[#509EE3] text-[#0D0E11] px-1.5 py-0.5 rounded font-bold">
                        CURRENT
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SYMMETRY BREAKING & SENSITIVITY LAB */}
      {activeTab === "sensitivity" && (
        <div className="space-y-6 text-xs">
          <div className="bg-[#1C1618] border-l-4 border-[#F59E0B] p-4 rounded-r-lg space-y-2">
            <div className="text-[11px] font-mono text-[#F59E0B] font-bold uppercase tracking-wider">
              SYMMETRY BREAKING PIPELINE: G → field solution → P_i → η → sensitivity to ΔG
            </div>
            <p className="text-xs text-[#C8D0DF] leading-relaxed">
              Start with perfect symmetry <code className="text-[#4ADE80] font-mono font-bold">P_1 = P_2 = ... = P_6</code>.
              Deliberately perturb one geometric degree of freedom: radial distance $r_3 \neq r$, angular position $\theta_4 \neq 60^\circ$,
              or source height $h \rightarrow h + \Delta h$. Observe the resulting power reception deviations $\Delta P_i$ and the system&apos;s
              sensitivity matrix $\partial P / \partial G$.
            </p>
          </div>

          {/* Interactive Perturbation Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0F1218] p-4 rounded-lg border border-[#222838]">
            {/* Radial Perturbation */}
            <div className="space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-[#8A8F9A]">Radial Perturbation (Δr on N_{perturbedNodeIndex}):</span>
                <span className="text-[#F87171] font-bold">{deltaR > 0 ? `+${deltaR}` : deltaR} m</span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                step="1"
                value={deltaR}
                onChange={(e) => setDeltaR(Number(e.target.value))}
                className="w-full accent-[#F87171] cursor-pointer"
              />
              <div className="text-[10px] text-[#73829C]">Perturbs r_{perturbedNodeIndex} from {r}m to {r + deltaR}m</div>
            </div>

            {/* Angular Perturbation */}
            <div className="space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-[#8A8F9A]">Angular Displacement (Δθ on N_{perturbedNodeIndex}):</span>
                <span className="text-[#F59E0B] font-bold">{deltaThetaDeg > 0 ? `+${deltaThetaDeg}` : deltaThetaDeg}°</span>
              </div>
              <input
                type="range"
                min="-25"
                max="25"
                step="1"
                value={deltaThetaDeg}
                onChange={(e) => setDeltaThetaDeg(Number(e.target.value))}
                className="w-full accent-[#F59E0B] cursor-pointer"
              />
              <div className="text-[10px] text-[#73829C]">Shifts node azimuth off canonical 60° grid</div>
            </div>

            {/* Height Perturbation */}
            <div className="space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-[#8A8F9A]">Elevation Displacement (Δh):</span>
                <span className="text-[#509EE3] font-bold">{deltaH > 0 ? `+${deltaH}` : deltaH} m</span>
              </div>
              <input
                type="range"
                min="-15"
                max="15"
                step="1"
                value={deltaH}
                onChange={(e) => setDeltaH(Number(e.target.value))}
                className="w-full accent-[#509EE3] cursor-pointer"
              />
              <div className="text-[10px] text-[#73829C]">Shifts source height to {h + deltaH}m</div>
            </div>
          </div>

          {/* Perturbation Diagnostics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono">
            <div className="bg-[#141720] border border-[#222838] p-3 rounded-lg">
              <span className="text-[10px] text-[#73829C] block">Power Imbalance (max/min)</span>
              <span className={`text-lg font-bold ${solution.powerImbalanceRatio > 1.1 ? "text-[#F87171]" : "text-[#4ADE80]"}`}>
                {solution.powerImbalanceRatio.toFixed(3)}x
              </span>
              <span className="text-[10px] text-[#8A95AA] block">1.000 = perfect balance</span>
            </div>

            <div className="bg-[#141720] border border-[#222838] p-3 rounded-lg">
              <span className="text-[10px] text-[#73829C] block">Path Length Variance</span>
              <span className={`text-lg font-bold ${solution.pathLengthVarianceM2 > 0.1 ? "text-[#F59E0B]" : "text-[#4ADE80]"}`}>
                {solution.pathLengthVarianceM2.toFixed(3)} m²
              </span>
              <span className="text-[10px] text-[#8A95AA] block">0.000 = isometric paths</span>
            </div>

            <div className="bg-[#141720] border border-[#222838] p-3 rounded-lg">
              <span className="text-[10px] text-[#73829C] block">Symmetry Loss Index (σ/μ)</span>
              <span className={`text-lg font-bold ${sensitivity.symmetryLossIndex > 5 ? "text-[#F87171]" : "text-[#4ADE80]"}`}>
                {sensitivity.symmetryLossIndex.toFixed(2)} %
              </span>
              <span className="text-[10px] text-[#8A95AA] block">Coeff. of variation</span>
            </div>

            <div className="bg-[#141720] border border-[#222838] p-3 rounded-lg">
              <span className="text-[10px] text-[#73829C] block">Radial Sensitivity (∂P/∂r)</span>
              <span className="text-lg font-bold text-[#509EE3]">
                {sensitivity.radialSensitivityKwPerM} kW/m
              </span>
              <span className="text-[10px] text-[#8A95AA] block">Gradient response</span>
            </div>
          </div>

          {/* Deviations Table */}
          <div className="border border-[#222838] rounded-lg overflow-hidden font-mono text-xs">
            <div className="bg-[#141720] px-4 py-2 border-b border-[#222838] flex items-center justify-between text-[10px] text-[#73829C] font-bold">
              <span>NODE DEVIATION ANALYSIS (ΔP_i FROM SYMMETRIC BASELINE)</span>
              <span>PERTURBING NODE N_{perturbedNodeIndex}</span>
            </div>
            <div className="divide-y divide-[#1B202D]">
              {solution.nodes.map((n, idx) => {
                const isPerturbed = idx === perturbedNodeIndex && !geoConfig.isSymmetric;
                const symP = solution.nodes[0]?.receivedPowerKw || 1;
                const deltaP = n.receivedPowerKw - symP;

                return (
                  <div key={n.id} className={`px-4 py-2 flex items-center justify-between ${isPerturbed ? "bg-[#271317]" : ""}`}>
                    <span className="font-bold text-[#509EE3]">{n.name}</span>
                    <span className="text-[#8A95AA]">d = {n.distanceFromSource.toFixed(2)} m</span>
                    <span className="text-[#E6E4DF]">{n.receivedPowerKw.toFixed(3)} kW</span>
                    <span className={`font-bold ${deltaP < -0.01 ? "text-[#F87171]" : deltaP > 0.01 ? "text-[#4ADE80]" : "text-[#73829C]"}`}>
                      {deltaP > 0 ? `+${deltaP.toFixed(3)}` : deltaP.toFixed(3)} kW
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CANDIDATE GEOMETRIES TAXONOMY */}
      {activeTab === "comparison" && (
        <div className="space-y-4 text-xs">
          <div className="text-[11px] font-mono text-[#C5A059] uppercase font-bold tracking-wider">
            Comparative Architecture Taxonomy: Baseline G_0 vs. Alternative Geometries
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CANDIDATE_GEOMETRIES.map((geom) => {
              const isBaseline = geom.id === "ring_hexagon";

              return (
                <div
                  key={geom.id}
                  className={`p-4 rounded-lg border space-y-3 ${
                    isBaseline
                      ? "bg-[#111C16] border-[#1C3E28] ring-1 ring-[#4ADE80]/30"
                      : "bg-[#13161F] border-[#222838]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-[#E6E4DF]">{geom.name}</span>
                        {isBaseline && (
                          <span className="text-[9px] bg-[#4ADE80] text-[#0D0E11] px-1.5 py-0.5 rounded font-bold">
                            CANONICAL BASELINE
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-[#73829C] mt-0.5">{geom.symmetryClass}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-[#0C0E14] p-2.5 rounded border border-[#1C2330]">
                    <div>
                      <span className="text-[#73829C] block text-[9px]">PATH LENGTH UNIFORMITY</span>
                      <span className={isBaseline ? "text-[#4ADE80] font-bold" : "text-[#E6E4DF]"}>
                        {geom.pathLengthUniformity}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#73829C] block text-[9px]">CONTROL COMPLEXITY</span>
                      <span className="text-[#C5A059]">{geom.controlComplexity}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-[#4ADE80] font-bold">Key Advantages:</span>
                    <ul className="text-[#A0A8B8] list-disc list-inside text-[11px] space-y-0.5">
                      {geom.advantages.map((adv, i) => (
                        <li key={i}>{adv}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-[#F87171] font-bold">Disadvantages / Trade-offs:</span>
                    <ul className="text-[#D1A0A8] list-disc list-inside text-[11px] space-y-0.5">
                      {geom.disadvantages.map((dis, i) => (
                        <li key={i}>{dis}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-[11px] font-mono text-[#8A95AA] bg-[#0E1117] p-2 rounded border border-[#1A1F2C]">
                    <strong className="text-[#C5A059]">Pathfinder Verdict:</strong> {geom.recommendedApplication}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
