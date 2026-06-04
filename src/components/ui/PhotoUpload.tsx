"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { PHOTO_ACCEPTED_TYPES, PHOTO_MAX_SIZE } from "@/lib/validation/registration";

interface PhotoUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export function PhotoUpload({ file, onChange, error }: PhotoUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    event.target.value = "";
    onChange(selected);
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-semibold text-text">
        Фото для профиля<span className="ml-0.5 text-red-500">*</span>
      </label>
      <p className="text-xs text-text-muted">JPG, PNG или WebP, до 5 МБ</p>

      <div
        className={`rounded-xl border border-dashed p-4 transition-colors ${
          error ? "border-red-400 bg-red-50/40" : "border-border bg-surface"
        }`}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={PHOTO_ACCEPTED_TYPES.join(",")}
          className="sr-only"
          onChange={handleSelect}
          aria-invalid={Boolean(error)}
        />

        {previewUrl ? (
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
            <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-border">
              <Image
                src={previewUrl}
                alt="Предпросмотр фото"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-text">{file?.name}</span>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-left text-accent hover:underline"
              >
                Заменить фото
              </button>
              <button
                type="button"
                onClick={() => onChange(null)}
                className="text-left text-text-muted hover:text-red-600"
              >
                Удалить
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-xl px-4 py-6 text-sm text-text-muted transition-colors hover:bg-accent-light hover:text-accent"
          >
            <span className="text-2xl">📷</span>
            <span className="font-semibold">Нажми, чтобы загрузить фото</span>
          </button>
        )}
      </div>

      {error ? (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
