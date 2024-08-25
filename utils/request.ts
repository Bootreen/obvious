/* eslint-disable no-console */
import axios from "axios";

import { requestInstructions, responseSchemas } from "@/config/prompt";

export type Parts = "guide" | "summary" | "flashcards" | "pairmatch" | "quiz";

const makeRequest = async (
  request: string,
  instructions: string,
  jsonSchema: string,
) => {
  try {
    const response = await axios.post(
      "/api/generate",
      {
        body: request + instructions + jsonSchema,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = response.data;

    if (response.status >= 200 && response.status < 300) {
      return data.output;
    } else {
      console.log(data.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const shapeRequest = async (request: string, parts: Parts[]) => {
  const instructions =
    requestInstructions.prefix +
    Object.entries(requestInstructions)
      .filter(([key]) => parts.includes(key as Parts))
      .map(([, instruction]) => instruction)
      .join("") +
    requestInstructions.subtopics +
    requestInstructions.note +
    requestInstructions.postfix;

  const schemas = `{ ${responseSchemas.topic}, ${Object.entries(responseSchemas)
    .filter(([key]) => parts.includes(key as Parts))
    .map(([, instruction]) => instruction)
    .join(", ")}, ${responseSchemas.subtopics}, ${responseSchemas.error} }`;

  const response = await makeRequest(request + "\n", instructions, schemas);

  console.log(await response);

  console.log(JSON.parse(await response));
};
