/* eslint-disable no-console */
import axios from "axios";

import { requestInstructions, responseSchemas } from "@/config/prompt";

export type Parts = "guide" | "summary" | "flashcards" | "pairmatch" | "quiz";

export type Response = Partial<{
  topic: string;
  guide: string[];
  summary: string;
  flashcards: { question: string; answer: string }[];
  pairmatch: { question: string; answer: string }[];
  quiz: { question: string; options: { text: string; isCorrect: boolean }[] }[];
  subtopics: string[];
  error: { isError: boolean; message: string };
}>;

export const geminiApiRequest = async (
  request: string,
  parts: Parts[],
): Promise<Response> => {
  // Prepare instructions for the request
  const { prefix, subtopics, note, postfix } = requestInstructions;
  const instructions = [
    prefix,
    // Include instructions for the requested parts only
    ...Object.entries(requestInstructions)
      .filter(([key]) => parts.includes(key as Parts))
      .map(([, instruction]) => instruction),
    subtopics,
    note,
    postfix,
  ].join("");

  // Prepare schemas for the response
  const {
    topic: topicSchema,
    subtopics: subtopicsSchema,
    error: errorSchema,
  } = responseSchemas;
  const schemas = `{ ${topicSchema}, ${Object.entries(responseSchemas)
    // Include schemas for the requested parts only
    .filter(([key]) => parts.includes(key as Parts))
    .map(([, instruction]) => instruction)
    .join(", ")}, ${subtopicsSchema}, ${errorSchema} }`;

  let result: Response = {};

  try {
    // Make API request
    const { status, data } = await axios.post(
      "/api/generate",
      {
        body: request + instructions + schemas,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (status >= 200 && status < 300) {
      const response = data.output;

      console.log(response);

      // No response error handling
      if (!response) throw new Error("No response error");

      try {
        const parsedResponse: Response = JSON.parse(response);

        // Add to result existing keys only
        result = Object.fromEntries(
          Object.entries(parsedResponse).filter(
            ([_, value]) => value !== undefined,
          ),
        ) as Response;
      } catch (error) {
        // Invalid JSON handling
        throw new Error("JSON error");
      }
    } else throw new Error("Request failed with status " + status);
  } catch (error) {
    // Gather all errors from the nested scopes
    result.error = { isError: true, message: (error as Error).message };
  }

  return result;
};
