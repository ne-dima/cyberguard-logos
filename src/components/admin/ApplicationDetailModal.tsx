"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { getApplicationPhotoUrl } from "@/lib/applications/photoUrl";
import { formatBirthDateWithAge } from "@/lib/format/birthDate";
import {
  APPLICATION_STATUS_LABELS,
  type Application,
  type ApplicationStatus,
} from "@/types/application";

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

interface DetailRowProps {
  label: string;
  children: ReactNode;
  className?: string;
}

function DetailRow({ label, children, className = "" }: DetailRowProps) {
  return (
    <div className={className}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium leading-relaxed text-text">{children}</dd>
    </div>
  );
}

interface ApplicationDetailModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept?: (application: Application) => void;
  onReject?: (application: Application) => void;
  isActionPending?: boolean;
}

export function ApplicationDetailModal({
  application,
  isOpen,
  onClose,
  onAccept,
  onReject,
  isActionPending = false,
}: ApplicationDetailModalProps) {
  if (!application) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={`Заявка: ${application.fullName}`}
      size="lg"
      scrollable
    >
      <div className="application-detail-card rounded-t-[20px] p-5 sm:rounded-[20px] sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="relative mx-auto h-36 w-36 shrink-0 overflow-hidden rounded-2xl border border-border bg-bg-muted sm:mx-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getApplicationPhotoUrl(application.photoPath)}
              alt={application.fullName}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-heading text-xl font-bold text-text sm:text-2xl">
                  {application.fullName}
                </h2>
                <p className="mt-1 text-sm text-text-muted">
                  Подана {formatDate(application.createdAt)}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[application.status]}`}
              >
                {APPLICATION_STATUS_LABELS[application.status]}
              </span>
            </div>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <DetailRow label="Дата рождения">
                {formatBirthDateWithAge(application.birthDate)}
              </DetailRow>
              <DetailRow label="Организация">{application.organization}</DetailRow>
              <DetailRow label="Телефон">
                <a href={`tel:${application.phone}`} className="text-accent hover:underline">
                  {application.phone}
                </a>
              </DetailRow>
              <DetailRow label="Email">
                <a href={`mailto:${application.email}`} className="text-accent hover:underline">
                  {application.email}
                </a>
              </DetailRow>
              <DetailRow label="Контакты родителей" className="sm:col-span-2">
                {application.parentContacts}
              </DetailRow>
              <DetailRow label="Место жительства" className="sm:col-span-2">
                {application.location}
              </DetailRow>
              <DetailRow label="Поступление в «ЛОГОС»">
                {application.wantsToEnroll ? "Да, хочет поступать" : "Нет"}
              </DetailRow>
            </dl>
          </div>
        </div>

        <section className="mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Мотивационное письмо
          </h3>
          <p className="mt-2 whitespace-pre-wrap rounded-xl border border-border bg-bg-muted/60 px-4 py-3 text-sm leading-relaxed text-text">
            {application.motivationLetter}
          </p>
        </section>

        {application.about ? (
          <section className="mt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              О себе
            </h3>
            <p className="mt-2 whitespace-pre-wrap rounded-xl border border-border bg-bg-muted/60 px-4 py-3 text-sm leading-relaxed text-text">
              {application.about}
            </p>
          </section>
        ) : null}

        {application.rejectionComment ? (
          <section className="mt-4 rounded-xl bg-red-50 px-4 py-3">
            <h3 className="text-xs font-semibold text-red-700">Комментарий отказа</h3>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-red-800">
              {application.rejectionComment}
            </p>
          </section>
        ) : null}

        {application.invitationSentAt ? (
          <p className="mt-4 text-sm text-text-muted">
            Приглашение отправлено: {formatDate(application.invitationSentAt)}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
          {application.status !== "accepted" && onAccept ? (
            <Button
              size="sm"
              variant="success"
              disabled={isActionPending}
              onClick={() => onAccept(application)}
            >
              Принять
            </Button>
          ) : null}
          {onReject ? (
            <Button
              size="sm"
              variant="danger"
              disabled={isActionPending}
              onClick={() => onReject(application)}
            >
              {application.status === "rejected"
                ? "Изменить комментарий"
                : "Отклонить"}
            </Button>
          ) : null}
          <Button size="sm" variant="ghost" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    </Modal>
  );
}
