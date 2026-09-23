import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMocks = vi.hoisted(() => ({
  getAdminOverview: vi.fn(),
  getAnalyticsSummary: vi.fn(),
  listContentSections: vi.fn(),
  listSeoPages: vi.fn(),
  recordAnalyticsEvent: vi.fn(),
  saveContentSection: vi.fn(),
  saveSeoPage: vi.fn(),
  getSeoPage: vi.fn(),
}));

vi.mock("./db", () => dbMocks);

import { appRouter } from "./routers";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function context(role: "user" | "admin" | null): TrpcContext {
  const user: AuthenticatedUser | null = role
    ? {
        id: 7,
        openId: "backoffice-test",
        name: "Test",
        email: "test@example.com",
        loginMethod: "manus",
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      }
    : null;
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("back-office tRPC", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.getAdminOverview.mockResolvedValue({ contentSections: 2, publishedSections: 1, seoPages: 3, analytics: { uniqueVisitors: 12 } });
    dbMocks.recordAnalyticsEvent.mockResolvedValue(undefined);
  });

  it("refuses dashboard metrics to a regular account", async () => {
    const caller = appRouter.createCaller(context("user"));
    await expect(caller.admin.overview()).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(dbMocks.getAdminOverview).not.toHaveBeenCalled();
  });

  it("returns metrics only to the admin role", async () => {
    const caller = appRouter.createCaller(context("admin"));
    await expect(caller.admin.overview({ days: 14 })).resolves.toMatchObject({ seoPages: 3, analytics: { uniqueVisitors: 12 } });
    expect(dbMocks.getAdminOverview).toHaveBeenCalledWith(14);
  });

  it("records a consent payload limited to an anonymous path and known event", async () => {
    const caller = appRouter.createCaller(context(null));
    const visitorId = "c648aa6b-6acf-471c-849c-215b2082f3d9";
    const sessionId = "d1aeb4c2-9b8a-4950-814d-b0ed5397dba4";

    await expect(caller.site.analytics.track({
      visitorId,
      sessionId,
      eventType: "view_book",
      path: "/livres/strategie",
      referrer: "https://example.com",
      metadata: { productHandle: "strategie" },
    })).resolves.toEqual({ recorded: true });

    expect(dbMocks.recordAnalyticsEvent).toHaveBeenCalledWith({
      visitorId,
      sessionId,
      eventType: "view_book",
      path: "/livres/strategie",
      referrer: "https://example.com",
      metadata: { productHandle: "strategie" },
    });
  });

  it("rejects tracking URL parameters so they cannot carry personal data", async () => {
    const caller = appRouter.createCaller(context(null));
    await expect(caller.site.analytics.track({
      visitorId: "c648aa6b-6acf-471c-849c-215b2082f3d9",
      sessionId: "d1aeb4c2-9b8a-4950-814d-b0ed5397dba4",
      eventType: "page_view",
      path: "/librairie?email=personne@example.com",
      metadata: null,
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(dbMocks.recordAnalyticsEvent).not.toHaveBeenCalled();
  });
});
