import type { ProgramActivityKind } from "@/content/programSchedule";

const STROKE = {
  viewBox: "0 0 24 24",
  fill: "none",
  className: "h-5 w-5",
  "aria-hidden": true,
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconLecture() {
  return (
    <svg {...STROKE}>
      <path d="M2 3h20" />
      <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
      <path d="M12 16v5" />
      <path d="M8 21h8" />
    </svg>
  );
}

function IconQuest() {
  return (
    <svg {...STROKE}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
      <path d="M11 8v6" />
      <path d="M8 11h6" />
    </svg>
  );
}

function IconHackathon() {
  return (
    <svg {...STROKE}>
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </svg>
  );
}

function IconGame() {
  return (
    <svg {...STROKE}>
      <line x1="6" x2="10" y1="12" y2="12" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="15" x2="15.01" y1="13" y2="13" />
      <line x1="18" x2="18.01" y1="11" y2="11" />
      <rect width="20" height="12" x="2" y="6" rx="2" />
    </svg>
  );
}

function IconWorkshop() {
  return (
    <svg {...STROKE}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function IconPitch() {
  return (
    <svg {...STROKE}>
      <path d="M3 3v18h18" />
      <path d="M7 16l4-7 4 5 5-8" />
    </svg>
  );
}

function IconClosing() {
  return (
    <svg {...STROKE}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function IconOptional() {
  return (
    <svg {...STROKE}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function IconQuiz() {
  return (
    <svg {...STROKE}>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}

const ICONS: Record<ProgramActivityKind, () => JSX.Element> = {
  lecture: IconLecture,
  quest: IconQuest,
  hackathon: IconHackathon,
  game: IconGame,
  workshop: IconWorkshop,
  pitch: IconPitch,
  closing: IconClosing,
  optional: IconOptional,
  quiz: IconQuiz,
};

export function ProgramActivityIcon({ kind }: { kind: ProgramActivityKind }) {
  const Icon = ICONS[kind];
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-light text-accent">
      <Icon />
    </span>
  );
}
