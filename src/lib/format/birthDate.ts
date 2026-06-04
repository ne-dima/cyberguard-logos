function parseBirthDate(isoDate: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function getAge(birthDate: Date, today = new Date()): number {
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasNotHadBirthdayThisYear =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());

  if (hasNotHadBirthdayThisYear) {
    age -= 1;
  }

  return age;
}

function pluralizeYears(age: number): string {
  const mod10 = age % 10;
  const mod100 = age % 100;

  if (mod100 >= 11 && mod100 <= 14) {
    return `${age} лет`;
  }
  if (mod10 === 1) {
    return `${age} год`;
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return `${age} года`;
  }
  return `${age} лет`;
}

export function formatBirthDateWithAge(isoDate: string): string {
  const birthDate = parseBirthDate(isoDate);
  if (!birthDate) {
    return isoDate;
  }

  const formatted = birthDate.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const age = getAge(birthDate);

  if (age < 0) {
    return formatted;
  }

  return `${formatted} (${pluralizeYears(age)})`;
}
