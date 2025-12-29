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
  const line = sanitizeLog({ ts, level, ...payload });
  // Keep logs machine-readable for production, while still readable locally.
  // Consumers can pipe to jq / log drain.
  process.stdout.write(JSON.stringify(line) + "\n");
}

function sanitizeLog(input: any): any {
  const SENSITIVE_KEYS = new Set([
    "password",
    "pass",
    "token",
    "authorization",
    "secret",
    "apiKey",
    "apikey",
    "session",
  ]);

  const walk = (v: any): any => {
    if (v === null || v === undefined) return v;
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return v;
    if (Array.isArray(v)) return v.map(walk);
    if (typeof v === "object") {
      const out: Record<string, any> = {};
      for (const [k, val] of Object.entries(v)) {
        if (SENSITIVE_KEYS.has(k.toLowerCase())) {
          out[k] = "<redacted>";
        } else {
          out[k] = walk(val);
        }
      }
      return out;
    }
    return String(v);
  };

  return walk(input);
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

// Security headers (helmet-like minimal baseline without extra deps)
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "same-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

  // Only add HSTS when we are behind HTTPS (Render/Fly/etc). Avoid breaking local dev.
  const proto = (req.headers["x-forwarded-proto"] as string) || "";
  if (proto.toLowerCase() === "https") {
    res.setHeader("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
  }

  next();
});

// CORS: strict allowlist (dashboard + optional extension origin). Never "*" for authenticated APIs.
app.use((req, res, next) => {
  const origin = (req.headers.origin as string) || "";

  const allow = new Set<string>();
  const appOrigin = (process.env.APP_ORIGIN || "").trim();
  const extOrigin = (process.env.EXTENSION_ORIGIN || "").trim();
  if (appOrigin) allow.add(appOrigin);
  if (extOrigin) allow.add(extOrigin);

  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
  const isAllowed = (origin && allow.has(origin)) || isLocal;

  if (isAllowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

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

  // 自动初始化数据库表（如果不存在）
  try {
    const { initDatabase } = await import("./init-db");
    await initDatabase();
  } catch (err) {
    console.error("数据库初始化失败:", err);
    // 继续启动，表可能已经存在
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
  
  // reusePort 在 Node 22+ macOS 上可能不支持，只在生产环境且明确需要时启用
  const listenOptions: any = {
    port,
    host: "0.0.0.0",
  };
  
  // 只在 Render 等支持 reusePort 的环境启用（通过环境变量控制）
  if (process.env.ENABLE_REUSE_PORT === "true") {
    listenOptions.reusePort = true;
  }
  
  httpServer.listen(
    listenOptions,
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
  res.status(500).json({ code: "INTERNAL_ERROR", message: "Internal Server Error", requestId });
});
