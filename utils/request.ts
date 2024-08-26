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

      // Catch network errors from makeRequest
      if (!response) throw new Error("Network error");

      let parsedResponse;

      // Catch JSON-related errors
      try {
        parsedResponse = JSON.parse(response);
      } catch (error) {
        throw new Error("JSON error");
      }

      const keys: (keyof Response)[] = [
        "topic",
        "guide",
        "summary",
        "flashcards",
        "pairmatch",
        "quiz",
        "subtopics",
        "error",
      ];

      // Add only existing keys to result
      result = keys.reduce((acc, key) => {
        if (key in parsedResponse) {
          acc[key] = parsedResponse[key];
        }

        return acc;
      }, {} as Response);
    } else {
      console.log(data.error);
      throw new Error("Request failed with status " + status);
    }
  } catch (error) {
    result.error = { isError: true, message: (error as Error).message };
  }

  return result;
};
