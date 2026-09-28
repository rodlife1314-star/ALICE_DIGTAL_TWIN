import { DigitalTwin } from "../types";
import { SYSTEM_CAPABILITY_REGISTRY } from "./seedCapabilityRegistry";

export const ALICE_VESSEL_TWIN: DigitalTwin = {
  id: "alice-vessel-ccv01",
  name: "Alice Vessel (CCV-01 Concept Vessel)",
  description: "Governed physical digital twin for volumetric cavity induction drive, coaxial Poynting vectoring, G6 hexagonal symmetry guidance, and multi-layer protective hull.",
  domain: "engineered",
  purpose: "Model, simulate, and govern volumetric field induction, axial Poynting momentum flux, transverse thrust vectoring, and structural boundary mechanics under strict Octagon containment invariants.",
  capabilityRegistry: SYSTEM_CAPABILITY_REGISTRY,
  selectedModelId: "physics-pde-solver-v2",
  selectedModelCapability: SYSTEM_CAPABILITY_REGISTRY[2],
  boundary: {
    description: "Four concentric physical boundary layers: Crew/Payload Spine ⊂ Field Core ⊂ Adaptive EM Lattice ⊂ Protective Hull Boundary.",
    includedEntities: [
      "Crew/Payload Central Spine",
      "Field Generation Core",
      "Adaptive EM Lattice Engine",
      "Protective Outer Hull Boundary",
      "G6 Hexagonal Coaxial Resonant Cavity"
    ],
    excludedEntities: [
      "External Interstellar Medium",
      "Unbounded Far-Field Plasma Corridors",
      "Remote Orbital Anchor Relays"
    ],
    inputs: [
      { id: "inp-rf-1", name: "High-Q RF Excitation", type: "electromagnetic", rate: "2.80 GHz / 45 kW", medium: "superconducting coaxial feedline" },
      { id: "inp-cryo-1", name: "Liquid Helium Cryogenic Coolant", type: "cryogenic_fluid", rate: "4.2 K / 12 L/hr", medium: "closed-loop vacuum jacketed bus" },
      { id: "inp-sens-1", name: "Multi-Axis Wall RTD Sensor Array", type: "sensor_telemetry", rate: "100 Hz", medium: "isolated CAN bus" }
    ],
    outputs: [
      { id: "out-flux-1", name: "Axial Poynting Momentum Flux", type: "momentum", rate: "84.2 kN steady-state", medium: "collimated waveguide corridor" },
      { id: "out-vec-1", name: "Transverse Maxwell Stress Shear", type: "force_vector", rate: "0.0 - 15.0 N dynamic", medium: "aperture vectoring rim" },
      { id: "out-therm-1", name: "Radiative Deep-Space Dissipation", type: "infrared_heat", rate: "18.4 kW rejected", medium: "SPhP phonon metamaterial radiator" }
    ],
    permeabilityRules: [
      {
        id: "rule-oct-1",
        inputType: "aperture_displacement",
        condition: "Radial displacement dr must remain strictly within Omega_safe (dr <= 15.0 mm)",
        action: "permit",
        parameters: { maxPermittedDisplacementMm: 15.0, tripThresholdMm: 15.0 }
      },
      {
        id: "rule-swr-1",
        inputType: "standing_wave_ratio",
        condition: "Cavity SWR must remain <= 1.50:1",
        action: "permit",
        parameters: { maxSwr: 1.50 }
      }
    ]
  },
  sourceAssets: [
    {
      id: "asset-vessel-cad-01",
      name: "ccv01_volumetric_hull_cad.step",
      type: "cad_geometry",
      size: "24.5 MB",
      timestamp: "2026-09-20 10:00"
    },
    {
      id: "asset-cavity-mesh-01",
      name: "g6_hexagonal_cavity_mesh_128.h5",
      type: "finite_element_mesh",
      size: "62.1 MB",
      timestamp: "2026-09-22 14:30"
    }
  ],
  entities: [
    {
      id: "ent-spine-core",
      name: "Crew/Payload Central Spine",
      type: "structural_chassis",
      state: { massKg: 12500, structuralIntegrity: "NOMINAL", dampeningRatio: 0.042 },
      description: "Primary titanium-aluminide structural spine carrying crew module, instrumentation, and payload.",
      status: "active"
    },
    {
      id: "ent-field-core",
      name: "Field Generation Core",
      type: "electromagnetic_core",
      state: { frequencyGhz: 2.80, fieldEnergyJoules: 142000, fluxCoherencePercent: 99.8 },
      description: "Superconducting resonant cavity core generating coherent high-Q electromagnetic vector potentials.",
      status: "active"
    },
    {
      id: "ent-adaptive-lattice",
      name: "Adaptive EM Lattice (The Engine)",
      type: "metamaterial_engine",
      state: { couplingCoefficient: 0.35, externalFieldKvpm: 302.5, tuningState: "SYNCHRONIZED" },
      description: "Tunable periodic metamaterial array controlling phase-coherent boundary flux vectoring.",
      status: "active"
    },
    {
      id: "ent-protective-hull",
      name: "Protective Boundary Hull",
      type: "boundary_shield",
      state: { surfaceTempKelvin: 295.15, maxStressMpa: 142.0, ruptureMarginPercent: 88.0 },
      description: "Outer multilayer protective shell integrating piezoresistive sensing and passive radiative cooling.",
      status: "active"
    }
  ],
  relationships: [
    {
      id: "rel-spine-core",
      sourceId: "ent-spine-core",
      targetId: "ent-field-core",
      relationshipType: "structural_containment",
      medium: "cryogenic_struts",
      strength: 0.99,
      latency: 0,
      direction: "two_way"
    },
    {
      id: "rel-core-lattice",
      sourceId: "ent-field-core",
      targetId: "ent-adaptive-lattice",
      relationshipType: "flux_coupling",
      medium: "resonant_bus",
      strength: 0.96,
      latency: 1,
      direction: "two_way"
    },
    {
      id: "rel-lattice-hull",
      sourceId: "ent-adaptive-lattice",
      targetId: "ent-protective-hull",
      relationshipType: "boundary_confinement",
      medium: "dielectric_standoffs",
      strength: 0.94,
      latency: 1,
      direction: "two_way"
    }
  ],
  states: [
    {
      id: "st-coaxial-cruise",
      name: "Coaxial Cruise (Gamma 0)",
      variables: {
        radialOffsetMm: 0.0,
        transverseThrustN: 0.0,
        swr: 1.05,
        axialPoyntingKn: 84.2,
        mode: "cruise_gamma_0"
      },
      timestamp: "2026-09-28 10:00",
      classification: "NOMINAL"
    }
  ],
  observations: [
    {
      id: "obs-cavity-s11",
      entityId: "ent-field-core",
      property: "s11_return_loss",
      value: "-24.8 dB at 2.800 GHz",
      observedAt: "2026-09-28 09:30",
      source: "Anritsu Vector Network Analyzer Calibration Run",
      confidence: 99.4,
      verifiedBy: "Operator"
    },
    {
      id: "obs-wall-rtd",
      entityId: "ent-protective-hull",
      property: "wall_temperature_kelvin",
      value: "312.4 K steady-state",
      observedAt: "2026-09-28 09:45",
      source: "Physical Test Bench Wall RTD Sensor Array (BENCH-RTD-4402)",
      confidence: 99.8,
      verifiedBy: "Operator"
    }
  ],
  interpretations: [
    {
      id: "interp-g6-coaxial",
      claim: "Zero aperture offset under G6 hexagonal symmetry guarantees zero transverse Maxwell shear and preserves 100% boundary safety margin.",
      evidenceIds: ["obs-cavity-s11", "obs-wall-rtd"],
      confidence: 98.5,
      status: "approved",
      createdAt: "2026-09-28 10:15"
    }
  ],
  simulations: [
    {
      id: "sim-pde-g6-cruise",
      name: "G6 Hexagonal Cavity Coaxial Cruise Simulation",
      model: "Finite Element Vector Maxwell Solver v2.4",
      parameters: { frequencyGhz: 2.80, radiusMm: 175.0, offsetMm: 0.0 },
      results: { swr: 1.05, axialPoyntingFluxKn: 84.2, transverseThrustN: 0.0 },
      runAt: "2026-09-28 10:20"
    }
  ],
  revisions: [
    {
      id: "rev-vessel-baseline",
      title: "CCV-01 Concept Vessel Epistemic Baseline",
      description: "Established 4-layer physical boundary, G6 hexagonal symmetry, and Octagon containment rules.",
      author: "Operator",
      timestamp: "2026-09-28 08:00",
      changeSummary: "Initialized Alice Vessel core entities, RTD telemetry, and deterministic corridor constraints."
    }
  ],
  pathfinderRecords: [
    {
      id: "pf-vessel-01",
      question: "Can asymmetric aperture displacement vector transverse momentum without violating Omega_safe boundary?",
      evidence: ["S11 = -24.8 dB baseline", "Wall RTD steady at 312.4 K", "Maxwell stress tensor integral"],
      investigation: "Simulated radial displacement from dr = 0.0 to 14.0 mm under G6 symmetry.",
      challenge: "Will high displacement induce impedance mismatch exceeding SWR 1.50:1 limit?",
      decision: "Permit displacement up to 10.5 mm in vectoring mode (SWR = 1.45:1). Trip emergency STOP at dr >= 15.0 mm.",
      commitStatus: "committed",
      createdAt: "2026-09-28 10:30"
    }
  ],
  evidenceEnvelopes: [
    {
      id: "env-alice-poynting-flux",
      variableName: "axial_poynting_momentum_flux_kn",
      value: 84.2,
      units: "kN",
      epistemicClass: "MEASURED",
      executionDomain: "VEHICLE_EDGE",
      epistemicStore: "AETHER_EVIDENCE",
      mutationRule: "APPEND_ONLY_AUDIT",
      longTermMissionStateBound: true,
      executionReceipt: {
        receiptId: "RCPT-ALICE-POYNTING-001",
        artifact: {
          artifactId: "art-rf-coupler-08",
          artifactType: "SENSOR_TELEMETRY_SAMPLE",
          rawSummary: "Anritsu VNA S11 & Dual Directional Coupler reading at 2.80 GHz",
          contentHash: "SHA256:c18b74f8812e4d9b05688c1f83d9ab5be0cd19a54ff53a6a09e667bb67ae853c"
        },
        hardware: {
          device: "Alice Vessel CCV-01 Core Avionics",
          architecture: "Dual Lock-in RF Spectrometer + Jetson Orin Nano Edge Attestation",
          accelerator: "Orin Ampere 1024 CUDA Cores",
          memoryGb: 8,
          powerEnvelopeWatts: 15
        },
        runtime: {
          engine: "Linux RT-Kernel 5.15-tegra / RF Telemetry Bus",
          version: "JetPack 7.2.1",
          driverVersion: "tegra-rt-535.129"
        },
        inputs: {
          manifestHash: "SHA256:cavity-rf-bus-manifest",
          parameterCount: 4,
          samplePayloadSummary: {
            frequencyGhz: 2.80,
            forwardPowerKw: 45.0,
            reversePowerKw: 0.15,
            apertureOffsetMm: 0.0
          }
        },
        output: {
          primaryMetric: "axial_poynting_momentum_flux_kn",
          value: 84.2,
          units: "kN",
          uncertaintyBounds: "±0.5 kN calibrated tolerance",
          validRange: [0, 120]
        },
        latency: {
          elapsedMs: 1.15,
          computeMs: 0.22,
          transferMs: 0.93
        },
        power: {
          measuredJoules: 0.015,
          averageWatts: 14.8,
          batteryImpactMah: 0.06
        },
        signatures: {
          hardwareAttestation: "0x789abcde0123456789abcdef0123456789abcdef0123456789abcdef01234567",
          immutableSignature: "SIG-ALICE-POYNTING-MEASUREMENT-001",
          operatorAttestation: "Verified by Sovereign Human Operator on Physical Test Bench"
        }
      }
    }
  ],
  integrityStatus: "STABLE",
  createdAt: "2026-09-28 08:00",
  updatedAt: "2026-09-28 10:30"
};
