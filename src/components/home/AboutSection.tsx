"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ABOUT_SLIDE_INTERVAL_MS, ABOUT_SLIDES } from "@/content/aboutSlides";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

function AboutSlides({
  slides,
  activeIndex,
  className,
  imageClassName,
}: {
  slides: typeof ABOUT_SLIDES;
  activeIndex: number;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div className={className}>
      {slides.map((slide, index) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 100vw"
          priority={index === 0}
          className={`object-cover transition-opacity duration-1000 ease-in-out ${imageClassName ?? "object-center"} ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}

/** Плавный белый градиент: плотный слева (текст), прозрачный справа (фото) */
const ABOUT_GRADIENT =
  "linear-gradient(to right, #ffffff 0%, #ffffff 18%, rgba(255,255,255,0.97) 42%, rgba(255,255,255,0.88) 52%, rgba(255,255,255,0.72) 60%, rgba(255,255,255,0.48) 68%, rgba(255,255,255,0.24) 76%, rgba(255,255,255,0.08) 84%, transparent 94%)";

export function AboutSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = ABOUT_SLIDES.length > 0 ? ABOUT_SLIDES : [];

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, ABOUT_SLIDE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-bg py-16 md:min-h-[440px] lg:min-h-[480px]"
    >
      <div className="absolute inset-0 z-0 hidden md:block" aria-hidden>
        <AboutSlides
          slides={slides}
          activeIndex={activeIndex}
          className="relative h-full w-full"
          imageClassName="object-[72%_center]"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
        style={{ background: ABOUT_GRADIENT }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[1180px] px-5 md:flex md:min-h-[440px] md:items-center lg:min-h-[480px]">
        <ScrollReveal className="w-full md:max-w-[min(100%,calc(50vw-2.5rem))] lg:max-w-[560px]">
          <span className="section-label">О КиберСтраже</span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Три дня в мире кибербезопасности
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-muted sm:text-lg">
            КиберСтраж — трёхдневная программа для школьников и студентов колледжей,
            которые хотят познакомиться с профессией в информационной безопасности. Лекции
            от экспертов, квесты, хакатон с питч-сессией и наставники из вузов: вы увидите
            колледж «ЛОГОС» изнутри и поймёте, ваш ли это путь.
          </p>

          {slides.length > 1 ? (
            <div className="mt-8 flex gap-2" role="tablist" aria-label="Фото КиберСтража">
              {slides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-label={`Показать фото ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-8 bg-accent"
                      : "w-2 bg-accent/35 hover:bg-accent/55"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </ScrollReveal>
      </div>

      <div className="mx-auto mt-8 max-w-[1180px] px-5 md:hidden">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-bg-muted">
          <AboutSlides
            slides={slides}
            activeIndex={activeIndex}
            className="relative h-full w-full"
          />
        </div>
      </div>
    </section>
  );
}
