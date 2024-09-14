import { SessionDetail, User, UserHistory } from "@/types/index";
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
  // Flashcards state object
  deck: {
    isReady: false,
    flashcards: [] as { question: string; answer: string }[],
    currentFlashcardNumber: 1,
    isFlashcardFlipped: false,
    isFlipInProgress: false,
    hint: "",
    hintsCounter: 0,
  },
  // Matching pairs state object
  pairMatcher: {
    isReady: false,
    isSolved: false,
    matchedPairsCounter: 0,
    mistakesCounter: 0,
    pairs: [] as {
      question: { value: string; index: number; isSelected: boolean };
      answer: { value: string; index: number; isSelected: boolean };
    }[],
  },
  quiz: {
    isReady: false,
    isSolved: false,
    currentQuestionNumber: 0,
    correctAnswersCounter: 0,
    questions: [] as {
      question: string;
      options: { option: string; isCorrect: boolean }[];
      isAnswered: boolean;
      selectedIncorrectOptionIndex: number | null;
    }[],
  },
  subtopics: [] as string[],

  contentRoutes: ["/"] as string[],

  user: null as User,
  session: { id: 0 } as SessionDetail,
  userHistory: [] as UserHistory,

  isBusy: false, // Temporarily blocks input, when App is waiting for API response
  progress: 0, // Variable for 'Loading' progress bar

  isSaved: false, // Signals if the current request was saved
};

export type State = typeof initialState & {
  actions: {
    setIsBusy: (value: boolean) => void;
    setIsSaved: (value: boolean) => void;
    setProgress: (value: number) => void;

    setTabState: (
      tab: keyof typeof initialState.tabs,
      isLoaded: boolean,
    ) => void;
    turnOffTabs: () => void;

    setCheckboxState: (
      checkbox: keyof typeof initialState.checkboxes,
      isChecked: boolean,
    ) => void;

    setRequest: (content: string) => void;
    setTopic: (topic: string) => void;
    setGuide: (guide: string[]) => void;
    setSummary: (summary: string) => void;

    setFlashcards: (flashcards: typeof initialState.deck.flashcards) => void;
    setCurrentFlashcardNumber: (value: number) => void;
    setIsFlashcardFlipped: (value: boolean) => void;
    setIsFlipInProgress: (value: boolean) => void;
    setHint: (value: string) => void;
    incHintsCounter: () => void;

    incMatchedPairsCounter: () => void;
    incMistakesCounter: () => void;
    setPairMatcher: (value: typeof initialState.pairMatcher.pairs) => void;
    setPairs: (value: typeof initialState.pairMatcher.pairs) => void;
    setPairPartSelected: (type: "question" | "answer", index: number) => void;
    matchPair: (questionIndex: number, answerIndex: number) => void;

    setQuiz: (quiz: typeof initialState.quiz.questions) => void;
    incCurrentQuestionNumber: () => void;
    incCorrectAnswersCounter: () => void;
    setIsAnswered: (index: number) => void;
    setSelectedIncorrectOptionIndex: (
      questionIndex: number,
      optionIndex: number,
    ) => void;

    setSubtopics: (subtopics: string[]) => void;
    resetContentRoutes: () => void;
    addContentRoute: (route: string) => void;
    resetContent: () => void;

    setUser: (user: User) => void;
    setSession: (session: SessionDetail) => void;
    setHistory: (history: UserHistory) => void;
  };
};
