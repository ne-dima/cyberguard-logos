"use client";

import { PROGRAM_INTRO } from "@/content/programSchedule";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const DAY_LABEL_COLORS = ["text-blue-400", "text-sky-400", "text-rose-400"] as const;

export function ProgramSection() {
  return (
    <section id="program" className="border-t border-border bg-bg-muted">
      <div className="mx-auto max-w-[1180px] px-5 py-16">
        <ScrollReveal className="max-w-2xl">
          <span className="section-label">Программа</span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {PROGRAM_INTRO.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-muted sm:text-lg">
            {PROGRAM_INTRO.lead}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={40} className="mt-8">
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {PROGRAM_INTRO.companyDays.map((item, index) => (
              <article
                key={item.day}
                className="relative overflow-hidden rounded-[20px] border border-border bg-surface p-5 shadow-sm sm:p-6"
              >
                <h3
                  className={`font-heading text-xl font-extrabold leading-snug sm:text-2xl ${DAY_LABEL_COLORS[index] ?? DAY_LABEL_COLORS[0]}`}
                >
                  День {item.day}
                </h3>
                <p className="mt-2 text-base font-semibold leading-snug text-text sm:text-lg">
                  {item.title}
                </p>
                <p className="mt-3 text-sm font-medium text-accent sm:text-base">{item.theme}</p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted sm:text-base">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
