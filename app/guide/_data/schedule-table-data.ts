import type { InlineSegment } from "../types";

export type WorkshopWeekRow = {
  date: string;
  time: string;
  event: InlineSegment[];
  location: string;
};

export type DayScheduleRow = {
  id?: string;
  time: string;
  event: InlineSegment[];
  location?: string;
  highlight?: "deadline";
};

export const workshopWeekRows: WorkshopWeekRow[] = [
  {
    date: "April 6, 2026",
    time: "6:00 PM - 7:30 PM",
    event: [
      {
        content: "DISC X WildHacks Git/GitHub Workshop",
        href: "/guide/workshops#disc-x-wildhacks-git-github-workshop",
      },
    ],
    location: "Tech M177",
  },
  {
    date: "April 7, 2026",
    time: "6:00 PM - 7:00 PM",
    event: [
      {
        content: "CANCELLED — ColorStack X WildHacks SQL & Databases Workshop",
        href: "/guide/workshops#colorstack-x-wildhacks-sql-databases-workshop",
      },
    ],
    location: "Tech M166",
  },
  {
    date: "April 8, 2026",
    time: "6:00 PM - 7:30 PM",
    event: [
      {
        content: "IMC Trading x WildHacks Tech Talk",
        href: "/guide/workshops#imc-trading-x-wildhacks-tech-talk",
      },
    ],
    location: "Tech LR3",
  },
  {
    date: "April 9, 2026",
    time: "5:30 PM - 6:30 PM",
    event: [
      {
        content: "ColorStack X WildHacks Python & FastAPI Workshop",
        href: "/guide/workshops#colorstack-x-wildhacks-python-fastapi-workshop",
      },
    ],
    location: "Tech A110",
  },
  {
    date: "April 9, 2026",
    time: "7:00 PM - 8:00 PM",
    event: [
      {
        content: "IEEE X WildHacks Command Line/Linux Workshop",
        href: "/guide/workshops#ieee-x-wildhacks-command-linelinux-workshop",
      },
    ],
    location: "Tech M128",
  },
  {
    date: "April 10, 2026",
    time: "5:00 PM - 6:30 PM",
    event: [
      {
        content: "EMCO X WildHacks Frontend Web Dev Workshop",
        href: "/guide/workshops#emco-x-wildhacks-frontend-web-dev-workshop",
      },
    ],
    location: "Tech M177",
  },
  {
    date: "April 11, 2026",
    time: "1:30 PM - 2:15 PM",
    event: [
      {
        content: "Finding Your Path in Tech with Women in Computing",
        href: "/guide/workshops#finding-your-path-in-tech-with-women-in-computing",
      },
    ],
    location: "Tech LR5",
  },
];

export const saturdayScheduleRows: DayScheduleRow[] = [
  {
    time: "8:30 - 10:00 AM",
    event: [{ content: "Check-In", href: "/guide/logistics/checking-in" }],
    location: "Front of LR2",
  },
  {
    time: "8:30 - 10:00 AM",
    event: [{ content: "Sponsor Fair — IMC + MLH" }],
    location: "Tech L168",
  },
  {
    time: "8:30 - 10:00 AM",
    event: [{ content: "Sponsor Fair — Claude + Redbull" }],
    location: "Tech L170",
  },
  {
    time: "10:00 - 11:00 AM",
    event: [{ content: "Opening Ceremony", bold: true }],
    location: "LR2",
  },
  {
    time: "10:00 - 11:00 AM",
    event: [{ content: "Zoom Overflow" }],
    location: "LR4",
  },
  {
    time: "11:00 AM",
    event: [{ content: "Hacking Starts", bold: true }],
  },
  {
    time: "11:00 - 11:30 AM",
    event: [{ content: "Team Formation Event" }],
    location: "LR2",
  },
  {
    time: "12:30 PM",
    event: [
      { content: "Lunch", href: "/guide/logistics/food-and-drinks#saturday-lunch-from-tomate" },
      { content: " from Tomate Fresh Kitchen" },
    ],
    location: "Mudd 1st Floor",
  },
  {
    time: "1:00 - 5:00 PM",
    event: [{ content: "Mentors Block 1" }],
    location: "Mudd 2nd Floor",
  },
  {
    time: "1:30 - 2:15 PM",
    event: [{ content: "Finding Your Path in Tech with Women in Computing" }],
    location: "LR5",
  },
  {
    time: "3:15 - 3:45 PM",
    event: [{ content: "GitHub Copilot Session" }],
    location: "LR5",
  },
  {
    time: "3:45 - 4:30 PM",
    event: [{ content: "Google AI Studio" }],
    location: "LR5",
  },
  // {
  //   time: "12:45 PM",
  //   event: [
  //     { content: "(Optional) " },
  //     {
  //       content: "Tech Together Meet Up: Full Stack with Python",
  //       href: "/guide/workshops#women-in-computing-full-stack-with-python-mlh-techtogether-event",
  //     },
  //   ],
  //   location: "Tech M164",
  // },
  // {
  //   time: "2:30 PM",
  //   event: [
  //     { content: "(Optional) " },
  //     {
  //       content: "MLH GitHub Co-Pilot Workshop",
  //       href: "/guide/workshops#making-better-hacks-faster-using-github-copilot",
  //     },
  //   ],
  //   location: "Tech L160",
  // },
  {
    time: "5:00 - 9:00 PM",
    event: [{ content: "Mentors Block 2" }],
    location: "Mudd 2nd Floor",
  },
  {
    time: "6:30 PM",
    event: [
      { content: "Dinner", href: "/guide/logistics/food-and-drinks#saturday-dinner-from-papa-johns-pizza" },
      { content: " from Papa John's Pizza" },
    ],
    location: "Mudd 1st Floor",
  },
  // {
  //   time: "8:30 PM - 9:30 PM",
  //   event: [
  //     { content: "(Social Event) " },
  //     {
  //       content: "!Light Event with MLH",
  //       href: "https://guide.mlh.io/organizer-resources/host-exciting-mini-events/mlh-mini-events/light",
  //     },
  //   ],
  //   location: "Tech L3",
  // },
  // {
  //   time: "10:00 PM - 12:00 AM",
  //   event: [{ content: "(Social Event) Movie Night!" }],
  //   location: "Tech L3",
  // },
];

