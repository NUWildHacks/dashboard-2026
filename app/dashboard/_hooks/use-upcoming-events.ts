"use client"

import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "@/config/firebase-client";
import { EVENTS_COLLECTION } from "@/constants/db";
import Event from "@/types/events"

export type UseUpcomingEventsReturn = {
  events: Event[];
  isLoading: boolean;
}

export const useUpcomingEvents = (limitCount = 3): UseUpcomingEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let q = query(
      collection(db, EVENTS_COLLECTION),
      orderBy("start", "asc")
    );
    
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

        setEvents(docs)
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching events:", error);
        setIsLoading(false);
      }
    )

    return () => unsubscribe();
  }, [limitCount])

  return { events, isLoading }
}
