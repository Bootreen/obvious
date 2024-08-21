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

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";

export const Navbar = () => {
  const currentPath = usePathname();

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent>
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-2" href="/">
            <Logo size={32} />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="basis-1/5 min-[681px]:basis-full"
        justify="center"
      >
        <ul className="hidden min-[681px]:flex gap-x-2 justify-center ml-4 bg-default rounded-lg p-1">
          {siteConfig.navItems.map((item) => {
            const TabIcon = item.icon;

            return (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium gap-x-2 text-xl bg-background-50 py-1 px-2 rounded-lg",
                    currentPath === item.href &&
                      "text-primary-foreground bg-primary",
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

      <NavbarContent className="hidden min-[681px]:flex" justify="end">
        <ThemeSwitch />
      </NavbarContent>

      <NavbarContent className="min-[680px]:hidden basis-1 pl-4" justify="end">
        <NavbarMenuToggle />
        <ThemeSwitch />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
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
