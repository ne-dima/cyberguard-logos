import type { ProgramDay } from "@/content/programSchedule";
import { DayLayoutPoster } from "@/components/home/program/dayVariants";

export function ProgramDayPanel({ day, dayIndex }: { day: ProgramDay; dayIndex: number }) {
  return <DayLayoutPoster day={day} dayIndex={dayIndex} />;
}
