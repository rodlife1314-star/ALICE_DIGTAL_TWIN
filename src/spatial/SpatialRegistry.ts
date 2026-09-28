import { DigitalTwin } from "../types";
import { DomainSpatialAdapter } from "../types/spatial";
import { MembraneSpatialAdapter } from "./adapters/MembraneSpatialAdapter";
import { SixesSpatialAdapter } from "./adapters/SixesSpatialAdapter";
import { AerialVehicleSpatialAdapter } from "./adapters/AerialVehicleSpatialAdapter";
import { UnsupportedDomainSpatialAdapter } from "./adapters/UnsupportedDomainSpatialAdapter";

/**
 * PATHFINDER UNIVERSAL SPATIAL REGISTRY & DISPATCHER
 * Routes registered digital twins and components to their specialized spatial adapter.
 * 
 * Epistemic Invariant:
 * Unrecognized or unregistered domains MUST receive the explicit UnsupportedDomainSpatialAdapter
 * rather than silently defaulting to another domain's physical model.
 */
export function getSpatialAdapterForTwin(twin: DigitalTwin): DomainSpatialAdapter {
  const domainStr = String(twin.domain || "").toLowerCase();
  const nameStr = String(twin.name || "").toLowerCase();
  const idStr = String(twin.id || "").toLowerCase();

  // Alice Vessel / Aerial Vehicle Domain
  if (
    idStr === "aerial-vehicle-01" ||
    idStr === "alice-vessel-ccv01" ||
    idStr.includes("aerial") ||
    idStr.includes("vessel") ||
    domainStr === "engineered" ||
    domainStr === "aerospace" ||
    nameStr.includes("aerial") ||
    nameStr.includes("vessel") ||
    nameStr.includes("reconnaissance")
  ) {
    return AerialVehicleSpatialAdapter;
  }

  // Alice Protective Membrane / Materials Component
  if (idStr === "intelligent-protective-membrane-07" || domainStr === "materials" || nameStr.includes("membrane")) {
    return MembraneSpatialAdapter;
  }

  // Independent Domain Instrument: Project SIXES
  if (idStr === "project-sixes-culinary-08" || domainStr === "culinary" || nameStr.includes("sixes") || nameStr.includes("culinary")) {
    return SixesSpatialAdapter;
  }

  // Explicitly return UnsupportedDomainSpatialAdapter instead of silently assuming physics
  return UnsupportedDomainSpatialAdapter;
}
