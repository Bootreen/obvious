"use client";

import clsx from "clsx";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";

import { useAppStates } from "@/store/app-states";
import MarkdownRenderer from "@/components/md-renderer";
import common from "@/styles/page.default.module.css";

const GuidePage = () => {
  const router = useRouter();

  // Redirect to main if no content
  useEffect(() => {
    if (!guide || guide.length === 0) router.push("/");
  }, []);

  const { contentRoutes, topic, guide } = useAppStates((state) => state);

  const nextIndex = contentRoutes.findIndex((e) => e === "/guide") + 1;
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
    <article className={clsx(common.proseBlock)}>
      {guide && guide.length > 0 && (
        <div className={common.container}>
          <h2>{topic}: Guide</h2>
          {guide.map((e, i) => (
            <MarkdownRenderer key={i} content={e} />
          ))}
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

export default GuidePage;
