export function getYandexCaptchaClientKey(): string | undefined {
  return process.env.NEXT_PUBLIC_YANDEX_CAPTCHA_CLIENT_KEY?.trim() || undefined;
}

export function isYandexCaptchaClientConfigured(): boolean {
  return Boolean(getYandexCaptchaClientKey());
}
