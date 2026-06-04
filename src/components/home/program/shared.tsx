import {
  PROGRAM_ACTIVITY_KIND_LABELS,
  type ProgramActivity,
  type ProgramDay,
} from "@/content/programSchedule";
import { ProgramActivityIcon } from "@/components/home/ProgramActivityIcon";

export function formatActivityCount(count: number): string {
  if (count === 1) return "1 событие";
  if (count < 5) return `${count} события`;
  return `${count} событий`;
}

export function ActivityMeta({ activity }: { activity: ProgramActivity }) {
  const kindLabel = PROGRAM_ACTIVITY_KIND_LABELS[activity.kind];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-bg-muted px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
        {kindLabel}
      </span>
      {activity.optional ? (
        <span className="rounded-full bg-accent-light px-2.5 py-0.5 text-[11px] font-semibold text-accent">
          По расписанию
        </span>
      ) : null}
      {activity.partner ? (
        <span className="rounded-full border border-accent/20 bg-accent-light px-2.5 py-0.5 text-[11px] font-semibold text-accent">
          {activity.partner}
        </span>
      ) : null}
    </div>
  );
}

export function ActivityCardBody({
  activity,
  className = "",
}: {
  activity: ProgramActivity;
  className?: string;
}) {
  return (
    <article
      className={`rounded-2xl border border-border bg-surface p-4 shadow-sm transition-all duration-200 hover:border-accent/30 hover:shadow-md sm:p-5 ${
        activity.optional ? "border-dashed bg-bg-muted/40" : ""
      } ${className}`}
    >
      <div className="flex gap-3 sm:gap-4">
        <ProgramActivityIcon kind={activity.kind} />
        <div className="min-w-0 flex-1">
          <ActivityMeta activity={activity} />
          <h4 className="mt-2 font-heading text-base font-bold leading-snug text-text sm:text-[1.05rem]">
            {activity.title}
          </h4>
          <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{activity.description}</p>
        </div>
      </div>
    </article>
  );
}

export function DayTitleBlock({ day, large }: { day: ProgramDay; large?: boolean }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">День {day.number}</p>
      <h3
        className={`mt-1 font-heading font-bold tracking-tight text-text ${
          large ? "text-2xl sm:text-[1.65rem]" : "text-xl sm:text-2xl"
        }`}
      >
        {day.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-text-muted sm:text-base">{day.tagline}</p>
    </div>
  );
}
