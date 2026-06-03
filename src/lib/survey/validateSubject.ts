import { SUBJECT_KEYWORDS } from "./constants";

export function isSubjectMatching(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  if (!normalized || normalized === "не подходит") {
    return false;
  }
  return SUBJECT_KEYWORDS.some((keyword) => normalized.includes(keyword));
}
