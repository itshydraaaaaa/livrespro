import { describe, expect, it } from "vitest";
import { canProceedToCheckout, getNextCartQuantity } from "./cart";

describe("cart presentation helpers", () => {
  it("ne permet jamais une quantité négative lorsqu’un exemplaire est retiré", () => {
    expect(getNextCartQuantity(1, -1)).toBe(0);
    expect(getNextCartQuantity(0, -1)).toBe(0);
  });

  it("ajoute une quantité demandée au panier", () => {
    expect(getNextCartQuantity(2, 1)).toBe(3);
  });

  it("n’autorise le paiement que pour un panier doté d’une adresse Shopify", () => {
    expect(canProceedToCheckout(0, "https://checkout.shopify.com/example")).toBe(false);
    expect(canProceedToCheckout(1, "")).toBe(false);
    expect(canProceedToCheckout(1, "https://checkout.shopify.com/example")).toBe(true);
  });
});
