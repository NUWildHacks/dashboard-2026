import Link from "next/link";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DASHBOARD_CROWD_FAVORITE_PATH } from "@/constants";

type CrowdFavoriteParticipantLinkProps = {
  votingStarted: boolean;
};

const CrowdFavoriteParticipantLink = ({ votingStarted }: CrowdFavoriteParticipantLinkProps) => {
  const title = votingStarted ? "Vote for Crowd Favorite" : "Opt In to Crowd Favorite";
  const description = votingStarted
    ? "Voting is open. Submit or edit your vote before the window closes."
    : "Crowd favorite opt-in is open. Submit your team details to participate.";

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
