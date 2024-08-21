"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

import styles from "./navbar.module.css";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";

export const Navbar = () => {
  const currentPath = usePathname();

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent>
        <NavbarBrand as="li">
          <NextLink href="/">
            <Logo size={32} />
          </NextLink>
        </NavbarBrand>
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
                  {item.label}
                </NextLink>
              </NavbarItem>
            );
          })}
        </ul>
      </NavbarContent>

      <NavbarContent className={styles.navbarRightDesktop} justify="end">
        <ThemeSwitch />
      </NavbarContent>

      <NavbarContent className={styles.navbarRightMobile} justify="end">
        <NavbarMenuToggle />
        <ThemeSwitch />
      </NavbarContent>

      <NavbarMenu>
        <div className={styles.verticalMenu}>
          {siteConfig.navItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
