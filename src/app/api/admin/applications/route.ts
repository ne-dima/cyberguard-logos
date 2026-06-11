import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/guard";
import { readApplications } from "@/lib/applications/storage";
import type { ApplicationStatus } from "@/types/application";

const VALID_STATUSES = new Set<ApplicationStatus>(["new", "accepted", "rejected"]);

export async function GET(request: Request) {
  const auth = await requireAdminApi(request);
  if (auth instanceof Response) {
    return auth;
  }

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");

  let applications = await readApplications();

  if (statusParam) {
    if (!VALID_STATUSES.has(statusParam as ApplicationStatus)) {
      return NextResponse.json({ error: "Некорректный фильтр статуса." }, { status: 400 });
    }
    applications = applications.filter((item) => item.status === statusParam);
  }

  return NextResponse.json({ applications });
}
