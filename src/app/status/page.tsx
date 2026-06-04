import { Suspense } from "react";
import { StatusPageClient } from "@/components/status/StatusPageClient";

export default function StatusPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-bg-muted">
          <p className="text-text-muted">Загрузка…</p>
        </main>
      }
    >
      <StatusPageClient />
    </Suspense>
  );
}
