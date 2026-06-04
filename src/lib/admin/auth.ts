import { cookies } from "next/headers";
import { USER_MESSAGES } from "@/lib/messages/userMessages";
import { ADMIN_PASSWORD, ADMIN_SESSION_COOKIE, ADMIN_USERNAME } from "./config";

export const ADMIN_SESSION_VALUE = "authenticated";

export function verifyAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value === ADMIN_SESSION_VALUE;
}

export function unauthorizedResponse() {
  return Response.json({ error: USER_MESSAGES.adminUnauthorized }, { status: 401 });
}
