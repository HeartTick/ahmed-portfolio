import "server-only";

/**
 * Server-side abuse-protection limits, configurable through environment
 * variables. Invalid or missing values fall back to the defaults.
 */

function positiveInt(name: string, fallback: number, max = 100_000): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > max) {
    console.warn(`[config] ${name}="${raw}" is not a positive integer; using ${fallback}`);
    return fallback;
  }
  return value;
}

export function getUsageLimits() {
  return {
    /** Ask Ahmed AI questions per anonymous browser session per UTC day. */
    aiDailySessionLimit: positiveInt("AI_DAILY_SESSION_LIMIT", 5),
    /** Ask Ahmed AI questions across all visitors per UTC day (protects the Groq allowance). */
    aiGlobalDailyLimit: positiveInt("AI_GLOBAL_DAILY_LIMIT", 40),
    /** Successful contact-form submissions per anonymous browser session per UTC day. */
    contactDailySessionLimit: positiveInt("CONTACT_DAILY_SESSION_LIMIT", 3),
  };
}

/**
 * Development-only escape hatch for running Ask Ahmed AI locally without
 * Supabase. It requires an explicit opt-in AND a development server: `next
 * build`, `next start` and Vercel all run with NODE_ENV=production, so this
 * can never become production behavior.
 */
export function isAiQuotaDevBypassEnabled(): boolean {
  return process.env.NODE_ENV === "development" && process.env.AI_QUOTA_DEV_BYPASS === "true";
}
