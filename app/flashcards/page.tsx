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
          <span>Q{i + 1}:</span>
          <MarkdownRenderer content={e.question} />
          <span>A{i + 1}:</span>
          <MarkdownRenderer content={e.answer} />
        </div>
      ))}
    </article>
  );
};

export default GuidePage;
