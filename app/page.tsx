"use client";

import { Textarea } from "@nextui-org/input";
import { CheckboxGroup, Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
import { ChangeEvent } from "react";

import styles from "./page.home.module.css";

import { useAppStates, useAppActions } from "@/store/app-states";
import { title } from "@/components/primitives";

export default function Home() {
  const { checkboxes, request } = useAppStates((state) => state);
  const { setCheckboxState, setRequestContent } = useAppActions();

  // eslint-disable-next-line no-console
  console.log(request);

  const onCheckboxToggle = (
    checkbox: keyof typeof checkboxes,
    event: ChangeEvent<HTMLInputElement>,
  ) => setCheckboxState(checkbox, event.target.checked);
  const onTextareaChange = (event: ChangeEvent<HTMLInputElement>) =>
    setRequestContent(event.target.value);

  return (
    <section className={styles.homePage}>
      <div className={styles.contentContainer}>
        <h1 className={title()}>Sarge Obvious</h1>
        <p className={styles.paragrapg}>
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
          radius="sm"
          size="lg"
        >
          Generate
        </Button>
      </div>
    </section>
  );
}
