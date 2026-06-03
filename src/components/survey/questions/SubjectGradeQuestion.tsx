"use client";

import { OptionButtons, QuestionCard } from "../QuestionCard";

interface SubjectGradeQuestionProps {
  onNot5: () => void;
  on5: () => void;
}

export function SubjectGradeQuestion({ onNot5, on5 }: SubjectGradeQuestionProps) {
  return (
    <QuestionCard title="Какая оценка по этому предмету?">
      <OptionButtons
        options={[
          { label: "Не 5", value: "not_5", onSelect: onNot5 },
          { label: "5", value: "5", onSelect: on5 },
        ]}
      />
    </QuestionCard>
  );
}
