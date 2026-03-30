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
  // {
  //   date: "April 2, 2026",
  //   time: "6:00 PM - 7:00 PM",
  //   event: [
  //     { content: "Emerging Coders", href: "/guide/workshops#emerging-coders-web-development" },
  //     { content: ": Web Development" },
  //   ],
  //   location: "Tech LR5",
  // },
  // {
  //   date: "April 2, 2026",
  //   time: "7:00 PM - 8:00 PM",
  //   event: [
  //     { content: "ColorStack", href: "/guide/workshops#colorstack-introduction-to-python" },
  //     { content: ": Introduction to Python" },
  //   ],
  //   location: "Mudd 3514",
  // },
  // {
  //   date: "April 3, 2026",
  //   time: "6:00 PM - 7:00 PM",
  //   event: [{ content: "DISC", href: "/guide/workshops#disc-react" }, { content: ": React" }],
  //   location: "Tech L168",
  // },
  // {
  //   date: "April 3, 2026",
  //   time: "7:00 PM - 8:00 PM",
  //   event: [{ content: "IEEE", href: "/guide/workshops#ieee-github" }, { content: ": GitHub" }],
  //   location: "Tech M177",
  // },
  // {
  //   date: "April 4, 2026",
  //   time: "5:00 PM - 6:00 PM",
  //   event: [
  //     {
  //       content: "Locket Cybersecurity",
  //       href: "/guide/workshops#locket-cybersecurity-introduction-to-cybersecurity",
  //     },
  //     { content: ": Introduction to Cybersecurity" },
  //   ],
  //   location: "Tech L221",
  // },
  // {
  //   date: "April 4, 2026",
  //   time: "6:00 PM - 7:00 PM",
  //   event: [
  //     { content: "Women in Computing", href: "/guide/workshops#women-in-computing-github" },
  //     { content: ": GitHub" },
  //   ],
  //   location: "Tech M152",
  // },
  // {
  //   date: "April 11, 2026",
  //   time: "12:45 PM - 1:30 PM",
  //   event: [
  //     {
  //       content: "Women in Computing",
  //       href: "/guide/workshops#women-in-computing-full-stack-with-python-mlh-techtogether-event",
  //     },
  //     { content: ": Full Stack with Python" },
  //   ],
  //   location: "Tech M164",
  // },
  // {
  //   date: "April 11, 2026",
  //   time: "2:30 PM - 3:30 PM",
  //   event: [
  //     { content: "MLH", href: "/guide/workshops#making-better-hacks-faster-using-github-copilot" },
  //     { content: ": Making Better Hacks, Faster, Using GitHub Copilot!" },
  //   ],
  //   location: "Tech L160",
  // },
];

export const saturdayScheduleRows: DayScheduleRow[] = [
  {
    time: "8:30 AM - 10:00 AM",
    event: [{ content: "Check-In", href: "/guide/logistics/checking-in" }],
    location: "Front of LR2",
  },
  {
    time: "8:30 AM - 10:00 AM",
    event: [{ content: "Sponsor Expo" }],
    location: "Tech M120",
  },
  {
    time: "10:00 AM - 11:00 AM",
    event: [{ content: "Opening Ceremony", bold: true }],
    location: "LR2",
  },
  {
    time: "11:00 AM",
    event: [{ content: "Hacking Starts", bold: true }],
  },
  {
    time: "11:00 AM - 11:30 AM",
    event: [{ content: "Team Formation Event" }],
    location: "LR4",
  },
  {
    time: "12:30 PM",
    event: [
      { content: "Lunch", href: "/guide/logistics/food-and-drinks#saturday-lunch-from-tomate" },
      { content: " from Tomate Fresh Kitchen" },
    ],
    location: "Mudd 1st Floor",
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
    time: "6:00 AM",
    event: [{ content: "Sunrise Walk Around the Lakefill" }],
    location: "Lakefill",
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
    id: "submission-deadline",
    time: "11:00 AM",
    event: [
      { content: "Submissions", href: "/guide/project-guidelines/submission" },
      { content: " Due and Hacking Ends", bold: true },
    ],
    highlight: "deadline",
  },
  {
    id: "crowd-favorite-sign-up",
    time: "11:00 AM",
    event: [
      {
        content: "Crowd Favorite Sign Up Deadline (Link Coming Soon!)",
        // href: "Coming Soon!",
      },
    ],
  },
  {
    time: "11:15 AM - 1:15 PM",
    event: [
      {
        content: "Round 1 of Track Judging",
        href: "/guide/judging-and-awards/how-judging-works#round-1---initial-judging",
      },
    ],
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
    time: "2:00 PM - 3:30 PM",
    event: [
      {
        content: "Round 2 of Track Judging",
        href: "/guide/judging-and-awards/how-judging-works#round-2---live-presentations",
      },
    ],
    location: "To Be Announced Per Team",
  },
  {
    id: "crowd-favorite-presentations",
    time: "2:00 PM - 3:30 PM",
    event: [
      {
        content: "Crowd Favorite",
        href: "/guide/judging-and-awards/how-judging-works#crowd-favorite",
      },
      { content: " Presentations" },
    ],
    location: "LR4",
  },
  {
    time: "3:45 PM - 5:00 PM",
    event: [{ content: "Closing Keynote Speaker and Ceremony", bold: true }],
    location: "LR2",
  },
];
