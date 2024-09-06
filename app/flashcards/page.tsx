"use client";

import ReactFlipCard from "reactjs-flip-card";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";

import { useAppStates, useAppActions } from "@/store/app-states";
import MarkdownRenderer from "@/components/md-renderer";
import common from "@/styles/page.default.module.css";
import styles from "@/styles/page.flashcards.module.css";

const GuidePage = () => {
  const {
    topic,
    deck: {
      isReady,
      flashcards,
      currentFlashcardNumber,
      isFlashcardFlipped,
      isFlipInProgress,
      hint,
      hintsCounter,
    },
  } = useAppStates((state) => state);
  const {
    setCurrentFlashcardNumber,
    setIsFlashcardFlipped,
    setIsFlipInProgress,
    setHint,
    incHintsCounter,
  } = useAppActions();

  const router = useRouter();

  // Redirect to main if no content
  useEffect(() => {
    if (!isReady) router.push("/");
  }, []);

  // Prevent access to the flashcard properties if flashcards is not loaded yet
  const currentQuestion =
    flashcards.length > 0
      ? flashcards[currentFlashcardNumber - 1].question
      : "";
  const currentAnswer =
    flashcards.length > 0 ? flashcards[currentFlashcardNumber - 1].answer : "";

  // GUI event handlers
  const onFlashCardClick = () => setIsFlashcardFlipped(!isFlashcardFlipped);

  const onHintButtonClick = () => {
    if (hint.length < currentAnswer.length - 6) {
      incHintsCounter();
      setHint(
        hint +
          currentAnswer
            .replaceAll("`", "") // Hide code formatting in the hint
            .replaceAll("+++", "")
            .slice(hint.length, hint.length + 4),
      );
    }
  };

  const onFlashcardsNavigateButtonClick = (direction: "prev" | "next") => {
    if (
      // Disable buttons for the boundary values
      (direction === "prev" && currentFlashcardNumber !== 1) ||
      (direction === "next" &&
        currentFlashcardNumber !== flashcards.length &&
        flashcards.length !== 0)
    ) {
      setHint("");
      setIsFlashcardFlipped(false);
      // Hide answer while flipping the card back to not to spoil answer for the next question
      setIsFlipInProgress(true);
      setTimeout(() => {
        setIsFlipInProgress(false);
      }, 1000); // This timeout should be equal to flip transition duration
      //           (see .card {} in page.flashcards.module.css)
      setCurrentFlashcardNumber(
        currentFlashcardNumber + (direction === "next" ? 1 : -1),
      );
    }
  };

  return (
    <article className={common.container}>
      {isReady && (
        <>
          <h2>{topic}: Flashcards</h2>
          <ReactFlipCard
            backComponent={
              <>
                <div className={styles.cardNumber}>
                  {currentFlashcardNumber}/{flashcards.length}
                </div>
                <div className={styles.cardMark}>Answer:</div>
                <MarkdownRenderer
                  content={isFlipInProgress ? "" : currentAnswer}
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
                <MarkdownRenderer content={currentQuestion} />
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
              isDisabled={
                currentFlashcardNumber === flashcards.length ||
                flashcards.length === 0
              }
              radius="sm"
              size="lg"
              onPress={() => onFlashcardsNavigateButtonClick("next")}
            >
              ►
            </Button>
          </div>
          <h3 className={styles.hint}>
            {hint + (hint.length > 0 ? "..." : "")}
          </h3>
          {hintsCounter > 0 && (
            <h3 className={styles.hint}>Hints used: {hintsCounter}</h3>
          )}
        </>
      )}
    </article>
  );
};

export default GuidePage;
