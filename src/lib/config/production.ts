import { assertProductionSecurityConfig } from "@/lib/admin/config";

const WEAK_DB_PASSWORDS = new Set([
  "cyber_secret_change_me",
  "postgres",
  "password",
  "admin123",
]);

function databaseUrlLooksWeak(): boolean {
  const url = process.env.DATABASE_URL ?? "";
  for (const weak of WEAK_DB_PASSWORDS) {
    if (url.includes(`:${weak}@`) || url.includes(`:${weak}/`)) {
      return true;
    }
  }
  return false;
}

export function assertProductionRuntime(): void {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  assertProductionSecurityConfig();

  if (databaseUrlLooksWeak()) {
    throw new Error(
      "DATABASE_URL uses a default or weak password. Set a strong POSTGRES_PASSWORD in production.",
    );
  }

  if (process.env.EMAIL_MODE === "smtp") {
    if (!process.env.SMTP_HOST?.trim()) {
      throw new Error("SMTP_HOST is required when EMAIL_MODE=smtp.");
    }
    if (!process.env.SMTP_USER?.trim()) {
      throw new Error("SMTP_USER is required when EMAIL_MODE=smtp.");
    }
    if (!process.env.SMTP_PASS?.trim()) {
      throw new Error("SMTP_PASS is required when EMAIL_MODE=smtp.");
    }
  } else {
    console.warn("[production] EMAIL_MODE is not smtp — письма только в лог контейнера.");
  }

  if (!process.env.APP_URL?.trim()) {
    throw new Error("APP_URL is required in production (public HTTPS URL of the site).");
  }

  if (!process.env.NEXT_PUBLIC_YANDEX_CAPTCHA_CLIENT_KEY?.trim()) {
    throw new Error("NEXT_PUBLIC_YANDEX_CAPTCHA_CLIENT_KEY is required in production.");
  }
  if (!process.env.YANDEX_CAPTCHA_SERVER_KEY?.trim()) {
    throw new Error("YANDEX_CAPTCHA_SERVER_KEY is required in production.");
  }

  try {
    const parsed = new URL(process.env.APP_URL.trim());
    if (parsed.protocol !== "https:") {
      console.warn(
        "[production] APP_URL should use https:// in production for secure cookies and email links.",
      );
    }
  } catch {
    throw new Error("APP_URL must be a valid URL.");
  }
}
