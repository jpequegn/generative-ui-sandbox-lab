import { describe, expect, it } from "vitest";
import { canonicalStem, findStemField, isProtectedField } from "./stem";

describe("canonical CRM stem", () => {
  it("contains only synthetic fixture values", () => {
    expect(canonicalStem.id).toBe("synthetic-crm-contact");
    expect(findStemField(canonicalStem, "email")?.value).toBe("avery.chen@example.test");
  });

  it("protects identity, legal, and payment regions", () => {
    expect(isProtectedField(canonicalStem, "fullName")).toBe(true);
    expect(isProtectedField(canonicalStem, "email")).toBe(true);
    expect(isProtectedField(canonicalStem, "legalConsent")).toBe(true);
    expect(isProtectedField(canonicalStem, "paymentTerms")).toBe(true);
  });

  it("allows only scoped product fields to adapt", () => {
    expect(isProtectedField(canonicalStem, "company")).toBe(false);
    expect(isProtectedField(canonicalStem, "relationship")).toBe(false);
  });
});
