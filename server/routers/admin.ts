import { z } from "zod";
import {
  createAuthor,
  createCategory,
  createProduct,
  getAdminOverview,
  getAnalyticsSummary,
  listAuthors,
  listCategories,
  listContentSections,
  listOrders,
  listProducts,
  listSeoPages,
  saveContentSection,
  saveSeoPage,
  updateAuthor,
  updateCategory,
  updateOrderStatus,
  updateProduct,
} from "../db";
import { adminProcedure, router } from "../_core/trpc";

const blankToNull = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value || null);

const contentInput = z.object({
  id: z.number().int().positive().optional(),
  key: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Utilisez uniquement des minuscules, chiffres et tirets."),
  eyebrow: blankToNull(120),
  title: z.string().trim().min(3).max(240),
  body: blankToNull(12_000),
  ctaLabel: blankToNull(80),
  ctaHref: blankToNull(500),
  imageUrl: blankToNull(2_000),
  status: z.enum(["draft", "published"]),
});

const seoInput = z.object({
  id: z.number().int().positive().optional(),
  path: z.string().trim().min(1).max(500).startsWith("/"),
  title: z.string().trim().min(10).max(160),
  description: z.string().trim().min(50).max(320),
  ogTitle: blankToNull(160),
  ogDescription: blankToNull(320),
  canonicalUrl: blankToNull(500),
  robots: z.enum(["index", "noindex"]),
});

const productInput = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().trim().min(2).max(300),
  slug: z.string().trim().min(2).max(180),
  sku: blankToNull(80),
  shortDescription: blankToNull(500),
  description: z.string().trim().min(10),
  productType: z.string().trim().default("Livre"),
  format: z.enum(["PHYSICAL_BOOK", "DIGITAL_BOOK", "EBOOK", "AUDIOBOOK", "OTHER"]).default("PHYSICAL_BOOK"),
  price: z.string().trim().regex(/^\d+(\.\d{1,2})?$/),
  compareAtPrice: blankToNull(32),
  currency: z.string().default("TND"),
  stockQuantity: z.number().int().min(0).default(100),
  availabilityStatus: z.enum(["in_stock", "out_of_stock", "preorder"]).default("in_stock"),
  isbn: blankToNull(40),
  publisher: blankToNull(180),
  language: z.string().default("Français"),
  pageCount: z.number().int().positive().optional().nullable(),
  coverImage: blankToNull(1000),
  categoryId: z.number().int().positive().optional().nullable(),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("published"),
  authorIds: z.array(z.number().int().positive()).optional(),
  galleryUrls: z.array(z.string().url()).optional(),
});

const categoryInput = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(120),
  description: blankToNull(1000),
  sortOrder: z.number().int().default(0),
  status: z.enum(["active", "inactive"]).default("active"),
});

const authorInput = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().trim().min(2).max(180),
  slug: z.string().trim().min(2).max(180),
  biography: blankToNull(3000),
  photo: blankToNull(1000),
  website: blankToNull(300),
});

export const adminRouter = router({
  overview: adminProcedure
    .input(z.object({ days: z.number().int().min(1).max(90).default(30) }).optional())
    .query(({ input }) => getAdminOverview(input?.days ?? 30)),

  orders: router({
    list: adminProcedure.query(() => listOrders()),
    updateStatus: adminProcedure
      .input(
        z.object({
          orderId: z.number().int().positive(),
          status: z.enum(["new", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
        })
      )
      .mutation(async ({ input }) => {
        await updateOrderStatus(input.orderId, input.status);
        return { success: true };
      }),
  }),

  products: router({
    list: adminProcedure.query(() => listProducts({ status: "all" })),
    save: adminProcedure.input(productInput).mutation(async ({ input }) => {
      const { id, authorIds, galleryUrls, featured, ...data } = input;
      const images = galleryUrls?.map((url) => ({ url })) ?? [];

      if (id) {
        await updateProduct(
          id,
          {
            ...data,
            featured: featured ? 1 : 0,
            categoryId: data.categoryId ?? null,
            pageCount: data.pageCount ?? null,
          },
          authorIds,
          images
        );
        return { id };
      }

      const newId = await createProduct(
        {
          ...data,
          featured: featured ? 1 : 0,
          categoryId: data.categoryId ?? null,
          pageCount: data.pageCount ?? null,
        },
        authorIds,
        images
      );
      return { id: newId };
    }),
  }),

  categories: router({
    list: adminProcedure.query(() => listCategories()),
    save: adminProcedure.input(categoryInput).mutation(async ({ input }) => {
      const { id, ...data } = input;
      if (id) {
        await updateCategory(id, data);
        return { id };
      }
      const newId = await createCategory(data);
      return { id: newId };
    }),
  }),

  authors: router({
    list: adminProcedure.query(() => listAuthors()),
    save: adminProcedure.input(authorInput).mutation(async ({ input }) => {
      const { id, ...data } = input;
      if (id) {
        await updateAuthor(id, data);
        return { id };
      }
      const newId = await createAuthor(data);
      return { id: newId };
    }),
  }),

  content: router({
    list: adminProcedure.query(() => listContentSections(true)),
    save: adminProcedure.input(contentInput).mutation(async ({ ctx, input }) => {
      const id = await saveContentSection({ ...input, updatedBy: ctx.user.id });
      return { id };
    }),
  }),

  seo: router({
    list: adminProcedure.query(() => listSeoPages()),
    save: adminProcedure.input(seoInput).mutation(async ({ ctx, input }) => {
      const id = await saveSeoPage({ ...input, updatedBy: ctx.user.id });
      return { id };
    }),
  }),

  audience: router({
    summary: adminProcedure
      .input(z.object({ days: z.number().int().min(1).max(90).default(30) }).optional())
      .query(({ input }) => getAnalyticsSummary(input?.days ?? 30)),
  }),
});
