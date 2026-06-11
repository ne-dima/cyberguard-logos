"use client";

import { useCallback, useState } from "react";
import { YandexSmartCaptcha } from "@/components/captcha/YandexSmartCaptcha";
import { Button } from "@/components/ui/Button";
import { InputField, TextareaField } from "@/components/ui/FormField";
import { PhotoUpload } from "@/components/ui/PhotoUpload";
import { USER_MESSAGES } from "@/lib/messages/userMessages";
import {
  hasValidationErrors,
  MOTIVATION_MIN_LENGTH,
  validateRegistrationForm,
  type RegistrationFormErrors,
  type RegistrationFormValues,
} from "@/lib/validation/registration";
import { ConsentCheckboxes } from "@/components/legal/ConsentCheckboxes";
import {
  validateRegistrationConsents,
  type RegistrationConsents,
  type RegistrationConsentErrors,
} from "@/lib/validation/consent";
import { RegistrationSuccess } from "./RegistrationSuccess";

interface RegistrationFormProps {
  onSubmitted: () => void;
  onComplete: () => void;
}

const INITIAL_CONSENTS: RegistrationConsents = {
  personalData: false,
  photo: false,
  parentRepresentative: false,
};

const INITIAL_VALUES: RegistrationFormValues = {
  fullName: "",
  birthDate: "",
  organization: "",
  phone: "",
  email: "",
  parentContacts: "",
  location: "",
  motivationLetter: "",
  about: "",
  wantsToEnroll: false,
};

