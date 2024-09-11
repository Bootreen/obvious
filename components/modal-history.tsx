/* eslint-disable no-console */
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

export const ModalHistory: React.FC<ModalWindowProps> = ({
  isOpen,
  onOpenChangeHandler,
}) => {
  const { user, userHistory } = useAppStates((state) => state);
  const {} = useAppActions();

  return (
    <Modal isOpen={isOpen} size="xl" onOpenChange={onOpenChangeHandler}>
      <ModalContent>
        {(onHistoryClose) => (
          <>
            <ModalHeader className={styles.modalHeader}>
              {user?.username}: Sessions History
            </ModalHeader>
            <ModalBody>
              <div>
                {userHistory.map(({ session, requests }, i) => (
                  <div key={i}>
                    <div>
                      {parseTimeStampToDateTime(
                        session.created_at as string,
                        "full",
                      )}
                    </div>
                    {requests.map((request, j) => (
                      <div key={j}>
                        {parseTimeStampToDateTime(
                          request.created_at as string,
                          "timeShort",
                        )}
                        {parseRequestContent(request.request_data)}
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
