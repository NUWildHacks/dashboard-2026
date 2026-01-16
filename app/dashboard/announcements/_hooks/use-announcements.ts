"use client";

import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

import { ANNOUNCEMENT_FIELDS } from "@/app/dashboard/announcements/_constants";
import type { Announcement, AnnouncementCategory } from "@/app/dashboard/announcements/_types";
import { db } from "@/config/firebase-client";
import { ANNOUNCEMENTS_COLLECTION } from "@/constants";
import type { UseFiltersReturn } from "@/hooks";
import type { User } from "@/types";

export type UseAnnouncementsSettings = {
  category?: UseFiltersReturn<AnnouncementCategory>["category"];
  search?: UseFiltersReturn<AnnouncementCategory>["search"];
  limitCount?: number;
};

export type UseAnnouncementsReturn = {
  announcements: Announcement[];
  isLoading: boolean;
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
      where(ANNOUNCEMENT_FIELDS.audience, "array-contains", userRole),
      orderBy(ANNOUNCEMENT_FIELDS.created_at, "desc")
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

  const filteredAnnouncements = useMemo(() => {
    let result = announcements;

    if (category && category !== "all") {
      result = result.filter((announcement) => announcement.category === category);
    }

    if (search && search !== "") {
      const searchLower = search.toLowerCase();
      result = result.filter((announcement) => {
        return (
          announcement.title.toLowerCase().includes(searchLower) ||
          announcement.body.toLowerCase().includes(searchLower) ||
          announcement.category.toLowerCase().includes(searchLower) ||
          announcement.links.some((link) => link.toLowerCase().includes(searchLower))
        );
      });
    }

    return result;
  }, [announcements, category, search]);

  return { announcements: filteredAnnouncements, isLoading };
};
