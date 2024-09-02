const promptParams = {
  flashcards: 10,
  flashcardLength: 200,
  pairs: 5,
  pairLength: 100,
  questions: 10,
  options: 4,
  stepsMin: 3,
  stepsMax: 12,
  guideLength: 1200,
};

export const requestInstructions = {
  prefix: `Please create comprehensive learning resources on the topic provided above, including the following components:\n`,

  guide: `- Guide (a concise, step-by-step introduction to the topic, consisting of ${promptParams.stepsMin} to ${promptParams.stepsMax} steps, with the number of steps adjusted based on the topic's complexity)\n`,

  summary: `- Summary (a detailed explanation of the topic, limited to a maximum of ${promptParams.guideLength} symbols)\n`,

  flashcards: `- Flashcards (${promptParams.flashcards} cards featuring key terms and their definitions, with a content length limit of ${promptParams.flashcardLength} symbols for both questions and answers)\n`,

  pairmatch: `- Matching Pairs (${promptParams.pairs} pairs related to the topic, with a content length limit of ${promptParams.pairLength} symbols for each part of the pair. Create pairs where even incorrect matches appear plausible and do not seem absurd or obviously wrong at first glance. These pairs should create doubt and require thoughtful consideration. All items should be related to a single theme or aspect of the given topic, so that even incorrect matches could seem potentially correct, requiring careful evaluation to identify the right answers. Super important: all questions and answers must be unique — no repetitions allowed for any individual question or answer! If it is absolutely impossible to generate ${promptParams.pairs} pairs following the above instructions, reduce its number up to 3 or return an empty pairmatch array.)\n`,

  quiz: `- Quiz (${promptParams.questions} multiple-choice questions, each with ${promptParams.options} answer options)\n`,

  subtopics: `- Subtopics (Suggest potential subtopics for further exploration if the topic is too large or complex; provide an empty array if the main topic does not need to be divided into subtopics)\n`,

  note: `Rephrase the topic to eliminate errors and reduce its length to a maximum of 5 words. Different types of learning materials should not be exact duplicates of each other but may be thematically interconnected and loosely based on each other.\nWrap all multi-line code snippets with triple plus signs (+++); avoid using double quotes (") inside code snippets; if necessary, escape them with a backslash (\\).\nAll formulas must be presented strictly in VALID KaTeX format!\nIf you cannot fulfill a request correctly (e.g., if the input query is too short or unclear), generate an error with an explanatory message (refer to the error response schema).\nIf the requested topic is too broad or extensive, also display an error and provide a list of subtopics you suggest for splitting it.\n`,

  postfix: `SUPER IMPORTANT! Ensure that the output JSON is valid and fix any syntax issues if necessary. Provide the output in JSON format strictly according to the following schema:\n`,
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
