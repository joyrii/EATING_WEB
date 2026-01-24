"use client";

import { createContext, useContext } from "react";

export type MatchingStatus = "before" | "inProgress" | "completed";

export const matchingStatusList: MatchingStatus[] = [
  "before",
  "inProgress",
  "completed",
];

type MatchingContextType = {
  currentStatus: MatchingStatus;
  setCurrentStatus: (status: MatchingStatus) => void;
};

export const MatchingContext = createContext<MatchingContextType | null>(null);

export const useMatching = () => {
  const context = useContext(MatchingContext);
  if (!context)
    throw new Error("useMatching must be used within a MatchingProvider");
  return context;
};
