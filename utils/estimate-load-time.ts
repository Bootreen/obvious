import { initialState } from "@/config/app-initial-state";

export const estimateLoadTime = (
  checkboxes: typeof initialState.checkboxes,
): number => {
  // Average time to generate tabs (determined experimentally)
  // And made more conservative than averages
  const tabsEstimate = {
    summary: 1900,
    guide: 2200,
    flashcards: 2500,
    pairmatch: 2500,
    quiz: 4500,
  };

  // Check which checkboxes are selected and sum up the estimated time
  return Object.entries(checkboxes)
    .map(([key, { isChecked }]) =>
      isChecked ? tabsEstimate[key as keyof typeof tabsEstimate] : 0,
    )
    .reduce((acc, cur) => acc + cur, 0);
};
