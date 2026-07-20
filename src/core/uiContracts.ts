export type UiMode = "static" | "declarative" | "generated";

export interface UiIntent {
  id: "dashboard-overview" | "crm-account-focus" | "review-action-card";
  title: string;
  userNeed: string;
  requestedData: string[];
  mode: UiMode;
}

export interface ModeDecision {
  intentId: UiIntent["id"];
  mode: UiMode;
  expectedRisk: "low" | "moderate" | "high";
  requiredChecks: string[];
  rationale: string;
}

export interface GeneratedUiManifest {
  artifactId: string;
  intentId: UiIntent["id"];
  allowedDomains: string[];
  allowedScripts: string[];
  connectTargets: string[];
  dataFields: string[];
  userVisibleOutput: string;
  modelVisibleOutput: string;
  provenance: { generator: string; generatedAt: string; fixtureVersion: string };
  csp: { defaultSrc: string[]; scriptSrc: string[]; connectSrc: string[]; frameAncestors: string[] };
}

export type ManifestValidation = { valid: true } | { valid: false; errors: string[] };

export const uiIntents: readonly UiIntent[] = Object.freeze([
  { id: "dashboard-overview", title: "Pipeline dashboard", userNeed: "Scan verified account pipeline totals.", requestedData: ["accountCount", "qualifiedPipeline"], mode: "generated" },
  { id: "crm-account-focus", title: "CRM account focus", userNeed: "Prioritize account context in a contact workflow.", requestedData: ["company", "relationship", "role"], mode: "declarative" },
  { id: "review-action-card", title: "Review action card", userNeed: "Review a recorded approval decision.", requestedData: ["decision", "owner", "dueDate"], mode: "static" },
]);

export const modeDecisions: readonly ModeDecision[] = Object.freeze([
  { intentId: "dashboard-overview", mode: "generated", expectedRisk: "high", requiredChecks: ["manifest", "sandbox", "data-validation", "privacy-split"], rationale: "The validated fixture needs a constrained custom visualization." },
  { intentId: "crm-account-focus", mode: "declarative", expectedRisk: "moderate", requiredChecks: ["patch-policy", "provenance", "rollback"], rationale: "The trusted renderer can express field-level divergence safely." },
  { intentId: "review-action-card", mode: "static", expectedRisk: "low", requiredChecks: ["component-catalog"], rationale: "A known review card already satisfies the need." },
]);

export const generatedDashboardManifest: GeneratedUiManifest = Object.freeze({
  artifactId: "pipeline-dashboard-fixture-v1",
  intentId: "dashboard-overview",
  allowedDomains: [],
  allowedScripts: [],
  connectTargets: [],
  dataFields: ["accountCount", "qualifiedPipeline"],
  userVisibleOutput: "Synthetic pipeline: 12 accounts, $240k qualified pipeline.",
  modelVisibleOutput: "Pipeline widget is current and contains validated aggregate metrics.",
  provenance: { generator: "deterministic-fixture", generatedAt: "2026-07-20T10:00:00.000Z", fixtureVersion: "v1" },
  csp: { defaultSrc: ["'none'"], scriptSrc: ["'none'"], connectSrc: ["'none'"], frameAncestors: ["'none'"] },
});

export function decisionForIntent(intentId: UiIntent["id"]): ModeDecision | undefined {
  return modeDecisions.find((decision) => decision.intentId === intentId);
}

export function validateManifest(manifest: Partial<GeneratedUiManifest>): ManifestValidation {
  const errors: string[] = [];
  if (!manifest.artifactId) errors.push("artifactId is required");
  if (!manifest.intentId) errors.push("intentId is required");
  if (!manifest.provenance?.generator || !manifest.provenance.generatedAt || !manifest.provenance.fixtureVersion) errors.push("complete provenance is required");
  if (!manifest.userVisibleOutput || !manifest.modelVisibleOutput) errors.push("separate user and model outputs are required");
  if (!manifest.csp?.defaultSrc?.includes("'none'")) errors.push("CSP defaultSrc must fail closed with 'none'");
  if (!manifest.csp?.scriptSrc || !manifest.csp?.connectSrc || !manifest.csp?.frameAncestors) errors.push("CSP scriptSrc, connectSrc, and frameAncestors are required");
  if (!manifest.allowedDomains || !manifest.allowedScripts || !manifest.connectTargets || !manifest.dataFields) errors.push("resource and data declarations are required");
  if (manifest.allowedDomains?.some((domain) => domain === "*")) errors.push("wildcard domains are not allowed");
  if (manifest.allowedScripts?.length) errors.push("V1 generated widgets cannot load scripts");
  if (manifest.connectTargets?.length) errors.push("V1 generated widgets cannot make network connections");
  return errors.length ? { valid: false, errors } : { valid: true };
}
