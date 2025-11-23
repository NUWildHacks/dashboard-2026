import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function QRCode() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="hover:bg-accent">
          <CardHeader>
            <CardTitle>View QR Code</CardTitle>
            <CardDescription>Present your QR code to access workshops, food, and merch.</CardDescription>
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>View QR Code</DialogTitle>
          <DialogDescription>Present your QR code to access workshops, food, and merch.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
