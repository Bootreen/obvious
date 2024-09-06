/* eslint-disable no-console */
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { State, initialState } from "@/config/app-initial-state";

export const useAppStates = create<State>()(
  immer((set, get) => ({
    ...initialState,
    actions: {
      setIsBusy: (value) =>
        set((state) => {
          state.isBusy = value;
        }),
      setProgress: (value) =>
        set((state) => {
          state.progress = value;
        }),
      setTabState: (tab, isLoaded) =>
        set((state) => {
          state.tabs[tab].isLoaded = isLoaded;
        }),
      turnOffTabs: () => {
        get().actions.setTabState("guide", false);
        get().actions.setTabState("summary", false);
        get().actions.setTabState("flashcards", false);
        get().actions.setTabState("pairmatch", false);
        get().actions.setTabState("quiz", false);
      },
      setCheckboxState: (checkbox, isChecked) =>
        set((state) => {
          state.checkboxes[checkbox].isChecked = isChecked;
        }),
      setRequest: (content) =>
        set((state) => {
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
        set(({ deck }) => {
          deck.isReady = true;
          deck.flashcards = flashcards;
          deck.currentFlashcardNumber = 1;
          deck.isFlashcardFlipped = false;
          deck.isFlipInProgress = false;
          deck.hint = "";
          deck.hintsCounter = 0;
        }),
      setCurrentFlashcardNumber: (cardNumber) =>
        set(({ deck }) => {
          deck.currentFlashcardNumber = cardNumber;
        }),
      setIsFlashcardFlipped: (value) =>
        set(({ deck }) => {
          deck.isFlashcardFlipped = value;
        }),
      setIsFlipInProgress: (value) =>
        set(({ deck }) => {
          deck.isFlipInProgress = value;
        }),
      setHint: (value) =>
        set(({ deck }) => {
          deck.hint = value;
        }),
      incHintsCounter: () =>
        set(({ deck }) => {
          ++deck.hintsCounter;
        }),
      incMatchedPairsCounter: () =>
        set(({ pairMatcher }) => {
          ++pairMatcher.matchedPairsCounter;
        }),
      incMistakesCounter: () =>
        set(({ pairMatcher }) => {
          ++pairMatcher.mistakesCounter;
        }),
      setPairs: (value) =>
        set(({ pairMatcher }) => {
          pairMatcher.pairs = value;
        }),
      setPairMatcher: (value) => {
        set(({ pairMatcher }) => {
          pairMatcher.isReady = true;
          pairMatcher.isSolved = false;
          pairMatcher.matchedPairsCounter = 0;
          pairMatcher.mistakesCounter = 0;
        });
        get().actions.setPairs(value);
      },

      setPairPartSelected: (type, index) => {
        // Get state, destruct pairMatcher, its pairs and setter
        const {
          pairMatcher: { pairs },
          actions: { setPairs, matchPair },
        } = get();

        // Update only question selections
        if (type === "question" && !pairs[index].question.isSelected) {
          const newPairs = pairs.map(({ question, answer }, i) => ({
            question: { ...question, isSelected: i === index },
            answer,
          }));

          setPairs(newPairs);
        }
        // Update only answer selections
        else if (type === "answer" && !pairs[index].answer.isSelected) {
          const newPairs = pairs.map(({ question, answer }, i) => ({
            question,
            answer: { ...answer, isSelected: i === index },
          }));

          setPairs(newPairs);
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
          pairMatcher: { matchedPairsCounter, pairs },
          actions: { setPairs, incMatchedPairsCounter, incMistakesCounter },
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
          incMatchedPairsCounter();
          const newPairs = pairs.map(({ question, answer }, index) => {
            // The first free row to swap with matched pair
            if (index === matchedPairsCounter)
              return {
                question: { ...questionInSelectionCell, isSelected: false },
                answer: { ...answerInSelectionCell, isSelected: false },
              };
            // Matched question and answer are in the same row?
            // Then swap them together
            else if (index === questionIndex && index === answerIndex)
              return {
                question: { ...questionInFreeCell, isSelected: false },
                answer: { ...answerInFreeCell, isSelected: false },
              };
            // Swap the question, leave the answer
            else if (index === questionIndex)
              return {
                question: { ...questionInFreeCell, isSelected: false },
                answer,
              };
            // And vice versa
            else if (index === answerIndex)
              return {
                question,
                answer: { ...answerInFreeCell, isSelected: false },
              };
            // Don't swap, leave the original row
            else
              return {
                question: { ...question, isSelected: false },
                answer: { ...answer, isSelected: false },
              };
          });

          // isSolved: matchedPairsCounter + 1 === pairs.length,

          setPairs(newPairs);
        } else {
          // Incorrect pair, reset selections
          incMistakesCounter();
          const newPairs = pairs.map(({ question, answer }) => ({
            question: { ...question, isSelected: false },
            answer: { ...answer, isSelected: false },
          }));

          setPairs(newPairs);
        }
      },

      setQuiz: (value) =>
        set(({ quiz }) => {
          quiz.isReady = true;
          quiz.isSolved = false;
          quiz.currentQuestionNumber = 0;
          quiz.correctAnswersCounter = 0;
          quiz.questions = value;
        }),
      incCurrentQuestionNumber: () =>
        set(({ quiz }) => {
          ++quiz.currentQuestionNumber;
        }),
      incCorrectAnswersCounter: () =>
        set(({ quiz }) => {
          ++quiz.correctAnswersCounter;
        }),
      setIsAnswered: (index) =>
        set(({ quiz }) => {
          quiz.questions[index].isAnswered = true;
        }),
      setSelectedIncorrectOptionIndex: (questionIndex, optionIndex) =>
        set(({ quiz }) => {
          quiz.questions[questionIndex].selectedIncorrectOptionIndex =
            optionIndex;
        }),

      setSubtopics: (subtopics) =>
        set((state) => {
          state.subtopics = subtopics;
        }),

      resetContent: () => {
        get().actions.setProgress(0);
        get().actions.setTopic("");
        get().actions.setGuide([]);
        get().actions.setSummary("");
        get().actions.setFlashcards([]);
        get().actions.setPairMatcher([]);
        get().actions.setQuiz([]);
        get().actions.setSubtopics([]);
      },

      setUserId: (userId) =>
        set((state) => {
          state.userId = userId;
        }),
    },
  })),
);

export const useAppActions = () => useAppStates(({ actions }) => actions);
