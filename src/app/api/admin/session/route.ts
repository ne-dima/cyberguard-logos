import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/guard";

export async function GET() {
  const session = await getAdminSession();
  return NextResponse.json({
    authenticated: Boolean(session),
    csrfToken: session?.csrf ?? null,
  });
}
