"use client";

import { Button } from "@/components/ui/Button";

interface HeroProps {
  onStartSurvey: () => void;
}

export function Hero({ onStartSurvey }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-hero-gradient py-10 sm:py-14 lg:py-16">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/collage.jpg')", backgroundPosition: "center 40%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(248,250,252,0.97)] via-[rgba(248,250,252,0.88)] to-[rgba(248,250,252,0.25)]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1180px] gap-8 px-5 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-10">
        <div>
          <span className="mb-4 inline-block rounded-full bg-accent-light px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            Летний интенсив 2026
          </span>
          <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-text sm:text-5xl">
            Кибер<span className="text-gradient">Без</span>Интенсив
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-text-muted">
            Погрузись в мир информационной безопасности вместе с колледжем «ЛОГОС».
            Пройди короткий опрос — и узнай, подходишь ли ты для участия.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={onStartSurvey}>
              Пройти опрос
            </Button>
            <a
              href="#about"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-7 py-3.5 text-base font-semibold text-accent shadow-sm transition-all hover:border-accent hover:bg-accent-light"
            >
              Узнать больше
            </a>
          </div>

          <dl className="mt-10 flex flex-wrap gap-8">
            <div>
              <dt className="font-heading text-3xl font-extrabold text-accent">7</dt>
              <dd className="mt-1 text-sm text-text-muted">дней программы</dd>
            </div>
            <div>
              <dt className="font-heading text-3xl font-extrabold text-accent">IT</dt>
              <dd className="mt-1 text-sm text-text-muted">практика и лекции</dd>
            </div>
            <div>
              <dt className="font-heading text-3xl font-extrabold text-accent">ЛОГОС</dt>
              <dd className="mt-1 text-sm text-text-muted">колледж в Боровске</dd>
            </div>
          </dl>
        </div>

        <aside className="glass-card rounded-[20px] p-6">
          <h2 className="font-heading text-lg font-bold text-text">Как попасть</h2>
          <ol className="mt-5 space-y-5">
            {[
              {
                num: "01",
                title: "Пройди опрос",
                text: "Ответь на несколько вопросов — это займёт пару минут.",
              },
              {
                num: "02",
                title: "Заполни анкету",
                text: "Расскажи о себе и приложи фото для профиля.",
              },
              {
                num: "03",
                title: "Жди решения",
                text: "Администратор рассмотрит заявку и напишет на почту.",
              },
            ].map((step) => (
              <li key={step.num} className="flex gap-3">
                <span className="font-heading text-2xl font-extrabold leading-none text-accent">
                  {step.num}
                </span>
                <div>
                  <strong className="block text-sm font-semibold">{step.title}</strong>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  );
}
