import React, { useState } from "react";
import {
  Utensils,
  Flame,
  Activity,
  Shield,
  Layers,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  ChevronRight,
  Database,
  Award,
  BookOpen,
  Thermometer,
  Scale,
  Users,
  Compass
} from "lucide-react";
import { DigitalTwin } from "../../types";
import {
  SixesOperatingMode,
  CulinarySpecification,
  ServiceObservationRecord
} from "./types";

interface SixesCulinaryStudioProps {
  twin: DigitalTwin;
  onNavigateToTab?: (tab: any) => void;
}

const SAMPLE_CULINARY_SPEC: CulinarySpecification = {
  id: "spec-sixes-01",
  dishName: "Lactic Fermented Brassica & High-Shear Emulsion of Toasted Seed Oil",
  codeName: "SIXES-DS-01",
  cuisineCategory: "Modernist Botanical / Classical Technique",
  targetPortionGrams: 185,
  targetPlatingTempC: 62.0,
  declaredAllergens: ["Sesame", "Mustard"],
  sensoryProfile: {
    umami: 8.5,
    acidity: 7.2,
    salinity: 6.8,
    bitterness: 3.4,
    sweetness: 4.1,
    textureNotes: "Silky colloidal emulsion contrasting with crisp anaerobic crunch",
    aromaProfile: "Roasted sesamin, volatile lactic esters, and subtle sulfurous complexity"
  },
  operatingMode: "service",
  governanceStatus: "CHEF_COMMITTED_SERVICE",
  chefApprovalSignature: {
    chefName: "Chef Sovereign Operator",
    approvedAt: "2026-08-20T04:20:00Z",
    authorityNote: "Portioning, allergens (Sesame/Mustard), and CCP hold limits validated under live line stress test.",
    version: "1.2.0-COMMITTED"
  },
  components: [
    {
      id: "comp-1",
      name: "Anaerobic Lactic Brassica Inoculum",
      type: "fermentation",
      ingredients: [
        { ingredientId: "ing-1", ingredientName: "Heirloom Brassica Florets", quantityGrams: 500, ratioPercent: 100 },
        { ingredientId: "ing-2", ingredientName: "Non-Iodized Sea Salt", quantityGrams: 12.5, ratioPercent: 2.5 },
        { ingredientId: "ing-3", ingredientName: "L. plantarum Starter Culture", quantityGrams: 5, ratioPercent: 1.0 }
      ],
      methodSteps: [
        "Submerge brassica in 2.5% salinity brine",
        "Seal under 99.8% vacuum in chamber sealer",
        "Ferment at 28.0°C for 48 hours until target pH <= 4.0 is observed"
      ],
      criticalControlPoints: ["CCP-1: pH must drop below 4.6 within 36 hours (Botulinum Invariant)"],
      equipmentRequired: ["Vacuum Chamber Sealer", "Incubation Chamber"],
      yieldGrams: 485,
      wastePercent: 3.0,
      shelfLifeHours: 168
    },
    {
      id: "comp-2",
      name: "High-Shear Toasted Seed Colloidal Emulsion",
      type: "emulsion",
      ingredients: [
        { ingredientId: "ing-4", ingredientName: "Toasted Sesame & Mustard Seed Oil", quantityGrams: 150, ratioPercent: 100, allergenWarning: "Sesame, Mustard" },
        { ingredientId: "ing-5", ingredientName: "Reduced Koji Dashi", quantityGrams: 120, ratioPercent: 80 },
        { ingredientId: "ing-6", ingredientName: "Egg Yolk Lecithin Matrix (Pasteurized)", quantityGrams: 30, ratioPercent: 20 }
      ],
      methodSteps: [
        "Hydrate lecithin matrix with reduced dashi at 55.0°C",
        "Stream oil slowly into high-shear rotor stator at 8,500 RPM",
        "Hold at 58.0°C in thermal water bath (Max hold time: 45 minutes)"
      ],
      criticalControlPoints: ["CCP-2: Emulsion bath temperature must not exceed 65.5°C to avoid protein curdle"],
      equipmentRequired: ["High-Shear Immersion Homogenizer", "PID Thermal Bath"],
      yieldGrams: 285,
      wastePercent: 5.0,
      shelfLifeHours: 4
    }
  ]
};

