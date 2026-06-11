const WEAK_ADMIN_PASSWORDS = new Set(["admin123", "password", "admin", "12345678"]);

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";

export function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (password?.trim()) {
    return password;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_PASSWORD is required in production.");
  }

  return "admin123";
}

export function assertProductionSecurityConfig(): void {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password || password.length < 12 || WEAK_ADMIN_PASSWORDS.has(password)) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters and not a common default.");
  }

  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters in production.");
  }
}

/** @deprecated Use getAdminPassword — kept for imports during migration */
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

export const ADMIN_SESSION_COOKIE = "cyber_admin_session";
