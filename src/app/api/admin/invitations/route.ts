import { NextResponse } from "next/server";
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin/auth";
import { getApplicationById, updateApplication } from "@/lib/applications/storage";
import { sendInvitationEmail } from "@/lib/email/sendEmail";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse();
  }

  const body = (await request.json()) as { applicationId?: string };
  const application = body.applicationId
    ? await getApplicationById(body.applicationId)
    : null;

  if (!application) {
    return NextResponse.json({ error: "Заявка не найдена." }, { status: 404 });
  }

  if (application.status !== "accepted") {
    return NextResponse.json(
      { error: "Приглашение можно отправить только принятым участникам." },
      { status: 400 },
    );
  }

  await sendInvitationEmail(application.email, application.fullName);

  const updated = await updateApplication(application.id, {
    invitationSentAt: new Date().toISOString(),
  });

  return NextResponse.json({ application: updated });
}
