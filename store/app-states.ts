/* eslint-disable no-console */
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { State, initialState } from "@/config/app-initial-state";

export const useAppStates = create<State>()(
  immer((set, get) => ({
    ...initialState,
    actions: {
      setTabState: (tab, isLoaded) =>
        set((state: State) => {
          state.tabs[tab].isLoaded = isLoaded;
        }),
      setCheckboxState: (checkbox, isChecked) =>
        set((state: State) => {
          state.checkboxes[checkbox].isChecked = isChecked;
        }),
      setRequest: (content) =>
        set((state: State) => {
          state.request = content;
        }),
      setTopic: (topic) =>
        set((state) => {
          state.topic = topic;
        }),
      setGuide: (guide) =>
        set((state) => {
          state.guide = guide;
        }),
      setSummary: (summary) =>
        set((state) => {
          state.summary = summary;
        }),
      setFlashcards: (flashcards) =>
        set((state) => {
          state.flashcards = flashcards;
        }),
      setPairMatcher: (value) =>
        set((state) => {
          state.pairMatcher = value;
        }),
      setQuiz: (quiz) =>
        set((state) => {
          state.quiz = quiz;
        }),
      setSubtopics: (subtopics) =>
        set((state) => {
          state.subtopics = subtopics;
        }),
      setIsBusy: (value) =>
        set((state) => {
          state.isBusy = value;
        }),
      setCurrentFlashcardNumber: (cardNumber) =>
        set((state) => {
          state.currentFlashcardNumber = cardNumber;
        }),
      setIsFlashcardFlipped: (value) =>
        set((state) => {
          state.isFlashcardFlipped = value;
        }),
      setIsFlipInProgress: (value) =>
        set((state) => {
          state.isFlipInProgress = value;
        }),
      setHint: (value) => {
        set((state) => {
          state.hint = value;
        });
      },

      setPairPartSelected: (type, index) => {
        // Get state, destruct pairMatcher, its pairs and setter
        const {
          pairMatcher,
          pairMatcher: { pairs },
          actions: { setPairMatcher, matchPair },
        } = get();

        // Update only question selections
        if (type === "question" && !pairs[index].question.isSelected) {
          const newMatcher = {
            ...pairMatcher,
            pairs: pairs.map(({ question, answer }, i) => ({
              question: { ...question, isSelected: i === index },
              answer,
            })),
          };

          setPairMatcher(newMatcher);
        }
        // Update only answer selections
        else if (type === "answer" && !pairs[index].answer.isSelected) {
          const newMatcher = {
            ...pairMatcher,
            pairs: pairs.map(({ question, answer }, i) => ({
              question,
              answer: { ...answer, isSelected: i === index },
            })),
          };

          setPairMatcher(newMatcher);
        }
        // Use get() again to retrive the updated pairs
        const {
          pairMatcher: { pairs: updatedPairs },
        } = get();
        const selectedQuestionIndex = updatedPairs.findIndex(
          ({ question: { isSelected } }) => isSelected,
        );
        const selectedAnswerIndex = updatedPairs.findIndex(
          ({ answer: { isSelected } }) => isSelected,
        );

        if (selectedQuestionIndex !== -1 && selectedAnswerIndex !== -1)
          // Check the pair
          matchPair(selectedQuestionIndex, selectedAnswerIndex);
      },

      matchPair: (questionIndex, answerIndex) => {
        const {
          pairMatcher,
          pairMatcher: { matchedPairsCounter, pairs, mistakes },
          actions: { setPairMatcher },
        } = get();
        const selectedQuestion = pairs[questionIndex].question;
        const selectedAnswer = pairs[answerIndex].answer;

        // Check if the pair is correct
        if (selectedQuestion.index === selectedAnswer.index) {
          // Swap selected QA-pairs with the QA at the first free line
          const questionInFreeCell = pairs[matchedPairsCounter].question;
          const questionInSelectionCell = pairs[questionIndex].question;
          const answerInFreeCell = pairs[matchedPairsCounter].answer;
          const answerInSelectionCell = pairs[answerIndex].answer;

          // Update and reset selections
          const newMatcher: typeof initialState.pairMatcher = {
            ...pairMatcher,
            matchedPairsCounter: matchedPairsCounter + 1,
            pairs: pairs.map(({ question, answer }, index) => {
              if (index === matchedPairsCounter)
                return {
                  question: { ...questionInSelectionCell, isSelected: false },
                  answer: { ...answerInSelectionCell, isSelected: false },
                };
              else if (index === questionIndex && index === answerIndex)
                return {
                  question: { ...questionInFreeCell, isSelected: false },
                  answer: { ...answerInFreeCell, isSelected: false },
                };
              else if (index === questionIndex)
                return {
                  question: { ...questionInFreeCell, isSelected: false },
                  answer,
                };
              else if (index === answerIndex)
                return {
                  question,
                  answer: { ...answerInFreeCell, isSelected: false },
                };
              else
                return {
                  question: { ...question, isSelected: false },
                  answer: { ...answer, isSelected: false },
                };
            }),
            isSolved: matchedPairsCounter + 1 === pairs.length,
          };

          setPairMatcher(newMatcher);
        } else {
          // Incorrect pair, reset selections
          const newMatcher: typeof initialState.pairMatcher = {
            ...pairMatcher,
            mistakes: mistakes + 1,
            pairs: pairs.map(({ question, answer }) => ({
              question: { ...question, isSelected: false },
              answer: { ...answer, isSelected: false },
            })),
          };

          setPairMatcher(newMatcher);
        }
      },
      resetContent: () => {
        get().actions.setTopic("");
        get().actions.setGuide([]);
        get().actions.setSummary("");
        get().actions.setFlashcards([]);
        get().actions.setPairMatcher({
          isReady: false,
          isSolved: false,
          matchedPairsCounter: 0,
          mistakes: 0,
          pairs: [],
        });
        get().actions.setQuiz([]);
        get().actions.setSubtopics([]);
        get().actions.setCurrentFlashcardNumber(1);
        get().actions.setIsFlashcardFlipped(false);
        get().actions.setIsFlipInProgress(false);
        get().actions.setHint("");
      },
    },
  })),
);

export const useAppActions = () => useAppStates(({ actions }) => actions);
