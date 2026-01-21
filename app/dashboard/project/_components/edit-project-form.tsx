"use client";

import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";

import { useEditProjectForm } from "@/app/dashboard/project/_hooks";
import type { Project } from "@/app/dashboard/project/_types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type EditProjectFormProps = {
  project: Project;
};

const EditProjectForm = ({ project }: EditProjectFormProps) => {
  const { name, description, github_url, demo_url } = project;

  const { control, handleSubmit, onSubmit, isSubmitting, isDirty, handleReset } = useEditProjectForm(project);

  return (
    <Card className="shadow-xs flex-1">
      <CardHeader>
        <CardTitle>Edit Project Details</CardTitle>
        <CardDescription>
          Make sure your project details are accurate for people who want to view your project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="edit-project-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet disabled={isSubmitting}>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder={name}
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
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      Description
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id={field.name}
                      placeholder={description}
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
                name="github_url"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Github Repository URL</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder={github_url || "Enter Github repository URL"}
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
                name="demo_url"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Demo URL</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder={demo_url || "Enter demo URL"}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
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
          <Button type="submit" form="edit-project-form" disabled={isSubmitting || !isDirty}>
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

export default EditProjectForm;
