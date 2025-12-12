import { redirect } from "next/navigation";

import "@/config/firebase-admin";
import { DASHBOARD_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants/routes.constants";
import { WildHacksConfig } from "@/types/wildhacks.types";

import { verifySession } from "../../lib/session.lib";
import { getUserDocSnapshot } from "../../lib/user.lib";
import { getConfigDocSnapshot } from "../../lib/wildhacks.lib";

import RegistrationForm from "./_components/registration-form";

const Registration = async () => {
  const configDocSnapshot = await getConfigDocSnapshot();
  const { state } = configDocSnapshot.data() as WildHacksConfig;

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
          <RegistrationForm userId={userId} state={state} />
        </div>
      </div>
    </main>
  );
};

export default Registration;
