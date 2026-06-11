export type SurveyStep =
  | "want_intensive"
  | "study_place"
  | "average_grade"
  | "favorite_subject"
  | "subject_grade"
  | "registration"
  | "closed";

export type FarewellKey =
  | "goodbye_intro"
  | "not_for_us"
  | "goodbye_general"
  | "other_options";

export interface SurveyAnswers {
  wantIntensive?: boolean;
  studyPlace?: "university" | "school_college" | "not_studying";
  averageGrade?: "below_4" | "above_4";
  favoriteSubject?: string;
  subjectGrade?: "not_5" | "5";
}

export interface SurveyState {
  step: SurveyStep;
  answers: SurveyAnswers;
  farewell: FarewellKey | null;
  isOpen: boolean;
  completedAt: string | null;
}

export const SURVEY_STORAGE_KEY = "cyber-intensive-survey";

export const INITIAL_SURVEY_STATE: SurveyState = {
  step: "want_intensive",
  answers: {},
  farewell: null,
  isOpen: false,
  completedAt: null,
};
