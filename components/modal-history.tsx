/* eslint-disable no-console */
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@nextui-org/modal";

import { shuffleIndices } from "@/utils/shuffle";
import { ModalWindowProps } from "@/types";
import { useAppActions, useAppStates } from "@/store/app-states";
import { parseTimeStampToDateTime } from "@/utils/date-time-utils";
import { parseRequestContent } from "@/utils/request-content-parser";
import {
  deleteRequest,
  getRequest,
} from "@/backend/controllers/request-controller";
import { fetchHistory } from "@/utils/fetch-sessions-history";
import { getSessionsByUserId } from "@/backend/controllers/session-controller";
import styles from "@/styles/modal-history.module.css";

export const ModalHistory: React.FC<ModalWindowProps> = ({
  isOpen,
  onOpenChangeHandler,
  onCloseHandler,
}) => {
  const router = useRouter();
  const { user, userHistory } = useAppStates((state) => state);
  const {
    resetContent,
    turnOffTabs,
    setTabState,
    setTopic,
    setSummary,
    setGuide,
    setFlashcards,
    setPairMatcher,
    setQuiz,
    setSubtopics,
    setIsSaved,
    setHistory,
    addContentRoute,
    setIsBusy,
  } = useAppActions();

  const onRequestLoadButtonClick = async (id: number) => {
    // Set initial state and switch to main tab
    await router.push("/");
    const { data, status } = await getRequest(id);

    if (status !== 200) {
      console.error("Failed to fetch request");

      return; // early return if fetch failed
    }

    resetContent();
    setIsBusy(true);
    turnOffTabs();
    addContentRoute("/");

    const { topic, guide, summary, deck, pairMatcher, quiz, subtopics } =
      data.request_data;

    if (topic) setTopic(topic);
    if (summary && summary !== "") {
      setSummary(summary);
      setTabState("summary", true);
      addContentRoute("/summary");
    }
    if (guide && guide.length > 0) {
      setGuide(guide);
      setTabState("guide", true);
      addContentRoute("/guide");
    }
    if (deck) {
      setFlashcards(deck.flashcards);
      setTabState("flashcards", true);
      addContentRoute("/flashcards");
    }
    if (pairMatcher) {
      // Reshuffle pairs order on each load
      const leftColumnIndecies = shuffleIndices(pairMatcher.pairs.length);
      const rightColumnIndecies = shuffleIndices(pairMatcher.pairs.length);
      const shuffledPairs = pairMatcher.pairs.map((_: number, i: number) => ({
        question: pairMatcher.pairs[leftColumnIndecies[i]].question,
        answer: pairMatcher.pairs[rightColumnIndecies[i]].answer,
      }));

      setPairMatcher(shuffledPairs);
      setTabState("pairmatch", true);
      addContentRoute("/pairmatch");
    }
    if (quiz) {
      setQuiz(
        quiz.questions.map((question: any) => ({
          ...question,
          // Reshuffle quiz options order on each load
          options: shuffleIndices(4).map((i) => question.options[i]),
          isAnswered: false,
          selectedIncorrectOptionIndex: null,
        })),
      );
      setTabState("quiz", true);
      addContentRoute("/quiz");
    }
    if (subtopics) setSubtopics(subtopics);
    setIsSaved(true);
    if (onCloseHandler) onCloseHandler(); // close 'History' modal
  };

  const onRequestDeleteButtonClick = async (id: number) => {
    if (user?.id) {
      await deleteRequest(id);
      const { data: sessionsData, status: sessionsStatus } =
        await getSessionsByUserId(user?.id);

      if (sessionsStatus !== 200) {
        console.error("Failed to fetch sessions");

        return;
      }
      const history = await fetchHistory(sessionsData);

      setHistory(history);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      scrollBehavior="outside"
      size="4xl"
      onOpenChange={onOpenChangeHandler}
    >
      <ModalContent>
        {(onHistoryClose) => (
          <>
            <ModalHeader className={styles.modalHeader}>
              {user?.username}: Sessions History
            </ModalHeader>
            <ModalBody className={styles.modalBody}>
              <div className={styles.historyList}>
                {userHistory.map(({ session, requests }, i) => (
                  <div key={i}>
                    <div className={styles.session}>
                      {parseTimeStampToDateTime(
                        session.created_at as string,
                        "full",
                      )}
                    </div>
                    {requests.map((request, j) => (
                      <div key={j} className={styles.request}>
                        <div>
                          {parseTimeStampToDateTime(
                            request.created_at as string,
                            "timeShort",
                          )}
                          {" - "}
                          {parseRequestContent(request.request_data)}
                        </div>
                        <div className={styles.buttonBlock}>
                          <Button
                            color="success"
                            size="sm"
                            onPress={() => onRequestLoadButtonClick(request.id)}
                          >
                            Load
                          </Button>
                          <Button
                            color="danger"
                            size="sm"
                            onPress={() =>
                              onRequestDeleteButtonClick(request.id)
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onHistoryClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
