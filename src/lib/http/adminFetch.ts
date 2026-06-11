let csrfToken: string | null = null;

export function setAdminCsrfToken(token: string | null): void {
  csrfToken = token;
}

export function getAdminCsrfToken(): string | null {
  return csrfToken;
}

export async function adminFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  if (csrfToken) {
    headers.set("x-csrf-token", csrfToken);
  }

  return fetch(input, {
    ...init,
    headers,
    credentials: "same-origin",
  });
}

export async function adminFetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await adminFetch(input, init);
  const text = await response.text();

  let payload: unknown = {};
  if (text) {
    try {
      payload = JSON.parse(text) as unknown;
    } catch {
      throw new Error("Неверный ответ сервера.");
    }
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof (payload as { error: unknown }).error === "string"
        ? (payload as { error: string }).error
        : "Ошибка запроса.";
    throw new Error(message);
  }

  return payload as T;
}
