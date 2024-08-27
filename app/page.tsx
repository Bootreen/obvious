/* eslint-disable no-console */
"use client";

import { Textarea } from "@nextui-org/input";
import { CheckboxGroup, Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { useDisclosure } from "@nextui-org/react";
import { ChangeEvent } from "react";

import styles from "@/styles/page.home.module.css";
import { Parts, geminiApiRequest } from "@/utils/request";
import { useAppStates, useAppActions } from "@/store/app-states";

const Home = () => {
  // Store variables...
  const { checkboxes, request, isBusy } = useAppStates((state) => state);
  // ...and setters
  const {
    setTabState,
    setCheckboxState,
    setRequest,
    setTopic,
    setGuide,
    setSummary,
    setFlashcards,
    setPairmatch,
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
    setTabState("guide", false);
    setTabState("summary", false);
    setTabState("flashcards", false);
    setTabState("pairmatch", false);
    setTabState("quiz", false);

    // Make at least one request
    do {
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
        setPairmatch(pairmatch);
        setTabState("pairmatch", true);
      }
      if (quiz && quiz.length > 0) {
        setQuiz(quiz);
        setTabState("quiz", true);
      }
      if (subtopics) setSubtopics(subtopics);

      // Flags an error and log error type
      if (error) {
        if (error.isError) addError(error.message);
        else clearErrors();
      } // Clear error log both in 'isError = false' and 'no error object' scenarios
      else clearErrors();
      // Try again until success or up to 3 consecutive fails
    } while (isError && errorLog.length < 3);

    if (isError) {
      // Add proper error handling
      onErrorOpen();
      console.log("Unable to fulfill request. See error log:", errorLog);
    }

    // Enable requests again
    setIsBusy(false);
    clearErrors();
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
        <h1>Sarge Obvious</h1>
        <p className={styles.paragraph}>
          Welcome to the AI-assisted learning helper
        </p>
        <Textarea
          isRequired
          className={styles.textarea}
          label="Enter your request:"
          labelPlacement="inside"
          placeholder="Describe here in natural language what topic you would like to practice today..."
          onChange={(event) => onTextareaChange(event)}
        />
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
              <ModalHeader className="flex flex-col gap-1">
                Unable to fulfill the request
              </ModalHeader>
              <ModalBody>
                <p>
                  Failed to generate tutorials for your question after three
                  attempts. This usually happens when the query is not
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
