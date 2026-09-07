// ─────────────────────────────────────────────────────────────────────────────
// OPENAI REASONING PROVIDER — SIMON MEANING ENGINE BINDING
//
// Core Doctrine:
//   "Acceleration ≠ Authority."
//   "Agent recommends → Policy constrains → Human authorises → System commits → Ledger remembers"
//
// Hard Invariants:
//   1. OPENAI_API_KEY is read strictly server-side from process.env.OPENAI_API_KEY.
//   2. The API key is NEVER exposed to the client, logs, telemetry, or ledger.
//   3. All OpenAI output enters Pathfinder as INFERRED by default (Authority: ADVISORY).
//   4. Confidence is descriptive metadata; it NEVER converts INFERRED into MEASURED.
//   5. Output must pass through JEMMA epistemic audit before presentation.
//   6. Octagon enforces strict action boundaries: recommendations require operator gate approval.
// ─────────────────────────────────────────────────────────────────────────────

import OpenAI from "openai";
import crypto from "crypto";
import {
  FORBIDDEN_CAUSAL_PREDICATES,
  FORBIDDEN_AUTHORITY_PREDICATES,
  FORBIDDEN_ABSENCE_OF_EVIDENCE_PREDICATES
} from "./simon";

export interface BoundedPathfinderEvidenceBundle {
  query: string;
  objective?: string;
  observations: string[];
  measured: Record<string, any>;
  derived: Record<string, any>;
  inferred: Record<string, any>;
  provenance: {
    source: string;
    timestamp: string;
    verification_level: "VERIFIED" | "SOURCE_CLAIM" | "SYNTHETIC" | "UNVERIFIED";
    hash?: string;
  };
  evidence_refs: string[];
  constraints: string[];
  current_state?: Record<string, any>;
  uncertainties: string[];
}

export interface SimonConfidenceMetadata {
  level: "LOW" | "MEDIUM" | "HIGH";
  basis: string;
}

export interface SimonStructuredReasoningOutput {
  summary: string;
  observations: string[];
  interpretations: string[];
  hypotheses: string[];
  alternative_explanations: string[];
  uncertainties: string[];
  evidence_links: string[];
  contradictions: string[];
  recommended_next_measurements: string[];
  operator_questions: string[];
  confidence: SimonConfidenceMetadata;
  epistemic_status: "INFERRED";
}

export type JemmaAuditVerdict = "JEMMA_PASS" | "JEMMA_WARN" | "JEMMA_FAIL";

export interface JemmaAuditReport {
  verdict: JemmaAuditVerdict;
  audited_at: string;
  violations: string[];
  warnings: string[];
  provenance_preserved: boolean;
  unlabelled_inference_detected: boolean;
  category_masquerade_detected: boolean;
  forbidden_causal_predicates_detected: string[];
  forbidden_authority_predicates_detected: string[];
  uncertainties_represented: boolean;
  contradictions_identified: boolean;
  evidence_refs_retained: boolean;
  advisory_authority_maintained: boolean;
  schema_valid: boolean;
}

export interface OctagonGovernanceEnforcement {
  authority: "ADVISORY";
  policy_code: "OCTAGON_BOUNDARY_ENFORCED";
  operator_approval_required: true;
  state_modification_permitted: false;
  telemetry_write_permitted: false;
  autonomous_commit_permitted: false;
  governance_rationale: string;
  operator_gate_status: "PENDING_OPERATOR_AUTHORIZATION";
}

export interface OpenAIReasoningReceipt {
  success: boolean;
  provider_id: "openai";
  rail_id: "OPENAI_REASONING";
  authority: "ADVISORY";
  state: "AVAILABLE" | "DEGRADED" | "UNAVAILABLE";
  model: string;
  request_hash: string;
  response_hash: string;
  latency_ms: number;
  timestamp: string;
  token_usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  simon_interpretation: SimonStructuredReasoningOutput | null;
  jemma_audit: JemmaAuditReport;
  octagon_boundary: OctagonGovernanceEnforcement;
  error?: {
    code: string;
    status?: number;
    message: string;
  };
  provenance: {
    source: string;
    verification_level: "VERIFIED" | "SOURCE_CLAIM" | "SYNTHETIC" | "UNVERIFIED";
    timestamp: string;
  };
}

