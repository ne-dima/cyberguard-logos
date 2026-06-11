import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const SESSION_VERSION = 1;
export const ADMIN_SESSION_MAX_AGE_SEC = 8 * 60 * 60;

interface SessionPayload {
  v: number;
  exp: number;
  csrf: string;
}

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (secret && secret.length >= 32) {
    return secret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters in production.");
  }

  return "dev-only-insecure-session-secret-change-me!!";
}

function sign(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export function createAdminSessionToken(): { token: string; csrf: string } {
  const csrf = randomBytes(32).toString("hex");
  const exp = Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE_SEC;
  const payload = Buffer.from(JSON.stringify({ v: SESSION_VERSION, exp, csrf } satisfies SessionPayload)).toString(
    "base64url",
  );
  const signature = sign(payload);
  return { token: `${payload}.${signature}`, csrf };
}

export function verifyAdminSessionToken(token: string | undefined): SessionPayload | null {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expected = sign(payload);
  if (!safeEqual(signature, expected)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionPayload;
    if (parsed.v !== SESSION_VERSION || typeof parsed.exp !== "number" || typeof parsed.csrf !== "string") {
      return null;
    }
    if (parsed.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
