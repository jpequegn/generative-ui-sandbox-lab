import { useState } from "react";
import { refreshSavedDashboard, saveDashboardWidget, validPipelineQueryResult } from "../core/dashboard";
import { modelSafeSummary } from "../core/messages";
import { generatedDashboardManifest, validateManifest } from "../core/uiContracts";

const rejectedManifest = { artifactId: "missing-csp", intentId: "dashboard-overview" as const, allowedDomains: [], allowedScripts: [], connectTargets: [], dataFields: [] };

function dashboardSrcDoc(output: string) {
  return `<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';"><style>body{font-family:system-ui;margin:0;padding:18px;background:#f8fbff;color:#162435}h1{font-size:15px;margin:0 0 16px}.metric{border-top:3px solid #193a5a;padding-top:12px;font-size:18px;font-weight:700}.note{color:#52657a;font-size:12px;margin-top:14px}</style></head><body><h1>Pipeline overview</h1><div class="metric">${output}</div><p class="note">Validated deterministic fixture</p></body></html>`;
}

export function GeneratedWidgetLab() {
  const [refreshCount, setRefreshCount] = useState(0);
  const manifestResult = validateManifest(generatedDashboardManifest);
  const rejectedResult = validateManifest(rejectedManifest);
  const savedWidget = saveDashboardWidget(generatedDashboardManifest, validPipelineQueryResult);
  const canRender = manifestResult.valid;
  const refreshed = savedWidget.saved ? refreshSavedDashboard(savedWidget.widget, validPipelineQueryResult) : null;

  return (
    <section className="generated-lab" aria-labelledby="generated-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Generated mode</p>
          <h2 id="generated-heading">Sandboxed widget preview</h2>
        </div>
        <p>The widget is a deterministic fixture. Its manifest is validated before the host supplies a no-script, no-network iframe.</p>
      </div>
      <div className="generated-workspace">
        <section className="widget-frame" aria-label="Generated dashboard widget">
          {canRender && refreshed ? <iframe referrerPolicy="no-referrer" sandbox="" srcDoc={dashboardSrcDoc(refreshed.userOutput)} title="Synthetic pipeline dashboard" /> : <p>Manifest rejected; widget not rendered.</p>}
        </section>
        <aside className="manifest-panel" aria-labelledby="manifest-heading">
          <p className="eyebrow">Manifest</p>
          <h3 id="manifest-heading">{manifestResult.valid ? "Validated before render" : "Rejected"}</h3>
          <dl>
            <div><dt>Scripts</dt><dd>None allowed</dd></div>
            <div><dt>Network</dt><dd>None allowed</dd></div>
            <div><dt>Frame policy</dt><dd>Sandboxed, no referrer</dd></div>
            <div><dt>Provenance</dt><dd>{generatedDashboardManifest.provenance.generator}</dd></div>
          </dl>
          <p className="model-output"><strong>Model-visible summary</strong>{modelSafeSummary(generatedDashboardManifest)}</p>
          <div className="refresh-status">
            <button className="secondary-button" onClick={() => setRefreshCount((count) => count + 1)} type="button">Refresh saved widget</button>
            <span>{refreshCount === 0 ? "Saved specification ready" : `Deterministic refresh ${refreshCount} complete`}</span>
          </div>
          {!rejectedResult.valid && <p className="rejected-note">Bad fixture rejected before render: {rejectedResult.errors[0]}</p>}
        </aside>
      </div>
    </section>
  );
}
