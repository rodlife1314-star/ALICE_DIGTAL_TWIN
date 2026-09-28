import { DigitalTwin } from "../types";
import { SYSTEM_CAPABILITY_REGISTRY } from "./seedCapabilityRegistry";

export const INTELLIGENT_PROTECTIVE_MEMBRANE_TWIN: DigitalTwin = {
  id: "intelligent-protective-membrane-07",
  name: "Pathfinder Intelligent Protective Membrane",
  description: "Multi-scale self-reporting protective nervous system translating dense metal–metal orbital overlap physics into safe W/Mo and Hf/Zr functional networks for real-time impact localization, blind crack detection, and delamination telemetry.",
  domain: "materials",
  purpose: "Translate dense electronic topology into safe, non-actinide deformation-sensitive molecular networks for distributed strain telemetry, in-situ structural integrity monitoring, and impact localization across 4 progressive scales.",
  capabilityRegistry: SYSTEM_CAPABILITY_REGISTRY,
  selectedModelId: "physics-pde-solver-v2",
  selectedModelCapability: SYSTEM_CAPABILITY_REGISTRY[2],
  boundary: {
    description: "Multi-layer protective laminate: SiC ceramic strike face, cross-ply aramid backing, functional piezoresistive MOF/COF sensing network, containment elastomer, and multi-frequency AC impedance interrogation bus.",
    includedEntities: [
      "Electronic Scale (σ, π, δ Orbital Overlap & Charge Transport)",
      "Molecular-Network Scale (MOF/COF 2D Lattice Anchor)",
      "Functional-Coating Scale (Piezoresistive & Impedance Sensor Grid)",
      "Wearable-System Scale (Ceramic/Aramid Protective Laminate)",
      "Non-Actinide Surrogate Screening Engine (W/Mo & Hf/Zr Matrix)"
    ],
    excludedEntities: [
      "Bulk Actinide Deployment (Co-U-Co Computational Reference Physics Only)",
      "Far-Field Ballistic Projectile Flight Dynamics",
      "External RF Signals Beyond 1 MHz AC Interrogation Band"
    ],
    inputs: [
      { id: "inp-ipm-1", name: "Kinetic Impact & Projectile Load", type: "kinetic_energy", rate: "0–950 m/s (up to 4.2 kJ)", medium: "ceramic strike face" },
      { id: "inp-ipm-2", name: "Flexural & Shear Strain Field", type: "mechanical_strain", rate: "0.01% – 5.5% ε", medium: "laminate substrate" },
      { id: "inp-ipm-3", name: "Multi-Frequency AC Interrogation", type: "electrical_impedance", rate: "100 Hz – 1 MHz / 50 mV", medium: "gold micro-electrode array" },
      { id: "inp-ipm-4", name: "Thermal Flux & Heat Cycling", type: "thermal_energy", rate: "-40°C to +120°C (ΔT up to 15°C/s)", medium: "protective shell" }
    ],
    outputs: [
      { id: "out-ipm-1", name: "Distributed Strain & Stress Telemetry", type: "spatial_strain_vector", rate: "64-node array @ 100 kHz", medium: "wearable telemetry bus" },
      { id: "out-ipm-2", name: "Internal Delamination & Crack Alert", type: "damage_signal", rate: "Sub-millimeter resolution (>0.4 mm²)", medium: "epistemic telemetry ledger" },
      { id: "out-ipm-3", name: "Post-Impact Residual Integrity Index", type: "structural_index", rate: "0.0 – 1.0 integrity rating", medium: "operator heads-up telemetry" },
      { id: "out-ipm-4", name: "Acoustic Shockwave Attenuation", type: "shockwave_damping", rate: "38 dB acoustic dissipation", medium: "elastomer/MOF matrix" }
    ],
    permeabilityRules: [
      { id: "rule-ipm-1", inputType: "kinetic_strain", condition: "strain_rate > 0.05% ε/ms", action: "permit", parameters: { triggerHighRateSampling: true } },
      { id: "rule-ipm-2", inputType: "impedance_anomaly", condition: "delta_Z > 14.0%", action: "redirect", parameters: { alertType: "BLIND_DELAMINATION_ALARM" } },
      { id: "rule-ipm-3", inputType: "actinide_radioactivity", condition: "radiation_detected == true", action: "reject", parameters: { enforceStrictContainment: true, safetyGate: "FAIL_ACTINIDE_EXCLUSION" } },
      { id: "rule-ipm-4", inputType: "thermal_shock", condition: "surface_temp > 95°C", action: "attenuate", parameters: { activateThermalCompensation: true } }
    ]
  },
  sourceAssets: [
    { id: "asset-ipm-1", name: "co_u_co_reference_dft_density.json", type: "electronic_structure_dft", size: "64.2 MB", timestamp: "2026-08-18 10:00" },
    { id: "asset-ipm-2", name: "w_mo_cof_piezoresistive_sweep.csv", type: "experimental_telemetry", size: "12.8 MB", timestamp: "2026-08-18 14:30" },
    { id: "asset-ipm-3", name: "ballistic_impact_64node_telemetry.h5", type: "high_speed_sensor_array", size: "148.5 MB", timestamp: "2026-08-19 04:15" },
    { id: "asset-ipm-4", name: "surrogate_toxicity_migration_report.pdf", type: "safety_gate_audit", size: "4.1 MB", timestamp: "2026-08-18 16:00" }
  ],
  entities: [
    {
      id: "ent-ipm-1",
      name: "Electronic Scale: Orbital Overlap & Charge Transport Core",
      type: "quantum_electronic_domain",
      state: {
        referenceBonds: "10 cumulative metal-metal bonds (Co-U-Co)",
        orbitalSymmetries: "σ, π, and δ directional interactions",
        redoxSensitivity: "0.42 V / 1% strain",
        deformationResponse: "Pre-failure electronic bandgap narrowing",
        surrogateOrbitalGoal: "Directional 5d/4d interactions (W/Mo, Hf/Zr)"
      },
      description: "Scale 1: Dense electronic topology establishing reference orbital overlap, charge delocalisation, redox behaviour, and strain-induced electronic precursors prior to structural failure.",
      status: "active"
    },
    {
      id: "ent-ipm-2",
      name: "Molecular-Network Scale: MOF/COF 2D Lattice Anchor",
      type: "nanostructured_molecular_network",
      state: {
        scaffoldType: "2D Covalent Organic Framework (COF-606)",
        poreDiameter: "2.4 nm hexagonal channels",
        anchoringDensity: "8.4e13 motifs/cm²",
        fatigueEndurance: ">10,000 cyclic deformations (ε = 2.0%)",
        barrierResistance: "Zero O2 / moisture degradation after 500 hrs"
      },
      description: "Scale 2: Molecular network anchoring motifs into scalable polymers, MOFs, and COFs. Preserves inter-motif charge transport and flexibility under environmental cycling.",
      status: "active"
    },
    {
      id: "ent-ipm-3",
      name: "Functional-Coating Scale: Piezoresistive & Impedance Sensor Grid",
      type: "spatial_sensing_matrix",
      state: {
        nodeTopology: "8x8 (64-node) orthogonal micro-electrode array",
        gaugeFactor: 14.8,
        spatialResolution: "1.8 mm",
        interrogationBand: "100 Hz – 1 MHz AC impedance",
        blindDamageDetection: "Delamination > 0.4 mm² detected with 99.4% precision"
      },
      description: "Scale 3: Thin functional coating providing spatially resolved piezoresistive and impedance mapping. Detects microcracks, delamination, and thermal spikes in-situ.",
      status: "active"
    },
    {
      id: "ent-ipm-4",
      name: "Wearable-System Scale: Ceramic/Aramid Protective Laminate",
      type: "integrated_protective_laminate",
      state: {
        strikeFace: "4.5 mm Silicon Carbide (SiC) Ceramic",
        backingLayer: "12-ply Kevlar-29 Aramid Cross-Ply",
        telemetryLatency: "12 μs",
        residualIntegrityIndex: 0.94,
        arealDensityPenalty: "+2.1% total mass overhead",
        thermalComfortScore: "Nominal (0.18 W/m·K dissipation)"
      },
      description: "Scale 4: Full wearable protective laminate combining ceramic strike face, aramid backing, and the self-reporting nervous system for impact telemetry and post-hit assessment.",
      status: "active"
    },
    {
      id: "ent-ipm-5",
      name: "Non-Actinide Surrogate Screening Engine",
      type: "material_governance_engine",
      state: {
        referencePhysics: "Co-U-Co (Uranium 5f/6d + Cobalt 3d) — Computation Only",
        candidateGroupA: "Tungsten (W) / Molybdenum (Mo) [5d/4d conductivity & redox]",
        candidateGroupB: "Hafnium (Hf) / Zirconium (Zr) [Group 4 environmental stability]",
        toxicityGate: "PASS: 0.0 ppm cytotoxic heavy metal leaching",
        migrationGate: "PASS: Complete polymer encapsulation integrity",
        actinideSafetyBoundary: "STRICT EXCLUSION ENFORCED"
      },
      description: "Material substitution and safety governance engine screening non-toxic 5d/4d d-block candidates against the actinide reference without radiological hazard.",
      status: "active"
    }
  ],
  relationships: [
    { id: "rel-ipm-1", sourceId: "ent-ipm-1", targetId: "ent-ipm-2", relationshipType: "orbital_to_lattice_transport", medium: "conjugated covalent bond", strength: 0.96, latency: 1, direction: "two_way" },
    { id: "rel-ipm-2", sourceId: "ent-ipm-2", targetId: "ent-ipm-3", relationshipType: "lattice_to_coating_transduction", medium: "piezoresistive impedance", strength: 0.92, latency: 4, direction: "two_way" },
    { id: "rel-ipm-3", sourceId: "ent-ipm-3", targetId: "ent-ipm-4", relationshipType: "coating_to_laminate_telemetry", medium: "micro-bus telemetry", strength: 0.98, latency: 12, direction: "two_way" },
    { id: "rel-ipm-4", sourceId: "ent-ipm-5", targetId: "ent-ipm-2", relationshipType: "surrogate_material_synthesis_gate", medium: "evidence_gate", strength: 1.0, latency: 0, direction: "one_way" }
  ],
  states: [
    {
      id: "st-ipm-1",
      name: "Quiescent Baseline Integrity State",
      metrics: {
        systemIntegrity: "100%",
        gaugeFactor: 14.8,
        baselineImpedance: "48.2 kΩ @ 100 kHz",
        ambientTemp: "21.4°C",
        delaminationRisk: "0.0%",
        activeNodes: "64/64"
      },
      timestamp: "2026-08-19 05:00",
      active: true
    },
    {
      id: "st-ipm-2",
      name: "Dynamic Ballistic Kinetic Event State",
      metrics: {
        peakImpactEnergy: "2.84 kJ",
        projectileVelocity: "720 m/s",
        impactLocation: "(x: 34.2 mm, y: 58.1 mm)",
        shockwaveSpreadVelocity: "4,250 m/s",
        impedanceDrop: "-38.5%",
        residualIntegrityIndex: 0.88
      },
      timestamp: "2026-08-19 05:30",
      active: false
    }
  ],
  observations: [
    {
      id: "obs-ipm-1",
      fact: "Co–U–Co reference DFT electronic calculations confirm 10 cumulative metal-metal bonds with combined 5f/6d and 3d orbital overlap, exhibiting a -0.34 eV band gap compression under 1.0% axial strain.",
      value: "10 metal-metal bonds / -0.34 eV delta @ 1% ε",
      isFact: true,
      quality: "sensor",
      evidenceClass: "surviving_physical",
      timestamp: "2026-08-18 10:15"
    },
    {
      id: "obs-ipm-2",
      fact: "Synthesized Tungsten/Molybdenum (W/Mo) 2D COF membrane demonstrates a piezoresistive gauge factor of 14.8 across 0.01% to 2.5% strain with linear impedance response (R² = 0.998).",
      value: "Gauge Factor 14.8 / R² = 0.998",
      isFact: true,
      quality: "measured",
      evidenceClass: "surviving_physical",
      timestamp: "2026-08-18 15:00"
    },
    {
      id: "obs-ipm-3",
      fact: "Group 4 Hafnium/Zirconium (Hf/Zr) coordination networks show zero baseline resistance drift (<0.02% ΔR) over 10,000 cyclic flex tests and withstand 85°C / 85% RH moisture aging for 500 hours.",
      value: "<0.02% drift / 10k cycles / 500h 85/85",
      isFact: true,
      quality: "measured",
      evidenceClass: "surviving_physical",
      timestamp: "2026-08-18 16:45"
    },
    {
      id: "obs-ipm-4",
      fact: "High-speed 64-node array reconstructed 650 m/s kinetic impact point with 1.8 mm spatial accuracy and 12 μs latency, distinguishing ceramic compressive shock from aramid tensile deformation.",
      value: "1.8 mm spatial / 12 μs latency",
      isFact: true,
      quality: "sensor",
      evidenceClass: "surviving_physical",
      timestamp: "2026-08-19 04:30"
    },
    {
      id: "obs-ipm-5",
      fact: "Sub-surface internal ceramic/aramid delamination (0.65 mm² area) triggered an immediate 18.2% impedance phase shift at 100 kHz, 45 μs prior to visible surface cracking.",
      value: "+18.2% phase shift @ 100 kHz / 45 μs precursor",
      isFact: true,
      quality: "sensor",
      evidenceClass: "surviving_physical",
      timestamp: "2026-08-19 04:45"
    }
  ],
  interpretations: [
    {
      id: "interp-ipm-1",
      claim: "Directional 5d/4d orbital interactions in W/Mo COF networks reproduce the required deformation-sensitive electronic gauge response of the actinide reference without radiological hazard or cytotoxicity.",
      evidenceIds: ["obs-ipm-1", "obs-ipm-2"],
      confidence: 96,
      status: "approved",
      createdAt: "2026-08-18 16:00"
    },
    {
      id: "interp-ipm-2",
      claim: "High-frequency AC impedance shifts serve as a deterministic early-warning precursor of ceramic strike-face microcracking and internal delamination before mechanical breach.",
      evidenceIds: ["obs-ipm-4", "obs-ipm-5"],
      confidence: 94,
      status: "approved",
      createdAt: "2026-08-19 05:00"
    }
  ],
  simulations: [
    {
      id: "sim-ipm-001-kinetic-impact-telemetry",
      name: "Simulation 001: Distributed Kinetic Impact & Multi-Scale Strain Telemetry",
      startingState: "Quiescent Baseline Integrity (64/64 Nodes Nominal)",
      changedVariables: "Simulate 720 m/s kinetic projectile impact at coordinates (x: 35mm, y: 55mm) on 4.5mm SiC ceramic + 12-ply aramid laminate with embedded W/Mo sensing membrane.",
      assumptions: [
        "Ceramic compressive elastic modulus 410 GPa.",
        "W/Mo sensing membrane piezoresistive gauge factor 14.8.",
        "High-speed multi-channel ADC sampling rate 100 kHz.",
        "No actinide or toxic materials permitted in laminate."
      ],
      predictedOutcomes: [
        "Reconstructs kinetic impact centroid to within 1.4 mm spatial accuracy in 11.8 μs.",
        "Dynamic impedance drops by -38.5% across the central 4 nodes, mapping compressive shockwave propagation at 4,250 m/s.",
        "Calculates post-hit residual structural integrity at 0.88, confirming laminate retention without uncontained penetration."
      ],
      divergence: "Counterfactual Model Divergence: Matches gas-gun physical ballistic sensor telemetry within 1.6% spatial error and 0.4 μs temporal window.",
      confidence: 97,
      createdAt: "2026-08-19 05:15",
      executionStatus: "VALIDATED_EVIDENCE"
    }
  ],
  revisions: [
    {
      id: "rev-ipm-1",
      title: "Intelligent Protective Membrane 4-Scale Architecture Baseline",
      description: "Initial instantiation of the self-reporting protective nervous system twin on Pathfinder substrate across Electronic, Molecular-Network, Functional-Coating, and Wearable-System scales.",
      author: "Operator (Pathfinder Materials Physics Directorate)",
      timestamp: "2026-08-18 12:00",
      changeSummary: "Registered 5 multi-scale entities, 4 relationships, 5 empirical/reference observations, and 2 validated simulation runs."
    }
  ],
  pathfinderRecords: [
    {
      id: "pf-ipm-1",
      question: "Can safe non-actinide molecular architectures (W/Mo and Hf/Zr) reproduce the deformation-sensitive electronic response of the dense Co-U-Co reference complex to enable distributed in-situ damage telemetry in wearable protective armour?",
      evidence: [
        "Co-U-Co 10-bond reference DFT establishes -0.34 eV bandgap compression under 1.0% strain",
        "Synthesized W/Mo COF achieves Gauge Factor 14.8 with R² = 0.998",
        "Hf/Zr networks show <0.02% drift over 10k cycles and 0.00 ppm cytotoxicity",
        "64-node array localized 650 m/s impact within 1.8 mm and detected blind delamination 45 μs ahead of failure"
      ],
      investigation: "Constructed 4-scale multi-physics digital twin linking quantum electronic band-distortion to 2D COF networks, piezoresistive functional coatings, and ceramic/aramid laminate impact telemetry.",
      challenge: "Orion Ablation: Will d-orbital surrogates fail to provide sufficient sensitivity, or will environmental humidity degrade the sensing signal during operational wear?",
      decision: "Commit Operator Authority: Do not attempt to synthesize actinide armor. Screen W/Mo for piezoresistive gauge sensitivity and Hf/Zr for environmental barrier encapsulation. Authorize 4-scale evidence-gated progression.",
      commitStatus: "committed",
      createdAt: "2026-08-19 05:45"
    }
  ],
  activeFlows: [
    {
      stage: "COLLECTION",
      title: "Kinetic Impact, Strain & Thermal Influx",
      description: "Protective laminate captures kinetic projectile strikes (up to 4.2 kJ), flexural strain (0.01-5.5%), and thermal shock at the ceramic strike face.",
      rateOrVolume: "0–950 m/s kinetic load · 100 kHz sampling",
      lossOrEfficiency: "100% strain event capture fidelity"
    }
  ],
  integrityStatus: "STABLE",
  createdAt: "2026-08-18 12:00",
  updatedAt: "2026-08-19 05:45"
};
