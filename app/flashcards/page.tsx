"use client";

import MarkdownRenderer from "@/utils/md-renderer";
import { useAppStates } from "@/store/app-states";
import common from "@/styles/page.default.module.css";

const GuidePage = () => {
  const { topic, flashcards } = useAppStates((state) => state);

  return (
    <article className={common.container}>
      <h2>{topic}: Flashcards</h2>
      {flashcards.map((e, i) => (
        <div key={i}>
          Q{i + 1}:
          <MarkdownRenderer content={e.question} />A{i + 1}:
          <MarkdownRenderer content={e.answer} />
        </div>
      ))}
    </article>
  );
};

export default GuidePage;