export function SixesCulinaryStudio({ twin }: SixesCulinaryStudioProps) {
  const [currentMode, setCurrentMode] = useState<SixesOperatingMode>("service");
  const [scaleCovers, setScaleCovers] = useState<number>(40);
  const [activeTab, setActiveTab] = useState<"spec" | "sim_scale" | "sensory" | "service_log">("spec");
  const [spec, setSpec] = useState<CulinarySpecification>(SAMPLE_CULINARY_SPEC);

  // Live simulation variables
  const baseCovers = 40;
  const scaleFactor = scaleCovers / baseCovers;
  const scaledTotalMass = Math.round(spec.targetPortionGrams * scaleCovers);
  const thermalLoadMinutes = Math.round(18 + Math.pow(scaleFactor, 1.25) * 6);
  const estimatedYieldDeficitPercent = scaleFactor > 2.0 ? 5.2 : 2.5;

  const [serviceObservations, setServiceObservations] = useState<ServiceObservationRecord[]>([
    {
      id: "srv-01",
      specId: spec.id,
      ticketId: "TICKET #104 (Table 4)",
      timestamp: "2026-08-20T04:25:00Z",
      measuredProbeTempC: 62.4,
      actualYieldVariancePercent: +0.8,
      stationId: "Station 1 (Hearth)",
      cookTimeSeconds: 420,
      varianceNotes: "Clean dispatch; plating temperature precisely on target (+0.4°C).",
      sensoryScore: 9.6
    },
    {
      id: "srv-02",
      specId: spec.id,
      ticketId: "TICKET #112 (Table 9 - Banquet 8-top)",
      timestamp: "2026-08-20T04:32:00Z",
      measuredProbeTempC: 60.8,
      actualYieldVariancePercent: -2.4,
      stationId: "Pass Expedite",
      cookTimeSeconds: 495,
      varianceNotes: "Minor queue delay at pass lamp; recovered with quick 30s salamander flash.",
      sensoryScore: 9.2,
      recoveryActionTaken: "Applied 30s radiant top finish to re-elevate core temp."
    }
  ]);

  const [newObsTemp, setNewObsTemp] = useState<number>(62.0);
  const [newObsNotes, setNewObsNotes] = useState<string>("");

  const handleAddObservation = () => {
    const newRecord: ServiceObservationRecord = {
      id: `srv-${Date.now()}`,
      specId: spec.id,
      ticketId: `TICKET #${Math.floor(Math.random() * 800 + 100)}`,
      timestamp: new Date().toISOString(),
      measuredProbeTempC: newObsTemp,
      actualYieldVariancePercent: Number(((Math.random() * 4) - 2).toFixed(1)),
      stationId: "Pass Expedite",
      cookTimeSeconds: 410 + Math.floor(Math.random() * 60),
      varianceNotes: newObsNotes || "Standard service observation recorded by Chef.",
      sensoryScore: Number((8.8 + Math.random() * 1.0).toFixed(1))
    };

    setServiceObservations([newRecord, ...serviceObservations]);
    setNewObsNotes("");
  };

  return (
    <div className="space-y-8 text-[#E6E4DF]">
      {/* Project SIXES Sovereign Banner */}
      <div className="bg-[#13151A] border border-[#2B303C] rounded-lg p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded tracking-wider uppercase flex items-center space-x-1">
                <Utensils className="w-3 h-3 mr-1" />
                PROJECT SIXES CULINARY DOMAIN INSTRUMENT
              </span>
              <span className="bg-[#509EE3]/15 text-[#509EE3] border border-[#509EE3]/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                PATHFINDER SUBSTRATE TENANT
              </span>
              <span className="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                CHEF SOVEREIGNTY ACTIVE
              </span>
            </div>
            <h2 className="text-2xl font-light text-[#E6E4DF] tracking-tight">
              Culinary Knowledge Field, Formulation & Service Simulator
            </h2>
            <p className="text-xs text-[#A0A4AB] leading-relaxed">
              Observe before concluding. Explore before constraining. Distinguish possibility from evidence. Govern before committing.
              The database suggests. Models compare and simulate. Standards protect. Service reveals. <strong>The Chef decides.</strong>
            </p>
          </div>

          <div className="bg-[#181A20] border border-[#2A2E39] rounded-lg p-4 font-mono text-xs text-right shrink-0 lg:max-w-xs space-y-1.5">
            <span className="text-[10px] text-[#C5A059] font-bold block uppercase tracking-wider">
              SOVEREIGN GOVERNANCE
            </span>
            <p className="text-[11px] text-[#8A8F9A] italic">
              “Models inform, compare and simulate; they do not decide.”
            </p>
            <span className="text-[9px] text-[#737885] block">
              Authority: Chef / Operator
            </span>
          </div>
        </div>
      </div>

      {/* 5 Operating Modes Ribbon (Progressive Governance Gradient) */}
      <div className="bg-[#13151A] border border-[#22262F] rounded-lg p-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#22262F]">
          <span className="text-xs font-bold text-[#E6E4DF] uppercase flex items-center space-x-2">
            <Compass className="w-4 h-4 text-[#C5A059]" />
            <span>Project SIXES Operating Modes & Governance Gradient</span>
          </span>
          <span className="text-[10px] text-[#8A8F9A]">Controls Increase Approaching Service</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-3">
          {[
            { mode: "exploration" as SixesOperatingMode, label: "1. Exploration", sub: "Flavour ideas & associations", control: "Low Consequence (Speculative)" },
            { mode: "investigation" as SixesOperatingMode, label: "2. Investigation", sub: "Empirical ratios & facts", control: "Separates Facts vs Claims" },
            { mode: "simulation" as SixesOperatingMode, label: "3. Simulation", sub: "Yield & thermal scaling", control: "Hypothetical (Not Reality)" },
            { mode: "validation" as SixesOperatingMode, label: "4. Validation", sub: "Allergens & CCP thresholds", control: "Pre-Approval Verification" },
            { mode: "service" as SixesOperatingMode, label: "5. Service", sub: "Pass execution & observations", control: "Committed Operational Truth" }
          ].map((m) => (
            <button
              key={m.mode}
              type="button"
              onClick={() => setCurrentMode(m.mode)}
              className={`p-2.5 rounded border text-left transition-all cursor-pointer space-y-1 ${
                currentMode === m.mode
                  ? "bg-[#1E2738] border-[#509EE3] text-[#E6E4DF] shadow-md shadow-[#509EE3]/10"
                  : "bg-[#181A20] border-[#2B303C] text-[#8A8F9A] hover:text-[#E6E4DF]"
              }`}
            >
              <div className="font-bold text-[11px] text-[#C5A059]">{m.label}</div>
              <div className="text-[10px] text-[#A0A8B8]">{m.sub}</div>
              <div className="text-[9px] text-[#737885]">{m.control}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Sub-Navigation: Specification vs Simulation Scale vs Sensory Profile vs Service Log */}
      <div className="flex items-center space-x-2 border-b border-[#22262F] pb-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("spec")}
          className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === "spec"
              ? "bg-[#C5A059] text-[#0D0E11] font-bold"
              : "bg-[#181A20] text-[#8A8F9A] hover:text-[#E6E4DF]"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Recipe Formulation & CCP Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sim_scale")}
          className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === "sim_scale"
              ? "bg-[#509EE3] text-[#0D0E11] font-bold"
              : "bg-[#181A20] text-[#8A8F9A] hover:text-[#E6E4DF]"
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Thermal & Yield Scaling Simulator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sensory")}
          className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === "sensory"
              ? "bg-[#10B981] text-[#0D0E11] font-bold"
              : "bg-[#181A20] text-[#8A8F9A] hover:text-[#E6E4DF]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sensory Interpretation Radar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("service_log")}
          className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === "service_log"
              ? "bg-[#C084FC] text-[#0D0E11] font-bold"
              : "bg-[#181A20] text-[#8A8F9A] hover:text-[#E6E4DF]"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Service Observation & Pass Ledger</span>
        </button>
      </div>

      {/* Tab 1: Recipe Formulation & CCP Matrix */}
      {activeTab === "spec" && (
        <div className="space-y-6">
          <div className="bg-[#13151A] border border-[#22262F] rounded-lg p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#22262F] gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-wider">
                  MASTER SPECIFICATION • {spec.codeName}
                </span>
                <h3 className="text-xl font-medium text-[#E6E4DF]">{spec.dishName}</h3>
                <span className="text-xs text-[#8A8F9A]">{spec.cuisineCategory} • Target Portion: {spec.targetPortionGrams}g @ {spec.targetPlatingTempC}°C</span>
              </div>

              {/* Chef Authority Signature Box */}
              {spec.chefApprovalSignature && (
                <div className="bg-[#181A20] border border-[#2D5A38] rounded-lg p-3 font-mono text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-[#4ADE80] font-bold">
                    <Award className="w-3.5 h-3.5" />
                    <span>CHEF SOVEREIGN COMMIT</span>
                  </div>
                  <div className="text-[11px] text-[#E6E4DF]">{spec.chefApprovalSignature.chefName} ({spec.chefApprovalSignature.version})</div>
                  <div className="text-[9px] text-[#737885] max-w-xs">{spec.chefApprovalSignature.authorityNote}</div>
                </div>
              )}
            </div>

            {/* Declared Allergens Warning Ribbon */}
            <div className="p-3 bg-[#2A1810] border border-[#5C2B14] rounded-lg flex items-center justify-between font-mono text-xs">
              <div className="flex items-center space-x-2 text-[#F87171]">
                <Shield className="w-4 h-4" />
                <span className="font-bold">DECLARED ALLERGEN BOUNDARY:</span>
                <span className="text-[#E6E4DF]">{spec.declaredAllergens.join(", ")} (Strict isolation at Station 1)</span>
              </div>
              <span className="text-[10px] text-[#F87171] uppercase">High Consequence Gate</span>
            </div>

            {/* Components & Method Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {spec.components.map((comp) => (
                <div key={comp.id} className="bg-[#181A20] border border-[#262B35] rounded-lg p-5 space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#262B35]">
                    <div>
                      <span className="text-[10px] text-[#C5A059] font-bold uppercase">{comp.type}</span>
                      <h4 className="text-sm font-semibold text-[#E6E4DF]">{comp.name}</h4>
                    </div>
                    <span className="text-[#509EE3] text-[11px] font-bold">{comp.yieldGrams}g yield</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[#8A8F9A] uppercase font-bold">Ingredient Formulation:</span>
                    {comp.ingredients.map((ing) => (
                      <div key={ing.ingredientId} className="flex justify-between items-center bg-[#13151A] p-2 rounded border border-[#22252D]">
                        <span className="text-[#E6E4DF]">{ing.ingredientName}</span>
                        <div className="space-x-2">
                          <span className="text-[#509EE3] font-bold">{ing.quantityGrams}g</span>
                          <span className="text-[#8A8F9A]">({ing.ratioPercent}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-[#262B35]">
                    <span className="text-[10px] text-[#8A8F9A] uppercase font-bold">Critical Control Points (CCP):</span>
                    {comp.criticalControlPoints.map((ccp, idx) => (
                      <div key={idx} className="p-2 bg-[#201518] text-[#F87171] rounded border border-[#481E26] text-[10px]">
                        {ccp}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Thermal & Yield Scaling Simulator */}
      {activeTab === "sim_scale" && (
        <div className="space-y-6">
          <div className="bg-[#13151A] border border-[#22262F] rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#22262F]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#509EE3] font-bold tracking-wider">
                  PHYSICAL SCALE & THERMODYNAMIC PDE SIMULATOR
                </span>
                <h3 className="text-xl font-medium text-[#E6E4DF]">
                  Banquet Batch Scaling & Thermal Carryover
                </h3>
              </div>
              <span className="text-xs font-mono text-[#4ADE80] bg-[#111A16] border border-[#1C3527] px-3 py-1 rounded">
                SIMULATION MODE • HYPOTHETICAL
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs max-w-xl">
              <div className="flex justify-between text-[#8A8F9A]">
                <span>SCALE TARGET (SERVICE COVERS)</span>
                <span className="text-[#C5A059] font-bold text-sm">{scaleCovers} Covers ({scaleFactor.toFixed(1)}x Nominal)</span>
              </div>
              <input
                type="range"
                min={20}
                max={200}
                step={10}
                value={scaleCovers ?? 40}
                onChange={(e) => setScaleCovers(Number(e.target.value) || 40)}
                className="w-full accent-[#509EE3] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#737885]">
                <span>20 covers (A la carte)</span>
                <span>80 covers (Tasting Menu)</span>
                <span>200 covers (Large Banquet)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="bg-[#181A20] p-4 rounded-lg border border-[#2B303C] space-y-1">
                <span className="text-[10px] text-[#8A8F9A] block">SCALED TOTAL MASS</span>
                <span className="text-lg font-bold text-[#509EE3]">{(scaledTotalMass / 1000).toFixed(2)} kg</span>
                <span className="text-[10px] text-[#737885] block">Requires 2x 10L stockpots</span>
              </div>

              <div className="bg-[#181A20] p-4 rounded-lg border border-[#2B303C] space-y-1">
                <span className="text-[10px] text-[#8A8F9A] block">THERMAL COME-UP TIME</span>
                <span className="text-lg font-bold text-[#EAB308]">{thermalLoadMinutes} mins</span>
                <span className="text-[10px] text-[#737885] block">+{(thermalLoadMinutes - 18)} mins over nominal 40-cover</span>
              </div>

              <div className="bg-[#181A20] p-4 rounded-lg border border-[#2B303C] space-y-1">
                <span className="text-[10px] text-[#8A8F9A] block">ADHESION YIELD DEFICIT</span>
                <span className="text-lg font-bold text-[#F87171]">-{estimatedYieldDeficitPercent}% loss</span>
                <span className="text-[10px] text-[#737885] block">Recommended buffer: +{Math.round(scaledTotalMass * 0.05)}g raw prep</span>
              </div>
            </div>

            <div className="p-4 bg-[#181A20] border border-[#262B35] rounded-lg font-mono text-xs space-y-2">
              <div className="flex items-center space-x-2 text-[#C5A059] font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>GOVERNANCE SIMULATION NOTICE</span>
              </div>
              <p className="text-[#A0A4AB] text-[11px] leading-relaxed">
                “Simulation represents possible behaviour. A simulated result must never be silently represented as an observed kitchen result. Successful simulation does not automatically authorise production until the Chef commits the recipe scale.”
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Sensory Interpretation Radar */}
      {activeTab === "sensory" && (
        <div className="space-y-6">
          <div className="bg-[#13151A] border border-[#22262F] rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#22262F]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#10B981] font-bold tracking-wider">
                  SENSORY COORDINATES & INTERPRETATION FIELD
                </span>
                <h3 className="text-xl font-medium text-[#E6E4DF]">
                  Flavour Architecture & Aroma Dynamics
                </h3>
              </div>
              <span className="text-xs font-mono text-[#8A8F9A]">Sensory Doctrine</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-mono text-xs">
              {[
                { label: "UMAMI", val: spec.sensoryProfile.umami, color: "text-[#509EE3]" },
                { label: "ACIDITY", val: spec.sensoryProfile.acidity, color: "text-[#4ADE80]" },
                { label: "SALINITY", val: spec.sensoryProfile.salinity, color: "text-[#EAB308]" },
                { label: "BITTERNESS", val: spec.sensoryProfile.bitterness, color: "text-[#C084FC]" },
                { label: "SWEETNESS", val: spec.sensoryProfile.sweetness, color: "text-[#F87171]" }
              ].map((s) => (
                <div key={s.label} className="bg-[#181A20] p-4 rounded border border-[#262B35] space-y-2">
                  <div className="flex justify-between text-[#8A8F9A] text-[10px]">
                    <span>{s.label}</span>
                    <span className={`font-bold ${s.color}`}>{s.val}/10</span>
                  </div>
                  <div className="w-full bg-[#13151A] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C5A059]"
                      style={{ width: `${s.val * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="bg-[#181A20] p-4 rounded border border-[#262B35] space-y-1.5">
                <span className="text-[10px] text-[#C5A059] uppercase font-bold">Texture Dynamics:</span>
                <p className="text-[#E6E4DF] text-xs leading-relaxed">{spec.sensoryProfile.textureNotes}</p>
              </div>
              <div className="bg-[#181A20] p-4 rounded border border-[#262B35] space-y-1.5">
                <span className="text-[10px] text-[#509EE3] uppercase font-bold">Aroma Profile:</span>
                <p className="text-[#E6E4DF] text-xs leading-relaxed">{spec.sensoryProfile.aromaProfile}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Service Observation & Pass Ledger */}
      {activeTab === "service_log" && (
        <div className="space-y-6">
          <div className="bg-[#13151A] border border-[#22262F] rounded-lg p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#22262F] gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#C084FC] font-bold tracking-wider">
                  SERVICE OBSERVATION DOCTRINE
                </span>
                <h3 className="text-xl font-medium text-[#E6E4DF]">
                  Live Kitchen Pass Telemetry & Variance Records
                </h3>
              </div>
              <span className="text-xs font-mono text-[#A0A4AB]">
                “Service is where the digital twin encounters physical reality.”
              </span>
            </div>

            {/* Quick Observation Recorder */}
            <div className="bg-[#181A20] border border-[#2B303C] rounded-lg p-4 font-mono text-xs space-y-3">
              <span className="text-[10px] text-[#C5A059] font-bold uppercase block">
                Record New Pass Observation (Chef / Expediter):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-[#8A8F9A] block mb-1">PROBE CORE TEMP (°C)</span>
                  <input
                    type="number"
                    step={0.1}
                    value={newObsTemp ?? 62.0}
                    onChange={(e) => setNewObsTemp(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#13151A] border border-[#262B35] p-2 rounded text-[#E6E4DF] focus:outline-none focus:border-[#509EE3]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[10px] text-[#8A8F9A] block mb-1">VARIANCE OR RECOVERY NOTES</span>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="e.g. Flash 20s salamander recovery on Table 6..."
                      value={newObsNotes ?? ""}
                      onChange={(e) => setNewObsNotes(e.target.value)}
                      className="flex-1 bg-[#13151A] border border-[#262B35] p-2 rounded text-[#E6E4DF] focus:outline-none focus:border-[#509EE3]"
                    />
                    <button
                      type="button"
                      onClick={handleAddObservation}
                      className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0D0E11] px-4 py-2 rounded font-bold transition-colors cursor-pointer"
                    >
                      Record
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recorded Service Observations */}
            <div className="space-y-3 font-mono text-xs">
              <span className="text-[10px] text-[#8A8F9A] uppercase font-bold">Empirical Service Pass Ledger ({serviceObservations.length} Tickets):</span>
              {serviceObservations.map((obs) => (
                <div key={obs.id} className="bg-[#181A20] border border-[#262B35] rounded-lg p-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[#8A8F9A] text-[11px] pb-2 border-b border-[#22252D] gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-[#C5A059] font-bold">{obs.ticketId}</span>
                      <span>•</span>
                      <span className="text-[#E6E4DF]">{obs.stationId}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-[10px]">
                      <span>Cook Time: <strong className="text-[#E6E4DF]">{obs.cookTimeSeconds}s</strong></span>
                      <span>Core Temp: <strong className="text-[#4ADE80]">{obs.measuredProbeTempC}°C</strong></span>
                      <span>Sensory Score: <strong className="text-[#509EE3]">{obs.sensoryScore}/10</strong></span>
                    </div>
                  </div>

                  <p className="text-[#E6E4DF] text-xs">{obs.varianceNotes}</p>
                  {obs.recoveryActionTaken && (
                    <div className="text-[10px] text-[#F87171] bg-[#2A1818] p-1.5 rounded border border-[#522020]">
                      <strong>RECOVERY ACTION:</strong> {obs.recoveryActionTaken}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
