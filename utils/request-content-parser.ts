import { RequestData } from "@/types";

export const parseRequestContent = (requestData: RequestData): string => {
  return `${"summary" in requestData ? " Summary" : ""}${"guide" in requestData ? " Guide" : ""}${"deck" in requestData ? " Cards" : ""}
  ${"pairMatcher" in requestData ? " Pairs" : ""}${"quiz" in requestData ? " Quiz" : ""}`;
};
