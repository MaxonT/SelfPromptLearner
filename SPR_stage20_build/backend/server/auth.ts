import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import crypto from "crypto";
import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { pool } from "./db";
import connectPgSimple from "connect-pg-simple";

const SESSION_SECRET = (() => {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET is required in production");
  }
  // Stable-ish dev secret derived from cwd to avoid hard-coded credentials.
  const seed = process.cwd();
  return crypto.createHash("sha256").update(seed).digest("hex").slice(0, 48);
})();

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const key = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${key}`;
}

export function verifyPassword(password: string, passwordHash: string): boolean {
  const [salt, key] = passwordHash.split(":");
  if (!salt || !key) return false;
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(key, "hex"), Buffer.from(derived, "hex"));
}

export function newApiToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

export function setupAuth(app: Express) {
  const PgSession = connectPgSimple(session);
  
  app.use(
    session({
      store: new PgSession({
        pool: pool,
        tableName: "user_sessions",
        createTableIfMissing: true,
      }),
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 30,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) return done(null, false, { message: "Invalid credentials" });
        if (!verifyPassword(password, user.passwordHash)) {
          return done(null, false, { message: "Invalid credentials" });
        }
        return done(null, { id: user.id, email: user.email });
      } catch (err) {
        return done(err as any);
      }
    }),
  );

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      // Minimal: we only need id; email/token fetched in /me
      return done(null, { id });
    } catch (err) {
      return done(err as any);
    }
  });
}

export function getUserIdFromRequest(req: Request): string | null {
  const auth = req.headers.authorization || "";
  if (auth.toLowerCase().startsWith("bearer ")) {
    const token = auth.slice(7).trim();
    if (token) return token; // treated as apiToken; resolved later
  }
  // @ts-ignore
  if (req.isAuthenticated && req.isAuthenticated()) {
    // @ts-ignore
    return req.user?.id ?? null;
  }
  return null;
}

export async function requireUser(req: Request, res: Response, next: NextFunction) {
  // Session user
  // @ts-ignore
  if (req.isAuthenticated && req.isAuthenticated() && req.user?.id) return next();

  // Bearer token user
  const auth = req.headers.authorization || "";
  if (auth.toLowerCase().startsWith("bearer ")) {
    const token = auth.slice(7).trim();
    const u = await storage.getUserByToken(token);
    if (!u) return res.status(401).json({ code: "UNAUTHORIZED", message: "Invalid token", requestId: (req as any).requestId });
    // attach user
    // @ts-ignore
    req.user = { id: u.id };
    return next();
  }

  return res.status(401).json({ code: "UNAUTHORIZED", message: "Unauthorized", requestId: (req as any).requestId });
}
