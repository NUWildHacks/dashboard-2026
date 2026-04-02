import type { InlineSegment } from "../types";

type MapRow = {
  readonly name: InlineSegment[];
  readonly location: InlineSegment[];
  readonly description: string;
  readonly capacity?: string;
  readonly photoHref?: string;
  readonly notes?: string;
};

const text = (content: string): InlineSegment[] => [{ content }];

export const saturdaySpaces: MapRow[] = [
  {
    name: text("LR2"),
    location: [
      {
        content: "Tech LR2",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=Lr2&room-floor=1&room-id=789&room-ingress=",
      },
    ],
    description: "Opening Ceremony",
    capacity: "284",
    notes: "Main stage room for opening ceremony.",
  },
  {
    name: text("Tech A110"),
    location: [
      {
        content: "Tech A110",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=A110&room-floor=1&room-id=3&room-ingress=",
      },
    ],
    description: "Overflow room for Opening Ceremony",
    capacity: "43",
    notes: "Ensure you arrive early to Opening Ceremony to claim a spot in the main room.",
  },
  {
    name: text("Sponsor Fair"),
    location: [
      {
        content: "Tech M120",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=M120&room-floor=1&room-id=867&room-ingress=",
      },
    ],
    description: "Sponsor Fair",
    capacity: "28",
    notes: "Drop in anytime during expo hours.",
  },
  {
    name: text("LR4"),
    location: [
      {
        content: "Tech LR4",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=M113&room-floor=1&room-id=863&room-ingress=",
      },
    ],
    description: "Team Formation Event",
    capacity: "91",
  },
  {
    name: text("Meals"),
    location: text("Mudd 1st Floor"),
    description: "Meal Distribution",
  },
  {
    name: text("Help Desk / WildSnacks"),
    location: text("Mudd 2nd Floor"),
    description: "Help Desk and Snacks",
    notes: "Organizer staffed area with snacks and supplies.",
  },
  {
    name: text("General Collaboration"),
    location: text("Mudd 3rd Floor"),
    description: "Collaboration and Overnight Space",
    notes: "Open collaboration zone; overnight use allowed.",
  },
  {
    name: text("Collaboration 1"),
    location: text("Mudd 3001"),
    description: "Collaboration and Overnight Space",
    // capacity: "TBD",
  },
  {
    name: text("Collaboration 2"),
    location: text("Mudd 3501"),
    description: "Collaboration and Overnight Space",
    // capacity: "TBD",
  },
  {
    name: text("Collaboration 3"),
    location: text("Mudd 3514"),
    description: "Collaboration and Overnight Space",
    // capacity: "TBD",
  },
  {
    name: text("Collaboration 4"),
    location: [
      {
        content: "Tech M166",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=M166&room-floor=1&room-id=876&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "21",
  },
  {
    name: text("Collaboration 5"),
    location: [
      {
        content: "Tech LG68",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=LG68&room-floor=0&room-id=850&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "23",
  },
  {
    name: text("Collaboration 6"),
    location: [
      {
        content: "Tech LG62",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=LG62&room-floor=0&room-id=853&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "20",
  },
  {
    name: text("Collaboration 7"),
    location: [
      {
        content: "Tech F280",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=F280&room-floor=2&room-id=1107&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "24",
  },
  {
    name: text("Collaboration 8"),
    location: [
      {
        content: "Tech LG72",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=LG72&room-floor=0&room-id=857&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "20",
  },
  {
    name: text("Collaboration 9"),
    location: [
      {
        content: "Tech MG28",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=MG28&room-floor=0&room-id=971&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "35",
  },
  {
    name: text("Collaboration 10"),
    location: [
      {
        content: "Tech F281",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=F281&room-floor=2&room-id=1108&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "28",
  },
  {
    name: text("Collaboration 11"),
    location: [
      {
        content: "Tech L211",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=L211&room-floor=2&room-id=792&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "168",
  },
  {
    name: text("Collaboration 12"),
    location: [
      {
        content: "Tech L221",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=L221&room-floor=2&room-id=796&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "43",
  },
  {
    name: text("Collaboration 13"),
    location: [
      {
        content: "Tech L251",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=L251&room-floor=2&room-id=800&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "55",
  },
  {
    name: text("Collaboration 14"),
    location: [
      {
        content: "Tech M177",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=M177&room-floor=1&room-id=877&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "40",
  },
  {
    name: text("Collaboration 15"),
    location: [
      {
        content: "Tech M128",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=M128&room-floor=1&room-id=867&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "40",
  },
  {
    name: text("Collaboration 16"),
    location: [
      {
        content: "Tech M120",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=M120&room-floor=1&room-id=867&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "28",
  },
  {
    name: text("Collaboration 17"),
    location: [
      {
        content: "Tech LG52",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=LG52&room-floor=0&room-id=850&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "36",
  },
  {
    name: text("Collaboration 18"),
    location: [
      {
        content: "Tech LG66",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=LG66&room-floor=0&room-id=855&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "35",
  },
  {
    name: text("Collaboration 19"),
    location: [
      {
        content: "Tech M338",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=M338&room-floor=3&room-id=933&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "22",
  },
  {
    name: text("Collaboration 20"),
    location: [
      {
        content: "Tech M345",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=M345&room-floor=3&room-id=935&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "100",
  },
  {
    name: text("Collaboration 21"),
    location: [
      {
        content: "Tech L158",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=L158&room-floor=1&room-id=785&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "21",
  },
];

export const sundaySpaces: MapRow[] = [
  {
    name: text("LR2"),
    location: [
      {
        content: "Tech LR2",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=Lr2&room-floor=1&room-id=789&room-ingress=",
      },
    ],
    description: "Closing Keynote Speaker and Ceremony",
    capacity: "284",
    notes: "Closing keynote speaker and ceremony venue.",
  },
  {
    name: text("Tech A110"),
    location: [
      {
        content: "Tech A110",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=A110&room-floor=1&room-id=3&room-ingress=",
      },
    ],
    description: "Overflow room for Closing Ceremony",
    capacity: "43",
    notes: "Ensure you arrive early to Closing Ceremony to claim a spot in the main room.",
  },
  {
    name: text("Crowd Favorite"),
    location: [
      {
        content: "Tech LR4",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=LR4&room-floor=1&room-id=863&room-ingress=",
      },
    ],
    description: "Crowd Favorite",
    capacity: "91",
    notes: "Public-facing demos for crowd voting.",
  },
  {
    name: text("Meals"),
    location: text("Mudd 1st Floor"),
    description: "Meal Distribution",
  },
  {
    name: text("Help Desk / WildSnacks"),
    location: text("Mudd 2nd Floor"),
    description: "Help Desk and Snacks",
    notes: "Organizer staffed area with snacks and supplies.",
  },
  {
    name: text("General Collaboration"),
    location: text("Mudd 3rd Floor"),
    description: "Collaboration Space",
  },
  {
    name: text("Collaboration 1"),
    location: text("Mudd 3001"),
    description: "Collaboration Space",
    // capacity: "TBD",
  },
  {
    name: text("Collaboration 2"),
    location: text("Mudd 3501"),
    description: "Collaboration Space",
    capacity: "TBD",
  },
  {
    name: text("Collaboration 3"),
    location: text("Mudd 3514"),
    description: "Collaboration Space",
    // capacity: "TBD",
  },
  {
    name: text("Collaboration 4"),
    location: [
      {
        content: "Tech M166",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=M166&room-floor=1&room-id=876&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "21",
  },
  {
    name: text("Collaboration 5"),
    location: [
      {
        content: "Tech LG52",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=LG52&room-floor=0&room-id=850&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "36",
  },
  {
    name: text("Collaboration 6"),
    location: [
      {
        content: "Tech LG62",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=LG62&room-floor=0&room-id=853&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "20",
  },
  {
    name: text("Collaboration 7"),
    location: [
      {
        content: "Tech LG68",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=LG68&room-floor=0&room-id=1062&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "23",
  },
  {
    name: text("Collaboration 8"),
    location: [
      {
        content: "Tech LG72",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=LG72&room-floor=0&room-id=857&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "20",
  },
  {
    name: text("Collaboration 9"),
    location: [
      {
        content: "Tech LG66",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=LG66&room-floor=0&room-id=855&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "35",
  },
  {
    name: text("Collaboration 10"),
    location: [
      {
        content: "Tech M128",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=M128&room-floor=1&room-id=867&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "40",
  },
  {
    name: text("Collaboration 11"),
    location: [
      {
        content: "Tech M120",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=M120&room-floor=1&room-id=867&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "28",
  },
  {
    name: text("Collaboration 12"),
    location: [
      {
        content: "Tech F280",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=F280&room-floor=2&room-id=1107&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "24",
  },
  {
    name: text("Collaboration 13"),
    location: [
      {
        content: "Tech F281",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=F281&room-floor=2&room-id=1108&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "28",
  },
  {
    name: text("Collaboration 14"),
    location: [
      {
        content: "Tech L211",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=L211&room-floor=2&room-id=792&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "168",
  },
  {
    name: text("Collaboration 15"),
    location: [
      {
        content: "Tech L221",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=L221&room-floor=2&room-id=796&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "43",
  },
  {
    name: text("Collaboration 16"),
    location: [
      {
        content: "Tech L251",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=L251&room-floor=2&room-id=800&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "55",
  },
  {
    name: text("Collaboration 17"),
    location: [
      {
        content: "Tech M177",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=M177&room-floor=1&room-id=877&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "40",
  },
  {
    name: text("Collaboration 18"),
    location: [
      {
        content: "Tech MG28",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=MG28&room-floor=0&room-id=971&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "35",
  },
  {
    name: text("Collaboration 19"),
    location: [
      {
        content: "Tech M338",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=M338&room-floor=3&room-id=933&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "22",
  },
  {
    name: text("Collaboration 20"),
    location: [
      {
        content: "Tech M345",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=M345&room-floor=3&room-id=935&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "100",
  },
  {
    name: text("Collaboration 21"),
    location: [
      {
        content: "Tech L160",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=L160&room-floor=1&room-id=786&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "30",
  },
  {
    name: text("Collaboration 22"),
    location: [
      {
        content: "Tech L168",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=L168&room-floor=1&room-id=786&room-ingress=",
      },
    ],
    description: "Collaboration Space",
    capacity: "25",
  },
];
