"use client";

import { Navbar as DefaultNavbar, NavbarContent } from "@nextui-org/navbar";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Button } from "@nextui-org/button";
import { link as linkStyles } from "@nextui-org/theme";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import clsx from "clsx";

import styles from "@/styles/navbar.module.css";
import { ThemeSwitch } from "@/components/theme-switch";
import { useAppStates } from "@/store/app-states";

export const Navbar = () => {
  const currentPath = usePathname();
  const tabs = useAppStates(({ tabs }) => tabs);
  const disabledTabs = Object.entries(tabs)
    .filter(([, { isLoaded }]) => !isLoaded)
    .map(([key]) => key);

  return (
    <DefaultNavbar maxWidth="xl" position="sticky">
      <NavbarContent>
        <Button
          className={styles.helpButton}
          color="success"
          radius="full"
          size="md"
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
                  <div className="flex items-center space-x-2">
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
  );
};
