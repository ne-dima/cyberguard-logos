/** Matches defaults in docker-compose.yml for local `docker compose up db`. */
export const DEV_DEFAULT_DATABASE_URL =
  "postgresql://cyber:cyber_secret_change_me@localhost:5432/cyber_intensive";

export function resolveDatabaseUrl(): string {
  const fromEnv = process.env.DATABASE_URL?.trim();
  if (fromEnv) {
    return fromEnv;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is required in production.");
  }

  return DEV_DEFAULT_DATABASE_URL;
}

export function ensureDatabaseUrlEnv(): void {
  if (!process.env.DATABASE_URL?.trim()) {
    process.env.DATABASE_URL = resolveDatabaseUrl();
  }
}
