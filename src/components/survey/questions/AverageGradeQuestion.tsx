"use client";

import { OptionButtons, QuestionCard } from "../QuestionCard";

interface AverageGradeQuestionProps {
  onBelow4: () => void;
  onAbove4: () => void;
}

export function AverageGradeQuestion({ onBelow4, onAbove4 }: AverageGradeQuestionProps) {
  return (
    <QuestionCard title="Какой у тебя средний балл за прошедший год?">
      <OptionButtons
        options={[
          { label: "Ниже 4", value: "below_4", onSelect: onBelow4 },
          { label: "Выше 4", value: "above_4", onSelect: onAbove4 },
        ]}
      />
    </QuestionCard>
  );
}
