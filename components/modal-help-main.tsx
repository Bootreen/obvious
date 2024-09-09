import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@nextui-org/modal";

import { ModalWindowProps } from "@/types";
import styles from "@/styles/modal-help-main.module.css";

export const ModalHelpMain: React.FC<ModalWindowProps> = ({
  isOpen,
  onOpenChangeHandler,
}) => (
  <Modal isOpen={isOpen} size="xl" onOpenChange={onOpenChangeHandler}>
    <ModalContent>
      {(onHelpClose) => (
        <>
          <ModalHeader className={styles.modalHeader}>
            Sarge Obvious: Help
          </ModalHeader>
          <ModalBody>
            <h3>1. Choose Your Topic:</h3>
            <p>
              Enter any topic you’d like to learn about. The more specific, the
              better! For example, &quot;Quantum entanglement in quantum
              computing&quot; will yield more focused results than just
              &quot;quantum physics.&quot; Remember, the app doesn’t support
              content related to violence, terrorism, drugs, sexual content, and
              other unethical subjects.
            </p>
            <h3>2. Select Your Material Type:</h3>
            <p>You can generate the following types of study materials:</p>
            <ul>
              <li>
                Step-by-Step Guides: Detailed instructions on the most critical
                aspects of your topic.
              </li>
              <li>Summaries: Concise overviews that cover the essentials.</li>
              <li>Flashcards: Great for quick memorization of key points.</li>
              <li>
                Matching Pairs: Test your knowledge by pairing related concepts.
              </li>
              <li>
                Final Quiz: A test to check how well you’ve learned the
                material.
              </li>
            </ul>
            <h3>3. Wait for the Magic:</h3>
            <p>
              After submitting your request, Sarge Obvious will process it.
              Depending on the complexity and amount of material you’ve
              requested, this might take between 3 to 20 seconds.
            </p>

            <h3>4. Review and Learn:</h3>
            <p>
              Once your materials are ready, dive in and start learning. Whether
              you’re brushing up on your coding skills or mastering a complex
              formula, Sarge Obvious has got you covered. Now, get ready to
              drill down into your topic and become a subject-matter expert!
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={onHelpClose}>
              OK
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
);
