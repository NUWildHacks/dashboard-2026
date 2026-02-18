import { HelpCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { DASHBOARD_SUPPORT_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants";
import { getUserDocSnapshot, verifySession } from "@/lib";

const SupportPage = async () => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SUPPORT_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  return (
    <div className="flex-1 flex justify-center items-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HelpCircle />
          </EmptyMedia>
          <EmptyTitle>Support coming soon</EmptyTitle>
          <EmptyDescription>
            Check back soon for updates. If you have any urgent questions, please contact us at{" "}
            <Link
              href="mailto:wildhacks@northwestern.edu?subject=[SUPPORT TICKET] Dashboard"
              className="underline underline-offset-4"
            >
              wildhacks@northwestern.edu
            </Link>
            .
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
};

export default SupportPage;