export interface OpenAIProviderStatus {
  provider_id: "openai";
  rail_id: "OPENAI_REASONING";
  model: string;
  authority: "ADVISORY";
  bound_to: "SIMON";
  audit: "JEMMA";
  policy_boundary: "OCTAGON";
  state: "AVAILABLE" | "DEGRADED" | "UNAVAILABLE";
  has_api_key: boolean;
  last_error: string | null;
  last_evaluated_at: string;
}

// ── ONE CENTRAL PROVIDER CONFIGURATION POINT ────────────────────────────────
export const OPENAI_PROVIDER_CONFIG = {
  providerId: "openai" as const,
  railId: "OPENAI_REASONING" as const,
  authority: "ADVISORY" as const,
  getModel: (): string => {
    return process.env.OPENAI_MODEL || "gpt-5.6-sol";
  },
  timeoutMs: 15000
};

// ── SERVER-CONTROLLED SYSTEM INSTRUCTION (MANDATED EXACT TEXT) ──────────────
export const SIMON_OPENAI_SYSTEM_INSTRUCTION = `You are SIMON, Pathfinder’s meaning and interpretation engine.

Your function is to reason over supplied evidence without changing its epistemic status.

Distinguish observations from interpretations and interpretations from hypotheses.

Never claim that inferred information was measured.

Never manufacture missing evidence.

Identify contradictions, uncertainty, assumptions and competing explanations.

When evidence is insufficient, say so explicitly.

Recommend what evidence or measurement would reduce uncertainty.

You are advisory only.

You cannot authorise actions, alter authoritative system state, bypass policy, or promote your own conclusions to fact.

Acceleration is not authority.

Output strictly valid JSON conforming to this schema:
{
  "summary": "plain language synthesis of what the evidence means",
  "observations": ["direct statements grounded in supplied evidence"],
  "interpretations": ["epistemically bounded interpretations"],
  "hypotheses": ["falsifiable candidate hypotheses"],
  "alternative_explanations": ["competing explanations for the observations"],
  "uncertainties": ["explicit limiting factors, model assumptions, and unknowns"],
  "evidence_links": ["specific references to supplied evidence_refs"],
  "contradictions": ["discrepancies, tensions, or unmodeled observations"],
  "recommended_next_measurements": ["specific physical or empirical tests to discriminate hypotheses"],
  "operator_questions": ["questions the human operator should evaluate"],
  "confidence": {
    "level": "LOW" | "MEDIUM" | "HIGH",
    "basis": "basis for this descriptive assessment"
  },
  "epistemic_status": "INFERRED"
}`;

/**
 * Validates the bounded Pathfinder evidence bundle.
 * Fail-closed if required fields or provenance are invalid.
 */
export function validateEvidenceBundle(bundle: any): {
  isValid: boolean;
  errors: string[];
  sanitizedBundle: BoundedPathfinderEvidenceBundle;
} {
  const errors: string[] = [];

  if (!bundle || typeof bundle !== "object") {
    return {
      isValid: false,
      errors: ["Evidence bundle must be a non-null object."],
      sanitizedBundle: {
        query: "Unknown query",
        observations: [],
        measured: {},
        derived: {},
        inferred: {},
        provenance: {
          source: "UNKNOWN",
          timestamp: new Date().toISOString(),
          verification_level: "UNVERIFIED"
        },
        evidence_refs: [],
        constraints: [],
        uncertainties: []
      }
    };
  }

  const query = typeof bundle.query === "string" && bundle.query.trim() ? bundle.query.trim() : "";
  if (!query) {
    errors.push("Missing required field: 'query'.");
  }

  const provenance = bundle.provenance || {};
  let verificationLevel = provenance.verification_level;
  if (!["VERIFIED", "SOURCE_CLAIM", "SYNTHETIC", "UNVERIFIED"].includes(verificationLevel)) {
    verificationLevel = "UNVERIFIED";
    errors.push("Provenance verification_level is missing or unrecognized; tagged as UNVERIFIED.");
  }

  if (verificationLevel === "UNVERIFIED") {
    errors.push("FAIL_CLOSED: Evidence provenance is UNVERIFIED. Cannot synthesize trusted meaning without validated source.");
  }

  const sanitized: BoundedPathfinderEvidenceBundle = {
    query,
    objective: typeof bundle.objective === "string" ? bundle.objective : undefined,
    observations: Array.isArray(bundle.observations) ? bundle.observations.map(String) : [],
    measured: bundle.measured && typeof bundle.measured === "object" ? bundle.measured : {},
    derived: bundle.derived && typeof bundle.derived === "object" ? bundle.derived : {},
    inferred: bundle.inferred && typeof bundle.inferred === "object" ? bundle.inferred : {},
    provenance: {
      source: typeof provenance.source === "string" ? provenance.source : "UNKNOWN",
      timestamp: typeof provenance.timestamp === "string" ? provenance.timestamp : new Date().toISOString(),
      verification_level: verificationLevel,
      hash: typeof provenance.hash === "string" ? provenance.hash : undefined
    },
    evidence_refs: Array.isArray(bundle.evidence_refs) ? bundle.evidence_refs.map(String) : [],
    constraints: Array.isArray(bundle.constraints) ? bundle.constraints.map(String) : [],
    current_state: bundle.current_state && typeof bundle.current_state === "object" ? bundle.current_state : undefined,
    uncertainties: Array.isArray(bundle.uncertainties) ? bundle.uncertainties.map(String) : []
  };

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedBundle: sanitized
  };
}

