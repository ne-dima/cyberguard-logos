"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ApplicationDetailModal } from "@/components/admin/ApplicationDetailModal";
import { RejectModal } from "@/components/admin/RejectModal";
import { getApplicationPhotoUrl } from "@/lib/applications/photoUrl";
import { fetchJson } from "@/lib/http/fetchJson";
import {
  APPLICATION_STATUS_LABELS,
  type Application,
  type ApplicationStatus,
} from "@/types/application";

type StatusFilter = ApplicationStatus | "all";

const STATUS_FILTERS: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "Все" },
  { value: "new", label: "Новые" },
  { value: "accepted", label: "Принятые" },
  { value: "rejected", label: "Отклонённые" },
];

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

function formatDate(value: string): string {
  return new Date(value).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface ApplicationsTabProps {
  onRefreshInvitations?: () => void;
}

export function ApplicationsTab({ onRefreshInvitations }: ApplicationsTabProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Application | null>(null);
  const [detailTarget, setDetailTarget] = useState<Application | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const query = filter === "all" ? "" : `?status=${filter}`;
      const payload = await fetchJson<{ applications: Application[] }>(
        `/api/admin/applications${query}`,
      );
      setApplications(payload.applications);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Ошибка загрузки.");
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  useEffect(() => {
    const id = detailTarget?.id;
    if (!id) {
      return;
    }

    const updated = applications.find((item) => item.id === id);
    if (!updated) {
      return;
    }

    setDetailTarget((prev) => {
      if (!prev || prev.id !== id) {
        return prev;
      }
      if (
        prev.status === updated.status &&
        prev.rejectionComment === updated.rejectionComment &&
        prev.invitationSentAt === updated.invitationSentAt
      ) {
        return prev;
      }
      return updated;
    });
  }, [applications, detailTarget?.id]);

  async function updateStatus(
    id: string,
    status: ApplicationStatus,
    rejectionComment?: string,
  ) {
    setActionId(id);

    try {
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectionComment }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error || "Не удалось обновить статус.");
      }

      await loadApplications();
      onRefreshInvitations?.();
    } finally {
      setActionId(null);
    }
  }

  async function handleRejectConfirm(comment: string) {
    if (!rejectTarget) {
      return;
    }
    await updateStatus(rejectTarget.id, "rejected", comment);
    setRejectTarget(null);
  }

  function openDetail(application: Application) {
    setDetailTarget(application);
  }

  function handleDetailAccept(application: Application) {
    void updateStatus(application.id, "accepted");
  }

  function handleDetailReject(application: Application) {
    setRejectTarget(application);
  }

  function handleExport() {
    window.open("/api/admin/applications/export", "_blank");
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                filter === item.value
                  ? "bg-accent text-white"
                  : "bg-surface text-text-muted hover:bg-accent-light hover:text-accent"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <Button variant="secondary" size="sm" onClick={handleExport}>
          Экспорт Excel
        </Button>
      </div>

      {error ? (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <p className="mt-8 text-text-muted">Загрузка заявок…</p>
      ) : applications.length === 0 ? (
        <p className="mt-8 rounded-[20px] border border-dashed border-border bg-surface p-8 text-center text-text-muted">
          Заявок пока нет. Как только участники отправят анкеты, они появятся здесь.
        </p>
      ) : (
        <div className="mt-6 grid gap-4">
          {applications.map((application) => (
            <article
              key={application.id}
              role="button"
              tabIndex={0}
              onClick={() => openDetail(application)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openDetail(application);
                }
              }}
              className="cursor-pointer rounded-[20px] border border-border bg-surface p-5 shadow-sm transition-all hover:border-accent/25 hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getApplicationPhotoUrl(application.photoPath)}
                      alt={application.fullName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading text-lg font-bold text-text">
                      {application.fullName}
                    </h3>
                    <p className="mt-1 text-sm text-text-muted">
                      {application.organization} · {formatDate(application.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[application.status]}`}
                  >
                    {APPLICATION_STATUS_LABELS[application.status]}
                  </span>

                  {application.status !== "accepted" ? (
                    <Button
                      size="sm"
                      variant="success"
                      disabled={actionId === application.id}
                      onClick={(event) => {
                        event.stopPropagation();
                        void updateStatus(application.id, "accepted");
                      }}
                    >
                      Принять
                    </Button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ApplicationDetailModal
        application={detailTarget}
        isOpen={Boolean(detailTarget)}
        onClose={() => setDetailTarget(null)}
        onAccept={handleDetailAccept}
        onReject={handleDetailReject}
        isActionPending={Boolean(actionId)}
      />

      <RejectModal
        application={rejectTarget}
        isOpen={Boolean(rejectTarget)}
        onClose={() => setRejectTarget(null)}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
}
