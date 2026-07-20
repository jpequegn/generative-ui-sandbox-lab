import { describe, expect, it } from "vitest";
import { applyPatch, checkPatchPolicy, createPatch, replayPatches, rollbackPatch, type DivergencePatch } from "./divergence";
import { canonicalStem } from "./stem";

function patch(overrides: Partial<DivergencePatch> = {}): DivergencePatch {
  return {
    patchId: "patch-1",
    userId: "account-executive",
    author: "fixture-agent",
    reason: "Prioritize account context.",
    sourceSignal: "CRM workflow fixture",
    createdAt: "2026-07-20T10:00:00.000Z",
    stemVersion: 1,
    operations: [{ kind: "rename", fieldId: "company", label: "Account" }],
    ...overrides,
  };
}

describe("divergence patches", () => {
  it("applies an allowed patch without mutating the canonical stem", () => {
    const accepted = patch();
    expect(checkPatchPolicy(canonicalStem, accepted)).toEqual({ allowed: true });

    const fields = applyPatch(canonicalStem.fields, accepted);
    expect(fields.find((field) => field.id === "company")?.label).toBe("Account");
    expect(canonicalStem.fields.find((field) => field.id === "company")?.label).toBe("Company");
  });

  it("blocks a patch that targets a protected field", () => {
    const blocked = patch({ operations: [{ kind: "hide", fieldId: "legalConsent" }] });
    expect(checkPatchPolicy(canonicalStem, blocked)).toEqual({ allowed: false, reason: "Protected field cannot be changed: legalConsent" });
  });

  it("freezes provenance and nested operations", () => {
    const frozen = createPatch(patch());
    expect(Object.isFrozen(frozen)).toBe(true);
    expect(Object.isFrozen(frozen.operations)).toBe(true);
    expect(Object.isFrozen(frozen.operations[0])).toBe(true);
  });

  it("replays allowed patches on a newer compatible stem", () => {
    const newerStem = { ...canonicalStem, version: 2 };
    const replay = replayPatches(newerStem, [patch()]);
    expect(replay.acceptedPatchIds).toEqual(["patch-1"]);
    expect(replay.fields.find((field) => field.id === "company")?.label).toBe("Account");
  });

  it("rolls a later patch back to the exact prior variant", () => {
    const first = patch({ patchId: "patch-1" });
    const second = patch({ patchId: "patch-2", rollbackTo: "patch-1", operations: [{ kind: "hide", fieldId: "phone" }] });
    const beforeRollback = replayPatches(canonicalStem, [first, second]).fields;
    const afterRollback = replayPatches(canonicalStem, rollbackPatch([first, second], "patch-2")).fields;

    expect(beforeRollback.some((field) => field.id === "phone")).toBe(false);
    expect(afterRollback).toEqual(replayPatches(canonicalStem, [first]).fields);
  });
});
