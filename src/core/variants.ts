import { createPatch, replayPatches, type DivergencePatch } from "./divergence";
import { canonicalStem } from "./stem";

export interface CrmVariantFixture {
  id: "canonical" | "account-executive" | "customer-success";
  label: string;
  mode: "static" | "declarative";
  summary: string;
  patches: readonly DivergencePatch[];
}

const accountExecutivePatches = [
  createPatch({
    patchId: "ae-rename-company",
    userId: "account-executive",
    author: "fixture-agent",
    reason: "Account teams scan account context before contact details.",
    sourceSignal: "Synthetic CRM workflow intent",
    createdAt: "2026-07-20T10:00:00.000Z",
    stemVersion: 1,
    operations: [{ kind: "rename", fieldId: "company", label: "Account" }],
  }),
  createPatch({
    patchId: "ae-prioritize-relationship",
    userId: "account-executive",
    author: "fixture-agent",
    reason: "Qualification status precedes account qualification review.",
    sourceSignal: "Synthetic CRM workflow intent",
    createdAt: "2026-07-20T10:01:00.000Z",
    stemVersion: 1,
    rollbackTo: "ae-rename-company",
    operations: [{ kind: "reorder", fieldId: "relationship", beforeFieldId: "company" }],
  }),
];

const customerSuccessPatches = [
  createPatch({
    patchId: "cs-hide-phone",
    userId: "customer-success",
    author: "fixture-agent",
    reason: "The support workflow uses verified email as the primary contact path.",
    sourceSignal: "Synthetic support workflow intent",
    createdAt: "2026-07-20T10:02:00.000Z",
    stemVersion: 1,
    operations: [{ kind: "hide", fieldId: "phone" }],
  }),
  createPatch({
    patchId: "cs-rename-relationship",
    userId: "customer-success",
    author: "fixture-agent",
    reason: "Support teams use engagement language for relationship state.",
    sourceSignal: "Synthetic support workflow intent",
    createdAt: "2026-07-20T10:03:00.000Z",
    stemVersion: 1,
    rollbackTo: "cs-hide-phone",
    operations: [{ kind: "rename", fieldId: "relationship", label: "Engagement" }],
  }),
];

export const crmVariants: readonly CrmVariantFixture[] = Object.freeze([
  { id: "canonical", label: "Canonical stem", mode: "static", summary: "Trusted baseline selected from a static component catalog.", patches: [] },
  { id: "account-executive", label: "Account executive", mode: "declarative", summary: "Reorders relationship and renames Company to Account.", patches: accountExecutivePatches },
  { id: "customer-success", label: "Customer success", mode: "declarative", summary: "Hides Phone and renames Relationship to Engagement.", patches: customerSuccessPatches },
]);

export function renderVariant(variant: CrmVariantFixture) {
  return replayPatches(canonicalStem, variant.patches);
}
