import { redirect } from "next/navigation";

import { EditProfileForm, EventWithdraw, ThemeSelect } from "@/app/dashboard/settings/_components";
import { Separator } from "@/components/ui/separator";
import { DASHBOARD_SETTINGS_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants";
import { getUserDocSnapshot, verifySession } from "@/lib";
import type { User } from "@/types";

const SettingsPage = async () => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SETTINGS_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  const userData = userDocSnapshot.data() as Omit<User, "id">;

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-md font-semibold">General</h2>
        <Separator />
        <ThemeSelect />
        <EventWithdraw />
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-md font-semibold">Profile</h2>
        <Separator />
        <EditProfileForm user={{ ...userData, id: userId } as User} />
      </div>
    </div>
  );
};

export default SettingsPage;
