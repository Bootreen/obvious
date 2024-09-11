/* eslint-disable no-console */
"use client";

import clsx from "clsx";
import NextLink from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Navbar as DefaultNavbar, NavbarContent } from "@nextui-org/navbar";
import { Tabs, Tab } from "@nextui-org/tabs";
import { link as linkStyles } from "@nextui-org/theme";
import { Card, CardBody, useDisclosure } from "@nextui-org/react";

import { ModalHelpMain } from "./modal-help-main";
import { ModalHistory } from "./modal-history";
import { LoginIcon, HelpIcon, HistoryIcon, SaveIcon } from "./icons";

import { createTables } from "@/backend/controllers/tables-init-controller";
import { createUser, getUser } from "@/backend/controllers/user-controller";
import {
  createSession,
  getSessionsByUserId,
} from "@/backend/controllers/session-controller";
import { createRequest } from "@/backend/controllers/request-controller";
import { ThemeSwitch } from "@/components/theme-switch";
import { useAppActions, useAppStates } from "@/store/app-states";
import { isSessionExpired } from "@/utils/date-time-utils";
import styles from "@/styles/navbar.module.css";
import { fetchHistory } from "@/utils/fetch-sessions-history";

export const Navbar = () => {
  const {
    isOpen: isHelpOpen,
    onOpen: onHelpOpen,
    onOpenChange: onHelpOpenChange,
  } = useDisclosure();

  const {
    isOpen: isHistoryOpen,
    onOpen: onHistoryOpen,
    onOpenChange: onHistoryOpenChange,
    onClose: onHistoryClose,
  } = useDisclosure();

  const { isSignedIn, user: fullUserData } = useUser();
  const currentPath = usePathname();
  const {
    request,
    topic,
    summary,
    guide,
    deck,
    pairMatcher,
    quiz,
    subtopics,
    tabs,
    user,
    session,
    isBusy,
    isSaved,
  } = useAppStates((state) => state);
  const { setUser, setSession, setHistory, setIsSaved } = useAppActions();
  const disabledTabs = Object.entries(tabs)
    .filter(([, { isLoaded }]) => !isLoaded)
    .map(([key]) => key);

  useEffect(() => {
    setUser(
      isSignedIn
        ? {
            id: fullUserData.id,
            username: fullUserData.fullName as string,
            email: fullUserData.emailAddresses[0].emailAddress,
          }
        : null,
    );
  }, [isSignedIn]);

  // On app start
  useEffect(() => {
    // Create DB-tables if they don't exist
    createTables();
  }, []);

  useEffect(() => {
    // Self-invoking async function to check or create user
    // and check and fetch user sessions and requests
    (async () => {
      // If there is a valid user ID...
      if (user?.id) {
        const { status: userFetchStatus } = await getUser(user?.id);

        // Check if the user exists in the DB, if not — create one
        if (userFetchStatus !== 200) {
          await createUser(user);
        }

        // Fetch sessions for the current user
        const { data, status: sessionsFetchStatus } = await getSessionsByUserId(
          user?.id,
        );

        if (sessionsFetchStatus === 200 && data.sessions.length > 0) {
          // Get the latest session
          const lastSession = data.sessions[data.sessions.length - 1];

          // Set the latest session as current
          setSession(lastSession);
          const { data: sessionsData, status: sessionsStatus } =
            await getSessionsByUserId(user?.id);

          if (sessionsStatus !== 200) {
            console.error("Failed to fetch sessions");

            return;
          }
          const history = await fetchHistory(sessionsData);

          setHistory(history);
        }
      }
    })();
  }, [user]);

  const onSaveRequestIconClick = async () => {
    const userId = user?.id;

    let sessionId = session.id;

    if (!sessionId) {
      // If no current session, check if user has sessions
      const response = await getSessionsByUserId(userId as string);

      const sessions = response.data.sessions;

      if (!sessions) {
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
    } else {
      if (isSessionExpired(session.created_at as string)) {
        const createSessionResponse = await createSession(userId as string);

        sessionId = createSessionResponse.data.id;
      }
    }

    // Update current session in store
    setSession({ id: sessionId });

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

    const { status } = await createRequest(sessionId, requestData);

    if (status === 201) setIsSaved(true);
    else {
      console.error("Failed to save request");

      return;
    }

    const { data: sessionsData, status: sessionsStatus } =
      await getSessionsByUserId(user?.id as string);

    if (sessionsStatus !== 200) {
      console.error("Failed to fetch sessions");

      return;
    }
    const history = await fetchHistory(sessionsData);

    setHistory(history);
  };

  const onOpenHistoryIconClick = async () => {
    onHistoryOpen();
  };

  const isEmptyContent =
    Object.values(tabs).find(
      ({ label, isLoaded }) => label !== "Main" && isLoaded,
    ) === undefined;

  return (
    <>
      <DefaultNavbar maxWidth="xl" position="sticky">
        <NavbarContent className={styles.navbarEdgeBlock}>
          <ThemeSwitch />
          <Card isPressable shadow="none" onPress={onHelpOpen}>
            <CardBody className={styles.navbarButton}>
              <HelpIcon size={28} />
            </CardBody>
          </Card>
        </NavbarContent>

        <NavbarContent className={styles.navbarMiddle} justify="center">
          <Tabs
            radius="md"
            size="lg"
            variant="solid"
            {...(disabledTabs.length > 0 && {
              disabledKeys: disabledTabs,
              "aria-label": "Disabled Options",
            })}
          >
            {Object.entries(tabs).map(([key, { label, href, icon }]) => {
              const TabIcon = icon;

              return (
                <Tab
                  key={key}
                  className={styles.tab}
                  title={
                    <div className={styles.tabTitle}>
                      <NextLink
                        className={clsx(
                          linkStyles({ color: "foreground" }),
                          styles.navMenuLink,
                          currentPath === href && styles.linkActive,
                          disabledTabs.includes(key) && styles.linkDisabled,
                        )}
                        color="foreground"
                        href={href}
                      >
                        <TabIcon size={28} />
                        <span className={styles.linkText}>{label}</span>
                      </NextLink>
                    </div>
                  }
                />
              );
            })}
          </Tabs>
        </NavbarContent>

        <NavbarContent className={styles.navbarEdgeBlock}>
          <Card
            isDisabled={!user || isEmptyContent || isBusy || isSaved}
            isPressable={!(!user || isEmptyContent || isBusy || isSaved)}
            shadow="none"
            onPress={onSaveRequestIconClick}
          >
            <CardBody className={styles.navbarButton}>
              <SaveIcon size={28} />
            </CardBody>
          </Card>
          <Card
            isDisabled={user ? false : true}
            isPressable={user ? true : false}
            shadow="none"
            onPress={onOpenHistoryIconClick}
          >
            <CardBody className={styles.navbarButton}>
              <HistoryIcon size={28} />
            </CardBody>
          </Card>
          <div className={styles.userLogin}>
            <SignedOut>
              <SignInButton>
                <LoginIcon size={28} />
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </NavbarContent>
      </DefaultNavbar>

      {/* Modal help window */}
      <ModalHelpMain
        isOpen={isHelpOpen}
        onOpenChangeHandler={onHelpOpenChange}
      />

      {/* Modal history windows */}
      <ModalHistory
        isOpen={isHistoryOpen}
        onCloseHandler={onHistoryClose}
        onOpenChangeHandler={onHistoryOpenChange}
      />
    </>
  );
};