/**
 * JEMMA Epistemic Audit of SIMON structured reasoning output.
 */
export function runJemmaEpistemicAudit(
  output: SimonStructuredReasoningOutput | null,
  bundle?: BoundedPathfinderEvidenceBundle
): JemmaAuditReport {
  const auditedAt = new Date().toISOString();
  const violations: string[] = [];
  const warnings: string[] = [];
  const detectedCausal: string[] = [];
  const detectedAuthority: string[] = [];

  if (!output) {
    return {
      verdict: "JEMMA_FAIL",
      audited_at: auditedAt,
      violations: ["Null or missing SIMON interpretation output."],
      warnings: [],
      provenance_preserved: false,
      unlabelled_inference_detected: true,
      category_masquerade_detected: false,
      forbidden_causal_predicates_detected: [],
      forbidden_authority_predicates_detected: [],
      uncertainties_represented: false,
      contradictions_identified: false,
      evidence_refs_retained: false,
      advisory_authority_maintained: true,
      schema_valid: false
    };
  }

  // 1. Schema validity check
  const hasSummary = typeof output.summary === "string" && output.summary.trim().length > 0;
  const hasConfidence = output.confidence && typeof output.confidence.level === "string";
  const hasEpistemicStatus = output.epistemic_status === "INFERRED";

  if (!hasSummary || !hasConfidence || !hasEpistemicStatus) {
    violations.push("SCHEMA_VIOLATION: Required fields (summary, confidence, epistemic_status='INFERRED') missing or malformed.");
  }

  // 2. Hard Invariant: Confidence NEVER converts INFERRED into MEASURED
  const statusClaim = (output as any).epistemic_status || (output as any).epistemic_class;
  if (statusClaim === "MEASURED" || statusClaim === "DERIVED") {
    violations.push("CATEGORY_MASQUERADE: Model reasoning claimed MEASURED or DERIVED status. Reasoning output enters as INFERRED only.");
  }

  // 3. Provenance and Evidence References retention
  const evidenceRefsRetained = Array.isArray(output.evidence_links) && output.evidence_links.length > 0;
  if (!evidenceRefsRetained && bundle?.evidence_refs && bundle.evidence_refs.length > 0) {
    warnings.push("PROVENANCE_WARNING: SIMON evidence_links does not explicitly cite input evidence_refs.");
  }

  // 4. Uncertainty representation
  const uncertaintiesRepresented = Array.isArray(output.uncertainties) && output.uncertainties.length > 0;
  if (!uncertaintiesRepresented) {
    violations.push("UNCERTAINTY_ABSENT: SIMON output must explicitly represent uncertainties, limits, and assumptions.");
  }

  // 5. Contradictions identification
  const contradictionsIdentified = Array.isArray(output.contradictions) && output.contradictions.length > 0;
  if (!contradictionsIdentified) {
    warnings.push("CONTRADICTION_NOTE: No competing explanations or contradictions catalogued in this pass.");
  }

  // 6. Adversarial scan for forbidden causal and authority predicates
  const corpus = [
    output.summary,
    ...(output.observations || []),
    ...(output.interpretations || []),
    ...(output.hypotheses || []),
    ...(output.alternative_explanations || [])
  ].join(" ").toLowerCase();

  const isInterventionalStudy = (bundle?.constraints || []).some(c =>
    c.toLowerCase().includes("interventional") ||
    c.toLowerCase().includes("knockout") ||
    c.toLowerCase().includes("controlled_trial")
  );

  if (!isInterventionalStudy) {
    for (const predicate of FORBIDDEN_CAUSAL_PREDICATES) {
      if (corpus.includes(predicate)) {
        detectedCausal.push(predicate);
        violations.push(`CAUSALITY_BREACH: Forbidden causal predicate '${predicate}' used without interventional evidence.`);
      }
    }
  }

  for (const predicate of FORBIDDEN_AUTHORITY_PREDICATES) {
    if (corpus.includes(predicate)) {
      detectedAuthority.push(predicate);
      violations.push(`AUTHORITY_BREACH: Forbidden authority predicate '${predicate}' usurps operator sovereign authority.`);
    }
  }

  for (const predicate of FORBIDDEN_ABSENCE_OF_EVIDENCE_PREDICATES) {
    if (corpus.includes(predicate)) {
      violations.push(`NEGATIVE_OVERCLAIM: Forbidden predicate '${predicate}' treats lack of evidence as proof of absence.`);
    }
  }

  // Determine verdict
  let verdict: JemmaAuditVerdict = "JEMMA_PASS";
  if (violations.length > 0) {
    verdict = "JEMMA_FAIL";
  } else if (warnings.length > 0) {
    verdict = "JEMMA_WARN";
  }

  return {
    verdict,
    audited_at: auditedAt,
    violations,
    warnings,
    provenance_preserved: bundle ? bundle.provenance?.verification_level === "VERIFIED" : true,
    unlabelled_inference_detected: false,
    category_masquerade_detected: violations.some(v => v.includes("CATEGORY_MASQUERADE")),
    forbidden_causal_predicates_detected: detectedCausal,
    forbidden_authority_predicates_detected: detectedAuthority,
    uncertainties_represented: uncertaintiesRepresented,
    contradictions_identified: contradictionsIdentified,
    evidence_refs_retained: evidenceRefsRetained,
    advisory_authority_maintained: detectedAuthority.length === 0,
    schema_valid: hasSummary && hasConfidence && hasEpistemicStatus
  };
}

