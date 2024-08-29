"use client";

import MarkdownRenderer from "@/utils/md-renderer";
import { useAppStates } from "@/store/app-states";
import common from "@/styles/page.default.module.css";

const SummaryPage = () => {
  const { topic, summary } = useAppStates((state) => state);

  return (
    <article className={common.container}>
      <h2>{topic}: Summary</h2>
      <MarkdownRenderer content={summary} />
    </article>
  );
};

export default SummaryPage;
