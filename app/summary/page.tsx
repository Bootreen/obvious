"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";

import { useAppStates } from "@/store/app-states";
import MarkdownRenderer from "@/components/md-renderer";
import common from "@/styles/page.default.module.css";

const SummaryPage = () => {
  const router = useRouter();

  // Redirect to main if no content
  useEffect(() => {
    if (!summary || summary === "") router.push("/");
  }, []);

  const { contentRoutes, topic, summary } = useAppStates((state) => state);

  const nextIndex = contentRoutes.findIndex((e) => e === "/summary") + 1;
  const isMoreContent = nextIndex < contentRoutes.length;

  const onNavigateButtonClick = () =>
    router.push(
      contentRoutes[
        isMoreContent
          ? nextIndex // Is more content? Going further
          : 0 //         Back to main
      ],
    );

  return (
    <article className={common.proseBlock}>
      {summary && summary !== "" && (
        <div className={common.container}>
          <h2>{topic}: Summary</h2>
          <MarkdownRenderer content={summary} />
          <div className={common.buttonBlock}>
            <Button
              className={common.navButton}
              color="primary"
              radius="sm"
              size="lg"
              onPress={onNavigateButtonClick}
            >
              {isMoreContent ? "Further" : "Back to main"}
            </Button>
          </div>
        </div>
      )}
    </article>
  );
};

export default SummaryPage;
