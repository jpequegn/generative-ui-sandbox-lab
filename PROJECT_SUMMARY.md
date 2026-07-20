# Generative UI Sandbox Lab

## What it does

Generative UI Sandbox Lab is a local-first learning environment for the runtime contract around adaptive and generated interfaces. It does not call an LLM. Instead, deterministic synthetic fixtures make the safety model inspectable.

- A canonical CRM contact-form stem separates shared product structure from per-user changes.
- Immutable, provenance-carrying patches can rename, hide, or reorder adaptable fields while policy prevents changes to identity, legal-consent, and payment fields.
- The same CRM stem renders a trusted static baseline plus distinct declarative variants for account-executive and customer-success users.
- Typed UI intents make explicit when a request uses a static component, declarative renderer, or constrained generated artifact.
- The generated dashboard fixture requires an allowlist manifest, a failing-closed CSP, a scriptless/no-network iframe sandbox, and separate user-visible and model-visible output.
- A dashboard is saved only after data-query validation. Refreshing uses the saved specification and validated fixture data rather than another LLM call.
- Markdown evidence packets preserve policy result, changed fields, UX rationale, provenance, and a rollback instruction for both accepted and rejected patches.

## Run it

```bash
npm install
npm run dev
```

Open the local Vite URL, normally `http://localhost:5173`. Run `npm test`, `npm run lint`, and `npm run build` for verification.

## Typical use

1. Inspect the canonical CRM stem and switch between the two declarative user variants.
2. Read the provenance panel to see why each patch is permitted and where it rolls back.
3. Review the generated-widget manifest beside its iframe preview; verify that scripts and network access are denied.
4. Refresh the saved dashboard fixture to demonstrate the deterministic post-generation path.
5. Open the evidence packets to compare accepted and blocked policy outcomes.

## Potential extensions

- Add a real host/widget postMessage bridge that validates every message against the typed contract.
- Extend the manifest to capture content hashes, signed provenance, CSP reporting, and a host allowlist.
- Persist a patch ledger and require human approval for selected high-risk divergence operations.
- Allow a code-generating system only in an offline build pipeline, then retain its reviewed output as a deterministic artifact.
- Add visual regression, CSP, accessibility, and data-contract checks to a release gate.

## Innovative uses

- Treat the lab as a review harness for generated customer-support panels: the rich panel stays in a sandbox, while the model receives only a minimal safe summary.
- Use per-role CRM variants to test whether a proposed generated adaptation actually improves a workflow before allowing it in a production configuration service.
- Turn evidence packets into PR attachments so product, security, and operations teams can review the exact behavioral delta and rollback route.
- Build a widget marketplace where every artifact is required to expose its declared capabilities, data fields, privacy split, and deterministic refresh specification.

## Safety boundary

Fixtures contain synthetic data only. V1 manifests deny scripts and network targets; no raw transcripts, production data, credentials, or private logs are stored or rendered.
