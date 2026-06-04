"use client";

import { OptionButtons, QuestionCard } from "../QuestionCard";

interface ApplyLogosQuestionProps {
  onYes: () => void;
  onNo: () => void;
}

export function ApplyLogosQuestion({ onYes, onNo }: ApplyLogosQuestionProps) {
  return (
    <QuestionCard title="Хочешь поступать в «ЛОГОС»?">
      <OptionButtons
        options={[
          { label: "Да", value: "yes", onSelect: onYes },
          { label: "Нет", value: "no", onSelect: onNo },
        ]}
      />
    </QuestionCard>
  );
}
