import { Textarea } from "@nextui-org/input";
import { CheckboxGroup, Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";

import { title } from "@/components/primitives";

export default function Home() {
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
          defaultValue={["guide", "summary", "flashcards", "pairmatch", "quiz"]}
          label="What kind of materials do you need?"
        >
          <Checkbox value="guide">Step by step guide</Checkbox>
          <Checkbox value="summary">Summary</Checkbox>
          <Checkbox value="flashcards">Flashcards</Checkbox>
          <Checkbox value="pairmatch">Pair match</Checkbox>
          <Checkbox value="quiz">Quiz</Checkbox>
        </CheckboxGroup>
        <Button className="w-fit m-auto" color="primary" radius="sm" size="lg">
          Generate
        </Button>
      </div>
    </section>
  );
}
