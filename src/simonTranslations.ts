// SIMON Operator Interpretation Layer Translation Database
// This module bridges raw machine telemetry data with natural human-operational "So What?" meaning.

export interface SimonTwinTranslation {
  components: Record<string, { title: string; soWhat: string }>;
  relationships: Record<string, { title: string; soWhat: string }>;
  constraints: Record<string, { title: string; soWhat: string }>;
  guidingAnswers?: {
    currentlyKnows?: string[];
    doesNotKnow?: string[];
    mostLikelyNextState?: string;
  };
}

export const SIMON_TRANSLATIONS: Record<string, SimonTwinTranslation> = {
  "termite-colony": {
    components: {
      "term-1": {
        title: "Swarm Collectors",
        soWhat: "These are the field workers harvesting wood cellulose. If state drops, nest reserves will deplete."
      },
      "term-2": {
        title: "Breathing Airway Chimney",
        soWhat: "The main natural air-conditioner. Airflow is cut in half - stale CO2 and heat are accumulating in the inner chambers."
      },
      "term-3": {
        title: "The Queen's Breeding Chamber",
        soWhat: "The genetic reproductive center. Relative humidity must stay high (78%) to protect eggs and pheromone lines."
      },
      "term-4": {
        title: "Subterranean Travel Gallery",
        soWhat: "The moisture-sealed tunnels. Soil moisture (91%) is healthy, keeping the travel network protected from arid drafts."
      },
      "term-5": {
        title: "Starch Emergency Silos",
        soWhat: "Emergency food stockpiles. Buffer is depleted, requiring immediate foraging active supply."
      }
    },
    relationships: {
      "rel-t1": {
        title: "Colony Sustenance Flow",
        soWhat: "Moisture and harvested starch are moving from traveling tunnels into the breeding core."
      },
      "rel-t2": {
        title: "Thermodynamic Vent Stream",
        soWhat: "The cooling exhaust valve dumps heated drafts to protect the Queen. Flow is degraded, spiking inner heat."
      },
      "rel-t3": {
        title: "Harvest Transport Line",
        soWhat: "Active workers are dumping newly gathered starch and fiber from surface swarms into deep tunnels."
      }
    },
    constraints: {
      "ct-1": {
        title: "Reproductive Heat Safety",
        soWhat: "The nest has 0.7°C left before overheating begins. Cooling chimneys must recover to relieve active heat."
      },
      "ct-2": {
        title: "Moisture Incubation Boundary",
        soWhat: "Humidity is near the lowest safe limit. Soil moisture sealers must work to prevent eggs from dehydrating."
      },
      "ct-3": {
        title: "Mound CO2 Exchange Rate",
        soWhat: "Breathing is congested. Nest is actively suffocating due to bio-wall chimney fractures."
      }
    },
    guidingAnswers: {
      currentlyKnows: [
        "The nest and Queen are alive, but the central air-conditioner (ventilation chimney) is congested and dropping.",
        "A critical structural crack under the clay wall is leaking precious metabolic gases."
      ],
      doesNotKnow: [
        "The precise location of the bio-wall crack underneath the outer mud layer.",
        "Whether red fire ant swarms have detected the unsealed ventilation hole."
      ],
      mostLikelyNextState: "The colony will abandon outer forage rings and crowd into deep humid tunnels to survive carbon dioxide buildup."
    }
  },
  "power-grid": {
    components: {
      "pwr-1": {
        title: "Bulk Turbine G-1",
        soWhat: "Primary clean baseline generator. Pumping safe stable hydro-electricity into regional lines."
      },
      "pwr-2": {
        title: "Substation Switch Yard",
        soWhat: "The master control gates. Transforming and routing generator electricity directly to metropolitan areas under high load (92%)."
      },
      "pwr-3": {
        title: "Transmission Transformer Trans-4",
        soWhat: "The terminal bottleneck. Core coils are red-hot (84°C), on the verge of melting and fracturing."
      },
      "pwr-4": {
        title: "Metropolitan Consumer Load",
        soWhat: "The urban demand peak. Massive city usage is pulling heavy power, bringing the transformer close to blowout."
      }
    },
    relationships: {
      "rel-p1": {
        title: "Bulk Power Delivery Line",
        soWhat: "Delivering massive wattage into the city switching yard. Stability is peak."
      },
      "rel-p2": {
        title: "High-Impedance Supply Feed",
        soWhat: "The step-up line is running thin. High electrical friction here is amplifying transformer heat stress."
      },
      "rel-p3": {
        title: "City Distribution Grid",
        soWhat: "Terminal lines delivering power to homes. If this gateway fails, a complete municipal blackout initiates."
      }
    },
    constraints: {
      "cp-1": {
        title: "Grid Pulse Frequency Sync",
        soWhat: "The electrical pulse heartbeat is stable, preventing synchronized machinery and motors from tripping."
      },
      "cp-2": {
        title: "Transformer Insulation Heat",
        soWhat: "The transformer oil is literally cooking. If it rises by 1 more degree, insulation breakdown fires will start."
      },
      "cp-3": {
        title: "Load Carrying Margin",
        soWhat: "Peak demand is barely within limits. The system cannot survive any downstream line short-circuits."
      }
    },
    guidingAnswers: {
      currentlyKnows: [
        "The turbines are spinning perfectly, but the high-voltage step-up transformer is on the literal brink of self-destruction.",
        "Extreme public energy demand is overloading high-power circuit insulation feeds."
      ],
      doesNotKnow: [
        "Whether small internal sparks (micro-arcs) have already burned the paper backing on internal capacitors.",
        "How much sudden power local solar feedback loops will dump into the grid over the next hour."
      ],
      mostLikelyNextState: "The high-voltage circuit breakers will automatically snap open to prevent a massive transformer explosion, initiating a rolling blackout."
    }
  },
  "human-body": {
    components: {
      "bio-1": {
        title: "Neural Autonomic Hub",
        soWhat: "Brain stem pacemaker. Continually sending electrical signals to force heart contractions."
      },
      "bio-2": {
        title: "Alveolar Gas Exchanges",
        soWhat: "The lung surface. Oxygenating blood beautifully (98% saturation), lungs are perfectly healthy."
      },
      "bio-3": {
        title: "Myocardial Ventricle Pump",
        soWhat: "The heart pump. Compressing safely, but fighting high vessel resistance to force blood downward."
      },
      "bio-4": {
        title: "Arterial Transport Tubing",
        soWhat: "Main arterial trunk. High systemic vessel resistance is keeping blood pressure high, stressing delicate organs."
      },
      "bio-5": {
        title: "Kidney Nephron Filters",
        soWhat: "The kidney blood cleaners. Squeezed and starved of fresh blood flow, filtration capacity is down by over 30%."
      }
    },
    relationships: {
      "rel-b1": {
        title: "Ventricular Fluid Inflow",
        soWhat: "Oxygenated output flows out to general systems. Slices show healthy volume but high pressure resistance."
      },
      "rel-b2": {
        title: "Glomerular Inflow Feed",
        soWhat: "Blood delivery lines to kidneys. Stiff, narrowed vessels here are starving kidney cells."
      },
      "rel-b3": {
        title: "Gas Transport Loading",
        soWhat: "Pure oxygen molecules absorbing smoothly from airways into blood cells."
      },
      "rel-b4": {
        title: "Electrical Heart Regulator",
        soWhat: "Continuously pacing ventricular contractions to guarantee cardiac output flow."
      }
    },
    constraints: {
      "cb-1": {
        title: "Fluid Circulation Pressure",
        soWhat: "Blood pressure is high but stable, preventing arterial tearing or circulatory shock."
      },
      "cb-2": {
        title: "Kidney Filtration Flow (GFR)",
        soWhat: "Kidneys are failing to extract waste. Toxins are accumulating inside the patient's bloodstream."
      },
      "cb-3": {
        title: "Cellular Oxygen Levels",
        soWhat: "Brain and tissues are perfectly oxygenated. The respiratory loop is functioning flawlessly."
      }
    },
    guidingAnswers: {
      currentlyKnows: [
        "Cardiopulmonary oxygen loops are robust, but the kidney's entrance vessels have contracted severely, cutting off waste removal.",
        "Systemic vascular strain is accelerating, threatening long-term heart cell health."
      ],
      doesNotKnow: [
        "The exact concentration of inflammatory proteins causing kidney arteriole clamping.",
        "The micro-level cellular damage indexes across deep nephron layers."
      ],
      mostLikelyNextState: "Waste and water retention will trigger full-body swelling and venous blood volume backup, putting critical pressure on the heart."
    }
  },
  "swarm-construction": {
    components: {
      "swm-1": {
        title: "Building Drone Apex-9",
        soWhat: "Precision printer drone. Bending carbon fiber threads under high wind turbulence with tiny margins."
      },
      "swm-2": {
        title: "Polymer Material Feed",
        soWhat: "Liquid carbon-composite spool. Level is ample (92%) ensuring building material doesn't run dry."
      },
      "swm-3": {
        title: "Magnetic Earth Clamps",
        soWhat: "Tension hold baseplates. Gripping the rock bed tightly, preventing the growing bridge from tipping."
      },
      "swm-4": {
        title: "Truss Segment 7 Profile",
        soWhat: "The active bridge section under construction. Wind-shear forces have put this beam under extreme, dangerous shear stress."
      },
      "swm-5": {
        title: "Curing Thermal Laser",
        soWhat: "Instant solidification gun. Curing the soft polymer frame at 198°C directly after extrusion."
      }
    },
    relationships: {
      "rel-s1": {
        title: "Active Carbon Extrusion",
        soWhat: "Drone Apex-9 spraying down carbon resin onto trusses. Wind gusts are disrupting placement accuracy."
      },
      "rel-s2": {
        title: "Liquid Resin Feed Supply",
        soWhat: "Delivering raw stock into printer nozzles. Flow coupling is perfect."
      },
      "rel-s3": {
        title: "Ground Foundation Grounding",
        soWhat: "Baseplates pulling down hard against building weight, preventing leverage snaps."
      }
    },
    constraints: {
      "cs-1": {
        title: "Drone Hover Calibration Deviation",
        soWhat: "Drone is managing to stay in hover positioning lines despite massive gusts."
      },
      "cs-2": {
        title: "Bridge Element Shear Stress",
        soWhat: "Truss is at 98% of its breaking point. Just 2 MPa more and the newly cured carbon structure breaks apart."
      },
      "cs-3": {
        title: "Base Plate Leverage Limit",
        soWhat: "Anchors have massive safety buffer, providing rock-solid foundation holding power."
      }
    },
    guidingAnswers: {
      currentlyKnows: [
        "Anchors and laser systems are operating nominally, but extreme wind gusts are dangerously stressing the active building segment.",
        "Slight building inaccuracies (deviation errors) are propagating up the truss system."
      ],
      doesNotKnow: [
        "The exact location of microscopic structural fractures in the fast-cured carbon fibers.",
        "Whether local thermal drafts will swirl into sudden wind-shear spikes."
      ],
      mostLikelyNextState: "Drone safety system will force an emergency flight retreat, halting construction to prevent total bridge structural failure as wind-shear increases."
    }
  },
  "material-coupling-constructor": {
    components: {
      "mcc-1": {
        title: "Abutment Anchor",
        soWhat: "The left anchor bedded in granite. Sinks compression thrust cleanly."
      },
      "mcc-2": {
        title: "Reinforced Pillar Base",
        soWhat: "The right tower bedrock. Holds cables firmly, tension is high."
      },
      "mcc-3": {
        title: "Composite Isogrid Truss",
        soWhat: "Flexible frame beam. Spreads heavy bridge-deck weight out to baseplates."
      },
      "mcc-4": {
        title: "High-Tensile Cable Stay",
        soWhat: "Suspension support line. Cable stress is optimal, deck is held straight."
      },
      "mcc-5": {
        title: "Deck Plate Composite",
        soWhat: "The crossing deck. Dampens dynamic vehicle loads without deflection risk."
      }
    },
    relationships: {
      "rel-m1": {
        title: "Truss Ground Transfer",
        soWhat: "Isogrid compression forces dumping straight into the massive left granite foundation."
      },
      "rel-m2": {
        title: "Stay Grounding Clamps",
        soWhat: "Kevlar stays pulling tightly against the right pillar base, keeping structural balance."
      },
      "rel-m3": {
        title: "Beam-to-Deck Support",
        soWhat: "Composite beams perfectly supporting the floor deck, eliminating panel flex."
      }
    },
    constraints: {
      "cm-1": {
        title: "Joint Slip Displacement",
        soWhat: "Anchors are locked down solid, showing zero structural slide."
      },
      "cm-2": {
        title: "Deck Structural Sag Limit",
        soWhat: "Beam is straight and strong, zero sagging under dynamic weight levels."
      },
      "cm-3": {
        title: "Lines Stress Threshold",
        soWhat: "Suspension cable has plenty of reserve safety margin to handle moving storms."
      }
    },
    guidingAnswers: {
      currentlyKnows: [
        "The structural anchorages are locked tight in granite, and deck deflection is practically non-existent.",
        "Atmospheric weathering indexes are normal, leaving material properties fully intact."
      ],
      doesNotKnow: [
        "The molecular alignment gaps inside structural connectors under extreme hot/cold spans.",
        "Microscopic resin adhesion levels inside the carbon fiber beams."
      ],
      mostLikelyNextState: "Structural certification complete; structure is fully stabilized."
    }
  }
};

