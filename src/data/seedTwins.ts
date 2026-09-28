import { DigitalTwin } from "../types";
import { SYSTEM_CAPABILITY_REGISTRY } from "./seedCapabilityRegistry";
import { ALICE_VESSEL_TWIN } from "./seedAliceVesselTwin";
import { AERIAL_VEHICLE_TWIN } from "./seedAerialTwin";
import { INTELLIGENT_PROTECTIVE_MEMBRANE_TWIN } from "./seedMembraneTwin";

/**
 * PATHFINDER / ALICE VESSEL SEED DIGITAL TWIN REPOSITORY
 * 
 * In accordance with Phase 3 Passenger-Twin Deletion:
 * - Alice Vessel (CCV-01 Concept Vessel) is the sole primary digital twin.
 * - Aerial Vehicle (AERIAL-VEHICLE-01) is the airframe edge avionics twin.
 * - Intelligent Protective Membrane is the integrated structural protective materials component.
 * - All passenger twins (Antikythera, Termite Colony, Membrane-02, COOLed) have been retired.
 */
export const SEED_TWINS: DigitalTwin[] = [
  {
    ...ALICE_VESSEL_TWIN,
    capabilityRegistry: SYSTEM_CAPABILITY_REGISTRY,
    selectedModelId: "physics-pde-solver-v2",
    selectedModelCapability: SYSTEM_CAPABILITY_REGISTRY[2]
  },
  {
    ...AERIAL_VEHICLE_TWIN,
    capabilityRegistry: SYSTEM_CAPABILITY_REGISTRY,
    selectedModelId: "jetson-edge-orin",
    selectedModelCapability: SYSTEM_CAPABILITY_REGISTRY.find(m => m.id === "jetson-edge-orin") || SYSTEM_CAPABILITY_REGISTRY[0]
  },
  {
    ...INTELLIGENT_PROTECTIVE_MEMBRANE_TWIN,
    capabilityRegistry: SYSTEM_CAPABILITY_REGISTRY,
    selectedModelId: "physics-pde-solver-v2",
    selectedModelCapability: SYSTEM_CAPABILITY_REGISTRY[2]
  }
];
