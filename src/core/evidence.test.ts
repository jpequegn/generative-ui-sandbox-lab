import { describe, expect, it } from "vitest";
import { createPatch } from "./divergence";
import { buildEvidencePacket } from "./evidence";
import { canonicalStem } from "./stem";
import { crmVariants } from "./variants";

describe("divergence evidence packet", () => {
  it("records accepted changes, provenance, benefit, and rollback", () => {
    const patch = crmVariants[1].patches[1];
    const evidence = buildEvidencePacket(canonicalStem, patch);
    expect(evidence).toContain("## Policy result\nAccepted");
    expect(evidence).toContain("Move relationship before company");
    expect(evidence).toContain("rollback --to ae-rename-company");
  });

  it("explains a protected-field rejection", () => {
    const blocked = createPatch({
      patchId: "blocked-legal-hide",
      userId: "fixture-user",
      author: "fixture-agent",
      reason: "Attempted unsafe customization.",
      sourceSignal: "Negative fixture",
      createdAt: "2026-07-20T10:00:00.000Z",
      stemVersion: 1,
      operations: [{ kind: "hide", fieldId: "legalConsent" }],
    });
    expect(buildEvidencePacket(canonicalStem, blocked)).toContain("Rejected: Protected field cannot be changed: legalConsent");
  });
});
