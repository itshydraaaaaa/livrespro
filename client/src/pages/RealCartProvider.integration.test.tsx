import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Cart, Product } from "@shared/commerce/types";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { CartProvider } from "@/contexts/CartContext";
import ProductDetail from "./ProductDetail";

const cart: Cart = {
  id: "cart-real-1",
  checkoutUrl: "https://checkout.shopify.com/example",
  itemCount: 1,
  subtotal: { amount: "24.00", currencyCode: "EUR" },
  total: { amount: "24.00", currencyCode: "EUR" },
  items: [{
    lineId: "line-real-1",
    variantId: "variant-1",
    productHandle: "livre-pilote",
    productTitle: "Livre pilote",
    variantTitle: "Default Title",
    quantity: 1,
    unitPrice: { amount: "24.00", currencyCode: "EUR" },
    lineTotal: { amount: "24.00", currencyCode: "EUR" },
    image: null,
  }],
};

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
  images: [],
  variants: [{ id: "variant-1", title: "Default Title", availableForSale: true, price: { amount: "24.00", currencyCode: "EUR" }, compareAtPrice: null, selectedOptions: [] }],
};

const mocks = vi.hoisted(() => ({
  createCart: vi.fn(),
  getCart: vi.fn(),
  addLines: vi.fn(),
  updateLines: vi.fn(),
  removeLines: vi.fn(),
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    commerce: {
      products: {
        byHandle: { useQuery: () => ({ data: product, isLoading: false, isError: false }) },
        list: { useQuery: () => ({ data: [] }) },
      },
    },
    useUtils: () => ({
      commerce: { cart: { get: { fetch: mocks.getCart } } },
      client: {
        commerce: {
          cart: {
            create: { mutate: mocks.createCart },
            addLines: { mutate: mocks.addLines },
            updateLines: { mutate: mocks.updateLines },
            removeLines: { mutate: mocks.removeLines },
          },
        },
      },
    }),
  },
}));

vi.mock("@/components/storefront/SiteHeader", () => ({ SiteHeader: () => <header>Navigation</header> }));
vi.mock("@/components/storefront/SiteFooter", () => ({ SiteFooter: () => <footer>Pied de page</footer> }));
vi.mock("wouter", () => ({
  Link: ({ href, children, ...props }: { href: string; children: ReactNode }) => <a href={href} {...props}>{children}</a>,
  useRoute: () => [true, { handle: "livre-pilote" }],
}));

describe("flux réel CartProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mocks.createCart.mockReset().mockResolvedValue(cart);
    mocks.getCart.mockReset().mockResolvedValue(cart);
  });

  it("ajoute le livre au panier local et ouvre le CartDrawer après l’ajout depuis la fiche", async () => {
    render(<CartProvider><ProductDetail /><CartDrawer /></CartProvider>);

    fireEvent.click(screen.getByRole("button", { name: "Ajouter à ma sélection" }));

    const drawer = await screen.findByRole("dialog", { name: "Votre panier" });
    expect(within(drawer).getByText("Livre pilote")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Commander · Paiement à la livraison" })).toBeEnabled();
  });
});
