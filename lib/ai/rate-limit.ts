import "server-only";

/**
 * Global (per server instance) sliding-window limiter. It intentionally does
 * not key on IP addresses or any visitor identifier: no personal data is
 * kept. Its purpose is to cap spend if the endpoint is hammered.
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 30;

const timestamps: number[] = [];

export function takeRateLimitToken(now = Date.now()): boolean {
  while (timestamps.length && now - timestamps[0] > WINDOW_MS) timestamps.shift();
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) return false;
  timestamps.push(now);
  return true;
}
