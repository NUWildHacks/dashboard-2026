import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TECH_ROOM_FINDER_PATH } from "@/constants";

const VenueMap = () => {
  return (
    <a href={TECH_ROOM_FINDER_PATH} target="_blank" rel="noreferrer">
      <Card className="shadow-xs transition-colors hover:bg-accent hover:cursor-pointer h-full">
        <CardHeader>
          <CardTitle>Access Tech Room Finder</CardTitle>
          <CardDescription>
            Find session rooms, sponsor booths, rest areas, and amenities at Technological Institute.
          </CardDescription>
        </CardHeader>
      </Card>
    </a>
  );
};

export default VenueMap;