// Generic Translator Fallback Layer
export function translateToSimon(
  type: "component" | "relationship" | "constraint" | "doctrineKnow" | "doctrineNotKnow" | "nextState",
  idOrKey: string,
  rawText: string,
  twinId?: string
): { title: string; soWhat: string } {
  // If we have a hardcoded translation, use it!
  if (twinId && SIMON_TRANSLATIONS[twinId]) {
    const data = SIMON_TRANSLATIONS[twinId];
    if (type === "component" && data.components[idOrKey]) {
      return data.components[idOrKey];
    }
    if (type === "relationship" && data.relationships[idOrKey]) {
      return data.relationships[idOrKey];
    }
    if (type === "constraint" && data.constraints[idOrKey]) {
      return data.constraints[idOrKey];
    }
  }

  // Generative translation rules using smart context decomposition
  const cleanerText = rawText.trim();
  let title = "Operational Meaning";
  let soWhat = cleanerText;

  // Let's clean up general telemetry messages
  if (cleanerText.toLowerCase().includes("p cygni")) {
    title = "Extreme Star Wind Ejection";
    soWhat = "We are observing material moving away from the star at high velocities. Something is actively ejecting matter into space.";
  } else if (cleanerText.toLowerCase().includes("balmer ratio")) {
    title = "High Surrounding Gas Density";
    soWhat = "The surrounding gas is unusually dense. The star is not sitting in empty space; it is embedded inside a thick envelope of material.";
  } else if (cleanerText.toLowerCase().includes("wind velocity")) {
    title = "High-Velocity Outflow";
    soWhat = "This object is shedding material at extreme speed. The mechanism driving the outflow is energetic and ongoing.";
  } else if (cleanerText.toLowerCase().includes("circumstellar envelope")) {
    title = "Symmetrical Gas Shell";
    soWhat = "The star is pushing gas outward. That gas forms the envelope. If wind weakens, the envelope shrinks; if winds strengthen, the envelope expands.";
  } else if (cleanerText.toLowerCase().includes("coupling strength") || cleanerText.toLowerCase().includes("coupling ratio")) {
    title = "System Binding Metric";
    soWhat = "This measures how tightly dependent two systems are. High strength means if one system fails, the other immediately falls with it.";
  } else if (cleanerText.toLowerCase().includes("radiative driving")) {
    title = "Photon Force Pressure";
    soWhat = "Intense starlight is literally pushing gas atoms away from the core, acting as the engine behind the wind outflow.";
  } else if (type === "doctrineKnow") {
    title = "Confirmed Knowledge";
    if (cleanerText.toLowerCase().includes("stable") || cleanerText.toLowerCase().includes("nominal")) {
      soWhat = `Telemetry confirms that core parameters are stable. Vital indicators are safe, freeing operator attention for other risks.`;
    } else {
      soWhat = `We have validated that ${cleanerText.toLowerCase()}. This is a verified fact we can build operational decisions upon.`;
    }
  } else if (type === "doctrineNotKnow") {
    title = "Unresolved Blind spot";
    soWhat = `The telemetry sensors cannot capture ${cleanerText.toLowerCase()}. We need closer observation or auxiliary data to verify this risks.`;
  } else if (type === "nextState") {
    title = "Impending Event Horizon";
    soWhat = `If current trends persist, the system will hit key physical limits and trigger ${cleanerText.toLowerCase()} to prevent damage.`;
  }

  return { title, soWhat };
}
