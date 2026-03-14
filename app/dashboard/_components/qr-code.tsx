import QRCodeComponent from "react-qr-code";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@/types";

type QRCodeProps = {
  userId: User["id"];
};

const QRCode = ({ userId }: QRCodeProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="shadow-xs transition-colors hover:bg-accent hover:cursor-pointer h-full">
          <CardHeader>
            <CardTitle>View QR Code</CardTitle>
            <CardDescription>
              Your all-access pass to WildHacks. Scan at registration, workshops, and meal stations.
            </CardDescription>
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>View QR Code</DialogTitle>
          <DialogDescription>Present your QR code to access workshops, food, and merch.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center">
          <QRCodeComponent className="size-[192px] sm:size-[256px]" value={userId} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCode;
