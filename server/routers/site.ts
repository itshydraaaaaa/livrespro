import { z } from "zod";
import {
  createMultiItemOrder,
  getSeoPage,
  listContentSections,
  recordAnalyticsEvent,
} from "../db";
import { publicProcedure, router } from "../_core/trpc";

const analyticsInput = z.object({
  visitorId: z.string().uuid(),
  sessionId: z.string().uuid(),
  eventType: z.enum(["page_view", "view_book", "add_to_cart", "initiate_checkout"]),
  path: z
    .string()
    .trim()
    .min(1)
    .max(500)
    .startsWith("/")
    .refine((path) => !path.includes("?"), "Les paramètres d’URL ne sont pas collectés."),
  referrer: z.string().url().max(500).nullable().optional(),
  metadata: z
    .object({ productHandle: z.string().trim().min(1).max(140).optional() })
    .strict()
    .nullable()
    .optional(),
});

const orderItemInput = z.object({
  productId: z.number().int().positive().optional(),
  productSlug: z.string().trim().min(1).max(180),
  productTitle: z.string().trim().min(1).max(300),
  format: z.string().trim().max(80).optional().default("Livre physique"),
  unitPrice: z.string().trim().regex(/^\d+(\.\d{1,2})?$/, "Format de prix invalide").default("65.00"),
  quantity: z.number().int().min(1).max(99).default(1),
});

const multiOrderInput = z.object({
  customerFirstName: z.string().trim().min(2).max(120),
  customerLastName: z.string().trim().min(2).max(120),
  customerEmail: z.string().email().max(320),
  customerPhone: z.string().trim().min(6).max(80),
  deliveryAddress: z.string().trim().min(6).max(1200),
  city: z.string().trim().max(120).optional().nullable(),
  governorate: z.string().trim().max(120).optional().nullable(),
  postalCode: z.string().trim().max(20).optional().nullable(),
  orderNotes: z.string().trim().max(1000).optional().nullable(),
  isEducator: z.boolean().default(false),
  shippingCost: z.string().default("7.00"),
  items: z.array(orderItemInput).min(1, "Votre panier est vide"),
});

// Backward-compatible schema supporting both legacy flat and new multi-item formats
const unifiedOrderInput = z.union([
  multiOrderInput,
  z.object({
    firstName: z.string().trim().min(2).max(120),
    lastName: z.string().trim().min(2).max(120),
    email: z.string().email().max(320),
    phone: z.string().trim().min(6).max(80),
    deliveryAddress: z.string().trim().min(6).max(1200),
    quantity: z.number().int().min(1).max(50).default(1),
    educator: z.boolean().default(false),
    productHandle: z.string().trim().min(1).max(180).default("b2b-brand-management"),
    productTitle: z.string().trim().min(1).max(300).default("B2B Brand Management — Tunisia Edition"),
    unitPrice: z.string().default("65.00"),
  }),
]);

export const siteRouter = router({
  orders: router({
    create: publicProcedure.input(unifiedOrderInput).mutation(async ({ input }) => {
      if ("items" in input) {
        return createMultiItemOrder(input);
      }

      // Transform legacy flat order to multi-item structure
      return createMultiItemOrder({
        customerFirstName: input.firstName,
        customerLastName: input.lastName,
        customerEmail: input.email,
        customerPhone: input.phone,
        deliveryAddress: input.deliveryAddress,
        isEducator: input.educator,
        items: [
          {
            productSlug: input.productHandle,
            productTitle: input.productTitle,
            unitPrice: input.unitPrice ?? "65.00",
            quantity: input.quantity,
          },
        ],
      });
    }),
  }),
  content: router({
    published: publicProcedure.query(() => listContentSections(false)),
  }),
  seo: router({
    byPath: publicProcedure
      .input(z.object({ path: z.string().min(1).max(500) }))
      .query(({ input }) => getSeoPage(input.path)),
  }),
  analytics: router({
    track: publicProcedure.input(analyticsInput).mutation(async ({ input }) => {
      await recordAnalyticsEvent(input);
      return { recorded: true };
    }),
  }),
});
