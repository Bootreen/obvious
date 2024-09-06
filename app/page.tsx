"use client";

import { ChangeEvent } from "react";
import { Textarea } from "@nextui-org/input";
import { CheckboxGroup, Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
import { useDisclosure } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";

import { Parts, geminiApiRequest } from "@/utils/request";
import { useAppStates, useAppActions } from "@/store/app-states";
import { checkPairs, checkQuiz } from "@/utils/content-check";
import { shuffleIndices } from "@/utils/shuffle";
import { initialState } from "@/config/app-initial-state";
import styles from "@/styles/page.home.module.css";

const Home = () => {
  // State store variables...
  const { checkboxes, request, isBusy } = useAppStates((state) => state);
  // ...and setters
  const {
    setTabState,
    turnOffTabs,
    setCheckboxState,
    setRequest,
    setTopic,
    setGuide,
    setSummary,
    setFlashcards,
    setPairs,
    setQuiz,
    setSubtopics,
    resetContent,
    setIsBusy,
  } = useAppActions();

  const {
    isOpen: isErrorOpen,
    onOpen: onErrorOpen,
    onOpenChange: onErrorOpenChange,
  } = useDisclosure();

  // Event handlers
  const onCheckboxToggle = (
    checkbox: keyof typeof checkboxes,
    event: ChangeEvent<HTMLInputElement>,
  ) => setCheckboxState(checkbox, event.target.checked);

  const onTextareaChange = (event: ChangeEvent<HTMLInputElement>) =>
    setRequest(event.target.value);

  const onGenerateButtonClick = async () => {
    // Errors and retries handling logic
    let isError: boolean = false;
    let errorLog: string[] = [];
    const addError = (error: string): void => {
      isError = true;
      errorLog = [...errorLog, error];
    };
    const clearErrors = (): void => {
      isError = false;
      errorLog = [];
    };

    resetContent();
    // Disable requests while awaiting for the response
    setIsBusy(true);
    // Disable content tabs until response is received
    turnOffTabs();

    const startTime = performance.now();

    // Make at least one request
    do {
      try {
        const {
          topic,
          guide,
          summary,
          flashcards,
          pairmatch,
          quiz,
          subtopics,
          error,
        } = await geminiApiRequest(
          request,
          // Request only selected materials to minimize Gemini token usage
          Object.entries(checkboxes)
            .filter(([, { isChecked }]) => isChecked)
            .map(([key]) => key) as Parts[],
        );

        // Update content state and tabs availability
        if (topic) setTopic(topic);
        if (guide && guide.length > 0) {
          setGuide(guide);
          setTabState("guide", true);
        }
        if (summary && summary !== "") {
          setSummary(summary);
          setTabState("summary", true);
        }
        if (flashcards && flashcards.length > 0) {
          setFlashcards(flashcards);
          setTabState("flashcards", true);
        }
        if (pairmatch && pairmatch.length > 0) {
          if (checkPairs(pairmatch)) {
            // Shuffle pairs parts order
            const leftColumnIndecies = shuffleIndices(pairmatch.length);
            const rightColumnIndecies = shuffleIndices(pairmatch.length);
            // Add shuffled pairs and additional store variables
            const shuffledPairs = pairmatch.map((_, i) => ({
              question: {
                value: pairmatch[leftColumnIndecies[i]].question,
                index: leftColumnIndecies[i],
                isSelected: false,
              },
              answer: {
                value: pairmatch[rightColumnIndecies[i]].answer,
                index: rightColumnIndecies[i],
                isSelected: false,
              },
            }));

            setPairs(shuffledPairs);
            setTabState("pairmatch", true);
          } else throw new Error("Invalid matching pairs");
        }
        if (quiz && quiz.length > 0) {
          if (checkQuiz(quiz)) {
            // Shuffle answer options order, 'cause AI tends to place correct option as #1
            const shuffledOptions = shuffleIndices(4);

            setQuiz(
              quiz.map((question) => ({
                ...question,
                options: shuffledOptions.map((i) => question.options[i]),
                isAnswered: false,
                isAnswerCorrect: false,
              })) as unknown as typeof initialState.quiz.questions,
            );
            setTabState("quiz", true);
          } else throw new Error("Invalid quiz");
        }
        if (subtopics) setSubtopics(subtopics);

        // Flags an error and log error type
        if (error) {
          if (error.isError) addError(error.message);
          else clearErrors();
        } // Clear error log both in 'isError = false' and 'no error object' scenarios
        else clearErrors();
        // Catch internal errors (pairmatch & quiz check fails)
      } catch (error) {
        const internalError = {
          isError: true,
          message: (error as Error).message,
        };

        addError(internalError.message);
      }
      // Try again until success or up to 3 consecutive fails
    } while (isError && errorLog.length < 3);

    if (isError) {
      onErrorOpen();
      // eslint-disable-next-line no-console
      console.log("Unable to fulfill request. See error log:", errorLog);
    }

    // Enable requests again
    setIsBusy(false);
    clearErrors();

    const endTime = performance.now();

    // eslint-disable-next-line no-console
    console.log(
      `Request time — ${Math.ceil((endTime - startTime) / 1000)} seconds`,
    );
  };

  // If none of the training material options are selected or if the request is empty.
  const isEmptyRequest =
    Object.values(checkboxes).find(({ isChecked }) => isChecked) ===
      undefined || request.trim() === ""
      ? true
      : false;

  return (
    <section className={styles.homePage}>
      <div className={styles.contentContainer}>
        <div>
          <h1 className={styles.title}>Sarge Obvious</h1>
          <p className={styles.paragraph}>
            Ready to get in line and learn something?
            <br />
            <strong>Sarge Obvious</strong> is your new AI drill sergeant, here
            to put you through your paces! Just give Sarge a command, and he’ll
            generate custom study materials that’ll make you smarter in no time.
          </p>
          <Textarea
            isRequired
            className={styles.textarea}
            label="Enter your request:"
            labelPlacement="inside"
            placeholder="Describe here in natural language what topic you would like to practice today..."
            onChange={(event) => onTextareaChange(event)}
          />
        </div>

        <CheckboxGroup
          defaultValue={Object.entries(checkboxes)
            .filter(([, { isChecked }]) => isChecked)
            .map(([key]) => key)}
          label="What kind of materials do you need?"
        >
          {Object.entries(checkboxes).map(([key, { label }]) => (
            <Checkbox
              key={key}
              value={key}
              onChange={(event) =>
                onCheckboxToggle(key as keyof typeof checkboxes, event)
              }
            >
              {label}
            </Checkbox>
          ))}
        </CheckboxGroup>
        <Button
          className={styles.submitButton}
          color="primary"
          isDisabled={isEmptyRequest || isBusy}
          radius="sm"
          size="lg"
          onPress={() => onGenerateButtonClick()}
        >
          Generate
        </Button>
      </div>

      {/* Error modal window */}
      <Modal
        isDismissable={false}
        isOpen={isErrorOpen}
        size="xl"
        onOpenChange={onErrorOpenChange}
      >
        <ModalContent>
          {(onErrorClose) => (
            <>
              <ModalHeader className={styles.modalHeader}>
                Unable to fulfill the request
              </ModalHeader>
              <ModalBody>
                <p>
                  Failed to generate learning materials for your request after
                  three attempts. This usually happens when the query is not
                  formulated well, or you are trying to request materials that
                  violate the ethical principles of using AI. Try rephrasing
                  your question or change the subject.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onErrorClose}>
                  Dismiss
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
};

export default Home;
