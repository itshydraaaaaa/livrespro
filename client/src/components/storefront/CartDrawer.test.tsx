import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Cart } from "@shared/commerce/types";
import { CartDrawer } from "./CartDrawer";

const mocks = vi.hoisted(() => ({
  closeCart: vi.fn(),
  updateQuantity: vi.fn(),
  removeItem: vi.fn(),
  openCheckout: vi.fn(),
  state: null as unknown,
}));

vi.mock("@/contexts/CartContext", () => ({
  useCart: () => mocks.state,
}));

const cart: Cart = {
  id: "cart-1",
  checkoutUrl: "",
  itemCount: 2,
  subtotal: { amount: "48.00", currencyCode: "TND" },
  total: { amount: "48.00", currencyCode: "TND" },
  items: [{
    lineId: "line-1",
    variantId: "variant-1",
    productHandle: "livre-pilote",
    productTitle: "Livre pilote",
    variantTitle: "Default Title",
    quantity: 2,
    unitPrice: { amount: "24.00", currencyCode: "TND" },
    lineTotal: { amount: "48.00", currencyCode: "TND" },
    image: null,
  }],
};

function setCartState(overrides: Partial<{ cart: Cart | null; isOpen: boolean; loading: boolean }> = {}) {
  mocks.state = {
    cart: overrides.cart === undefined ? cart : overrides.cart,
    isOpen: overrides.isOpen ?? true,
    loading: overrides.loading ?? false,
    itemCount: overrides.cart === null ? 0 : 2,
    openCart: vi.fn(),
    closeCart: mocks.closeCart,
    addItem: vi.fn(),
    updateQuantity: mocks.updateQuantity,
    removeItem: mocks.removeItem,
    clearCart: vi.fn(),
    openCheckout: mocks.openCheckout,
  };
}

describe("CartDrawer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setCartState();
  });

  it("gère l’ajustement, la suppression et le passage au paiement d’un livre", () => {
    render(<CartDrawer />);

    fireEvent.click(screen.getByRole("button", { name: "Retirer un exemplaire de Livre pilote" }));
    expect(mocks.updateQuantity).toHaveBeenCalledWith("line-1", 1);

    fireEvent.click(screen.getByRole("button", { name: "Ajouter un exemplaire de Livre pilote" }));
    expect(mocks.updateQuantity).toHaveBeenCalledWith("line-1", 3);

    fireEvent.click(screen.getByRole("button", { name: "Retirer Livre pilote du panier" }));
    expect(mocks.removeItem).toHaveBeenCalledWith("line-1");

    fireEvent.click(screen.getByRole("button", { name: "Commander · Paiement à la livraison" }));
    expect(mocks.openCheckout).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Commander · Paiement à la livraison" })).toBeEnabled();
  });

  it("présente un état de panier vide lisible", () => {
    setCartState({ cart: null });
    render(<CartDrawer />);

    expect(screen.getByText("Votre sélection est prête.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Commander · Paiement à la livraison" })).not.toBeInTheDocument();
  });

  it("désactive le checkout quand le panier charge", () => {
    setCartState({ loading: true });
    render(<CartDrawer />);

    expect(screen.getByRole("button", { name: "Commander · Paiement à la livraison" })).toBeDisabled();
  });
});
