const modes = [
  ["Static", "Known component selected from a trusted catalog."],
  ["Declarative", "Typed UI spec rendered by a trusted renderer."],
  ["Generated", "Sandboxed artifact with a strict manifest and privacy split."],
];

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
      <section className="mode-list" aria-label="Rendering modes">
        {modes.map(([name, detail]) => <article key={name}><h2>{name}</h2><p>{detail}</p></article>)}
      </section>
    </main>
  );
}
