import { describe, expect, it } from "vitest";
import { decisionForIntent, generatedDashboardManifest, uiIntents, validateManifest } from "./uiContracts";

describe("UI mode and manifest contracts", () => {
  it("covers the same fixture set with static, declarative, and generated modes", () => {
    expect(new Set(uiIntents.map((intent) => intent.mode))).toEqual(new Set(["static", "declarative", "generated"]));
    expect(decisionForIntent("crm-account-focus")).toMatchObject({ mode: "declarative", expectedRisk: "moderate" });
  });

  it("accepts a closed generated-widget manifest", () => {
    expect(validateManifest(generatedDashboardManifest)).toEqual({ valid: true });
  });

  it("fails closed on missing CSP and provenance metadata", () => {
    const result = validateManifest({ artifactId: "unsafe", intentId: "dashboard-overview", allowedDomains: [], allowedScripts: [], connectTargets: [], dataFields: [] });
    expect(result).toMatchObject({ valid: false });
    if (!result.valid) expect(result.errors).toEqual(expect.arrayContaining(["complete provenance is required", "CSP defaultSrc must fail closed with 'none'"]));
  });

  it("rejects undeclared capabilities through wildcard or network access", () => {
    const result = validateManifest({ ...generatedDashboardManifest, allowedDomains: ["*"], connectTargets: ["https://example.test"] });
    expect(result).toMatchObject({ valid: false });
    if (!result.valid) expect(result.errors).toEqual(expect.arrayContaining(["wildcard domains are not allowed", "V1 generated widgets cannot make network connections"]));
  });
});
