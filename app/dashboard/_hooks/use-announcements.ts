"use client";

import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

import { db } from "@/config/firebase-client";
import { ANNOUNCEMENTS_COLLECTION } from "@/constants/db";
import Announcement from "@/types/announcement";
import User from "@/types/user";

import { AnnouncementCategoryWithAll } from "../announcements/_hooks/use-announcement-filters";

export type UseAnnouncementsReturn = {
  announcements: Announcement[];
  isLoading: boolean;
};

export type UseAnnouncementsSettings = {
  category?: AnnouncementCategoryWithAll;
  search?: string;
  limitCount?: number;
};

export const useAnnouncements = (
  userRole: User["role"],
  settings: UseAnnouncementsSettings
): UseAnnouncementsReturn => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { category, search, limitCount } = settings;

  useEffect(() => {
    let q = query(
      collection(db, ANNOUNCEMENTS_COLLECTION),
      where("audience", "array-contains", userRole),
      orderBy("created_at", "desc")
    );

    if (category && category !== "all") {
      q = query(
        collection(db, ANNOUNCEMENTS_COLLECTION),
        where("audience", "array-contains", userRole),
        where("category", "==", category),
        orderBy("created_at", "desc")
      );
    }

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
  }, [userRole, category, limitCount]);

  const filteredAnnouncements = useMemo(() => {
    if (!search || search === "") {
      return announcements;
    }

    return announcements.filter((announcement) => {
      const searchLower = search.toLowerCase();

      return (
        announcement.title.toLowerCase().includes(searchLower) ||
        announcement.body.toLowerCase().includes(searchLower) ||
        announcement.links.some((link) => link.toLowerCase().includes(searchLower))
      );
    });
  }, [search, announcements]);

  return { announcements: filteredAnnouncements, isLoading };
};
