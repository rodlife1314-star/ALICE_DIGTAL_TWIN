/**
 * PROJECT SIXES — CULINARY DOMAIN INSTRUMENT
 * Pathfinder Digital Twin Substrate Extension
 *
 * "The database suggests. Models compare. Standards protect. Service reveals. The ledger remembers. The Chef decides."
 *
 * Preserves the domain-neutral Pathfinder runtime contracts while specializing:
 * - Entity -> Ingredient / Recipe / Component / Station
 * - Observation -> Measured Mass / Probe Core Temp / pH / Salinity / Sensory Note / Ticket Time
 * - Simulation -> Thermal Loss / Batch Scaling / Emulsion Stability / Service Load
 * - Authority -> Chef / Operator (contextual authority over the culinary domain)
 */

export type SixesOperatingMode =
  | "exploration"    // Ideas, flavour associations, speculative plating (low consequence)
  | "investigation"  // Empirical baseline, ratios, chemistry, competing references
  | "simulation"     // Yield scaling, thermal behavior, service pressure
  | "validation"     // CCP safety, allergen declarations, portioning, equipment limits
  | "service";       // Live line execution, ticket timing, recovery actions, observed variances

export interface CulinaryIngredient {
  id: string;
  name: string;
  category: "produce" | "protein" | "dairy" | "dry_goods" | "ferment" | "hydrocolloid" | "seasoning";
  supplier: string;
  allergens: string[];
  phRange?: [number, number];
  solidsPercent?: number;
  waterActivityAw?: number;
  moistureContentPercent?: number;
  storageTempC: number;
  criticalSafetyThreshold?: string;
  provenance: string;
}

export interface RecipeComponentSpec {
  id: string;
  name: string;
  type: "base_prep" | "infusion" | "emulsion" | "fermentation" | "thermal_finish" | "garnish";
  ingredients: Array<{
    ingredientId: string;
    ingredientName: string;
    quantityGrams: number;
    ratioPercent: number; // Baker's / Formulation percentage
    temperatureTargetC?: number;
    allergenWarning?: string;
  }>;
  methodSteps: string[];
  criticalControlPoints: string[];
  equipmentRequired: string[];
  yieldGrams: number;
  wastePercent: number;
  shelfLifeHours: number;
}

export interface CulinarySpecification {
  id: string;
  dishName: string;
  codeName: string; // e.g. "SIXES-DS-01"
  cuisineCategory: string;
  targetPortionGrams: number;
  targetPlatingTempC: number;
  components: RecipeComponentSpec[];
  declaredAllergens: string[];
  sensoryProfile: {
    umami: number; // 0-10
    acidity: number; // 0-10
    salinity: number; // 0-10
    bitterness: number; // 0-10
    sweetness: number; // 0-10
    textureNotes: string;
    aromaProfile: string;
  };
  operatingMode: SixesOperatingMode;
  governanceStatus: "DRAFT_EXPLORATION" | "SIMULATED_HYPOTHESIS" | "VALIDATED_SPEC" | "CHEF_COMMITTED_SERVICE";
  chefApprovalSignature?: {
    chefName: string;
    approvedAt: string;
    authorityNote: string;
    version: string;
  };
}

export interface ServiceObservationRecord {
  id: string;
  specId: string;
  ticketId: string;
  timestamp: string;
  measuredProbeTempC: number;
  actualYieldVariancePercent: number;
  stationId: string;
  cookTimeSeconds: number;
  varianceNotes: string;
  sensoryScore: number;
  recoveryActionTaken?: string;
}
