import { Map } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LR2_PATH = "https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=L171&room-floor=1&room-id=789&room-ingress=";

const CrowdFavoritePresentationTile = () => {
  return (
    <Card className="shadow-xs h-full">
      <CardHeader>
        <CardTitle>Crowd Favorite Presentations</CardTitle>
        <CardDescription className="space-y-1.5">
          <span className="block">
            Opt-in is closed. Head to <strong>LR2 by 2:00 PM</strong> to watch teams present their projects and vote for your favorite.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
            <Button variant="outline" className="w-fit gap-2" asChild>
              <a href={LR2_PATH} target="_blank" rel="noopener noreferrer">
                <Map className="size-4" />
                Tech Room Finder
              </a>
            </Button>
          </CardContent>
    </Card>
  );
};

export default CrowdFavoritePresentationTile;
