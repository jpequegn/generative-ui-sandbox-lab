import { createPatch } from "../core/divergence";
import { buildEvidencePacket } from "../core/evidence";
import { canonicalStem } from "../core/stem";
import { crmVariants } from "../core/variants";

const acceptedPatch = crmVariants.find((variant) => variant.id === "account-executive")?.patches[1];
const rejectedPatch = createPatch({
  patchId: "blocked-legal-hide",
  userId: "fixture-user",
  author: "fixture-agent",
  reason: "Attempted unsafe customization.",
  sourceSignal: "Negative fixture",
  createdAt: "2026-07-20T10:00:00.000Z",
  stemVersion: 1,
  operations: [{ kind: "hide", fieldId: "legalConsent" }],
});

export function EvidencePacket() {
  if (!acceptedPatch) return null;
  return (
    <section className="evidence-packet" aria-labelledby="evidence-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Audit artifact</p>
          <h2 id="evidence-heading">Markdown evidence packets</h2>
        </div>
        <p>Accepted and rejected divergences receive the same inspectable packet shape.</p>
      </div>
      <div className="evidence-grid">
        <details open><summary>Accepted patch: {acceptedPatch.patchId}</summary><pre>{buildEvidencePacket(canonicalStem, acceptedPatch)}</pre></details>
        <details><summary>Rejected patch: {rejectedPatch.patchId}</summary><pre>{buildEvidencePacket(canonicalStem, rejectedPatch)}</pre></details>
      </div>
    </section>
  );
}
