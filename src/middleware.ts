import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
};

const CAPTCHA_ORIGINS = [
  "https://smartcaptcha.yandexcloud.net",
  "https://smartcaptcha.cloud.yandex.ru",
];

function buildContentSecurityPolicy(): string {
  const isDev = process.env.NODE_ENV !== "production";

  const scriptSrc = ["'self'", "'unsafe-inline'", ...CAPTCHA_ORIGINS];
  const connectSrc = ["'self'", ...CAPTCHA_ORIGINS];

  // React / Next.js dev (HMR, source maps) — не нужно в production
  if (isDev) {
    scriptSrc.push("'unsafe-eval'");
    connectSrc.push("ws:", "wss:");
  }

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    `style-src 'self' 'unsafe-inline' ${CAPTCHA_ORIGINS.join(" ")}`,
    `img-src 'self' data: blob: ${CAPTCHA_ORIGINS.join(" ")}`,
    "font-src 'self'",
    `connect-src ${connectSrc.join(" ")}`,
    `frame-src ${CAPTCHA_ORIGINS.join(" ")}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

export function middleware(_request: NextRequest) {
  const response = NextResponse.next();

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  response.headers.set("Content-Security-Policy", buildContentSecurityPolicy());

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico)$).*)",
  ],
};
