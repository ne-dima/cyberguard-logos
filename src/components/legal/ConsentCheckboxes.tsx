"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { isMinorApplicant } from "@/lib/validation/consent";
import type { RegistrationConsents, RegistrationConsentErrors } from "@/lib/validation/consent";

interface ConsentCheckboxesProps {
  birthDate: string;
  consents: RegistrationConsents;
  errors: RegistrationConsentErrors;
  onChange: (consents: RegistrationConsents) => void;
}

function ConsentLabel({
  id,
  checked,
  onChange,
  error,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-accent focus:ring-accent"
        />
        <span className="text-text">{children}</span>
      </label>
      {error ? (
        <p className="mt-1 pl-7 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ConsentCheckboxes({
  birthDate,
  consents,
  errors,
  onChange,
}: ConsentCheckboxesProps) {
  const isMinor = isMinorApplicant(birthDate);

  function patch(partial: Partial<RegistrationConsents>) {
    onChange({ ...consents, ...partial });
  }

  return (
    <fieldset className="space-y-4 rounded-xl border border-border bg-bg-muted/40 px-4 py-4">
      <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
        Согласия
      </legend>

      <ConsentLabel
        id="consent-personal-data"
        checked={consents.personalData}
        onChange={(checked) => patch({ personalData: checked })}
        error={errors.personalData}
      >
        Я согласен(на) на{" "}
        <Link href="/personal-data-consent" target="_blank" className="text-accent hover:underline">
          обработку персональных данных
        </Link>{" "}
        и ознакомлен(а) с{" "}
        <Link href="/privacy-policy" target="_blank" className="text-accent hover:underline">
          политикой конфиденциальности
        </Link>
        . <span className="text-red-600">*</span>
      </ConsentLabel>

      <ConsentLabel
        id="consent-photo"
        checked={consents.photo}
        onChange={(checked) => patch({ photo: checked })}
        error={errors.photo}
      >
        Я согласен(на) на{" "}
        <Link href="/photo-consent" target="_blank" className="text-accent hover:underline">
          обработку фотографии
        </Link>
        . <span className="text-red-600">*</span>
      </ConsentLabel>

      {isMinor ? (
        <ConsentLabel
          id="consent-parent"
          checked={consents.parentRepresentative}
          onChange={(checked) => patch({ parentRepresentative: checked })}
          error={errors.parentRepresentative}
        >
          Я подтверждаю{" "}
          <Link href="/parent-consent" target="_blank" className="text-accent hover:underline">
            согласие законного представителя
          </Link>{" "}
          на обработку данных несовершеннолетнего. <span className="text-red-600">*</span>
        </ConsentLabel>
      ) : null}
    </fieldset>
  );
}
