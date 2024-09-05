"use client";

import clsx from "clsx";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const {
    topic,
    pairMatcher: { isReady, matchedPairsCounter, pairs, mistakesCounter },
  } = useAppStates((state) => state);
  const { setPairPartSelected } = useAppActions();

  const onPairPartClick = (type: "question" | "answer", index: number) =>
    setPairPartSelected(type, index);

  const router = useRouter();

  // Redirect to main if no content
  useEffect(() => {
    if (!isReady) router.push("/");
  }, []);

  return (
    <article className={common.container}>
      {isReady && (
        <>
          <h2>{topic}: Pair match</h2>
          <Table hideHeader removeWrapper aria-label="Matching pairs">
            <TableHeader>
              <TableColumn> </TableColumn>
              <TableColumn> </TableColumn>
            </TableHeader>
            <TableBody>
              {pairs.map(({ question, answer }, i) => (
                <TableRow key={i} className={styles.tableRow}>
                  <TableCell className={styles.tableCell}>
                    <Card
                      isPressable
                      className={clsx(
                        styles.pairLabelContainer,
                        matchedPairsCounter > i && styles.pairLabelMatched,
                      )}
                      fullWidth={true}
                      onPress={() => onPairPartClick("question", i)}
                    >
                      <CardBody
                        className={clsx(
                          styles.pairPart,
                          question.isSelected && styles.pairPartSelected,
                          matchedPairsCounter > i && styles.pairPartMatched,
                        )}
                      >
                        <MarkdownRenderer content={question.value} />
                      </CardBody>
                    </Card>
                  </TableCell>
                  <TableCell className={styles.tableCell}>
                    <Card
                      isPressable
                      className={clsx(
                        styles.pairLabelContainer,
                        matchedPairsCounter > i && styles.pairLabelMatched,
                      )}
                      fullWidth={true}
                      onPress={() => onPairPartClick("answer", i)}
                    >
                      <CardBody
                        className={clsx(
                          styles.pairPart,
                          answer.isSelected && styles.pairPartSelected,
                          matchedPairsCounter > i && styles.pairPartMatched,
                        )}
                      >
                        <MarkdownRenderer content={answer.value} />
                      </CardBody>
                    </Card>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {mistakesCounter > 0 && (
            <h3 className={styles.mistakes}>Mistakes: {mistakesCounter}</h3>
          )}
        </>
      )}
    </article>
  );
};

export default PairsPage;
