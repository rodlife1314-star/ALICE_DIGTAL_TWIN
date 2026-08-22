import { DigitalTwin } from "../../types";
import { SpatialScene, DomainSpatialAdapter, PathfinderSpatialScale, SpatialVisualNode } from "../../types/spatial";

/**
 * UNSUPPORTED DOMAIN SPATIAL ADAPTER
 * 
 * Epistemic Doctrine:
 * "Unknown remains unknown. An unknown twin domain must never silently receive
 * another domain's physical spatial adapter (e.g. membrane physics).
 * Substrate must present an explicit unsupported-domain state."
 */
export const UnsupportedDomainSpatialAdapter: DomainSpatialAdapter = {
  buildScene(twin: DigitalTwin, operatorParameters: Record<string, any> = {}, lodLevel: PathfinderSpatialScale = 1): SpatialScene {
    const domainName = twin.domain || "unspecified";

    const noticeNode: SpatialVisualNode = {
      id: `unsupported-notice-${twin.id}`,
      twinId: twin.id,
      lodLevel: lodLevel,
      name: `Unsupported Domain: ${domainName}`,
      domain: "substrate_workspace",
      classification: "ILLUSTRATIVE_BOUNDARY",
      position: { x: 0, y: 0, z: 0 },
      geometryType: "box",
      dimensions: { width: 4, height: 2, depth: 0.2 },
      materialProperties: {
        color: "#C5A059",
        opacity: 0.85,
        wireframe: true,
        emissive: "#C5A059",
        emissiveIntensity: 0.4
      },
      liveMetrics: {
        "Status": "UNSUPPORTED_SPATIAL_DOMAIN",
        "Domain": domainName,
        "Substrate Notice": "No registered 3D spatial adapter for this domain."
      }
    };

    return {
      id: `scene-unsupported-${twin.id}`,
      twinId: twin.id,
      domain: "substrate_workspace",
      title: `Spatial View Unavailable — ${twin.name}`,
      description: `Domain '${domainName}' does not have a registered 3D spatial adapter. Pathfinder substrate refuses to silently assume membrane or kinematic physics.`,
      currentLOD: lodLevel,
      nodes: [noticeNode],
      edges: [],
      environmentSettings: {
        ambientLightIntensity: 0.4,
        directionalLightPosition: { x: 5, y: 10, z: 5 },
        gridFloor: true,
        particleFlowActive: false,
        simTimeScale: 1.0
      },
      viewingModes: {
        explodedFactor: 0,
        sectionalCutPlane: "NONE",
        sectionalCutPosition: 0,
        activeFieldOverlay: "NONE",
        qualityProfile: "balanced"
      },
      governingEquations: [
        "EPISTEMIC LAW: Unknown remains unknown.",
        "A domain instrument may not silently annex another domain's physical model."
      ],
      truthLedgerSummary: {
        observedCount: 0,
        reconstructedCount: 0,
        inferredCount: 0,
        simulatedCount: 0,
        assumedCount: 1
      }
    };
  },

  applyOperatorChange(change: Record<string, any>, currentScene: SpatialScene) {
    return {
      calculatedMetrics: { "status": "Domain unsupported" },
      governanceAlert: "Cannot apply spatial kinematic changes to unregistered domain.",
      snrStatus: "STOP"
    };
  },

  runSimulation(scene: SpatialScene, stepDelta: number): SpatialScene {
    return scene;
  }
};
