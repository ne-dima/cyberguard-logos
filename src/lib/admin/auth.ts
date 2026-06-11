import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { USER_MESSAGES } from "@/lib/messages/userMessages";
import { ADMIN_SESSION_COOKIE, ADMIN_USERNAME, getAdminPassword } from "./config";
import { getAdminSession } from "./guard";
import {
  ADMIN_SESSION_MAX_AGE_SEC,
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "@/lib/security/session";

function safeEqualString(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  const expectedUser = ADMIN_USERNAME;
  const expectedPassword = getAdminPassword();
  return safeEqualString(username, expectedUser) && safeEqualString(password, expectedPassword);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return (await getAdminSession()) !== null;
}

export async function getAdminCsrfFromSession(): Promise<string | null> {
  const session = await getAdminSession();
  return session?.csrf ?? null;
}

export function createAdminSessionCookie(token: string) {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "strict" as const,
    secure: isProduction,
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SEC,
  };
}

export function clearAdminSessionCookie() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "strict" as const,
    secure: isProduction,
    path: "/",
    maxAge: 0,
  };
}

export { createAdminSessionToken, verifyAdminSessionToken };

export function unauthorizedResponse() {
  return Response.json({ error: USER_MESSAGES.adminUnauthorized }, { status: 401 });
}
