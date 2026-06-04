"use client";

import type { ReactNode } from "react";

interface QuestionCardProps {
  title: string;
  children: ReactNode;
}

export function QuestionCard({ title, children }: QuestionCardProps) {
  return (
    <div className="glass-card rounded-t-[20px] p-6 sm:rounded-[20px] sm:p-8">
      <h2 className="font-heading text-xl font-bold leading-snug text-text sm:text-2xl">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </div>
  );
}

interface OptionButtonsProps {
  options: Array<{ label: string; value: string; onSelect: () => void }>;
}

export function OptionButtons({ options }: OptionButtonsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={option.onSelect}
          className="flex-1 rounded-xl border border-border bg-surface px-5 py-3.5 text-left text-sm font-semibold text-text transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-accent-light hover:text-accent sm:min-w-[140px]"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
