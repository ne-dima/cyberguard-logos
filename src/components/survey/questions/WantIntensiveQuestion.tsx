"use client";

import { OptionButtons, QuestionCard } from "../QuestionCard";

interface WantIntensiveQuestionProps {
  onYes: () => void;
  onNo: () => void;
}

export function WantIntensiveQuestion({ onYes, onNo }: WantIntensiveQuestionProps) {
  return (
    <QuestionCard title="Хочешь попасть на КиберСтраж?">
      <OptionButtons
        options={[
          { label: "Да", value: "yes", onSelect: onYes },
          { label: "Нет", value: "no", onSelect: onNo },
        ]}
      />
    </QuestionCard>
  );
}
