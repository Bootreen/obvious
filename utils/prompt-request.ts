/* eslint-disable no-console */
import axios from "axios";

import { requestInstructions, responseSchemas } from "@/config/prompt";

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

export const queryRequests = async () => {
  const instructions =
    requestInstructions.prefix +
    requestInstructions.quiz +
    requestInstructions.postfix;

  console.log("INSTRUCTIONS:", instructions);
  console.log("SCHEMA:", JSON.stringify(responseSchemas.quizSchema));

  const response = await makeRequest(
    "Javascript destructuring.",
    instructions,
    JSON.stringify(responseSchemas.quizSchema),
  );

  console.log(await response);

  console.log(JSON.parse(await response));
};
