"use client";

import { Loader2 } from "lucide-react";

import { useEventWithdraw } from "@/app/dashboard/settings/_hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Item, ItemActions, ItemContent, ItemDescription, ItemHeader } from "@/components/ui/item";

const EventWithdraw = () => {
  const { isWithdrawing, withdraw } = useEventWithdraw();

  return (
    <Item variant="outline" className="w-full shadow-sm bg-card">
      <ItemContent>
        <ItemHeader className="font-medium">Withdraw</ItemHeader>
        <ItemDescription>If you can no longer participate, you can withdraw from the event.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Withdraw</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>You must re-register to the event if you want to participate.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={isWithdrawing}>
                  Go Back
                </Button>
              </DialogClose>
              <Button variant="destructive" disabled={isWithdrawing} onClick={withdraw}>
                {isWithdrawing ? <Loader2 className="size-4 animate-spin" /> : "Withdraw"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ItemActions>
    </Item>
  );
};

export default EventWithdraw;
