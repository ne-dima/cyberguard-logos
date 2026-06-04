import type { FarewellKey } from "./types";

export const FAREWELL_MESSAGES: Record<FarewellKey, string> = {
  goodbye_intro: "Желаем удачи! До встречи!",
  not_for_us: "Боюсь, тебе не к нам. Удачи!",
  goodbye_general: "Тогда желаем удачи!",
  other_options: "Тогда тебе лучше рассмотреть другие варианты. Удачи!",
};

export const FAREWELL_SUBTITLES: Record<FarewellKey, string> = {
  goodbye_intro: "Будем рады видеть тебя на других мероприятиях колледжа «ЛОГОС».",
  not_for_us:
    "КиберСтраж рассчитан на школьников и студентов колледжей. Следи за новостями «ЛОГОС», возможно, увидимся в другой раз!",
  goodbye_general: "Спасибо за интерес! Удачи в учёбе и новых начинаниях.",
  other_options: "Если передумаешь, всегда можешь вернуться и пройти опрос заново.",
};

export const SUBJECT_SUGGESTIONS = [
  "Информатика",
  "Математика",
  "Программирование",
  "Другое профильное",
  "Не подходит",
] as const;

export const SUBJECT_KEYWORDS = ["информ", "матем", "прогр", "профильн"];
