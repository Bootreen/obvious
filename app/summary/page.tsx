"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import MarkdownRenderer from "@/utils/md-renderer";
import { useAppStates } from "@/store/app-states";
import common from "@/styles/page.default.module.css";

const SummaryPage = () => {
  const { topic, summary } = useAppStates((state) => state);
  const router = useRouter();

  // Redirect to main if no content
  useEffect(() => {
    if (!summary || summary === "") router.push("/");
  }, []);

  return (
    <article className={common.container}>
      {summary && summary !== "" && (
        <>
          <h2>{topic}: Summary</h2>
          <MarkdownRenderer content={summary} />
        </>
      )}
    </article>
  );
};

export default SummaryPage;
