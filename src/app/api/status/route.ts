import { NextResponse } from "next/server";
import { verifyYandexCaptcha } from "@/lib/captcha/yandex";
import { getApplicationByEmail } from "@/lib/applications/storage";
import type { PublicApplicationStatus } from "@/types/application";
import { USER_MESSAGES } from "@/lib/messages/userMessages";
import {
  checkRateLimit,
  rateLimitResponse,
  RATE_LIMITS,
} from "@/lib/security/rateLimit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toPublicStatus(
  application: Awaited<ReturnType<typeof getApplicationByEmail>>,
): PublicApplicationStatus | null {
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

function randomDelayMs(): number {
  return 80 + Math.floor(Math.random() * 120);
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function lookupStatus(email: string) {
  const application = await getApplicationByEmail(email);
  return toPublicStatus(application);
}

export async function POST(request: Request) {
  const limited = checkRateLimit(request, RATE_LIMITS.status);
  if (!limited.allowed) {
    return rateLimitResponse(limited.retryAfterSec ?? 60);
  }

  const body = (await request.json()) as { email?: string; captchaToken?: string };
  const email = body.email?.trim() ?? "";
  const captchaToken = body.captchaToken;

  if (!(await verifyYandexCaptcha(captchaToken, request))) {
    return NextResponse.json({ error: USER_MESSAGES.captchaFailed }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: "Укажите адрес электронной почты." }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(email) || email.length > 254) {
    await delay(randomDelayMs());
    return NextResponse.json({ error: USER_MESSAGES.statusInvalidEmail }, { status: 400 });
  }

  const status = await lookupStatus(email);

  if (!status) {
    await delay(randomDelayMs());
    return NextResponse.json({ error: USER_MESSAGES.statusNotFound }, { status: 404 });
  }

  return NextResponse.json({ application: status });
}

/** @deprecated Используйте POST с captchaToken */
export async function GET() {
  return NextResponse.json(
    { error: "Метод не поддерживается. Используйте форму проверки статуса." },
    { status: 405 },
  );
}
