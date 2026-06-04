import { NextResponse } from "next/server";
import { USER_MESSAGES } from "@/lib/messages/userMessages";
import { ADMIN_SESSION_VALUE, verifyAdminCredentials } from "@/lib/admin/auth";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin/config";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };

  if (!verifyAdminCredentials(body.username ?? "", body.password ?? "")) {
    return NextResponse.json({ error: USER_MESSAGES.adminLoginFailed }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
