import { modelSafeSummary, userRichOutput } from "../core/messages";
import { generatedDashboardManifest, validateManifest } from "../core/uiContracts";

const rejectedManifest = { artifactId: "missing-csp", intentId: "dashboard-overview" as const, allowedDomains: [], allowedScripts: [], connectTargets: [], dataFields: [] };

function dashboardSrcDoc(output: string) {
  return `<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';"><style>body{font-family:system-ui;margin:0;padding:18px;background:#f8fbff;color:#162435}h1{font-size:15px;margin:0 0 16px}.metric{border-top:3px solid #193a5a;padding-top:12px;font-size:18px;font-weight:700}.note{color:#52657a;font-size:12px;margin-top:14px}</style></head><body><h1>Pipeline overview</h1><div class="metric">${output}</div><p class="note">Validated deterministic fixture</p></body></html>`;
}

export function GeneratedWidgetLab() {
  const manifestResult = validateManifest(generatedDashboardManifest);
  const rejectedResult = validateManifest(rejectedManifest);
  const canRender = manifestResult.valid;

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
          {canRender ? <iframe referrerPolicy="no-referrer" sandbox="" srcDoc={dashboardSrcDoc(userRichOutput(generatedDashboardManifest))} title="Synthetic pipeline dashboard" /> : <p>Manifest rejected; widget not rendered.</p>}
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
          {!rejectedResult.valid && <p className="rejected-note">Bad fixture rejected before render: {rejectedResult.errors[0]}</p>}
        </aside>
      </div>
    </section>
  );
}
