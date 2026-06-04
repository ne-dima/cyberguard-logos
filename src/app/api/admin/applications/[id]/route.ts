import { NextResponse } from "next/server";
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin/auth";
import { getApplicationById, updateApplication } from "@/lib/applications/storage";
import {
  sendApplicationAcceptedEmail,
  sendApplicationRejectedEmail,
} from "@/lib/email/sendEmail";
import type { ApplicationStatus } from "@/types/application";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse();
  }

  const { id } = await context.params;
  const body = (await request.json()) as {
    status?: ApplicationStatus;
    rejectionComment?: string;
  };

  const existing = await getApplicationById(id);
  if (!existing) {
    return NextResponse.json({ error: "Заявка не найдена." }, { status: 404 });
  }

  if (body.status === "rejected" && !body.rejectionComment?.trim()) {
    return NextResponse.json(
      { error: "Укажите комментарий (причину отказа)." },
      { status: 400 },
    );
  }

  const updated = await updateApplication(id, {
    status: body.status,
    rejectionComment:
      body.status === "rejected" ? body.rejectionComment?.trim() : body.rejectionComment?.trim() || undefined,
  });

  if (!updated) {
    return NextResponse.json({ error: "Не удалось обновить заявку." }, { status: 500 });
  }

  if (body.status === "accepted" && existing.status !== "accepted") {
    await sendApplicationAcceptedEmail(updated.email, updated.fullName);
  }

  if (body.status === "rejected" && body.rejectionComment?.trim()) {
    await sendApplicationRejectedEmail(
      updated.email,
      updated.fullName,
      body.rejectionComment.trim(),
    );
  }

  return NextResponse.json({ application: updated });
}
