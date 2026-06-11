"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getYandexCaptchaClientKey } from "@/lib/captcha/config";

const SCRIPT_URL = "https://smartcaptcha.yandexcloud.net/captcha.js";

interface YandexSmartCaptchaProps {
  onToken: (token: string) => void;
  onExpired?: () => void;
  resetSignal?: number;
  className?: string;
}

let scriptPromise: Promise<void> | null = null;

function loadSmartCaptchaScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("browser only"));
  }

  if (window.smartCaptcha) {
    return Promise.resolve();
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src^="${SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("script failed")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("script failed"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function YandexSmartCaptcha({
  onToken,
  onExpired,
  resetSignal = 0,
  className = "",
}: YandexSmartCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const onTokenRef = useRef(onToken);
  const onExpiredRef = useRef(onExpired);
  const hasTokenRef = useRef(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const clientKey = getYandexCaptchaClientKey();

  useEffect(() => {
    onTokenRef.current = onToken;
    onExpiredRef.current = onExpired;
  });

  const destroyWidget = useCallback(() => {
    if (widgetIdRef.current !== null && window.smartCaptcha?.destroy) {
      try {
        window.smartCaptcha.destroy(widgetIdRef.current);
      } catch {
        /* ignore */
      }
    }
    widgetIdRef.current = null;
    hasTokenRef.current = false;
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }
  }, []);

  const mountWidget = useCallback(() => {
    if (!clientKey || !containerRef.current || !window.smartCaptcha) {
      return false;
    }

    if (widgetIdRef.current !== null) {
      return true;
    }

    widgetIdRef.current = window.smartCaptcha.render(containerRef.current, {
      sitekey: clientKey,
      hl: "ru",
      callback: (token) => {
        hasTokenRef.current = true;
        onTokenRef.current(token);
      },
      "expired-callback": () => {
        hasTokenRef.current = false;
        onExpiredRef.current?.();
      },
    });

    setLoadError(null);
    return true;
  }, [clientKey]);

  useEffect(() => {
    if (!clientKey) {
      return;
    }

    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    function scheduleMount(attempt = 0) {
      if (cancelled) {
        return;
      }
      if (mountWidget()) {
        return;
      }
      if (attempt < 40) {
        retryTimer = setTimeout(() => scheduleMount(attempt + 1), 100);
      }
    }

    loadSmartCaptchaScript()
      .then(() => {
        if (!cancelled) {
          scheduleMount();
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(
            "Не удалось загрузить капчу. Обновите страницу или отключите блокировщик рекламы.",
          );
        }
      });

    return () => {
      cancelled = true;
      if (retryTimer) {
        clearTimeout(retryTimer);
      }
      destroyWidget();
    };
  }, [clientKey, destroyWidget, mountWidget]);

  useEffect(() => {
    if (resetSignal === 0 || !clientKey) {
      return;
    }

    hasTokenRef.current = false;
    destroyWidget();

    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) {
        mountWidget();
      }
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [resetSignal, clientKey, destroyWidget, mountWidget]);

  if (!clientKey) {
    return (
      <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Капча не настроена. Укажите NEXT_PUBLIC_YANDEX_CAPTCHA_CLIENT_KEY в .env
      </p>
    );
  }

  if (loadError) {
    return (
      <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
        {loadError}
      </p>
    );
  }

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="smart-captcha min-h-[102px] w-full overflow-visible"
        aria-label="Проверка капчи"
      />
      {onExpired ? (
        <p className="mt-1 text-xs text-text-muted">
          Если капча истекла, пройдите её снова перед отправкой.
        </p>
      ) : null}
    </div>
  );
}
