import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { verifyYandexCaptcha } from "@/lib/captcha/yandex";
import {
  findActiveApplicationByEmail,
  saveApplication,
  saveApplicationPhoto,
} from "@/lib/applications/storage";
import { sendApplicationReceivedEmail } from "@/lib/email/sendEmail";
import { USER_MESSAGES } from "@/lib/messages/userMessages";
import {
  checkRateLimit,
  rateLimitResponse,
  RATE_LIMITS,
} from "@/lib/security/rateLimit";
import {
  buildConsentRecord,
  validateRegistrationConsents,
  type RegistrationConsents,
} from "@/lib/validation/consent";
import {
  hasValidationErrors,
  validateRegistrationForm,
  type RegistrationFormValues,
} from "@/lib/validation/registration";

function parseFormValues(formData: FormData): RegistrationFormValues {
  return {
    fullName: String(formData.get("fullName") ?? ""),
    birthDate: String(formData.get("birthDate") ?? ""),
    organization: String(formData.get("organization") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    parentContacts: String(formData.get("parentContacts") ?? ""),
    location: String(formData.get("location") ?? ""),
    motivationLetter: String(formData.get("motivationLetter") ?? ""),
    about: String(formData.get("about") ?? ""),
    wantsToEnroll: formData.get("wantsToEnroll") === "true",
  };
}

export async function POST(request: Request) {
  const limited = checkRateLimit(request, RATE_LIMITS.register);
  if (!limited.allowed) {
    return rateLimitResponse(limited.retryAfterSec ?? 60);
  }

  try {
    const formData = await request.formData();
    const captchaToken = String(formData.get("captchaToken") ?? "");

    if (!(await verifyYandexCaptcha(captchaToken, request))) {
      return NextResponse.json({ error: USER_MESSAGES.captchaFailed }, { status: 400 });
    }

    const values = parseFormValues(formData);
    const photo = formData.get("photo");

    if (!(photo instanceof File) || photo.size === 0) {
      return NextResponse.json({ error: "Загрузи фото для профиля." }, { status: 400 });
    }

    const validationErrors = validateRegistrationForm(values, photo);
    const consents: RegistrationConsents = {
      personalData: formData.get("personalDataConsent") === "true",
      photo: formData.get("photoConsent") === "true",
      parentRepresentative: formData.get("parentConsent") === "true",
    };
    const consentErrors = validateRegistrationConsents(consents, values.birthDate);
    const allErrors = { ...validationErrors, ...consentErrors };

    if (hasValidationErrors(allErrors)) {
      const firstError = Object.values(allErrors)[0];
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const normalizedEmail = values.email.trim().toLowerCase();
    const duplicate = await findActiveApplicationByEmail(normalizedEmail);

    if (duplicate) {
      return NextResponse.json(
        { error: USER_MESSAGES.registerDuplicate },
        { status: 409 },
      );
    }

    const applicationId = randomUUID();
    let photoPath: string;
    try {
      photoPath = await saveApplicationPhoto(photo, applicationId);
    } catch (photoError) {
      if (photoError instanceof Error && photoError.message === "INVALID_PHOTO") {
        return NextResponse.json(
          { error: "Подойдут только JPG, PNG или WebP с корректным содержимым." },
          { status: 400 },
        );
      }
      throw photoError;
    }

    const application = await saveApplication({
      id: applicationId,
      fullName: values.fullName.trim(),
      birthDate: values.birthDate,
      organization: values.organization.trim(),
      phone: values.phone.trim(),
      email: normalizedEmail,
      parentContacts: values.parentContacts.trim(),
      location: values.location.trim(),
      motivationLetter: values.motivationLetter.trim(),
      about: values.about.trim() || undefined,
      wantsToEnroll: values.wantsToEnroll,
      photoPath,
      consents: buildConsentRecord(consents, values.birthDate),
    });

    await sendApplicationReceivedEmail(application.email, application.fullName);

    return NextResponse.json({
      message: "Заявка успешно отправлена",
      applicationId: application.id,
    });
  } catch (error) {
    console.error("[POST /api/register]", error);
    return NextResponse.json(
      { error: USER_MESSAGES.registerFailed },
      { status: 500 },
    );
  }
}
