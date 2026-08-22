# Pathfinder Digital Twin Substrate

> **"Observe before concluding. Explore before constraining. Distinguish possibility from evidence. Simulate before asserting. Govern before committing."**

Pathfinder is a domain-neutral digital-twin substrate for constructing, observing, simulating, validating and evolving physical, operational, historical, and conceptual systems.

---

## Core Epistemic Doctrine

The substrate enforces the strict operational sequence:

$$\text{Agent recommends} \longrightarrow \text{Policy constrains} \longrightarrow \text{Human authorises} \longrightarrow \text{System commits} \longrightarrow \text{Ledger remembers}$$

Pathfinder preserves explicit boundaries between:
- **Recorded Evidence** (`OBSERVED_GEOMETRY`, `MEASURED_STATE`)
- **Sourced Claims** (`EVIDENCE_SUPPORTED_RECONSTRUCTION`)
- **Inference & Computation** (`MODEL_INFERRED_STRUCTURE`, `COMPUTE-GENERATED / PENDING VALIDATION`)
- **Simulations & Heuristics** (`SIMULATED_BEHAVIOUR`, `PROCEDURAL_DEMO`)
- **Operator Approvals & Committed Truth** (`VALIDATED_EVIDENCE`, `COMMITTED SYSTEM STATE`)

Unknown remains unknown. It may generate questions, hypotheses, and simulations, but it is never silently promoted into established fact.

---

## Key Architectural Systems

### 1. Deterministic Kinematic Engine (`src/lib/deterministicKinematics.ts`)
- **Exact Rational Arithmetic**: Uses `BigInt` pairs `[numerator, denominator]` to represent gear ratios and pitch departure losslessly without IEEE-754 precision artifacts.
- **Physical Boundary Evaluation**: Evaluates pitch circle radius displacement $\Delta C = \frac{m \cdot \Delta N}{2}$ against the mechanical arbor limit ($\pm 0.05\text{ mm}$) and calendar phase drift against Metonic dial tolerance ($\pm 1.0\text{ day}$).
- **Standard SHA-256 Digest**: Produces 64-character hex cryptographic hashes for audit receipts.

### 2. NeMo Switchyard Capability Router (`src/lib/nemoSwitchyardRouter.ts`)
- **Capability Routing $\neq$ Authority Routing**: A router determines where reasoning executes; the Sovereign Operator alone determines whether action is authorized.
- **Semantic Tiers**:
  - `TIER_1_EXECUTION`: Task validation, structured JSON parsing, deterministic receipts (`Nemotron-3.5-Lightning-NVFP4-QAD` 3B active MoE target, 74% cost reduction).
  - `TIER_2_DETERMINISTIC`: Exact integer kinematics, PDE solvers, columnar cuDF dataframe sweeps (`GPU_DATAFRAME`, `GPU_VECTOR_SEARCH`, `GPU_PDE`).
  - `TIER_3_FRONTIER_PLANNING`: Frontier cognitive models (`Gemini 3.7 Flash`) for counterfactual hypothesis synthesis and multi-agent coordination.

### 3. AWS Dogwood Policy Engine (`src/lib/dogwoodPolicyEngine.ts`)
- **Temporal Constraint Evaluation**: Evaluates prerequisite event history prior to state promotion.
- **Enforced Prerequisites for Promotion**:
  1. Jemma Dimensional Unit Validation
  2. Orion Counterfactual Ablation Test
  3. Sovereign Operator Gate Signature
- **Static Security Guardrails**: Irreversible blocking of prompt injection patterns and unauthorized scope escalation.

### 4. Attention-Gate Runtime & Dual-Baseline SNR (`src/lib/signalToNoise.ts`)
- **Invariant Floor**: Invariant breaches route unconditionally to `STOP` regardless of system load.
- **Dual Baseline**: Tracks high-frequency operational baseline alongside slow ageing baseline (drift velocity, hysteresis, cumulative deviation).
- **Fundamental Law**: $\text{Adaptive Noise Floor} \neq \text{Adaptive Safety Boundary}$.

### 5. Domain Isolation & Universal Spatial Registry (`src/spatial/SpatialRegistry.ts`)
- Specialized 3D adapters for **Materials Membrane**, **Antikythera Mechanism**, **Termite Bio-Architecture**, **Project SIXES Culinary**, and **COOLed Radiative Cooling**.
- **UnsupportedDomainSpatialAdapter**: Explicitly alerts the Operator when an unregistered domain is loaded, refusing to silently assume another domain's physical model.

---

## Verification & Testing

Run the full invariant test suite:

```bash
npm test
```

### Running the Development Environment

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm start
```
