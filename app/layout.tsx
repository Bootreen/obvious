import "@/styles/globals.css";

import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";

import styles from "./layout.module.css";
import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/so-icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={clsx(styles.body, fontSans.variable)}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className={styles.pageContainer}>
            <Navbar />
            <main className={styles.mainSectionContainer}>{children}</main>
            <footer className={styles.footer}>
              <Link
                isExternal
                className={styles.footerLink}
                href="https://butrin.vercel.app/"
                title="Oleksii Butrin's portfolio"
              >
                <span className={styles.footerTextRegular}>Created by</span>
                <p className={styles.footerTextAccent}>Oleksii Butrin</p>
              </Link>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
