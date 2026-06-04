import { NextResponse } from "next/server";
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin/auth";
import { buildApplicationsWorkbook } from "@/lib/applications/exportExcel";
import { readApplications } from "@/lib/applications/storage";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse();
  }

  let applications;
  try {
    applications = await readApplications();
  } catch (error) {
    console.error("GET /api/admin/applications/export failed:", error);
    return NextResponse.json({ error: "Не удалось экспортировать заявки." }, { status: 500 });
  }
  const buffer = await buildApplicationsWorkbook(applications);
  const filename = `applications-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
