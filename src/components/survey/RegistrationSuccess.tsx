"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface RegistrationSuccessProps {
  email: string;
  onClose: () => void;
}

export function RegistrationSuccess({ email, onClose }: RegistrationSuccessProps) {
  const statusUrl = `/status?email=${encodeURIComponent(email)}`;

  return (
    <div className="glass-card rounded-[20px] p-6 text-center sm:p-8">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
        ✓
      </div>
      <h2 className="font-heading text-xl font-bold text-text sm:text-2xl">
        Заявка отправлена!
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">
        Администратор рассмотрит её в ближайшее время. Мы отправили уведомление на
        указанную почту. Следи за письмами!
      </p>
      <div className="mt-6 space-y-3">
        <Button fullWidth onClick={onClose}>
          Отлично, спасибо!
        </Button>
        <Link
          href={statusUrl}
          onClick={onClose}
          className="block text-sm font-semibold text-accent hover:underline"
        >
          Проверить статус заявки →
        </Link>
      </div>
    </div>
  );
}
