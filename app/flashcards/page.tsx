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
  } = useAppStates((state) => state);
  const {
    setCurrentFlashcardNumber,
    setIsFlashcardFlipped,
    setIsFlipInProgress,
  } = useAppActions();

  const onFlashCardClick = () => setIsFlashcardFlipped(!isFlashcardFlipped);
  const onPreviousButtonClick = () => {
    setIsFlashcardFlipped(false);
    setIsFlipInProgress(true);
    setTimeout(() => {
      setIsFlipInProgress(false);
    }, 1000);
    if (currentFlashcardNumber !== 1)
      setCurrentFlashcardNumber(currentFlashcardNumber - 1);
  };
  const onNextButtonClick = () => {
    setIsFlashcardFlipped(false);
    setIsFlipInProgress(true);
    setTimeout(() => {
      setIsFlipInProgress(false);
    }, 1000);
    if (currentFlashcardNumber !== flashcards.length)
      setCurrentFlashcardNumber(currentFlashcardNumber + 1);
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
          onPress={onPreviousButtonClick}
        >
          ◄
        </Button>
        <Button
          className={styles.hintButton}
          color="primary"
          radius="sm"
          size="lg"
          onPress={() => {}}
        >
          Hint
        </Button>
        <Button
          className={styles.navigationButton}
          color="primary"
          isDisabled={currentFlashcardNumber === flashcards.length}
          radius="sm"
          size="lg"
          onPress={onNextButtonClick}
        >
          ►
        </Button>
      </div>
    </article>
  );
};

export default GuidePage;
