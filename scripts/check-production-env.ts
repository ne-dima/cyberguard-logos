/**
 * Validates .env for production deploy (run before docker compose up).
 * Usage: npx tsx scripts/check-production-env.ts [.env]
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.argv[2] ?? ".env");

if (!existsSync(envPath)) {
  console.error(`Файл не найден: ${envPath}`);
  console.error("Скопируйте: cp .env.production.example .env");
  process.exit(1);
}

const lines = readFileSync(envPath, "utf8").split("\n");
for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    continue;
  }
  const eq = trimmed.indexOf("=");
  if (eq === -1) {
    continue;
  }
  const key = trimmed.slice(0, eq).trim();
  let value = trimmed.slice(eq + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  if (value && !process.env[key]) {
    process.env[key] = value;
  }
}

process.env.NODE_ENV = "production";

async function main() {
  const { assertProductionRuntime } = await import("../src/lib/config/production");
  assertProductionRuntime();
  console.log("OK: переменные окружения подходят для production.");
}

main().catch((error) => {
  console.error("Ошибка проверки .env:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
