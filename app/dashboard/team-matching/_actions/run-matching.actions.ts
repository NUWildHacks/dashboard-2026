"use server";

import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import {
  ADMIN,
  DASHBOARD_PATH,
  DASHBOARD_TEAM_MATCHING_PATH,
  LOGIN_PATH,
  TEAM_MATCHING_INTAKE_COLLECTION_DEV,
  TEAM_MATCHING_RUNS_COLLECTION,
  TEAM_MATCHING_SETTINGS_DOC,
  TEAM_MATCHING_SUGGESTIONS_COLLECTION,
  TEAM_MATCHING_TEAMS_COLLECTION,
  USERS_COLLECTION,
  WILDHACKS_COLLECTION,
} from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult, IntakeRecord, TeamMatchingRun, TeamMatchingRunStats, TeamMatchingSettings } from "@/types";
import { DEFAULT_TEAM_MATCHING_SETTINGS } from "@/types";

import { runMatchingAlgorithm } from "../algorithm/matcher";

export type RunMatchingResult = ActionResult & {
  runId?: string;
  run?: TeamMatchingRun;
  stats?: TeamMatchingRunStats;
  warningCount?: number;
};

export const runMatching = async (name?: string): Promise<RunMatchingResult> => {
  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);
    const roleCheck = requireRole(user, ADMIN);
    if (roleCheck) return roleCheck;

    const db = getFirestore();

    // Fetch settings
    const settingsSnap = await db.collection(WILDHACKS_COLLECTION).doc(TEAM_MATCHING_SETTINGS_DOC).get();
    const settings: TeamMatchingSettings = settingsSnap.exists
      ? (settingsSnap.data() as TeamMatchingSettings)
      : DEFAULT_TEAM_MATCHING_SETTINGS;

    // Fetch all intake docs
    const intakeSnaps = await db.collection(TEAM_MATCHING_INTAKE_COLLECTION_DEV).get();

    // Fetch user display names
    const userIds = intakeSnaps.docs.map((d) => d.id);
    const userRefs = userIds.map((id) => db.collection(USERS_COLLECTION).doc(id));
    const userDocs = userRefs.length > 0 ? await db.getAll(...userRefs) : [];
    const nameMap = new Map(
      userDocs.map((doc) => [
        doc.id,
        doc.exists
          ? `${doc.data()?.first_name ?? ""} ${doc.data()?.last_name ?? ""}`.trim()
          : "Unknown",
      ])
    );

    // Build IntakeRecord array
    const intakes: IntakeRecord[] = intakeSnaps.docs.map((doc) => {
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
      };
    });

    const result = runMatchingAlgorithm(intakes, settings, settings.where_to_meet);

    if (result.preflightFailed) {
      return {
        success: false,
        error: "Pre-flight validation failed. Please resolve the warnings before running.",
        warningCount: result.warnings.length,
      };
    }

    const now = Date.now();
    const runRef = db.collection(TEAM_MATCHING_RUNS_COLLECTION).doc();
    const runId = runRef.id;

    const stats: TeamMatchingRunStats = {
      total_participants: intakes.length,
      total_teams: result.teams.length,
      unmatched_count: result.unmatched.length,
      required_cluster_count: result.teams.filter((t) =>
        t.members.some(
          (m) => (intakes.find((i) => i.user_id === m.user_id)?.required_teammates.length ?? 0) > 0
        )
      ).length,
      invalid_cluster_count: result.warnings.filter((w) => w.type === "oversized_cluster").length,
    };

    // Build team docs with stable IDs
    const teamDocs: { id: string; data: object }[] = result.teams.map((team) => {
      const teamRef = db.collection(TEAM_MATCHING_TEAMS_COLLECTION).doc();
      return { id: teamRef.id, data: { ...team, id: teamRef.id, run_id: runId } };
    });

    // Build a member-set → teamId lookup for suggestions
    const teamIdByMembers = new Map<string, string>();
    for (const { id, data } of teamDocs) {
      const key = (data as { members: { user_id: string }[] }).members
        .map((m) => m.user_id)
        .sort()
        .join(",");
      teamIdByMembers.set(key, id);
    }

    // Resolve team_id in suggestion entries
    const suggestionDocs = result.suggestions.map((s) => ({
      userId: s.user_id,
      data: {
        user_id: s.user_id,
        run_id: runId,
        suggestions: s.suggestions.map((sug) => {
          const key = sug.members.map((m) => m.user_id).sort().join(",");
          return { ...sug, team_id: teamIdByMembers.get(key) ?? "" };
        }),
      },
    }));

    // Batch-write in chunks of 400
    const allWrites: { ref: FirebaseFirestore.DocumentReference; data: object }[] = [
      {
        ref: runRef,
        data: {
          id: runId,
          run_at: now,
          run_by: user.id,
          name: name?.trim() || null,
          is_top: false,
          status: "draft",
          settings_snapshot: settings,
          warnings: result.warnings,
          stats,
        },
      },
      ...teamDocs.map(({ id, data }) => ({
        ref: db.collection(TEAM_MATCHING_TEAMS_COLLECTION).doc(id),
        data,
      })),
      ...suggestionDocs.map(({ userId, data }) => ({
        ref: db.collection(TEAM_MATCHING_SUGGESTIONS_COLLECTION).doc(`${runId}_${userId}`),
        data,
      })),
    ];

    const CHUNK_SIZE = 400;
    for (let i = 0; i < allWrites.length; i += CHUNK_SIZE) {
      const batch = db.batch();
      for (const { ref, data } of allWrites.slice(i, i + CHUNK_SIZE)) {
        batch.set(ref, data);
      }
      await batch.commit();
    }

    revalidatePath(DASHBOARD_TEAM_MATCHING_PATH);
    const run: TeamMatchingRun = {
      id: runId,
      run_at: now,
      run_by: user.id,
      name: name?.trim() || undefined,
      is_top: false,
      status: "draft",
      settings_snapshot: settings,
      warnings: result.warnings,
      stats,
    };
    return { success: true, runId, run, stats, warningCount: result.warnings.length };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: msg };
  }
};
