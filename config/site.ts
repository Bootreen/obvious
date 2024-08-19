export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Sarge Obvious",
  description: "AI-assisted study helper",
  navItems: [
    {
      label: "Main",
      href: "/",
    },
    {
      label: "Guide",
      href: "/guide",
    },
    {
      label: "Summary",
      href: "/summary",
    },
    {
      label: "Flashcards",
      href: "/flashcards",
    },
    {
      label: "Pair match",
      href: "/pairmatch",
    },
    {
      label: "Quiz",
      href: "/quiz",
    },
  ],
};
