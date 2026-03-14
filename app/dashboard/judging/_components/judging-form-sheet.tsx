"use client";

import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";

import Rating from "@/components/form/rating";
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

type JudgingFormSheetProps = Pick<
  UseJudgingFormSheetReturn,
  "isOpen" | "setIsOpen" | "selectedProjectWithMetadata" | "control" | "handleSubmit" | "onSubmit" | "isSubmitting"
>;

const JudgingFormSheet = ({
  isOpen,
  setIsOpen,
  selectedProjectWithMetadata,
  control,
  handleSubmit,
  onSubmit,
  isSubmitting,
}: JudgingFormSheetProps) => {
  if (!selectedProjectWithMetadata) return null;

  const { name, track, project_url } = selectedProjectWithMetadata;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-[550px]">
        <SheetHeader className="pb-0">
          <SheetTitle>Judging Form</SheetTitle>
          <SheetDescription asChild className="space-y-1">
            <div className="space-y-1">
              <p>
                <span className="font-medium">Project name:</span> {name}
              </p>
              <p>
                <span className="font-medium">Track:</span> {track}
              </p>
              <a href={project_url} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                View Devpost
              </a>
            </div>
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <form id="judging-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-4">
          <FieldGroup>
            <FieldSet disabled={isSubmitting}>
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
                    <Rating fieldName={field.name} field={field} />
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
                    <Rating fieldName={field.name} field={field} />
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
                    <Rating fieldName={field.name} field={field} />
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
                    <Rating fieldName={field.name} field={field} />
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
                    <Rating fieldName={field.name} field={field} />
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
            <Button type="submit" form="judging-form" disabled={isSubmitting}>
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
