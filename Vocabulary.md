# Vocabulary Layer — Digital Twin Glossaries

This document establishes the canonical semantic alignment for the Digital Twin workspace. All machine telemetry is translated to these concepts to protect semantic integrity.

## Core Glossaries (16 Alignment Terms)

### 1. Coupling
- **Meaning:** Functional or structural interdependence between components in a system.
- **Physical Context:** High coupling means structural alterations in one block propagate stresses across adjacent layers. Low coupling reduces cascading structural damage.

### 2. Telemetry
- **Meaning:** Continuously streamed real-world sensory state values over secure data lines.
- **Physical Context:** Collected directly by Hermes (the evidence field) from sensor arrays without introducing bias or validation filters.

### 3. Provenance
- **Meaning:** Verifiable lineage, history, and computational path of calculations.
- **Physical Context:** Prevents silent simulated fallbacks. Provenance records track exact telemetry timestamps, active server authorities, and solver latency figures.

### 4. Doctrine
- **Meaning:** High-level rules, core equations, and guiding philosophy governing the virtual duplicate's operations.
- **Physical Context:** Aligns the virtual status to real-world physical boundaries. Doctrine answers "What does the model know?" and "What does it not know?"

### 5. Drift
- **Meaning:** The progressive divergence or mismatch between the virtual twin and the real physical system.
- **Physical Context:** Quantified as the coordinate discrepancy index. Calibration loops and alignment updates are triggered to zero out drift.

### 6. Aperture
- **Meaning:** A selective field of observation through which specific geometry is focused.
- **Physical Context:** Channels raw atmospheric noise into dedicated variable subsets so that operators are not visually overwhelmed.

### 7. Twin
- **Meaning:** The real-time virtual state representation of a real-world system or material object.
- **Physical Context:** Not a stale database, but an interactive, superposed space where state, limits, relationships, and meaning coexist simultaneously.

### 8. Substrate
- **Meaning:** The underlying physical mass, matter, or medium of a system's components.
- **Physical Context:** Specific concrete grades, reinforcement alloys, carbon fiber, or graphene layers modeled dynamically with distinct fracture points.

### 9. Signal
- **Meaning:** A clean telemetry stream containing physical evidence and verifiable sensor values.
- **Physical Context:** Captured at the edge, smoothed by RAPIDS, and delivered directly to the physical state ledger.

### 10. State
- **Meaning:** The virtual coordinate, numeric values, and parameters of the system at time *t*.
- **Physical Context:** Rendered inside circular geometries on screen to answer "What is currently happening in the physical system?"

### 11. Topology
- **Meaning:** The geometric configuration and organizational map of a system's structural connections.
- **Physical Context:** Models joints as serial chains, parallel meshes, or hub-and-spoke star structures to calculate stress propagation.

### 12. Observer
- **Meaning:** The sovereign human authority in the workspace (the Operator).
- **Physical Context:** Holds exclusive decision clearance. Machine computations collapse into meaning at the Operator interface.

### 13. Constraint
- **Meaning:** Intrinsically bound physical, material, environmental, or temporal limits.
- **Physical Context:** Monitored strictly by Jemma. Prevents fantasy modeling by blocking any coordinate update that breaches physical reality bounds.

### 14. Evidence
- **Meaning:** Raw facts, measurements, verified sources, and real-time sensory ground truths.
- **Physical Context:** Formatted into immutable observation registries. All inferences must anchor to active Evidence records.

### 15. Inference
- **Meaning:** Extrapolated calculations, predictions, or solvers computed via authorized compute authority layers.
- **Physical Context:** Computes material wear-and-tear, deformation risks, and future stability forecasts.

### 16. Authority
- **Meaning:** A validated external compute endpoint responsible for specific math solvers or inferences.
- **Physical Context:** If external servers are unresponsive, the system enforces a safety shutdown, reporting `COMPUTE_UNAVAILABLE` rather than simulating.
