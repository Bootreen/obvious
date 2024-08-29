"use client";

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
import common from "@/styles/page.default.module.css";
import styles from "@/styles/page.pairmatch.module.css";

const PairsPage = () => {
  const { topic, pairmatch } = useAppStates((state) => state);
  const {} = useAppActions();

  return (
    <article className={common.container}>
      <h2>{topic}: Pair match</h2>
      <Table hideHeader removeWrapper aria-label="Matching pairs">
        <TableHeader>
          <TableColumn> </TableColumn>
          <TableColumn> </TableColumn>
        </TableHeader>
        <TableBody>
          {pairmatch.map(({ question, answer }, i) => (
            <TableRow key={i} className={styles.tableRow}>
              <TableCell className={styles.tableCell}>
                <Card
                  isPressable
                  className={styles.pairLabelContainer}
                  fullWidth={true}
                  onPress={() => {}}
                >
                  <CardBody className={styles.pairPartLeft}>
                    {question}
                  </CardBody>
                </Card>
              </TableCell>
              <TableCell className={styles.tableCell}>
                <Card
                  isPressable
                  className={styles.pairLabelContainer}
                  fullWidth={true}
                  onPress={() => {}}
                >
                  <CardBody className={styles.pairPartRight}>{answer}</CardBody>
                </Card>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </article>
  );
};

export default PairsPage;
