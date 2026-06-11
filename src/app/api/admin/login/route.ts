import { NextResponse } from "next/server";
import { USER_MESSAGES } from "@/lib/messages/userMessages";
import {
  createAdminSessionCookie,
  createAdminSessionToken,
  verifyAdminCredentials,
} from "@/lib/admin/auth";
import { assertProductionSecurityConfig } from "@/lib/admin/config";
import {
  checkRateLimit,
  rateLimitResponse,
  RATE_LIMITS,
} from "@/lib/security/rateLimit";

export async function POST(request: Request) {
  assertProductionSecurityConfig();

  const limited = checkRateLimit(request, RATE_LIMITS.adminLogin);
  if (!limited.allowed) {
    return rateLimitResponse(limited.retryAfterSec ?? 60);
  }

  const body = (await request.json()) as { username?: string; password?: string };

  if (!verifyAdminCredentials(body.username ?? "", body.password ?? "")) {
    return NextResponse.json({ error: USER_MESSAGES.adminLoginFailed }, { status: 401 });
  }

  const { token, csrf } = createAdminSessionToken();
  const response = NextResponse.json({ ok: true, csrfToken: csrf });
  response.cookies.set(createAdminSessionCookie(token));

  return response;
}
