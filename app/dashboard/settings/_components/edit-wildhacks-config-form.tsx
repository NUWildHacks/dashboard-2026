"use client";

import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";

import DateTimePickerField from "@/components/form/datetime-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { WildHacksConfig } from "@/types";

import { useEditWildhacksConfigForm } from "../_hooks/use-edit-wildhacks-config-form";

type EditWildhacksConfigFormProps = {
  wildhacksConfig: WildHacksConfig;
};

const EditWildhacksConfigForm = ({ wildhacksConfig }: EditWildhacksConfigFormProps) => {
  const { control, handleSubmit, onSubmit, isSubmitting, isDirty, handleReset } =
    useEditWildhacksConfigForm(wildhacksConfig);

  return (
    <Card>
      <CardContent>
        <form id="edit-wildhacks-config-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet disabled={isSubmitting}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="start_time"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DateTimePickerField
                      label="Start Time"
                      fieldName={field.name}
                      field={field}
                      fieldState={fieldState}
                    />
                  )}
                />

                <Controller
                  name="end_time"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DateTimePickerField
                      label="End Time"
                      fieldName={field.name}
                      field={field}
                      fieldState={fieldState}
                    />
                  )}
                />
              </div>

              <Controller
                name="max_team_size"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      Max Team Size
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="number"
                      step={1}
                      placeholder="Enter max team size"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                  </Field>
                )}
              />
            </FieldSet>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="flex-row-reverse">
          <Button type="submit" form="edit-wildhacks-config-form" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={handleReset} disabled={isSubmitting || !isDirty}>
            Reset
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default EditWildhacksConfigForm;
