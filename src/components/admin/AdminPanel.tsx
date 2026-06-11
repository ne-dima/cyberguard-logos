"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { ApplicationsTab } from "@/components/admin/ApplicationsTab";
import { InvitationsTab } from "@/components/admin/InvitationsTab";
import { Header } from "@/components/layout/Header";
import { adminFetch, setAdminCsrfToken } from "@/lib/http/adminFetch";
import { fetchJson } from "@/lib/http/fetchJson";

type AdminTab = "applications" | "invitations";

export function AdminPanel() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("applications");
  const [invitationsKey, setInvitationsKey] = useState(0);

  const checkSession = useCallback(async () => {
    const payload = await fetchJson<{ authenticated: boolean; csrfToken: string | null }>(
      "/api/admin/session",
    );
    setAuthenticated(payload.authenticated);
    setAdminCsrfToken(payload.csrfToken);
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  async function handleLogout() {
    await adminFetch("/api/admin/logout", { method: "POST" });
    setAdminCsrfToken(null);
    setAuthenticated(false);
  }

  function refreshInvitations() {
    setInvitationsKey((prev) => prev + 1);
  }

  if (authenticated === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg-muted px-5 py-10">
        <p className="text-text-muted">Проверяем сессию…</p>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg-muted px-5 py-10">
        <AdminLogin onSuccess={() => setAuthenticated(true)} />
      </main>
    );
  }

  return (
    <>
      <Header variant="admin" onLogout={handleLogout} />
      <main className="min-h-screen bg-bg-muted">
      <div className="mx-auto max-w-[1180px] px-5 py-8">
        <h1 className="font-heading text-2xl font-bold text-text">Админ-панель</h1>
        <p className="mt-1 text-sm text-text-muted">Заявки участников и приглашения</p>

        <div className="mb-6 mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("applications")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === "applications"
                ? "bg-accent text-white"
                : "bg-surface text-text-muted hover:bg-accent-light hover:text-accent"
            }`}
          >
            Заявки
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("invitations")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === "invitations"
                ? "bg-accent text-white"
                : "bg-surface text-text-muted hover:bg-accent-light hover:text-accent"
            }`}
          >
            Приглашения
          </button>
        </div>

        {activeTab === "applications" ? (
          <ApplicationsTab onRefreshInvitations={refreshInvitations} />
        ) : (
          <InvitationsTab key={invitationsKey} />
        )}
      </div>
      </main>
    </>
  );
}
