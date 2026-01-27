'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { MatchingStatus } from '@/constants/MATCHING';

export const matchingStatusList: MatchingStatus[] = [
  'before',
  'inProgress',
  'completed',
];

type MatchingContextType = {
  currentStatus: MatchingStatus;
  setCurrentStatus: (status: MatchingStatus) => void;
};

export const MatchingContext = createContext<MatchingContextType | null>(null);

export function MatchingProvider({ children }: { children: ReactNode }) {
  const [currentStatus, setCurrentStatus] = useState<MatchingStatus>('before');

  return (
    <MatchingContext.Provider value={{ currentStatus, setCurrentStatus }}>
      {children}
    </MatchingContext.Provider>
  );
}

export const useMatching = () => {
  const context = useContext(MatchingContext);
  if (!context)
    throw new Error('useMatching must be used within a MatchingProvider');
  return context;
};
