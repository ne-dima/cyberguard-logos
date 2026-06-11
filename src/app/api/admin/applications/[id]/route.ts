import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/guard";
import { getApplicationById, updateApplication } from "@/lib/applications/storage";
import {
  sendApplicationAcceptedEmail,
  sendApplicationRejectedEmail,
} from "@/lib/email/sendEmail";
import { FIELD_LIMITS, exceedsMaxLength } from "@/lib/security/limits";
import type { ApplicationStatus } from "@/types/application";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const VALID_STATUSES = new Set<ApplicationStatus>(["new", "accepted", "rejected"]);

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdminApi(request, { requireCsrf: true });
  if (auth instanceof Response) {
    return auth;
  }

  const { id } = await context.params;
  const body = (await request.json()) as {
    status?: ApplicationStatus;
    rejectionComment?: string;
  };

  if (body.status && !VALID_STATUSES.has(body.status)) {
    return NextResponse.json({ error: "Некорректный статус." }, { status: 400 });
  }

  const rejectionComment = body.rejectionComment?.trim() ?? "";
  if (exceedsMaxLength(rejectionComment, FIELD_LIMITS.rejectionComment)) {
    return NextResponse.json({ error: "Комментарий слишком длинный." }, { status: 400 });
  }

  const existing = await getApplicationById(id);
  if (!existing) {
    return NextResponse.json({ error: "Заявка не найдена." }, { status: 404 });
  }

  if (body.status === "rejected" && !rejectionComment) {
    return NextResponse.json(
      { error: "Укажите комментарий (причину отказа)." },
      { status: 400 },
    );
  }

  const updated = await updateApplication(id, {
    status: body.status,
    rejectionComment:
      body.status === "rejected" ? rejectionComment : rejectionComment || undefined,
  });

  if (!updated) {
    return NextResponse.json({ error: "Не удалось обновить заявку." }, { status: 500 });
  }

  if (body.status === "accepted" && existing.status !== "accepted") {
    await sendApplicationAcceptedEmail(updated.email, updated.fullName);
  }

  if (body.status === "rejected" && rejectionComment) {
    await sendApplicationRejectedEmail(updated.email, updated.fullName, rejectionComment);
  }

  return NextResponse.json({ application: updated });
}
