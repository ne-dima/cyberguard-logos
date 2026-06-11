"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { YandexSmartCaptcha } from "@/components/captcha/YandexSmartCaptcha";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/FormField";
import { USER_MESSAGES } from "@/lib/messages/userMessages";
import {
  PARTICIPANT_STATUS_LABELS,
  type ApplicationStatus,
  type PublicApplicationStatus,
} from "@/types/application";

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

function formatDate(value: string): string {
  return new Date(value).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusResult({ application }: { application: PublicApplicationStatus }) {
  return (
    <div className="glass-card rounded-[20px] p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-text-muted">Участник</p>
          <h2 className="font-heading text-2xl font-bold text-text">{application.fullName}</h2>
          <p className="mt-1 text-sm text-text-muted">{application.email}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[application.status]}`}
        >
          {PARTICIPANT_STATUS_LABELS[application.status]}
        </span>
      </div>

      <p className="mt-4 text-sm text-text-muted">
        Заявка отправлена: {formatDate(application.createdAt)}
      </p>

      {application.status === "new" ? (
        <div className="mt-6 rounded-xl bg-blue-50 px-4 py-4 text-sm leading-relaxed text-blue-900">
          Твоя заявка на рассмотрении. Администратор скоро примет решение. Следи за
          письмами на указанной почте.
        </div>
      ) : null}

      {application.status === "accepted" ? (
        <div className="mt-6 rounded-xl bg-green-50 px-4 py-4 text-sm leading-relaxed text-green-900">
          <p className="font-semibold">Поздравляем! Вы приглашены на КиберСтраж.</p>
          <p className="mt-2">
            Подробности придут на почту перед стартом. Если письма нет, проверь папку
            «Спам» или напиши в приёмную комиссию колледжа.
          </p>
        </div>
      ) : null}

      {application.status === "rejected" ? (
        <div className="mt-6 rounded-xl bg-red-50 px-4 py-4 text-sm leading-relaxed text-red-900">
          <p className="font-semibold">К сожалению, заявка отклонена.</p>
          {application.rejectionComment ? (
            <p className="mt-2">
              Комментарий администратора: {application.rejectionComment}
            </p>
          ) : (
            <p className="mt-2">Комментарий администратора пока не указан.</p>
          )}
          <p className="mt-3">
            Будем рады видеть вас в следующих сезонах КиберСтража!
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function StatusPageClient() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email")?.trim() ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaReset, setCaptchaReset] = useState(0);
  const handleCaptchaToken = useCallback((token: string) => {
    setCaptchaToken(token);
    setError(null);
  }, []);
  const handleCaptchaExpired = useCallback(() => {
    setCaptchaToken(null);
  }, []);
  const [application, setApplication] = useState<PublicApplicationStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchStatus(targetEmail: string, token: string) {
    setIsLoading(true);
    setError(null);
    setApplication(null);

    try {
      const response = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, captchaToken: token }),
      });
      const payload = (await response.json()) as {
        application?: PublicApplicationStatus;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Не удалось найти заявку.");
      }

      setApplication(payload.application ?? null);
      setCaptchaToken(null);
      setCaptchaReset((value) => value + 1);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : USER_MESSAGES.genericError);
      setCaptchaToken(null);
      setCaptchaReset((value) => value + 1);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      return;
    }
    if (!captchaToken) {
      setError(USER_MESSAGES.captchaRequired);
      return;
    }
    void fetchStatus(trimmed, captchaToken);
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-bg-muted">
        <div className="mx-auto max-w-2xl px-5 py-12">
          <span className="section-label">Личный кабинет</span>
          <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-text">
            Статус заявки
          </h1>
          <p className="mt-3 text-base leading-relaxed text-text-muted">
            Введи адрес электронной почты, который указал в анкете, пройди капчу и мы покажем
            текущий статус рассмотрения.
          </p>

          <form
            className="mt-8 glass-card rounded-[20px] p-6 sm:p-8"
            onSubmit={handleSubmit}
          >
            <InputField
              id="status-email"
              label="Электронная почта"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="example@mail.ru"
              required
              autoComplete="email"
            />

            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-text">Проверка</p>
              <YandexSmartCaptcha
                resetSignal={captchaReset}
                onToken={handleCaptchaToken}
                onExpired={handleCaptchaExpired}
              />
            </div>

            {error ? (
              <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              className="mt-4"
              fullWidth
              disabled={isLoading || !captchaToken}
            >
              {isLoading ? "Ищем заявку..." : "Проверить статус"}
            </Button>
          </form>

          {application ? (
            <div className="mt-6">
              <StatusResult application={application} />
            </div>
          ) : null}

          <p className="mt-8 text-center text-sm text-text-muted">
            <Link href="/" className="font-semibold text-accent hover:underline">
              ← Вернуться на главную
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
