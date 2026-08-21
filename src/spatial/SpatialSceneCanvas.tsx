import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Float, Grid } from "@react-three/drei";
import * as THREE from "three";
import { 
  SpatialScene, 
  SpatialVisualNode, 
  SpatialEvidenceClassification, 
  SpatialLODLevel, 
  InstancedParticleCollection,
  LOD_LABELS 
} from "../types/spatial";

interface SpatialSceneCanvasProps {
  scene: SpatialScene;
  selectedNodeId: string | null;
  onSelectNode: (node: SpatialVisualNode | null) => void;
  evidenceFilter: SpatialEvidenceClassification | "ALL";
  isSimulating: boolean;
  activeLOD: SpatialLODLevel;
  onLODChange?: (lod: SpatialLODLevel) => void;
  isAutoLOD: boolean;
}

// Visual badge / color coding according to Non-negotiable Truth Boundary
export function getClassificationVisualMeta(classification: SpatialEvidenceClassification) {
  switch (classification) {
    case "OBSERVED_GEOMETRY":
      return { label: "OBSERVED GEOMETRY", color: "#10B981", badgeBg: "bg-[#064E3B] text-[#34D399] border-[#059669]" };
    case "MEASURED_STATE":
      return { label: "MEASURED STATE", color: "#3B82F6", badgeBg: "bg-[#1E3A8A] text-[#60A5FA] border-[#2563EB]" };
    case "EVIDENCE_SUPPORTED_RECONSTRUCTION":
      return { label: "EVIDENCE-SUPPORTED RECONSTRUCTION", color: "#F59E0B", badgeBg: "bg-[#78350F] text-[#FBBF24] border-[#D97706]" };
    case "MODEL_PARAMETER_ASSUMED":
      return { label: "MODEL PARAMETER / ASSUMED", color: "#EAB308", badgeBg: "bg-[#713F12] text-[#FDE047] border-[#CA8A04]" };
    case "MODEL_INFERRED_STRUCTURE":
      return { label: "MODEL-INFERRED STRUCTURE", color: "#8B5CF6", badgeBg: "bg-[#4C1D95] text-[#A78BFA] border-[#7C3AED]" };
    case "SIMULATED_BEHAVIOUR":
      return { label: "SIMULATED BEHAVIOUR", color: "#06B6D4", badgeBg: "bg-[#164E63] text-[#22D3EE] border-[#0891B2]" };
    case "ILLUSTRATIVE_BOUNDARY":
      return { label: "ILLUSTRATIVE ONLY", color: "#6B7280", badgeBg: "bg-[#374151] text-[#9CA3AF] border-[#4B5563]" };
    default:
      return { label: "UNCLASSIFIED", color: "#9CA3AF", badgeBg: "bg-[#1F2937] text-[#9CA3AF] border-[#374151]" };
  }
}

export function getFieldSourceMeta(source?: string) {
  switch (source) {
    case "SOLVER":
      return {
        label: "SOLVER-GENERATED · RECEIPT VERIFIED",
        color: "text-emerald-400 bg-emerald-950/70 border-emerald-500/50",
        badge: "VERIFIED SOLVER"
      };
    case "INTERPOLATED":
      return {
        label: "INTERPOLATED FIELD",
        color: "text-sky-400 bg-sky-950/70 border-sky-500/50",
        badge: "INTERPOLATED"
      };
    case "PROCEDURAL_DEMO":
    default:
      return {
        label: "PROCEDURAL / ILLUSTRATIVE · NOT SOLVER CONVERGED",
        color: "text-amber-400 bg-amber-950/70 border-amber-500/50",
        badge: "PROCEDURAL DEMO"
      };
  }
}

// Color interpolator for Field Heatmap Overlays
function getFieldHeatmapColor(
  fieldType: string,
  value: number,
  minRange: number,
  maxRange: number
): string {
  const norm = Math.max(0, Math.min(1, (value - minRange) / (maxRange - minRange || 1)));
  
  if (fieldType === "temperature_field") {
    // Cold Cyan (0) -> Warm Amber (0.5) -> Hot Crimson (1.0)
    if (norm < 0.5) {
      const t = norm * 2;
      return new THREE.Color("#06B6D4").lerp(new THREE.Color("#F59E0B"), t).getHexString();
    } else {
      const t = (norm - 0.5) * 2;
      return new THREE.Color("#F59E0B").lerp(new THREE.Color("#EF4444"), t).getHexString();
    }
  } else if (fieldType === "electric_potential") {
    // Negative Potential Cyan/Blue -> Neutral -> Positive Crimson
    return new THREE.Color("#8B5CF6").lerp(new THREE.Color("#06B6D4"), norm).getHexString();
  } else if (fieldType === "co2_concentration") {
    // Normal Green/Teal -> High Amber -> Asphyxiation Red
    return new THREE.Color("#10B981").lerp(new THREE.Color("#DC2626"), norm).getHexString();
  } else if (fieldType === "ir_flux_density") {
    return new THREE.Color("#0284C7").lerp(new THREE.Color("#38BDF8"), norm).getHexString();
  }
  return "#06B6D4";
}

