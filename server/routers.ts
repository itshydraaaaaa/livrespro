import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  clearSessionCookie,
  createSessionToken,
  setSessionCookie,
  verifyPassword,
} from "./_core/auth";
import { getUserByEmail, updateLastSignedIn } from "./db";
import { adminRouter } from "./routers/admin";
import { commerceRouter } from "./routers/commerce";
import { siteRouter } from "./routers/site";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),

    login: publicProcedure
      .input(
        z.object({
          email: z.string().email("Adresse email invalide"),
          password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const user = await getUserByEmail(input.email);
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Identifiants invalides",
          });
        }

        const isValid = verifyPassword(input.password, user.passwordHash);
        if (!isValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Identifiants invalides",
          });
        }

        const sessionUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };

        const token = await createSessionToken(sessionUser);
        setSessionCookie(ctx.res, token);
        await updateLastSignedIn(user.id);

        return {
          success: true,
          user: sessionUser,
        };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      clearSessionCookie(ctx.res);
      return {
        success: true,
      };
    }),
  }),
  commerce: commerceRouter,
  admin: adminRouter,
  site: siteRouter,
});

export type AppRouter = typeof appRouter;
