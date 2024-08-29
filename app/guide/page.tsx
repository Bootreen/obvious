"use client";

import MarkdownRenderer from "@/utils/md-renderer";
import { useAppStates } from "@/store/app-states";
import common from "@/styles/page.default.module.css";

const GuidePage = () => {
  const { topic, guide } = useAppStates((state) => state);

  return (
    <article className={common.container}>
      <h2>{topic}: Guide</h2>
      {guide.map((e, i) => (
        <MarkdownRenderer key={i} content={e} />
      ))}
    </article>
  );
};

export default GuidePage;
