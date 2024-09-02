/* eslint-disable no-console */
"use client";

import clsx from "clsx";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";

import { useAppStates, useAppActions } from "@/store/app-states";
// import MarkdownRenderer from "@/utils/md-renderer";
import common from "@/styles/page.default.module.css";
import styles from "@/styles/page.quiz.module.css";

const QuizPage = () => {
  const {
    topic,
    quiz: { currentQuestionNumber, correctAnswersCounter, questions },
  } = useAppStates((state) => state);
  const {
    incCurrentQuestionNumber,
    incCorrectAnswersCounter,
    setIsAnswered,
    setSelectedIncorrectOptionIndex,
  } = useAppActions();

  const onAnswerOptionClick = (index: number) => {
    setIsAnswered(currentQuestionNumber);
    if (questions[currentQuestionNumber].options[index].isCorrect)
      incCorrectAnswersCounter();
    else setSelectedIncorrectOptionIndex(currentQuestionNumber, index);
  };
  const onNextQuestionButtonClick = () => incCurrentQuestionNumber();

  const isAnswered = questions[currentQuestionNumber].isAnswered;
  const selectedIncorrectOptionIndex =
    questions[currentQuestionNumber].selectedIncorrectOptionIndex;

  return (
    <article className={common.container}>
      <h2>{topic}: Quiz</h2>
      <Table hideHeader removeWrapper aria-label="Quiz">
        <TableHeader>
          <TableColumn> </TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow className={styles.tableRow}>
            <TableCell className="text-2xl">
              {currentQuestionNumber + 1} of {questions.length}, correct:{" "}
              {correctAnswersCounter}
            </TableCell>
          </TableRow>
          <TableRow className={styles.tableRow}>
            <TableCell className="text-2xl">
              {questions[currentQuestionNumber].question}
            </TableCell>
          </TableRow>
          {
            questions[currentQuestionNumber].options.map(
              ({ option, isCorrect }, index) => (
                <TableRow key={index} className={styles.tableRow}>
                  <TableCell className="text-2xl">
                    <Card
                      isPressable
                      className={clsx(
                        isAnswered && isCorrect && styles.isCorrect,
                        isAnswered &&
                          !isCorrect &&
                          index === selectedIncorrectOptionIndex &&
                          styles.isNotCorrect,
                      )}
                      fullWidth={true}
                      isDisabled={isAnswered}
                      onPress={() => onAnswerOptionClick(index)}
                    >
                      <CardBody>{option}</CardBody>
                    </Card>
                  </TableCell>
                </TableRow>
              ),
            ) as unknown as JSX.Element
          }
        </TableBody>
      </Table>
      <Button
        isDisabled={
          !isAnswered || questions.length === currentQuestionNumber + 1
        }
        onPress={onNextQuestionButtonClick}
      >
        Next Question
      </Button>
    </article>
  );
};

export default QuizPage;
