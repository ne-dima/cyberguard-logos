"use client";

import { OptionButtons, QuestionCard } from "../QuestionCard";

interface StudyPlaceQuestionProps {
  onUniversity: () => void;
  onSchoolCollege: () => void;
  onNotStudying: () => void;
}

export function StudyPlaceQuestion({
  onUniversity,
  onSchoolCollege,
  onNotStudying,
}: StudyPlaceQuestionProps) {
  return (
    <QuestionCard title="Где ты учишься?">
      <OptionButtons
        options={[
          { label: "ВУЗ", value: "university", onSelect: onUniversity },
          {
            label: "Школа или Колледж",
            value: "school_college",
            onSelect: onSchoolCollege,
          },
          { label: "Не учусь", value: "not_studying", onSelect: onNotStudying },
        ]}
      />
    </QuestionCard>
  );
}
