"use server";

import { redirect } from "next/navigation";

import "@/config/firebase-admin";
import { LOGIN_PATH, REGISTRATION_PATH } from "@/constants/routes";

import { verifySession } from "../../lib/session";
import getUserDocSnapshot from "../../lib/user";

export default async function Dashboard() {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(REGISTRATION_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  return (
    <div className="">Dashboard Page</div>
  );
}
