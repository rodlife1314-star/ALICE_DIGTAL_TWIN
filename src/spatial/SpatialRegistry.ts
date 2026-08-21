import { DigitalTwin } from "../types";
import { SpatialScene, DomainSpatialAdapter } from "../types/spatial";
import { MembraneSpatialAdapter } from "./adapters/MembraneSpatialAdapter";
import { AntikytheraSpatialAdapter } from "./adapters/AntikytheraSpatialAdapter";
import { TermiteNestSpatialAdapter } from "./adapters/TermiteNestSpatialAdapter";
import { SixesSpatialAdapter } from "./adapters/SixesSpatialAdapter";
import { CooledSpatialAdapter } from "./adapters/CooledSpatialAdapter";

/**
 * PATHFINDER UNIVERSAL SPATIAL REGISTRY & DISPATCHER
 * Routes any registered digital twin to its specialized spatial adapter.
 */
export function getSpatialAdapterForTwin(twin: DigitalTwin): DomainSpatialAdapter {
  if (twin.id === "intelligent-protective-membrane-07" || twin.name.toLowerCase().includes("membrane")) {
    return MembraneSpatialAdapter;
  }
  if (twin.id === "antikythera-mechanism-01" || twin.name.toLowerCase().includes("antikythera")) {
    return AntikytheraSpatialAdapter;
  }
  if (twin.id === "termite-colony-01" || twin.name.toLowerCase().includes("termite")) {
    return TermiteNestSpatialAdapter;
  }
  if (twin.id === "project-sixes-culinary-08" || twin.name.toLowerCase().includes("sixes") || twin.name.toLowerCase().includes("culinary")) {
    return SixesSpatialAdapter;
  }
  if (twin.id.includes("cooled") || twin.name.toLowerCase().includes("cooled") || twin.name.toLowerCase().includes("radiative")) {
    return CooledSpatialAdapter;
  }

  // Fallback to membrane spatial adapter for standard physics twins
  return MembraneSpatialAdapter;
}
