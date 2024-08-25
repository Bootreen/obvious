export type Guide = string[];
export type Summary = string;
export type Flashcards = { question: string; answer: string }[];
export type Pairs = { question: string; answer: string }[];
export type Quiz = {
  question: string;
  options: { text: string; isCorrect: boolean }[];
}[];
export type Subtopics = string[];
