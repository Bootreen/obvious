"use client";

import ReactFlipCard from "reactjs-flip-card";

import MarkdownRenderer from "@/utils/md-renderer";
import { useAppStates } from "@/store/app-states";
import common from "@/styles/page.default.module.css";
import styles from "@/styles/page.flashcards.module.css";

const GuidePage = () => {
  const { topic, flashcards } = useAppStates((state) => state);
  // const styles = {
  //   card: { background: "gray", color: "white", borderRadius: 15 },
  // };

  return (
    <article className={common.container}>
      {/* <h2>{topic}: Flashcards</h2>
      {flashcards.map((e, i) => (
        <div key={i}>
          <span>Q{i + 1}:</span>
          <MarkdownRenderer content={e.question} />
          <span>A{i + 1}:</span>
          <MarkdownRenderer content={e.answer} />
        </div>
      ))} */}
      <ReactFlipCard
        backComponent={
          <div>
            {/* <MarkdownRenderer content={flashcards[0].answer} /> */}
            THIS IS BACK
          </div>
        }
        backCss={styles.cardBack}
        containerCss={styles.card}
        direction="vertical"
        flipTrigger="onClick"
        frontComponent={
          <div>
            {/* <MarkdownRenderer content={flashcards[0].question} /> */}
            THIS IS FRONT
          </div>
        }
        frontCss={styles.cardFront}
      />
    </article>
  );
};

export default GuidePage;
