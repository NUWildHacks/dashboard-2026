"use client";

import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "@/config/firebase-client";
import { ANNOUNCEMENTS_COLLECTION } from "@/constants/db";
import Announcement from "@/types/announcement";
import User from "@/types/user";

export type UseLiveAnnouncementsReturn = {
  announcements: Announcement[];
  isLoading: boolean;
};

export const useLiveAnnouncements = (userRole: User["role"], limitCount = 3): UseLiveAnnouncementsReturn => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let q = query(
      collection(db, ANNOUNCEMENTS_COLLECTION),
      where("audience", "array-contains", userRole),
      orderBy("created_at", "desc")
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
            }) as Announcement
        );

        setAnnouncements(docs);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching announcements:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userRole, limitCount]);

  return { announcements, isLoading };
};
