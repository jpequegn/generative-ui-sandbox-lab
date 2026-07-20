import { validateManifest, type GeneratedUiManifest } from "./uiContracts";

export interface PipelineQueryResult {
  accountCount: number;
  qualifiedPipeline: number;
}

export interface SavedDashboardWidget {
  artifactId: string;
  template: "pipeline-v1";
  manifest: GeneratedUiManifest;
  savedAt: string;
}

export type SaveDashboardResult = { saved: true; widget: SavedDashboardWidget } | { saved: false; errors: string[] };

export const validPipelineQueryResult: PipelineQueryResult = { accountCount: 12, qualifiedPipeline: 240000 };

export function validatePipelineQueryResult(value: unknown): value is PipelineQueryResult {
  if (!value || typeof value !== "object") return false;
  const result = value as Partial<PipelineQueryResult>;
  return (
    typeof result.accountCount === "number" &&
    typeof result.qualifiedPipeline === "number" &&
    Number.isInteger(result.accountCount) &&
    Number.isFinite(result.qualifiedPipeline) &&
    result.accountCount >= 0 &&
    result.qualifiedPipeline >= 0
  );
}

export function saveDashboardWidget(manifest: GeneratedUiManifest, data: unknown, savedAt = "2026-07-20T10:00:00.000Z"): SaveDashboardResult {
  const manifestResult = validateManifest(manifest);
  const errors = !manifestResult.valid ? [...manifestResult.errors] : [];
  if (!validatePipelineQueryResult(data)) errors.push("Dashboard query result failed validation");
  if (errors.length) return { saved: false, errors };
  return { saved: true, widget: { artifactId: manifest.artifactId, template: "pipeline-v1", manifest, savedAt } };
}

export function refreshSavedDashboard(widget: SavedDashboardWidget, data: unknown): { userOutput: string; modelOutput: string } {
  if (!validatePipelineQueryResult(data)) throw new Error("Dashboard query result failed validation");
  const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(data.qualifiedPipeline);
  return {
    userOutput: `Synthetic pipeline: ${data.accountCount} accounts, ${currency} qualified pipeline.`,
    modelOutput: `${widget.artifactId} refreshed from its saved ${widget.template} specification with validated aggregate data.`,
  };
}
