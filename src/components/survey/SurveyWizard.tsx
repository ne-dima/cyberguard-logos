"use client";

import { Modal } from "@/components/ui/Modal";
import { useSurveyContext } from "@/context/SurveyContext";
import { FarewellMessage } from "./FarewellMessage";
import { RegistrationForm } from "./RegistrationForm";
import { AverageGradeQuestion } from "./questions/AverageGradeQuestion";
import { FavoriteSubjectQuestion } from "./questions/FavoriteSubjectQuestion";
import { StudyPlaceQuestion } from "./questions/StudyPlaceQuestion";
import { SubjectGradeQuestion } from "./questions/SubjectGradeQuestion";
import { WantIntensiveQuestion } from "./questions/WantIntensiveQuestion";

export function SurveyWizard() {
  const { state, closeSurvey, handlers } = useSurveyContext();

  if (!state.isOpen) {
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
      case "registration":
        return (
          <RegistrationForm
            onSubmitted={handlers.markApplicationSubmitted}
            onComplete={handlers.completeRegistration}
          />
        );
      case "closed":
        return null;
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={state.isOpen}
      onClose={state.farewell ? closeSurvey : undefined}
      ariaLabel="Опрос для участия в КиберСтраже"
      size={state.step === "registration" ? "lg" : "md"}
      scrollable={state.step === "registration"}
    >
      <div key={`${state.step}-${state.farewell ?? "active"}`} className="animate-question-in">
        {renderStep()}
      </div>
    </Modal>
  );
}
