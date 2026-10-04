import {
  CONTACT_MAX_REQUEST_BYTES,
  CONTACT_MIN_FILL_MS,
  normalizeContact,
  validateContact,
  type ContactFields,
} from "@/lib/contact/validation";
import { isSameOrigin, jsonResponse, readJsonObject } from "@/lib/http";
import { getAnonymousSession, withSessionCookie } from "@/lib/session";
import { callRpc, isSupabaseConfigured } from "@/lib/supabase/server";
import { getUsageLimits } from "@/lib/usage-limits";

/**
 * POST /api/contact
 * Body: { name, email, company?, message, website (honeypot), elapsedMs }
 *
 * Responses:
 *   200 { ok: true }
 *   400 { error: "invalid_request" | "invalid_fields" | "too_fast", fields? }
 *   403 { error: "forbidden" }            cross-site request
 *   413 { error: "too_large" }
 *   429 { error: "limit" }                daily per-session limit reached
 *   503 { error: "unavailable" }          Supabase not configured or failing
 *
 * Stores only name, email, optional company and message. No IP address, user
 * agent or other metadata is recorded.
 */

export const runtime = "nodejs";

const ALLOWED_KEYS = new Set(["name", "email", "company", "message", "website", "elapsedMs"]);

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonResponse({ error: "forbidden" }, 403);

  const parsed = await readJsonObject(request, CONTACT_MAX_REQUEST_BYTES);
  if (!parsed.ok) return jsonResponse({ error: parsed.error }, parsed.status);
  const body = parsed.body;

  // Only known fields are accepted; nothing from the body is passed through blindly.
  if (Object.keys(body).some((key) => !ALLOWED_KEYS.has(key))) {
    return jsonResponse({ error: "invalid_request" }, 400);
  }
  const { name, email, company = "", message, website = "", elapsedMs } = body;
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof company !== "string" ||
    typeof message !== "string" ||
    typeof website !== "string" ||
    typeof elapsedMs !== "number" ||
    !Number.isFinite(elapsedMs)
  ) {
    return jsonResponse({ error: "invalid_request" }, 400);
  }

  // Honeypot: real visitors never see this field. Pretend success, store nothing.
  if (website.trim() !== "") return jsonResponse({ ok: true }, 200);

  if (elapsedMs < CONTACT_MIN_FILL_MS) return jsonResponse({ error: "too_fast" }, 400);

  const fields: ContactFields = normalizeContact({ name, email, company, message });
  const errors = validateContact(fields);
  if (Object.keys(errors).length > 0) {
    return jsonResponse({ error: "invalid_fields", fields: errors }, 400);
  }

  if (!isSupabaseConfigured()) return jsonResponse({ error: "unavailable" }, 503);

  const session = getAnonymousSession(request);
  try {
    const [result] = await callRpc<{ allowed: boolean; remaining: number }[]>("submit_contact_inquiry", {
      p_session_hash: session.hash,
      p_daily_limit: getUsageLimits().contactDailySessionLimit,
      p_name: fields.name,
      p_email: fields.email,
      p_company: fields.company,
      p_message: fields.message,
    });
    if (!result?.allowed) return withSessionCookie(jsonResponse({ error: "limit" }, 429), session);
    return withSessionCookie(jsonResponse({ ok: true }, 200), session);
  } catch (err) {
    console.error("[contact] could not store inquiry:", (err as Error).message);
    return withSessionCookie(jsonResponse({ error: "unavailable" }, 503), session);
  }
}

export function GET() {
  return jsonResponse({ error: "method_not_allowed" }, 405, { Allow: "POST" });
}
