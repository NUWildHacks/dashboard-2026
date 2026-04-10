"use server";

import { getFirestore } from "firebase-admin/firestore";

import {
  ADMIN,
  DASHBOARD_PATH,
  LOGIN_PATH,
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
  WILDHACKS_CONFIG_DOC,
} from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult, IntakeRecord, TeamMatchingRun, TeamMatchingRunStats, TeamMatchingSettings, WildHacksConfig } from "@/types";
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

    // Fetch config and settings in parallel
    const [configSnap, settingsSnap] = await Promise.all([
      db.collection(WILDHACKS_COLLECTION).doc(WILDHACKS_CONFIG_DOC).get(),
      db.collection(WILDHACKS_COLLECTION).doc(TEAM_MATCHING_SETTINGS_DOC).get(),
    ]);

    const config = configSnap.data() as WildHacksConfig | undefined;
    const mode = config?.team_matching_mode ?? "dev";
    const intakeCollection = mode === "prod" ? TEAM_MATCHING_INTAKE_COLLECTION : TEAM_MATCHING_INTAKE_COLLECTION_DEV;
    const runsCollection = mode === "prod" ? TEAM_MATCHING_RUNS_COLLECTION_PROD : TEAM_MATCHING_RUNS_COLLECTION;
    const teamsCollection = mode === "prod" ? TEAM_MATCHING_TEAMS_COLLECTION_PROD : TEAM_MATCHING_TEAMS_COLLECTION;
    const formationsCollection = mode === "prod" ? TEAM_MATCHING_FORMATIONS_COLLECTION_PROD : TEAM_MATCHING_FORMATIONS_COLLECTION;

    const settings: TeamMatchingSettings = settingsSnap.exists
      ? { ...DEFAULT_TEAM_MATCHING_SETTINGS, ...(settingsSnap.data() as Partial<TeamMatchingSettings>) }
      : DEFAULT_TEAM_MATCHING_SETTINGS;

    // Fetch all intake docs from the active collection
    const intakeSnaps = await db.collection(intakeCollection).get();

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

    // Use a timestamp-based seed so each run explores a different random ordering.
    const baseSeed = Date.now() & 0xffffffff;
    const result = runMatchingAlgorithm(intakes, settings, settings.where_to_meet, baseSeed);

    if (result.preflightFailed) {
      return {
        success: false,
        error: "Pre-flight validation failed. Please resolve the warnings before running.",
        warningCount: result.warnings.length,
      };
    }

    const now = Date.now();
    const runRef = db.collection(runsCollection).doc();
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

    // Build primary team docs with stable IDs
    const teamDocs: { id: string; data: object }[] = result.teams.map((team) => {
      const teamRef = db.collection(teamsCollection).doc();
      return { id: teamRef.id, data: { ...team, id: teamRef.id, run_id: runId } };
    });

    // Build alternative formation docs (up to 2 runner-up results)
    const formationDocs: { ref: FirebaseFirestore.DocumentReference; data: object }[] =
      result.alternatives.slice(0, 2).map((alt, i) => {
        const formationIndex = (i + 1) as 1 | 2;
        const teams = alt.teams.map((team, j) => ({
          ...team,
          id: `${runId}_alt${formationIndex}_${j}`,
          run_id: runId,
        }));
        return {
          ref: db.collection(formationsCollection).doc(`${runId}_alt${formationIndex}`),
          data: { run_id: runId, formation_index: formationIndex, teams, fingerprint: alt.fingerprint },
        };
      });

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
          fingerprint: result.fingerprint,
          status: "draft",
          settings_snapshot: settings,
          warnings: result.warnings,
          stats,
        },
      },
      ...teamDocs.map(({ id, data }) => ({
        ref: db.collection(teamsCollection).doc(id),
        data,
      })),
      ...formationDocs,
    ];

    const CHUNK_SIZE = 400;
    for (let i = 0; i < allWrites.length; i += CHUNK_SIZE) {
      const batch = db.batch();
      for (const { ref, data } of allWrites.slice(i, i + CHUNK_SIZE)) {
        batch.set(ref, data);
      }
      await batch.commit();
    }

    const run: TeamMatchingRun = {
      id: runId,
      run_at: now,
      run_by: user.id,
      name: name?.trim() || undefined,
      is_top: false,
      fingerprint: result.fingerprint,
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
