import { DigitalTwin } from "../types";
import { DomainSpatialAdapter } from "../types/spatial";
import { MembraneSpatialAdapter } from "./adapters/MembraneSpatialAdapter";
import { AntikytheraSpatialAdapter } from "./adapters/AntikytheraSpatialAdapter";
import { TermiteNestSpatialAdapter } from "./adapters/TermiteNestSpatialAdapter";
import { SixesSpatialAdapter } from "./adapters/SixesSpatialAdapter";
import { CooledSpatialAdapter } from "./adapters/CooledSpatialAdapter";
import { UnsupportedDomainSpatialAdapter } from "./adapters/UnsupportedDomainSpatialAdapter";

/**
 * PATHFINDER UNIVERSAL SPATIAL REGISTRY & DISPATCHER
 * Routes registered digital twins to their specialized spatial adapter.
 * 
 * Epistemic Invariant:
 * Unrecognized or unregistered domains MUST receive the explicit UnsupportedDomainSpatialAdapter
 * rather than silently defaulting to another domain's physical model.
 */
export function getSpatialAdapterForTwin(twin: DigitalTwin): DomainSpatialAdapter {
  const domainStr = String(twin.domain || "").toLowerCase();
  const nameStr = String(twin.name || "").toLowerCase();
  const idStr = String(twin.id || "").toLowerCase();

  if (idStr === "intelligent-protective-membrane-07" || domainStr === "materials" || nameStr.includes("membrane")) {
    return MembraneSpatialAdapter;
  }
  if (idStr === "antikythera-mechanism-01" || domainStr === "historical_kinematics" || domainStr === "archaeological" || nameStr.includes("antikythera")) {
    return AntikytheraSpatialAdapter;
  }
  if (idStr === "termite-colony-01" || domainStr === "biological_structures" || domainStr === "bio_architecture" || domainStr === "biological" || nameStr.includes("termite")) {
    return TermiteNestSpatialAdapter;
  }
  if (idStr === "project-sixes-culinary-08" || domainStr === "culinary" || nameStr.includes("sixes") || nameStr.includes("culinary")) {
    return SixesSpatialAdapter;
  }
  if (idStr.includes("cooled") || domainStr === "passive_cooling" || nameStr.includes("cooled") || nameStr.includes("radiative")) {
    return CooledSpatialAdapter;
  }

  // Explicitly return UnsupportedDomainSpatialAdapter instead of silently assuming membrane physics
  return UnsupportedDomainSpatialAdapter;
}
