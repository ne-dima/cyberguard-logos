import { requireAdminApi } from "@/lib/admin/guard";
import { buildApplicationsWorkbook } from "@/lib/applications/exportExcel";
import { readApplications } from "@/lib/applications/storage";

export async function GET(request: Request) {
  const auth = await requireAdminApi(request);
  if (auth instanceof Response) {
    return auth;
  }

  const applications = await readApplications();
  const buffer = await buildApplicationsWorkbook(applications);
  const filename = `cyber-intensive-applications-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