// Camera Distance Proximity LOD Listener
function CameraDistanceLODTracker({
  isAutoLOD,
  currentLOD,
  onLODChange
}: {
  isAutoLOD: boolean;
  currentLOD: SpatialLODLevel;
  onLODChange?: (lod: SpatialLODLevel) => void;
}) {
  const { camera } = useThree();
  const prevDistRef = useRef(camera.position.length());

  useFrame(() => {
    if (!isAutoLOD || !onLODChange) return;
    const dist = camera.position.length();
    if (Math.abs(dist - prevDistRef.current) > 0.8) {
      prevDistRef.current = dist;
      let targetLOD: SpatialLODLevel = 2;
      if (dist > 18) targetLOD = 0;
      else if (dist > 12) targetLOD = 1;
      else if (dist > 7) targetLOD = 2;
      else if (dist > 4) targetLOD = 3;
      else targetLOD = 4;

      if (targetLOD !== currentLOD) {
        onLODChange(targetLOD);
      }
    }
  });

  return null;
}

// GPU Instanced Particle Cloud (Pores, Ions, Termite Agents, IR Photons)
function GPUInstancedLayer({
  collection,
  isSimulating
}: {
  collection: InstancedParticleCollection;
  isSimulating: boolean;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = collection.count;

  // Initialize random particle positions within bounded box
  const particles = useMemo(() => {
    const data = [];
    const b = collection.bounds;
    for (let i = 0; i < count; i++) {
      data.push({
        x: b.minX + Math.random() * (b.maxX - b.minX),
        y: b.minY + Math.random() * (b.maxY - b.minY),
        z: b.minZ + Math.random() * (b.maxZ - b.minZ),
        vx: (Math.random() - 0.5) * 0.02 * (collection.motionVelocity || 1),
        vy: (Math.random() - 0.5) * 0.02 * (collection.motionVelocity || 1),
        vz: (Math.random() - 0.5) * 0.02 * (collection.motionVelocity || 1),
        rot: Math.random() * Math.PI * 2
      });
    }
    return data;
  }, [count, collection.bounds, collection.motionVelocity]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const b = collection.bounds;

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      if (isSimulating && collection.motionVelocity) {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Wrap around bounds
        if (p.x < b.minX) p.x = b.maxX;
        if (p.x > b.maxX) p.x = b.minX;
        if (p.y < b.minY) p.y = b.maxY;
        if (p.y > b.maxY) p.y = b.minY;
        if (p.z < b.minZ) p.z = b.maxZ;
        if (p.z > b.maxZ) p.z = b.minZ;
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(collection.size);
      dummy.rotation.set(0, p.rot, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color={collection.color}
        emissive={collection.emissive || collection.color}
        emissiveIntensity={0.6}
        roughness={0.2}
      />
    </instancedMesh>
  );
}

// Render individual multi-scale node with domain-resolved physics geometry
function MultiScaleNodeMesh({
  node,
  isSelected,
  onSelect,
  isDimmed,
  isSimulating,
  explodedFactor,
  sectionalCutPlane,
  sectionalCutPosition,
  activeFieldOverlay
}: {
  node: SpatialVisualNode;
  isSelected: boolean;
  onSelect: () => void;
  isDimmed: boolean;
  isSimulating: boolean;
  explodedFactor: number;
  sectionalCutPlane: "NONE" | "Y_PLANE" | "Z_PLANE";
  sectionalCutPosition: number;
  activeFieldOverlay: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const gearRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Dynamic Exploded Offset
  const posX = node.position.x + (node.explodedOffset ? node.explodedOffset.x * explodedFactor : 0);
  const posY = node.position.y + (node.explodedOffset ? node.explodedOffset.y * explodedFactor : 0);
  const posZ = node.position.z + (node.explodedOffset ? node.explodedOffset.z * explodedFactor : 0);

  // Sectional Cut Visibility Calculation (No early return to preserve hook consistency)
  const isSectionCulled = 
    (sectionalCutPlane === "Y_PLANE" && posY > sectionalCutPosition) ||
    (sectionalCutPlane === "Z_PLANE" && posZ > sectionalCutPosition);

  useFrame((_, delta) => {
    if (gearRef.current && isSimulating && !isSectionCulled) {
      if (node.geometryType === "gear_disc" || node.geometryType === "gear_tooth_ring") {
        const speed = node.liveMetrics?.speedRpm ? Number(node.liveMetrics.speedRpm) : 1.0;
        gearRef.current.rotation.z += speed * delta * 1.2;
      }
    }
  });

  if (isSectionCulled) {
    return null;
  }

  // Calculate Base Color (Field Heatmap vs Material Color)
  let baseColor = node.materialProperties.color;
  if (activeFieldOverlay !== "NONE" && node.fieldData) {
    const hex = getFieldHeatmapColor(
      node.fieldData.fieldType,
      node.fieldData.scalarValue,
      node.fieldData.minRange,
      node.fieldData.maxRange
    );
    baseColor = `#${hex}`;
  }

  if (isDimmed) baseColor = "#374151";

  const opacity = isDimmed 
    ? 0.12 
    : (hovered || isSelected ? Math.min(1.0, node.materialProperties.opacity + 0.2) : node.materialProperties.opacity);
  const emissive = isSelected ? "#F59E0B" : (hovered ? "#38BDF8" : (node.materialProperties.emissive || "#000000"));
  const emissiveIntensity = isSelected ? 0.95 : (hovered ? 0.65 : (node.materialProperties.emissiveIntensity || 0.15));

  // Domain-Resolved Custom Geometries
  const renderGeometry = () => {
    const d = node.dimensions;
    switch (node.geometryType) {
      case "gear_disc":
        return <cylinderGeometry args={[d.radius || 1.5, d.radius || 1.5, d.tube || 0.2, d.segments || 36]} />;

      case "gear_tooth_ring":
        return <torusGeometry args={[d.radius || 2.0, d.toothDepth || 0.15, 8, d.toothCount || 64]} />;

      case "pin_and_slot":
        return <boxGeometry args={[d.width || 0.3, d.height || 0.9, d.depth || 0.15]} />;

      case "nanopore_channel":
        return <cylinderGeometry args={[d.radius || 0.5, d.radius || 0.5, d.height || 0.4, 24, 1, true]} />;

      case "ion_hydration_shell":
        return (
          <group>
            {/* Core Ion Particle */}
            <mesh>
              <sphereGeometry args={[(d.radius || 0.3) * 0.4, 16, 16]} />
              <meshStandardMaterial color={baseColor} emissive={emissive} emissiveIntensity={1.0} />
            </mesh>
            {/* Translucent Solvation Shell */}
            <mesh>
              <sphereGeometry args={[d.radius || 0.3, 24, 24]} />
              <meshStandardMaterial color="#38BDF8" transparent opacity={0.35} wireframe />
            </mesh>
          </group>
        );

      case "brood_chamber":
        return <sphereGeometry args={[d.radius || 1.5, d.segments || 24, d.segments || 24]} />;

      case "membrane_sheet":
      case "layered_metasurface":
      case "culinary_station":
      case "box":
        return <boxGeometry args={[d.width || 1, d.height || 1, d.depth || 1]} />;

      case "radiator_panel":
        return <boxGeometry args={[d.width || 1, d.height || 0.1, d.depth || 1]} />;

      case "sphere":
        return <sphereGeometry args={[d.radius || 1, d.segments || 32, d.segments || 32]} />;

      case "cylinder":
        return <cylinderGeometry args={[d.radius || 1, d.radius || 1, d.height || 1, d.segments || 32]} />;

      case "torus":
      case "tunnel_network":
        return <torusGeometry args={[d.radius || 1, d.tube || 0.2, 16, d.segments || 32]} />;

      case "fluid_particles":
        return <icosahedronGeometry args={[d.radius || 0.25, 2]} />;

      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  // Specialized rendering for Vector Arrow
  if (node.geometryType === "vector_arrow") {
    const height = node.dimensions.height || 2.0;
    const radius = node.dimensions.radius || 0.15;
    const headLength = node.dimensions.headLength || 0.6;
    const headRadius = node.dimensions.headRadius || 0.35;
    const shaftHeight = Math.max(0.2, height - headLength);

    return (
      <group
        position={[posX, posY, posZ]}
        rotation={[node.rotation?.x || 0, node.rotation?.y || 0, node.rotation?.z || 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <mesh position={[0, headLength / 2, 0]}>
          <cylinderGeometry args={[radius, radius, shaftHeight, 16]} />
          <meshStandardMaterial color={baseColor} transparent={opacity < 1} opacity={opacity} emissive={emissive} emissiveIntensity={emissiveIntensity} />
        </mesh>
        <mesh position={[0, -shaftHeight / 2, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[headRadius, headLength, 16]} />
          <meshStandardMaterial color={baseColor} transparent={opacity < 1} opacity={opacity} emissive={emissive} emissiveIntensity={emissiveIntensity} />
        </mesh>

        {(isSelected || hovered) && (
          <Float speed={2} rotationIntensity={0} floatIntensity={0.2}>
            <Text position={[0, height * 0.6 + 0.5, 0]} fontSize={0.22} color="#FFFFFF" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#000000">
              {node.name}
            </Text>
          </Float>
        )}
      </group>
    );
  }

  // Atmospheric Column Volume
  if (node.geometryType === "atmosphere_column") {
    const radius = node.dimensions.radius || 2.5;
    const height = node.dimensions.height || 3.0;
    return (
      <group
        position={[posX, posY, posZ]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <mesh>
          <cylinderGeometry args={[radius, radius, height, 32, 1, true]} />
          <meshStandardMaterial
            color={baseColor}
            transparent
            opacity={opacity}
            side={THREE.DoubleSide}
            wireframe={node.materialProperties.wireframe}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
        {(isSelected || hovered) && (
          <Float speed={2} rotationIntensity={0} floatIntensity={0.2}>
            <Text position={[0, height / 2 + 0.6, 0]} fontSize={0.22} color="#67E8F9" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#000000">
              {node.name}
            </Text>
          </Float>
        )}
      </group>
    );
  }

  return (
    <group
      ref={groupRef}
      position={[posX, posY, posZ]}
      rotation={[node.rotation?.x || 0, node.rotation?.y || 0, node.rotation?.z || 0]}
    >
      <mesh
        ref={gearRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        {node.geometryType === "ion_hydration_shell" ? (
          renderGeometry()
        ) : (
          <>
            {renderGeometry()}
            <meshStandardMaterial
              color={baseColor}
              transparent={opacity < 1}
              opacity={opacity}
              wireframe={node.materialProperties.wireframe}
              metalness={node.materialProperties.metalness || 0.4}
              roughness={node.materialProperties.roughness || 0.5}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </>
        )}
      </mesh>

      {/* Floating Classification & Name Badge on Selection/Hover */}
      {(isSelected || hovered) && (
        <Float speed={2} rotationIntensity={0} floatIntensity={0.2}>
          <Text
            position={[0, (node.dimensions.height || node.dimensions.radius || 1) * 0.8 + 0.6, 0]}
            fontSize={0.24}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {`[PSS-${node.lodLevel}] ${node.name}`}
          </Text>
        </Float>
      )}
    </group>
  );
}

// 3D Connection Edges with Pulsing Flux Signals
function MultiScaleEdgeLine({
  sourceNode,
  targetNode,
  color,
  activePulse,
  isDimmed,
  explodedFactor
}: {
  sourceNode?: SpatialVisualNode;
  targetNode?: SpatialVisualNode;
  color?: string;
  activePulse?: boolean;
  isDimmed: boolean;
  explodedFactor: number;
}) {
  if (!sourceNode || !targetNode) return null;

  const srcX = sourceNode.position.x + (sourceNode.explodedOffset ? sourceNode.explodedOffset.x * explodedFactor : 0);
  const srcY = sourceNode.position.y + (sourceNode.explodedOffset ? sourceNode.explodedOffset.y * explodedFactor : 0);
  const srcZ = sourceNode.position.z + (sourceNode.explodedOffset ? sourceNode.explodedOffset.z * explodedFactor : 0);

  const tgtX = targetNode.position.x + (targetNode.explodedOffset ? targetNode.explodedOffset.x * explodedFactor : 0);
  const tgtY = targetNode.position.y + (targetNode.explodedOffset ? targetNode.explodedOffset.y * explodedFactor : 0);
  const tgtZ = targetNode.position.z + (targetNode.explodedOffset ? targetNode.explodedOffset.z * explodedFactor : 0);

  const points = [
    new THREE.Vector3(srcX, srcY, srcZ),
    new THREE.Vector3(tgtX, tgtY, tgtZ)
  ];

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({
      color: isDimmed ? "#1F2937" : (color || "#3B82F6"),
      transparent: true,
      opacity: isDimmed ? 0.12 : (activePulse ? 0.85 : 0.35),
      linewidth: 2
    }))} />
  );
}

export function SpatialSceneCanvas({
  scene,
  selectedNodeId,
  onSelectNode,
  evidenceFilter,
  isSimulating,
  activeLOD,
  onLODChange,
  isAutoLOD
}: SpatialSceneCanvasProps) {
  const nodeMap = new Map(scene.nodes.map(n => [n.id, n]));
  const explodedFactor = scene.viewingModes?.explodedFactor ?? 0.0;
  const sectionalCutPlane = scene.viewingModes?.sectionalCutPlane ?? "NONE";
  const sectionalCutPosition = scene.viewingModes?.sectionalCutPosition ?? 0.0;
  const activeFieldOverlay = scene.viewingModes?.activeFieldOverlay ?? "NONE";

  return (
    <div className="w-full h-full relative bg-[#0B0D12] overflow-hidden rounded-lg">
      <Canvas
        camera={{ position: [0, 6, 14], fov: 45 }}
        onPointerMissed={() => onSelectNode(null)}
        shadows
      >
        <ambientLight intensity={scene.environmentSettings.ambientLightIntensity} />
        <directionalLight
          position={[
            scene.environmentSettings.directionalLightPosition.x,
            scene.environmentSettings.directionalLightPosition.y,
            scene.environmentSettings.directionalLightPosition.z
          ]}
          intensity={1.2}
          castShadow
        />
        <pointLight position={[0, 4, 0]} intensity={0.6} color="#509EE3" />

        {/* Camera Proximity LOD Observer */}
        <CameraDistanceLODTracker
          isAutoLOD={isAutoLOD}
          currentLOD={activeLOD}
          onLODChange={onLODChange}
        />

        {/* Dynamic Floor Grid */}
        {scene.environmentSettings.gridFloor && (
          <Grid
            renderOrder={-1}
            position={[0, -2.4, 0]}
            infiniteGrid
            cellSize={0.8}
            cellThickness={0.6}
            cellColor="#1E232E"
            sectionSize={4}
            sectionThickness={1.2}
            sectionColor="#2B3242"
            fadeDistance={35}
            fadeStrength={1.5}
          />
        )}

        {/* GPU Instanced Particle Layers (Pores, Termites, Photons) */}
        {scene.instancedLayers?.map((layer) => (
          <GPUInstancedLayer
            key={layer.id}
            collection={layer}
            isSimulating={isSimulating}
          />
        ))}

        {/* Spatial Connection Edges */}
        {scene.edges.map((edge) => {
          const src = nodeMap.get(edge.sourceNodeId);
          const tgt = nodeMap.get(edge.targetNodeId);
          const isDimmed = evidenceFilter !== "ALL" && edge.classification !== evidenceFilter;
          return (
            <MultiScaleEdgeLine
              key={edge.id}
              sourceNode={src}
              targetNode={tgt}
              color={edge.color}
              activePulse={edge.activePulse}
              isDimmed={isDimmed}
              explodedFactor={explodedFactor}
            />
          );
        })}

        {/* Multi-Scale Spatial Visual Nodes */}
        {scene.nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const isDimmed = evidenceFilter !== "ALL" && node.classification !== evidenceFilter;
          return (
            <MultiScaleNodeMesh
              key={node.id}
              node={node}
              isSelected={isSelected}
              onSelect={() => onSelectNode(node)}
              isDimmed={isDimmed}
              isSimulating={isSimulating}
              explodedFactor={explodedFactor}
              sectionalCutPlane={sectionalCutPlane}
              sectionalCutPosition={sectionalCutPosition}
              activeFieldOverlay={activeFieldOverlay}
            />
          );
        })}

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          maxDistance={40}
          minDistance={1.5}
          maxPolarAngle={Math.PI / 2 + 0.15}
        />
      </Canvas>
    </div>
  );
}
