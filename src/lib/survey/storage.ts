import {
  INITIAL_SURVEY_STATE,
  SURVEY_STORAGE_KEY,
  type SurveyState,
  type SurveyStep,
} from "./types";

const VALID_STEPS = new Set<SurveyStep>([
  "want_intensive",
  "study_place",
  "average_grade",
  "favorite_subject",
  "subject_grade",
  "registration",
  "closed",
]);

/** Шаги, убранные из опроса — перенаправляем на актуальные. */
const LEGACY_STEP_MAP: Record<string, SurveyStep> = {
  transfer_logos: "average_grade",
  apply_logos: "registration",
};

function normalizeStep(step: unknown): SurveyStep {
  if (typeof step !== "string") {
    return INITIAL_SURVEY_STATE.step;
  }

  if (step in LEGACY_STEP_MAP) {
    return LEGACY_STEP_MAP[step];
  }

  if (VALID_STEPS.has(step as SurveyStep)) {
    return step as SurveyStep;
  }

  return INITIAL_SURVEY_STATE.step;
}

function normalizeSurveyState(parsed: SurveyState): SurveyState {
  const step = normalizeStep(parsed.step);

  if (parsed.completedAt || step === "closed") {
    return { ...parsed, step: "closed", isOpen: false };
  }

  // Незавершённый опрос: сохраняем шаг, модалку открываем только по кнопке
  return { ...parsed, step, isOpen: false, farewell: null };
}

export function loadSurveyState(): SurveyState {
  if (typeof window === "undefined") {
    return INITIAL_SURVEY_STATE;
  }

  try {
    const raw = localStorage.getItem(SURVEY_STORAGE_KEY);
    if (!raw) {
      return INITIAL_SURVEY_STATE;
    }

    const parsed = JSON.parse(raw) as SurveyState;
    return normalizeSurveyState(parsed);
  } catch {
    return INITIAL_SURVEY_STATE;
  }
}

export function saveSurveyState(state: SurveyState): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify(state));
}

export function resetSurveyState(): SurveyState {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SURVEY_STORAGE_KEY);
  }
  return INITIAL_SURVEY_STATE;
}
