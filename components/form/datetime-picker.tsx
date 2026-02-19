"use client";

import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { FieldValues, UseControllerReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { combineDateAndTime, millisecondsToDate, millisecondsToTime } from "@/lib";

type DateTimePickerProps<T extends FieldValues = FieldValues> = {
  label: string;
  fieldName: string;
} & Pick<UseControllerReturn<T>, "field" | "fieldState">;

const DateTimePicker = <T extends FieldValues>({ label, fieldName, field, fieldState }: DateTimePickerProps<T>) => {
  const [dateOpen, setDateOpen] = useState(false);

  const { value } = field;
  const date = millisecondsToDate(value);
  const time = millisecondsToTime(value);

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={`${fieldName}-date`} className="after:content-['*'] after:ml-0.5 after:text-red-500">
        {label}
      </FieldLabel>
      <div className="flex gap-4">
        <div className="flex flex-col gap-3 flex-1">
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id={`${fieldName}-date`}
                className="w-full justify-between font-normal"
                aria-invalid={fieldState.invalid}
              >
                {date ? date.toLocaleDateString() : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    const newValue = combineDateAndTime(selectedDate, time || "00:00");
                    field.onChange(newValue);
                    setDateOpen(false);
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-3 flex-1">
          <Input
            type="time"
            id={`${fieldName}-time`}
            step="60"
            value={time}
            onChange={(e) => {
              const newTime = e.target.value;
              const newValue = combineDateAndTime(date || new Date(), newTime);
              field.onChange(newValue);
            }}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            aria-invalid={fieldState.invalid}
          />
        </div>
      </div>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
    </Field>
  );
};

export default DateTimePicker;
