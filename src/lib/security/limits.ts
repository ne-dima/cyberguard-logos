/** Max lengths for text fields (DoS / storage protection). */
export const FIELD_LIMITS = {
  fullName: 200,
  organization: 300,
  phone: 30,
  email: 254,
  parentContacts: 500,
  location: 200,
  motivationLetter: 10_000,
  about: 5_000,
  rejectionComment: 2_000,
} as const;

export function exceedsMaxLength(value: string, max: number): boolean {
  return value.length > max;
}
