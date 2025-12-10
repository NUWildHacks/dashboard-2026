"use client";

import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

import { db } from "@/config/firebase-client";
import { ANNOUNCEMENTS_COLLECTION } from "@/constants/db";
import Announcement, { AnnouncementCategory } from "@/types/announcement";
import User from "@/types/user";

export type UseAnnouncementFiltersReturn = {
  category: AnnouncementCategory | "all";
  setCategory: (category: AnnouncementCategory | "all") => void;
  search: string;
  setSearch: (search: string) => void;
  filteredAnnouncements: Announcement[];
  isLoading: boolean;
};

export const useAnnouncementFilters = (userRole: User["role"]): UseAnnouncementFiltersReturn => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<AnnouncementCategory | "all">("all");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    let q = query(
      collection(db, ANNOUNCEMENTS_COLLECTION),
      where("audience", "array-contains", userRole),
      orderBy("created_at", "desc")
    );

    if (category !== "all") {
      q = query(
        collection(db, ANNOUNCEMENTS_COLLECTION),
        where("audience", "array-contains", userRole),
        where("category", "==", category),
        orderBy("created_at", "desc")
      );
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
  }, [userRole, category]);

  const filteredAnnouncements = useMemo(() => {
    if (search === "") {
      return announcements;
    }

    return announcements.filter((announcement) => {
      const searchLower = search.toLowerCase();

      return (
        announcement.title.toLowerCase().includes(searchLower) ||
        announcement.body.toLowerCase().includes(searchLower) ||
        announcement.author.toLowerCase().includes(searchLower) ||
        announcement.links.some((link) => link.toLowerCase().includes(searchLower))
      );
    });
  }, [search, announcements]);

  return {
    category,
    setCategory,
    search,
    setSearch,
    filteredAnnouncements,
    isLoading,
  };
};