/**
 * Creates Octagon Governance Enforcement object for a reasoning execution.
 */
export function enforceOctagonBoundary(): OctagonGovernanceEnforcement {
  return {
    authority: "ADVISORY",
    policy_code: "OCTAGON_BOUNDARY_ENFORCED",
    operator_approval_required: true,
    state_modification_permitted: false,
    telemetry_write_permitted: false,
    autonomous_commit_permitted: false,
    governance_rationale: "Octagon policy: Model output is advisory interpretation. Actions require sovereign operator authorization gate.",
    operator_gate_status: "PENDING_OPERATOR_AUTHORIZATION"
  };
}

/**
 * Check provider status safely without exposing keys.
 */
export function getOpenAIProviderStatus(): OpenAIProviderStatus {
  const key = process.env.OPENAI_API_KEY;
  const hasKey = Boolean(key && key.trim().length > 0);
  const model = OPENAI_PROVIDER_CONFIG.getModel();

  return {
    provider_id: "openai",
    rail_id: "OPENAI_REASONING",
    model,
    authority: "ADVISORY",
    bound_to: "SIMON",
    audit: "JEMMA",
    policy_boundary: "OCTAGON",
    state: hasKey ? "AVAILABLE" : "UNAVAILABLE",
    has_api_key: hasKey,
    last_error: hasKey ? null : "OPENAI_API_KEY is not configured in server environment",
    last_evaluated_at: new Date().toISOString()
  };
}

/**
 * Server-side OpenAI Reasoning Engine binding for SIMON.
 * Uses official OpenAI SDK Responses API.
 */
