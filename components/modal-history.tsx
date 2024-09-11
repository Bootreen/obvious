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

import { ModalWindowProps } from "@/types";
import { useAppActions, useAppStates } from "@/store/app-states";
import { parseTimeStampToDateTime } from "@/utils/date-time-utils";
import styles from "@/styles/modal-help-main.module.css";
import { parseRequestContent } from "@/utils/request-content-parser";
import {
  deleteRequest,
  getRequest,
} from "@/backend/controllers/request-controller";
import { fetchHistory } from "@/utils/fetch-sessions-history";
import { getSessionsByUserId } from "@/backend/controllers/session-controller";

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
    turnOffTabs();

    const { topic, guide, summary, deck, pairMatcher, quiz, subtopics } =
      data.request_data;

    if (topic) setTopic(topic);
    if (guide && guide.length > 0) {
      setGuide(guide);
      setTabState("guide", true);
    }
    if (summary && summary !== "") {
      setSummary(summary);
      setTabState("summary", true);
    }
    if (deck) {
      setFlashcards(deck.flashcards);
      setTabState("flashcards", true);
    }
    if (pairMatcher) {
      setPairMatcher(pairMatcher.pairs);
      setTabState("pairmatch", true);
    }
    if (quiz) {
      setQuiz(quiz.questions);
      setTabState("quiz", true);
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
    <Modal isOpen={isOpen} size="xl" onOpenChange={onOpenChangeHandler}>
      <ModalContent>
        {(onHistoryClose) => (
          <>
            <ModalHeader className={styles.modalHeader}>
              {user?.username}: Sessions History
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-y-2">
                {userHistory.map(({ session, requests }, i) => (
                  <div key={i}>
                    <div className="font-bold mb-2">
                      {parseTimeStampToDateTime(
                        session.created_at as string,
                        "full",
                      )}
                    </div>
                    {requests.map((request, j) => (
                      <div
                        key={j}
                        className="flex flex-row gap-x-2 items-center justify-between mb-1"
                      >
                        <div>
                          {parseTimeStampToDateTime(
                            request.created_at as string,
                            "timeShort",
                          )}
                          {" - "}
                          {parseRequestContent(request.request_data)}
                        </div>
                        <div className="flex flex-row gap-x-2">
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
