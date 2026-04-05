"use server";

import { getFirestore } from "firebase-admin/firestore";
import { cache } from "react";

import { PARTICIPANT, JUDGE, JUDGE_AND_MENTOR, ADMIN } from "@/constants";
import { PROJECTS_COLLECTION, USERS_COLLECTION } from "@/constants/db.constants";
import type { WildHacksStatistics } from "@/types";

/**
 * Calculate statistics by counting documents in Firestore.
 * Uses admin SDK for efficient queries and caches results for 30 seconds.
 *
 * @returns Promise resolving to WildHacksStatistics object
 * @example
 * ```ts
 * const stats = await calculateStatistics();
 * console.log(stats.participants, stats.projects);
 * ```
 */
export const calculateStatistics = cache(async (): Promise<WildHacksStatistics> => {
  const db = getFirestore();

  const [usersSnapshot, projectsSnapshot] = await Promise.all([
    db.collection(USERS_COLLECTION).get(),
    db.collection(PROJECTS_COLLECTION).get(),
  ]);

  let participants = 0;
  let judges = 0;
  let mentors = 0;
  let admins = 0;

  usersSnapshot.forEach((doc) => {
    const userData = doc.data();
    const role = userData.role;

    if (role === PARTICIPANT) {
      participants++;
    } else if (role === JUDGE) {
      judges++;
    } else if (role === JUDGE_AND_MENTOR) {
      mentors++;
    } else if (role === ADMIN) {
      admins++;
    }
  });

  const projects = projectsSnapshot.size;

  let submissions = 0;
  projectsSnapshot.forEach((doc) => {
    const projectData = doc.data();
    if (projectData.submitted_at != null) {
      submissions++;
    }
  });

  return {
    participants,
    judges,
    mentors,
    admins,
    projects,
    submissions,
  };
});
