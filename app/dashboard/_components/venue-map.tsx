import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const VenueMap = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="shadow-xs transition-colors hover:bg-accent hover:cursor-pointer">
          <CardHeader>
            <CardTitle>View Venue Map</CardTitle>
            <CardDescription>
              Navigate the event with ease. Find session rooms, sponsor booths, rest areas, and amenities.
            </CardDescription>
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>View Venue Map</DialogTitle>
          <DialogDescription>Locate workshop rooms, food stands, and merch giveaways.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default VenueMap;
