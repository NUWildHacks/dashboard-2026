"use client";

import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";

import { useEditAdminProfileForm } from "@/app/dashboard/settings/_hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  FieldGroup,
  FieldSet,
  FieldDescription,
  Field,
  FieldLabel,
  FieldError,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectValue,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
} from "@/components/ui/multi-select";
import { DIETARY_RESTRICTIONS } from "@/constants";
import type { AdminUser } from "@/types";

type EditAdminProfileFormProps = {
  adminUser: AdminUser;
};

const EditAdminProfileForm = ({ adminUser }: EditAdminProfileFormProps) => {
  const { control, handleSubmit, onSubmit, isSubmitting, isDirty, handleReset } = useEditAdminProfileForm(adminUser);

  return (
    <Card className="shadow-sm">
      <CardContent>
        <form id="edit-profile-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet disabled={isSubmitting}>
              <FieldGroup>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Controller
                    name="first_name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="after:content-['*'] after:ml-0.5 after:text-red-500"
                        >
                          First Name
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="Enter your first name"
                          aria-invalid={fieldState.invalid}
                          autoComplete="given-name"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="last_name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="after:content-['*'] after:ml-0.5 after:text-red-500"
                        >
                          Last Name
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="Enter your last name"
                          aria-invalid={fieldState.invalid}
                          autoComplete="family-name"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                      </Field>
                    )}
                  />
                </div>

                <Field>
                  <FieldLabel htmlFor="email" className="after:content-['*'] after:ml-0.5 after:text-red-500">
                    Email
                  </FieldLabel>
                  <Input id="email" value={adminUser.email} disabled />
                </Field>

                <Field>
                  <FieldLabel htmlFor="role" className="after:content-['*'] after:ml-0.5 after:text-red-500">
                    Role
                  </FieldLabel>
                  <Input id="role" value={adminUser.role} disabled />
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet disabled={isSubmitting}>
              <FieldGroup>
                <Controller
                  name="dietary_restrictions"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        Dietary Restrictions
                      </FieldLabel>
                      <MultiSelect values={field.value} onValuesChange={field.onChange}>
                        <MultiSelectTrigger id={field.name} aria-invalid={fieldState.invalid} className="w-full">
                          <MultiSelectValue placeholder="Select all of your dietary restrictions" />
                        </MultiSelectTrigger>
                        <MultiSelectContent>
                          <MultiSelectGroup>
                            {DIETARY_RESTRICTIONS.map((dietary_restriction) => (
                              <MultiSelectItem key={dietary_restriction} value={dietary_restriction}>
                                {dietary_restriction}
                              </MultiSelectItem>
                            ))}
                          </MultiSelectGroup>
                        </MultiSelectContent>
                      </MultiSelect>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />

                <Controller
                  name="other_dietary_restrictions"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Other Dietary Restrictions</FieldLabel>
                      <FieldDescription className="w-full text-start">
                        If you selected &quot;Other&quot;, please specify below
                      </FieldDescription>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your other dietary restrictions"
                        autoComplete="off"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="flex-row-reverse">
          <Button type="submit" form="edit-profile-form" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Save changes"}
          </Button>
          <Button type="button" variant="outline" disabled={isSubmitting || !isDirty} onClick={handleReset}>
            Reset
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default EditAdminProfileForm;
