const promptParams = {
  flashcards: 8,
  pairs: 5,
  questions: 10,
  options: 4,
  stepsMin: 3,
  stepsMax: 12,
  guideLength: 2500,
};

export const requestInstructions = {
  prefix: `Please create comprehensive learning resources on the above topic, including the following components:\n`,
  guide: `- Guide (a concise step-by-step introduction to the topic, consisting of ${promptParams.stepsMin} to ${promptParams.stepsMax} steps, with the number of steps depending on the topic's complexity)\n`,
  summary: `- Summary (a detailed explanation of the topic, ${promptParams.guideLength} symbols max)\n`,
  flashcards: `- Flashcards (${promptParams.flashcards} cards with key terms and their definitions)\n`,
  pairmatch: `- Q&A pairs (${promptParams.pairs} pairs of matching questions and answers; pairs must be designed so that all answers grammatically fit all questions to confuse whoever is doing the exercise)\n`,
  quiz: `- Quiz (${promptParams.questions} multiple-choice questions with ${promptParams.options} answer options each)\n`,
  subtopics: `- Subtopics (Suggest potential subtopics for further exploration if the topic is too large and complex; provide an empty array if the main topic doesn't need to be divided into subtopics)\n`,
  note: `Different types of learning materials should not 100%-duplicate each other but can be thematically interconnected and loosely based on each other.\nEmbrace all multi-line code snippets with triple plus (+++); don't use double quotes (") inside code snippets.\nAll formulae must be presented in KaTeX format.\nIf you cannot execute a request correctly (for example, because the input query is too short or unclear), generate an error with an explanatory message (see the error response schema).\nIf the requested topic is too large and extensive, also display an error and a list of subtopics you propose to split it into.`,
  postfix: `SUPER IMPORTANT! Ensure that the output JSON is valid, and fix syntax if needed. Provide the output in JSON strictly using the following schema:\n`,
};

export const responseSchemas = {
  topic: "topic: string",
  guide: "guide: string[]",
  summary: "summary: string",
  flashcards: "flashcards: { question: string, answer: string }[]",
  pairmatch: "pairs: { question: string, answer: string }[]",
  quiz: "quiz: { question: string, options: { option: string, isCorrect: boolean }[] }[]",
  subtopics: "subtopics: string",
  error: "error: { isError: boolean, message: string }",
};
