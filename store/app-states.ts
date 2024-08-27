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
      setFlashcards: (flashcards: { question: string; answer: string }[]) =>
        set((state) => {
          state.flashcards = flashcards;
        }),
      setPairmatch: (pairmatch: { question: string; answer: string }[]) =>
        set((state) => {
          state.pairmatch = pairmatch;
        }),
      setQuiz: (
        quiz: {
          question: string;
          options: { text: string; isCorrect: boolean }[];
        }[],
      ) =>
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
      resetContent: () => {
        get().actions.setTopic("");
        get().actions.setGuide([]);
        get().actions.setSummary("");
        get().actions.setFlashcards([]);
        get().actions.setPairmatch([]);
        get().actions.setQuiz([]);
        get().actions.setSubtopics([]);
      },
    },
  })),
);

export const useAppActions = () => useAppStates(({ actions }) => actions);
