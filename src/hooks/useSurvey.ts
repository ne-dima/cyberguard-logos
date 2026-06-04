"use client";

import { useCallback, useEffect, useState } from "react";
import { loadSurveyState, resetSurveyState, saveSurveyState } from "@/lib/survey/storage";
import {
  INITIAL_SURVEY_STATE,
  type FarewellKey,
  type SurveyState,
  type SurveyStep,
} from "@/lib/survey/types";
import { isSubjectMatching } from "@/lib/survey/validateSubject";

function closeWithFarewell(
  prev: SurveyState,
  farewell: FarewellKey,
): SurveyState {
  const next: SurveyState = {
    ...prev,
    farewell,
    step: "closed",
    isOpen: true,
    completedAt: new Date().toISOString(),
  };
  saveSurveyState(next);
  return next;
}

export function useSurvey() {
  const [state, setState] = useState<SurveyState>(INITIAL_SURVEY_STATE);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setState(loadSurveyState());
    setIsReady(true);
  }, []);

  const persist = useCallback((updater: (prev: SurveyState) => SurveyState) => {
    setState((prev) => {
      const next = updater(prev);
      saveSurveyState(next);
      return next;
    });
  }, []);

  const openSurvey = useCallback(() => {
    persist((prev) => {
      if (prev.completedAt || prev.step === "closed" || prev.farewell) {
        return { ...INITIAL_SURVEY_STATE, isOpen: true };
      }
      return { ...prev, isOpen: true };
    });
  }, [persist]);

  const closeSurvey = useCallback(() => {
    persist((prev) => ({ ...prev, isOpen: false }));
  }, [persist]);

  const restartSurvey = useCallback(() => {
    const fresh = resetSurveyState();
    setState(fresh);
  }, []);

  const goToStep = useCallback(
    (step: SurveyStep, patch: Partial<SurveyState["answers"]> = {}) => {
      persist((prev) => ({
        ...prev,
        step,
        farewell: null,
        answers: { ...prev.answers, ...patch },
      }));
    },
    [persist],
  );

  const handlers = {
    wantIntensiveYes: () => goToStep("study_place", { wantIntensive: true }),
    wantIntensiveNo: () =>
      persist((prev) => closeWithFarewell({ ...prev, answers: { ...prev.answers, wantIntensive: false } }, "goodbye_intro")),

    studyUniversity: () =>
      persist((prev) =>
        closeWithFarewell({ ...prev, answers: { ...prev.answers, studyPlace: "university" } }, "not_for_us"),
      ),
    studySchoolCollege: () =>
      goToStep("transfer_logos", { studyPlace: "school_college" }),
    studyNotStudying: () =>
      persist((prev) =>
        closeWithFarewell({ ...prev, answers: { ...prev.answers, studyPlace: "not_studying" } }, "not_for_us"),
      ),

    transferYes: () => goToStep("average_grade", { transferLogos: true }),
    transferNo: () =>
      persist((prev) =>
        closeWithFarewell({ ...prev, answers: { ...prev.answers, transferLogos: false } }, "goodbye_general"),
      ),

    gradeBelow4: () =>
      persist((prev) =>
        closeWithFarewell({ ...prev, answers: { ...prev.answers, averageGrade: "below_4" } }, "goodbye_general"),
      ),
    gradeAbove4: () => goToStep("favorite_subject", { averageGrade: "above_4" }),

    favoriteSubjectSubmit: (value: string) => {
      if (!isSubjectMatching(value)) {
        persist((prev) =>
          closeWithFarewell(
            { ...prev, answers: { ...prev.answers, favoriteSubject: value } },
            "goodbye_general",
          ),
        );
        return;
      }
      goToStep("subject_grade", { favoriteSubject: value });
    },

    subjectNot5: () =>
      persist((prev) =>
        closeWithFarewell({ ...prev, answers: { ...prev.answers, subjectGrade: "not_5" } }, "goodbye_general"),
      ),
    subject5: () => goToStep("apply_logos", { subjectGrade: "5" }),

    applyYes: () => goToStep("registration", { applyLogos: true }),
    applyNo: () =>
      persist((prev) =>
        closeWithFarewell({ ...prev, answers: { ...prev.answers, applyLogos: false } }, "other_options"),
      ),

    /** Сразу после успешной отправки анкеты — чтобы при возврате на главную опрос не открывался снова */
    markApplicationSubmitted: () => {
      persist((prev) => ({
        ...prev,
        step: "closed",
        completedAt: prev.completedAt ?? new Date().toISOString(),
      }));
    },

    completeRegistration: () => {
      persist((prev) => ({
        ...prev,
        step: "closed",
        isOpen: false,
        completedAt: prev.completedAt ?? new Date().toISOString(),
      }));
    },
  };

  return {
    state,
    isReady,
    openSurvey,
    closeSurvey,
    restartSurvey,
    handlers,
  };
}
