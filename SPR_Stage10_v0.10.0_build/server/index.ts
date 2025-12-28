import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupAuth } from "./auth";
import { serveStatic } from "./static";
import { createServer } from "http";
import crypto from "crypto";

const app = express();
const httpServer = createServer(app);

let sentryCapture: ((err: any, ctx?: any) => void) | null = null;

setupAuth(app);

function jsonLog(level: "debug" | "info" | "warn" | "error", payload: Record<string, any>) {
  const ts = new Date().toISOString();
  const line = { ts, level, ...payload };
  // Keep logs machine-readable for production, while still readable locally.
  // Consumers can pipe to jq / log drain.
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(line));
}

app.use((req, res, next) => {
  const rid =
    (req.headers["x-request-id"] as string) ||
    crypto.randomUUID?.() ||
    crypto.randomBytes(16).toString("hex");
  (req as any).requestId = rid;
  res.setHeader("X-Request-Id", rid);
  next();
});

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Minimal CORS for extension/dev clients
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Request-Id");
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
});

export function log(message: string, source = "express") {
  jsonLog("info", { source, msg: message });
}

// Structured request log (API only)
app.use((req, res, next) => {
  const start = Date.now();
  const requestId = (req as any).requestId;

  res.on("finish", () => {
    if (!req.path.startsWith("/api")) return;
    const durationMs = Date.now() - start;
    jsonLog("info", {
      source: "http",
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs,
      userId: (req as any).user?.id,
    });
  });

  next();
});

(async () => {
  // Optional Sentry: set SENTRY_DSN and install @sentry/node to enable.
  if (process.env.SENTRY_DSN) {
    try {
      const Sentry = await import("@sentry/node");
      if (Sentry?.init) {
        Sentry.init({
          dsn: process.env.SENTRY_DSN,
          environment: process.env.NODE_ENV || "development",
        });
        sentryCapture = (err, ctx) => {
          try {
            Sentry.captureException(err, ctx);
          } catch {
            // ignore
          }
        };
        jsonLog("info", { source: "sentry", msg: "Sentry enabled" });
      }
    } catch (err) {
      jsonLog("warn", {
        source: "sentry",
        msg: "SENTRY_DSN set but @sentry/node not installed; Sentry disabled",
      });
    }
  }

  await registerRoutes(httpServer, app);

  // important: vite only in development, after routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();

// Final error handler with request id
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const requestId = (_req as any).requestId;
  try {
    sentryCapture?.(err, { tags: { requestId } });
  } catch {
    // ignore
  }
  jsonLog("error", {
    source: "error",
    requestId,
    message: err?.message || "Unhandled error",
    stack: process.env.NODE_ENV === "development" ? err?.stack : undefined,
  });
  res.status(500).json({ message: "Internal Server Error", requestId });
});
