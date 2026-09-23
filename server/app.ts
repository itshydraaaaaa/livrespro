import express, { Express } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { registerStorageProxy } from "./_core/storageProxy";

export function createExpressApp(): Express {
  const app = express();

  // Configure body parser with larger size limit
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Neutralized storage proxy for legacy assets
  registerStorageProxy(app);

  // Health check endpoint
  app.get(["/api/health", "/health"], (_req, res) => {
    res.json({ status: "ok", app: "livrespro", timestamp: new Date().toISOString() });
  });

  // tRPC API middleware: handles both /api/trpc and /trpc (for Vercel rewrites)
  app.use(
    ["/api/trpc", "/trpc"],
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  return app;
}

export const app = createExpressApp();
