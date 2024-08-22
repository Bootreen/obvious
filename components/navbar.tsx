"use client";

import { Navbar as NextUINavbar, NavbarContent } from "@nextui-org/navbar";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Button } from "@nextui-org/button";
import { link as linkStyles } from "@nextui-org/theme";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import clsx from "clsx";

import styles from "./navbar.module.css";

import { ThemeSwitch } from "@/components/theme-switch";
import { useAppParamsStore } from "@/store/app-params-store";

export const Navbar = () => {
  const currentPath = usePathname();
  const tabs = useAppParamsStore(({ tabs }) => tabs);
  const disabledTabs = Object.entries(tabs)
    .filter(([, { isLoaded }]) => !isLoaded)
    .map(([key]) => key);

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
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
          aria-label="Disabled Options"
          disabledKeys={disabledTabs}
          radius="md"
          size="lg"
          variant="solid"
        >
          {Object.entries(tabs).map(([key, { href, icon }]) => {
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
                      <span className={styles.linkText}>{key}</span>
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
    </NextUINavbar>
  );
};
