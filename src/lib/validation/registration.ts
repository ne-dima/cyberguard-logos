export interface RegistrationFormValues {
  fullName: string;
  birthDate: string;
  organization: string;
  phone: string;
  email: string;
  parentContacts: string;
  location: string;
  motivationLetter: string;
  about: string;
}

export type RegistrationFormErrors = Partial<
  Record<keyof RegistrationFormValues | "photo", string>
>;

export const MOTIVATION_MIN_LENGTH = 200;
export const PHOTO_MAX_SIZE = 5 * 1024 * 1024;
export const PHOTO_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s+\-()]{10,20}$/;

export function validateRegistrationForm(
  values: RegistrationFormValues,
  photo: File | null,
): RegistrationFormErrors {
  const errors: RegistrationFormErrors = {};

  if (!values.fullName.trim() || values.fullName.trim().length < 3) {
    errors.fullName = "Укажи ФИО полностью, минимум 3 символа.";
  }

  if (!values.birthDate) {
    errors.birthDate = "Выбери дату рождения.";
  } else {
    const birth = new Date(values.birthDate);
    const today = new Date();
    if (Number.isNaN(birth.getTime()) || birth > today) {
      errors.birthDate = "Дата рождения должна быть корректной и не в будущем.";
    }
  }

  if (!values.organization.trim()) {
    errors.organization = "Укажи школу или колледж, где ты учишься.";
  }

  if (!values.phone.trim() || !PHONE_REGEX.test(values.phone.trim())) {
    errors.phone = "Введи номер телефона, от 10 цифр.";
  }

  if (!values.email.trim() || !EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Проверь адрес электронной почты.";
  }

  if (!values.parentContacts.trim()) {
    errors.parentContacts = "Укажи контакты родителей или опекуна.";
  }

  if (!values.location.trim()) {
    errors.location = "Укажи город или район проживания.";
  }

  if (!values.motivationLetter.trim()) {
    errors.motivationLetter = "Напиши мотивационное письмо.";
  } else if (values.motivationLetter.trim().length < MOTIVATION_MIN_LENGTH) {
    errors.motivationLetter = `Письмо слишком короткое: нужно минимум ${MOTIVATION_MIN_LENGTH} символов (сейчас ${values.motivationLetter.trim().length}).`;
  }

  if (!photo) {
    errors.photo = "Загрузи фото для профиля.";
  } else if (!PHOTO_ACCEPTED_TYPES.includes(photo.type as (typeof PHOTO_ACCEPTED_TYPES)[number])) {
    errors.photo = "Подойдут только JPG, PNG или WebP.";
  } else if (photo.size > PHOTO_MAX_SIZE) {
    errors.photo = "Фото не должно быть больше 5 МБ.";
  }

  return errors;
}

export function hasValidationErrors(errors: Record<string, string | undefined>): boolean {
  return Object.keys(errors).length > 0;
}
