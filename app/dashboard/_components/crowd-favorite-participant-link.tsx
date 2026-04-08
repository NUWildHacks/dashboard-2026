import Link from "next/link";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DASHBOARD_CROWD_FAVORITE_PATH } from "@/constants";

type CrowdFavoriteParticipantLinkProps = {
  votingOpen: boolean;
};

const CrowdFavoriteParticipantLink = ({ votingOpen }: CrowdFavoriteParticipantLinkProps) => {
  const title = votingOpen ? "Crowd Favorite Voting" : "Crowd Favorite Opt-in";
  const description = votingOpen
    ? "Voting is currently active. Submit or edit your vote now."
    : "Opt-in is currently active. Submit your team details to participate.";

  return (
    <Link href={DASHBOARD_CROWD_FAVORITE_PATH}>
      <Card className="shadow-xs transition-colors hover:bg-accent hover:cursor-pointer h-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default CrowdFavoriteParticipantLink;
