import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ALICE_TWIN_MODELS,
  ALICE_TWIN_CORRIDORS,
  AliceTwinModelId,
  calculateApertureMetrics,
  evaluateTouchDragGesture,
  evaluateModelRotationGesture,
  evaluatePinchZoomGesture,
  clampViewScale,
  computeGibsonAshbyCoupon,
  DeterministicApertureMetrics,
  Model3DRotationState
} from '@/lib/aliceTwinOperatorJourney';
import {
  Compass,
  Sliders,
  Eye,
  Shield,
  Zap,
  Activity,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  Info,
  Radio,
  Box,
  Orbit,
  Move
} from 'lucide-react';

export type JourneySpace = 'maps' | 'chair' | 'workbench';
export type TouchInteractionMode = 'aperture' | 'rotate3d';

interface AliceTwinCockpitJourneyProps {
  initialSpace?: JourneySpace;
  onNavigateToTab?: (tab: string) => void;
}

export const AliceTwinCockpitJourney: React.FC<AliceTwinCockpitJourneyProps> = ({
  initialSpace = 'chair',
  onNavigateToTab
}) => {
  // Navigation Space State (Maps -> Chair -> Workbench)
  const [currentSpace, setCurrentSpace] = useState<JourneySpace>(initialSpace);

  // Active Alice Twin Model & Corridor Selection
  const [selectedModelId, setSelectedModelId] = useState<AliceTwinModelId>('g6_coaxial_cavity');
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('corridor-solar-wind');

  // Single Bounded Parameter State (Source Aperture Offset Δx, Δy in pixels)
  // Physical conversion: 1px = 0.75mm; Bounded strictly to [-50, +50] px
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);

  // 3D Model Rotation State (Yaw -180° to 180°, Pitch -60° to +60°)
  const [modelRotation, setModelRotation] = useState<Model3DRotationState>({ yawDeg: 0, pitchDeg: 0 });

  // Touch Interaction Mode: 'aperture' (steer source) vs 'rotate3d' (rotate 3D model)
  const [touchMode, setTouchMode] = useState<TouchInteractionMode>('aperture');

  // Viewport Zoom Scale (clamped 0.75 to 1.70)
  const [viewScale, setViewScale] = useState<number>(1.0);

  // Touch gesture & drag references
  const pendingTouchRef = useRef<{
    id: number;
    startX: number;
    startY: number;
    startOffsetX: number;
    startOffsetY: number;
    startRotation: Model3DRotationState;
  } | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const isRotating3DRef = useRef<boolean>(false);
  const pointersMapRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStartDistRef = useRef<{ dist: number; initialScale: number } | null>(null);

  // Animation & Assist States
  const [isSeekingAlign, setIsSeekingAlign] = useState<boolean>(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [isInspectOpen, setIsInspectOpen] = useState<boolean>(false);

  // Workbench Coupon Parameters
  const [couponDensity, setCouponDensity] = useState<number>(0.28);
  const [couponFamily, setCouponFamily] = useState<'honeycomb' | 'octet' | 'open_cell_foam' | 'solid'>('honeycomb');

  // Pre-change snapshot for Before vs After Provenance Inspector
  const [baselineSnapshot, setBaselineSnapshot] = useState<{
    offsetX: number;
    offsetY: number;
    metrics: DeterministicApertureMetrics;
  }>(() => ({
    offsetX: 0,
    offsetY: 0,
    metrics: calculateApertureMetrics(0, 0)
  }));

  const activeModel = ALICE_TWIN_MODELS[selectedModelId];
  const activeCorridor = ALICE_TWIN_CORRIDORS.find((c) => c.id === selectedCorridorId) || ALICE_TWIN_CORRIDORS[0];

  // Pure Deterministic Physics Execution: Single State directly feeds functions
  const currentMetrics = calculateApertureMetrics(
    offsetX,
    offsetY,
    45.0,
    activeModel.nominalCavityRadiusMm,
    activeModel.baseFrequencyGhz
  );

  const couponMetrics = computeGibsonAshbyCoupon(couponDensity, couponFamily, 72.0);

  // Recenter aperture and 3D model orientation instantly
  const handleRecenter = useCallback(() => {
    setIsSeekingAlign(false);
    setOffsetX(0);
    setOffsetY(0);
    setModelRotation({ yawDeg: 0, pitchDeg: 0 });
    setStatusNotice('Sightline & 3D model recentred to nominal origin. State reset.');
  }, []);

  // Align to core smoothly with requestAnimationFrame deterministic easing
  const handleAlign = useCallback(() => {
    if (isSeekingAlign) return;
    if (currentMetrics.offsetRadiusMm < 0.2 && Math.abs(modelRotation.yawDeg) < 1 && Math.abs(modelRotation.pitchDeg) < 1) {
      setStatusNotice('Aperture and 3D model are already coaxial with CORE. Registration is a geometric state.');
      return;
    }
    setIsSeekingAlign(true);
    setStatusNotice('Registering aperture with core. Visual alignment is a model state, not a physical grant.');

    const startX = offsetX;
    const startY = offsetY;
    const startYaw = modelRotation.yawDeg;
    const startPitch = modelRotation.pitchDeg;
    const startTime = performance.now();
    const duration = 550; // ms

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1.0, elapsed / duration);
      // Ease-out cubic
      const factor = 1 - Math.pow(1 - progress, 3);
      const nextX = Math.round(startX * (1 - factor));
      const nextY = Math.round(startY * (1 - factor));
      const nextYaw = parseFloat((startYaw * (1 - factor)).toFixed(1));
      const nextPitch = parseFloat((startPitch * (1 - factor)).toFixed(1));
      
      setOffsetX(nextX);
      setOffsetY(nextY);
      setModelRotation({ yawDeg: nextYaw, pitchDeg: nextPitch });

      if (progress < 1.0) {
        requestAnimationFrame(step);
      } else {
        setOffsetX(0);
        setOffsetY(0);
        setModelRotation({ yawDeg: 0, pitchDeg: 0 });
        setIsSeekingAlign(false);
        setStatusNotice('Aperture aligned to core at Δr = 0.00 mm. Visual alignment is a model state, not a physical grant.');
      }
    };
    requestAnimationFrame(step);
  }, [offsetX, offsetY, modelRotation, isSeekingAlign, currentMetrics.offsetRadiusMm]);

  // Touch & Pointer Handlers for Cockpit Sightline (Threshold-based Gesture Handlers)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore clicks on UI buttons/chrome
    if ((e.target as HTMLElement).closest('[data-chrome]')) return;

    pointersMapRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Multi-touch pinch handling (pinch-to-zoom on mobile)
    if (pointersMapRef.current.size >= 2) {
      pendingTouchRef.current = null;
      isDraggingRef.current = false;
      isRotating3DRef.current = false;
      const pts = Array.from(pointersMapRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchStartDistRef.current = { dist, initialScale: viewScale };
      return;
    }

    if (isSeekingAlign) return;

    // Single touch pending threshold check
    pendingTouchRef.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startOffsetX: offsetX,
      startOffsetY: offsetY,
      startRotation: { ...modelRotation }
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointersMapRef.current.has(e.pointerId)) {
      pointersMapRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    // Handle 2-finger pinch zoom via evaluatePinchZoomGesture
    if (pointersMapRef.current.size >= 2 && pinchStartDistRef.current) {
      const pts = Array.from(pointersMapRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const pinchResult = evaluatePinchZoomGesture(
        pinchStartDistRef.current.dist,
        dist,
        pinchStartDistRef.current.initialScale,
        12 // 12px min pinch distance
      );
      if (pinchResult.isPinching) {
        setViewScale(pinchResult.newScale);
      }
      return;
    }

    const pending = pendingTouchRef.current;
    if (!pending || pending.id !== e.pointerId) return;

    // Route gesture based on active Touch Interaction Mode
    if (touchMode === 'rotate3d') {
      // 3D MODEL ROTATION GESTURE: Evaluate threshold-based rotation
      const rotResult = evaluateModelRotationGesture(
        pending.startX,
        pending.startY,
        e.clientX,
        e.clientY,
        pending.startRotation,
        18, // 18px threshold to prevent accidental rotation
        0.45 // 0.45 deg per pixel sensitivity
      );

      if (rotResult.isEngaged) {
        if (!isRotating3DRef.current) {
          isRotating3DRef.current = true;
          setStatusNotice(null);
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            // Ignore capture failure on older engines
          }
        }
        setModelRotation({
          yawDeg: rotResult.yawDeg,
          pitchDeg: rotResult.pitchDeg
        });
      }
      return;
    }

    // APERTURE STEERING GESTURE: Handle 1-finger drag with threshold & scroll discrimination
    if (!isDraggingRef.current) {
      const gesture = evaluateTouchDragGesture(
        pending.startX,
        pending.startY,
        e.clientX,
        e.clientY,
        18 // 18px threshold
      );

      if (gesture.isScrollDominant) {
        // Vertical swipe dominates: cancel drag so mobile page can scroll naturally
        pendingTouchRef.current = null;
        return;
      }

      if (gesture.shouldDrag) {
        isDraggingRef.current = true;
        setStatusNotice(null);
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // Fallback if pointer capture unsupported
        }
      }
    }

    if (isDraggingRef.current) {
      const dx = e.clientX - pending.startX;
      const dy = e.clientY - pending.startY;
      
      // Sensitivity scale factor
      const scaleFactor = 0.35;
      const targetX = Math.max(-50, Math.min(50, Math.round(pending.startOffsetX + dx * scaleFactor)));
      const targetY = Math.max(-50, Math.min(50, Math.round(pending.startOffsetY + dy * scaleFactor)));

      setOffsetX(targetX);
      setOffsetY(targetY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    pointersMapRef.current.delete(e.pointerId);
    if (pointersMapRef.current.size < 2) {
      pinchStartDistRef.current = null;
    }
    if (pendingTouchRef.current?.id === e.pointerId) {
      pendingTouchRef.current = null;
    }
    isDraggingRef.current = false;
    isRotating3DRef.current = false;
  };

  // Keyboard accessibility controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentSpace !== 'chair') return;
      if (e.key === 'Home' || e.key === 'Escape') {
        e.preventDefault();
        handleRecenter();
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        setIsInspectOpen((v) => !v);
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setViewScale((s) => clampViewScale(s + 0.15));
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        setViewScale((s) => clampViewScale(s - 0.15));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setOffsetX((x) => Math.max(-50, x - 2));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setOffsetX((x) => Math.min(50, x + 2));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setOffsetY((y) => Math.max(-50, y - 2));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setOffsetY((y) => Math.min(50, y + 2));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSpace, handleRecenter]);

  // Contextual Next-Action Logic
  const getContextualAction = () => {
    if (currentMetrics.octagonContainment === 'BREACH_CRITICAL_TRIP') {
      return {
        label: 'Recover to Core',
        action: handleAlign,
        stateLine: 'CRITICAL OMEGA_SAFE BREACH: RECOVER APERTURE',
        isWarning: true
      };
    }
    if (currentMetrics.symmetryCondition === 'ASYMMETRIC_VECTORING') {
      return {
        label: 'Align to Core',
        action: handleAlign,
        stateLine: `ASYMMETRIC VECTORING (F_perp = ${currentMetrics.transverseThrustN.toFixed(1)} N)`,
        isWarning: false
      };
    }
    return {
      label: 'Enter Workbench',
      action: () => setCurrentSpace('workbench'),
      stateLine: 'COAXIAL SYMMETRIC CRUISE (F_perp ≈ 0)',
      isWarning: false
    };
  };

  const contextual = getContextualAction();

  return (
    <div
      className="relative w-full h-[100dvh] max-h-screen bg-[#07090E] text-[#E6E4DF] font-mono overflow-hidden select-none flex flex-col"
      data-space={currentSpace}
      data-model={selectedModelId}
      data-view-scale={viewScale.toFixed(2)}
    >
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* SPACE 1: MAPS (Corridor Network & Alice Twin Model Selection)             */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {currentSpace === 'maps' && (
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 max-w-4xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between border-b border-[#22252D] pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-widest">
                ALICE TWIN · TRANSIT CORRIDORS &amp; MODELS
              </span>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Select Model State or Waveguide Corridor
              </h1>
            </div>
            <button
              onClick={() => setCurrentSpace('chair')}
              className="px-4 py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0D0E11] font-bold text-xs rounded transition-colors"
            >
              Enter Cockpit Chair →
            </button>
          </div>

          {/* Model Switcher Cards */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-[#8A8F9A] uppercase tracking-wider">
              1. Digital Twin Physical Substrates
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.values(ALICE_TWIN_MODELS) as typeof activeModel[]).map((m) => {
                const isSelected = m.id === selectedModelId;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedModelId(m.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#151922] border-[#C5A059] ring-1 ring-[#C5A059]/40 shadow-lg'
                        : 'bg-[#0E1015] border-[#1C2029] hover:border-[#2C3345] text-[#8A8F9A]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white">{m.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#101F30] text-[#509EE3] border border-[#509EE3]/30 font-semibold">
                        {m.domain}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A2A7B5] leading-relaxed mb-2.5">
                      {m.description}
                    </p>
                    <div className="flex items-center justify-between text-[10px] border-t border-[#1F232D] pt-2">
                      <span className="text-[#8A8F9A]">Anchor Receipt:</span>
                      <span className="font-semibold text-[#4ADE80]">
                        {m.primaryEpistemicAnchor.receiptId} [MEASURED]
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Corridor Selection */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-[#8A8F9A] uppercase tracking-wider">
              2. Waveguide Corridors &amp; Environmental Bounds
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ALICE_TWIN_CORRIDORS.map((c) => {
                const isSelected = c.id === selectedCorridorId;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCorridorId(c.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#151922] border-[#509EE3] ring-1 ring-[#509EE3]/40 shadow-lg'
                        : 'bg-[#0E1015] border-[#1C2029] hover:border-[#2C3345]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{c.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#2D1B10] text-[#F59E0B] border border-[#F59E0B]/30 font-semibold">
                        {c.epistemicClass}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#8A8F9A] space-y-0.5">
                      <div>Origin: <span className="text-[#E6E4DF]">{c.originName}</span></div>
                      <div>Destination: <span className="text-[#E6E4DF]">{c.destinationName}</span></div>
                      <div>Z₀ Impedance: <span className="text-[#C5A059]">{c.nominalZ0Ohms.toFixed(1)} Ω</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#0E1117] border border-[#222734] text-xs text-[#8A8F9A] space-y-1.5">
            <div className="font-bold text-white uppercase text-[10px] tracking-wider text-[#C5A059]">
              Workmanship Principle: Non-Merger Domain Rigor
            </div>
            <p>
              The cockpit sightline operates exclusively on Alice Twin&apos;s physical cavity parameters and deterministic Maxwellian equations. Selecting a corridor project sets boundary impedance ($Z_0 = 377\,\Omega$) and nominal carrier constraints without inventing hypothetical rail couplings.
            </p>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* SPACE 2: CHAIR (Cockpit Seat Sightline with Touch Gestures)                */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {currentSpace === 'chair' && (
        <div
          className="relative flex-1 w-full h-full overflow-hidden touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Top Floating Chrome: Title, Model Name, and Zoom Controls */}
          <div
            data-chrome
            className="absolute top-[max(0.75rem,env(safe-area-inset-top,0px))] inset-x-4 z-20 flex items-center justify-between pointer-events-none"
          >
            <div className="pointer-events-auto bg-[#0E1117]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#222734] shadow-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
              <div className="leading-tight">
                <div className="text-[9px] uppercase tracking-wider text-[#C5A059] font-bold">
                  ALICE TWIN COCKPIT
                </div>
                <div className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                  {activeModel.name}
                </div>
              </div>
            </div>

            {/* Pinch/Zoom Button Controls (min 48px touch targets for mobile) */}
            <div className="pointer-events-auto flex items-center gap-1.5 bg-[#0E1117]/85 backdrop-blur-md p-1 rounded-lg border border-[#222734] shadow-lg">
              <button
                type="button"
                aria-label="Zoom out"
                onClick={() => setViewScale((s) => clampViewScale(s - 0.15))}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded flex items-center justify-center text-sm font-bold text-white bg-[#1A1E29] hover:bg-[#252C3D] active:scale-95 transition-all"
              >
                −
              </button>
              <span className="text-[10px] font-mono text-[#8A8F9A] px-1 min-w-[36px] text-center">
                {Math.round(viewScale * 100)}%
              </span>
              <button
                type="button"
                aria-label="Zoom in"
                onClick={() => setViewScale((s) => clampViewScale(s + 0.15))}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded flex items-center justify-center text-sm font-bold text-white bg-[#1A1E29] hover:bg-[#252C3D] active:scale-95 transition-all"
              >
                +
              </button>
            </div>
          </div>

          {/* First-Person Sightline SVG Canvas: Single State feeds Rendering Layer */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
              viewBox="0 0 800 600"
              className="w-full h-full max-h-screen object-contain"
              style={{
                transform: `scale(${viewScale})`,
                transformOrigin: 'center center',
                transition: isSeekingAlign ? 'none' : 'transform 0.1s ease-out'
              }}
            >
              <defs>
                {/* Cosmos Backdrop Gradient */}
                <radialGradient id="cosmosGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0B1528" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#060A12" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#020306" stopOpacity="1" />
                </radialGradient>

                {/* Aperture Stator Ring Glow */}
                <radialGradient id="statorGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="70%" stopColor="#509EE3" stopOpacity="0" />
                  <stop offset="100%" stopColor="#509EE3" stopOpacity="0.25" />
                </radialGradient>

                {/* Poynting Vector Beam Gradient */}
                <linearGradient id="poyntingBeamGrad" x1="400" y1="300" x2={400 + offsetX * 3} y2={300 + offsetY * 3} gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#509EE3" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.95" />
                </linearGradient>
              </defs>

              {/* Background */}
              <rect x="0" y="0" width="800" height="600" fill="url(#cosmosGlow)" />

              {/* Horizon & Guide Grid (CONCEPT) */}
              <g stroke="#161B26" strokeWidth="1" strokeDasharray="3 3">
                <line x1="0" y1="300" x2="800" y2="300" />
                <line x1="400" y1="0" x2="400" y2="600" />
                <circle cx="400" cy="300" r="80" fill="none" />
                <circle cx="400" cy="300" r="160" fill="none" />
                <circle cx="400" cy="300" r="240" fill="none" />
              </g>

              {/* Octagon Sovereign Containment Boundary Limit (Omega_safe) */}
              <circle
                cx="400"
                cy="300"
                r="120"
                fill="none"
                stroke={currentMetrics.octagonContainment === 'CONTAINED_WITHIN_OMEGA_SAFE' ? '#10B981' : '#EF4444'}
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity={currentMetrics.octagonContainment === 'CONTAINED_WITHIN_OMEGA_SAFE' ? 0.4 : 0.9}
              />
              <text
                x="400"
                y="172"
                textAnchor="middle"
                fill={currentMetrics.octagonContainment === 'CONTAINED_WITHIN_OMEGA_SAFE' ? '#10B981' : '#EF4444'}
                fontSize="9"
                fontFamily="monospace"
                opacity="0.8"
              >
                Ω_safe BOUNDARY (15.0mm)
              </text>

              {/* G6 Hexagonal Stator Frame & 6 Nodal Receivers */}
              <g id="g6-stator-nodes">
                {[0, 1, 2, 3, 4, 5].map((idx) => {
                  const angle = (Math.PI / 3) * idx - Math.PI / 2;
                  const radius = 220;
                  const nx = 400 + Math.cos(angle) * radius;
                  const ny = 300 + Math.sin(angle) * radius;
                  const power = currentMetrics.nodalPowerDistribution[idx] || 5.2;

                  return (
                    <g key={idx}>
                      {/* Radial line from origin */}
                      <line
                        x1="400"
                        y1="300"
                        x2={nx}
                        y2={ny}
                        stroke="#222B3D"
                        strokeWidth="1"
                      />
                      {/* Outer receiver node box */}
                      <circle
                        cx={nx}
                        cy={ny}
                        r="12"
                        fill="#0C121E"
                        stroke={power > 6.0 ? '#F59E0B' : '#509EE3'}
                        strokeWidth="1.5"
                      />
                      <text
                        x={nx}
                        y={ny + 3}
                        textAnchor="middle"
                        fill="#E6E4DF"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        P{idx + 1}
                      </text>
                      <text
                        x={nx}
                        y={ny + 22}
                        textAnchor="middle"
                        fill="#8A8F9A"
                        fontSize="8"
                        fontFamily="monospace"
                      >
                        {power.toFixed(1)}W
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* Dynamic Transverse Poynting Vector Beam (SIMULATED_BEHAVIOUR) */}
              {currentMetrics.offsetRadiusMm >= 0.75 && (
                <g id="poynting-vector-beam">
                  <line
                    x1="400"
                    y1="300"
                    x2={400 + offsetX * 3}
                    y2={300 + offsetY * 3}
                    stroke="url(#poyntingBeamGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Arrowhead */}
                  <circle
                    cx={400 + offsetX * 3}
                    cy={300 + offsetY * 3}
                    r="5"
                    fill="#F59E0B"
                    stroke="#FFF"
                    strokeWidth="1"
                  />
                </g>
              )}

              {/* Central Core Crosshairs (Origin) */}
              <g stroke="#C5A059" strokeWidth="1" opacity="0.6">
                <line x1="380" y1="300" x2="420" y2="300" />
                <line x1="400" y1="280" x2="400" y2="320" />
                <circle cx="400" cy="300" r="4" fill="none" />
              </g>

              {/* Steerable Source Aperture Reticle (CONFIGURED_INPUT) */}
              <g
                id="steerable-reticle"
                transform={`translate(${400 + offsetX * 3}, ${300 + offsetY * 3})`}
              >
                {/* Glow ring */}
                <circle
                  cx="0"
                  cy="0"
                  r="24"
                  fill="none"
                  stroke={currentMetrics.symmetryCondition === 'SYMMETRIC_COAXIAL' ? '#509EE3' : '#F59E0B'}
                  strokeWidth="2"
                  strokeDasharray={currentMetrics.symmetryCondition === 'SYMMETRIC_COAXIAL' ? undefined : '3 2'}
                />
                {/* Inner target crosshairs */}
                <line x1="-12" y1="0" x2="12" y2="0" stroke="#FFF" strokeWidth="1.5" />
                <line x1="0" y1="-12" x2="0" y2="12" stroke="#FFF" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="3" fill="#FFF" />

                {/* Reticle Displacement Label */}
                <text
                  x="0"
                  y="-30"
                  textAnchor="middle"
                  fill="#FFF"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                  className="drop-shadow"
                >
                  Δr = {currentMetrics.offsetRadiusMm.toFixed(2)}mm
                </text>
                <text
                  x="0"
                  y="-42"
                  textAnchor="middle"
                  fill="#8A8F9A"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  [CONFIGURED_INPUT]
                </text>
              </g>

              {/* Alabaster Canopy Framing Overlay */}
              <path
                d="M 50,0 Q 400,90 750,0 L 800,0 L 800,600 L 740,600 Q 400,520 60,600 L 0,600 L 0,0 Z"
                fill="#05070B"
                opacity="0.5"
                stroke="#1B2230"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* Live Parameter Change HUD Banner */}
          {statusNotice && (
            <div
              data-chrome
              className="absolute top-20 inset-x-4 z-20 max-w-md mx-auto bg-[#111724]/90 backdrop-blur-md px-3 py-2 rounded-lg border border-[#3B82F6]/50 shadow-xl text-center"
            >
              <p className="text-[11px] text-[#93C5FD] font-mono leading-tight">
                {statusNotice}
              </p>
            </div>
          )}

          {/* Quick Steering Instructions Indicator */}
          <div
            data-chrome
            className="absolute bottom-36 inset-x-4 z-10 flex justify-center pointer-events-none"
          >
            <div className="bg-[#0A0D14]/80 backdrop-blur px-3 py-1 rounded-full border border-[#1F2533] text-[10px] text-[#717888] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#509EE3]" />
              <span>Touch &amp; drag horizontally (&gt;18px threshold) or pinch to zoom</span>
            </div>
          </div>

          {/* Docked Footer Command Bar with Safe Area Insets (Phone Optimized) */}
          <div
            data-chrome
            className="absolute inset-x-0 bottom-0 z-20 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] px-3 pt-2 bg-gradient-to-t from-[#05070B] via-[#070A11]/95 to-transparent"
          >
            <div className="max-w-md mx-auto w-full bg-[#0E121A]/95 backdrop-blur-md rounded-xl border border-[#222938] p-3 shadow-2xl space-y-2.5">
              {/* Destination & Assist Line */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[10px] uppercase font-bold tracking-wider text-[#8A8F9A]">
                    {activeCorridor.originName} → {activeCorridor.destinationName}
                  </div>
                  <div
                    className={`mt-0.5 text-xs font-bold truncate uppercase tracking-tight ${
                      contextual.isWarning ? 'text-[#EF4444]' : 'text-white'
                    }`}
                  >
                    {contextual.stateLine}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-[#8A8F9A]">
                    <span>SWR: <strong className="text-white">{currentMetrics.standingWaveRatio.toFixed(2)}:1</strong></span>
                    <span>•</span>
                    <span>Π_z: <strong className="text-white">{currentMetrics.axialMomentumFluxKn.toFixed(1)} kN</strong></span>
                    <span>•</span>
                    <span>τ: <strong className="text-white">{currentMetrics.maxwellTorqueNm.toFixed(1)} N·m</strong></span>
                  </div>
                </div>

                {/* Primary Contextual Action Button (Min 48px touch height) */}
                <button
                  type="button"
                  onClick={contextual.action}
                  className={`min-h-[48px] px-4 rounded-lg font-bold text-xs uppercase tracking-wider shrink-0 transition-all active:scale-95 shadow-md flex items-center gap-1.5 ${
                    contextual.isWarning
                      ? 'bg-[#EF4444] text-white hover:bg-[#DC2626]'
                      : 'bg-[#C5A059] text-[#0D0E11] hover:bg-[#D4AF37]'
                  }`}
                >
                  <span>{contextual.label}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Space Chips */}
              <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-[#1C2230]">
                <button
                  type="button"
                  onClick={() => setCurrentSpace('maps')}
                  className="min-h-[44px] rounded bg-[#131722] hover:bg-[#1A2030] text-[#8A8F9A] hover:text-white text-[10px] uppercase font-bold tracking-wider border border-[#202738] flex items-center justify-center gap-1"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Maps</span>
                </button>

                <button
                  type="button"
                  onClick={handleRecenter}
                  className="min-h-[44px] rounded bg-[#131722] hover:bg-[#1A2030] text-[#8A8F9A] hover:text-white text-[10px] uppercase font-bold tracking-wider border border-[#202738] flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Recentre</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentSpace('workbench')}
                  className="min-h-[44px] rounded bg-[#131722] hover:bg-[#1A2030] text-[#8A8F9A] hover:text-white text-[10px] uppercase font-bold tracking-wider border border-[#202738] flex items-center justify-center gap-1"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Bench</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsInspectOpen(true)}
                  className="min-h-[44px] rounded bg-[#1A2234] hover:bg-[#232F48] text-[#509EE3] text-[10px] uppercase font-bold tracking-wider border border-[#509EE3]/40 flex items-center justify-center gap-1 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* SPACE 3: WORKBENCH (Material Coupon Mechanics & Gibson–Ashby Law)         */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {currentSpace === 'workbench' && (
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 max-w-4xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between border-b border-[#22252D] pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-widest">
                ALICE TWIN · MATERIAL COUPON BENCH
              </span>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Physical Coupon Evaluation &amp; Gibson–Ashby Scaling
              </h1>
            </div>
            <button
              onClick={() => setCurrentSpace('chair')}
              className="px-4 py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0D0E11] font-bold text-xs rounded transition-colors"
            >
              Return to Chair →
            </button>
          </div>

          {/* Coupon Material Parameters */}
          <div className="bg-[#0E121A] rounded-xl border border-[#222734] p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">Metamaterial Cellular Lattice Coupon</h2>
                <p className="text-xs text-[#8A8F9A]">
                  Scaling relationship governing hull stiffness and electrical conductivity.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#1F2738] text-[#509EE3] text-[10px] font-bold border border-[#509EE3]/30">
                [SIMULATED_BEHAVIOUR]
              </span>
            </div>

            {/* Relative Density Slider (Bounded Parameter) */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#8A8F9A]">Relative Density (ρ* / ρs):</span>
                <span className="font-bold text-[#C5A059]">{(couponDensity ?? 0.28).toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.80"
                step="0.01"
                value={couponDensity ?? 0.28}
                onChange={(e) => setCouponDensity(parseFloat(e.target.value) || 0.28)}
                className="w-full h-2 bg-[#1A1F2B] rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
              />
            </div>

            {/* Lattice Geometry Family Selection */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs text-[#8A8F9A]">Lattice Family:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['honeycomb', 'octet', 'open_cell_foam', 'solid'] as const).map((fam) => (
                  <button
                    key={fam}
                    type="button"
                    onClick={() => setCouponFamily(fam)}
                    className={`py-2 px-3 rounded text-xs font-bold uppercase transition-all ${
                      couponFamily === fam
                        ? 'bg-[#C5A059] text-[#0D0E11]'
                        : 'bg-[#151922] text-[#8A8F9A] border border-[#222836]'
                    }`}
                  >
                    {fam.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Computed Gibson-Ashby Outputs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-[#1C2230]">
              <div className="p-3 rounded bg-[#131722] border border-[#1F2636]">
                <div className="text-[10px] text-[#8A8F9A] uppercase">Modulus Ratio (E*/Es)</div>
                <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {(couponMetrics.modulusRatio * 100).toFixed(2)}%
                </div>
              </div>
              <div className="p-3 rounded bg-[#131722] border border-[#1F2636]">
                <div className="text-[10px] text-[#8A8F9A] uppercase">Effective Modulus (E*)</div>
                <div className="text-sm sm:text-base font-bold text-[#509EE3] mt-0.5">
                  {couponMetrics.effectiveModulusGpa.toFixed(2)} GPa
                </div>
              </div>
              <div className="p-3 rounded bg-[#131722] border border-[#1F2636] col-span-2 sm:col-span-1">
                <div className="text-[10px] text-[#8A8F9A] uppercase">Relative Yield (σ*/σs)</div>
                <div className="text-sm sm:text-base font-bold text-[#4ADE80] mt-0.5">
                  {(couponMetrics.relativeYieldStrength * 100).toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="p-3 rounded bg-[#10141D] border border-[#1B2230] text-[11px] text-[#8A8F9A] font-mono">
              <span className="text-[#C5A059] font-bold">Governing Formula:</span> {couponMetrics.governingLaw}
            </div>
          </div>

          {/* Traceable Physical Measured Telemetry Card */}
          <div className="bg-[#0E121A] rounded-xl border border-[#222734] p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
                <h2 className="text-sm font-bold text-white">Physical Telemetry Anchor</h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#122B1E] text-[#4ADE80] text-[10px] font-bold border border-[#4ADE80]/30">
                [MEASURED]
              </span>
            </div>
            <div className="text-xs text-[#8A8F9A] space-y-1">
              <div>Receipt ID: <strong className="text-white">{activeModel.primaryEpistemicAnchor.receiptId}</strong></div>
              <div>Source: <strong className="text-white">{activeModel.primaryEpistemicAnchor.source}</strong></div>
              <div>Acquisition Telemetry: <strong className="text-[#4ADE80]">{activeModel.primaryEpistemicAnchor.measuredValue}</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* INSPECT SHEET (Mobile Bottom Sheet: Exact Input, Model & Epistemic Class)   */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {isInspectOpen && (
        <div
          data-chrome
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end flex-col sm:justify-center sm:items-center p-0 sm:p-4"
          onClick={() => setIsInspectOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#0E121A] border-t sm:border border-[#262E40] rounded-t-2xl sm:rounded-2xl max-h-[85dvh] overflow-y-auto p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#202738] pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#509EE3]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Provenance &amp; Epistemic Audit
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsInspectOpen(false)}
                className="w-8 h-8 rounded-full bg-[#181E2B] flex items-center justify-center text-[#8A8F9A] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. WHICH INPUT */}
            <div className="p-3.5 rounded-lg bg-[#121622] border border-[#1E2536] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#C5A059] uppercase text-[10px] tracking-wider">
                  1. Configured Input Parameter
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#2D1B10] text-[#F59E0B] text-[9px] font-bold">
                  CONFIGURED_INPUT
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-[#0A0D14] border border-[#161B26]">
                  <span className="text-[#8A8F9A] text-[10px]">Before (Nominal):</span>
                  <div className="font-bold text-white mt-0.5">Δr = 0.00 mm</div>
                  <div className="text-[10px] text-[#8A8F9A]">Δx: 0px, Δy: 0px</div>
                </div>
                <div className="p-2 rounded bg-[#0A0D14] border border-[#161B26]">
                  <span className="text-[#8A8F9A] text-[10px]">After (Current Touch):</span>
                  <div className="font-bold text-[#F59E0B] mt-0.5">
                    Δr = {currentMetrics.offsetRadiusMm.toFixed(2)} mm
                  </div>
                  <div className="text-[10px] text-[#8A8F9A]">
                    Δx: {offsetX}px, Δy: {offsetY}px
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-[#8A8F9A]">
                Input Source: Single-touch horizontal gesture (&gt;18px threshold) via PointerEvents.
              </div>
            </div>

            {/* 2. WHICH MODEL & EQUATIONS */}
            <div className="p-3.5 rounded-lg bg-[#121622] border border-[#1E2536] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#509EE3] uppercase text-[10px] tracking-wider">
                  2. Governing Physics Engine
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#101F30] text-[#509EE3] text-[9px] font-bold">
                  DERIVED_KERNEL
                </span>
              </div>
              <div className="text-xs text-[#E6E4DF] space-y-1">
                <div>Model ID: <strong className="text-white">AliceVessel.FieldGeometry a2ddbd0</strong></div>
                <div>Formulation: <strong className="text-[#A2A7B5]">Maxwell Stress Tensor Surface Integral</strong></div>
              </div>
              <div className="p-2 rounded bg-[#0A0D14] border border-[#161B26] text-[10px] text-[#8A8F9A] font-mono space-y-1">
                <div>F_perp = (Δr / R_c) · P_rf · κ_geom</div>
                <div>τ = ∮_∂Ω (r × T_Maxwell) · da</div>
              </div>
            </div>

            {/* 3. COMPUTED OUTPUTS: BEFORE VS AFTER */}
            <div className="p-3.5 rounded-lg bg-[#121622] border border-[#1E2536] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#4ADE80] uppercase text-[10px] tracking-wider">
                  3. Computed Outputs (Before vs After)
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#122B1E] text-[#4ADE80] text-[9px] font-bold">
                  SIMULATED_BEHAVIOUR
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-[#1A202E]">
                  <span className="text-[#8A8F9A]">Standing Wave Ratio (SWR):</span>
                  <span className="font-mono">
                    <span className="text-[#8A8F9A]">1.05:1</span> → <strong className="text-white">{currentMetrics.standingWaveRatio.toFixed(2)}:1</strong>
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#1A202E]">
                  <span className="text-[#8A8F9A]">Axial Poynting Flux (Π_z):</span>
                  <span className="font-mono">
                    <span className="text-[#8A8F9A]">84.2 kN</span> → <strong className="text-white">{currentMetrics.axialMomentumFluxKn.toFixed(1)} kN</strong>
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#1A202E]">
                  <span className="text-[#8A8F9A]">Transverse Force (F_perp):</span>
                  <span className="font-mono">
                    <span className="text-[#8A8F9A]">0.0 N</span> → <strong className="text-[#F59E0B]">{currentMetrics.transverseThrustN.toFixed(1)} N</strong>
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#8A8F9A]">Octagon Containment (Ω_safe):</span>
                  <span className={`font-mono font-bold ${currentMetrics.octagonContainment === 'CONTAINED_WITHIN_OMEGA_SAFE' ? 'text-[#4ADE80]' : 'text-[#EF4444]'}`}>
                    {currentMetrics.octagonContainment === 'CONTAINED_WITHIN_OMEGA_SAFE' ? 'CONTAINED' : 'BREACH'}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. EPISTEMIC SEPARATION & AUDIT NOTICE */}
            <div className="p-3.5 rounded-lg bg-[#14120D] border border-[#C5A059]/40 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#C5A059] font-bold uppercase text-[10px]">
                <Shield className="w-3.5 h-3.5" />
                <span>Constitutional Invariant Standard</span>
              </div>
              <p className="text-[11px] text-[#D4C3A3] leading-relaxed">
                Visual alignment is a geometric model registration. It is not proof of physical coupling, propulsion, or measured performance. Only traceable hardware telemetry (e.g. {activeModel.primaryEpistemicAnchor.receiptId}) earns the <strong>MEASURED</strong> epistemic class.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
