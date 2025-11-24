import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function VenueMap() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="shadow-none transition-shadow hover:shadow-md hover:cursor-pointer">
          <CardHeader>
            <CardTitle>View Venue Map</CardTitle>
            <CardDescription>Locate workshop rooms, food stands, and merch giveaways.</CardDescription>
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
}
