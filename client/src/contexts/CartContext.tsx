import type { Cart, CartItem, Product } from "@shared/commerce/types";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CART_STORAGE_KEY = "livrespro:cart";

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

type AddItemPayload =
  | {
      variantId?: string;
      product?: Product;
      productId?: number;
      productHandle?: string;
      productTitle?: string;
      unitPrice?: string;
      imageUrl?: string;
      format?: string;
    }
  | string; // or just variantId

type CartContextValue = {
  cart: Cart | null;
  isOpen: boolean;
  isCheckoutOpen: boolean;
  loading: boolean;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  addItem: (payload: AddItemPayload, quantity?: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart());
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    writeStoredCart(items);
  }, [items]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotalNum = useMemo(
    () =>
      items.reduce((sum, item) => {
        const p = parseFloat(item.unitPrice.amount) || 0;
        return sum + p * item.quantity;
      }, 0),
    [items]
  );

  const cart: Cart = useMemo(
    () => ({
      id: "cart-local",
      checkoutUrl: "/checkout",
      items,
      itemCount,
      subtotal: {
        amount: subtotalNum.toFixed(2),
        currencyCode: "TND",
      },
      total: {
        amount: (subtotalNum + 7.0).toFixed(2), // including flat 7 DT delivery
        currencyCode: "TND",
      },
    }),
    [items, itemCount, subtotalNum]
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const openCheckout = useCallback(() => {
    setIsOpen(false);
    setIsCheckoutOpen(true);
  }, []);
  const closeCheckout = useCallback(() => setIsCheckoutOpen(false), []);

  const addItem = useCallback(
    async (payload: AddItemPayload, quantity: number = 1) => {
      setLoading(true);
      try {
        let handle = "";
        let title = "Livre professionnel";
        let price = "65.00";
        let image = "";
        let lineId = "";
        let variantId = "";

        if (typeof payload === "string") {
          variantId = payload;
          lineId = payload;
          handle = payload.replace(/^var-/, "");
        } else if (payload.product) {
          const p = payload.product;
          handle = p.handle;
          title = p.title;
          price = p.priceRange.min.amount;
          image = p.images[0]?.url || "";
          variantId = p.variants[0]?.id || `var-${p.id}`;
          lineId = `line-${handle}`;
        } else {
          handle = payload.productHandle || "livre";
          title = payload.productTitle || "Livre professionnel";
          price = payload.unitPrice || "65.00";
          image = payload.imageUrl || "";
          variantId = payload.variantId || `var-${handle}`;
          lineId = `line-${handle}`;
        }

        setItems((current) => {
          const existingIdx = current.findIndex(
            (i) => i.lineId === lineId || i.productHandle === handle
          );

          if (existingIdx >= 0) {
            const copy = [...current];
            const updatedQty = copy[existingIdx].quantity + quantity;
            copy[existingIdx] = {
              ...copy[existingIdx],
              quantity: updatedQty,
              lineTotal: {
                amount: (parseFloat(copy[existingIdx].unitPrice.amount) * updatedQty).toFixed(2),
                currencyCode: "TND",
              },
            };
            return copy;
          }

          const newItem: CartItem = {
            lineId,
            variantId,
            productHandle: handle,
            productTitle: title,
            variantTitle: "Livre relié",
            image: image ? { url: image, altText: title } : null,
            unitPrice: {
              amount: parseFloat(price).toFixed(2),
              currencyCode: "TND",
            },
            quantity,
            lineTotal: {
              amount: (parseFloat(price) * quantity).toFixed(2),
              currencyCode: "TND",
            },
          };

          return [...current, newItem];
        });

        setIsOpen(true);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((current) => current.filter((i) => i.lineId !== lineId));
      return;
    }

    setItems((current) =>
      current.map((item) => {
        if (item.lineId !== lineId) return item;
        return {
          ...item,
          quantity,
          lineTotal: {
            amount: (parseFloat(item.unitPrice.amount) * quantity).toFixed(2),
            currencyCode: "TND",
          },
        };
      })
    );
  }, []);

  const removeItem = useCallback(async (lineId: string) => {
    setItems((current) => current.filter((i) => i.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({
      cart,
      isOpen,
      isCheckoutOpen,
      loading,
      itemCount,
      openCart,
      closeCart,
      openCheckout,
      closeCheckout,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      cart,
      isOpen,
      isCheckoutOpen,
      loading,
      itemCount,
      openCart,
      closeCart,
      openCheckout,
      closeCheckout,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
