"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAppStates } from "@/store/app-states";
import MarkdownRenderer from "@/components/md-renderer";
import common from "@/styles/page.default.module.css";

const GuidePage = () => {
  const { topic, guide } = useAppStates((state) => state);
  const router = useRouter();

  // Redirect to main if no content
  useEffect(() => {
    if (!guide || guide.length === 0) router.push("/");
  }, []);

  return (
    <article className={common.container}>
      {guide && guide.length > 0 && (
        <>
          <h2>{topic}: Guide</h2>
          {guide.map((e, i) => (
            <MarkdownRenderer key={i} content={e} />
          ))}
        </>
      )}
    </article>
  );
};

export default GuidePage;
