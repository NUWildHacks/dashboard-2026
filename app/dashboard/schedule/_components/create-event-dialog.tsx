"use client";

import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { FieldError, Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { EVENT_CATEGORIES } from "../_constants";
import { useCreateEventDialog } from "../_hooks/use-create-event-dialog";

type CreateEventDialogProps = {
  availableDays: { dayStart: number; dayEnd: number; label: string }[];
};

const CreateEventDialog = ({ availableDays }: CreateEventDialogProps) => {
  const { control, handleSubmit, isSubmitting, onSubmit, isOpen, setIsOpen } = useCreateEventDialog();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto">Create event</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create event</DialogTitle>
          <DialogDescription>Please enter event details to continue.</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <form id="create-event-form" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldSet disabled={isSubmitting}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        Title
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="Enter event title"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />
              </FieldSet>
              <FieldSet disabled={isSubmitting}>
                <Controller
                  name="body"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        Body
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id={field.name}
                        placeholder="Enter event body"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        className="max-h-40"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />
              </FieldSet>
              <FieldSet disabled={isSubmitting}>
                <Controller
                  name="category"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        Category
                      </FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid} tabIndex={0}>
                          <SelectValue placeholder="Select event category" />
                        </SelectTrigger>
                        <SelectContent>
                          {EVENT_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />
              </FieldSet>
              <FieldSet disabled={isSubmitting}>
                <Controller
                  name="day"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        Day
                      </FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid} tabIndex={0}>
                          <SelectValue placeholder="Select event day" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDays.map((day) => (
                            <SelectItem key={day.label} value={day.label}>
                              {day.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />
              </FieldSet>
              <FieldSet disabled={isSubmitting}>
                <div className="flex gap-4">
                  <Controller
                    name="start_time"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="flex-1">
                        <FieldLabel
                          htmlFor={field.name}
                          className="after:content-['*'] after:ml-0.5 after:text-red-500"
                        >
                          Start Time
                        </FieldLabel>
                        <Input
                          type="time"
                          id={field.name}
                          value={field.value || ""}
                          onChange={field.onChange}
                          aria-invalid={fieldState.invalid}
                          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                      </Field>
                    )}
                  />
                  <Controller
                    name="end_time"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="flex-1">
                        <FieldLabel
                          htmlFor={field.name}
                          className="after:content-['*'] after:ml-0.5 after:text-red-500"
                        >
                          End Time
                        </FieldLabel>
                        <Input
                          type="time"
                          id={field.name}
                          value={field.value || ""}
                          onChange={field.onChange}
                          aria-invalid={fieldState.invalid}
                          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                      </Field>
                    )}
                  />
                </div>
              </FieldSet>
            </FieldGroup>
          </form>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Go back
            </Button>
          </DialogClose>
          <Button type="submit" form="create-event-form" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Create event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
