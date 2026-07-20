import { describe, expect, it } from "vitest";
import { crmVariants, renderVariant } from "./variants";

describe("CRM variant fixtures", () => {
  it("creates two visibly different declarative variants from the same stem", () => {
    const accountExecutive = renderVariant(crmVariants[1]);
    const customerSuccess = renderVariant(crmVariants[2]);
    expect(accountExecutive.fields.find((field) => field.id === "company")?.label).toBe("Account");
    expect(customerSuccess.fields.some((field) => field.id === "phone")).toBe(false);
  });

  it("keeps every protected field visible and unchanged in each variant", () => {
    crmVariants.forEach((variant) => {
      const fields = renderVariant(variant).fields;
      expect(fields.find((field) => field.id === "email")?.label).toBe("Work email");
      expect(fields.find((field) => field.id === "legalConsent")?.value).toBe("Recorded");
      expect(fields.find((field) => field.id === "paymentTerms")?.value).toBe("Net 30");
    });
  });
});
