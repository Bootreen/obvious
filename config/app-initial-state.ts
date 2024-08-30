import {
  FlashcardsIcon,
  GuideIcon,
  HomeIcon,
  PairsIcon,
  QuizIcon,
  SummaryIcon,
} from "@/components/icons";

export const initialState = {
  // App navigation tabs
  tabs: {
    main: { label: "Main", href: "/", icon: HomeIcon, isLoaded: true },
    summary: {
      label: "Summary",
      href: "/summary",
      icon: SummaryIcon,
      isLoaded: false,
    },
    guide: { label: "Guide", href: "/guide", icon: GuideIcon, isLoaded: false },
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

  // Desired material type checkboxes
  checkboxes: {
    summary: { label: "Summary", isChecked: true },
    guide: { label: "Step by step guide", isChecked: true },
    flashcards: { label: "Flashcards", isChecked: true },
    pairmatch: { label: "Pair match", isChecked: true },
    quiz: { label: "Quiz", isChecked: true },
  },

  // Request and response
  request: "",
  topic: "",
  guide: [] as string[],
  summary: "",
  flashcards: [] as { question: string; answer: string }[],
  pairMatcher: {
    isReady: false,
    isSolved: false,
    matchedPairs: 0,
    pairs: [] as {
      question: string;
      isQuestionSelected: boolean;
      answer: string;
      isAnswerSelected: boolean;
      i: number; // original question index from pairmatch object
      j: number; // original answer index from pairmatch object
    }[],
  },
  quiz: [] as {
    question: string;
    options: { text: string; isCorrect: boolean }[];
  }[],
  subtopics: [] as string[],

  // Semaphores and counters
  isBusy: false, // temporarily blocks input, when App is waiting for API response
  currentFlashcardNumber: 1,
  isFlashcardFlipped: false,
  isFlipInProgress: false,
  hint: "",
};

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
    setRequest: (content: string) => void;
    setTopic: (topic: string) => void;
    setGuide: (guide: string[]) => void;
    setSummary: (summary: string) => void;
    setFlashcards: (flashcards: typeof initialState.flashcards) => void;
    setQuiz: (quiz: typeof initialState.quiz) => void;
    setSubtopics: (subtopics: string[]) => void;
    setIsBusy: (value: boolean) => void;
    setCurrentFlashcardNumber: (value: number) => void;
    setIsFlashcardFlipped: (value: boolean) => void;
    setIsFlipInProgress: (value: boolean) => void;
    setHint: (value: string) => void;
    setPairMatcher: (value: typeof initialState.pairMatcher) => void;
    setPairPartSelected: (type: "question" | "answer", index: number) => void;
    resetContent: () => void;
  };
};