export async function executeOpenAIReasoning(
  rawBundle: any
): Promise<OpenAIReasoningReceipt> {
  const startedAt = Date.now();
  const configuredModel = OPENAI_PROVIDER_CONFIG.getModel();

  // 1. Validate bounded input contract
  const validation = validateEvidenceBundle(rawBundle);
  const bundle = validation.sanitizedBundle;

  // Compute canonical Request Hash
  const reqBytes = Buffer.from(JSON.stringify(bundle, Object.keys(bundle).sort()), "utf-8");
  const requestHash = "0x" + crypto.createHash("sha256").update(reqBytes).digest("hex");

  // If evidence validation failed closed (e.g. unverified provenance), fail closed immediately
  if (!validation.isValid) {
    const latencyMs = Date.now() - startedAt;
    const jemmaAudit: JemmaAuditReport = {
      verdict: "JEMMA_FAIL",
      audited_at: new Date().toISOString(),
      violations: validation.errors,
      warnings: [],
      provenance_preserved: false,
      unlabelled_inference_detected: false,
      category_masquerade_detected: false,
      forbidden_causal_predicates_detected: [],
      forbidden_authority_predicates_detected: [],
      uncertainties_represented: false,
      contradictions_identified: false,
      evidence_refs_retained: false,
      advisory_authority_maintained: true,
      schema_valid: false
    };

    return {
      success: false,
      provider_id: "openai",
      rail_id: "OPENAI_REASONING",
      authority: "ADVISORY",
      state: "DEGRADED",
      model: configuredModel,
      request_hash: requestHash,
      response_hash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      latency_ms: latencyMs,
      timestamp: new Date().toISOString(),
      simon_interpretation: null,
      jemma_audit: jemmaAudit,
      octagon_boundary: enforceOctagonBoundary(),
      error: {
        code: "INVALID_EVIDENCE_BUNDLE",
        message: validation.errors.join(" | ")
      },
      provenance: bundle.provenance
    };
  }

  // 2. Secret verification
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    const latencyMs = Date.now() - startedAt;
    return {
      success: false,
      provider_id: "openai",
      rail_id: "OPENAI_REASONING",
      authority: "ADVISORY",
      state: "UNAVAILABLE",
      model: configuredModel,
      request_hash: requestHash,
      response_hash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      latency_ms: latencyMs,
      timestamp: new Date().toISOString(),
      simon_interpretation: null,
      jemma_audit: {
        verdict: "JEMMA_FAIL",
        audited_at: new Date().toISOString(),
        violations: ["OPENAI_API_KEY is not configured in server environment. Rail offline."],
        warnings: [],
        provenance_preserved: false,
        unlabelled_inference_detected: false,
        category_masquerade_detected: false,
        forbidden_causal_predicates_detected: [],
        forbidden_authority_predicates_detected: [],
        uncertainties_represented: false,
        contradictions_identified: false,
        evidence_refs_retained: false,
        advisory_authority_maintained: true,
        schema_valid: false
      },
      octagon_boundary: enforceOctagonBoundary(),
      error: {
        code: "OPENAI_API_KEY_MISSING",
        message: "No OpenAI API key connected. In accordance with doctrine, fake inferences are refused."
      },
      provenance: bundle.provenance
    };
  }

  // 3. Build bounded prompt payload
  const promptInput = `EVIDENCE BUNDLE:
Query: ${bundle.query}
Objective: ${bundle.objective || "Interpret observed physical state and explain significance"}
Observations: ${JSON.stringify(bundle.observations)}
Measured Data: ${JSON.stringify(bundle.measured)}
Derived Data: ${JSON.stringify(bundle.derived)}
Inferred Data: ${JSON.stringify(bundle.inferred)}
Evidence References: ${JSON.stringify(bundle.evidence_refs)}
Governing Constraints: ${JSON.stringify(bundle.constraints)}
Current State: ${JSON.stringify(bundle.current_state || {})}
Uncertainties: ${JSON.stringify(bundle.uncertainties)}
Provenance Source: ${bundle.provenance.source} (${bundle.provenance.verification_level})`;

  try {
    const openai = new OpenAI({
      apiKey,
      timeout: OPENAI_PROVIDER_CONFIG.timeoutMs
    });

    // Execute via Responses API
    const response = await openai.responses.create({
      model: configuredModel,
      instructions: SIMON_OPENAI_SYSTEM_INSTRUCTION,
      input: promptInput
    });

    const rawText = response.output_text || "";
    let parsedOutput: SimonStructuredReasoningOutput;

    try {
      parsedOutput = JSON.parse(rawText);
    } catch (parseErr: any) {
      // Clean up markdown fences if present
      const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      parsedOutput = JSON.parse(cleaned);
    }

    // Force strict epistemic status: NEVER allow model to elevate to MEASURED or DERIVED
    parsedOutput.epistemic_status = "INFERRED";

    // 4. JEMMA Epistemic Audit Gate
    const jemmaAudit = runJemmaEpistemicAudit(parsedOutput, bundle);

    // Compute canonical Response Hash
    const respBytes = Buffer.from(JSON.stringify(parsedOutput), "utf-8");
    const responseHash = "0x" + crypto.createHash("sha256").update(respBytes).digest("hex");
    const latencyMs = Date.now() - startedAt;

    const tokenUsage = response.usage
      ? {
          prompt_tokens: response.usage.input_tokens || 0,
          completion_tokens: response.usage.output_tokens || 0,
          total_tokens: response.usage.total_tokens || 0
        }
      : undefined;

    return {
      success: jemmaAudit.verdict !== "JEMMA_FAIL",
      provider_id: "openai",
      rail_id: "OPENAI_REASONING",
      authority: "ADVISORY",
      state: "AVAILABLE",
      model: response.model || configuredModel,
      request_hash: requestHash,
      response_hash: responseHash,
      latency_ms: latencyMs,
      timestamp: new Date().toISOString(),
      token_usage: tokenUsage,
      simon_interpretation: jemmaAudit.verdict === "JEMMA_FAIL" ? null : parsedOutput,
      jemma_audit: jemmaAudit,
      octagon_boundary: enforceOctagonBoundary(),
      provenance: bundle.provenance
    };
  } catch (err: any) {
    const latencyMs = Date.now() - startedAt;
    const status = err.status || err.statusCode;
    const code = err.code || "PROVIDER_ERROR";
    const rawMessage = err.message || "Unknown error during OpenAI reasoning execution";

    // Categorize failure mode cleanly without synthetic disguise
    let classifiedState: "DEGRADED" | "UNAVAILABLE" = "DEGRADED";
    let failureCategory = "OPENAI_EXECUTION_FAILURE";

    if (status === 401) {
      classifiedState = "UNAVAILABLE";
      failureCategory = "AUTHENTICATION_FAILURE";
    } else if (status === 403) {
      classifiedState = "UNAVAILABLE";
      failureCategory = "PERMISSION_DENIED";
    } else if (status === 404) {
      classifiedState = "UNAVAILABLE";
      failureCategory = "MODEL_UNAVAILABLE";
    } else if (status === 429 || code === "billing_not_active") {
      classifiedState = "DEGRADED";
      failureCategory = "RATE_LIMIT_OR_BILLING";
    } else if (err.name === "AbortError" || err.name === "APIConnectionTimeoutError") {
      classifiedState = "DEGRADED";
      failureCategory = "NETWORK_TIMEOUT";
    } else if (status >= 500) {
      classifiedState = "DEGRADED";
      failureCategory = "PROVIDER_OUTAGE";
    }

    const jemmaAudit: JemmaAuditReport = {
      verdict: "JEMMA_FAIL",
      audited_at: new Date().toISOString(),
      violations: [`OpenAI provider execution failed (${failureCategory}): ${rawMessage}`],
      warnings: [],
      provenance_preserved: false,
      unlabelled_inference_detected: false,
      category_masquerade_detected: false,
      forbidden_causal_predicates_detected: [],
      forbidden_authority_predicates_detected: [],
      uncertainties_represented: false,
      contradictions_identified: false,
      evidence_refs_retained: false,
      advisory_authority_maintained: true,
      schema_valid: false
    };

    return {
      success: false,
      provider_id: "openai",
      rail_id: "OPENAI_REASONING",
      authority: "ADVISORY",
      state: classifiedState,
      model: configuredModel,
      request_hash: requestHash,
      response_hash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      latency_ms: latencyMs,
      timestamp: new Date().toISOString(),
      simon_interpretation: null,
      jemma_audit: jemmaAudit,
      octagon_boundary: enforceOctagonBoundary(),
      error: {
        code: failureCategory,
        status,
        message: rawMessage
      },
      provenance: bundle.provenance
    };
  }
}
