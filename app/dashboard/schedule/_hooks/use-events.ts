"use client";

import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

import { EVENT_FIELDS } from "@/app/dashboard/schedule/_constants/event.constant";
import type { Event, EventCategory } from "@/app/dashboard/schedule/_types";
import { db } from "@/config/firebase-client";
import { EVENTS_COLLECTION } from "@/constants/db";
import { UseFiltersReturn } from "@/hooks/use-filters";

export type UseEventsSettings = {
  category?: UseFiltersReturn<EventCategory>["category"];
  search?: UseFiltersReturn<EventCategory>["search"];
  limitCount?: number;
};

export type UseEventsReturn = {
  events: Event[];
  isLoading: boolean;
};

export const useEvents = (settings: UseEventsSettings): UseEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { category, search, limitCount } = settings;

  useEffect(() => {
    let q = query(collection(db, EVENTS_COLLECTION), orderBy(EVENT_FIELDS.start, "asc"));

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

        setEvents(docs);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching events:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [limitCount]);

  const filteredEvents = useMemo(() => {
    let result = events;

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

    return result;
  }, [events, category, search]);

  return { events: filteredEvents, isLoading };
};
