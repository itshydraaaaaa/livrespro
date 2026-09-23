// Neutralized legacy OAuth route - Authentication is now natively handled by Email/Password in server/_core/auth.ts
import type { Express } from "express";

export function registerOAuthRoutes(_app: Express) {
  // No-op: Native authentication active.
}
