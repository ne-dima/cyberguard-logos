"use client";

import { Modal } from "@/components/ui/Modal";
import { useSurvey } from "@/hooks/useSurvey";
import { FarewellMessage } from "./FarewellMessage";
import { RegistrationFormStub } from "./RegistrationFormStub";
import { ApplyLogosQuestion } from "./questions/ApplyLogosQuestion";
import { AverageGradeQuestion } from "./questions/AverageGradeQuestion";
import { FavoriteSubjectQuestion } from "./questions/FavoriteSubjectQuestion";
import { StudyPlaceQuestion } from "./questions/StudyPlaceQuestion";
import { SubjectGradeQuestion } from "./questions/SubjectGradeQuestion";
import { TransferLogosQuestion } from "./questions/TransferLogosQuestion";
import { WantIntensiveQuestion } from "./questions/WantIntensiveQuestion";

export function SurveyWizard() {
  const { state, isReady, closeSurvey, handlers } = useSurvey();

  if (!isReady || !state?.isOpen) {
    return null;
  }

  const renderStep = () => {
    if (state.farewell) {
      return <FarewellMessage farewell={state.farewell} onClose={closeSurvey} />;
    }

    switch (state.step) {
      case "want_intensive":
        return (
          <WantIntensiveQuestion
            onYes={handlers.wantIntensiveYes}
            onNo={handlers.wantIntensiveNo}
          />
        );
      case "study_place":
        return (
          <StudyPlaceQuestion
            onUniversity={handlers.studyUniversity}
            onSchoolCollege={handlers.studySchoolCollege}
            onNotStudying={handlers.studyNotStudying}
          />
        );
      case "transfer_logos":
        return (
          <TransferLogosQuestion
            onYes={handlers.transferYes}
            onNo={handlers.transferNo}
          />
        );
      case "average_grade":
        return (
          <AverageGradeQuestion
            onBelow4={handlers.gradeBelow4}
            onAbove4={handlers.gradeAbove4}
          />
        );
      case "favorite_subject":
        return <FavoriteSubjectQuestion onSubmit={handlers.favoriteSubjectSubmit} />;
      case "subject_grade":
        return (
          <SubjectGradeQuestion
            onNot5={handlers.subjectNot5}
            on5={handlers.subject5}
          />
        );
      case "apply_logos":
        return (
          <ApplyLogosQuestion
            onYes={handlers.applyYes}
            onNo={handlers.applyNo}
          />
        );
      case "registration":
        return (
          <RegistrationFormStub onClose={handlers.completeRegistration} />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={state.isOpen}
      onClose={state.farewell ? closeSurvey : undefined}
      ariaLabel="Опрос для участия в КиберБезИнтенсиве"
    >
      <div key={`${state.step}-${state.farewell ?? "active"}`} className="animate-question-in">
        {renderStep()}
      </div>
    </Modal>
  );
}
