import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@nextui-org/modal";

import { ModalWindowProps } from "@/types";
import styles from "@/styles/modal-error.module.css";

export const ModalError: React.FC<ModalWindowProps> = ({
  isOpen,
  onOpenChangeHandler,
}) => (
  <Modal
    classNames={{ header: styles.modalHeader }}
    isDismissable={false}
    isOpen={isOpen}
    placement="center"
    size="xl"
    onOpenChange={onOpenChangeHandler}
  >
    <ModalContent className={styles.modalBody}>
      {(onErrorClose) => (
        <>
          <ModalHeader>Unable to fulfill the request</ModalHeader>
          <ModalBody>
            <p>
              Failed to generate learning materials for your request after three
              attempts. This usually happens when the query is not formulated
              well, or you are trying to request materials that violate the
              ethical principles of using AI. Try rephrasing your question or
              change the subject.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={onErrorClose}>
              Dismiss
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
);
