const promptParams = {
  flashcards: 8,
  pairs: 5,
  questions: 10,
  options: 4,
};

export const requestInstructions = {
  prefix:
    "Please create a comprehensive learning resource on above topic, including the following components:\n",
  guide: "- Guide (a concise overview of the topic)",
  summary: "- Summary (a detailed explanation of the topic)",
  flashcards: `- Flashcards (${promptParams.flashcards} cards with key terms and their definitions)`,
  pairs: `- Q&A pairs (${promptParams.pairs} pairs of matching questions and answers)`,
  quiz: `- Quiz (${promptParams.questions} multiple-choice questions with ${promptParams.options} answer options each)`,
  subtopics: `- Subtopics (Suggest potential subtopics for further exploration if the topic is too big and complex; provide an empty array, if main topic don't need to be divided to subtopics).`,
  note: " should not duplicate each other but can be thematically interconnected and loosely based on each other.",
  postfix: `
    If needed, include code snippets (enclosed in triple backticks, like this: \`\`\`).
    If needed, include formulas in LaTeX format (enclosed in double dollar signs, like this: $$).
    Please ensure that the content is clear, informative, and well-organized.
    Provide output in JSON using the following schema:\n
  `,
};

export const responseSchemas = {
  topicSchema: {
    type: "string",
  },
  guideSchema: {
    type: "array",
    items: {
      type: "string",
    },
  },
  summarySchema: {
    type: "string",
  },
  flashcardsSchema: {
    type: "array",
    items: {
      type: "object",
      properties: {
        question: {
          type: "string",
        },
        answer: {
          type: "string",
        },
      },
    },
  },
  pairsSchema: {
    type: "array",
    items: {
      type: "object",
      properties: {
        question: {
          type: "string",
        },
        answer: {
          type: "string",
        },
      },
    },
  },
  quizSchema: {
    type: "array",
    items: {
      type: "object",
      properties: {
        question: {
          type: "string",
        },
        options: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: {
                type: "string",
              },
              isCorrect: {
                type: "boolean",
              },
            },
          },
        },
      },
    },
  },
  subtopicsSchema: {
    type: "array",
    items: {
      type: "string",
    },
  },
};
