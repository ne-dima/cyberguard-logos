"use client";

import { useState } from "react";
import { PROGRAM_DAYS, PROGRAM_EXTRAS, PROGRAM_INTRO } from "@/content/programSchedule";
import { ActivityCardBody } from "@/components/home/program/shared";
import { ProgramDayPanel } from "@/components/home/program/ProgramDayPanel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function ProgramSection() {
  const [activeDay, setActiveDay] = useState(0);

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

        <ScrollReveal delay={60} className="mt-10 lg:hidden">
          <div
            className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Дни программы"
          >
            {PROGRAM_DAYS.map((day, index) => {
              const isActive = activeDay === index;

              return (
                <button
                  key={day.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveDay(index)}
                  className={`shrink-0 rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
                    isActive
                      ? "border-accent bg-accent text-white shadow-lg shadow-accent/25"
                      : "border-border bg-surface text-text-muted hover:border-accent/40"
                  }`}
                >
                  <span className="block text-[10px] font-bold uppercase tracking-wider opacity-80">
                    День {day.number}
                  </span>
                  <span
                    className={`mt-0.5 block text-sm font-semibold leading-tight ${isActive ? "text-white" : "text-text"}`}
                  >
                    {day.title}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        <div className="mt-6 space-y-8 lg:mt-10 lg:space-y-10">
          {PROGRAM_DAYS.map((day, index) => (
            <ScrollReveal
              key={day.id}
              delay={100 + index * 60}
              className={index === activeDay ? "block" : "hidden lg:block"}
            >
              <ProgramDayPanel day={day} dayIndex={index} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={80} className="mt-14">
          <div className="border-t border-border pt-10">
            <h3 className="font-heading text-2xl font-bold text-text">Дополнительные активности</h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-muted sm:text-base">
              Квесты, квизы и мастер-классы — параллельно основной программе, чтобы закрепить навыки в
              игровой форме.
            </p>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {PROGRAM_EXTRAS.map((group) => (
                <div
                  key={group.id}
                  className="rounded-[20px] border border-border bg-surface p-5 shadow-sm sm:p-6"
                >
                  <h4 className="font-heading text-lg font-bold text-text">{group.title}</h4>
                  {group.subtitle ? (
                    <p className="mt-1 text-sm text-text-muted">{group.subtitle}</p>
                  ) : null}
                  <ul className="mt-5 space-y-4">
                    {group.activities.map((activity) => (
                      <li key={activity.id}>
                        <ActivityCardBody activity={activity} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
