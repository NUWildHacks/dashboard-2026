"use client";

import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { FieldValues, UseControllerReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils.lib";

type DatePickProps<T extends FieldValues = FieldValues> = {
  placeholder: string;
} & Pick<UseControllerReturn<T>, "field" | "fieldState">;

const DatePicker = <T extends FieldValues>({ placeholder, field, fieldState }: DatePickProps<T>) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover {...field} open={open} onOpenChange={setOpen}>
      <PopoverTrigger id={field.name} aria-invalid={fieldState.invalid} asChild>
        <Button
          variant="outline"
          id="date"
          className={cn(
            "w-full justify-between bg-background hover:bg-background",
            field.value ? "text-foreground hover:text-foreground" : "text-muted-foreground hover:text-muted-foreground"
          )}
        >
          {field.value || placeholder}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="center">
        <Calendar
          mode="single"
          selected={new Date(field.value as string)}
          captionLayout="dropdown"
          onSelect={(date) => {
            if (date) {
              field.onChange(format(date, "MM/dd/yyyy"));
              setOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
