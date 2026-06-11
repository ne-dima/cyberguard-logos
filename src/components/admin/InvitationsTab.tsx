"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetchJson } from "@/lib/http/adminFetch";
import { Button } from "@/components/ui/Button";
import type { Application } from "@/types/application";

export function InvitationsTab() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadAccepted = useCallback(async () => {
    setIsLoading(true);

    try {
      const payload = await adminFetchJson<{ applications: Application[] }>(
        "/api/admin/applications?status=accepted",
      );
      setApplications(payload.applications);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccepted();
  }, [loadAccepted]);

  async function sendInvitation(applicationId: string) {
    setSendingId(applicationId);
    setMessage(null);

    try {
      await adminFetchJson("/api/admin/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId }),
      });

      setMessage("Приглашение отправлено (заглушка: смотрите консоль сервера).");
      await loadAccepted();
    } catch (sendError) {
      setMessage(sendError instanceof Error ? sendError.message : "Ошибка отправки.");
    } finally {
      setSendingId(null);
    }
  }

  return (
    <div>
      <div className="max-w-2xl">
        <h2 className="font-heading text-xl font-bold text-text">Приглашения</h2>
        <p className="mt-2 text-sm text-text-muted">
          Здесь можно вручную отправить приглашение принятым участникам. Программа и адрес
          будут добавлены в письмо позже.
        </p>
      </div>

      {message ? (
        <p className="mt-4 rounded-xl bg-accent-light px-4 py-3 text-sm text-accent">
          {message}
        </p>
      ) : null}

      {isLoading ? (
        <p className="mt-8 text-text-muted">Загрузка…</p>
      ) : applications.length === 0 ? (
        <p className="mt-8 rounded-[20px] border border-dashed border-border bg-surface p-8 text-center text-text-muted">
          Принятых участников пока нет.
        </p>
      ) : (
        <div className="mt-6 grid gap-4">
          {applications.map((application) => (
            <article
              key={application.id}
              className="flex flex-col gap-4 rounded-[20px] border border-border bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="font-heading text-lg font-bold text-text">
                  {application.fullName}
                </h3>
                <p className="mt-1 text-sm text-text-muted">{application.email}</p>
                {application.invitationSentAt ? (
                  <p className="mt-2 text-xs text-green-700">
                    Приглашение отправлено:{" "}
                    {new Date(application.invitationSentAt).toLocaleString("ru-RU")}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-text-muted">Приглашение ещё не отправлялось</p>
                )}
              </div>

              <Button
                size="sm"
                disabled={sendingId === application.id}
                onClick={() => sendInvitation(application.id)}
              >
                {sendingId === application.id ? "Отправляем..." : "Отправить приглашение"}
              </Button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
