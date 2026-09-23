import type { Express } from "express";

export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*", (_req, res) => {
    // Safely redirect any legacy references to local fallback editorial asset
    res.redirect(302, "/editorial/b2b-launch/audience.jpg");
  });
}

