import { RequestData } from "@/types";

export const parseRequestContent = (requestData: RequestData): string => {
  const materials = [];

  if ("summary" in requestData) materials.push("Summary");
  if ("guide" in requestData) materials.push("Guide");
  if ("deck" in requestData) materials.push("Cards");
  if ("pairMatcher" in requestData) materials.push("Pairs");
  if ("quiz" in requestData) materials.push("Quiz");

  return `${requestData.topic}: (${materials.join(", ")})`;
};
