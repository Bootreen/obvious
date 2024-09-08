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
import { LoginIcon, HelpIcon } from "./icons";

import styles from "@/styles/navbar.module.css";
import { ThemeSwitch } from "@/components/theme-switch";
import { useAppActions, useAppStates } from "@/store/app-states";

export const Navbar = () => {
  const {
    isOpen: isHelpOpen,
    onOpen: onHelpOpen,
    onOpenChange: onHelpOpenChange,
  } = useDisclosure();
  const { isSignedIn, user: fullUserData } = useUser();
  const currentPath = usePathname();
  const { tabs } = useAppStates((state) => state);
  const { setUser } = useAppActions();
  const disabledTabs = Object.entries(tabs)
    .filter(([, { isLoaded }]) => !isLoaded)
    .map(([key]) => key);

  useEffect(() => {
    setUser(
      isSignedIn
        ? {
            id: fullUserData.id,
            fullName: fullUserData.fullName as string,
            email: fullUserData.emailAddresses[0].emailAddress,
          }
        : null,
    );
  }, [isSignedIn]);

  return (
    <>
      <DefaultNavbar maxWidth="xl" position="sticky">
        <NavbarContent>
          <div className={styles.userLogin}>
            <SignedOut>
              <SignInButton>
                <LoginIcon />
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
          <Card isPressable shadow="none" onPress={onHelpOpen}>
            <CardBody className={styles.helpButton}>
              <HelpIcon />
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

        <NavbarContent justify="end">
          <ThemeSwitch />
        </NavbarContent>
      </DefaultNavbar>

      <ModalHelpMain
        isOpen={isHelpOpen}
        onOpenChangeHandler={onHelpOpenChange}
      />
    </>
  );
};
