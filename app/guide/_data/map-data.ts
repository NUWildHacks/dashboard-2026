import type { InlineSegment } from "../types";

type MapRow = {
  readonly name: InlineSegment[];
  readonly location: InlineSegment[];
  readonly description: string;
};

const text = (content: string): InlineSegment[] => [{ content }];

export const saturdaySpaces: MapRow[] = [
  {
    name: text("LR2"),
    location: [
      {
        content: "Tech LR2",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=L171&room-floor=1&room-id=789&room-ingress=",
      },
    ],
    description: "Opening Ceremony",
  },
  {
    name: text("Sponsor Fair"),
    location: [
      {
        content: "Tech L170",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=L170&room-floor=1&room-id=788&room-ingress=",
      },
    ],
    description: "Sponsor Fair",
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
  },
  {
    name: text("General Collaboration"),
    location: text("Mudd 3rd Floor"),
    description: "Collaboration and Overnight Space",
  },
  {
    name: text("Collaboration 1"),
    location: text("Mudd 3001"),
    description: "Collaboration and Overnight Space",
  },
  {
    name: text("Collaboration 2"),
    location: text("Mudd 3108"),
    description: "Collaboration and Overnight Space",
  },
  {
    name: text("Collaboration 3"),
    location: text("Mudd 3501"),
    description: "Collaboration and Overnight Space",
  },
  {
    name: text("Collaboration 4"),
    location: text("Mudd 3514"),
    description: "Collaboration and Overnight Space",
  },
  {
    name: text("Collaboration 5"),
    location: [
      {
        content: "Tech M166",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=M166&room-floor=1&room-id=876&room-ingress=",
      },
    ],
    description: "Collaboration Space",
  },
  {
    name: text("Collaboration 6"),
    location: [
      {
        content: "Tech LG52",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=LG52&room-floor=0&room-id=850&room-ingress=",
      },
    ],
    description: "Collaboration Space",
  },
  {
    name: text("Collaboration 7"),
    location: [
      {
        content: "Tech LG62",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=LG62&room-floor=0&room-id=853&room-ingress=",
      },
    ],
    description: "Collaboration Space",
  },
  {
    name: text("Collaboration 8"),
    location: [
      {
        content: "Tech LG68",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=LG68&room-floor=0&room-id=1062&room-ingress=",
      },
    ],
    description: "Collaboration Space",
  },
  {
    name: text("Collaboration 9"),
    location: [
      {
        content: "Tech LG72",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=LG72&room-floor=0&room-id=857&room-ingress=",
      },
    ],
    description: "Collaboration Space",
  },
  {
    name: text("Collaboration 10"),
    location: [
      {
        content: "Tech MG28",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=MG28&room-floor=0&room-id=971&room-ingress=",
      },
    ],
    description: "Collaboration Space",
  },
];

export const sundaySpaces: MapRow[] = [
  {
    name: text("Auditorium"),
    location: [
      {
        content: "Tech Aud",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=L165&room-floor=1&room-id=1055&room-ingress=",
      },
    ],
    description: "Closing Ceremony",
  },
  {
    name: text("Crowd Favorite"),
    location: [
      {
        content: "Tech LR2",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=L171&room-floor=1&room-id=789&room-ingress=",
      },
    ],
    description: "Crowd Favorite",
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
  },
  {
    name: text("Collaboration 2"),
    location: text("Mudd 3108"),
    description: "Collaboration Space",
  },
  {
    name: text("Collaboration 3"),
    location: text("Mudd 3501"),
    description: "Collaboration Space",
  },
  {
    name: text("Collaboration 4"),
    location: text("Mudd 3514"),
    description: "Collaboration Space",
  },
  {
    name: text("Collaboration 5"),
    location: [
      {
        content: "Tech M152",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=M152&room-floor=1&room-id=872&room-ingress=",
      },
    ],
    description: "Collaboration Space",
  },
  {
    name: text("Collaboration 6"),
    location: [
      {
        content: "Tech M166",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=M166&room-floor=1&room-id=876&room-ingress=",
      },
    ],
    description: "Collaboration Space",
  },
  {
    name: text("Collaboration 7"),
    location: [
      {
        content: "Tech LG52",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=LG52&room-floor=0&room-id=850&room-ingress=",
      },
    ],
    description: "Collaboration Space",
  },
  {
    name: text("Collaboration 8"),
    location: [
      {
        content: "Tech LG62",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=LG62&room-floor=0&room-id=853&room-ingress=",
      },
    ],
    description: "Collaboration Space",
  },
  {
    name: text("Collaboration 9"),
    location: [
      {
        content: "Tech LG68",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=LG68&room-floor=0&room-id=1062&room-ingress=",
      },
    ],
    description: "Collaboration Space",
  },
  {
    name: text("Collaboration 10"),
    location: [
      {
        content: "Tech LG72",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=LG72&room-floor=0&room-id=857&room-ingress=",
      },
    ],
    description: "Collaboration Space",
  },
  {
    name: text("Collaboration 11"),
    location: [
      {
        content: "Tech L170",
        href: "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=L170&room-floor=1&room-id=788&room-ingress=",
      },
    ],
    description: "Collaboration Space",
  },
];
