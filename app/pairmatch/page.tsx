"use client";

import { Button } from "@nextui-org/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/table";

import { useAppStates, useAppActions } from "@/store/app-states";
import MarkdownRenderer from "@/utils/md-renderer";
import common from "@/styles/page.default.module.css";

const PairsPage = () => {
  const { topic, pairmatch } = useAppStates((state) => state);
  const {} = useAppActions();

  return (
    <article className={common.container}>
      <h2>{topic}: Pair match</h2>
      <Table hideHeader aria-label="Matching pairs">
        <TableHeader>
          <TableColumn>Q</TableColumn>
          <TableColumn>A</TableColumn>
        </TableHeader>
        <TableBody>
          {pairmatch.map((pair, i) => (
            <TableRow key={i}>
              <TableCell>{pair.question}</TableCell>
              <TableCell>{pair.answer}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </article>
  );
};

export default PairsPage;
