"use client";

import clsx from "clsx";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";

import { useAppStates, useAppActions } from "@/store/app-states";
import MarkdownRenderer from "@/components/md-renderer";
import common from "@/styles/page.default.module.css";
import styles from "@/styles/page.pairmatch.module.css";

const PairsPage = () => {
  const router = useRouter();

  // Redirect to main if no content
  useEffect(() => {
    if (!isReady) router.push("/");
  }, []);

  const {
    contentRoutes,
    topic,
    pairMatcher: { isReady, matchedPairsCounter, pairs, mistakesCounter },
  } = useAppStates((state) => state);
  const { setPairPartSelected } = useAppActions();

  const nextIndex = contentRoutes.findIndex((e) => e === "/pairmatch") + 1;
  const isMoreContent = nextIndex < contentRoutes.length;

  const onNavigateButtonClick = () =>
    router.push(
      contentRoutes[
        isMoreContent
          ? nextIndex // Is more content? Going further
          : 0 //         Back to main
      ],
    );

  const onPairPartClick = (type: "question" | "answer", index: number) =>
    setPairPartSelected(type, index);

  return (
    <article className={common.proseBlock}>
      {isReady && (
        <div className={common.container}>
          <h2>{topic}: Pair match</h2>
          <div className={styles.pairTable}>
            <div className={styles.pairColumn}>
              {pairs.map(({ question }, i) => (
                <Card
                  key={i}
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
              ))}
            </div>
            <div className={styles.pairColumn}>
              {pairs.map(({ answer }, i) => (
                <Card
                  key={i}
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
              ))}
            </div>
          </div>
          {mistakesCounter > 0 && (
            <h3 className={styles.mistakes}>Mistakes: {mistakesCounter}</h3>
          )}
          <Button
            className={common.navButton}
            color="primary"
            isDisabled={false}
            radius="sm"
            size="lg"
            onPress={onNavigateButtonClick}
          >
            {isMoreContent ? "Further" : "Back to main"}
          </Button>
        </div>
      )}
    </article>
  );
};

export default PairsPage;
