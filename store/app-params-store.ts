import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

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
  };
};

const initialState = {
  tabs: {
    Main: true,
    Guide: false,
    Summary: false,
    Flashcards: false,
    "Pair match": false,
    Quiz: false,
  },
  checkboxes: {
    guide: { label: "Step by step guide", isChecked: true },
    summary: { label: "Summary", isChecked: true },
    flashcards: { label: "Flashcards", isChecked: true },
    pairmatch: { label: "Pair match", isChecked: true },
    quiz: { label: "Quiz", isChecked: true },
  },
  request: "",
};

export const useAppParamsStore = create<State>()(
  immer((set) => ({
    ...initialState,
    actions: {
      setTabState: (tab: keyof State["tabs"], isLoaded: boolean) =>
        set((state: State) => {
          state.tabs[tab] = isLoaded;
        }),
      setCheckboxState: (
        checkbox: keyof State["checkboxes"],
        isChecked: boolean,
      ) =>
        set((state: State) => {
          state.checkboxes[checkbox].isChecked = isChecked;
        }),
    },
  })),
);

export const useAppParamsStoreActions = () =>
  useAppParamsStore(({ actions }) => actions);