export function RegistrationForm({ onSubmitted, onComplete }: RegistrationFormProps) {
  const [values, setValues] = useState<RegistrationFormValues>(INITIAL_VALUES);
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<RegistrationFormErrors>({});
  const [consents, setConsents] = useState(INITIAL_CONSENTS);
  const [consentErrors, setConsentErrors] = useState<RegistrationConsentErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaReset, setCaptchaReset] = useState(0);

  const handleCaptchaToken = useCallback((token: string) => {
    setCaptchaToken(token);
    setSubmitError(null);
  }, []);

  const handleCaptchaExpired = useCallback(() => {
    setCaptchaToken(null);
  }, []);

  function updateField<K extends keyof RegistrationFormValues>(
    field: K,
    value: RegistrationFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const validationErrors = validateRegistrationForm(values, photo);
    const nextConsentErrors = validateRegistrationConsents(consents, values.birthDate);
    setConsentErrors(nextConsentErrors);

    if (hasValidationErrors(validationErrors) || hasValidationErrors(nextConsentErrors)) {
      setErrors(validationErrors);
      return;
    }

    if (!photo) {
      return;
    }

    if (!captchaToken) {
      setSubmitError(USER_MESSAGES.captchaRequired);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("fullName", values.fullName.trim());
      formData.append("birthDate", values.birthDate);
      formData.append("organization", values.organization.trim());
      formData.append("phone", values.phone.trim());
      formData.append("email", values.email.trim());
      formData.append("parentContacts", values.parentContacts.trim());
      formData.append("location", values.location.trim());
      formData.append("motivationLetter", values.motivationLetter.trim());
      if (values.about.trim()) {
        formData.append("about", values.about.trim());
      }
      formData.append("wantsToEnroll", String(values.wantsToEnroll));
      formData.append("photo", photo);
      formData.append("personalDataConsent", String(consents.personalData));
      formData.append("photoConsent", String(consents.photo));
      formData.append("parentConsent", String(consents.parentRepresentative));
      formData.append("captchaToken", captchaToken);

      const response = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(payload.error || payload.message || USER_MESSAGES.registerFailed);
      }

      setSubmittedEmail(values.email.trim());
      onSubmitted();
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : USER_MESSAGES.genericError,
      );
      setCaptchaToken(null);
      setCaptchaReset((value) => value + 1);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return <RegistrationSuccess email={submittedEmail} onClose={onComplete} />;
  }

  const motivationLength = values.motivationLetter.trim().length;

  return (
    <div className="glass-card rounded-none p-5 sm:rounded-[20px] sm:p-8">
      <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        Финальный шаг
      </span>
      <h2 className="mt-4 font-heading text-xl font-bold text-text sm:text-2xl">
        Анкета участника
      </h2>
      <p className="mt-2 text-sm text-text-muted">
        Заполни все поля, это займёт 5–10 минут. Мы свяжемся с тобой по почте.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        <InputField
          id="fullName"
          label="ФИО"
          value={values.fullName}
          onChange={(event) => updateField("fullName", event.target.value)}
          error={errors.fullName}
          placeholder="Иванов Иван Иванович"
          required
          autoComplete="name"
        />

        <InputField
          id="birthDate"
          label="Дата рождения"
          type="date"
          value={values.birthDate}
          onChange={(event) => updateField("birthDate", event.target.value)}
          error={errors.birthDate}
          required
        />

        <InputField
          id="organization"
          label="Организация (школа / колледж)"
          value={values.organization}
          onChange={(event) => updateField("organization", event.target.value)}
          error={errors.organization}
          placeholder="МБОУ «Средняя школа №1»"
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            id="phone"
            label="Телефон"
            type="tel"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            error={errors.phone}
            placeholder="+7 (999) 123-45-67"
            required
            autoComplete="tel"
          />

          <InputField
            id="email"
            label="Электронная почта"
            type="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            error={errors.email}
            placeholder="example@mail.ru"
            required
            autoComplete="email"
          />
        </div>

        <InputField
          id="parentContacts"
          label="Контакты родителей"
          value={values.parentContacts}
          onChange={(event) => updateField("parentContacts", event.target.value)}
          error={errors.parentContacts}
          placeholder="ФИО и телефон родителя или опекуна"
          required
        />

        <InputField
          id="location"
          label="Место жительства (город / район)"
          value={values.location}
          onChange={(event) => updateField("location", event.target.value)}
          error={errors.location}
          placeholder="Боровск, Калужская область"
          required
        />

        <TextareaField
          id="motivationLetter"
          label="Мотивационное письмо"
          value={values.motivationLetter}
          onChange={(event) => updateField("motivationLetter", event.target.value)}
          error={errors.motivationLetter}
          hint={`Тема: «Почему я хочу на КиберСтраж в колледже „ЛОГОС"». Минимум ${MOTIVATION_MIN_LENGTH} символов.`}
          placeholder="Расскажи, почему тебе интересна кибербезопасность и колледж «ЛОГОС»..."
          required
        />
        <p
          className={`text-xs ${
            motivationLength >= MOTIVATION_MIN_LENGTH ? "text-green-600" : "text-text-muted"
          }`}
        >
          {motivationLength} / {MOTIVATION_MIN_LENGTH} символов
        </p>

        <PhotoUpload file={photo} onChange={setPhoto} error={errors.photo} />

        <TextareaField
          id="about"
          label="Что бы тебе хотелось рассказать о себе?"
          value={values.about}
          onChange={(event) => updateField("about", event.target.value)}
          hint="Необязательное поле: увлечения, проекты, достижения."
          placeholder="Например: участвую в олимпиадах по информатике..."
        />

        <label htmlFor="wantsToEnroll" className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
          <input
            id="wantsToEnroll"
            type="checkbox"
            checked={values.wantsToEnroll}
            onChange={(event) => updateField("wantsToEnroll", event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-accent focus:ring-accent"
          />
          <span className="text-text">Хочу поступать в колледж «ЛОГОС»</span>
        </label>

        <ConsentCheckboxes
          birthDate={values.birthDate}
          consents={consents}
          errors={consentErrors}
          onChange={(next) => {
            setConsents(next);
            setConsentErrors({});
          }}
        />

        <div className="pt-2">
          <p className="mb-2 text-sm font-medium text-text">Проверка перед отправкой</p>
          <YandexSmartCaptcha
            resetSignal={captchaReset}
            onToken={handleCaptchaToken}
            onExpired={handleCaptchaExpired}
          />
        </div>

        {submitError ? (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </p>
        ) : null}

        <Button type="submit" fullWidth disabled={isSubmitting || !captchaToken}>
          {isSubmitting ? "Отправляем заявку..." : "Отправить заявку"}
        </Button>
      </form>
    </div>
  );
}
