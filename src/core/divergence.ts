import { findStemField, isProtectedField, type CrmStem, type FieldId, type StemField } from "./stem";

export type PatchOperation =
  | { kind: "hide"; fieldId: FieldId }
  | { kind: "rename"; fieldId: FieldId; label: string }
  | { kind: "reorder"; fieldId: FieldId; beforeFieldId: FieldId };

export interface DivergencePatch {
  patchId: string;
  userId: string;
  author: string;
  reason: string;
  sourceSignal: string;
  createdAt: string;
  stemVersion: number;
  rollbackTo?: string;
  operations: readonly PatchOperation[];
}

export type PolicyResult = { allowed: true } | { allowed: false; reason: string };

export interface ReplayResult {
  fields: StemField[];
  acceptedPatchIds: string[];
  rejected: { patchId: string; reason: string }[];
}

export function createPatch(patch: DivergencePatch): Readonly<DivergencePatch> {
  const operations = Object.freeze(patch.operations.map((operation) => Object.freeze({ ...operation })));
  return Object.freeze({ ...patch, operations });
}

export function checkPatchPolicy(stem: CrmStem, patch: DivergencePatch): PolicyResult {
  for (const operation of patch.operations) {
    const target = findStemField(stem, operation.fieldId);
    if (!target) return { allowed: false, reason: `Unknown field: ${operation.fieldId}` };
    if (isProtectedField(stem, operation.fieldId)) return { allowed: false, reason: `Protected field cannot be changed: ${operation.fieldId}` };
    if (operation.kind === "rename" && operation.label.trim().length === 0) return { allowed: false, reason: "Replacement label cannot be empty" };
    if (operation.kind === "reorder") {
      const anchor = findStemField(stem, operation.beforeFieldId);
      if (!anchor) return { allowed: false, reason: `Unknown reorder anchor: ${operation.beforeFieldId}` };
      if (operation.beforeFieldId === operation.fieldId) return { allowed: false, reason: "A field cannot be reordered before itself" };
    }
  }
  return { allowed: true };
}

export function applyPatch(fields: readonly StemField[], patch: DivergencePatch): StemField[] {
  return patch.operations.reduce((current, operation) => {
    if (operation.kind === "hide") return current.filter((field) => field.id !== operation.fieldId);
    if (operation.kind === "rename") return current.map((field) => field.id === operation.fieldId ? { ...field, label: operation.label } : field);

    const moved = current.find((field) => field.id === operation.fieldId);
    const anchorIndex = current.findIndex((field) => field.id === operation.beforeFieldId);
    if (!moved || anchorIndex === -1) return current;
    const withoutMoved = current.filter((field) => field.id !== operation.fieldId);
    const targetIndex = withoutMoved.findIndex((field) => field.id === operation.beforeFieldId);
    return [...withoutMoved.slice(0, targetIndex), moved, ...withoutMoved.slice(targetIndex)];
  }, fields.map((field) => ({ ...field })));
}

export function replayPatches(stem: CrmStem, patches: readonly DivergencePatch[]): ReplayResult {
  return patches.reduce<ReplayResult>((result, patch) => {
    const policy = checkPatchPolicy(stem, patch);
    if (!policy.allowed) {
      result.rejected.push({ patchId: patch.patchId, reason: policy.reason });
      return result;
    }
    result.fields = applyPatch(result.fields, patch);
    result.acceptedPatchIds.push(patch.patchId);
    return result;
  }, { fields: stem.fields.map((field) => ({ ...field })), acceptedPatchIds: [], rejected: [] });
}

export function rollbackPatch(patches: readonly DivergencePatch[], patchId: string): DivergencePatch[] {
  const patchIndex = patches.findIndex((patch) => patch.patchId === patchId);
  if (patchIndex === -1) return [...patches];
  const target = patches[patchIndex];
  if (!target.rollbackTo) return [];
  const rollbackIndex = patches.findIndex((patch) => patch.patchId === target.rollbackTo);
  return rollbackIndex === -1 ? [] : patches.slice(0, rollbackIndex + 1);
}
