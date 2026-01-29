import { LOGIN_PATH, REGISTRATION_PATH } from "@/constants";
import { getAuthenticatedUser, getConfigDocSnapshot } from "@/lib";
import type { WildHacksConfig } from "@/types";

import RegistrationForm from "./_components/registration-form";

const RegistrationPage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(REGISTRATION_PATH)}`;

  await getAuthenticatedUser(redirectPath);

  const configDocSnapshot = await getConfigDocSnapshot();
  const wildhacksConfig = configDocSnapshot.data() as WildHacksConfig;

  return (
    <main className="flex-1 px-6 sm:px-12 py-6 flex flex-col justify-center items-center">
      <div className="max-w-[650px]">
        <div className="text-center space-y-5">
          <h2 className="text-4xl sm:text-5xl font-semibold">Hey there, future hacker! 👋</h2>
          <p>
            Fill out the registration form below and you&apos;ll be all set. We just need some basic info to get you
            started. This should only take a few minutes!
          </p>
          <RegistrationForm {...wildhacksConfig} />
        </div>
      </div>
    </main>
  );
};

export default RegistrationPage;
