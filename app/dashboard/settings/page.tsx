import { redirect } from "next/navigation";

import {
  EditProfileForm,
  EventWithdraw,
  ThemeSelect,
  EditWildhacksConfigForm,
} from "@/app/dashboard/settings/_components";
import { ADMIN, DASHBOARD_SETTINGS_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants";
import { getConfigDocSnapshot, getUserDocSnapshot, verifySession } from "@/lib";
import type { User, WildHacksConfig } from "@/types";

const SettingsPage = async () => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SETTINGS_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  const userData = userDocSnapshot.data() as Omit<User, "id">;
  const { role } = userData;

  const configDocSnapshot = role === ADMIN ? await getConfigDocSnapshot() : undefined;
  const wildHacksConfig = configDocSnapshot?.data() as WildHacksConfig | undefined;

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-md font-semibold">General</h2>
        <ThemeSelect />
        <EventWithdraw />
      </div>
      {role === ADMIN && wildHacksConfig && (
        <div className="flex flex-col gap-4">
          <h2 className="text-md font-semibold">WildHacks Configuration</h2>
          <EditWildhacksConfigForm wildhacksConfig={wildHacksConfig} />
        </div>
      )}
      <div className="flex flex-col gap-4">
        <h2 className="text-md font-semibold">Profile</h2>
        <EditProfileForm user={{ ...userData, id: userId } as User} />
      </div>
    </div>
  );
};

export default SettingsPage;
