import {
  FlashcardsIcon,
  GuideIcon,
  HomeIcon,
  PairsIcon,
  QuizIcon,
  SummaryIcon,
} from "@/components/icons";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Sarge Obvious",
  description: "AI-assisted study helper",
  navItems: [
    {
      label: "Main",
      href: "/",
      icon: HomeIcon,
    },
    {
      label: "Guide",
      href: "/guide",
      icon: GuideIcon,
    },
    {
      label: "Summary",
      href: "/summary",
      icon: SummaryIcon,
    },
    {
      label: "Flashcards",
      href: "/flashcards",
      icon: FlashcardsIcon,
    },
    {
      label: "Pair match",
      href: "/pairmatch",
      icon: PairsIcon,
    },
    {
      label: "Quiz",
      href: "/quiz",
      icon: QuizIcon,
    },
  ],
};
