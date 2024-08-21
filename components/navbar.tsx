"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

import styles from "./navbar.module.css";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {
  const currentPath = usePathname();

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
        <ul className={styles.navMenu}>
          {siteConfig.navItems.map((item) => {
            const TabIcon = item.icon;

            return (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    styles.navMenuLink,
                    currentPath === item.href && styles.linkActive,
                  )}
                  color="foreground"
                  href={item.href}
                >
                  <TabIcon size={28} />
                  <span className={styles.linkText}>{item.label}</span>
                </NextLink>
              </NavbarItem>
            );
          })}
        </ul>
      </NavbarContent>

      <NavbarContent justify="end">
        <ThemeSwitch />
      </NavbarContent>
    </NextUINavbar>
  );
};
