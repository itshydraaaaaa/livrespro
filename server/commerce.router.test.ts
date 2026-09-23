import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const listStorefrontProductsMock = vi.fn();
const getStorefrontProductByHandleMock = vi.fn();
const listStorefrontCollectionsMock = vi.fn();
const getStorefrontCollectionByHandleMock = vi.fn();

vi.mock("./services/bookstoreService", () => ({
  listStorefrontProducts: (...args: any[]) => listStorefrontProductsMock(...args),
  getStorefrontProductByHandle: (...args: any[]) => getStorefrontProductByHandleMock(...args),
  listStorefrontCollections: (...args: any[]) => listStorefrontCollectionsMock(...args),
  getStorefrontCollectionByHandle: (...args: any[]) => getStorefrontCollectionByHandleMock(...args),
}));

import { appRouter } from "./routers";

function makeCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

const sampleProduct = {
  id: "gid://bookstore/Product/1",
  handle: "b2b-brand-management-tunisia",
  title: "B2B Brand Management — Édition Tunisie",
  description: "L'ouvrage de référence de Philip Kotler & Waldemar Pfoertsch adapté au contexte tunisien.",
  descriptionHtml: "<p>Description</p>",
  productType: "Livre broché",
  vendor: "L'Atelier des Pages",
  tags: ["B2B", "Stratégie", "Marketing"],
  options: [{ name: "Format", values: ["Édition imprimée"] }],
  priceRange: {
    min: { amount: "65.00", currencyCode: "TND" },
    max: { amount: "65.00", currencyCode: "TND" },
  },
  images: [{ url: "/images/b2b-cover.png", altText: "Couverture", width: 600, height: 900 }],
  variants: [
    {
      id: "var-1",
      title: "Édition imprimée",
      availableForSale: true,
      price: { amount: "65.00", currencyCode: "TND" },
      compareAtPrice: { amount: "85.00", currencyCode: "TND" },
      selectedOptions: [{ name: "Format", value: "Édition imprimée" }],
    },
  ],
};

describe("commerce router (native bookstore)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists products via bookstore service", async () => {
    listStorefrontProductsMock.mockResolvedValue([sampleProduct]);

    const caller = appRouter.createCaller(makeCtx());
    const products = await caller.commerce.products.list();

    expect(products).toHaveLength(1);
    expect(products[0].handle).toBe("b2b-brand-management-tunisia");
    expect(products[0].priceRange.min.currencyCode).toBe("TND");
    expect(listStorefrontProductsMock).toHaveBeenCalledOnce();
  });

  it("finds a product by handle", async () => {
    getStorefrontProductByHandleMock.mockResolvedValue(sampleProduct);

    const caller = appRouter.createCaller(makeCtx());
    const product = await caller.commerce.products.byHandle({ handle: "b2b-brand-management-tunisia" });

    expect(product.title).toBe("B2B Brand Management — Édition Tunisie");
    expect(getStorefrontProductByHandleMock).toHaveBeenCalledWith("b2b-brand-management-tunisia");
  });

  it("lists collections via bookstore service", async () => {
    listStorefrontCollectionsMock.mockResolvedValue([
      { id: "1", handle: "strategie-b2b", title: "Stratégie & B2B", description: "" },
    ]);

    const caller = appRouter.createCaller(makeCtx());
    const collections = await caller.commerce.collections.list();

    expect(collections).toHaveLength(1);
    expect(collections[0].handle).toBe("strategie-b2b");
  });
});
