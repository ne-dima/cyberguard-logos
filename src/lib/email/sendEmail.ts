import { deliverEmail, type EmailPayload } from "./provider";

export type { EmailPayload };

export async function sendEmail(payload: EmailPayload): Promise<void> {
  await deliverEmail(payload);
}

export async function sendApplicationReceivedEmail(
  email: string,
  fullName: string,
): Promise<void> {
  await sendEmail({
    to: email,
    subject: "Заявка на КиберСтраж получена",
    text: [
      `Здравствуй, ${fullName}!`,
      "",
      "Мы получили твою заявку на участие в КиберСтраж в колледже «ЛОГОС».",
      "Администратор рассмотрит её в ближайшее время и напишет на эту почту.",
      "",
      "Статус заявки можно проверить на сайте в разделе «Статус заявки».",
      "",
      "С уважением,",
      "Команда КиберСтража",
    ].join("\n"),
  });
}

export async function sendApplicationAcceptedEmail(
  email: string,
  fullName: string,
): Promise<void> {
  await sendEmail({
    to: email,
    subject: "Вы приняты на КиберСтраж",
    text: [
      `Поздравляем, ${fullName}!`,
      "",
      "Вы приняты на участие в КиберСтраж в колледже «ЛОГОС».",
      "Подробности программы и организационная информация придут на почту перед стартом.",
      "",
      "С уважением,",
      "Команда КиберСтража",
    ].join("\n"),
  });
}

export function buildRejectionEmailText(fullName: string, reason: string): string {
  return [
    `Здравствуй, ${fullName}!`,
    "",
    `К сожалению, ${reason}. Будем рады видеть вас в следующих сезонах!`,
    "",
    "С уважением,",
    "Команда КиберСтража",
  ].join("\n");
}

export async function sendApplicationRejectedEmail(
  email: string,
  fullName: string,
  reason: string,
): Promise<void> {
  await sendEmail({
    to: email,
    subject: "Решение по заявке на КиберСтраж",
    text: buildRejectionEmailText(fullName, reason),
  });
}

export async function sendInvitationEmail(email: string, fullName: string): Promise<void> {
  await sendEmail({
    to: email,
    subject: "Приглашение на КиберСтраж",
    text: [
      `Здравствуй, ${fullName}!`,
      "",
      "Напоминаем: вы приглашены на КиберСтраж в колледже «ЛОГОС».",
      "Программа КиберСтража и адрес проведения будут отправлены отдельным письмом перед стартом.",
      "",
      "С уважением,",
      "Команда КиберСтража",
    ].join("\n"),
  });
}
