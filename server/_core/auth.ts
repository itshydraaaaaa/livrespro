import crypto from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import type { Request, Response } from "express";
import { COOKIE_NAME } from "@shared/const";
import { ENV } from "./env";

const JWT_SECRET = process.env.JWT_SECRET || "livrespro-development-secret-key-at-least-32-chars";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export type AuthSession = {
  id: number;
  email: string;
  name: string | null;
  role: "admin" | "user";
};

/**
 * Hash a plain password using Node.js native scrypt with a cryptographic salt.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verify a plain password against a stored hash string.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

/**
 * Sign a JWT session token for an authenticated user.
 */
export async function createSessionToken(user: AuthSession): Promise<string> {
  return new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey);
}

/**
 * Verify and decode an incoming JWT session token.
 */
export async function verifySessionToken(token: string): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return {
      id: Number(payload.id),
      email: String(payload.email),
      name: payload.name ? String(payload.name) : null,
      role: (payload.role as "admin" | "user") || "user",
    };
  } catch {
    return null;
  }
}

/**
 * Attach the HTTP-only session cookie to the response.
 */
export function setSessionCookie(res: Response, token: string): void {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
}

/**
 * Clear the session cookie from the response.
 */
export function clearSessionCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    path: "/",
  });
}
