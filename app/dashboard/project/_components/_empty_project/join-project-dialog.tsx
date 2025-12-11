"use client";

import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";

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
import User from "@/types/user";
import { WildHacksConfig } from "@/types/wildhacks";

import useJoinProjectForm from "../../_hooks/use-join-project-form";

type JoinProjectDialogProps = {
  userId: User["id"];
  maxTeamSize: WildHacksConfig["max_team_size"];
};

const JoinProjectDialog = ({ userId, maxTeamSize }: JoinProjectDialogProps) => {
  const { control, handleSubmit, onSubmit, isSubmitting } = useJoinProjectForm(userId, maxTeamSize);

  return (
    <Dialog>
      <form id="join-project-form" onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button variant="outline">Join existing project</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join existing project</DialogTitle>
            <DialogDescription>Please enter your provided code to join a project</DialogDescription>
          </DialogHeader>
          <FieldSet disabled={isSubmitting}>
            <FieldGroup>
              <Controller
                name="join_code"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="sr-only">
                      Permission Code
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Enter your join code"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Go back
              </Button>
            </DialogClose>
            <Button type="submit" form="join-project-form" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 /> : "Join project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default JoinProjectDialog;
