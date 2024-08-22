"use client";

import { Textarea } from "@nextui-org/input";
import { CheckboxGroup, Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
import { ChangeEvent } from "react";

import {
  useAppParamsStore,
  useAppParamsStoreActions,
} from "@/store/app-params-store";
import { title } from "@/components/primitives";

export default function Home() {
  const checkboxes = useAppParamsStore(({ checkboxes }) => checkboxes);
  const { setCheckboxState } = useAppParamsStoreActions();

  // eslint-disable-next-line no-console
  console.log(checkboxes);

  const onCheckboxToggle = (
    checkbox: keyof typeof checkboxes,
    event: ChangeEvent<HTMLInputElement>,
  ) => setCheckboxState(checkbox, event.target.checked);

  return (
    <section className="flex flex-col items-center justify-center text-center gap-4 py-8 md:py-10">
      <div className="flex flex-col gap-y-8">
        <h1 className={title()}>Sarge Obvious</h1>
        <p className="text-lg">Welcome to the AI-assisted learning helper</p>
        <Textarea
          isRequired
          className="max-w-md"
          label="Enter your request:"
          labelPlacement="inside"
          placeholder="Describe here in natural language what topic you would like to practice today..."
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
        <Button className="w-fit m-auto" color="primary" radius="sm" size="lg">
          Generate
        </Button>
      </div>
    </section>
  );
}
