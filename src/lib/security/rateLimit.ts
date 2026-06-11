import { getClientIp } from "@/lib/security/clientIp";

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitBucket>();

const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanupExpired(now: number): void {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) {
    return;
  }
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export interface RateLimitConfig {
  /** Unique scope name, e.g. "admin-login". */
  scope: string;
  /** Max requests per window. */
  limit: number;
  /** Window size in seconds. */
  windowSec: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSec?: number;
}

export function checkRateLimit(request: Request, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  cleanupExpired(now);

  const ip = getClientIp(request);
  const key = `${config.scope}:${ip}`;
  const windowMs = config.windowSec * 1000;

  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }

  bucket.count += 1;

  if (bucket.count > config.limit) {
    const retryAfterSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    return { allowed: false, retryAfterSec };
  }

  return { allowed: true };
}

export function rateLimitResponse(retryAfterSec: number): Response {
  return Response.json(
    { error: "Слишком много запросов. Подождите немного и попробуйте снова." },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    },
  );
}

export const RATE_LIMITS = {
  adminLogin: { scope: "admin-login", limit: 5, windowSec: 15 * 60 },
  register: { scope: "register", limit: 3, windowSec: 60 * 60 },
  status: { scope: "status", limit: 30, windowSec: 60 * 60 },
  adminApi: { scope: "admin-api", limit: 120, windowSec: 60 },
} as const satisfies Record<string, RateLimitConfig>;
