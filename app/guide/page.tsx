"use client";

import { title } from "@/components/primitives";
import { useAppStates } from "@/store/app-states";

const GuidePage = () => {
  const { guide } = useAppStates((state) => state);

  return (
    <div>
      <h1 className={title()}>Flashcards tab</h1>
      <div>{guide}</div>
    </div>
  );
};

export default GuidePage;
