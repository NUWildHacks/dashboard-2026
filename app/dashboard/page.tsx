import "@/config/firebase-admin";
import { redirect } from "next/navigation";

import { DASHBOARD_PATH, LOGIN_PATH } from "@/constants/routes";
import { verifySession } from "@/lib/session";
import getUserDocSnapshot from "@/lib/user";

export default async function Dashboard() {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(DASHBOARD_PATH);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-background aspect-video rounded-xl border shadow-sm" />
        <div className="bg-background aspect-video rounded-xl border shadow-sm" />
        <div className="bg-background aspect-video rounded-xl border shadow-sm" />
      </div>
    </div>
  );
}
