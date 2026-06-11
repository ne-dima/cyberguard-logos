import type { CSSProperties } from "react";
import type { ProgramDay } from "@/content/programSchedule";
import { ActivityMeta, formatActivityCount } from "@/components/home/program/shared";
import { ProgramActivityIcon } from "@/components/home/ProgramActivityIcon";

function eventDelay(index: number): CSSProperties {
  return { animationDelay: `${120 + index * 70}ms` };
}

/** Плакат: яркая шапка и карточки с наездом */
export function DayLayoutPoster({
  day,
  dayIndex,
}: {
  day: ProgramDay;
  dayIndex: number;
}) {
  return (
    <article className="program-view-in relative" style={{ animationDelay: `${dayIndex * 40}ms` }}>
      <div className="program-poster-header relative overflow-hidden rounded-[28px] bg-gradient-to-br from-accent to-accent-hover px-6 py-12 text-white sm:px-10 sm:py-14">
        <span
          className="pointer-events-none absolute -bottom-4 right-2 font-heading text-[9rem] font-extrabold leading-none text-white/10 sm:text-[11rem]"
          aria-hidden
        >
          {day.number}
        </span>
        <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-white/70">
          День {day.number} · {day.company}
        </p>
        <h3 className="relative mt-2 max-w-xl font-heading text-2xl font-extrabold leading-tight sm:text-3xl">
          {day.title}
        </h3>
        <p className="relative mt-3 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
          {day.tagline}
        </p>
        <p className="relative mt-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
          {formatActivityCount(day.activities.length)}
        </p>
      </div>

      <ul className="relative z-10 -mt-8 space-y-3 px-3 sm:-mt-10 sm:space-y-4 sm:px-6">
        {day.activities.map((activity, index) => (
          <li
            key={activity.id}
            className="program-poster-card-in rounded-2xl border border-border bg-surface p-4 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.2)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-5"
            style={eventDelay(index)}
          >
            <div className="flex gap-3 sm:gap-4">
              <ProgramActivityIcon kind={activity.kind} />
              <div className="min-w-0 flex-1">
                <ActivityMeta activity={activity} />
                <h4 className="mt-2 font-heading text-base font-bold leading-snug text-text">
                  {activity.title}
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                  {activity.description}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
