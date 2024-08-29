const promptParams = {
  flashcards: 8,
  flashcardLength: 200,
  pairs: 5,
  questions: 10,
  options: 4,
  stepsMin: 3,
  stepsMax: 12,
  guideLength: 1200,
};

export const requestInstructions = {
  prefix: `Please create comprehensive learning resources on the above topic, including the following components:\n`,
  guide: `- Guide (a concise step-by-step introduction to the topic, consisting of ${promptParams.stepsMin} to ${promptParams.stepsMax} steps, with the number of steps depending on the topic's complexity)\n`,
  summary: `- Summary (a detailed explanation of the topic, ${promptParams.guideLength} symbols max)\n`,
  flashcards: `- Flashcards (${promptParams.flashcards} cards with key terms and their definitions), content length limit both for question and answer is ${promptParams.flashcardLength} symbols\n`,
  pairmatch: `- Q&A pairs (${promptParams.pairs} pairs of matching questions and answers; pairs must be designed so that all answers grammatically fit all questions to confuse whoever is doing the exercise)\n`,
  quiz: `- Quiz (${promptParams.questions} multiple-choice questions with ${promptParams.options} answer options each)\n`,
  subtopics: `- Subtopics (Suggest potential subtopics for further exploration if the topic is too large and complex; provide an empty array if the main topic doesn't need to be divided into subtopics)\n`,
  note: `Re-word the topic to remove errors and reduce its length to 5 words maximum. Different types of learning materials should not 100%-duplicate each other but can be thematically interconnected and loosely based on each other.\nEmbrace all multi-line code snippets with triple plus (+++); avoid using double quotes (") inside code snippets; if this is inevitable, escape them with a backslash (\\).\nAll formulae must be presented strictly in VALID KaTeX format!\nIf you cannot execute a request correctly (for example, because the input query is too short or unclear), generate an error with an explanatory message (see the error response schema).\nIf the requested topic is too large and extensive, also display an error and provide a list of subtopics you propose to split it into.`,
  postfix: `SUPER IMPORTANT! Ensure that the output JSON is valid, and fix syntax if needed. Provide the output in JSON strictly using the following schema:\n`,
};

export const responseSchemas = {
  topic: "topic: string",
  guide: "guide: string[]",
  summary: "summary: string",
  flashcards: "flashcards: { question: string, answer: string }[]",
  pairmatch: "pairmatch: { question: string, answer: string }[]",
  quiz: "quiz: { question: string, options: { option: string, isCorrect: boolean }[] }[]",
  subtopics: "subtopics: string",
  error: "error: { isError: boolean, message: string }",
};
