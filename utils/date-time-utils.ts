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

export const isSessionExpired = (createdAt: string): boolean => {
  const sessionTime = new Date(createdAt).getTime();
  const currentTime = Date.now();
  const twoHours = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  return currentTime - sessionTime > twoHours;
};

export const parseTimeStampToDateTime = (
  createdAt: string,
  mode: string,
): string => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date(createdAt);

  switch (mode) {
    case "date":
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    case "timeShort":
      return `${date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()}`;
    case "timeLong":
      return `${date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()}:${date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds()}`;
    case "full":
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()}`;
    default:
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()}`;
  }
};
