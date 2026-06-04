"use client";

import { OptionButtons, QuestionCard } from "../QuestionCard";

interface TransferLogosQuestionProps {
  onYes: () => void;
  onNo: () => void;
}

export function TransferLogosQuestion({ onYes, onNo }: TransferLogosQuestionProps) {
  return (
    <QuestionCard title="Хочешь переводиться в «ЛОГОС»?">
      <OptionButtons
        options={[
          { label: "Да", value: "yes", onSelect: onYes },
          { label: "Нет", value: "no", onSelect: onNo },
        ]}
      />
    </QuestionCard>
  );
}
