"use client";

import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

interface FieldWrapperProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

function FieldWrapper({ id, label, required, error, hint, children }: FieldWrapperProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-text">
        {label}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const controlClassName =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function InputField({ id, label, required, error, hint, className = "", ...props }: InputFieldProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <FieldWrapper id={fieldId} label={label} required={required} error={error} hint={hint}>
      <input
        id={fieldId}
        className={`${controlClassName} ${error ? "border-red-400" : ""} ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
        required={required}
        {...props}
      />
    </FieldWrapper>
  );
}

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function TextareaField({
  id,
  label,
  required,
  error,
  hint,
  className = "",
  ...props
}: TextareaFieldProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <FieldWrapper id={fieldId} label={label} required={required} error={error} hint={hint}>
      <textarea
        id={fieldId}
        className={`${controlClassName} min-h-[120px] resize-y ${error ? "border-red-400" : ""} ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
        required={required}
        {...props}
      />
    </FieldWrapper>
  );
}
