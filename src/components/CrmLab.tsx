import { useMemo, useState } from "react";
import { crmVariants, renderVariant } from "../core/variants";

function describeOperation(operation: { kind: string; fieldId: string; label?: string; beforeFieldId?: string }) {
  if (operation.kind === "rename") return `Rename ${operation.fieldId} to ${operation.label}`;
  if (operation.kind === "reorder") return `Move ${operation.fieldId} before ${operation.beforeFieldId}`;
  return `Hide ${operation.fieldId}`;
}

export function CrmLab() {
  const [selectedId, setSelectedId] = useState<(typeof crmVariants)[number]["id"]>("canonical");
  const selected = crmVariants.find((variant) => variant.id === selectedId) ?? crmVariants[0];
  const replay = useMemo(() => renderVariant(selected), [selected]);

  return (
    <section className="crm-lab" aria-labelledby="crm-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Stem and divergences</p>
          <h2 id="crm-heading">Synthetic contact form</h2>
        </div>
        <p>{selected.summary}</p>
      </div>
      <div className="variant-tabs" aria-label="CRM form variants">
        {crmVariants.map((variant) => (
          <button aria-pressed={variant.id === selected.id} className={variant.id === selected.id ? "selected" : undefined} key={variant.id} onClick={() => setSelectedId(variant.id)} type="button">
            <span>{variant.label}</span><small>{variant.mode}</small>
          </button>
        ))}
      </div>
      <div className="crm-workspace">
        <section className="crm-form" aria-label={`${selected.label} CRM form`}>
          <div className="form-heading"><span>{selected.mode} renderer</span><strong>Contact record</strong></div>
          <dl className="field-list">
            {replay.fields.map((field) => (
              <div key={field.id}>
                <dt>{field.label} {field.protection === "protected" && <span className="protected-mark">Protected</span>}</dt>
                <dd>{field.value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <aside className="patch-audit" aria-labelledby="audit-heading">
          <p className="eyebrow">Patch provenance</p>
          <h3 id="audit-heading">{selected.patches.length === 0 ? "No divergence" : `${selected.patches.length} accepted patches`}</h3>
          {selected.patches.length === 0 ? <p>The canonical stem is rendered by a known static component.</p> : (
            <ol>
              {selected.patches.map((patch) => <li key={patch.patchId}><strong>{patch.patchId}</strong><span>{patch.operations.map(describeOperation).join("; ")}</span><small>{patch.author} · {patch.sourceSignal} · rollback: {patch.rollbackTo ?? "stem"}</small></li>)}
            </ol>
          )}
          <p className="policy-status">{replay.rejected.length === 0 ? "Policy check passed" : "Patch rejected"}</p>
        </aside>
      </div>
    </section>
  );
}
