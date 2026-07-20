import { describe, expect, it } from "vitest";
import { isHostWidgetMessage, modelSafeSummary, userRichOutput } from "./messages";
import { generatedDashboardManifest } from "./uiContracts";

describe("host-widget messages and privacy split", () => {
  it("accepts only known message shapes", () => {
    expect(isHostWidgetMessage({ type: "request_tool", tool: "refresh_dashboard" })).toBe(true);
    expect(isHostWidgetMessage({ type: "execute_javascript", source: "alert(1)" })).toBe(false);
  });

  it("keeps rich synthetic metrics out of the model-visible summary", () => {
    expect(userRichOutput(generatedDashboardManifest)).toContain("$240k");
    expect(modelSafeSummary(generatedDashboardManifest)).not.toContain("$240k");
    expect(modelSafeSummary(generatedDashboardManifest)).not.toContain("12 accounts");
  });
});
