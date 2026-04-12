import Link from "next/link";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DASHBOARD_CROWD_FAVORITE_PATH } from "@/constants";

const CrowdFavoriteAdminLink = () => {
  return (
    <Link href={DASHBOARD_CROWD_FAVORITE_PATH}>
      <Card className="shadow-xs transition-colors hover:bg-accent hover:cursor-pointer h-full">
        <CardHeader>
          <CardTitle>Crowd Favorite Projects</CardTitle>
          <CardDescription>View all opted-in projects, and vote counts once voting has started.</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default CrowdFavoriteAdminLink;
