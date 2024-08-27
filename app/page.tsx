/* eslint-disable no-console */
"use client";

import { Textarea } from "@nextui-org/input";
import { CheckboxGroup, Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
import { ChangeEvent } from "react";

import styles from "@/styles/page.home.module.css";
import { Parts, geminiApiRequest } from "@/utils/request";
import { useAppStates, useAppActions } from "@/store/app-states";
import { title } from "@/components/primitives";

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
      if (guide) {
        setGuide(guide);
        setTabState("guide", true);
      }
      if (summary) {
        setSummary(summary);
        setTabState("summary", true);
      }
      if (flashcards) {
        setFlashcards(flashcards);
        setTabState("flashcards", true);
      }
      if (pairmatch) {
        setPairmatch(pairmatch);
        setTabState("pairmatch", true);
      }
      if (quiz) {
        setQuiz(quiz);
        setTabState("quiz", true);
      }
      if (subtopics) setSubtopics(subtopics);

      if (error) {
        // Flags an error and log error type
        if (error.isError) addError(error.message);
        else clearErrors();
      } // Clear error log both in 'isError = false' and 'no error object' scenarios
      else clearErrors();
      // Try again until success or up to 3 consecutive fails
    } while (isError && errorLog.length < 3);

    console.log(errorLog);
    if (isError) {
      // Write error handling
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
        <h1 className={title()}>Sarge Obvious</h1>
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
    </section>
  );
};

export default Home;
