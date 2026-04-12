"use client";

import { Loader2, MapPin } from "lucide-react";
import { Controller } from "react-hook-form";

import Rating from "@/components/form/rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

import { UseJudgingFormSheetReturn } from "../_hooks";
import { ROUND_1, ROUND_1_DEADLINE, TRACKS_MAP } from "../constants";

type JudgingFormSheetProps = Pick<
  UseJudgingFormSheetReturn,
  | "isOpen"
  | "setIsOpen"
  | "selectedJudgingAssignmentWithProject"
  | "control"
  | "handleSubmit"
  | "onSubmit"
  | "isSubmitting"
>;

const JudgingFormSheet = ({
  isOpen,
  setIsOpen,
  selectedJudgingAssignmentWithProject,
  control,
  handleSubmit,
  onSubmit,
  isSubmitting,
}: JudgingFormSheetProps) => {
  if (!selectedJudgingAssignmentWithProject) return null;

  const {
    project: { name, track, devpost_url },
    judging_form,
    room_id,
    judging_round,
  } = selectedJudgingAssignmentWithProject;

  const isPastRound1Deadline = judging_round === ROUND_1 && new Date().getTime() > ROUND_1_DEADLINE;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-[550px]">
        <SheetHeader className="pb-0">
          <SheetTitle>{name}</SheetTitle>
          <SheetDescription asChild>
            <div className="flex flex-row items-center gap-2">
              <Badge variant="secondary">{TRACKS_MAP[track]}</Badge>
              {judging_form && (
                <Badge
                  variant="outline"
                  className="border-none bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 focus-visible:outline-none dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5"
                >
                  Submitted
                </Badge>
              )}
              {room_id && (
                <span className="flex items-center gap-1 text-xs font-medium text-nowrap">
                  <MapPin className="size-3 shrink-0" aria-hidden="true" />
                  {room_id}
                </span>
              )}
              <a
                href={devpost_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs underline-offset-4 hover:underline"
              >
                View Devpost
              </a>
            </div>
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <form id="judging-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-4">
          <FieldGroup>
            <FieldSet disabled={isSubmitting || isPastRound1Deadline}>
              <Controller
                name="technical_complexity"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="w-auto">
                    <FieldLabel
                      htmlFor={field.name}
                      className="after:content-['*'] after:ml-0.5 after:text-red-500 text-nowrap"
                    >
                      Technical Complexity
                    </FieldLabel>
                    <FieldDescription>
                      Measures technical impressiveness: frameworks, APIs, algorithms, and functioning code with a
                      working demo.
                    </FieldDescription>
                    <Rating fieldName={field.name} field={field} disabled={isPastRound1Deadline} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                  </Field>
                )}
              />

              <Controller
                name="usefulness"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="w-auto">
                    <FieldLabel
                      htmlFor={field.name}
                      className="after:content-['*'] after:ml-0.5 after:text-red-500 text-nowrap"
                    >
                      Usefulness
                    </FieldLabel>
                    <FieldDescription>
                      Measures potential for everyday use. Should be intuitive and easy to use.
                    </FieldDescription>
                    <Rating fieldName={field.name} field={field} disabled={isPastRound1Deadline} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                  </Field>
                )}
              />

              <Controller
                name="originality"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="w-auto">
                    <FieldLabel
                      htmlFor={field.name}
                      className="after:content-['*'] after:ml-0.5 after:text-red-500 text-nowrap"
                    >
                      Originality
                    </FieldLabel>
                    <FieldDescription>
                      Measures uniqueness and novelty, from new spins on existing ideas to completely original concepts.
                    </FieldDescription>
                    <Rating fieldName={field.name} field={field} disabled={isPastRound1Deadline} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                  </Field>
                )}
              />

              <Controller
                name="design"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="w-auto">
                    <FieldLabel
                      htmlFor={field.name}
                      className="after:content-['*'] after:ml-0.5 after:text-red-500 text-nowrap"
                    >
                      Design
                    </FieldLabel>
                    <FieldDescription>
                      Measures how polished and professional the project looks and functions.
                    </FieldDescription>
                    <Rating fieldName={field.name} field={field} disabled={isPastRound1Deadline} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                  </Field>
                )}
              />

              <Controller
                name="presentation"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="w-auto">
                    <FieldLabel
                      htmlFor={field.name}
                      className="after:content-['*'] after:ml-0.5 after:text-red-500 text-nowrap"
                    >
                      Presentation
                    </FieldLabel>
                    <FieldDescription>
                      Measures the demo video&apos;s clarity in explaining the problem statement and solution.
                    </FieldDescription>
                    <Rating fieldName={field.name} field={field} disabled={isPastRound1Deadline} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                  </Field>
                )}
              />

              <Controller
                name="comments"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Comments</FieldLabel>
                    <Textarea
                      {...field}
                      id={field.name}
                      placeholder="Enter any additional comments"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      className="min-h-24 max-h-64 break-all"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                  </Field>
                )}
              />
            </FieldSet>
          </FieldGroup>
        </form>
        <Separator />
        <SheetFooter>
          <Field orientation="horizontal" className="flex-row-reverse">
            <Button type="submit" form="judging-form" disabled={isSubmitting || isPastRound1Deadline}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
            <SheetClose asChild>
              <Button variant="outline">Go back</Button>
            </SheetClose>
          </Field>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default JudgingFormSheet;
