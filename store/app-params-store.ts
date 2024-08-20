import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { headers } from "next/headers";

const headerList = headers();
const currentPath: string | null = headerList.get("x-current-path");

type State = {
  currentPath: string | null;
};

type Actions = {
  actions: {
    setCurrentPath: (path: string) => void;
  };
};

export const useAppParamsStore = create<State & Actions>()(
  immer((set) => ({
    currentPath: currentPath,
    actions: {
      setCurrentPath: (path: string) =>
        set((state) => {
          state.currentPath = path;
        }),
    },
  })),
);

export const useAppParamsActions = () =>
  useAppParamsStore((state) => state.actions);
