/* eslint-disable no-console */
"use client";

import { ChangeEvent, useEffect, useRef } from "react";
import { Textarea } from "@nextui-org/input";
import { CheckboxGroup, Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
import { useDisclosure } from "@nextui-org/react";

import { ModalError } from "@/components/modal-error";
import { ModalProgress } from "@/components/modal-progress";
import { Parts, geminiApiRequest } from "@/backend/controllers/ai-api-request";
import { useAppStates, useAppActions } from "@/store/app-states";
import { checkPairs, checkQuiz } from "@/utils/content-check";
import { estimateLoadTime, isSessionExpired } from "@/utils/date-time-utils";
import { shuffleIndices } from "@/utils/shuffle";
import { initialState } from "@/config/app-initial-state";
import { createTables } from "@/backend/controllers/tables-init-controller";
import { createUser, getUser } from "@/backend/controllers/user-controller";
import {
  createSession,
  deleteSession,
  getSession,
  getSessionsByUserId,
} from "@/backend/controllers/session-controller";
import {
  createRequest,
  deleteRequest,
  getRequest,
  getRequestsBySessionId,
} from "@/backend/controllers/request-controller";
import styles from "@/styles/page.home.module.css";

const Home = () => {
  // State store variables...
  const {
    tabs,
    checkboxes,
    request,
    topic,
    guide,
    summary,
    deck,
    pairMatcher,
    quiz,
    subtopics,
    isBusy,
    progress,
    user,
    session,
  } = useAppStates((state) => state);
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
    setSession,
  } = useAppActions();

  // On app start
  useEffect(() => {
    // Create DB-tables if they don't exist
    createTables();
  }, []);

  useEffect(() => {
    const userId: string | null = user ? user.id : null;

    // Self-invoking async function to check or create user
    (async () => {
      // If there is a valid user ID...
      if (userId) {
        const { status: userFetchStatus } = await getUser(userId);

        // Check if the user exists in the DB, if not — create one
        if (userFetchStatus !== 200) {
          await createUser(user);
        }

        // Fetch sessions for the current user
        const { data, status: sessionsFetchStatus } =
          await getSessionsByUserId(userId);

        if (sessionsFetchStatus === 200 && data.sessions.length > 0) {
          // Get the latest session
          const lastSession = data.sessions[data.sessions.length - 1];

          // Set the latest session as current
          setSession(lastSession);
        }
      }
    })();
  }, [user]);

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

  const onSaveRequestButtonClick = async () => {
    const userId = user?.id;
    const currentSession = session;

    let sessionId = currentSession.id;

    if (!sessionId) {
      // If no current session, check if user has sessions
      const response = await getSessionsByUserId(userId as string);

      const sessions = response.data.sessions;

      if (sessions.length === 0) {
        // No sessions found, create a new session
        const createSessionResponse = await createSession(userId as string);

        sessionId = createSessionResponse.data.id;
      } else {
        // Sessions exist, check if last session is expired
        const lastSession = sessions[sessions.length - 1];

        if (isSessionExpired(lastSession.created_at)) {
          // Last session is too old, create a new one
          const createSessionResponse = await createSession(userId as string);

          sessionId = createSessionResponse.data.id;
        } else {
          // Last session is still valid
          sessionId = lastSession.id;
        }
      }

      // Update current session in Zustand store
      setSession({ id: sessionId });
    }

    // Save the request with the current session ID
    const requestData = {
      request: request?.trim() || "",
      topic: topic?.trim() || "",
      guide: guide.length > 0 ? guide : undefined,
      summary: summary?.trim() || "",
      deck: deck.flashcards.length > 0 ? deck : undefined,
      pairMatcher: pairMatcher.pairs.length > 0 ? pairMatcher : undefined,
      quiz: quiz.questions.length > 0 ? quiz : undefined,
      subtopics: subtopics.length > 0 ? subtopics : undefined,
    };
    const saveRequestResponse = await createRequest(sessionId, requestData);
    const fullResponseData = await getRequest(saveRequestResponse.data.id);

    console.log("Request saved successfully:", fullResponseData);
  };
  const onGetAllRequestsButtonClick = async () => {
    if (session) {
      const { data, status } = await getRequestsBySessionId(session.id);

      if (status === 200)
        console.log("Requests fetched successfully:", data.requests);
      else console.error("Failed to fetch requests");
    }
  };

  // If none of the study material options are selected or the request is empty.
  const isEmptyRequest =
    Object.values(checkboxes).find(({ isChecked }) => isChecked) ===
      undefined || request.trim() === "";

  const isEmptyContent =
    Object.values(tabs).find(
      ({ label, isLoaded }) => label !== "Main" && isLoaded,
    ) === undefined;

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
        {/* Temp for the testing purpose */}
        <div className="flex flex-row gap-x-2 justify-center">
          <Button
            className={styles.submitButton}
            color="primary"
            isDisabled={!user || isEmptyContent || isBusy}
            radius="sm"
            size="lg"
            onPress={onSaveRequestButtonClick}
          >
            Save request
          </Button>
          <Button
            className={styles.submitButton}
            color="primary"
            isDisabled={!user || isBusy}
            radius="sm"
            size="lg"
            onPress={onGetAllRequestsButtonClick}
          >
            Get all session requests
          </Button>
        </div>
      </div>

      {/* Error modal window */}
      <ModalError
        isOpen={isErrorOpen}
        onOpenChangeHandler={onErrorOpenChange}
      />

      {/* Loading progress modal */}
      <ModalProgress
        isOpen={isProgressOpen}
        value={(progress * 100) / estimatedLoadTime.current}
        onOpenChangeHandler={onProgressOpenChange}
      />
    </section>
  );
};

export default Home;
