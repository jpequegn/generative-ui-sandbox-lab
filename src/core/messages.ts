import type { GeneratedUiManifest } from "./uiContracts";

export type HostWidgetMessage =
  | { type: "set_state"; state: Record<string, string | number | boolean> }
  | { type: "request_tool"; tool: "refresh_dashboard" }
  | { type: "emit_summary"; summary: string }
  | { type: "user_action"; action: string }
  | { type: "approval_decision"; decision: "approved" | "rejected" };

export function isHostWidgetMessage(value: unknown): value is HostWidgetMessage {
  if (!value || typeof value !== "object" || !("type" in value)) return false;
  return ["set_state", "request_tool", "emit_summary", "user_action", "approval_decision"].includes(String(value.type));
}

export function modelSafeSummary(manifest: GeneratedUiManifest): string {
  return manifest.modelVisibleOutput;
}

export function userRichOutput(manifest: GeneratedUiManifest): string {
  return manifest.userVisibleOutput;
}
