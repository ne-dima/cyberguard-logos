import { LEGAL_DOCUMENT_VERSION } from "@/content/legal/version";

export interface RegistrationConsents {
  personalData: boolean;
  photo: boolean;
  parentRepresentative: boolean;
}

export type RegistrationConsentErrors = Partial<
  Record<keyof RegistrationConsents | "consents", string>
>;

export function isMinorApplicant(birthDate: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate.trim());
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const birth = new Date(year, month - 1, day);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const hadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

  if (!hadBirthdayThisYear) {
    age -= 1;
  }

  return age < 18;
}

export function validateRegistrationConsents(
  consents: RegistrationConsents,
  birthDate: string,
): RegistrationConsentErrors {
  const errors: RegistrationConsentErrors = {};

  if (!consents.personalData) {
    errors.personalData = "Необходимо согласие на обработку персональных данных.";
  }

  if (!consents.photo) {
    errors.photo = "Необходимо согласие на обработку фотографии.";
  }

  if (isMinorApplicant(birthDate) && !consents.parentRepresentative) {
    errors.parentRepresentative =
      "Для участников младше 18 лет нужно подтвердить согласие законного представителя.";
  }

  return errors;
}

export function buildConsentRecord(consents: RegistrationConsents, birthDate: string) {
  return {
    version: LEGAL_DOCUMENT_VERSION,
    personalData: true as const,
    photo: true as const,
    parentRepresentative: isMinorApplicant(birthDate) ? consents.parentRepresentative : undefined,
    acceptedAt: new Date().toISOString(),
  };
}
