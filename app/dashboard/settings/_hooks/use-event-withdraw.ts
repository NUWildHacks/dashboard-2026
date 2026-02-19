"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ROOT_PATH } from "@/constants";

import { withdrawEvent } from "../_actions";

export type UseEventWithdrawReturn = {
  isWithdrawing: boolean;
  withdraw: () => Promise<void>;
};

export const useEventWithdraw = (): UseEventWithdrawReturn => {
  const router = useRouter();

  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const withdraw = async () => {
    setIsWithdrawing(true);

    try {
      const result = await withdrawEvent();
      const { success } = result;

      if (!success) {
        const { error } = result;
        throw new Error(error);
      }

      router.replace(ROOT_PATH);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Withdraw event error:", errorMessage);

      toast.error("Failed to withdraw from event", { description: errorMessage });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return {
    isWithdrawing,
    withdraw,
  };
};
