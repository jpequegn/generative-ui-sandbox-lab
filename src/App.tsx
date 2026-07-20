import { CrmLab } from "./components/CrmLab";
import { EvidencePacket } from "./components/EvidencePacket";
import { GeneratedWidgetLab } from "./components/GeneratedWidgetLab";

export function App() {
  return (
    <main className="app-shell">
      <header className="masthead">
        <p className="product-name">Generative UI Sandbox Lab</p>
        <p className="environment-label">Synthetic fixtures only</p>
      </header>
      <section className="overview" aria-labelledby="overview-heading">
        <p className="eyebrow">Runtime contract</p>
        <h1 id="overview-heading">Choose a UI mode, then prove it is safe to render.</h1>
        <p className="intro">A local lab for reversible CRM adaptations and constrained generated widgets. No model call is required.</p>
      </section>
      <CrmLab />
      <GeneratedWidgetLab />
      <EvidencePacket />
    </main>
  );
}
