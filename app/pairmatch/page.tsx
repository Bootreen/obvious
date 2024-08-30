"use client";

import clsx from "clsx";
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
import MarkdownRenderer from "@/utils/md-renderer";
import common from "@/styles/page.default.module.css";
import styles from "@/styles/page.pairmatch.module.css";

const PairsPage = () => {
  const { topic, pairMatcher } = useAppStates((state) => state);
  const { setPairPartSelected } = useAppActions();

  const onPairPartClick = (type: "question" | "answer", index: number) =>
    setPairPartSelected(type, index);

  return (
    <article className={common.container}>
      <h2>{topic}: Pair match</h2>
      {pairMatcher.isReady && (
        <Table hideHeader removeWrapper aria-label="Matching pairs">
          <TableHeader>
            <TableColumn> </TableColumn>
            <TableColumn> </TableColumn>
          </TableHeader>
          <TableBody>
            {pairMatcher.pairs.map(
              (
                {
                  question,
                  answer,
                  i,
                  j,
                  isQuestionSelected,
                  isAnswerSelected,
                },
                index,
              ) => (
                <TableRow key={index} className={styles.tableRow}>
                  <TableCell className={styles.tableCell}>
                    <Card
                      isPressable
                      className={styles.pairLabelContainer}
                      fullWidth={true}
                      onPress={() => onPairPartClick("question", index)}
                    >
                      <CardBody
                        className={clsx(
                          styles.pairPart,
                          isQuestionSelected && styles.pairPartSelected,
                        )}
                      >
                        <MarkdownRenderer
                          // Temp show real order
                          content={question + " - " + i.toString()}
                        />
                      </CardBody>
                    </Card>
                  </TableCell>
                  <TableCell className={styles.tableCell}>
                    <Card
                      isPressable
                      className={styles.pairLabelContainer}
                      fullWidth={true}
                      onPress={() => onPairPartClick("answer", index)}
                    >
                      <CardBody
                        className={clsx(
                          styles.pairPart,
                          isAnswerSelected && styles.pairPartSelected,
                        )}
                      >
                        <MarkdownRenderer
                          // Temp show real order
                          content={answer + " - " + j.toString()}
                        />
                      </CardBody>
                    </Card>
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      )}
    </article>
  );
};

export default PairsPage;
