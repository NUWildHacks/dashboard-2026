"use client";

import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";

import Rating from "@/components/form/rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useJudgingForm } from "../_hooks";
import { Project } from "../../project/types";

type JudgingFormProps = {
  assignedProjects: Project[];
};

const JudgingForm = ({ assignedProjects }: JudgingFormProps) => {
  const { control, handleSubmit, onSubmit, isSubmitting, handleReset, handleSelectProject, selectedProjectData } =
    useJudgingForm(assignedProjects);

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <FieldLabel
            htmlFor="project-select"
            className="after:content-['*'] after:ml-0.5 after:text-red-500 text-nowrap"
          >
            Project
          </FieldLabel>
          <Select
            value={selectedProjectData?.id}
            onValueChange={(value) => {
              handleSelectProject(value);
            }}
          >
            <SelectTrigger id="project-select" aria-invalid={false} tabIndex={0} className="w-full">
              <SelectValue placeholder="Select a project to judge" defaultValue={selectedProjectData?.id} />
            </SelectTrigger>
            <SelectContent className="w-(--radix-select-trigger-width)">
              {assignedProjects.length > 0 ? (
                assignedProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-projects" disabled>
                  No projects found
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {selectedProjectData && (
          <form id="judging-form" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldSet disabled={isSubmitting}>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <Controller
                    name="technical_complexity"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Rating
                        label="Technical Complexity"
                        fieldName={field.name}
                        field={field}
                        fieldState={fieldState}
                      />
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
                </div>

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
                        className="min-h-32 max-h-64"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />
              </FieldSet>
            </FieldGroup>
          </form>
        )}
      </CardContent>
      {selectedProjectData && (
        <CardFooter>
          <Field orientation="horizontal" className="flex-row-reverse">
            <Button type="submit" form="judging-form" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset} disabled={isSubmitting}>
              Reset
            </Button>
          </Field>
        </CardFooter>
      )}
    </Card>
  );
};

export default JudgingForm;
