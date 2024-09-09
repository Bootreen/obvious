import { Modal, ModalHeader, ModalContent } from "@nextui-org/modal";
import { Progress } from "@nextui-org/react";

import { ModalWindowProps } from "@/types";
import styles from "@/styles/modal-progress.module.css";

interface ModalProgressWindowProps extends ModalWindowProps {
  value: number;
}

export const ModalProgress: React.FC<ModalProgressWindowProps> = ({
  isOpen,
  onOpenChangeHandler,
  value,
}) => (
  <Modal
    hideCloseButton
    isKeyboardDismissDisabled
    classNames={{ header: styles.modalHeader }}
    isDismissable={false}
    isOpen={isOpen}
    size="md"
    onOpenChange={onOpenChangeHandler}
  >
    <ModalContent>
      {() => (
        <>
          <ModalHeader>Generating content...</ModalHeader>
          <Progress
            aria-label="Content generating progress..."
            classNames={{ base: styles.progressBarContainer }}
            color="success"
            showValueLabel={true}
            size="md"
            value={value}
          />
        </>
      )}
    </ModalContent>
  </Modal>
);
