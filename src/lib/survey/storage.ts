import {
  INITIAL_SURVEY_STATE,
  SURVEY_STORAGE_KEY,
  type SurveyState,
} from "./types";

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
    if (parsed.completedAt) {
      return { ...parsed, isOpen: false };
    }
    return parsed;
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
