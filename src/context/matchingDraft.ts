import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ApiSlot = { date: string; hour: number };

export type MatchingDraft = {
  // 공통(사전/일반)
  available_slots: ApiSlot[];
  excluded_restaurant_ids: string[];

  // 일반 매칭에서만 사용(사전 단계에서는 비워둠)
  preferred_years: string[];
  excluded_mbti: string[];
};

const emptyDraft = (): MatchingDraft => ({
  available_slots: [],
  excluded_restaurant_ids: [],
  preferred_years: [],
  excluded_mbti: [],
});

type State = {
  activeWeekKey: string; // 예: "2026-02-23" (week_start)
  draftByWeek: Record<string, MatchingDraft>;

  setActiveWeekKey: (weekKey: string) => void;

  // setters (현재 activeWeekKey에 적용)
  setAvailableSlots: (available_slots: ApiSlot[]) => void;
  setExcludedRestaurantIds: (excluded_restaurant_ids: string[]) => void;
  setPreferredYears: (years: string[]) => void;
  setExcludedMbti: (excluded_mbti: string[]) => void;

  // getters/util
  getDraft: (weekKey?: string) => MatchingDraft;
  resetDraft: (weekKey?: string) => void;
};

export const useMatchingDraftByWeek = create<State>()(
  persist(
    (set, get) => ({
      activeWeekKey: '',
      draftByWeek: {},

      setActiveWeekKey: (weekKey) => set({ activeWeekKey: weekKey }),

      setAvailableSlots: (available_slots) =>
        set((state) => {
          const wk = state.activeWeekKey;
          if (!wk) return state;
          const prev = state.draftByWeek[wk] ?? emptyDraft();
          return {
            draftByWeek: {
              ...state.draftByWeek,
              [wk]: { ...prev, available_slots },
            },
          };
        }),

      setExcludedRestaurantIds: (excluded_restaurant_ids) =>
        set((state) => {
          const wk = state.activeWeekKey;
          if (!wk) return state;
          const prev = state.draftByWeek[wk] ?? emptyDraft();
          return {
            draftByWeek: {
              ...state.draftByWeek,
              [wk]: { ...prev, excluded_restaurant_ids },
            },
          };
        }),

      setPreferredYears: (preferred_years) =>
        set((state) => {
          const wk = state.activeWeekKey;
          if (!wk) return state;
          const prev = state.draftByWeek[wk] ?? emptyDraft();
          return {
            draftByWeek: {
              ...state.draftByWeek,
              [wk]: { ...prev, preferred_years },
            },
          };
        }),

      setExcludedMbti: (excluded_mbti) =>
        set((state) => {
          const wk = state.activeWeekKey;
          if (!wk) return state;
          const prev = state.draftByWeek[wk] ?? emptyDraft();
          return {
            draftByWeek: {
              ...state.draftByWeek,
              [wk]: { ...prev, excluded_mbti },
            },
          };
        }),

      getDraft: (weekKey) => {
        const wk = weekKey ?? get().activeWeekKey;
        if (!wk) return emptyDraft();
        return get().draftByWeek[wk] ?? emptyDraft();
      },

      resetDraft: (weekKey) =>
        set((state) => {
          const wk = weekKey ?? state.activeWeekKey;
          if (!wk) return state;
          const next = { ...state.draftByWeek };
          next[wk] = emptyDraft();
          return { draftByWeek: next };
        }),
    }),
    { name: 'matching-draft-by-week-v1' },
  ),
);
