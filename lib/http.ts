import "server-only";

/** Shared helpers for the JSON API route handlers. */

export const noStoreHeaders = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };

export function jsonResponse(body: unknown, status: number, extra: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { ...noStoreHeaders, ...extra } });
}

/** Rejects requests from other sites so the endpoints aren't usable as public proxies. */
export function isSameOrigin(request: Request): boolean {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

export type JsonBodyResult =
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; status: number; error: "invalid_request" | "too_large" };

/** Reads a JSON object body with a byte limit. Rejects arrays and non-objects. */
export async function readJsonObject(request: Request, maxBytes: number): Promise<JsonBodyResult> {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return { ok: false, status: 415, error: "invalid_request" };
  }
  if (Number(request.headers.get("content-length") ?? 0) > maxBytes) {
    return { ok: false, status: 413, error: "too_large" };
  }
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return { ok: false, status: 400, error: "invalid_request" };
  }
  if (new TextEncoder().encode(raw).byteLength > maxBytes) {
    return { ok: false, status: 413, error: "too_large" };
  }
  try {
    const body: unknown = JSON.parse(raw);
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return { ok: false, status: 400, error: "invalid_request" };
    }
    return { ok: true, body: body as Record<string, unknown> };
  } catch {
    return { ok: false, status: 400, error: "invalid_request" };
  }
}
