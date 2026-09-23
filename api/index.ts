export default async function handler(req: any, res: any) {
  try {
    const { app } = await import("../server/app");
    return app(req, res);
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "API Handler Boot Error",
        message: err?.message || String(err),
        stack: err?.stack || null,
      })
    );
  }
}
