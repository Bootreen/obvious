import { promptParams } from "@/config/prompt";

export const checkPairs = (
  pairmatch: { question: string; answer: string }[],
): boolean => {
  const uniqueQuestions: string[] = [];
  const uniqueAnswers: string[] = [];

  pairmatch.forEach(({ question, answer }) => {
    if (!uniqueQuestions.includes(question)) uniqueQuestions.push(question);
    if (!uniqueAnswers.includes(answer)) uniqueAnswers.push(answer);
  });

  // The check is considered failed if at least one question
  // or answer is duplicated at least once.
  return (
    uniqueQuestions.length === promptParams.pairs &&
    uniqueAnswers.length === promptParams.pairs
  );
};

export const checkQuiz = (
  quiz: {
    question: string;
    options: { option: string; isCorrect: boolean }[];
  }[],
): boolean => {
  const checkQuestion = (
    options: { option: string; isCorrect: boolean }[],
  ): boolean => {
    const uniqueOptions: string[] = [];
    let correctCounter: number = 0;

    options.forEach(({ option, isCorrect }) => {
      if (!uniqueOptions.includes(option)) uniqueOptions.push(option);
      if (isCorrect) ++correctCounter;
    });

    // Each question should contain 4 unique answer option
    // and only one of them shold be correct
    return uniqueOptions.length === 4 && correctCounter === 1;
  };

  // If one of the questions fails the check, all quiz check is failed
  return quiz.reduce((_, { options }) => checkQuestion(options), true);
};
