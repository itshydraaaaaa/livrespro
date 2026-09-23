// Neutralized legacy SDK - Authentication and sessions are natively handled in server/_core/auth.ts
import type { Request } from "express";
import type { User } from "../../drizzle/schema";

export type AuthenticatedUser = User & {
  taskUid?: string;
  isCron?: boolean;
};

export const sdk = {
  authenticateRequest: async (_req: Request): Promise<AuthenticatedUser | null> => null,
};
