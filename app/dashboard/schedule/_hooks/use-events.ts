"use client";

import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

import { db } from "@/config/firebase-client";
import { EVENTS_COLLECTION } from "@/constants";
import type { UseFiltersReturn } from "@/hooks";

import { EVENT_FIELDS } from "../constants";
import type { CalendarDay, Event, EventCategory } from "../types";

export type UseEventsSettings = {
  category?: UseFiltersReturn<EventCategory>["category"];
  search?: UseFiltersReturn<EventCategory>["search"];
  selectedDay?: CalendarDay;
  limitCount?: number;
};

export type UseEventsReturn = {
  events: Event[];
  isLoading: boolean;
};

export const useEvents = (settings: UseEventsSettings): UseEventsReturn => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { category, search, selectedDay, limitCount } = settings;

  useEffect(() => {
    let q = query(collection(db, EVENTS_COLLECTION), orderBy(EVENT_FIELDS.start_time, "asc"));

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as Event
        );

        setAllEvents(docs);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching events:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [limitCount]);

  const events = useMemo(() => {
    let result = allEvents;

    if (category && category !== "all") {
      result = result.filter((event) => event.category === category);
    }

    if (search && search !== "") {
      const searchLower = search.toLowerCase();
      result = result.filter((event) => {
        return (
          event.title.toLowerCase().includes(searchLower) ||
          event.body.toLowerCase().includes(searchLower) ||
          event.category.toLowerCase().includes(searchLower)
        );
      });
    }

    if (selectedDay) {
      result = result.filter((event) => event.start_time >= selectedDay.startMs && event.end_time <= selectedDay.endMs);
    }

    return result;
  }, [allEvents, category, search, selectedDay]);

  return { events, isLoading };
};
