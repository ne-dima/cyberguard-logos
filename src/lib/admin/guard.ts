import { cookies } from "next/headers";
import { unauthorizedResponse } from "@/lib/admin/auth";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin/config";
import { verifyCsrfToken } from "@/lib/security/csrf";
import { verifySameOrigin } from "@/lib/security/origin";
import {
  checkRateLimit,
  rateLimitResponse,
  RATE_LIMITS,
} from "@/lib/security/rateLimit";
import { verifyAdminSessionToken } from "@/lib/security/session";

export type AdminSession = NonNullable<ReturnType<typeof verifyAdminSessionToken>>;

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}

interface RequireAdminOptions {
  requireCsrf?: boolean;
  rateLimit?: boolean;
}

export async function requireAdminApi(
  request: Request,
  options: RequireAdminOptions = {},
): Promise<AdminSession | Response> {
  if (options.rateLimit !== false) {
    const limited = checkRateLimit(request, RATE_LIMITS.adminApi);
    if (!limited.allowed) {
      return rateLimitResponse(limited.retryAfterSec ?? 60);
    }
  }

  const session = await getAdminSession();
  if (!session) {
    return unauthorizedResponse();
  }

  if (!verifySameOrigin(request)) {
    return Response.json({ error: "Запрос отклонён." }, { status: 403 });
  }

  if (options.requireCsrf && !verifyCsrfToken(request, session.csrf)) {
    return Response.json({ error: "Недействительный CSRF-токен." }, { status: 403 });
  }

  return session;
}
