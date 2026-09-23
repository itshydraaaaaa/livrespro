import { z } from "zod";
import {
  getStorefrontCollectionByHandle,
  getStorefrontProductByHandle,
  listStorefrontCollections,
  listStorefrontProducts,
} from "../services/bookstoreService";
import { publicProcedure, router } from "../_core/trpc";

export const commerceRouter = router({
  products: router({
    list: publicProcedure
      .input(
        z
          .object({
            first: z.number().int().min(1).max(100).optional(),
            collectionHandle: z.string().min(1).optional(),
          })
          .optional()
      )
      .query(async ({ input }) => {
        return listStorefrontProducts(input ?? {});
      }),
    byHandle: publicProcedure
      .input(z.object({ handle: z.string().min(1) }))
      .query(async ({ input }) => {
        return getStorefrontProductByHandle(input.handle);
      }),
  }),
  collections: router({
    list: publicProcedure
      .input(z.object({ first: z.number().int().min(1).max(50).optional() }).optional())
      .query(async () => {
        return listStorefrontCollections();
      }),
    byHandle: publicProcedure
      .input(z.object({ handle: z.string().min(1) }))
      .query(async ({ input }) => {
        return getStorefrontCollectionByHandle(input.handle);
      }),
  }),
});

export type CommerceRouter = typeof commerceRouter;
