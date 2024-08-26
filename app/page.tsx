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
  const { checkboxes, request } = useAppStates((state) => state);
  const {
    setTabState,
    setCheckboxState,
    setRequestContent,
    setGuide,
    setSummary,
    setFlashcards,
    setPairmatch,
    setQuiz,
  } = useAppActions();

  // Event handlers
  const onCheckboxToggle = (
    checkbox: keyof typeof checkboxes,
    event: ChangeEvent<HTMLInputElement>,
  ) => setCheckboxState(checkbox, event.target.checked);

  const onTextareaChange = (event: ChangeEvent<HTMLInputElement>) =>
    setRequestContent(event.target.value);

  const onGenerateButtonClick = async () => {
    // Disable content tabs until response is received
    setTabState("guide", false);
    setTabState("summary", false);
    setTabState("flashcards", false);
    setTabState("pairmatch", false);
    setTabState("quiz", false);

    const response = await geminiApiRequest(
      request,
      // Request only selected materials to minimize Gemini token usage
      Object.entries(checkboxes)
        .filter(([, { isChecked }]) => isChecked)
        .map(([key]) => key) as Parts[],
    );

    // Update content state and tabs availability
    if (response.guide) {
      setGuide(response.guide);
      setTabState("guide", true);
    }
    if (response.summary) {
      setSummary(response.summary);
      setTabState("summary", true);
    }
    if (response.flashcards) {
      setFlashcards(response.flashcards);
      setTabState("flashcards", true);
    }
    if (response.pairmatch) {
      setPairmatch(response.pairmatch);
      setTabState("pairmatch", true);
    }
    if (response.quiz) {
      setQuiz(response.quiz);
      setTabState("quiz", true);
    }
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
          isDisabled={isEmptyRequest}
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
