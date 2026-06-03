"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SUBJECT_SUGGESTIONS } from "@/lib/survey/constants";
import { QuestionCard } from "../QuestionCard";

interface FavoriteSubjectQuestionProps {
  onSubmit: (value: string) => void;
}

export function FavoriteSubjectQuestion({ onSubmit }: FavoriteSubjectQuestionProps) {
  const [value, setValue] = useState("");

  return (
    <QuestionCard title="Какой любимый предмет?">
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Например: информатика"
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {SUBJECT_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setValue(suggestion)}
            className="rounded-full bg-accent-light px-3 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <Button
        className="mt-6"
        fullWidth
        disabled={!value.trim()}
        onClick={() => onSubmit(value.trim())}
      >
        Продолжить
      </Button>
    </QuestionCard>
  );
}
