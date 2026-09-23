import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Product } from "@shared/commerce/types";
import { ProductCard } from "./ProductCard";

const product: Product = {
  id: "gid://shopify/Product/1",
  handle: "livre-pilote",
  title: "Livre pilote",
  description: "Un essai de démonstration.",
  descriptionHtml: "<p>Un essai de démonstration.</p>",
  productType: "Essai",
  vendor: "Éditions Atelier",
  tags: ["Essais"],
  options: [],
  priceRange: { min: { amount: "24.00", currencyCode: "EUR" }, max: { amount: "24.00", currencyCode: "EUR" } },
  images: [{ url: "https://example.com/livre.jpg", altText: "Couverture du Livre pilote" }],
  variants: [{ id: "gid://shopify/ProductVariant/1", title: "Default Title", availableForSale: true, price: { amount: "24.00", currencyCode: "EUR" }, compareAtPrice: null, selectedOptions: [] }],
};

describe("ProductCard", () => {
  it("présente un livre avec sa couverture, son prix et un lien vers la fiche", () => {
    render(<ProductCard product={product} />);

    expect(screen.getByRole("img", { name: "Couverture du Livre pilote" })).toHaveAttribute("src", "https://example.com/livre.jpg");
    expect(screen.getByRole("heading", { name: "Livre pilote" })).toBeInTheDocument();
    expect(screen.getByText(/24/)).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/livres/livre-pilote");
  });
});
