"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useSurvey } from "@/hooks/useSurvey";

type SurveyContextValue = ReturnType<typeof useSurvey>;

const SurveyContext = createContext<SurveyContextValue | null>(null);

export function SurveyProvider({ children }: { children: ReactNode }) {
  const survey = useSurvey();
  return <SurveyContext.Provider value={survey}>{children}</SurveyContext.Provider>;
}

export function useSurveyContext(): SurveyContextValue {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error("useSurveyContext must be used within SurveyProvider");
  }
  return context;
}
