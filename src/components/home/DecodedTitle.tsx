"use client";

import { useEffect, useState } from "react";

const TARGET = "КиберСтраж";
const BRAND_PREFIX_LENGTH = "Кибер".length;
const SCRAMBLE_CHARS =
  "ХЖШЩФЦЧГЗКЛМНПРСТУФХЦЧШЩЪЫЭЮЯЗДВБАЕЁИОУКЕНМИВГД0123456789";
const INITIAL_PLACEHOLDER = "ХЖУЪЫШЩФЦЧГЗКЛМН";
const DURATION_MS = 2200;
const TICK_MS = 40;

function scrambleText(target: string, revealedCount: number): string {
  return [...target]
    .map((char, index) => {
      if (index < revealedCount) {
        return char;
      }
      return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] ?? char;
    })
    .join("");
}

function renderParts(text: string) {
  return (
    <>
      {text.slice(0, BRAND_PREFIX_LENGTH)}
      <span className="text-accent">{text.slice(BRAND_PREFIX_LENGTH)}</span>
    </>
  );
}

export function DecodedTitle() {
  const [display, setDisplay] = useState(INITIAL_PLACEHOLDER);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplay(TARGET);
      return;
    }

    const start = Date.now();
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / DURATION_MS, 1);
      const revealed = Math.floor(progress * TARGET.length);

      if (progress >= 1) {
        setDisplay(TARGET);
        window.clearInterval(interval);
        return;
      }

      setDisplay(scrambleText(TARGET, revealed));
    }, TICK_MS);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <span aria-label={TARGET}>
      <span aria-hidden="true">{renderParts(display)}</span>
    </span>
  );
}
