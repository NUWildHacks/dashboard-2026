"use client";

import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";

import { useJoinProjectForm } from "@/app/dashboard/project/_hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const JoinProjectDialog = () => {
  const { control, handleSubmit, onSubmit, isSubmitting, isOpen, setIsOpen } = useJoinProjectForm();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Join existing project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join existing project</DialogTitle>
          <DialogDescription>Please enter a valid invitation code</DialogDescription>
        </DialogHeader>
        <form id="join-project-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet disabled={isSubmitting}>
              <Controller
                name="invitation_code"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="sr-only">
                      Permission Code
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Enter your provided invitation code"
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
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Go back
            </Button>
          </DialogClose>
          <Button type="submit" form="join-project-form" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Join project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinProjectDialog;
