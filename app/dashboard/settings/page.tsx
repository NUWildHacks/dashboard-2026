import {
  EditProfileForm,
  EventWithdraw,
  ThemeSelect,
  EditWildhacksConfigForm,
} from "@/app/dashboard/settings/_components";
import { ADMIN, DASHBOARD_SETTINGS_PATH, LOGIN_PATH } from "@/constants";
import { getAuthenticatedUser, getConfigDocSnapshot } from "@/lib";
import type { WildHacksConfig } from "@/types";

const SettingsPage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SETTINGS_PATH)}`;

  const user = await getAuthenticatedUser(redirectPath);

  let wildHacksConfig: WildHacksConfig | undefined;
  if (user.role === ADMIN) {
    const configDocSnapshot = await getConfigDocSnapshot();
    wildHacksConfig = configDocSnapshot.data() as WildHacksConfig;
  }

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-md font-semibold">General</h2>
        <ThemeSelect />
        <EventWithdraw />
      </div>
      {wildHacksConfig && (
        <div className="flex flex-col gap-4">
          <h2 className="text-md font-semibold">WildHacks Configuration</h2>
          <EditWildhacksConfigForm wildhacksConfig={wildHacksConfig} />
        </div>
      )}
      <div className="flex flex-col gap-4">
        <h2 className="text-md font-semibold">Profile</h2>
        <EditProfileForm user={user} />
      </div>
    </div>
  );
};

export default SettingsPage;
