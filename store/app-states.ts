import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import {
  FlashcardsIcon,
  GuideIcon,
  HomeIcon,
  PairsIcon,
  QuizIcon,
  SummaryIcon,
} from "@/components/icons";

type State = typeof initialState & {
  actions: {
    setTabState: (
      tab: keyof typeof initialState.tabs,
      isLoaded: boolean,
    ) => void;
    setCheckboxState: (
      checkbox: keyof typeof initialState.checkboxes,
      isChecked: boolean,
    ) => void;
    setRequestContent: (content: string) => void;
  };
};

const initialState = {
  tabs: {
    Main: { href: "/", icon: HomeIcon, isLoaded: true },
    Guide: { href: "/guide", icon: GuideIcon, isLoaded: false },
    Summary: { href: "/summary", icon: SummaryIcon, isLoaded: false },
    Flashcards: { href: "/flashcards", icon: FlashcardsIcon, isLoaded: false },
    "Pair match": { href: "/pairmatch", icon: PairsIcon, isLoaded: false },
    Quiz: { href: "/quiz", icon: QuizIcon, isLoaded: false },
  },
  checkboxes: {
    guide: { label: "Step by step guide", isChecked: true },
    summary: { label: "Summary", isChecked: true },
    flashcards: { label: "Flashcards", isChecked: true },
    pairmatch: { label: "Pair match", isChecked: true },
    quiz: { label: "Quiz", isChecked: true },
  },
  request: "",
  topic: "",
  guide: [] as string[],
  summary: "",
  flashcards: [] as { question: string; answer: string }[],
  pairs: [] as { question: string; answer: string }[],
  quiz: [] as {
    question: string;
    options: { text: string; isCorrect: boolean }[];
  }[],
  subtopics: [] as string[],
};

export const useAppStates = create<State>()(
  immer((set) => ({
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
      setRequestContent: (content: string) => {
        set((state: State) => {
          state.request = content;
        });
      },
    },
  })),
);

export const useAppActions = () => useAppStates(({ actions }) => actions);
