import { ADMIN, DASHBOARD_SETTINGS_PATH, JUDGE, LOGIN_PATH, PARTICIPANT } from "@/constants";
import { getAuthenticatedUser, getConfigDocSnapshot } from "@/lib";
import type { AdminUser, JudgeUser, ParticipantUser, WildHacksConfig } from "@/types";

import {
  EditParticipantProfileForm,
  EventWithdraw,
  ThemeSelect,
  EditWildhacksConfigForm,
  EditJudgeProfileForm,
  EditAdminProfileForm,
} from "./_components";

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
        {user.role === PARTICIPANT && <EditParticipantProfileForm participantUser={user as ParticipantUser} />}
        {user.role === JUDGE && <EditJudgeProfileForm judgeUser={user as JudgeUser} />}
        {user.role === ADMIN && <EditAdminProfileForm adminUser={user as AdminUser} />}
      </div>
    </div>
  );
};

export default SettingsPage;
