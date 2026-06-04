import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import {
  findActiveApplicationByEmail,
  saveApplication,
  saveApplicationPhoto,
} from "@/lib/applications/storage";
import { sendApplicationReceivedEmail } from "@/lib/email/sendEmail";
import { USER_MESSAGES } from "@/lib/messages/userMessages";
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
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
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

    const duplicate = await findActiveApplicationByEmail(values.email);

    if (duplicate) {
      return NextResponse.json(
        { error: USER_MESSAGES.registerDuplicate },
        { status: 409 },
      );
    }

    const applicationId = randomUUID();
    const photoPath = await saveApplicationPhoto(photo, applicationId);

    const application = await saveApplication({
      id: applicationId,
      fullName: values.fullName.trim(),
      birthDate: values.birthDate,
      organization: values.organization.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      parentContacts: values.parentContacts.trim(),
      location: values.location.trim(),
      motivationLetter: values.motivationLetter.trim(),
      about: values.about.trim() || undefined,
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
