import { redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { DASHBOARD_SETTINGS_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants/routes.constants";
import { verifySession } from "@/lib/session.lib";
import { getUserDocSnapshot } from "@/lib/user.lib";
import User from "@/types/user.types";

import EditProfileForm from "./_components/edit-profile-form";
import EventWithdraw from "./_components/event-withdraw";
import ThemeSelect from "./_components/theme-select";

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
        <EventWithdraw userId={userId} />
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
