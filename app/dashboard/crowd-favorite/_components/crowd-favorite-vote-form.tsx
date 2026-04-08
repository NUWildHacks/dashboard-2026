"use client";

import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";

import { useCrowdFavoriteVoteForm } from "@/app/dashboard/crowd-favorite/_hooks/use-crowd-favorite-vote-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type VotingProjectOption = {
  id: string;
  project_name: string;
};

type CrowdFavoriteVoteFormProps = {
  projects: VotingProjectOption[];
  initialVotedProjectId?: string;
};

const CrowdFavoriteVoteForm = ({ projects, initialVotedProjectId }: CrowdFavoriteVoteFormProps) => {
  const {
    control,
    handleSubmit,
    isSubmitting,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    onPrepareSubmit,
    onConfirmSubmit,
    isEditingVote,
    handleEditVote,
    currentVotedProjectName,
  } = useCrowdFavoriteVoteForm({
    projects,
    initialVotedProjectId,
  });

  if (!isEditingVote && currentVotedProjectName) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your current crowd favorite vote</CardTitle>
          <CardDescription>You can update your vote while the voting window remains open.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            <span className="font-medium">Selected project:</span> {currentVotedProjectName}
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleEditVote}>Edit choice</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Vote for Crowd Favorite</CardTitle>
          <CardDescription>
            Enter the room password and submit your vote. Project names are the only visible options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="crowd-favorite-vote-form" onSubmit={handleSubmit(onPrepareSubmit)}>
            <FieldGroup>
              <FieldSet disabled={isSubmitting}>
                <Controller
                  name="crowd_favorite_password"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Crowd Favorite Password</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="text"
                        placeholder="Enter session password"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />

                <Controller
                  name="selected_project_id"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Selected Team or Project</FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid} className="w-full">
                          <SelectValue placeholder="Choose a project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.project_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />
              </FieldSet>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2">
          <p className="text-xs text-muted-foreground">
            While edits are allowed during the voting window, your final selection at close is the recorded result.
          </p>
          <Button type="submit" form="crowd-favorite-vote-form" disabled={isSubmitting || projects.length === 0}>
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Review vote"}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm your vote</DialogTitle>
            <DialogDescription>You can still edit your vote while the voting window is open.</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={onConfirmSubmit} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Submit vote"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CrowdFavoriteVoteForm;
