import { describe, expect, it } from "vitest";
import { refreshSavedDashboard, saveDashboardWidget, validPipelineQueryResult } from "./dashboard";
import { generatedDashboardManifest } from "./uiContracts";

describe("deterministic dashboard lifecycle", () => {
  it("rejects a dashboard before save when its query result is invalid", () => {
    const result = saveDashboardWidget(generatedDashboardManifest, { accountCount: "twelve", qualifiedPipeline: -1 });
    expect(result).toMatchObject({ saved: false });
    if (!result.saved) expect(result.errors).toContain("Dashboard query result failed validation");
  });

  it("refreshes a saved widget from its stored specification without generation", () => {
    const saved = saveDashboardWidget(generatedDashboardManifest, validPipelineQueryResult);
    expect(saved.saved).toBe(true);
    if (!saved.saved) return;

    expect(refreshSavedDashboard(saved.widget, { accountCount: 14, qualifiedPipeline: 310000 })).toEqual({
      userOutput: "Synthetic pipeline: 14 accounts, $310,000 qualified pipeline.",
      modelOutput: "pipeline-dashboard-fixture-v1 refreshed from its saved pipeline-v1 specification with validated aggregate data.",
    });
  });
});
