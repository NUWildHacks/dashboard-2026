"use client";

import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";

import Rating from "@/components/form/rating";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
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
import { UseItemDialogReturn } from "@/hooks";
import { JudgeUser } from "@/types";

import { useJudgingForm } from "../_hooks";
import { Project } from "../types";

type JudgingFormProps = { judgeData: Pick<JudgeUser, "id" | "first_name" | "last_name"> } & Pick<
  UseItemDialogReturn<Project>,
  "isOpen" | "setIsOpen" | "selectedItem"
>;

const JudgingForm = ({ judgeData, selectedItem, isOpen, setIsOpen }: JudgingFormProps) => {
  const { control, handleSubmit, onSubmit, isSubmitting } = useJudgingForm(selectedItem, judgeData);

  return (
    <Sheet open>
      <SheetContent>
        <SheetHeader className="pb-0">
          <SheetTitle>Judging Form</SheetTitle>
          <SheetDescription asChild className="space-y-1">
            <div className="space-y-1">
              <p><span className="font-medium">Project name:</span> {selectedItem?.name}</p>
              <p><span className="font-medium">Track:</span> {selectedItem?.track}</p>
              <p><span className="font-medium">Devpost URL:</span> {selectedItem?.project_url}</p>
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
                  <Rating label="Technical Complexity" fieldName={field.name} field={field} fieldState={fieldState} />
                )}
              />

              <Controller
                name="usefulness"
                control={control}
                render={({ field, fieldState }) => (
                  <Rating label="Usefulness" fieldName={field.name} field={field} fieldState={fieldState} />
                )}
              />

              <Controller
                name="originality"
                control={control}
                render={({ field, fieldState }) => (
                  <Rating label="Originality" fieldName={field.name} field={field} fieldState={fieldState} />
                )}
              />

              <Controller
                name="design"
                control={control}
                render={({ field, fieldState }) => (
                  <Rating label="Design" fieldName={field.name} field={field} fieldState={fieldState} />
                )}
              />

              <Controller
                name="presentation"
                control={control}
                render={({ field, fieldState }) => (
                  <Rating label="Presentation" fieldName={field.name} field={field} fieldState={fieldState} />
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
                      className="min-h-32 max-h-64 break-all"
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

export default JudgingForm;
