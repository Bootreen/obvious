"use client";

import { Navbar as DefaultNavbar, NavbarContent } from "@nextui-org/navbar";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Button } from "@nextui-org/button";
import { link as linkStyles } from "@nextui-org/theme";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { useDisclosure } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import clsx from "clsx";

import styles from "@/styles/navbar.module.css";
import { ThemeSwitch } from "@/components/theme-switch";
import { useAppStates } from "@/store/app-states";

export const Navbar = () => {
  const {
    isOpen: isHelpOpen,
    onOpen: onHelpOpen,
    onOpenChange: onHelpOpenChange,
  } = useDisclosure();
  const currentPath = usePathname();
  const tabs = useAppStates(({ tabs }) => tabs);
  const disabledTabs = Object.entries(tabs)
    .filter(([, { isLoaded }]) => !isLoaded)
    .map(([key]) => key);

  return (
    <>
      <DefaultNavbar maxWidth="xl" position="sticky">
        <NavbarContent>
          <Button
            className={styles.helpButton}
            color="success"
            radius="full"
            size="md"
            onPress={onHelpOpen}
          >
            ?
          </Button>
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

        <NavbarContent justify="end">
          <ThemeSwitch />
        </NavbarContent>
      </DefaultNavbar>

      {/* Help modal window */}
      <Modal isOpen={isHelpOpen} size="xl" onOpenChange={onHelpOpenChange}>
        <ModalContent>
          {(onHelpClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Sarge Obvious: Help
              </ModalHeader>
              <ModalBody>
                <h3>1. Choose Your Topic:</h3>
                <p>
                  Enter any topic you’d like to learn about. The more specific,
                  the better! For example, &quot;Quantum entanglement in quantum
                  computing&quot; will yield more focused results than just
                  &quot;quantum physics.&quot; Remember, the app doesn’t support
                  content related to violence, terrorism, drugs, sexual content,
                  and other unethical subjects.
                </p>
                <h3>2. Select Your Material Type:</h3>
                <p>You can generate the following types of study materials:</p>
                <ul>
                  <li>
                    Step-by-Step Guides: Detailed instructions on the most
                    critical aspects of your topic.
                  </li>
                  <li>
                    Summaries: Concise overviews that cover the essentials.
                  </li>
                  <li>
                    Flashcards: Great for quick memorization of key points.
                  </li>
                  <li>
                    Matching Pairs: Test your knowledge by pairing related
                    concepts.
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
                  requested, this might take between 5 to 20 seconds.
                </p>

                <h3>4. Review and Learn:</h3>
                <p>
                  Once your materials are ready, dive in and start learning.
                  Whether you’re brushing up on your coding skills or mastering
                  a complex formula, Sarge Obvious has got you covered. Now, get
                  ready to drill down into your topic and become a
                  subject-matter expert!
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
    </>
  );
};
