export type FieldId = "fullName" | "email" | "company" | "role" | "phone" | "relationship" | "legalConsent" | "paymentTerms";

export type FieldProtection = "protected" | "adaptable";

export interface StemField {
  id: FieldId;
  label: string;
  value: string;
  inputType: "text" | "email" | "tel" | "select" | "checkbox";
  protection: FieldProtection;
  region: "identity" | "profile" | "relationship" | "legal" | "payment";
}

export interface CrmStem {
  id: "synthetic-crm-contact";
  version: number;
  title: string;
  fields: readonly StemField[];
}

const canonicalFields: readonly StemField[] = Object.freeze([
  { id: "fullName", label: "Full name", value: "Avery Chen", inputType: "text", protection: "protected", region: "identity" },
  { id: "email", label: "Work email", value: "avery.chen@example.test", inputType: "email", protection: "protected", region: "identity" },
  { id: "company", label: "Company", value: "Northstar Labs", inputType: "text", protection: "adaptable", region: "profile" },
  { id: "role", label: "Role", value: "Operations lead", inputType: "text", protection: "adaptable", region: "profile" },
  { id: "phone", label: "Phone", value: "+1 555 010 1088", inputType: "tel", protection: "adaptable", region: "relationship" },
  { id: "relationship", label: "Relationship", value: "Qualified prospect", inputType: "select", protection: "adaptable", region: "relationship" },
  { id: "legalConsent", label: "Contact consent", value: "Recorded", inputType: "checkbox", protection: "protected", region: "legal" },
  { id: "paymentTerms", label: "Payment terms", value: "Net 30", inputType: "text", protection: "protected", region: "payment" },
]);

export const canonicalStem: CrmStem = Object.freeze({
  id: "synthetic-crm-contact",
  version: 1,
  title: "Contact record",
  fields: canonicalFields,
});

export function findStemField(stem: CrmStem, fieldId: FieldId): StemField | undefined {
  return stem.fields.find((field) => field.id === fieldId);
}

export function isProtectedField(stem: CrmStem, fieldId: FieldId): boolean {
  return findStemField(stem, fieldId)?.protection === "protected";
}
