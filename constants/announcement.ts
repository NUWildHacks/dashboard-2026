import { Announcement } from "@/types/announcement";
import { Timestamp } from "firebase/firestore";

export const URGENT = "Urgent" as const;
export const SCHEDULE = "Schedule" as const;
export const FOOD = "Food" as const;
export const SOCIAL = "Social" as const;

export const CATEGORIES = [URGENT, SCHEDULE, FOOD, SOCIAL] as const;

export const announcements: Announcement[] = [
  {
    id: "1",
    category: "Food",
    title: "Food Title",
    body: "Food Body",
    links: [],
    author: "Food Author",
    audience: ["Participant"],
    created_at: Timestamp.fromDate(new Date()),
  },
  {
    id: "2",
    category: "Social",
    title: "Social Title",
    body: "Social Body",
    links: [],
    author: "Social Author",
    audience: ["Participant"],
    created_at: Timestamp.fromDate(new Date()),
  },
  {
    id: "3",
    category: "Urgent",
    title: "Urgent Title",
    body: "Urgent Body",
    links: [],
    author: "Urgent Author",
    audience: ["Participant"],
    created_at: Timestamp.fromDate(new Date()),
  },
];

