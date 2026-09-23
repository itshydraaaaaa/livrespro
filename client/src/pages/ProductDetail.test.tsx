import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Product } from "@shared/commerce/types";
import ProductDetail from "./ProductDetail";

const mocks = vi.hoisted(() => ({
  productQuery: { data: null, isLoading: false, isError: false } as { data: Product | null; isLoading: boolean; isError: boolean },
  addItem: vi.fn(),
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    commerce: {
      products: {
        byHandle: { useQuery: () => mocks.productQuery },
        list: { useQuery: () => ({ data: [] }) },
      },
    },
  },
}));

vi.mock("@/contexts/CartContext", () => ({
  useCart: () => ({ addItem: mocks.addItem, loading: false }),
}));

vi.mock("@/components/storefront/SiteHeader", () => ({ SiteHeader: () => <header>Navigation</header> }));
vi.mock("@/components/storefront/SiteFooter", () => ({ SiteFooter: () => <footer>Pied de page</footer> }));
vi.mock("wouter", () => ({
  Link: ({ href, children, ...props }: { href: string; children: ReactNode }) => <a href={href} {...props}>{children}</a>,
  useRoute: () => [true, { handle: "livre-pilote" }],
}));

const product: Product = {
  id: "gid://shopify/Product/1",
  handle: "livre-pilote",
  title: "Livre pilote",
  description: "Un essai de démonstration.",
  descriptionHtml: "<p>Un essai de démonstration.</p>",
  productType: "Essai",
  vendor: "Éditions Atelier",
  tags: [],
  options: [],
  priceRange: { min: { amount: "24.00", currencyCode: "EUR" }, max: { amount: "24.00", currencyCode: "EUR" } },
  images: [{ url: "https://example.com/livre.jpg", altText: "Couverture du Livre pilote" }],
  variants: [{ id: "variant-1", title: "Default Title", availableForSale: true, price: { amount: "24.00", currencyCode: "EUR" }, compareAtPrice: null, selectedOptions: [] }],
};

describe("ProductDetail", () => {
  beforeEach(() => {
    mocks.productQuery = { data: null, isLoading: false, isError: false };
    mocks.addItem.mockReset().mockResolvedValue(undefined);
  });

  it("annonce le chargement d’une fiche livre", () => {
    mocks.productQuery = { data: null, isLoading: true, isError: false };
    render(<ProductDetail />);

    expect(screen.getByRole("status", { name: "Chargement de la fiche livre" })).toBeInTheDocument();
  });

  it("explique clairement lorsqu’un livre est indisponible", () => {
    mocks.productQuery = { data: null, isLoading: false, isError: true };
    render(<ProductDetail />);

    expect(screen.getByRole("heading", { name: "Ce titre n’est plus au catalogue." })).toBeInTheDocument();
  });

  it("ajoute le premier variant du livre au panier depuis la fiche", async () => {
    mocks.productQuery = { data: product, isLoading: false, isError: false };
    render(<ProductDetail />);

    fireEvent.click(screen.getByRole("button", { name: "Ajouter à ma sélection" }));
    await waitFor(() => expect(mocks.addItem).toHaveBeenCalledWith({ product }, 1));
  });
});
