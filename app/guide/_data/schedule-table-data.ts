import type { InlineSegment } from "../types";

export type WorkshopWeekRow = {
  date: string;
  time: string;
  event: InlineSegment[];
  location: string;
};

export type DayScheduleRow = {
  time: string;
  event: InlineSegment[];
  location?: string;
  highlight?: "deadline";
};

export const workshopWeekRows: WorkshopWeekRow[] = [
  {
    date: "April 2, 2026",
    time: "6:00 PM - 7:00 PM",
    event: [
      { content: "Emerging Coders", href: "/guide/workshops#emerging-coders-web-development" },
      { content: ": Web Development" },
    ],
    location: "Tech LR5",
  },
  {
    date: "April 2, 2026",
    time: "7:00 PM - 8:00 PM",
    event: [
      { content: "ColorStack", href: "/guide/workshops#colorstack-introduction-to-python" },
      { content: ": Introduction to Python" },
    ],
    location: "Mudd 3514",
  },
  {
    date: "April 3, 2026",
    time: "6:00 PM - 7:00 PM",
    event: [{ content: "DISC", href: "/guide/workshops#disc-react" }, { content: ": React" }],
    location: "Tech L168",
  },
  {
    date: "April 3, 2026",
    time: "7:00 PM - 8:00 PM",
    event: [{ content: "IEEE", href: "/guide/workshops#ieee-github" }, { content: ": GitHub" }],
    location: "Tech M177",
  },
  {
    date: "April 4, 2026",
    time: "5:00 PM - 6:00 PM",
    event: [
      {
        content: "Locket Cybersecurity",
        href: "/guide/workshops#locket-cybersecurity-introduction-to-cybersecurity",
      },
      { content: ": Introduction to Cybersecurity" },
    ],
    location: "Tech L221",
  },
  {
    date: "April 4, 2026",
    time: "6:00 PM - 7:00 PM",
    event: [
      { content: "Women in Computing", href: "/guide/workshops#women-in-computing-github" },
      { content: ": GitHub" },
    ],
    location: "Tech M152",
  },
  {
    date: "April 11, 2026",
    time: "12:45 PM - 1:30 PM",
    event: [
      {
        content: "Women in Computing",
        href: "/guide/workshops#women-in-computing-full-stack-with-python-mlh-techtogether-event",
      },
      { content: ": Full Stack with Python" },
    ],
    location: "Tech M164",
  },
  {
    date: "April 11, 2026",
    time: "2:30 PM - 3:30 PM",
    event: [
      { content: "MLH", href: "/guide/workshops#making-better-hacks-faster-using-github-copilot" },
      { content: ": Making Better Hacks, Faster, Using GitHub Copilot!" },
    ],
    location: "Tech L160",
  },
];

export const saturdayScheduleRows: DayScheduleRow[] = [
  {
    time: "9:00 AM - 10:00 AM",
    event: [{ content: "Check-In", href: "/guide/logistics/checking-in" }],
    location: "Front of LR2",
  },
  {
    time: "9:00 AM - 10:00 AM",
    event: [{ content: "Sponsor Expo" }],
    location: "Tech L170",
  },
  {
    time: "10:00 AM - 10:45 AM",
    event: [{ content: "Opening Ceremony", bold: true }],
    location: "LR2",
  },
  {
    time: "10:45 AM",
    event: [{ content: "Hacking Starts", bold: true }],
  },
  {
    time: "10:45 AM - 11:15 AM",
    event: [{ content: "Team Formation Event" }],
    location: "Tech L160",
  },
  {
    time: "12:30 PM",
    event: [
      { content: "Lunch", href: "/guide/logistics/meal-options#saturday-lunch-from-tomate" },
      { content: " from Tomate Fresh Kitchen" },
    ],
    location: "Mudd 1st Floor",
  },
  {
    time: "12:45 PM",
    event: [
      { content: "(Optional) " },
      {
        content: "Tech Together Meet Up: Full Stack with Python",
        href: "/guide/workshops#women-in-computing-full-stack-with-python-mlh-techtogether-event",
      },
    ],
    location: "Tech M164",
  },
  {
    time: "2:30 PM",
    event: [
      { content: "(Optional) " },
      {
        content: "MLH GitHub Co-Pilot Workshop",
        href: "/guide/workshops#making-better-hacks-faster-using-github-copilot",
      },
    ],
    location: "Tech L160",
  },
  {
    time: "6:30 PM",
    event: [
      { content: "Dinner", href: "/guide/logistics/meal-options#saturday-dinner-from-papa-johns-pizza" },
      { content: " from Papa John's Pizza" },
    ],
    location: "Mudd 1st Floor",
  },
  {
    time: "8:30 PM - 9:30 PM",
    event: [
      { content: "(Social Event) " },
      {
        content: "!Light Event with MLH",
        href: "https://guide.mlh.io/organizer-resources/host-exciting-mini-events/mlh-mini-events/light",
      },
    ],
    location: "Tech L3",
  },
  {
    time: "10:00 PM - 12:00 AM",
    event: [{ content: "(Social Event) Movie Night!" }],
    location: "Tech L3",
  },
];

export const sundayScheduleRows: DayScheduleRow[] = [
  {
    time: "9:30 AM",
    event: [
      { content: "Breakfast", href: "/guide/logistics/meal-options#sunday-breakfast-from-einstein-bros-bagels" },
      { content: " from Einstein Bros. Bagels" },
    ],
    location: "Mudd 1st Floor",
  },
  {
    time: "12:00 PM",
    event: [
      {
        content: "Crowd Favorite Sign Up Deadline",
        href: "https://docs.google.com/forms/d/e/1FAIpQLSdwWrmkcKbn_u0COXQt8rwsjepOIDNPRFnnHTIMcFCVKKHwFA/viewform?usp=sf_link",
      },
    ],
  },
  {
    time: "12:30 PM",
    event: [
      { content: "Lunch", href: "/guide/logistics/meal-options#sunday-lunch-from-10q-chicken" },
      { content: " from 10Q Chicken" },
    ],
    location: "Mudd 1st Floor",
  },
  {
    time: "1:00 PM",
    event: [
      { content: "Submissions", href: "/guide/project-guidelines/submission" },
      { content: " Due and Hacking Ends", bold: true },
    ],
    highlight: "deadline",
  },
  {
    time: "1:45 PM - 2:30 PM",
    event: [
      {
        content: "Round 1 of Track Judging",
        href: "/guide/judging-and-awards/how-judging-works#round-1---initial-judging",
      },
    ],
  },
  {
    time: "1:45 PM - 2:30 PM",
    event: [
      {
        content: "Crowd Favorite",
        href: "/guide/judging-and-awards/how-judging-works#crowd-favorite",
      },
      { content: " Presentations" },
    ],
    location: "LR2",
  },
  {
    time: "2:45 PM - 4:15 PM",
    event: [
      {
        content: "Round 2 of Track Judging",
        href: "/guide/judging-and-awards/how-judging-works#round-2---live-presentations",
      },
    ],
    location: "Tech Auditorium",
  },
  {
    time: "4:30 PM - 5:00 PM",
    event: [{ content: "Closing Ceremony", bold: true }],
    location: "Tech Auditorium",
  },
];
