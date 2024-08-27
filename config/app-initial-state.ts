import {
  FlashcardsIcon,
  GuideIcon,
  HomeIcon,
  PairsIcon,
  QuizIcon,
  SummaryIcon,
} from "@/components/icons";

export type State = typeof initialState & {
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
    setTopic: (topic: string) => void;
    setGuide: (guide: string[]) => void;
    setSummary: (summary: string) => void;
    setFlashcards: (flashcards: { question: string; answer: string }[]) => void;
    setPairmatch: (pairmatch: { question: string; answer: string }[]) => void;
    setQuiz: (
      quiz: {
        question: string;
        options: { text: string; isCorrect: boolean }[];
      }[],
    ) => void;
    setSubtopics: (subtopics: string[]) => void;
  };
};

export const initialState = {
  tabs: {
    main: { label: "Main", href: "/", icon: HomeIcon, isLoaded: true },
    guide: { label: "Guide", href: "/guide", icon: GuideIcon, isLoaded: false },
    summary: {
      label: "Summary",
      href: "/summary",
      icon: SummaryIcon,
      isLoaded: false,
    },
    flashcards: {
      label: "Flashcards",
      href: "/flashcards",
      icon: FlashcardsIcon,
      isLoaded: false,
    },
    pairmatch: {
      label: "Pair Match",
      href: "/pairmatch",
      icon: PairsIcon,
      isLoaded: false,
    },
    quiz: { label: "Quiz", href: "/quiz", icon: QuizIcon, isLoaded: false },
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
  pairmatch: [] as { question: string; answer: string }[],
  quiz: [] as {
    question: string;
    options: { text: string; isCorrect: boolean }[];
  }[],
  subtopics: [] as string[],
};
