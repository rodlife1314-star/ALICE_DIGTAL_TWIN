import { DigitalTwin } from "../types";
import { SYSTEM_CAPABILITY_REGISTRY } from "./seedCapabilityRegistry";
import { PROJECT_SIXES_TWIN } from "../domains/sixes/seedSixesTwin";
import { AERIAL_VEHICLE_TWIN } from "./seedAerialTwin";

export const SEED_TWINS: DigitalTwin[] = [
  {
    ...AERIAL_VEHICLE_TWIN,
    capabilityRegistry: SYSTEM_CAPABILITY_REGISTRY,
    selectedModelId: "jetson-edge-orin",
    selectedModelCapability: SYSTEM_CAPABILITY_REGISTRY.find(m => m.id === "jetson-edge-orin") || SYSTEM_CAPABILITY_REGISTRY[0]
  },
  {
    ...PROJECT_SIXES_TWIN,
    capabilityRegistry: SYSTEM_CAPABILITY_REGISTRY,
    selectedModelId: "gemini-3.5-flash",
    selectedModelCapability: SYSTEM_CAPABILITY_REGISTRY[0]
  },
  {
    id: "termite-colony-01",
    name: "Subterranean Termite Colony",
    description: "Self-organising subterranean biosphere focusing on thermal regulation, humidity retention, and airflow transport.",
    domain: "biological",
    purpose: "Simulate and regulate colony nest thermodynamics, air turnover, and moisture boundaries during environmental micro-shifts.",
    capabilityRegistry: SYSTEM_CAPABILITY_REGISTRY,
    selectedModelId: "gemini-3.5-flash",
    selectedModelCapability: SYSTEM_CAPABILITY_REGISTRY[0],
    boundary: {
      description: "Subterranean mound structure, colony population, internal convection air shafts, and surrounding soil moisture boundary layer.",
      includedEntities: ["Swarm Workers (Cellulose Harvesting)", "Breathing Airway Chimney", "Queen Breeding Core", "Subterranean Galleries", "Starch Reserve Silos"],
      excludedEntities: ["Surface Predator Insects", "Distant Groundwater Table", "Solar Radiation (Indirect Only)"],
      inputs: [
        { id: "inp-1", name: "Cellulose Starch", type: "food", rate: "14.2 kg/day", medium: "surface foraging" },
        { id: "inp-2", name: "Soil Moisture Inflow", type: "water", rate: "8.5 L/day", medium: "capillary action" }
      ],
      outputs: [
        { id: "out-1", name: "Convective Exhaust Heat", type: "heat", rate: "450 W", medium: "vent chimney" },
        { id: "out-2", name: "Metabolic CO2", type: "gas", rate: "120 L/day", medium: "mound porous walls" }
      ],
      permeabilityRules: [
        { id: "rule-1", inputType: "ambient_air", condition: "temperature > 22°C", action: "permit", parameters: { threshold: 22 } },
        { id: "rule-2", inputType: "arid_draft", condition: "relative_humidity < 60%", action: "reject", parameters: { minHumidity: 60 } },
        { id: "rule-3", inputType: "cellulose_mass", condition: "storage_capacity > 20%", action: "store", parameters: { targetSilo: "silo-alpha" } }
      ]
    },
    sourceAssets: [
      { id: "asset-1", name: "nest_thermal_telemetry_log.json", type: "telemetry", size: "2.4 MB", timestamp: "2026-08-06 08:30" },
      { id: "asset-2", name: "mound_microCT_scan.ply", type: "3d_geometry", size: "18.1 MB", timestamp: "2026-08-05 14:15" }
    ],
    entities: [
      { id: "term-1", name: "Swarm Collectors", type: "biological_subagent", state: { activityLevel: "88%", foragingYield: "12.4 kg/day", status: "nominal" }, description: "Field foragers harvesting wood cellulose and moisture.", status: "active" },
      { id: "term-2", name: "Breathing Airway Chimney", type: "ventilation_channel", state: { airflowRate: "0.42 m/s", tempDiff: "+3.2°C", obstruction: "12%" }, description: "Primary thermodynamic ventilation shaft dumping accumulated CO2 and thermal energy.", status: "warning" },
      { id: "term-3", name: "The Queen's Breeding Core", type: "incubation_chamber", state: { temp: "29.8°C", relativeHumidity: "78.2%", eggCount: 14200 }, description: "Reproductive incubation center protected by humidity seals.", status: "active" },
      { id: "term-4", name: "Subterranean Galleries", type: "earthen_conduit", state: { soilMoisture: "91%", wallThickness: "42mm" }, description: "Moisture-sealed transit tunnels connecting deep soil to nest core.", status: "active" },
      { id: "term-5", name: "Starch Reserve Silos", type: "storage_vault", state: { fillLevel: "14%", bufferDays: 1.8 }, description: "Emergency food stockpiles.", status: "warning" }
    ],
    relationships: [
      { id: "rel-t1", sourceId: "term-4", targetId: "term-3", relationshipType: "moisture_coupling", medium: "soil capillary", strength: 0.92, latency: 15, direction: "one_way" },
      { id: "rel-t2", sourceId: "term-3", targetId: "term-2", relationshipType: "convective_heat_exhaust", medium: "air", strength: 0.65, latency: 45, direction: "one_way" },
      { id: "rel-t3", sourceId: "term-1", targetId: "term-5", relationshipType: "cellulose_transport", medium: "foraging corridor", strength: 0.88, latency: 120, direction: "one_way" }
    ],
    states: [
      { id: "st-1", name: "Incubation Equilibrium", metrics: { coreTemp: "29.8°C", airTurnoverRatio: 0.74, humidityStability: "High" }, timestamp: "2026-08-06 10:00", active: true }
    ],
    observations: [
      { id: "obs-1", fact: "Breathing chimney airflow decreased by 28% following outer wall seal degradation.", value: "0.42 m/s", isFact: true, timestamp: "2026-08-06 09:15", quality: "sensor" },
      { id: "obs-2", fact: "Queen's chamber temperature spiked +0.7°C above nominal baseline.", value: "29.8°C", isFact: true, timestamp: "2026-08-06 09:30", quality: "sensor" },
      { id: "obs-3", fact: "Starch reserves estimated to reach exhaustion in 42 hours without additional foraging.", value: "1.8 days remaining", isFact: false, timestamp: "2026-08-06 10:05", quality: "inferred" }
    ],
    interpretations: [
      { id: "interp-1", claim: "Thermal convection in the main chimney is partially throttled by soil subsidence at 1.2m depth.", evidenceIds: ["obs-1", "obs-2"], confidence: 85, status: "approved", createdAt: "2026-08-06 09:40" }
    ],
    simulations: [
      { id: "sim-1", name: "Chimney Clearance Intervention", startingState: "Thermal Throttling (0.42 m/s)", changedVariables: "Clear chimney shaft obstruction by 80%", assumptions: ["Ambient air temp stays below 26°C", "Worker availability > 80%"], predictedOutcomes: ["Core temperature drops -0.8°C to 29.0°C within 180 min", "CO2 concentration stabilizes at 450 ppm"], divergence: "0.12°C delta against physical sensor trend", confidence: 91, createdAt: "2026-08-06 10:10" }
    ],
    revisions: [
      { id: "rev-1", title: "Baseline Subterranean Map", description: "Initial import of mound geometry and thermal sensor mapping.", author: "Operator", timestamp: "2026-08-05 12:00", changeSummary: "Established initial entities, relationships, and 3 sensor streams." }
    ],
    pathfinderRecords: [
      { id: "pf-1", question: "What is causing the +0.7°C thermal buildup in the breeding chamber?", evidence: ["Breathing chimney airflow drop from 0.58 m/s to 0.42 m/s", "Metabolic heat output steady at 450 W"], investigation: "Correlated air velocity drops with soil subsidence logs at deep chimney throat.", challenge: "Is thermal rise caused by reduced airflow or increased egg batch metabolism?", decision: "Approve chimney clearance intervention plan before adjusting egg incubation moisture.", commitStatus: "committed", createdAt: "2026-08-06 09:50" }
    ],
    activeFlows: [
      { stage: "COLLECTION", title: "Cellulose & Soil Moisture Gathering", description: "Foragers harvest raw fiber from ground cover while capillary roots draw deep soil moisture.", rateOrVolume: "14.2 kg/day fiber · 8.5 L/day moisture", lossOrEfficiency: "94% intake efficiency" },
      { stage: "STORAGE", title: "Emergency Silos & Moisture Vault", description: "Retains buffer starch and maintains 78% relative humidity buffer around egg chambers.", rateOrVolume: "1.8 days emergency supply stored", lossOrEfficiency: "6% moisture evaporation loss" },
      { stage: "TRANSFORMATION", title: "Metabolic Digest & Pheromone Synthesis", description: "Transforms cellulose into metabolic energy and heat; generates colony coordination chemical signals.", rateOrVolume: "450 W heat output · 120 L/day CO2", lossOrEfficiency: "82% energy conversion" },
      { stage: "DISTRIBUTION", title: "Convective Chimney Exhaust & Gallery Circulation", description: "Circulates fresh air through galleries and vents heat via the breathing chimney.", rateOrVolume: "0.42 m/s air velocity", lossOrEfficiency: "28% flow restriction at throat" }
    ],
    integrityStatus: "UNRESOLVED_CONSTRAINTS",
    createdAt: "2026-08-05 12:00",
    updatedAt: "2026-08-06 10:10"
  },

  {
    id: "membrane-02",
    name: "Programmable Membrane Material System",
    description: "Adaptive lipid-polymer barrier controlling selective molecular permeability, charge gating, and thermal flux.",
    domain: "engineered",
    purpose: "Evaluate spectrum-selective permeability rules, selective filtering, and micro-channel transport under variable electrochemical potentials.",
    boundary: {
      description: "Nanostructured membrane surface, ion channels, aqueous solution boundary layers, and applied electric field region.",
      includedEntities: ["Selective Lipid Barrier", "Thermal Transducer Array", "Charge Gating Lattice", "Effluent Storage Core"],
      excludedEntities: ["Bulk Liquid Reservoir (Outer Far-Field)", "External Power Inverter Noise"],
      inputs: [
        { id: "inp-m1", name: "Aqueous Feed Stream", type: "fluid", rate: "2.4 mL/min", medium: "microfluidic channel" },
        { id: "inp-m2", name: "Gating Voltage Bias", type: "electrical", rate: "+350 mV", medium: "gold electrode array" }
      ],
      outputs: [
        { id: "out-m1", name: "Purified Permeate", type: "fluid", rate: "2.1 mL/min", medium: "collection port" },
        { id: "out-m2", name: "Concentrated Retentate", type: "fluid", rate: "0.3 mL/min", medium: "waste purge" }
      ],
      permeabilityRules: [
        { id: "rule-m1", inputType: "ionic_charge", condition: "diameter < 12 nm AND charge > +1e", action: "permit", parameters: { maxDiameterNm: 12 } },
        { id: "rule-m2", inputType: "macro_contaminants", condition: "diameter >= 12 nm", action: "reject", parameters: { minDiameterNm: 12 } },
        { id: "rule-m3", inputType: "thermal_shock", condition: "delta_temp > 5°C/sec", action: "attenuate", parameters: { dampingFactor: 0.4 } }
      ]
    },
    sourceAssets: [
      { id: "asset-m1", name: "membrane_nanopore_spec.json", type: "specification", size: "480 KB", timestamp: "2026-08-05 16:00" },
      { id: "asset-m2", name: "permeability_spectral_sweep.csv", type: "spectral_data", size: "4.2 MB", timestamp: "2026-08-06 07:15" }
    ],
    entities: [
      { id: "ent-m1", name: "Selective Lipid Barrier", type: "nanoporous_matrix", state: { poreDiameter: "8.4 nm", poreDensity: "1.2e10 /cm²", integrity: "99.4%" }, description: "Primary size-exclusion and hydrophobicity filtration layer.", status: "active" },
      { id: "ent-m2", name: "Thermal Transducer Array", type: "thermoelectric_element", state: { currentTemp: "24.2°C", heatFlux: "14 W/m²" }, description: "Regulates localized temperature to prevent fouling.", status: "active" },
      { id: "ent-m3", name: "Charge Gating Lattice", type: "electrostatic_gate", state: { biasVoltage: "+350 mV", rejectionRatio: "98.7%" }, description: "Controls ion selectivity through electrohydrodynamic repulsion.", status: "active" },
      { id: "ent-m4", name: "Effluent Storage Core", type: "fluidic_reservoir", state: { volume: "45 mL", pressure: "1.4 bar" }, description: "Holds concentrated retentate prior to purge cycles.", status: "active" }
    ],
    relationships: [
      { id: "rel-m1", sourceId: "ent-m3", targetId: "ent-m1", relationshipType: "charge_field_modulation", medium: "electrostatic", strength: 0.95, latency: 1, direction: "two_way" },
      { id: "rel-m2", sourceId: "ent-m2", targetId: "ent-m1", relationshipType: "viscosity_control", medium: "thermal_conduction", strength: 0.78, latency: 10, direction: "one_way" }
    ],
    states: [
      { id: "st-m1", name: "High-Selectivity Filtration Mode", metrics: { fluxRate: "2.1 mL/min", saltRejection: "98.7%", foulingIndex: "0.02" }, timestamp: "2026-08-06 11:00", active: true }
    ],
    observations: [
      { id: "obs-m1", fact: "Ion rejection ratio reached 98.7% at +350 mV bias voltage.", value: "98.7%", isFact: true, timestamp: "2026-08-06 08:00", quality: "measured" },
      { id: "obs-m2", fact: "Pore fouling rate remains under 0.05% per hour with thermal pulsing enabled.", value: "<0.05%/hr", isFact: true, timestamp: "2026-08-06 08:30", quality: "sensor" }
    ],
    interpretations: [
      { id: "interp-m1", claim: "Electrostatic double-layer overlap inside 8.4nm pores accounts for the high monovalent ion rejection.", evidenceIds: ["obs-m1"], confidence: 92, status: "approved", createdAt: "2026-08-06 09:00" }
    ],
    simulations: [
      { id: "sim-m1", name: "Voltage Pulse Self-Cleaning Sweep", startingState: "High-Selectivity Mode", changedVariables: "Pulse voltage to +750 mV for 500 ms", assumptions: ["Dielectric breakdown voltage > 1.2 V", "Flow rate constant at 2.4 mL/min"], predictedOutcomes: ["Fouling cake dislodged by electro-osmotic shear", "Permeate flux recovers +14%"], divergence: "Matches lab prototype microfluidic trial within 2.3%", confidence: 94, createdAt: "2026-08-06 10:30" }
    ],
    revisions: [
      { id: "rev-m1", title: "Gating Rule V2 Update", description: "Added spectrum-selective permeability rules for divalent cations.", author: "Operator", timestamp: "2026-08-06 07:30", changeSummary: "Updated boundary rules 1-3 and added charge gating lattice entity." }
    ],
    pathfinderRecords: [
      { id: "pf-m1", question: "Can voltage pulsing clean pore buildup without degrading lipid barrier cross-linking?", evidence: ["Rejection ratio 98.7%", "Membrane breakdown rating 1.2 V"], investigation: "Simulated short-duration +750 mV pulses on 3D pore mesh.", challenge: "Will high electric fields induce pinhole dielectric puncture?", decision: "Restrict pulse duration to <500 ms at max +750 mV bias.", commitStatus: "committed", createdAt: "2026-08-06 08:45" }
    ],
    activeFlows: [
      { stage: "COLLECTION", title: "Aqueous Feed Stream Intake", description: "Microfluidic feed channel delivers raw solute stream at regulated pressure.", rateOrVolume: "2.4 mL/min feed rate", lossOrEfficiency: "100% feed captured" },
      { stage: "STORAGE", title: "Retentate Storage Core", description: "Temporarily holds filtered out macro-molecules and concentrated salt brine.", rateOrVolume: "45 mL capacity · 1.4 bar", lossOrEfficiency: "Zero leakage" },
      { stage: "TRANSFORMATION", title: "Electro-Osmotic Charge Gating", description: "Applies +350 mV electrostatic potential to repel target ions while permitting water molecules.", rateOrVolume: "98.7% salt rejection ratio", lossOrEfficiency: "99.1% electrical efficiency" },
      { stage: "DISTRIBUTION", title: "Permeate Discharge & Purge Stream", description: "Outputs purified permeate to downstream collection while purging retentate.", rateOrVolume: "2.1 mL/min permeate · 0.3 mL/min purge", lossOrEfficiency: "87.5% water recovery yield" }
    ],
    integrityStatus: "STABLE",
    createdAt: "2026-08-05 14:00",
    updatedAt: "2026-08-06 11:00"
  },

  {
    id: "oxford-env-03",
    name: "Oxford Urban Environment Model",
    description: "Hydrological, microclimate, and masonry heat capacity structural twin of the Oxford flood plains and historic masonry urban core.",
    domain: "environmental",
    purpose: "Analyze Thames river catchment discharge, urban heat island attenuation, and limestone masonry thermal retention during microclimate shifts.",
    boundary: {
      description: "Cherwell & Thames confluence basin, historic city core limestone structures, canopy cover, and surface aquifer boundary layer.",
      includedEntities: ["Cherwell Hydrological Basin", "Historic Masonry Thermal Core", "Canopy Microclimate Shield", "Aquifer Recharge Sponge"],
      excludedEntities: ["Regional Highway Grid > 15km", "Stratospheric Atmospheric Layers"],
      inputs: [
        { id: "inp-o1", name: "Precipitation Runoff", type: "water", rate: "18.4 mm/hr", medium: "surface catchment" },
        { id: "inp-o2", name: "Solar Irradiance", type: "radiation", rate: "780 W/m²", medium: "atmospheric canopy" }
      ],
      outputs: [
        { id: "out-o1", name: "Downriver Flood Discharge", type: "water", rate: "34.2 m³/s", medium: "Thames river bed" },
        { id: "out-o2", name: "Infrared Nighttime Radiation", type: "heat", rate: "210 W/m²", medium: "limestone surface" }
      ],
      permeabilityRules: [
        { id: "rule-o1", inputType: "flood_surge", condition: "discharge > 30 m³/s", action: "redirect", parameters: { diversionTarget: "Meadow Floodplain Sponge" } },
        { id: "rule-o2", inputType: "thermal_radiation", condition: "surface_temp > 28°C", action: "store", parameters: { storageMedium: "Limestone Masonry" } }
      ]
    },
    sourceAssets: [
      { id: "asset-o1", name: "oxford_lidar_elevation_map.tif", type: "spatial_raster", size: "42.8 MB", timestamp: "2026-08-04 10:00" },
      { id: "asset-o2", name: "thames_hydrometry_gauges.csv", type: "time_series", size: "8.1 MB", timestamp: "2026-08-06 06:00" }
    ],
    entities: [
      { id: "ent-o1", name: "Cherwell Hydrological Basin", type: "river_catchment", state: { stageHeight: "2.14 m", flowVelocity: "1.1 m/s", saturation: "84%" }, description: "Confluence river catchment managing flood plain overflow.", status: "active" },
      { id: "ent-o2", name: "Historic Masonry Thermal Core", type: "urban_fabric", state: { surfaceTemp: "26.4°C", heatCapacity: "1.8 MJ/m³K", lagTime: "4.2 hrs" }, description: "Oolitic limestone buildings acting as a thermal flywheel.", status: "active" },
      { id: "ent-o3", name: "Canopy Microclimate Shield", type: "vegetation_layer", state: { lai: 3.8, evapotranspiration: "4.2 mm/day" }, description: "Urban tree canopy cooling ground surface by shading.", status: "active" },
      { id: "ent-o4", name: "Aquifer Recharge Sponge", type: "subsurface_geology", state: { waterTableDepth: "1.8m", permeability: "12 m/day" }, description: "Alluvial gravel deposits storing groundwater.", status: "active" }
    ],
    relationships: [
      { id: "rel-o1", sourceId: "ent-o1", targetId: "ent-o4", relationshipType: "hydraulic_recharge", medium: "gravel_alluvium", strength: 0.89, latency: 180, direction: "two_way" },
      { id: "rel-o2", sourceId: "ent-o3", targetId: "ent-o2", relationshipType: "shading_attenuation", medium: "solar_radiation", strength: 0.72, latency: 0, direction: "one_way" }
    ],
    states: [
      { id: "st-o1", name: "Summer Microclimate Equilibrium", metrics: { riverStage: "2.14 m", urbanThermalDelta: "+2.1°C", runoffCoeff: 0.42 }, timestamp: "2026-08-06 09:00", active: true }
    ],
    observations: [
      { id: "obs-o1", fact: "Thames confluence discharge reached 34.2 m³/s following 18.4 mm/hr rainfall event.", value: "34.2 m³/s", isFact: true, timestamp: "2026-08-06 06:30", quality: "sensor" },
      { id: "obs-o2", fact: "Masonry surface temp lag delayed peak heat release by 4.2 hours into evening.", value: "4.2 hrs lag", isFact: true, timestamp: "2026-08-06 07:00", quality: "measured" }
    ],
    interpretations: [
      { id: "interp-o1", claim: "Meadow flood plain retention absorbed 38% of peak Cherwell surge.", evidenceIds: ["obs-o1"], confidence: 89, status: "approved", createdAt: "2026-08-06 08:15" }
    ],
    simulations: [
      { id: "sim-o1", name: "1-in-50 Year Storm Event Simulation", startingState: "Summer Baseline", changedVariables: "Increase precipitation intensity to 45 mm/hr for 3 hours", assumptions: ["Floodplain meadow retention active", "Canopy interception 15%"], predictedOutcomes: ["River stage rises +0.82m", "Aquifer sponge absorbs 1.2M m³ before surface runoff breaches city wall perimeter"], divergence: "Within 4.1% of 2014 flood historic watermark", confidence: 88, createdAt: "2026-08-06 09:30" }
    ],
    revisions: [
      { id: "rev-o1", title: "Alluvial Gravel Layer Refinement", description: "Updated subsurface hydro-geology maps with high-res LiDAR survey.", author: "Operator", timestamp: "2026-08-04 16:00", changeSummary: "Updated aquifer permeability coefficients." }
    ],
    pathfinderRecords: [
      { id: "pf-o1", question: "How much thermal energy is buffered by historic limestone masonry compared to asphalt surfaces?", evidence: ["Masonry heat capacity 1.8 MJ/m³K", "Surface temp lag 4.2 hours"], investigation: "Correlated infrared satellite imagery with ground sensor stations.", challenge: "Does urban moisture evaporation offset masonry thermal radiation?", decision: "Incorporate evapotranspiration rates into microclimate thermal model.", commitStatus: "committed", createdAt: "2026-08-06 07:45" }
    ],
    activeFlows: [
      { stage: "COLLECTION", title: "Rainfall Catchment & Solar Intake", description: "Cherwell basin intercepts rainwater while atmospheric canopy absorbs solar radiation.", rateOrVolume: "18.4 mm/hr rainfall · 780 W/m² solar", lossOrEfficiency: "84% catchment collection" },
      { stage: "STORAGE", title: "Aquifer Gravel Sponge & Masonry Mass", description: "Subsurface gravel aquifer holds groundwater buffer; limestone masonry stores thermal energy.", rateOrVolume: "1.2M m³ water capacity · 1.8 MJ/m³K thermal", lossOrEfficiency: "Minimal seepage loss" },
      { stage: "TRANSFORMATION", title: "Evapotranspiration & Thermal Delay", description: "Tree canopy converts solar energy into water vapor cooling; masonry delays heat release by 4.2 hrs.", rateOrVolume: "4.2 mm/day evapotranspiration", lossOrEfficiency: "68% cooling conversion efficiency" },
      { stage: "DISTRIBUTION", title: "Downriver Discharge & Radiative Cooling", description: "Discharges regulated floodwaters down Thames riverbed while releasing stored heat into night sky.", rateOrVolume: "34.2 m³/s flow · 210 W/m² night radiation", lossOrEfficiency: "Controlled discharge velocity" }
    ],
    integrityStatus: "STABLE",
    createdAt: "2026-08-04 10:00",
    updatedAt: "2026-08-06 09:30"
  },

  {
    id: "music-arch-04",
    name: "Music Architecture Recorded Audio System",
    description: "Acoustic, harmonic, spatial, and structural twin of recorded multi-track audio performances.",
    domain: "musical",
    purpose: "Examine acoustic feature relationships, instrument group roles, spatial stereo placement, and arrangement tension curves.",
    boundary: {
      description: "20 Hz - 20 kHz frequency spectrum, stereo field (-1.0 left to +1.0 right), dynamic headroom, and 0-4 minute time range.",
      includedEntities: ["Sub-Bass Pressure Rail", "Harmonic Resonance Vault", "Transient Attack Engine", "Spatial Stereo Atmosphere"],
      excludedEntities: ["Inaudible Ultrasonic Noise (>22 kHz)", "Unrecorded Acoustic Room Echoes"],
      inputs: [
        { id: "inp-mu1", name: "Multi-track PCM Stem Feed", type: "audio_signal", rate: "48 kHz / 24-bit", medium: "digital audio bus" }
      ],
      outputs: [
        { id: "out-mu1", name: "Stereo Master Render", type: "audio_signal", rate: "2-channel stereo", medium: "DAW output stream" }
      ],
      permeabilityRules: [
        { id: "rule-mu1", inputType: "frequency_band", condition: "freq < 80 Hz", action: "redirect", parameters: { targetRail: "Sub-Bass Pressure Rail" } },
        { id: "rule-mu2", inputType: "transient_peak", condition: "crest_factor > 12 dB", action: "store", parameters: { targetEngine: "Transient Attack Engine" } }
      ]
    },
    sourceAssets: [
      { id: "asset-mu1", name: "master_recording_48k24b.wav", type: "audio_file", size: "44.2 MB", timestamp: "2026-08-06 02:00" },
      { id: "asset-mu2", name: "spectral_energy_profile.json", type: "feature_data", size: "1.8 MB", timestamp: "2026-08-06 03:00" }
    ],
    entities: [
      { id: "ent-mu1", name: "Sub-Bass Pressure Rail", type: "frequency_domain", state: { freqBand: "20-80 Hz", peakEnergy: "-12.4 dB", stability: "high" }, description: "Continuous low-end pulse and kick fundamental layer.", status: "active" },
      { id: "ent-mu2", name: "Harmonic Resonance Vault", type: "tonal_domain", state: { freqBand: "250-4000 Hz", keyEstimate: "A minor", harmonicDensity: "0.82" }, description: "Sustained chords, string arrangements, and vocal fundamentals.", status: "active" },
      { id: "ent-mu3", name: "Transient Attack Engine", type: "rhythmic_domain", state: { onsetDensity: "4.8 transients/sec", crestFactor: "14.2 dB" }, description: "Percussive attacks, hi-hat motion, and snare strikes.", status: "active" },
      { id: "ent-mu4", name: "Spatial Stereo Atmosphere", type: "stereo_field", state: { widthScore: "0.88", correlationIndex: "+0.74" }, description: "Wide ambient reverb trails and antiphonal instrument panning.", status: "active" }
    ],
    relationships: [
      { id: "rel-mu1", sourceId: "ent-mu1", targetId: "ent-mu3", relationshipType: "rhythmic_lock", medium: "time_grid", strength: 0.96, latency: 0, direction: "two_way" },
      { id: "rel-mu2", sourceId: "ent-mu2", targetId: "ent-mu4", relationshipType: "reverb_diffusion", medium: "spatial_bus", strength: 0.81, latency: 24, direction: "one_way" }
    ],
    states: [
      { id: "st-mu1", name: "Climax Chorus Section State", metrics: { lufs: "-11.4 LUFS", dynamicRange: "8.2 LU", peakFrequency: "2.4 kHz" }, timestamp: "2026-08-06 03:30", active: true }
    ],
    observations: [
      { id: "obs-mu1", fact: "Transient density increases 2.4x between 02:14 and 02:42 during chorus breakdown.", value: "4.8 transients/sec", isFact: true, timestamp: "2026-08-06 03:10", quality: "measured" },
      { id: "obs-mu2", fact: "Sub-bass fundamental drops 6 dB at 01:45 creating dynamic drop before re-entry.", value: "-18.4 dB", isFact: true, timestamp: "2026-08-06 03:15", quality: "measured" }
    ],
    interpretations: [
      { id: "interp-mu1", claim: "The 02:14 arrangement transition uses spatial stereo expansion to heighten perceived musical tension.", evidenceIds: ["obs-mu1", "obs-mu2"], confidence: 91, status: "approved", createdAt: "2026-08-06 03:40" }
    ],
    simulations: [
      { id: "sim-mu1", name: "Sub-Bass Harmonic Saturation Re-interpretation", startingState: "Chorus State", changedVariables: "Add 2nd order harmonic drive to 40-80 Hz rail", assumptions: ["Maintain peak ceiling at -0.3 dBFS"], predictedOutcomes: ["Increases perceived bass presence on small speakers by +3.5 dB", "LUFS rises from -11.4 to -10.8 LUFS"], divergence: "Matches hardware analog saturation curve within 0.8 dB", confidence: 93, createdAt: "2026-08-06 04:00" }
    ],
    revisions: [
      { id: "rev-mu1", title: "Original Multi-track Mapping", description: "Created baseline structural twin from 48kHz WAV master.", author: "Operator", timestamp: "2026-08-06 02:00", changeSummary: "Mapped 4 primary acoustic rails and spectral energy profiles." }
    ],
    pathfinderRecords: [
      { id: "pf-mu1", question: "What instrument layer creates the perceived energy jump at 02:14?", evidence: ["Transient density 4.8/sec", "Stereo correlation width +0.88"], investigation: "Isolated 2-8kHz band and compared against transient onset markers.", challenge: "Is energy rise caused by additional percussive stems or distorted guitar harmonics?", decision: "Classify 02:14 energy shift as combined double-tracked rhythm guitar + hi-hat subdivision.", commitStatus: "committed", createdAt: "2026-08-06 03:50" }
    ],
    activeFlows: [
      { stage: "COLLECTION", title: "Acoustic Signal Demuxing", description: "Extracts multi-channel audio stems and parses frequency band energy profiles.", rateOrVolume: "48 kHz / 24-bit PCM stream", lossOrEfficiency: "100% signal preservation" },
      { stage: "STORAGE", title: "Spectral & Spatial Buffer", description: "Caches FFT frequency matrices, crest factors, and stereo correlation maps.", rateOrVolume: "1.8 MB feature buffer", lossOrEfficiency: "Zero-latency lookup" },
      { stage: "TRANSFORMATION", title: "Harmonic Rail Mapping & Arrangement Analysis", description: "Separates sub-bass fundamental from mid-range resonance and high-frequency transients.", rateOrVolume: "4 primary acoustic rails", lossOrEfficiency: "Separation clarity: 92%" },
      { stage: "DISTRIBUTION", title: "Stereo Soundfield & Tension Curve Output", description: "Renders spatial stereo position and dynamic tension curves for Operator inspection.", rateOrVolume: "-11.4 LUFS master level", lossOrEfficiency: "8.2 LU dynamic range preserved" }
    ],
    integrityStatus: "STABLE",
    createdAt: "2026-08-06 02:00",
    updatedAt: "2026-08-06 04:00"
  },

  {
    id: "antikythera-mechanism-05",
    name: "Antikythera",
    description: "Deterministic physical, computational, epistemic, and capability twin of the ~60 BCE Hellenistic astronomical geared information processor.",
    domain: "physical",
    purpose: "Evaluate mechanical executability P(t), algorithmic ratio fidelity C(t), provenance E, minimum capability vectors K_min, and transmission lineages T(t) without unevidenced capability inflation.",
    capabilityRegistry: SYSTEM_CAPABILITY_REGISTRY,
    selectedModelId: "physics-pde-solver-v2",
    selectedModelCapability: SYSTEM_CAPABILITY_REGISTRY[2],
    boundary: {
      description: "Surviving bronze fragments (Fragments A-G), 30+ triangular gears (~0.5mm module), pin-and-slot epicyclic assembly, zodiac dials, and Greek/Babylonian ratio algorithms.",
      includedEntities: [
        "Physical Substrate P(t) [Bronze Geometry & Backlash]",
        "Algorithmic Processor C(t) [Astronomical Gear Ratios]",
        "Epistemic Provenance Ledger E [Inscription & Gear Provenance]",
        "Minimum Capability Vector K_min [Derived Hellenistic Capability]",
        "Transmission Lineage T(t) [Information Transmission Vector]"
      ],
      excludedEntities: [
        "Post-Hellenistic Machine Inventions",
        "Anachronistic Precision Lathes or Optical Magnification",
        "Unevidenced Modern Materials"
      ],
      inputs: [
        { id: "inp-a1", name: "Hand Crank Angular Drive", type: "mechanical_torque", rate: "1 rev/yr reference", medium: "main drive wheel axle" },
        { id: "inp-a2", name: "Astronomical Cycle Parameters", type: "arithmetic_ratios", rate: "235 Metonic / 223 Saros", medium: "gear tooth topology" }
      ],
      outputs: [
        { id: "out-a1", name: "Zodiac & Calendar Dial Pointers", type: "continuous_angle", rate: "Solar & Variable Lunar Position", medium: "front dial face" },
        { id: "out-a2", name: "Saros Eclipse & Olympiad Display", type: "spiral_indicator", rate: "223 synodic month spiral", medium: "back dial face" }
      ],
      permeabilityRules: [
        { id: "rule-a1", inputType: "drive_torque", condition: "torque < 0.8 Nm AND backlash < 3.5°", action: "permit", parameters: { maxTorqueNm: 0.8, maxBacklashDeg: 3.5 } },
        { id: "rule-a2", inputType: "reconstruction_hypothesis", condition: "evidence_state == 'SURVIVING' OR evidence_state == 'INSCRIPTION_DERIVED'", action: "store", parameters: { enforceProvenanceLedger: true } },
        { id: "rule-a3", inputType: "unprovenanced_claim", condition: "evidence_state == 'HYPOTHETICAL'", action: "attenuate", parameters: { requireOperatorApproval: true } }
      ]
    },
    sourceAssets: [
      { id: "asset-a1", name: "antikythera_fragment_A_microCT.vol", type: "3d_volumetric_scan", size: "84.2 MB", timestamp: "2026-08-08 14:00" },
      { id: "asset-a2", name: "metonic_saros_gear_mesh_ratios.json", type: "kinematic_ledger", size: "1.4 MB", timestamp: "2026-08-09 09:30" },
      { id: "asset-a3", name: "freeth2021_planetary_reconstruction.cad", type: "hypothetical_cad", size: "12.8 MB", timestamp: "2026-08-10 11:15" }
    ],
    entities: [
      { id: "ent-a1", name: "Physical Substrate P(t)", type: "mechanical_assembly", state: { survivingGears: 30, gearModule: "0.5 mm", toothForm: "triangular hand-filed", accumulatedBacklash: "2.4°", frictionCoeff: 0.22, maxOperatingTorque: "0.75 Nm" }, description: "Bronze mechanical substrate: gear meshes, tolerances, shafts, pin-and-slot epicyclic coupling, and material friction limits.", status: "active" },
      { id: "ent-a2", name: "Algorithmic Processor C(t)", type: "kinematic_computer", state: { metonicRatio: "235 / 19", sarosRatio: "223 synodic months", lunarAnomalyFidelity: "99.2%", variableVelocityMap: "Hipparchus Epicyclic Pin-and-Slot" }, description: "Information transformation topology encoding Babylonian arithmetic cycles and Greek geometric non-uniform lunar motion models.", status: "active" },
      { id: "ent-a3", name: "Epistemic Provenance Ledger E", type: "provenance_registry", state: { survivingComponents: "30 gears (Fragments A-G)", inscriptionDerivedData: "Saros/Exeligmos dial glyphs", reconstructedHypotheses: "7 planetary pointers", evidencePolicy: "Natalia Rule: HYPOTHESIS cannot become FACT without physical proof" }, description: "Tracks evidence states (SURVIVING, IMAGED, INSCRIPTION_DERIVED, RECONSTRUCTED, HYPOTHETICAL) to prevent unevidenced capability claims.", status: "active" },
      { id: "ent-a4", name: "Minimum Capability Vector K_min", type: "capability_derivation", state: { circleDivisionModule0_5mm: "MUST", babylonianPeriodEncoding: "MUST", epicyclicCompoundGearing: "MUST", inclusionInHellenisticK_H: "100% (K_min ⊆ K_H)" }, description: "Minimum capability vector derived via Orion counterfactual ablation; verified to be fully contained within attested Hellenistic technology.", status: "active" },
      { id: "ent-a5", name: "Transmission Lineage T(t)", type: "information_lineage", state: { originLineage: "Babylonian Observation -> Greek Geometry -> Rhodes/Corinth Workshop", postShipwreckSignal: "OBSERVATIONAL_GAP", postHellenisticState: "T(t_after) = UNKNOWN" }, description: "Information lineage vector tracking knowledge transmission and explicitly recording post-shipwreck observational gaps.", status: "active" }
    ],
    relationships: [
      { id: "rel-a1", sourceId: "ent-a1", targetId: "ent-a2", relationshipType: "kinematic_realization", medium: "gear_teeth_mesh", strength: 0.98, latency: 0, direction: "two_way" },
      { id: "rel-a2", sourceId: "ent-a3", targetId: "ent-a4", relationshipType: "evidence_bound_derivation", medium: "ablation_filter", strength: 1.0, latency: 0, direction: "one_way" },
      { id: "rel-a3", sourceId: "ent-a4", targetId: "ent-a5", relationshipType: "capability_transmission_link", medium: "historical_record", strength: 0.91, latency: 100, direction: "one_way" }
    ],
    states: [
      { id: "st-a1", name: "Sovereign Epistemic Equilibrium Mode", metrics: { mechanicalExecutability: "PASS (0.65 Nm torque)", algorithmicFidelity: "99.8%", unprovenancedHypothesesAllowed: 0, HellenisticCapabilityInclusion: "100% (K_min ⊆ K_H)" }, timestamp: "2026-08-10 12:00", active: true }
    ],
    observations: [
      {
        id: "obs-a1",
        fact: "X-ray MicroCT tomography confirms 30 surviving bronze gears with triangular teeth (module ~0.5 mm), arbor pins, and a pin-and-slot epicyclic gear coupling.",
        value: "30 bronze gears / 0.5mm module",
        isFact: true,
        quality: "sensor",
        evidenceClass: "surviving_physical",
        timestamp: "2026-08-08 14:30"
      },
      {
        id: "obs-a2",
        fact: "Back-dial inscriptions explicitly detail 223-month Saros eclipse prediction cycles, Exeligmos 54-year period multiplier, and Metonic 235 synodic month calendar spiral.",
        value: "223 Saros / 235 Metonic / 54yr Exeligmos",
        isFact: true,
        quality: "measured",
        evidenceClass: "inscription_derived",
        timestamp: "2026-08-08 15:00"
      },
      {
        id: "obs-a3",
        fact: "Kinematic drivetrain reconstruction of the 4-arbor train reproduces the 235/19 Metonic transmission and pin-and-slot lunar anomaly modulation.",
        value: "235/19 ratio verified",
        isFact: true,
        quality: "measured",
        evidenceClass: "reconstruction",
        timestamp: "2026-08-09 10:00"
      },
      {
        id: "obs-a4",
        fact: "Hypothetical 7-gear planetary display train model (Freeth 2021) accumulates 4.8° backlash and exceeds estimated hand-crank torque threshold under 0.22 friction.",
        value: "4.8° backlash / 0.92 Nm torque",
        isFact: false,
        quality: "inferred",
        evidenceClass: "hypothesis",
        timestamp: "2026-08-10 10:15"
      },
      {
        id: "obs-a5",
        fact: "Counterfactual Simulations 001–004 prove +1T tooth ablation breaks Metonic cycle conservation by 2.63% (47.37° drift), confirming integer tooth counts as binding MUST constraints.",
        value: "+2.63% kinematic deviation (MUST)",
        isFact: true,
        quality: "inferred",
        evidenceClass: "counterfactual_simulation",
        timestamp: "2026-08-13 18:30"
      }
    ],
    interpretations: [
      { id: "interp-a1", claim: "The pin-and-slot epicyclic mechanism is a direct physical embodiment of Hipparchus's geometric model of variable lunar velocity (first lunar anomaly).", evidenceIds: ["obs-a1", "obs-a2"], confidence: 98, status: "approved", createdAt: "2026-08-09 11:00" },
      { id: "interp-a2", claim: "The minimum capability vector K_min required to construct the Antikythera mechanism is entirely contained within attested Hellenistic Mediterranean technology (K_min ⊆ K_H).", evidenceIds: ["obs-a1", "obs-a2", "obs-a3"], confidence: 96, status: "approved", createdAt: "2026-08-10 11:30" }
    ],
    simulations: [
      {
        id: "sim-001-metonic-ratio",
        name: "Simulation 001: Metonic Gear-Train Ratio Integrity (Pure Kinematic)",
        startingState: "Initial Baseline State",
        changedVariables: "Perturb the effective tooth count/ratio of one gear in the Metonic transmission by +1 tooth equivalent while holding all other reconstructed ratios constant.",
        assumptions: [
          "235 synodic months / 19 tropical years is the target encoded relationship.",
          "All non-perturbed gear ratios remain fixed.",
          "Manufacturing error, friction and backlash are excluded from this first computational test.",
          "Only kinematic information transfer is being evaluated.",
          "No result may modify the archaeological evidence state."
        ],
        predictedOutcomes: [
          "Departure from nominal ratio: 2.63% kinematic transfer deviation.",
          "Accumulates -47.37° angular registration drift across 5-turn (1800°) spiral calendar dial.",
          "Ephemeris calendar phase drift reaches 6.18 synodic months (182.5 days) over one 19-year cycle.",
          "Question evaluation: Does the perturbed architecture still reproduce the target astronomical relationship within defined tolerance? -> NO. Candidate MUST constraint identified."
        ],
        divergence: "Counterfactual Model Divergence: +2.63% kinematic ratio departure. Under stated assumptions, preserving the Metonic transmission ratio is a candidate binding MUST constraint.",
        confidence: 99,
        createdAt: "2026-08-13 18:15",
        executionStatus: "VALIDATED_EVIDENCE",
        computeReceipt: {
          selectedRail: "LOCAL_DETERMINISTIC",
          endpointOrModel: "local-deterministic-kinematics/metonic-v1",
          inputManifest: {
            nominalTeeth: 38,
            perturbedTeeth: 39,
            moduleMm: 0.5,
            targetRatio: "235 / 19",
            centerDistanceMm: 19.0
          },
          codeVersion: "metonic-solver-v1.4.2",
          hardwareMetadata: {
            device: "Local Host CPU",
            cores: 8,
            runtimeDriver: "AVX-512 Native"
          },
          rawOutputArtifact: {
            nominal_ratio: 12.368421,
            perturbed_ratio: 12.051282,
            ratio_deviation_pct: -2.5641,
            spiral_dial_drift_deg: -46.15,
            calendar_day_drift: 177.3,
            mechanical_interference: true
          },
          timestamp: "2026-08-13 18:15:22 UTC",
          runId: "RUN-DET-20260813-ANTI-001",
          uncertaintyAndConvergence: {
            converged: true,
            residualError: 0.0,
            confidenceBounds: "Exact integer kinematic arithmetic (zero approximation uncertainty)",
            notes: "Deterministic kinematic evaluation."
          },
          inputOutputHash: "SHA256:d8c91a3b5e4f20176849bcde2198031548aef021894cba8741209341fa890123",
          fallbackOrDegradedMode: "None - Local CPU Deterministic Substrate"
        },
        jemmaValidation: {
          validated: true,
          unitsChecked: true,
          completenessScore: 100,
          evidenceClass: "reconstruction",
          notes: "Kinematic gear tooth ratio and angular coordinate drift algebraically verified.",
          validatedAt: "2026-08-13 18:16"
        },
        orionAblationChallenge: {
          challenged: true,
          assumptionsAttacked: ["Fixed arbor centers", "Integer tooth engagement", "Zero elastic deformation"],
          counterfactualVulnerability: "39-tooth gear causes physical arbor clash (+0.5mm center delta) under fixed frame geometry.",
          stressResult: "Passed: Confirms 38-tooth count as binding structural and astronomical requirement.",
          passed: true
        },
        operatorPromotionGate: {
          status: "approved",
          promotedAt: "2026-08-13 18:30",
          operatorNotes: "Admitted to twin state. Metonic gear tooth preservation confirmed as binding MUST.",
          admittedToLedger: true
        }
      },
      {
        id: "sim-002-backlash-propagation",
        name: "Simulation 002: Backlash & Angular Deadband Accumulation",
        startingState: "Kinematic Transmission Baseline",
        changedVariables: "Introduce triangular tooth mesh backlash (0.04mm clearance per mesh) across the 7-stage solar/lunar train.",
        assumptions: [
          "Kinematic gear tooth counts held at nominal baseline (38-tooth Metonic gear, 223-tooth Saros gear).",
          "Backlash modeled as uncoupled angular deadband at gear reversals.",
          "Substrate bronze elasticity ignored."
        ],
        predictedOutcomes: [
          "Cumulative backlash across lunar train reaches 1.8° to 2.4° at the zodiac pointer.",
          "Pointer remains within the ±0.5 zodiac day tolerance during unidirectional hand-crank rotation.",
          "Reverse cranking introduces observable hysteresis on the Saros eclipse spiral."
        ],
        divergence: "Counterfactual Model Divergence: 2.4° angular deadband. Unidirectional hand-cranking prevents cumulative position loss.",
        confidence: 95,
        createdAt: "2026-08-13 18:20",
        executionStatus: "VALIDATED_EVIDENCE",
        computeReceipt: {
          selectedRail: "LOCAL_DETERMINISTIC",
          endpointOrModel: "local-deterministic-kinematics/backlash-deadband-v1",
          inputManifest: {
            meshStages: 7,
            backlashPerMeshMm: 0.04,
            gearModuleMm: 0.5
          },
          codeVersion: "backlash-solver-v1.1",
          hardwareMetadata: {
            device: "Local Host CPU",
            cores: 8
          },
          rawOutputArtifact: {
            total_deadband_deg: 2.34,
            zodiac_day_error: 0.42,
            hysteresis_on_reversal: true
          },
          timestamp: "2026-08-13 18:20:00 UTC",
          runId: "RUN-DET-20260813-ANTI-002",
          uncertaintyAndConvergence: {
            converged: true,
            residualError: 0.002,
            confidenceBounds: "±0.2° deadband range based on hand-filing tolerance bounds",
            notes: "Triangular bronze tooth profile geometry."
          },
          inputOutputHash: "SHA256:1a84f32e90c741289bcaef310485901234857109284750192834710293847501",
          fallbackOrDegradedMode: "None - Local CPU Deterministic Substrate"
        },
        jemmaValidation: {
          validated: true,
          unitsChecked: true,
          completenessScore: 98,
          evidenceClass: "reconstruction",
          notes: "Backlash accumulation verified across 7 gear meshes.",
          validatedAt: "2026-08-13 18:21"
        },
        orionAblationChallenge: {
          challenged: true,
          assumptionsAttacked: ["Unidirectional cranking assumption", "Zero gear tooth wear"],
          counterfactualVulnerability: "Bidirectional operation causes pointer ambiguity if crank is reversed.",
          stressResult: "Passed: Identifies operational protocol requirement (unidirectional turn).",
          passed: true
        },
        operatorPromotionGate: {
          status: "approved",
          promotedAt: "2026-08-13 18:30",
          operatorNotes: "Admitted to twin state.",
          admittedToLedger: true
        }
      },
      {
        id: "sim-003-tooth-division-error",
        name: "Simulation 003: Hand-Filing Tooth-Division Geometric Error",
        startingState: "Kinematic Transmission Baseline",
        changedVariables: "Inject random circular division pitch error (±0.08mm per tooth span) simulating hand filing of triangular bronze teeth.",
        assumptions: [
          "Nominal gear teeth counts preserved.",
          "Center arbor distances fixed at microCT reconstructed coordinates.",
          "No torque-induced tooth deformation."
        ],
        predictedOutcomes: [
          "Local transmission error peaks at ±0.32° periodic velocity ripple.",
          "Long-term cumulative Metonic cycle ratio remains strictly preserved over full revolutions.",
          "No mechanical jamming observed below ±0.12mm hand-filing error threshold."
        ],
        divergence: "Counterfactual Model Divergence: ±0.32° transmission ripple. Periodic hand-filing variations do not break full-revolution integer ratio conservation.",
        confidence: 96,
        createdAt: "2026-08-13 18:25",
        executionStatus: "VALIDATED_EVIDENCE",
        computeReceipt: {
          selectedRail: "LOCAL_DETERMINISTIC",
          endpointOrModel: "local-deterministic-kinematics/pitch-error-v1",
          inputManifest: {
            pitchErrorSpanMm: 0.08,
            nominalTeeth: 38,
            moduleMm: 0.5
          },
          codeVersion: "pitch-error-solver-v1.0",
          hardwareMetadata: {
            device: "Local Host CPU",
            cores: 8
          },
          rawOutputArtifact: {
            peak_velocity_ripple_deg: 0.312,
            cycle_ratio_preserved: true,
            jamming_risk: "None (margin 0.04mm)"
          },
          timestamp: "2026-08-13 18:25:00 UTC",
          runId: "RUN-DET-20260813-ANTI-003",
          uncertaintyAndConvergence: {
            converged: true,
            residualError: 0.001,
            confidenceBounds: "Monte Carlo 10,000 runs ±0.03° ripple variation",
            notes: "Simulates manual bronze file stroke variations."
          },
          inputOutputHash: "SHA256:7c901e8a245d8b13904581290384750192834710293847501928347102938475",
          fallbackOrDegradedMode: "None - Local CPU Deterministic Substrate"
        },
        jemmaValidation: {
          validated: true,
          unitsChecked: true,
          completenessScore: 97,
          evidenceClass: "reconstruction",
          notes: "Tooth division pitch error bounded against surviving gear tooth geometry.",
          validatedAt: "2026-08-13 18:26"
        },
        orionAblationChallenge: {
          challenged: true,
          assumptionsAttacked: ["Uniform tooth filing distribution", "Symmetric triangular form"],
          counterfactualVulnerability: "Errors > 0.14mm cause mechanical jamming during tooth engagement.",
          stressResult: "Passed: Verifies Hellenistic bronze craftsmanship met required accuracy bounds.",
          passed: true
        },
        operatorPromotionGate: {
          status: "approved",
          promotedAt: "2026-08-13 18:30",
          operatorNotes: "Admitted to twin state.",
          admittedToLedger: true
        }
      },
      {
        id: "sim-004-friction-torque-substrate",
        name: "Simulation 004: Bronze Friction, Arbor Load & Mechanical Torque",
        startingState: "Physical Substrate Baseline",
        changedVariables: "Simulate continuous hand-crank input across 30 bronze gears under dry sliding friction coefficient (μ = 0.22) and arbor bushing resistance.",
        assumptions: [
          "No modern petrochemical lubricants.",
          "Arbor bushing clearance 0.05mm.",
          "Manual operator input torque constrained to human ergonomic hand-crank limit (<1.2 Nm)."
        ],
        predictedOutcomes: [
          "Total drive train resistive torque calculates to 0.65 Nm at nominal crank speed.",
          "System operates continuously well below human operator fatigue ceiling.",
          "Pin-and-slot epicyclic subassembly adds 0.08 Nm cyclic torque variation matching eccentric anomaly."
        ],
        divergence: "Counterfactual Model Divergence: 0.65 Nm steady-state torque. Confirms physical executability of reconstructed bronze mechanism under Hellenistic metallurgical parameters.",
        confidence: 94,
        createdAt: "2026-08-13 18:30",
        executionStatus: "VALIDATED_EVIDENCE",
        computeReceipt: {
          selectedRail: "LOCAL_DETERMINISTIC",
          endpointOrModel: "local-deterministic-kinematics/tribology-torque-v1",
          inputManifest: {
            frictionCoeff: 0.22,
            gearCount: 30,
            bushingClearanceMm: 0.05,
            crankSpeedRpm: 12
          },
          codeVersion: "tribology-solver-v1.3",
          hardwareMetadata: {
            device: "Local Host CPU",
            cores: 8
          },
          rawOutputArtifact: {
            drive_torque_nm: 0.648,
            operator_fatigue_margin_pct: 46.0,
            epicyclic_torque_variation_nm: 0.082,
            jamming_probability: 0.0
          },
          timestamp: "2026-08-13 18:30:00 UTC",
          runId: "RUN-DET-20260813-ANTI-004",
          uncertaintyAndConvergence: {
            converged: true,
            residualError: 0.005,
            confidenceBounds: "90% CI: [0.58 Nm, 0.72 Nm] under varying ambient humidity",
            notes: "Dry bronze on bronze friction coefficient."
          },
          inputOutputHash: "SHA256:9f8e7d6c5b4a3928170928347102938475019283471029384750192834710293",
          fallbackOrDegradedMode: "None - Local CPU Deterministic Substrate"
        },
        jemmaValidation: {
          validated: true,
          unitsChecked: true,
          completenessScore: 96,
          evidenceClass: "reconstruction",
          notes: "Torque and friction units verified: Nm, RPM, μ dimensionless.",
          validatedAt: "2026-08-13 18:31"
        },
        orionAblationChallenge: {
          challenged: true,
          assumptionsAttacked: ["Clean bronze arbors without corrosion", "Constant crank input velocity"],
          counterfactualVulnerability: "Friction coeff μ > 0.45 exceeds single-operator ergonomic cranking threshold (1.4 Nm).",
          stressResult: "Passed: Establishes bronze surface finish requirement.",
          passed: true
        },
        operatorPromotionGate: {
          status: "approved",
          promotedAt: "2026-08-13 18:35",
          operatorNotes: "Admitted to twin state.",
          admittedToLedger: true
        }
      }
    ],
    revisions: [
      { id: "rev-a1", title: "Antikythera Four-State Epistemic Twin Baseline", description: "Established Physical P(t), Computational C(t), Epistemic E, Capability K, and Transmission T(t) states with strict provenance ledger rules.", author: "Operator", timestamp: "2026-08-08 12:00", changeSummary: "Initialized 5 core entities, 3 relationships, and 3 evidence-tagged observations." }
    ],
    pathfinderRecords: [
      { id: "pf-a1", question: "What is the minimum capability vector K_min required for the Antikythera Mechanism to exist, and does it exceed attested Hellenistic technology?", evidence: ["30 surviving bronze gears with 0.5mm module", "Pin-and-slot epicyclic assembly", "Metonic and Saros inscriptions"], investigation: "Ablated gear manufacturing, astronomical period encoding, and epicyclic design. Evaluated physical executability under bronze friction.", challenge: "Does the missing planetary display imply anachronistic manufacturing capabilities?", decision: "Confirm K_min ⊆ K_H. The device represents high Hellenistic engineering precision; no unevidenced or anachronistic technology is required or permitted.", commitStatus: "committed", createdAt: "2026-08-10 15:00" }
    ],
    activeFlows: [
      { stage: "COLLECTION", title: "Hand Crank Drive & Astronomical Ratios", description: "Main drive axle receives mechanical hand torque while hard-wired tooth counts define Metonic & Saros ratios.", rateOrVolume: "1 rev/yr reference drive · 235/19 ratio", lossOrEfficiency: "98.5% kinematic drive efficiency" },
      { stage: "STORAGE", title: "Gear Topology & Epistemic Ledger", description: "30 surviving bronze gears store astronomical constants in hardware; evidence ledger tags all component states.", rateOrVolume: "30 surviving gears · 5 evidence states", lossOrEfficiency: "Zero unevidenced data leakage" },
      { stage: "TRANSFORMATION", title: "Pin-and-Slot Epicyclic Kinematics", description: "Converts uniform drive rotation into variable angular speed matching Hipparchus's lunar anomaly model.", rateOrVolume: "Lunar anomaly velocity modulation", lossOrEfficiency: "99.2% mathematical model accuracy" },
      { stage: "DISTRIBUTION", title: "Calendar Dials & Eclipse Predictions", description: "Outputs continuous solar/lunar positions on zodiac dial, 223-month Saros eclipse spiral, and Olympiad cycle.", rateOrVolume: "223 synodic month spiral · Zodiac face", lossOrEfficiency: "2.4° backlash position tolerance" }
    ],
    integrityStatus: "STABLE",
    createdAt: "2026-08-08 12:00",
    updatedAt: "2026-08-10 15:00"
  },

  {
    id: "cooled-radiative-cooling-06",
    name: "COOLed — Passive Radiative Cooling Twin",
    description: "Nanostructured PVDF infiltrated into nanoporous anodised aluminium oxide (AAO) templates for electricity-free daytime passive radiative cooling via the 8–13 μm atmospheric window.",
    domain: "physical",
    purpose: "Predict, test and optimise electricity-free cooling under real environmental conditions—distinguishing measured surface-temperature reduction, calculated net radiative cooling power, laboratory spectral performance, and projected building-energy savings without unevidenced capability inflation.",
    capabilityRegistry: SYSTEM_CAPABILITY_REGISTRY,
    selectedModelId: "physics-pde-solver-v2",
    selectedModelCapability: SYSTEM_CAPABILITY_REGISTRY[2],
    boundary: {
      description: "Governing Law: 'The sky is the heat sink; the atmospheric window is the exhaust path; geometry controls access.' System domain covers PVDF/AAO material substrate, 3D nanopore geometry, processing history, thermal radiation balance, and local atmospheric weather coupling.",
      includedEntities: [
        "Material Substrate [PVDF Formulation & Crystallinity]",
        "Nanopore Geometry [AAO Template & 3D Matrix]",
        "Processing History [Infiltration, Ultrafast Cooling, UV Whitening]",
        "Environmental Solar & Sky Field [Tres Cantos Rooftop & Microclimate]",
        "Radiative Thermal Balance & Optical Window [8–13 μm Exhaust Path]"
      ],
      excludedEntities: [
        "Active Electrical Compressors or Thermoelectric Heat Pumps",
        "Universal Global Microclimate Equivalence Claims",
        "Unverified 10-Year Polymer Weathering Extrapolations"
      ],
      inputs: [
        { id: "inp-c1", name: "Direct & Diffuse Solar Irradiance", type: "solar_radiation", rate: "962 - 1,000 W/m²", medium: "atmospheric solar path" },
        { id: "inp-c2", name: "Parasitic Convective & Conductive Heat Gain", type: "ambient_thermal", rate: "h_c · (T_amb - T_surf)", medium: "ambient boundary layer airflow" },
        { id: "inp-c3", name: "Atmospheric Downwelling Thermal Radiation", type: "sky_radiation", rate: "I_atm(λ, θ, RH)", medium: "atmospheric window" }
      ],
      outputs: [
        { id: "out-c1", name: "Direct Space Radiative Emission (8–13 μm)", type: "infrared_radiation", rate: "182.3 W/m² net capacity", medium: "atmospheric transparency window" },
        { id: "out-c2", name: "Reflected Solar Radiation (0.3–2.5 μm)", type: "optical_reflection", rate: "82.4% solar reflectance", medium: "surface scattering" },
        { id: "out-c3", name: "Surface Cooling Delta", type: "thermal_depression", rate: "Up to 12.9°C below untreated sample", medium: "rooftop substrate interface" }
      ],
      permeabilityRules: [
        { id: "rule-c1", inputType: "infrared_emission", condition: "wavelength >= 8.0 μm AND wavelength <= 13.0 μm", action: "permit", parameters: { targetEmissivity: 0.967, windowBand: "8-13 μm" } },
        { id: "rule-c2", inputType: "solar_irradiance", condition: "wavelength >= 0.3 μm AND wavelength <= 2.5 μm", action: "reject", parameters: { targetReflectance: 0.824, uvWhiteningActive: true } },
        { id: "rule-c3", inputType: "convective_heat_gain", condition: "wind_velocity > 4.5 m/s OR relative_humidity > 70%", action: "attenuate", parameters: { dampingFactor: 0.65, requireSimulationValidation: true } }
      ]
    },
    sourceAssets: [
      { id: "asset-c1", name: "vicente2024_nanophotonics_finder.pdf", type: "peer_reviewed_paper", size: "3.8 MB", timestamp: "2026-08-17 14:00" },
      { id: "asset-c2", name: "tres_cantos_rooftop_telemetry.csv", type: "field_telemetry", size: "14.2 MB", timestamp: "2026-08-17 16:30" },
      { id: "asset-c3", name: "pvdf_aao_ftir_spectral_emissivity.json", type: "spectroscopic_data", size: "2.1 MB", timestamp: "2026-08-17 17:00" }
    ],
    entities: [
      {
        id: "ent-c1",
        name: "Material Substrate (PVDF Infiltrate)",
        type: "polymer_composite",
        state: {
          polymer: "Polyvinylidene Fluoride (PVDF)",
          crystallinityPhase: "Beta-phase dominant",
          uvResistance: "High (Photostable)",
          hydrophobicity: "Contact angle > 115° (Self-cleaning)",
          durabilityState: "Laboratory validated"
        },
        description: "Polyvinylidene fluoride polymer chosen for intrinsic C-F bond infrared vibrational resonances, weather resistance, UV stability, and water repellency.",
        status: "active"
      },
      {
        id: "ent-c2",
        name: "Nanopore Geometry (AAO Matrix)",
        type: "nanostructured_template",
        state: {
          templateMaterial: "Anodised Aluminium Oxide (AAO)",
          poreArchitecture: "3D ordered nanoporous array",
          internalGeometryControl: "Sub-nanometre precision",
          opticalCouplingFactor: "Optimised for 8–13 μm emission and solar scattering"
        },
        description: "Anodised aluminium oxide nanoporous template controlling 3D polymer confinement, refractive index matching, and mid-IR photonic density of states.",
        status: "active"
      },
      {
        id: "ent-c3",
        name: "Processing History (Synthesis Protocol)",
        type: "manufacturing_process",
        state: {
          infiltrationStep: "Vacuum-assisted polymer melt infiltration",
          coolingRegime: "Ultrafast quenching",
          surfaceTreatment: "UV photo-bleaching / whitening",
          solarReflectanceAchieved: "82.4%",
          atmosphericEmissivityAchieved: "96.7%"
        },
        description: "Three-stage physical processing sequence: precision polymer infiltration, ultrafast thermal quenching to lock nanostructure, and UV whitening to elevate solar reflectance.",
        status: "active"
      },
      {
        id: "ent-c4",
        name: "Environmental Field (Tres Cantos Rooftop)",
        type: "microclimate_field",
        state: {
          location: "Tres Cantos, Madrid, Spain",
          peakSolarIrradiance: "962 W/m² (Reference: 1,000 W/m²)",
          atmosphereCondition: "Hot, dry, sunny summer rooftop",
          relativeHumidity: "22% (Dry sky baseline)",
          convectiveHeatTransferCoeff: "h_c ~ 6.0 W/m²K"
        },
        description: "Local atmospheric boundary conditions in Madrid serving as the physical trial ground-truth baseline.",
        status: "active"
      },
      {
        id: "ent-c5",
        name: "Radiative Thermal Balance & Optical Window",
        type: "photonic_radiator",
        state: {
          netCoolingPower: "182.3 W/m² (at 1,000 W/m² solar load)",
          measuredSurfaceDelta: "-12.9°C (vs untreated reference sample)",
          infraredWindowBand: "8–13 μm",
          skyHeatSinkTemp: "~3 K (Space equivalent coupling)"
        },
        description: "Thermodynamic energy balance engine balancing solar absorption P_sun, atmospheric absorption P_atm, surface emission P_rad, and parasitic convection/conduction P_nonrad.",
        status: "active"
      }
    ],
    relationships: [
      { id: "rel-c1", sourceId: "ent-c2", targetId: "ent-c1", relationshipType: "geometric_confinement", medium: "nanopore_walls", strength: 0.98, latency: 0, direction: "two_way" },
      { id: "rel-c2", sourceId: "ent-c3", targetId: "ent-c1", relationshipType: "processing_structure_determinant", medium: "thermal_uv_treatment", strength: 0.95, latency: 0, direction: "one_way" },
      { id: "rel-c3", sourceId: "ent-c1", targetId: "ent-c5", relationshipType: "spectral_emission_source", medium: "c_f_vibrational_resonance", strength: 0.97, latency: 0, direction: "one_way" },
      { id: "rel-c4", sourceId: "ent-c4", targetId: "ent-c5", relationshipType: "ambient_thermal_forcing", medium: "solar_irradiance_and_air_convection", strength: 0.92, latency: 0, direction: "two_way" }
    ],
    states: [
      {
        id: "st-c1",
        name: "Tres Cantos Rooftop Operational State",
        metrics: {
          solarReflectance: "82.4%",
          atmosphericEmissivity: "96.7%",
          coolingPowerModelled: "182.3 W/m²",
          rooftopPeakIrradiance: "962 W/m²",
          maxSurfaceDelta: "-12.9°C vs untreated sample",
          truthBoundary: "Madrid dry summer baseline; not yet universal across high-humidity/cloud environments"
        },
        timestamp: "2026-08-17 12:00",
        active: true
      }
    ],
    observations: [
      {
        id: "obs-c1",
        fact: "FTIR spectrophotometry demonstrates 82.4% average solar reflectance across 0.3–2.5 μm and 96.7% thermal emissivity in the 8–13 μm atmospheric transparency window.",
        value: "82.4% R_solar / 96.7% ε_8-13μm",
        isFact: true,
        quality: "measured",
        evidenceClass: "surviving_physical",
        timestamp: "2026-08-17 10:00"
      },
      {
        id: "obs-c2",
        fact: "Outdoor rooftop trial in Tres Cantos (Madrid) under 962 W/m² peak solar irradiance recorded up to 12.9°C surface temperature reduction compared to an uncoated sample on hot, dry, sunny days.",
        value: "ΔT = -12.9°C (at 962 W/m² peak)",
        isFact: true,
        quality: "sensor",
        evidenceClass: "surviving_physical",
        timestamp: "2026-08-17 11:30"
      },
      {
        id: "obs-c3",
        fact: "Theoretical Stefan-Boltzmann photonic energy balance under 1,000 W/m² reference solar irradiance yields a calculated net daytime cooling power of 182.3 W/m².",
        value: "182.3 W/m² calculated net cooling",
        isFact: true,
        quality: "measured",
        evidenceClass: "reconstruction",
        timestamp: "2026-08-17 12:15"
      },
      {
        id: "obs-c4",
        fact: "Epistemic Truth Boundary Guard: The 12.9°C delta represents a specific local rooftop comparison in hot, dry Madrid conditions (RH ~22%) and is NOT a universal sub-ambient cooling guarantee for humid, overcast or high-wind environments.",
        value: "Local Condition Bound (RH < 30%, Clear Sky)",
        isFact: false,
        quality: "inferred",
        evidenceClass: "hypothesis",
        timestamp: "2026-08-17 13:00"
      }
    ],
    interpretations: [
      {
        id: "interp-c1",
        claim: "The 3D nanoporous AAO template geometry tailors the mid-infrared photonic density of states of PVDF while UV whitening eliminates visible-spectrum parasitic absorption, enabling net negative thermal flux in direct sunlight.",
        evidenceIds: ["obs-c1", "obs-c2", "obs-c3"],
        confidence: 97,
        status: "approved",
        createdAt: "2026-08-17 14:30"
      },
      {
        id: "interp-c2",
        claim: "Material performance is governed by a 5-way coupled system: Material composition × Nanopore geometry × Processing history × Atmosphere/RH × Solar load.",
        evidenceIds: ["obs-c1", "obs-c4"],
        confidence: 95,
        status: "approved",
        createdAt: "2026-08-17 15:00"
      }
    ],
    simulations: [
      {
        id: "sim-c1-environmental-envelope",
        name: "Simulation 001: Sub-Ambient Cooling Boundary Envelope (Humidity × Wind × Cloud Sweep)",
        startingState: "Tres Cantos Dry Baseline (RH 22%, Wind 1.2 m/s, Cloud 0%)",
        changedVariables: "Sweep Relative Humidity (10% to 90%), Wind Velocity (0.5 to 10 m/s), Cloud Cover (0% to 100%), and Solar Irradiance (200 to 1,000 W/m²).",
        assumptions: [
          "Solar reflectance fixed at 82.4% (UV whitened).",
          "Atmospheric window emissivity fixed at 96.7% across 8–13 μm.",
          "Atmospheric water vapor column absorption modelled via MODTRAN dry/mid-latitude summer profiles.",
          "Convective heat transfer coefficient h_c = 2.8 + 3.0 · v_wind (W/m²K).",
          "No active mechanical cooling or artificial thermal shields."
        ],
        predictedOutcomes: [
          "Sub-Ambient Regime: Material sustains sub-ambient cooling (T_surf < T_amb) for RH < 58% and Wind < 4.2 m/s under full 1,000 W/m² solar load.",
          "Binding Constraint Threshold: When relative humidity exceeds 68%, atmospheric window transmissivity in 8–13 μm collapses from 0.88 to 0.41, reducing net cooling capacity to +18 W/m² (surface approaches ambient).",
          "Convective Quenching: Wind velocity > 6.5 m/s increases convective parasitic gain h_c > 22 W/m²K, compressing the rooftop temperature delta from -12.9°C to -2.1°C.",
          "Cloud Cover Cutoff: Overcast cloud cover (>65%) transforms the sky into a blackbody radiator at near-ambient temperature, extinguishing the deep-space heat sink."
        ],
        divergence: "Physically bounded counterfactual divergence: Identifies atmospheric water vapor column and convective air coupling as primary binding MUST constraints dictating operational viability outside Madrid.",
        confidence: 96,
        createdAt: "2026-08-17 16:00",
        executionStatus: "VALIDATED_EVIDENCE",
        computeReceipt: {
          selectedRail: "RAPIDS_GPU",
          endpointOrModel: "rapids-cudf-sweep/atmospheric-modtran-v24",
          inputManifest: {
            solarReflectance: 0.824,
            infraredWindowEmissivity: 0.967,
            sweepGrid: "RH: 10-90% (step 5%), Wind: 0.5-10 m/s (step 0.5 m/s), Cloud: 0-100%, Solar: 200-1000 W/m²",
            atmosphericModel: "MODTRAN Mid-Latitude Summer / Tres Cantos Telemetry",
            convectionModel: "h_c = 2.8 + 3.0 * v_wind (W/m²K)"
          },
          codeVersion: "rapids-cudf-v24.08 / cuda-12.4",
          hardwareMetadata: {
            device: "Cloud GPU Node",
            accelerator: "NVIDIA A100-SXM4-80GB",
            memoryGb: 80,
            cores: 64,
            runtimeDriver: "CUDA 12.4 / Driver 550.54.14"
          },
          rawOutputArtifact: [
            { rh_pct: 22, wind_ms: 1.2, cloud_pct: 0, solar_wm2: 962, hc_wm2k: 6.4, transmissivity_8_13um: 0.884, p_net_cooling_wm2: 182.3, t_surf_delta_c: -12.9, sub_ambient: true },
            { rh_pct: 50, wind_ms: 2.0, cloud_pct: 0, solar_wm2: 962, hc_wm2k: 8.8, transmissivity_8_13um: 0.672, p_net_cooling_wm2: 98.4, t_surf_delta_c: -6.8, sub_ambient: true },
            { rh_pct: 68, wind_ms: 3.0, cloud_pct: 10, solar_wm2: 962, hc_wm2k: 11.8, transmissivity_8_13um: 0.412, p_net_cooling_wm2: 18.2, t_surf_delta_c: -0.8, sub_ambient: true },
            { rh_pct: 75, wind_ms: 4.5, cloud_pct: 20, solar_wm2: 962, hc_wm2k: 16.3, transmissivity_8_13um: 0.315, p_net_cooling_wm2: -14.6, t_surf_delta_c: 1.4, sub_ambient: false },
            { rh_pct: 85, wind_ms: 7.0, cloud_pct: 60, solar_wm2: 962, hc_wm2k: 23.8, transmissivity_8_13um: 0.180, p_net_cooling_wm2: -85.2, t_surf_delta_c: 5.3, sub_ambient: false }
          ],
          timestamp: "2026-08-17 16:00:12 UTC",
          runId: "RUN-RPD-20260817-COOL-001",
          uncertaintyAndConvergence: {
            converged: true,
            iterations: 1420,
            residualError: 0.00014,
            confidenceBounds: "95% CI: [-13.4°C, -12.4°C] in dry baseline; collapse boundary RH 68% ± 3%",
            notes: "Modelling assumes single-layer planar rooftop geometry with sky view factor F_sky = 1.0."
          },
          inputOutputHash: "SHA256:7f8a9b21c4e9834d0e8211b7a6358c89422f1837894a0d9bce41398eaef98231",
          fallbackOrDegradedMode: "None - Native GPU Execution"
        },
        jemmaValidation: {
          validated: true,
          unitsChecked: true,
          completenessScore: 99,
          evidenceClass: "counterfactual_simulation",
          notes: "Dimensional consistency verified: W/m², %, °C, m/s. Bound to Tres Cantos empirical telemetry baseline.",
          validatedAt: "2026-08-17 16:15"
        },
        orionAblationChallenge: {
          challenged: true,
          assumptionsAttacked: [
            "Zero humidity degradation",
            "Calm wind assumption (v < 1 m/s)",
            "Unimpeded 8-13um sky access in overcast conditions"
          ],
          counterfactualVulnerability: "High sensitivity to convective parasitic gain (v_wind > 4.2 m/s) and atmospheric water vapor opacity (RH > 68%).",
          stressResult: "Passed: Identifies strict binding MUST envelope boundaries rather than masking vulnerability.",
          passed: true
        },
        operatorPromotionGate: {
          status: "approved",
          promotedAt: "2026-08-17 17:00",
          operatorNotes: "Promoted into accepted twin state. Envelope bounds RH < 58% and Wind < 4.2 m/s adopted as operational prerequisite before building deployment.",
          admittedToLedger: true
        }
      },
      {
        id: "sim-c2-processing-ablation",
        name: "Simulation 002: Processing History & UV Whitening Ablation",
        startingState: "Optimised PVDF/AAO State",
        changedVariables: "Ablate UV whitening stage (Solar reflectance drops from 82.4% to 68.0%) and ablate ultrafast cooling (emissivity drops from 96.7% to 81.2%).",
        assumptions: [
          "Solar irradiance held constant at 1,000 W/m².",
          "Ambient temperature 35°C, Madrid summer dry atmosphere."
        ],
        predictedOutcomes: [
          "Ablating UV whitening injects +144 W/m² additional parasitic solar heat absorption, completely extinguishing daytime sub-ambient cooling (T_surf reaches +4.2°C above ambient).",
          "Proves UV whitening and ultrafast quench are binding MUST processing constraints for daytime radiative refrigeration."
        ],
        divergence: "Counterfactual Model Divergence: +17.1°C thermal penalty without UV whitening. Confirms processing history as non-negotiable operational prerequisite.",
        confidence: 98,
        createdAt: "2026-08-17 16:30",
        executionStatus: "VALIDATED_EVIDENCE",
        computeReceipt: {
          selectedRail: "NVIDIA_NIM",
          endpointOrModel: "nvidia-nim-physics/stefan-boltzmann-pde-v2",
          inputManifest: {
            solarIrradiance: 1000,
            ablatedSolarReflectance: 0.680,
            ablatedWindowEmissivity: 0.812,
            ambientTemperature: 35.0,
            atmosphereProfile: "Madrid Summer Dry Baseline"
          },
          codeVersion: "nvidia-tensorrt-physics-v0.9.0",
          hardwareMetadata: {
            device: "Cloud Accelerator",
            accelerator: "NVIDIA H100 SXM5 80GB",
            memoryGb: 80,
            cores: 132,
            runtimeDriver: "CUDA 12.5"
          },
          rawOutputArtifact: {
            baseline: { t_surf_c: 22.1, t_amb_c: 35.0, delta_t_c: -12.9, absorbed_solar_wm2: 176.0 },
            uv_ablated: { t_surf_c: 39.2, t_amb_c: 35.0, delta_t_c: 4.2, absorbed_solar_wm2: 320.0, solar_penalty_wm2: 144.0 },
            quench_ablated: { t_surf_c: 36.8, t_amb_c: 35.0, delta_t_c: 1.8, emitted_ir_wm2: 312.0, ir_loss_wm2: -62.0 }
          },
          timestamp: "2026-08-17 16:30:45 UTC",
          runId: "RUN-NV-20260817-COOL-002",
          uncertaintyAndConvergence: {
            converged: true,
            iterations: 850,
            residualError: 0.00008,
            confidenceBounds: "98% CI: [+3.8°C, +4.6°C] under full solar load",
            notes: "Direct photon balance verification."
          },
          inputOutputHash: "SHA256:3a1b94c8e76f120d9845ba31198305c742918451893c52aef198731bfa827614",
          fallbackOrDegradedMode: "None - Native TensorRT Execution"
        },
        jemmaValidation: {
          validated: true,
          unitsChecked: true,
          completenessScore: 100,
          evidenceClass: "counterfactual_simulation",
          notes: "Ablation parameters check: UV whitening step and thermal quenching verified as required processing stages.",
          validatedAt: "2026-08-17 16:40"
        },
        orionAblationChallenge: {
          challenged: true,
          assumptionsAttacked: [
            "Polymer raw solar reflectance without UV bleaching",
            "Equilibrium without quenching"
          ],
          counterfactualVulnerability: "Without UV whitening, material heats to +4.2°C above ambient under sunlight.",
          stressResult: "Passed: Proves UV whitening is a non-negotiable MUST processing constraint.",
          passed: true
        },
        operatorPromotionGate: {
          status: "approved",
          promotedAt: "2026-08-17 17:05",
          operatorNotes: "UV whitening and ultrafast quench verified as binding MUST processing steps.",
          admittedToLedger: true
        }
      }
    ],
    revisions: [
      {
        id: "rev-c1",
        title: "COOLed Passive Radiative Cooling Digital Twin Baseline",
        description: "Initial instantiation of the PVDF/AAO passive radiative cooling twin on Pathfinder substrate with 5-domain state model and Madrid ground-truth baseline.",
        author: "Operator (IMN-CNM FINDER / CSIC Protocol)",
        timestamp: "2026-08-17 12:00",
        changeSummary: "Registered 5 core entities, 4 relationships, 4 epistemic observations, and 2 boundary simulation sweeps."
      }
    ],
    pathfinderRecords: [
      {
        id: "pf-c1",
        question: "Under which combinations of humidity, wind, cloud cover, and solar irradiance does the PVDF/AAO material remain strictly below ambient temperature?",
        evidence: [
          "82.4% solar reflectance / 96.7% 8-13μm emissivity",
          "182.3 W/m² calculated cooling power at 1,000 W/m² irradiance",
          "12.9°C measured surface delta on Tres Cantos rooftop"
        ],
        investigation: "Coupled Stefan-Boltzmann radiative balance with atmospheric water vapor attenuation profiles and convective boundary layer equations across a 4-dimensional environmental parameter sweep.",
        challenge: "Is the 12.9°C cooling delta a universal capability or an artifact of Madrid's exceptionally dry summer atmosphere (RH ~22%)?",
        decision: "Commit truth boundary: 12.9°C delta is validated for hot, dry rooftop environments. Promote Simulation 001 sub-ambient envelope (RH < 58%, Wind < 4.2 m/s) as binding operational constraint before building-scale deployment.",
        commitStatus: "committed",
        createdAt: "2026-08-17 17:00"
      }
    ],
    activeFlows: [
      {
        stage: "COLLECTION",
        title: "Solar & Atmospheric Thermal Influx",
        description: "Surface intercepts solar radiation (962–1,000 W/m²) and parasitic ambient convection/conduction while rejecting 82.4% of solar spectrum.",
        rateOrVolume: "962 W/m² peak solar · 82.4% solar reflectance",
        lossOrEfficiency: "17.6% solar absorption heat influx"
      },
      {
        stage: "STORAGE",
        title: "Nanoporous Matrix & Polymer Photonic Density",
        description: "AAO template and PVDF 3D geometry structure mid-IR vibrational dipole modes for high photon escape probability.",
        rateOrVolume: "96.7% emissivity in 8–13 μm window",
        lossOrEfficiency: "Zero parasitic sub-surface thermal trapping"
      },
      {
        stage: "TRANSFORMATION",
        title: "Infrared Optical Filtering & Deep-Space Coupling",
        description: "Directs thermal kinetic energy into the 8–13 μm atmospheric transparency window, coupling directly to the 3 K deep-space heat sink.",
        rateOrVolume: "182.3 W/m² net cooling power capacity",
        lossOrEfficiency: "Selective spectrum transparency efficiency: 96.7%"
      },
      {
        stage: "DISTRIBUTION",
        title: "Sub-Ambient Surface Temperature Depression",
        description: "Delivers passive electricity-free temperature reduction on treated building façades, roofs, and device enclosures.",
        rateOrVolume: "-12.9°C surface delta vs untreated sample",
        lossOrEfficiency: "Maintains sub-ambient state for RH < 58% & Wind < 4.2 m/s"
      }
    ],
    integrityStatus: "STABLE",
    createdAt: "2026-08-17 12:00",
    updatedAt: "2026-08-17 17:00"
  },

  {
    id: "intelligent-protective-membrane-07",
    name: "Pathfinder Intelligent Protective Membrane",
    description: "Multi-scale self-reporting protective nervous system translating dense metal–metal orbital overlap physics into safe W/Mo and Hf/Zr functional networks for real-time impact localization, blind crack detection, and delamination telemetry.",
    domain: "engineered",
    purpose: "Translate dense electronic topology (Co–U–Co computational reference) into safe, non-actinide deformation-sensitive molecular networks for distributed strain telemetry, in-situ structural integrity monitoring, and impact localization across 4 progressive scales.",
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
        executionStatus: "VALIDATED_EVIDENCE",
        computeReceipt: {
          selectedRail: "NVIDIA_NIM",
          endpointOrModel: "nvidia-nim-physics/piezoresistive-impact-pde-v1",
          inputManifest: {
            projectileVelocityMs: 720,
            impactCoordinatesMm: [35, 55],
            ceramicThicknessMm: 4.5,
            aramidPlies: 12,
            gaugeFactor: 14.8,
            samplingFreqKhz: 100
          },
          codeVersion: "piezoresistive-pde-solver-v2.1",
          hardwareMetadata: {
            device: "Cloud Accelerator",
            accelerator: "NVIDIA H100 SXM5 80GB",
            memoryGb: 80,
            cores: 132,
            runtimeDriver: "CUDA 12.5"
          },
          rawOutputArtifact: {
            localized_impact_x_mm: 34.8,
            localized_impact_y_mm: 55.3,
            localization_error_mm: 0.36,
            peak_shockwave_velocity_ms: 4250,
            dynamic_impedance_drop_pct: 38.5,
            blind_delamination_detected_mm2: 0.72,
            residual_integrity_rating: 0.88,
            electronic_precursor_lead_time_us: 42.5
          },
          timestamp: "2026-08-19 05:15:30 UTC",
          runId: "RUN-NV-20260819-MEMBRANE-001",
          uncertaintyAndConvergence: {
            converged: true,
            iterations: 1200,
            residualError: 0.00004,
            confidenceBounds: "95% CI: [1.2 mm, 1.6 mm] spatial accuracy under variable projectile yaw",
            notes: "Multi-scale coupled mechanical-piezoresistive PDE solver."
          },
          inputOutputHash: "SHA256:4f8e2d9b6c1a8374902834710293847501928347102938475019283471029384",
          fallbackOrDegradedMode: "None - Native TensorRT Accelerated Execution"
        },
        jemmaValidation: {
          validated: true,
          unitsChecked: true,
          completenessScore: 100,
          evidenceClass: "counterfactual_simulation",
          notes: "Dimensional consistency verified: m/s, kJ, mm, GPa, kΩ, μs, %. All units bound to empirical laminate telemetry.",
          validatedAt: "2026-08-19 05:20"
        },
        orionAblationChallenge: {
          challenged: true,
          assumptionsAttacked: [
            "Pure elastic deformation assumption",
            "Homogeneous contact pressure distribution",
            "Zero moisture ingress in field conditions"
          ],
          counterfactualVulnerability: "Severe signal attenuation occurs if moisture breaches COF encapsulation without hydrophobic polymer barrier.",
          stressResult: "Passed: Proves Hf/Zr and hydrophobic polymer encapsulation is a binding MUST constraint.",
          passed: true
        },
        operatorPromotionGate: {
          status: "approved",
          promotedAt: "2026-08-19 05:30",
          operatorNotes: "Promoted to twin state. W/Mo piezoresistive telemetry with Hf/Zr environmental encapsulation validated for wearable laminate integration.",
          admittedToLedger: true
        }
      },
      {
        id: "sim-ipm-002-surrogate-screening-matrix",
        name: "Simulation 002: Non-Actinide Surrogate Screening & Toxicological Falsification Sweep",
        startingState: "Co-U-Co Reference Physics Baseline",
        changedVariables: "Screen 14 transition-metal surrogate clusters across W/Mo (5d/4d), Hf/Zr (Group 4), Re, and Ta systems against Co-U-Co 10-bond reference electronic topology.",
        assumptions: [
          "Zero actinide deployment in physical manufacturing.",
          "Strict cytotoxicity limit: <0.1 ppm metal ion leaching in sweat/saline.",
          "Minimum required gauge factor > 8.0."
        ],
        predictedOutcomes: [
          "W/Mo candidates achieve 88% of reference orbital deformation sensitivity (Gauge Factor 14.8 vs 16.8 reference) with zero radioactivity.",
          "Hf/Zr candidates achieve superior environmental stability (0.02% drift / 10k cycles) and pass all cytotoxic leaching limits.",
          "Confirms viable non-actinide substitution path across 4 progressive scales."
        ],
        divergence: "Counterfactual Model Divergence: W/Mo + Hf/Zr dual-network architecture reproduces deformation-sensing functionality without actinide toxicity.",
        confidence: 96,
        createdAt: "2026-08-19 05:35",
        executionStatus: "VALIDATED_EVIDENCE",
        computeReceipt: {
          selectedRail: "LOCAL_DETERMINISTIC",
          endpointOrModel: "local-deterministic-surrogate-evaluator/v1.0",
          inputManifest: {
            candidateCount: 14,
            referenceComplex: "Co-U-Co [10 bonds]",
            screeningCriteria: ["orbital_overlap", "gauge_factor", "cytotoxicity", "environmental_drift"],
            minGaugeFactor: 8.0,
            maxLeachingPpm: 0.1
          },
          codeVersion: "surrogate-screening-solver-v1.4",
          hardwareMetadata: {
            device: "Local Host CPU",
            cores: 8
          },
          rawOutputArtifact: {
            top_candidate_1: "W2(O2CMe)4 / Mo2(O2CMe)4 in COF-606 (Gauge Factor: 14.8, Leaching: 0.00 ppm)",
            top_candidate_2: "HfO2/Zr(IV) cluster polymer (Drift: 0.02%, 10k cycles endurance)",
            actinide_elimination: "100% SUCCESSFUL",
            safety_gate_verdict: "PASS_ALL_GATES"
          },
          timestamp: "2026-08-19 05:35:00 UTC",
          runId: "RUN-DET-20260819-SURR-002",
          uncertaintyAndConvergence: {
            converged: true,
            residualError: 0.0001,
            confidenceBounds: "Full combinatorial sweep across 14 metal-ligand pairs",
            notes: "Deterministic screening matrix."
          },
          inputOutputHash: "SHA256:7a6b5c4d3e2f1a09876543210fedcba9876543210fedcba9876543210fedcba9",
          fallbackOrDegradedMode: "None - Local CPU Deterministic Substrate"
        },
        jemmaValidation: {
          validated: true,
          unitsChecked: true,
          completenessScore: 99,
          evidenceClass: "reconstruction",
          notes: "Surrogate screening matrix validated against toxicity and environmental standards.",
          validatedAt: "2026-08-19 05:36"
        },
        orionAblationChallenge: {
          challenged: true,
          assumptionsAttacked: [
            "Direct equivalence of 5d/4d d-orbitals with 5f/6d actinide orbitals",
            "Uniform ligand coordination without oxidation"
          ],
          counterfactualVulnerability: "d-orbital systems lack f-orbital relativistic contraction; must not claim identical physics, but functional sensory equivalence.",
          stressResult: "Passed: Explicitly maintains distinction between reference physics and screening candidates.",
          passed: true
        },
        operatorPromotionGate: {
          status: "approved",
          promotedAt: "2026-08-19 05:40",
          operatorNotes: "Surrogate screening matrix approved. Candidate W/Mo and Hf/Zr networks authorized for scale 2 and 3 prototyping.",
          admittedToLedger: true
        }
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
      },
      {
        stage: "STORAGE",
        title: "2D COF Molecular Network & Baseline Impedance",
        description: "Hexagonal 2.4nm COF pores maintain ordered W/Mo and Hf/Zr motifs in elastic polymer matrix, storing reference baseline impedance (48.2 kΩ).",
        rateOrVolume: "8.4e13 motifs/cm² · 64 sensor nodes",
        lossOrEfficiency: "Zero drift (<0.02% over 10,000 cycles)"
      },
      {
        stage: "TRANSFORMATION",
        title: "Piezoresistive Transduction & Sensor Fusion",
        description: "Deformation distorts metal-metal orbital overlap, modulating band gap and AC impedance to reconstruct spatial strain wave and blind delamination.",
        rateOrVolume: "Gauge Factor 14.8 · 4,250 m/s wave speed",
        lossOrEfficiency: "45 μs electronic precursor lead time"
      },
      {
        stage: "DISTRIBUTION",
        title: "Wearable Telemetry & Operator Integrity Alerts",
        description: "Outputs real-time damage centroid coordinates (x,y), impact severity classification, internal delamination warnings, and residual health index.",
        rateOrVolume: "1.8 mm spatial accuracy · 12 μs latency",
        lossOrEfficiency: "Residual integrity rating: 0.0 to 1.0"
      }
    ],
    integrityStatus: "STABLE",
    createdAt: "2026-08-18 12:00",
    updatedAt: "2026-08-19 05:45"
  }
];

