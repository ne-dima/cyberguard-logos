import { NextResponse } from "next/server";
import { getApplicationByEmail } from "@/lib/applications/storage";
import type { PublicApplicationStatus } from "@/types/application";

import { USER_MESSAGES } from "@/lib/messages/userMessages";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toPublicStatus(application: Awaited<ReturnType<typeof getApplicationByEmail>>): PublicApplicationStatus | null {
  if (!application) {
    return null;
  }

  return {
    fullName: application.fullName,
    email: application.email,
    status: application.status,
    rejectionComment: application.rejectionComment,
    createdAt: application.createdAt,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim() ?? "";

  if (!email) {
    return NextResponse.json({ error: "Укажите адрес электронной почты." }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: USER_MESSAGES.statusInvalidEmail }, { status: 400 });
  }

  const application = await getApplicationByEmail(email);
  const status = toPublicStatus(application);

  if (!status) {
    return NextResponse.json({ error: USER_MESSAGES.statusNotFound }, { status: 404 });
  }

  return NextResponse.json({ application: status });
}
