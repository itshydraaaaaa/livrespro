import { describe, expect, it } from "vitest";
import { formatMoney } from "./format";

describe("formatMoney", () => {
  it("affiche les prix Shopify au format français", () => {
    expect(formatMoney({ amount: "24.00", currencyCode: "EUR" })).toContain("24");
    expect(formatMoney({ amount: "24.00", currencyCode: "EUR" })).toContain("€");
  });

  it("retourne un tiret pour un montant non numérique", () => {
    expect(formatMoney("inconnu", "EUR")).toBe("—");
  });
});
