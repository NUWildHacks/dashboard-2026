export type GuideNavItem = {
  readonly title: string;
  readonly href?: string;
  readonly external?: boolean;
  readonly children?: GuideNavItem[];
  readonly hidden?: boolean;
};

export const GUIDE_NAV_ITEMS: GuideNavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Overview",
    href: "/guide",
  },
  {
    title: "Schedule",
    href: "/guide/schedule",
  },
  {
    title: "Map",
    href: "/guide/map",
  },
  {
    title: "Workshops",
    href: "/guide/workshops",
  },
  {
    title: "Logistics",
    children: [
      { title: "Preparation", href: "/guide/logistics/preparation" },
      { title: "Travel", href: "/guide/logistics/travel" },
      { title: "Checking In", href: "/guide/logistics/checking-in" },
      { title: "Food and Drinks", href: "/guide/logistics/food-and-drinks" },
      { title: "Sleeping and Showering", href: "/guide/logistics/sleeping-and-showering" },
      { title: "Leaving the Venue", href: "/guide/logistics/leaving-the-venue" },
    ],
  },
  {
    title: "Project Guidelines",
    children: [
      { title: "Tracks and Challenges", href: "/guide/project-guidelines/tracks-and-challenges" },
      { title: "Rules", href: "/guide/project-guidelines/rules" },
      { title: "Team Guidelines", href: "/guide/project-guidelines/team-guidelines" },
      { title: "Submission", href: "/guide/project-guidelines/submission" },
    ],
  },
  {
    title: "Judging and Awards",
    children: [
      { title: "Judging Rounds", href: "/guide/judging-and-awards/how-judging-works" },
      { title: "Project Evaluation Criteria", href: "/guide/judging-and-awards/project-evaluation" },
      { title: "Prizes", href: "/guide/judging-and-awards/prizes" },
      { title: "Understanding Your Scores", href: "/guide/judging-and-awards/understanding-your-scores" },
      { title: "How We Calculate Scores", href: "/guide/judging-and-awards/scoring-formula" },
    ],
  },
  {
    title: "Help Desk",
    href: "/guide/help-desk",
  },
  {
    title: "Judging Guide",
    href: "/guide/judging-guide",
    hidden: true,
  },
];
