import type { Transporter } from "nodemailer";
import nodemailer from "nodemailer";

export interface EmailPayload {
  to: string;
  subject: string;
  text: string;
}

let transporter: Transporter | null = null;

function getSmtpTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });
  }

  return transporter;
}

export async function deliverEmail({ to, subject, text }: EmailPayload): Promise<void> {
  const from = process.env.EMAIL_FROM ?? "cyber-intensive@logos.local";
  const mode = process.env.EMAIL_MODE ?? "mock";

  if (mode === "smtp") {
    const smtp = getSmtpTransporter();

    if (smtp) {
      await smtp.sendMail({ from, to, subject, text });
      console.log(`[EMAIL SMTP] Sent to ${to}: ${subject}`);
      return;
    }

    console.warn("[EMAIL] SMTP_MODE включён, но SMTP_HOST/SMTP_USER/SMTP_PASS не заданы. Fallback на mock.");
  }

  console.log("──────────────────────────────────────");
  console.log("[EMAIL MOCK]");
  console.log(`From: ${from}`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(text);
  console.log("──────────────────────────────────────");
}
