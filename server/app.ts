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

  // Restore path if rewritten by Vercel serverless gateway
  app.use((req, _res, next) => {
    const rawUrl = req.headers["x-matched-path"] || req.headers["x-vercel-matched-path"];
    if (typeof rawUrl === "string" && (rawUrl.startsWith("/api/") || rawUrl.startsWith("/manus-storage/"))) {
      req.url = rawUrl;
    }
    next();
  });

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
