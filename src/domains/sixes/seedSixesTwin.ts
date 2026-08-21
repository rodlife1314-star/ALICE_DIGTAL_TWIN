import { DigitalTwin } from "../../types";

export const PROJECT_SIXES_TWIN: DigitalTwin = {
  id: "project-sixes-culinary-08",
  name: "Project SIXES — Artisanal Fermentation & Thermal Emulsion Instrument",
  domain: "biological",
  purpose: "Culinary digital twin on the Pathfinder substrate. Evidence-aware workspace for exploring, formulating, simulating and governing culinary systems across development, recipe formulation, production and service.",
  description: "A dual-phase culinary instrument modelling lactic acid bacterial kinetics (pH 6.4 → 3.8), lipid droplet dispersion stability (shear vs thermal carryover), batch scaling yield, and service ticket dispatch with strict Chef sovereignty.",
  integrityStatus: "STABLE",
  createdAt: "2026-08-20T00:00:00Z",
  updatedAt: "2026-08-20T04:40:00Z",
  boundary: {
    description: "Culinary production & service membrane encompassing cold prep, thermal cook stations, fermentation chamber, plating pass, and guest dispatch.",
    includedEntities: [
      "Lactic Acid Fermentation Substrate",
      "Shear Rotor Emulsion Reactor",
      "Precision Induction Hearth (64.5°C)",
      "Service Pass Expedite Station",
      "Allergen Cross-Contact Isolation Zone"
    ],
    excludedEntities: [
      "Bulk Warehouse Storage",
      "Public Dining Room Ambient",
      "External Refrigerated Supply Chain"
    ],
    inputs: [
      { id: "in-1", name: "Whole Muscle Protein & Heirlooms", type: "raw_produce_and_protein", rate: "25 kg/day" },
      { id: "in-2", name: "LAB Inoculum (L. plantarum / brevis)", type: "microbial_culture", rate: "50 ml/batch" },
      { id: "in-3", name: "Thermal Power & Precision Sensors", type: "energy_and_telemetry", rate: "3.2 kW" }
    ],
    outputs: [
      { id: "out-1", name: "Committed Plate Assembly (Service Pass)", type: "finished_dish", rate: "80 covers/service" },
      { id: "out-2", name: "Sensory & Temperature Telemetry Observations", type: "provenance_data", rate: "12 readings/ticket" },
      { id: "out-3", name: "Organic Production Byproducts", type: "prep_waste", rate: "1.8 kg/day" }
    ],
    permeabilityRules: [
      {
        id: "perm-c1",
        inputType: "raw_ingredient",
        condition: "IF allergen_declaration IS UNVERIFIED → STOP",
        action: "reject"
      },
      {
        id: "perm-c2",
        inputType: "fermentation_medium",
        condition: "IF pH > 4.6 AFTER 48h → REJECT_BATCH (Botulinum Invariant)",
        action: "reject"
      },
      {
        id: "perm-c3",
        inputType: "service_ticket",
        condition: "IF Chef approval signature IS NULL → HOLD",
        action: "store"
      }
    ]
  },
  activeFlows: [
    {
      stage: "COLLECTION",
      title: "Raw Harvest & Microbiological Intake",
      description: "Organic koji grains, seasonal brassicas, and pasture proteins intake with strict lot traceability and certified allergen profiling.",
      rateOrVolume: "25.0 kg/day",
      lossOrEfficiency: "98.5% Intake Acceptance"
    },
    {
      stage: "STORAGE",
      title: "Atmospheric & Microbial Incubation",
      description: "Climate-regulated fermentation chamber holding at 28°C and 85% RH; cold storage buffer at 2.5°C.",
      rateOrVolume: "140 L active capacity",
      lossOrEfficiency: "0.2% evaporation loss/day"
    },
    {
      stage: "TRANSFORMATION",
      title: "Thermal Coagulation & Emulsion Shear",
      description: "Sous-vide water baths at 64.5°C with high-shear rotor-stator blending at 8,500 RPM for colloidal lipid suspension.",
      rateOrVolume: "12 batches/shift",
      lossOrEfficiency: "94.2% Yield Factor"
    },
    {
      stage: "DISTRIBUTION",
      title: "Pass Expedite & Guest Plating Dispatch",
      description: "Synchronized ticket fire, infrared holding zone (58°C core), and final Chef quality signoff before dispatch.",
      rateOrVolume: "80 covers / 2.5h window",
      lossOrEfficiency: "99.1% On-Time Ticket Target"
    }
  ],
  sourceAssets: [
    {
      id: "asset-sixes-01",
      name: "Modernist Culinary Physics & Emulsion Thermodynamics (Vol. 4)",
      type: "Reference Manual",
      timestamp: "2026-08-20T00:00:00Z"
    },
    {
      id: "asset-sixes-02",
      name: "Food Safety & Hazard Analysis CCP Manual (FSMA/HACCP Standard)",
      type: "Safety Standard",
      timestamp: "2026-08-20T00:00:00Z"
    },
    {
      id: "asset-sixes-03",
      name: "Chef Ledger & Service Observation Log (Service Season 06)",
      type: "Empirical Logbook",
      timestamp: "2026-08-20T04:15:00Z"
    }
  ],
  entities: [
    {
      id: "ent-sixes-01",
      name: "Lactic Fermentation Bioreactor",
      type: "Fermentation Vessel",
      state: { currentPH: 4.1, temperatureC: 28.0, brix: 11.2, status: "active" },
      description: "Anerobic ceramic jar with CO2 airlock and multi-point pH probe telemetry."
    },
    {
      id: "ent-sixes-02",
      name: "Precision Shear Emulsifier",
      type: "Equipment Asset",
      state: { rpm: 8500, motorTempC: 38.5, dropletMeanSizeMicrons: 1.4 },
      description: "High-shear rotor stator creating stable thermodynamic oil-in-water colloids."
    },
    {
      id: "ent-sixes-03",
      name: "Precision Induction Hearth (Station 1)",
      type: "Cooking Station",
      state: { surfaceTempC: 64.5, powerWatts: 1800, targetProbeTempC: 62.0 },
      description: "PID-controlled induction cooktop for precise yolk and myofibrillar protein coagulation."
    },
    {
      id: "ent-sixes-04",
      name: "Service Expedite Pass",
      type: "Dispatch Station",
      state: { activeTickets: 4, averageLeadTimeMins: 11.5, holdingHeatMv: 58.0 },
      description: "Pass heat lamp and digital kitchen ticket coordination hub."
    }
  ],
  relationships: [
    {
      id: "rel-sixes-01",
      sourceId: "ent-sixes-01",
      targetId: "ent-sixes-02",
      relationshipType: "ingredient_supply",
      medium: "sterile pipe",
      strength: 0.95,
      direction: "one_way"
    },
    {
      id: "rel-sixes-02",
      sourceId: "ent-sixes-02",
      targetId: "ent-sixes-03",
      relationshipType: "component_integration",
      medium: "prep container",
      strength: 0.90,
      direction: "one_way"
    },
    {
      id: "rel-sixes-03",
      sourceId: "ent-sixes-03",
      targetId: "ent-sixes-04",
      relationshipType: "plating_assembly",
      medium: "service plate",
      strength: 0.98,
      direction: "one_way"
    }
  ],
  states: [
    {
      id: "state-sixes-prep",
      name: "Mise en Place & Ferment Baseline",
      metrics: { totalPrepBatches: 6, verifiedAllergens: "100%", ambientHumidity: "48%" },
      timestamp: "2026-08-20T01:00:00Z"
    },
    {
      id: "state-sixes-live",
      name: "Peak Banquet Line Service (Covers 30-70)",
      metrics: { linePaceMinutes: 12.0, passQueueDepth: 3, tempCompliance: "99.4%" },
      timestamp: "2026-08-20T04:20:00Z",
      active: true
    }
  ],
  observations: [
    {
      id: "obs-sixes-01",
      fact: "Core temperature of slow-poached yolk stabilized at 63.8°C at 32 minutes",
      value: "63.8°C",
      isFact: true,
      quality: "measured",
      evidenceClass: "surviving_physical",
      timestamp: "2026-08-20T03:15:00Z"
    },
    {
      id: "obs-sixes-02",
      fact: "L. plantarum batch #4 reached pH 4.02 after 36 hours at 28.5°C",
      value: "pH 4.02",
      isFact: true,
      quality: "measured",
      evidenceClass: "surviving_physical",
      timestamp: "2026-08-20T03:45:00Z"
    },
    {
      id: "obs-sixes-03",
      fact: "Lipid emulsion separation observed if holding exceeds 54 minutes at 58°C",
      value: "Colloidal break (inferred)",
      isFact: false,
      quality: "inferred",
      evidenceClass: "hypothesis",
      timestamp: "2026-08-20T04:00:00Z"
    }
  ],
  interpretations: [
    {
      id: "interp-sixes-01",
      claim: "Lactic acidity buffer prevents retrogradation in starch hydrocolloids while protecting microbiological safety below pH 4.2",
      evidenceIds: ["obs-sixes-02"],
      confidence: 96,
      status: "approved",
      createdAt: "2026-08-20T03:50:00Z",
      author: "Chef / Operator"
    }
  ],
  simulations: [
    {
      id: "sim-sixes-01",
      name: "Banquet Scaling (120 Covers) Thermal Load & Yield Model",
      startingState: "Nominal 40-cover recipe batch size (1.2 kg base)",
      changedVariables: "Scale factor: 3.0x; Inductions loaded to 90% power capacity",
      assumptions: [
        "Thermal recovery time per batch is 4.5 minutes",
        "Evaporation loss increases nonlinearly from 4.2% to 6.8%",
        "Emulsion shear must be executed in 2 staged aliquots"
      ],
      predictedOutcomes: [
        "Total cook duration extended by 18 minutes",
        "Final portion yield: 114 plates (6 plate deficit due to vessel wall clinging)",
        "Holding pass buffer requires supplementary warming drawer"
      ],
      divergence: "Deficit of 5% in net sauce yield compared to linear scaling",
      confidence: 89,
      createdAt: "2026-08-20T04:10:00Z",
      executionStatus: "VALIDATED_EVIDENCE",
      computeReceipt: {
        selectedRail: "LOCAL_DETERMINISTIC",
        endpointOrModel: "local-thermodynamics-pde-v2",
        inputManifest: { covers: 120, vesselDiameterCm: 32, viscosityCps: 240 },
        codeVersion: "1.4.0",
        hardwareMetadata: { device: "CPU Core", memoryGb: 8 },
        rawOutputArtifact: { netYieldGrams: 3420, energyKwh: 4.8 },
        timestamp: "2026-08-20T04:12:00Z",
        runId: "run-sixes-scale-01",
        uncertaintyAndConvergence: { converged: true, residualError: 0.012 },
        inputOutputHash: "hash-sixes-scale-01",
        fallbackOrDegradedMode: "none"
      },
      jemmaValidation: {
        validated: true,
        unitsChecked: true,
        completenessScore: 98,
        evidenceClass: "reconstruction",
        notes: "All thermal units verified in Joules and grams; mass balance is closed.",
        validatedAt: "2026-08-20T04:13:00Z"
      },
      orionAblationChallenge: {
        challenged: true,
        assumptionsAttacked: ["Assuming wall clinging scales linearly with volume"],
        counterfactualVulnerability: "High viscosity sauce exhibits increased surface adhesion on larger stainless pots.",
        stressResult: "Yield deficit confirmed between 4.8% and 6.2%",
        passed: true
      },
      operatorPromotionGate: {
        status: "approved",
        promotedAt: "2026-08-20T04:15:00Z",
        operatorNotes: "Chef approved 3.2x ingredient batch scaling for 120 covers with 200g surplus buffer.",
        admittedToLedger: true
      }
    }
  ],
  revisions: [
    {
      id: "rev-sixes-01",
      title: "Chef Authority Commit: Master Spec v1.2",
      description: "Promoted fermented brassica & lipid emulsion specification from Validation to Live Service Mode.",
      author: "Chef / Operator",
      timestamp: "2026-08-20T04:20:00Z",
      changeSummary: "Locked CCP temp to 64.0°C; enforced mandatory peanut/dairy cross-contact quarantine."
    }
  ]
};
