import { fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import type { Product } from "@shared/commerce/types";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import ProductDetail from "./ProductDetail";

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

vi.mock("@/lib/trpc", () => ({
  trpc: {
    commerce: {
      products: {
        byHandle: { useQuery: () => ({ data: product, isLoading: false, isError: false }) },
        list: { useQuery: () => ({ data: [] }) },
      },
    },
  },
}));

vi.mock("@/contexts/CartContext", async () => {
  const React = await import("react");
  const CartState = React.createContext<Record<string, unknown> | null>(null);

  function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = React.useState<{
      id: string;
      checkoutUrl: string;
      itemCount: number;
      subtotal: { amount: string; currencyCode: string };
      total: { amount: string; currencyCode: string };
      items: Array<Record<string, unknown>>;
    } | null>(null);
    const [isOpen, setIsOpen] = React.useState(false);
    const addItem = async () => {
      setCart({
        id: "cart-1",
        checkoutUrl: "https://checkout.shopify.com/example",
        itemCount: 1,
        subtotal: { amount: "24.00", currencyCode: "EUR" },
        total: { amount: "24.00", currencyCode: "EUR" },
        items: [{ lineId: "line-1", variantId: "variant-1", productHandle: "livre-pilote", productTitle: "Livre pilote", variantTitle: "Default Title", quantity: 1, unitPrice: { amount: "24.00", currencyCode: "EUR" }, lineTotal: { amount: "24.00", currencyCode: "EUR" }, image: null }],
      });
      setIsOpen(true);
    };
    return <CartState.Provider value={{ cart, isOpen, loading: false, itemCount: cart?.itemCount ?? 0, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false), addItem, updateQuantity: vi.fn(), removeItem: vi.fn(), clearCart: vi.fn(), proceedToCheckout: vi.fn() }}>{children}</CartState.Provider>;
  }

  function useCart() {
    const context = React.useContext(CartState);
    if (!context) throw new Error("CartProvider requis");
    return context as never;
  }

  return { CartProvider, useCart };
});

vi.mock("@/components/storefront/SiteHeader", () => ({ SiteHeader: () => <header>Navigation</header> }));
vi.mock("@/components/storefront/SiteFooter", () => ({ SiteFooter: () => <footer>Pied de page</footer> }));
vi.mock("wouter", () => ({
  Link: ({ href, children, ...props }: { href: string; children: ReactNode }) => <a href={href} {...props}>{children}</a>,
  useRoute: () => [true, { handle: "livre-pilote" }],
}));

describe("flux fiche livre vers panier", () => {
  it("ouvre la sélection contenant le livre après l’ajout depuis la fiche", async () => {
    const { CartProvider } = await import("@/contexts/CartContext");
    render(<CartProvider><ProductDetail /><CartDrawer /></CartProvider>);

    fireEvent.click(screen.getByRole("button", { name: "Ajouter à ma sélection" }));

    const drawer = await screen.findByRole("dialog", { name: "Votre panier" });
    expect(drawer).toBeInTheDocument();
    expect(within(drawer).getByText("Livre pilote")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Commander · Paiement à la livraison" })).toBeEnabled();
  });
});
