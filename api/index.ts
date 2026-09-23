let appPromise: Promise<any> | null = null;

async function getApp() {
  if (!appPromise) {
    appPromise = import("../server/app").then((m) => m.app);
  }
  return appPromise;
}

export default async function handler(req: any, res: any) {
  try {
    const app = await getApp();
    return app(req, res);
  } catch (err: any) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 500;
    return res.end(
      JSON.stringify(
        {
          status: "error",
          error: {
            message: err?.message || String(err),
            stack: err?.stack || null,
          },
        },
        null,
        2
      )
    );
  }
}
