import { timingSafeEqual } from "crypto";

export const CSRF_HEADER = "x-csrf-token";

export function verifyCsrfToken(request: Request, expected: string): boolean {
  const provided = request.headers.get(CSRF_HEADER)?.trim();
  if (!provided || !expected) {
    return false;
  }

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(a, b);
}
