import { app } from "../server/app";

export default function handler(req: any, res: any) {
  try {
    return app(req, res);
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "INTERNAL_SERVER_ERROR",
        message: err?.message || String(err),
      })
    );
  }
}
