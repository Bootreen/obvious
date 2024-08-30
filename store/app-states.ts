import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { State, initialState } from "@/config/app-initial-state";

export const useAppStates = create<State>()(
  immer((set, get) => ({
    ...initialState,
    actions: {
      setTabState: (tab: keyof State["tabs"], isLoaded: boolean) =>
        set((state: State) => {
          state.tabs[tab].isLoaded = isLoaded;
        }),
      setCheckboxState: (
        checkbox: keyof State["checkboxes"],
        isChecked: boolean,
      ) =>
        set((state: State) => {
          state.checkboxes[checkbox].isChecked = isChecked;
        }),
      setRequest: (content: string) =>
        set((state: State) => {
          state.request = content;
        }),
      setTopic: (topic: string) =>
        set((state) => {
          state.topic = topic;
        }),
      setGuide: (guide: string[]) =>
        set((state) => {
          state.guide = guide;
        }),
      setSummary: (summary: string) =>
        set((state) => {
          state.summary = summary;
        }),
      setFlashcards: (flashcards: typeof initialState.flashcards) =>
        set((state) => {
          state.flashcards = flashcards;
        }),
      setPairMatcher: (value: typeof initialState.pairMatcher) =>
        set((state) => {
          state.pairMatcher = value;
        }),
      setQuiz: (quiz: typeof initialState.quiz) =>
        set((state) => {
          state.quiz = quiz;
        }),
      setSubtopics: (subtopics: string[]) =>
        set((state) => {
          state.subtopics = subtopics;
        }),
      setIsBusy: (value: boolean) =>
        set((state) => {
          state.isBusy = value;
        }),
      setCurrentFlashcardNumber: (cardNumber: number) =>
        set((state) => {
          state.currentFlashcardNumber = cardNumber;
        }),
      setIsFlashcardFlipped: (value: boolean) =>
        set((state) => {
          state.isFlashcardFlipped = value;
        }),
      setIsFlipInProgress: (value: boolean) =>
        set((state) => {
          state.isFlipInProgress = value;
        }),
      setHint: (value) => {
        set((state) => {
          state.hint = value;
        });
      },
      resetContent: () => {
        get().actions.setTopic("");
        get().actions.setGuide([]);
        get().actions.setSummary("");
        get().actions.setFlashcards([]);
        get().actions.setQuiz([]);
        get().actions.setSubtopics([]);
        get().actions.setCurrentFlashcardNumber(1);
        get().actions.setIsFlashcardFlipped(false);
        get().actions.setIsFlipInProgress(false);
        get().actions.setHint("");
      },
    },
  })),
);

export const useAppActions = () => useAppStates(({ actions }) => actions);
