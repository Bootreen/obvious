/* eslint-disable no-console */
"use client";

import clsx from "clsx";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";

import { useAppStates, useAppActions } from "@/store/app-states";
import MarkdownRenderer from "@/components/md-renderer";
import common from "@/styles/page.default.module.css";
import styles from "@/styles/page.quiz.module.css";

const QuizPage = () => {
  const {
    topic,
    quiz: { isReady, currentQuestionNumber, correctAnswersCounter, questions },
  } = useAppStates((state) => state);
  const {
    incCurrentQuestionNumber,
    incCorrectAnswersCounter,
    setIsAnswered,
    setSelectedIncorrectOptionIndex,
  } = useAppActions();
  const router = useRouter();

  // Redirect to main if no content
  useEffect(() => {
    if (!isReady) router.push("/");
  }, []);

  const onAnswerOptionClick = (index: number) => {
    setIsAnswered(currentQuestionNumber);
    if (questions[currentQuestionNumber].options[index].isCorrect)
      incCorrectAnswersCounter();
    else setSelectedIncorrectOptionIndex(currentQuestionNumber, index);
  };
  const onNextQuestionButtonClick = () => incCurrentQuestionNumber();

  return (
    <article className={clsx(common.container, styles.quizPageContainer)}>
      {isReady && (
        <>
          <h2>{topic}: Quiz</h2>
          <div className={styles.quizContainer}>
            <Progress
              aria-label="Quiz progress..."
              classNames={{
                base: styles.progressBar,
                value: styles.progressLabel,
              }}
              color="primary"
              showValueLabel={true}
              size="md"
              value={((currentQuestionNumber + 1) / questions.length) * 100}
              valueLabel={`${currentQuestionNumber + 1} of ${questions.length}, correct: ${correctAnswersCounter}`}
            />
            <div className={styles.quizQuestionContainer}>
              <MarkdownRenderer
                content={questions[currentQuestionNumber].question}
              />
            </div>
            <div className={styles.quizOptionsContainer}>
              {
                questions[currentQuestionNumber].options.map(
                  ({ option, isCorrect }, index) => (
                    <Card
                      key={index}
                      isPressable
                      className={clsx(
                        styles.option,
                        questions[currentQuestionNumber].isAnswered &&
                          isCorrect &&
                          styles.isCorrect,
                        questions[currentQuestionNumber].isAnswered &&
                          !isCorrect &&
                          index ===
                            questions[currentQuestionNumber]
                              .selectedIncorrectOptionIndex &&
                          styles.isNotCorrect,
                      )}
                      fullWidth={true}
                      isDisabled={questions[currentQuestionNumber].isAnswered}
                      onPress={() => onAnswerOptionClick(index)}
                    >
                      <CardBody>
                        <MarkdownRenderer content={option} />
                      </CardBody>
                    </Card>
                  ),
                ) as unknown as JSX.Element
              }
            </div>
            <Button
              className={styles.nextQuestionButton}
              color="primary"
              isDisabled={
                !questions[currentQuestionNumber].isAnswered ||
                questions.length === currentQuestionNumber + 1
              }
              radius="sm"
              size="lg"
              onPress={onNextQuestionButtonClick}
            >
              Next Question
            </Button>
          </div>
        </>
      )}
    </article>
  );
};

export default QuizPage;