export const sundayScheduleRows: DayScheduleRow[] = [
  {
    time: "12:00 AM",
    event: [
      { content: "Midnight Snack", href: "/guide/logistics/food-and-drinks#midnight-snack-from-insomnia-cookies" },
      { content: " from Insomnia Cookies" },
    ],
    location: "Mudd 2nd Floor",
  },
  {
    time: "6:15 AM",
    event: [{ content: "Sunrise Walk Around the Lakefill" }],
    location: "Meet in Mudd 1st Floor",
  },
  {
    time: "8:30 AM",
    event: [
      { content: "Breakfast", href: "/guide/logistics/food-and-drinks#sunday-breakfast-from-einstein-bros-bagels" },
      { content: " from Einstein Bros. Bagels" },
    ],
    location: "Mudd 1st Floor",
  },
  {
    time: "10:30 - 12:15 PM",
    event: [{ content: "Blanket Donation" }],
    location: "Mudd 2nd Floor",
  },
  {
    id: "submission-deadline",
    time: "11:00 AM",
    event: [
      { content: "Submissions", href: "/guide/project-guidelines/submission" },
      { content: " Due and Hacking Ends", bold: true },
    ],
    highlight: "deadline",
  },
  {
    time: "11:00 - 12:15 PM",
    event: [{ content: "Games! (+ T-Shirt Distribution)" }],
    location: "Tech LR2",
  },
  {
    time: "11:00 - 12:15 PM",
    event: [{ content: "Scavenger Hunt Check In" }],
    location: "Mudd 2nd Floor",
  },
  {
    time: "11:15 - 1:15 PM",
    event: [
      {
        content: "Round 1 of Track Judging",
        href: "/guide/judging-and-awards/how-judging-works#round-1---initial-judging",
      },
    ],
    location: "LR5",
  },
  {
    time: "12:30 PM",
    event: [
      { content: "Lunch", href: "/guide/logistics/food-and-drinks#sunday-lunch-from-10q-chicken" },
      { content: " from 10Q Chicken" },
    ],
    location: "Mudd 1st Floor",
  },
  {
    id: "second-round-judging",
    time: "2:00 - 3:30 PM",
    event: [
      {
        content: "Round 2 of Track Judging",
        href: "/guide/judging-and-awards/how-judging-works#round-2---live-presentations",
      },
    ],
    location: "Tech LR4 + LR5",
  },
  {
    id: "crowd-favorite-sign-up",
    time: "2:00 PM",
    event: [
      {
        content: "Crowd Favorite Sign Up Deadline (In the Dashboard!)",
        // href: "Coming Soon!",
      },
    ],
  },
  {
    id: "crowd-favorite-presentations",
    time: "2:00 - 3:30 PM",
    event: [
      {
        content: "Crowd Favorite",
        href: "/guide/judging-and-awards/how-judging-works#crowd-favorite",
      },
      { content: " Presentations" },
    ],
    location: "LR5",
  },
  {
    time: "3:45 - 5:00 PM",
    event: [{ content: "Closing Ceremony", bold: true }],
    location: "LR2",
  },
];
