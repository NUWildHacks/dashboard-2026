"use server";

import { getFirestore } from "firebase-admin/firestore";

import {
  TEAM_MATCHING_INTAKE_COLLECTION,
  TEAM_MATCHING_RUNS_COLLECTION,
  TEAM_MATCHING_SETTINGS_DOC,
  TEAM_MATCHING_TEAMS_COLLECTION,
  USERS_COLLECTION,
  WILDHACKS_COLLECTION,
} from "@/constants";
import type { IntakeRecord, MatchedTeam, TeamMatchingRun, TeamMatchingSettings } from "@/types";
import { DEFAULT_TEAM_MATCHING_SETTINGS } from "@/types";

export type IntakeEntry = IntakeRecord & { submitted_at: number };

export const getIntakeEntries = async (): Promise<IntakeEntry[]> => {
  const db = getFirestore();
  const snaps = await db.collection(TEAM_MATCHING_INTAKE_COLLECTION).get();

  // Fetch display names
  const userIds = snaps.docs.map((d) => d.id);
  const userRefs = userIds.map((id) => db.collection(USERS_COLLECTION).doc(id));
  const userDocs = userRefs.length > 0 ? await db.getAll(...userRefs) : [];
  const nameMap = new Map(
    userDocs.map((doc) => [
      doc.id,
      doc.exists ? `${doc.data()?.first_name ?? ""} ${doc.data()?.last_name ?? ""}`.trim() : "Unknown",
    ])
  );

  return snaps.docs.map((doc) => {
    const d = doc.data();
    return {
      user_id: doc.id,
      name: nameMap.get(doc.id) ?? "Unknown",
      experience_level: d.experience_level ?? "beginner",
      preferred_roles: d.preferred_roles ?? [],
      skills: d.skills ?? {},
      work_style: d.work_style ?? "in_between",
      preferred_team_size: d.preferred_team_size ?? 4,
      required_teammates: d.required_teammates ?? [],
      additional_notes: d.additional_notes ?? "",
      gender_preference: d.gender_preference ?? "no_preference",
      where_staying: d.where_staying ?? "unsure",
      submitted_at: d.created_at ?? 0,
    };
  });
};

export const getRuns = async (): Promise<TeamMatchingRun[]> => {
  const db = getFirestore();
  const snaps = await db.collection(TEAM_MATCHING_RUNS_COLLECTION).orderBy("run_at", "desc").get();
  return snaps.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as TeamMatchingRun);
};

export const getRunTeams = async (runId: string): Promise<MatchedTeam[]> => {
  const db = getFirestore();
  const snaps = await db.collection(TEAM_MATCHING_TEAMS_COLLECTION).where("run_id", "==", runId).get();
  return snaps.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as MatchedTeam)
    .sort((a, b) => b.score - a.score);
};

export const getSettings = async (): Promise<TeamMatchingSettings> => {
  const db = getFirestore();
  const snap = await db.collection(WILDHACKS_COLLECTION).doc(TEAM_MATCHING_SETTINGS_DOC).get();
  return snap.exists ? (snap.data() as TeamMatchingSettings) : DEFAULT_TEAM_MATCHING_SETTINGS;
};
