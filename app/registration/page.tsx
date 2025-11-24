import { redirect } from "next/navigation";

import "@/config/firebase-admin";
import { DASHBOARD_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants/routes";
import { EventConfig } from "@/types/event";

import { getEventConfigDocSnapshot } from "../../lib/event";
import { verifySession } from "../../lib/session";
import { getUserDocSnapshot } from "../../lib/user";

import RegistrationForm from "./_components/registration-form";

export default async function Registration() {
  const eventDocSnapshot = await getEventConfigDocSnapshot();
  const { state } = eventDocSnapshot.data() as EventConfig;

  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(REGISTRATION_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (userDocSnapshot.exists) redirect(DASHBOARD_PATH);

  return (
    <main className="flex-1 px-6 sm:px-12 py-6 flex flex-col justify-center items-center">
      <div className="max-w-[650px]">
        <div className="text-center space-y-5">
          <h2 className="text-4xl sm:text-5xl font-semibold">Hey there, future hacker! 👋</h2>
          <p>
            Fill out the registration form below and you&apos;ll be all set. We just need some basic info to get you
            started. This should only take a few minutes!
          </p>
          <RegistrationForm userId={userId} eventState={state} />
        </div>
      </div>
    </main>
  );
}
