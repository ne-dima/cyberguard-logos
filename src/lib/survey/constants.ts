import type { FarewellKey } from "./types";

export const FAREWELL_MESSAGES: Record<FarewellKey, string> = {
  goodbye_intro: "Желаем удачи! До встречи!",
  not_for_us: "Боюсь, тебе не к нам. Удач!",
  goodbye_general: "Тогда желаем удачи!",
  other_options: "Тогда тебе лучше рассмотреть другие варианты. Удачи!",
};

export const SUBJECT_SUGGESTIONS = [
  "Информатика",
  "Математика",
  "Программирование",
  "Другое профильное",
  "Не подходит",
] as const;

export const SUBJECT_KEYWORDS = ["информ", "матем", "прогр", "профильн"];
