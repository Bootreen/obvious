/* eslint-disable no-console */
"use client";

import axios from "axios";
import { ChangeEvent, useEffect, useRef } from "react";
import { Textarea } from "@nextui-org/input";
import { CheckboxGroup, Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
import { Progress, useDisclosure } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";

import { Parts, geminiApiRequest } from "@/backend/controllers/ai-api-request";
import { useAppStates, useAppActions } from "@/store/app-states";
import { checkPairs, checkQuiz } from "@/utils/content-check";
import { estimateLoadTime } from "@/utils/estimate-load-time";
import { shuffleIndices } from "@/utils/shuffle";
import { initialState } from "@/config/app-initial-state";
import styles from "@/styles/page.home.module.css";

const Home = () => {
  // State store variables...
  const { checkboxes, request, isBusy, progress } = useAppStates(
    (state) => state,
  );
  // ...and setters
  const {
    setTabState,
    turnOffTabs,
    setCheckboxState,
    setRequest,
    setTopic,
    setGuide,
    setSummary,
    setFlashcards,
    setPairs,
    setQuiz,
    setSubtopics,
    resetContent,
    setIsBusy,
    setProgress,
  } = useAppActions();

  // Local variable to store estimated load time
  const estimatedLoadTime = useRef<number>(0);

  // Update load time when checkbox configuration changes
  useEffect(() => {
    estimatedLoadTime.current = estimateLoadTime(checkboxes);
  }, [checkboxes]);

  // Update progress indicator every 0.1s
  useEffect(() => {
    if (isBusy) {
      const interval = setInterval(() => {
        setProgress(
          progress >= estimatedLoadTime.current
            ? estimatedLoadTime.current
            : progress + 100,
        );
      }, 100);

      return () => clearInterval(interval);
    } else setProgress(estimatedLoadTime.current); // Loading is complete
  }, [isBusy, progress]);

  // Error modal handlers
  const {
    isOpen: isErrorOpen,
    onOpen: onErrorOpen,
    onOpenChange: onErrorOpenChange,
  } = useDisclosure();

  // Progress modal handlers
  const {
    isOpen: isProgressOpen,
    onOpen: onProgressOpen,
    onOpenChange: onProgressOpenChange,
    onClose: onProgressClose,
  } = useDisclosure();

  // Main window handlers
  const onCheckboxToggle = (
    checkbox: keyof typeof checkboxes,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setCheckboxState(checkbox, event.target.checked);
  };

  const onTextareaChange = (event: ChangeEvent<HTMLInputElement>) =>
    setRequest(event.target.value);

  const onGenerateButtonClick = async () => {
    // Error handling logic
    let isError: boolean = false;
    let errorLog: string[] = [];
    const addError = (error: string): void => {
      isError = true;
      errorLog = [...errorLog, error];
    };
    const clearErrors = (): void => {
      isError = false;
      errorLog = [];
    };

    resetContent();
    // Disable requests while waiting for response
    setIsBusy(true);
    // Open loading indicator
    onProgressOpen();
    // Turn off content tabs until response is received
    turnOffTabs();

    // Make at least one request
    do {
      try {
        const {
          topic,
          guide,
          summary,
          flashcards,
          pairmatch,
          quiz,
          subtopics,
          error,
        } = await geminiApiRequest(
          request,
          // Request only selected materials to minimize token usage
          Object.entries(checkboxes)
            .filter(([, { isChecked }]) => isChecked)
            .map(([key]) => key) as Parts[],
        );

        // Update content state and tab availability
        if (topic) setTopic(topic);
        if (guide && guide.length > 0) {
          setGuide(guide);
          setTabState("guide", true);
        }
        if (summary && summary !== "") {
          setSummary(summary);
          setTabState("summary", true);
        }
        if (flashcards && flashcards.length > 0) {
          setFlashcards(flashcards);
          setTabState("flashcards", true);
        }
        if (pairmatch && pairmatch.length > 0) {
          if (checkPairs(pairmatch)) {
            // Shuffle pairs order
            const leftColumnIndecies = shuffleIndices(pairmatch.length);
            const rightColumnIndecies = shuffleIndices(pairmatch.length);
            // Add shuffled pairs and additional state variables
            const shuffledPairs = pairmatch.map((_, i) => ({
              question: {
                value: pairmatch[leftColumnIndecies[i]].question,
                index: leftColumnIndecies[i],
                isSelected: false,
              },
              answer: {
                value: pairmatch[rightColumnIndecies[i]].answer,
                index: rightColumnIndecies[i],
                isSelected: false,
              },
            }));

            setPairs(shuffledPairs);
            setTabState("pairmatch", true);
          } else throw new Error("Invalid matching pairs");
        }
        if (quiz && quiz.length > 0) {
          if (checkQuiz(quiz)) {
            // Shuffle answer order, as AI tends to place the correct answer first
            const shuffledOptions = shuffleIndices(4);

            setQuiz(
              quiz.map((question) => ({
                ...question,
                options: shuffledOptions.map((i) => question.options[i]),
                isAnswered: false,
                isAnswerCorrect: false,
              })) as unknown as typeof initialState.quiz.questions,
            );
            setTabState("quiz", true);
          } else throw new Error("Invalid quiz");
        }
        if (subtopics) setSubtopics(subtopics);

        // Error handling
        if (error) {
          if (error.isError) {
            addError(error.message);
            // Increase load time on error
            estimatedLoadTime.current +=
              errorLog.length > 1
                ? estimatedLoadTime.current / 2
                : estimatedLoadTime.current;
          } else clearErrors();
        } else clearErrors();
      } catch (error) {
        const internalError = {
          isError: true,
          message: (error as Error).message,
        };

        addError(internalError.message);
        // Increase load time on error
        estimatedLoadTime.current +=
          errorLog.length > 1
            ? estimatedLoadTime.current / 2
            : estimatedLoadTime.current;
      }
      // Repeat request on error, but no more than 3 times in a row
    } while (isError && errorLog.length < 3);

    if (isError) {
      onErrorOpen();
      // Fatal error - 3 consecutive errors, request aborted, log errors
      // eslint-disable-next-line no-console
      console.log("Unable to fulfill request. See error log:", errorLog);
    }

    // Enable new requests again
    setIsBusy(false);
    // Close loading indicator
    onProgressClose();
    // Clear error log
    clearErrors();
  };

  const handleCreateTables = async () => {
    try {
      const response = await axios.post("/api/tables");

      console.log(response.data.message);
    } catch (error) {
      console.error("Error creating tables:", error);
    }
  };

  const onCreateTablesButtonClick = () => handleCreateTables();
  const onSaveUserButtonClick = () => {};
  const onDeleteUserButtonClick = () => {};

  // If none of the study material options are selected or the request is empty.
  const isEmptyRequest =
    Object.values(checkboxes).find(({ isChecked }) => isChecked) ===
      undefined || request.trim() === "";

  return (
    <section className={styles.homePage}>
      <div className={styles.contentContainer}>
        <div>
          <h1 className={styles.title}>Sarge Obvious</h1>
          <p className={styles.paragraph}>
            Ready to get in line and learn something?
            <br />
            <strong>Sarge Obvious</strong> is your new AI drill sergeant, here
            to put you through your paces! Just give Sarge a command, and he’ll
            generate custom study materials that’ll make you smarter in no time.
          </p>
          <Textarea
            isRequired
            className={styles.textarea}
            label="Enter your request:"
            labelPlacement="inside"
            placeholder="Describe here in natural language what topic you would like to practice today..."
            onChange={(event) => onTextareaChange(event)}
          />
        </div>

        <CheckboxGroup
          defaultValue={Object.entries(checkboxes)
            .filter(([, { isChecked }]) => isChecked)
            .map(([key]) => key)}
          label="What kind of materials do you need?"
        >
          {Object.entries(checkboxes).map(([key, { label }]) => (
            <Checkbox
              key={key}
              value={key}
              onChange={(event) =>
                onCheckboxToggle(key as keyof typeof checkboxes, event)
              }
            >
              {label}
            </Checkbox>
          ))}
        </CheckboxGroup>
        <Button
          className={styles.submitButton}
          color="primary"
          isDisabled={isEmptyRequest || isBusy}
          radius="sm"
          size="lg"
          onPress={onGenerateButtonClick}
        >
          Generate
        </Button>
        <div className="flex flex-row gap-x-2 justify-center">
          <Button
            className={styles.submitButton}
            color="primary"
            radius="sm"
            size="lg"
            onPress={onCreateTablesButtonClick}
          >
            Create tables
          </Button>
          <Button
            className={styles.submitButton}
            color="primary"
            radius="sm"
            size="lg"
            onPress={onSaveUserButtonClick}
          >
            Save user
          </Button>
          <Button
            className={styles.submitButton}
            color="primary"
            radius="sm"
            size="lg"
            onPress={onDeleteUserButtonClick}
          >
            Delete user
          </Button>
        </div>
      </div>

      {/* Error modal window */}
      <Modal
        classNames={{ header: styles.modalHeader }}
        isDismissable={false}
        isOpen={isErrorOpen}
        size="xl"
        onOpenChange={onErrorOpenChange}
      >
        <ModalContent>
          {(onErrorClose) => (
            <>
              <ModalHeader>Unable to fulfill the request</ModalHeader>
              <ModalBody>
                <p>
                  Failed to generate learning materials for your request after
                  three attempts. This usually happens when the query is not
                  formulated well, or you are trying to request materials that
                  violate the ethical principles of using AI. Try rephrasing
                  your question or change the subject.
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

      {/* Loading progress modal */}
      <Modal
        hideCloseButton
        isKeyboardDismissDisabled
        classNames={{ header: styles.modalHeader }}
        isDismissable={false}
        isOpen={isProgressOpen}
        size="md"
        onOpenChange={onProgressOpenChange}
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
                value={(progress * 100) / estimatedLoadTime.current}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
};

export default Home;
