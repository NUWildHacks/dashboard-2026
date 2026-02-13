"use client";

import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { db } from "@/config/firebase-client";
import { ANNOUNCEMENTS_COLLECTION } from "@/constants";
import type { UseFiltersReturn } from "@/hooks";

import { deleteAnnouncement } from "../_actions";
import { ANNOUNCEMENT_FIELDS } from "../constants";
import type { AnnouncementCategory, Announcement } from "../types";

export type UseAnnouncementsSettings = {
  category?: UseFiltersReturn<AnnouncementCategory>["category"];
  search?: UseFiltersReturn<AnnouncementCategory>["search"];
  limitCount?: number;
};

export type UseAnnouncementsReturn = {
  announcements: Announcement[];
  isLoading: boolean;
  handleDeleteAnnouncements: (announcementIds: Announcement["id"][]) => Promise<void>;
};

export const useAnnouncements = (settings: UseAnnouncementsSettings): UseAnnouncementsReturn => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { category, search, limitCount } = settings;

  useEffect(() => {
    let q = query(collection(db, ANNOUNCEMENTS_COLLECTION), orderBy(ANNOUNCEMENT_FIELDS.created_at, "desc"));

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
  }, [limitCount]);

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

  const handleDeleteAnnouncements = async (announcementIds: Announcement["id"][]) => {
    try {
      const result = await deleteAnnouncement(announcementIds);
      const { success } = result;

      if (!success) {
        const { field, error } = result;

        if (!field) {
          throw new Error(error);
        }

        return;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Delete announcements error:", errorMessage);

      toast.error("Failed to delete announcements", { description: errorMessage });
    }
  };

  return { announcements: filteredAnnouncements, isLoading, handleDeleteAnnouncements };
};
