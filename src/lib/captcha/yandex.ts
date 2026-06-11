import { getClientIp } from "@/lib/security/clientIp";

const VALIDATE_URL = "https://smartcaptcha.yandexcloud.net/validate";

interface ValidateResponse {
  status: "ok" | "failed";
  message?: string;
  host?: string;
}

export function isCaptchaConfigured(): boolean {
  return Boolean(
    process.env.YANDEX_CAPTCHA_SERVER_KEY?.trim() &&
      process.env.NEXT_PUBLIC_YANDEX_CAPTCHA_CLIENT_KEY?.trim(),
  );
}

export async function verifyYandexCaptcha(
  token: string | null | undefined,
  request: Request,
): Promise<boolean> {
  const secret = process.env.YANDEX_CAPTCHA_SERVER_KEY?.trim();
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("[captcha] YANDEX_CAPTCHA_SERVER_KEY is not set.");
      return false;
    }
    console.warn("[captcha] YANDEX_CAPTCHA_SERVER_KEY missing — skipping validation in dev.");
    return true;
  }

  if (!token?.trim()) {
    return false;
  }

  const body = new URLSearchParams({
    secret,
    token: token.trim(),
    ip: getClientIp(request),
  });

  try {
    const response = await fetch(VALIDATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[captcha] validate HTTP", response.status);
      return false;
    }

    const payload = (await response.json()) as ValidateResponse;
    return payload.status === "ok";
  } catch (error) {
    console.error("[captcha] validate failed", error);
    return false;
  }
}
