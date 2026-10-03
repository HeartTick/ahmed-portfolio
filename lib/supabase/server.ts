import "server-only";

/**
 * Minimal server-only Supabase client for calling Postgres functions (RPC)
 * through Supabase's REST API.
 *
 * Why not @supabase/supabase-js: V2.2 only needs a handful of RPC calls
 * from trusted route handlers, and plain `fetch` keeps the dependency tree
 * unchanged. All writes go through Postgres functions defined in
 * supabase/migrations, so arguments are sent as JSON and bound as typed
 * function parameters; no SQL is ever built from request data.
 *
 * Uses Supabase's secret API key (`sb_secret_...`), sent in the `apikey`
 * header as Supabase recommends. Secret keys map to the `service_role`
 * Postgres role. The legacy `service_role` JWT also works in this header.
 */

export class SupabaseError extends Error {
  constructor(
    readonly kind: "unconfigured" | "unavailable",
    message: string,
  ) {
    super(message);
    this.name = "SupabaseError";
  }
}

type SupabaseConfig = { url: string; secretKey: string };

function readConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "");
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !secretKey) return null;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    console.error("[supabase] SUPABASE_URL is not a valid URL");
    return null;
  }
  // Plain http is only acceptable for a local development stack.
  const isLocal = ["localhost", "127.0.0.1"].includes(parsed.hostname);
  if (parsed.protocol !== "https:" && !isLocal) {
    console.error("[supabase] SUPABASE_URL must use https");
    return null;
  }
  return { url, secretKey };
}

/** True when URL and secret key are set. Never exposes either value. */
export function isSupabaseConfigured(): boolean {
  return readConfig() !== null;
}

/**
 * Calls a Postgres function exposed through Supabase's REST API.
 * Throws SupabaseError; callers map it to a generic user-facing message.
 * Database error details are logged server-side only, never returned.
 */
export async function callRpc<T>(fn: string, args: Record<string, unknown>, timeoutMs = 5_000): Promise<T> {
  const config = readConfig();
  if (!config) throw new SupabaseError("unconfigured", "Supabase is not configured");

  let res: Response;
  try {
    res = await fetch(`${config.url}/rest/v1/rpc/${encodeURIComponent(fn)}`, {
      method: "POST",
      headers: {
        apikey: config.secretKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    throw new SupabaseError("unavailable", `RPC ${fn} request failed: ${(err as Error).name}`);
  }

  if (!res.ok) {
    // PostgREST error bodies can contain schema details: log a short code only.
    const detail = await res.json().catch(() => null);
    const code = (detail as { code?: string } | null)?.code ?? "unknown";
    throw new SupabaseError("unavailable", `RPC ${fn} failed with HTTP ${res.status} (code ${code})`);
  }

  return (await res.json()) as T;
}
