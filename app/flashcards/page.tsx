"use client";

import ReactFlipCard from "reactjs-flip-card";
import { Button } from "@nextui-org/button";

import MarkdownRenderer from "@/utils/md-renderer";
import { useAppStates, useAppActions } from "@/store/app-states";
import common from "@/styles/page.default.module.css";
import styles from "@/styles/page.flashcards.module.css";

const GuidePage = () => {
  const {
    topic,
    flashcards,
    currentFlashcardNumber,
    isFlashcardFlipped,
    isFlipInProgress,
    hint,
  } = useAppStates((state) => state);
  const {
    setCurrentFlashcardNumber,
    setIsFlashcardFlipped,
    setIsFlipInProgress,
    setHint,
  } = useAppActions();

  const currentAnswer = flashcards[currentFlashcardNumber - 1].answer;

  const onFlashCardClick = () => setIsFlashcardFlipped(!isFlashcardFlipped);

  const onHintButtonClick = () => {
    if (hint.length < currentAnswer.length - 6)
      setHint(hint + currentAnswer.slice(hint.length, hint.length + 4));
  };

  const onFlashcardsNavigateButtonClick = (direction: "prev" | "next") => {
    if (
      (direction === "prev" && currentFlashcardNumber !== 1) ||
      (direction === "next" && currentFlashcardNumber !== flashcards.length)
    ) {
      setIsFlashcardFlipped(false);
      setIsFlipInProgress(true);
      setHint("");
      setTimeout(() => {
        setIsFlipInProgress(false);
      }, 1000);
      setCurrentFlashcardNumber(
        currentFlashcardNumber + (direction === "next" ? 1 : -1),
      );
    }
  };

  return (
    <article className={common.container}>
      <h2>{topic}: Flashcards</h2>
      <ReactFlipCard
        backComponent={
          <>
            <div className={styles.cardNumber}>
              {currentFlashcardNumber}/{flashcards.length}
            </div>
            <div className={styles.cardMark}>Answer:</div>
            <MarkdownRenderer
              content={
                !isFlipInProgress
                  ? flashcards[currentFlashcardNumber - 1].answer
                  : ""
              }
            />
          </>
        }
        backCss={styles.cardBack}
        containerCss={styles.container}
        direction="vertical"
        flipByProp={isFlashcardFlipped}
        flipCardCss={styles.card}
        flipTrigger="disabled"
        frontComponent={
          <>
            <div className={styles.cardNumber}>
              {currentFlashcardNumber}/{flashcards.length}
            </div>
            <div className={styles.cardMark}>Question:</div>
            <MarkdownRenderer
              content={flashcards[currentFlashcardNumber - 1].question}
            />
          </>
        }
        frontCss={styles.cardFront}
        onClick={onFlashCardClick}
      />
      <div className={styles.buttonGroup}>
        <Button
          className={styles.navigationButton}
          color="primary"
          isDisabled={currentFlashcardNumber === 1}
          radius="sm"
          size="lg"
          onPress={() => onFlashcardsNavigateButtonClick("prev")}
        >
          ◄
        </Button>
        <Button
          className={styles.hintButton}
          color="primary"
          isDisabled={
            isFlashcardFlipped || !(hint.length < currentAnswer.length - 6)
          }
          radius="sm"
          size="lg"
          onPress={onHintButtonClick}
        >
          Hint
        </Button>
        <Button
          className={styles.navigationButton}
          color="primary"
          isDisabled={currentFlashcardNumber === flashcards.length}
          radius="sm"
          size="lg"
          onPress={() => onFlashcardsNavigateButtonClick("next")}
        >
          ►
        </Button>
      </div>
      <h3 className={styles.hint}>{hint + (hint.length > 0 ? "..." : "")}</h3>
    </article>
  );
};

export default GuidePage;
