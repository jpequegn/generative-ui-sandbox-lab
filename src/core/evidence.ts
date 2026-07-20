import { checkPatchPolicy, type DivergencePatch } from "./divergence";
import type { CrmStem } from "./stem";

function operationDescription(operation: DivergencePatch["operations"][number]): string {
  if (operation.kind === "rename") return `- Rename ${operation.fieldId} to ${operation.label}`;
  if (operation.kind === "reorder") return `- Move ${operation.fieldId} before ${operation.beforeFieldId}`;
  return `- Hide ${operation.fieldId}`;
}

export function buildEvidencePacket(stem: CrmStem, patch: DivergencePatch): string {
  const policy = checkPatchPolicy(stem, patch);
  const status = policy.allowed ? "Accepted" : "Rejected";
  const rollbackCommand = patch.rollbackTo ? `rollback --to ${patch.rollbackTo}` : "rollback --to stem";
  return [
    `# Divergence evidence: ${patch.patchId}`,
    "",
    `## Policy result\n${status}${policy.allowed ? "" : `: ${policy.reason}`}`,
    "",
    `## Changed fields\n${patch.operations.map(operationDescription).join("\n")}`,
    "",
    `## Expected UX benefit\n${patch.reason}`,
    "",
    `## Provenance\n- Author: ${patch.author}\n- Source signal: ${patch.sourceSignal}\n- Timestamp: ${patch.createdAt}\n- Stem version: ${patch.stemVersion}`,
    "",
    `## Rollback\n${rollbackCommand}`,
  ].join("\n");
}
