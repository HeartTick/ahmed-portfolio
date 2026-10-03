import "server-only";

import { createHash, randomBytes } from "node:crypto";

/**
 * Anonymous browser session used only for abuse protection (daily AI quota
 * and contact-form throttling).
 *
 * - The identifier is 32 cryptographically random bytes, created on the server.
 *   It is not derived from IP addresses, user agents or any fingerprinting data.
 * - It lives in an HttpOnly, SameSite=Lax cookie scoped to /api, Secure in
 *   production, with a fixed 30-day lifetime (not renewed on use).
 * - Only a SHA-256 hash of it is ever sent to the database. The raw value is
 *   never stored or logged.
 */

export const SESSION_COOKIE = "portfolio_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
/** 32 random bytes encoded as base64url = 43 characters. */
const SESSION_FORMAT = /^[A-Za-z0-9_-]{43}$/;
/** Domain separation, so the hash can't be confused with any other SHA-256 use. */
const HASH_PREFIX = "portfolio_session:v1:";

export type AnonymousSession = {
  /** SHA-256 hex digest of the raw identifier: the only form the database sees. */
  hash: string;
  /** Set-Cookie header value when a new identifier was issued, otherwise null. */
  setCookie: string | null;
};

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    if (part.slice(0, index).trim() === name) return part.slice(index + 1).trim();
  }
  return null;
}

export function hashSessionId(id: string): string {
  return createHash("sha256").update(HASH_PREFIX + id).digest("hex");
}

function buildCookie(id: string): string {
  const attributes = [
    `${SESSION_COOKIE}=${id}`,
    "Path=/api",
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (process.env.NODE_ENV === "production") attributes.push("Secure");
  return attributes.join("; ");
}

/** Reads the visitor's session cookie, or issues a new random one. */
export function getAnonymousSession(request: Request): AnonymousSession {
  const existing = readCookie(request, SESSION_COOKIE);
  if (existing && SESSION_FORMAT.test(existing)) {
    return { hash: hashSessionId(existing), setCookie: null };
  }
  const id = randomBytes(32).toString("base64url");
  return { hash: hashSessionId(id), setCookie: buildCookie(id) };
}

/** Attaches the session cookie to a response when one was newly issued. */
export function withSessionCookie(response: Response, session: AnonymousSession | null): Response {
  if (session?.setCookie) response.headers.append("Set-Cookie", session.setCookie);
  return response;
}
