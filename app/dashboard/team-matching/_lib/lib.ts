"use server";

import { getFirestore } from "firebase-admin/firestore";

import {
  TEAM_MATCHING_FORMATIONS_COLLECTION,
  TEAM_MATCHING_FORMATIONS_COLLECTION_PROD,
  TEAM_MATCHING_INTAKE_COLLECTION,
  TEAM_MATCHING_INTAKE_COLLECTION_DEV,
  TEAM_MATCHING_RUNS_COLLECTION,
  TEAM_MATCHING_RUNS_COLLECTION_PROD,
  TEAM_MATCHING_SETTINGS_DOC,
  TEAM_MATCHING_TEAMS_COLLECTION,
  TEAM_MATCHING_TEAMS_COLLECTION_PROD,
  USERS_COLLECTION,
  WILDHACKS_COLLECTION,
} from "@/constants";
import type {
  IntakeRecord,
  MatchedTeam,
  TeamFormation,
  TeamMatchingMode,
  TeamMatchingRun,
  TeamMatchingSettings,
} from "@/types";
import { DEFAULT_TEAM_MATCHING_SETTINGS } from "@/types";

export type IntakeEntry = IntakeRecord & { submitted_at: number; required_teammate_names: string[] };

export const getIntakeEntries = async (mode: TeamMatchingMode = "dev"): Promise<IntakeEntry[]> => {
  const db = getFirestore();
  const collection = mode === "prod" ? TEAM_MATCHING_INTAKE_COLLECTION : TEAM_MATCHING_INTAKE_COLLECTION_DEV;
  const snaps = await db.collection(collection).get();

  const userIds = snaps.docs.map((d) => d.id);
  const userRefs = userIds.map((id) => db.collection(USERS_COLLECTION).doc(id));
  const userDocs = userRefs.length > 0 ? await db.getAll(...userRefs) : [];
  const nameMap = new Map(
    userDocs.map((doc) => [
      doc.id,
      doc.exists ? `${doc.data()?.first_name ?? ""} ${doc.data()?.last_name ?? ""}`.trim() : "Unknown",
    ])
  );
  const genderMap = new Map(
    userDocs.map((doc) => [doc.id, doc.exists ? (doc.data()?.gender as string | undefined) : undefined])
  );

  // Collect all required teammate IDs not already in nameMap
  const allRequiredIds = snaps.docs.flatMap((doc) => (doc.data().required_teammates ?? []) as string[]);
  const unknownIds = [...new Set(allRequiredIds)].filter((id) => !nameMap.has(id));
  if (unknownIds.length > 0) {
    const extraRefs = unknownIds.map((id) => db.collection(USERS_COLLECTION).doc(id));
    const extraDocs = await db.getAll(...extraRefs);
    for (const doc of extraDocs) {
      nameMap.set(
        doc.id,
        doc.exists ? `${doc.data()?.first_name ?? ""} ${doc.data()?.last_name ?? ""}`.trim() : "Unknown"
      );
    }
  }

  return snaps.docs.map((doc) => {
    const d = doc.data();
    const requiredTeammates: string[] = d.required_teammates ?? [];
    return {
      user_id: doc.id,
      name: nameMap.get(doc.id) ?? "Unknown",
      experience_level: d.experience_level ?? "beginner",
      preferred_roles: d.preferred_roles ?? [],
      skills: d.skills ?? {},
      work_style: d.work_style ?? "in_between",
      preferred_team_size: d.preferred_team_size ?? 4,
      required_teammates: requiredTeammates,
      required_teammate_names: requiredTeammates.map((id) => nameMap.get(id) ?? id),
      additional_notes: d.additional_notes ?? "",
      gender: genderMap.get(doc.id),
      gender_preference: d.gender_preference ?? "no_preference",
      where_staying: d.where_staying ?? "unsure",
      submitted_at: d.created_at ?? 0,
    };
  });
};

export const getRuns = async (mode: TeamMatchingMode = "dev"): Promise<TeamMatchingRun[]> => {
  const db = getFirestore();
  const collection = mode === "prod" ? TEAM_MATCHING_RUNS_COLLECTION_PROD : TEAM_MATCHING_RUNS_COLLECTION;
  const snaps = await db.collection(collection).orderBy("run_at", "desc").get();
  return snaps.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as TeamMatchingRun);
};

export const getRunTeams = async (runId: string, mode: TeamMatchingMode = "dev"): Promise<MatchedTeam[]> => {
  const db = getFirestore();
  const collection = mode === "prod" ? TEAM_MATCHING_TEAMS_COLLECTION_PROD : TEAM_MATCHING_TEAMS_COLLECTION;
  const snaps = await db.collection(collection).where("run_id", "==", runId).get();
  return snaps.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as MatchedTeam).sort((a, b) => b.score - a.score);
};

export const getRunFormations = async (runId: string, mode: TeamMatchingMode = "dev"): Promise<TeamFormation[]> => {
  const db = getFirestore();
  const collection = mode === "prod" ? TEAM_MATCHING_FORMATIONS_COLLECTION_PROD : TEAM_MATCHING_FORMATIONS_COLLECTION;
  const docs = await Promise.all([1, 2].map((i) => db.collection(collection).doc(`${runId}_alt${i}`).get()));
  return docs
    .filter((d) => d.exists)
    .map((d) => d.data() as TeamFormation)
    .sort((a, b) => a.formation_index - b.formation_index);
};

export const getSettings = async (): Promise<TeamMatchingSettings> => {
  const db = getFirestore();
  const snap = await db.collection(WILDHACKS_COLLECTION).doc(TEAM_MATCHING_SETTINGS_DOC).get();
  return snap.exists
    ? { ...DEFAULT_TEAM_MATCHING_SETTINGS, ...(snap.data() as Partial<TeamMatchingSettings>) }
    : DEFAULT_TEAM_MATCHING_SETTINGS;
};
