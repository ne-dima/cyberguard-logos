import { NextResponse } from "next/server";
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin/auth";
import { readApplications } from "@/lib/applications/storage";
import type { ApplicationStatus } from "@/types/application";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse();
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as ApplicationStatus | "all" | null;

    let applications = await readApplications();
    applications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    if (status && status !== "all") {
      applications = applications.filter((item) => item.status === status);
    }

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("GET /api/admin/applications failed:", error);
    return NextResponse.json({ error: "Не удалось загрузить заявки." }, { status: 500 });
  }
}
