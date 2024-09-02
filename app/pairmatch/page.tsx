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
  const {
    topic,
    pairMatcher,
    pairMatcher: { matchedPairsCounter, pairs },
  } = useAppStates((state) => state);
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
                      <MarkdownRenderer
                        // Temp show real order
                        content={
                          question.value + " - " + question.index.toString()
                        }
                      />
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
                      <MarkdownRenderer
                        // Temp show real order
                        content={answer.value + " - " + answer.index.toString()}
                      />
                    </CardBody>
                  </Card>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </article>
  );
};

export default PairsPage;
