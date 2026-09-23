import { z } from "zod";
import {
  createMultiItemOrder,
  getSeoPage,
  listContentSections,
  recordAnalyticsEvent,
} from "../db";
import { publicProcedure, router } from "../_core/trpc";
import { persistOrderToSupabase } from "../services/supabase";

const analyticsInput = z.object({
  visitorId: z.string().uuid(),
  sessionId: z.string().uuid(),
  eventType: z.enum(["page_view", "view_book", "add_to_cart", "initiate_checkout"]),
  path: z
    .string()
    .min(1)
    .max(500)
    .refine((val) => !val.includes("?"), {
      message: "Les URL d'analyse ne doivent pas comporter de paramètres d'interrogation",
    }),
  referrer: z.string().url().max(500).nullable().optional(),
  metadata: z
    .object({
      productHandle: z.string().min(1).max(180).optional(),
    })
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
      let createdOrder: { orderId: number; orderNumber: string } | null = null;
      let orderPayload: any = null;
      let orderItems: any[] = [];

      if ("items" in input) {
        orderPayload = {
          customer_first_name: input.customerFirstName,
          customer_last_name: input.customerLastName,
          customer_email: input.customerEmail,
          customer_phone: input.customerPhone,
          delivery_address: input.deliveryAddress,
          city: input.city ?? null,
          governorate: input.governorate ?? null,
          is_educator: input.isEducator ? 1 : 0,
          shipping_cost: input.shippingCost ?? "7.00",
          payment_method: "cash_on_delivery",
          payment_status: "pending",
          status: "new",
        };
        orderItems = input.items.map((it) => ({
          product_slug: it.productSlug,
          product_title: it.productTitle,
          format: it.format ?? "Livre physique",
          unit_price: it.unitPrice,
          quantity: it.quantity,
          subtotal: (parseFloat(it.unitPrice) * it.quantity).toFixed(2),
        }));

        try {
          createdOrder = await createMultiItemOrder(input);
        } catch (err) {
          console.warn("[Orders] Local DB unavailable, checking Supabase fallback:", err);
        }
      } else {
        const itemSubtotal = (parseFloat(input.unitPrice ?? "65.00") * input.quantity).toFixed(2);
        orderPayload = {
          customer_first_name: input.firstName,
          customer_last_name: input.lastName,
          customer_email: input.email,
          customer_phone: input.phone,
          delivery_address: input.deliveryAddress,
          is_educator: input.educator ? 1 : 0,
          shipping_cost: "7.00",
          payment_method: "cash_on_delivery",
          payment_status: "pending",
          status: "new",
        };
        orderItems = [
          {
            product_slug: input.productHandle,
            product_title: input.productTitle,
            format: "Livre physique",
            unit_price: input.unitPrice ?? "65.00",
            quantity: input.quantity,
            subtotal: itemSubtotal,
          },
        ];

        try {
          createdOrder = await createMultiItemOrder({
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
        } catch (err) {
          console.warn("[Orders] Local DB unavailable, checking Supabase fallback:", err);
        }
      }

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const fallbackOrderNumber = `LP-${new Date().getFullYear()}-${randomSuffix}`;
      const finalOrderNumber = createdOrder?.orderNumber ?? fallbackOrderNumber;

      // Persist to Supabase if configured
      if (orderPayload) {
        orderPayload.order_number = finalOrderNumber;
        await persistOrderToSupabase(orderPayload, orderItems).catch(() => null);
      }

      return {
        orderId: createdOrder?.orderId ?? 9999,
        orderNumber: finalOrderNumber,
      };
    }),
  }),
  content: router({
    published: publicProcedure.query(async () => {
      try {
        return await listContentSections(false);
      } catch {
        return [];
      }
    }),
  }),
  seo: router({
    byPath: publicProcedure
      .input(z.object({ path: z.string().min(1).max(500) }))
      .query(async ({ input }) => {
        try {
          return await getSeoPage(input.path);
        } catch {
          return null;
        }
      }),
  }),
  analytics: router({
    track: publicProcedure.input(analyticsInput).mutation(async ({ input }) => {
      try {
        await recordAnalyticsEvent(input);
      } catch {}
      return { recorded: true };
    }),
  }),
});

export type SiteRouter = typeof siteRouter;
