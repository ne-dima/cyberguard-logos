"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextareaField } from "@/components/ui/FormField";
import type { Application } from "@/types/application";

interface RejectModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => Promise<void>;
}

export function RejectModal({ application, isOpen, onClose, onConfirm }: RejectModalProps) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && application) {
      setComment(application.rejectionComment ?? "");
      setError(null);
    }
  }, [isOpen, application]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!comment.trim()) {
      setError("Укажите причину отказа.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onConfirm(comment.trim());
      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Не удалось сохранить отказ.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!application) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Отклонение заявки" size="lg">
      <div className="glass-card rounded-[20px] p-6 sm:p-8">
        <h2 className="font-heading text-xl font-bold text-text">Отклонить заявку</h2>
        <p className="mt-2 text-sm text-text-muted">
          Участник: <strong>{application.fullName}</strong>
        </p>
        <p className="mt-3 rounded-xl bg-bg-muted px-4 py-3 text-xs leading-relaxed text-text-muted">
          Шаблон письма: «К сожалению, [причина]. Будем рады видеть вас в следующих сезонах!»
        </p>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <TextareaField
            id="rejection-comment"
            label="Комментарий (причина отказа)"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="например: не подходит возраст участника"
            required
          />

          {error ? (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Сохраняем..." : "Отклонить и отправить письмо"}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
