"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import { Controller } from "react-hook-form";

import { useCrowdFavoriteOptInForm } from "@/app/dashboard/crowd-favorite/_hooks";
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
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { CROWD_FAVORITE_MAX_ADDITIONAL_MEMBERS, CROWD_FAVORITE_MAX_TEAM_MEMBERS } from "../constants";

type CrowdFavoriteOptInFormProps = {
  callerFirstName: string;
  callerEmail: string;
};

const CrowdFavoriteOptInForm = ({ callerFirstName, callerEmail }: CrowdFavoriteOptInFormProps) => {
  const {
    control,
    fields,
    handleSubmit,
    isSubmitting,
    isDirty,
    isValidatingMembers,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    onPrepareSubmit,
    onConfirmSubmit,
    handleAddTeamMember,
    handleReset,
    remove,
    displayedTeamMembers,
  } = useCrowdFavoriteOptInForm({ callerFirstName, callerEmail });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Opt into Crowd Favorite</CardTitle>
          <CardDescription>
            Submit once for your whole team. Max {CROWD_FAVORITE_MAX_TEAM_MEMBERS} members total including you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="crowd-favorite-opt-in-form" onSubmit={handleSubmit(onPrepareSubmit)}>
            <FieldGroup>
              <FieldSet disabled={isSubmitting || isValidatingMembers}>
                <Controller
                  name="project_name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="after:ml-0.5 after:text-red-500 after:content-['*']">
                        Project Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="Enter your project name"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />

                <Controller
                  name="devpost_url"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="after:ml-0.5 after:text-red-500 after:content-['*']">
                        Devpost URL
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="https://example.devpost.com"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FieldLabel>Team Member Emails</FieldLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddTeamMember}
                      disabled={fields.length >= CROWD_FAVORITE_MAX_ADDITIONAL_MEMBERS}
                    >
                      <Plus className="size-4" />
                      Add member
                    </Button>
                  </div>
                  <FieldDescription>
                    Add up to {CROWD_FAVORITE_MAX_ADDITIONAL_MEMBERS} teammates. We validate each email before submit.
                  </FieldDescription>

                  {fields.length === 0 && (
                    <p className="text-sm text-muted-foreground">No teammate emails added yet.</p>
                  )}

                  {fields.map((member, index) => (
                    <Controller
                      key={member.id}
                      name={`team_members.${index}.email`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <div className="flex gap-2">
                            <Input
                              {...field}
                              id={`team-member-${index}`}
                              placeholder="teammate@school.edu"
                              aria-invalid={fieldState.invalid}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => remove(index)}
                              aria-label={`Remove teammate ${index + 1}`}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} className="w-full text-start" />
                          )}
                        </Field>
                      )}
                    />
                  ))}
                </div>
              </FieldSet>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" disabled={isSubmitting || !isDirty} onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit" form="crowd-favorite-opt-in-form" disabled={isSubmitting || isValidatingMembers}>
            {isSubmitting || isValidatingMembers ? <Loader2 className="size-4 animate-spin" /> : "Review submission"}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm team opt-in</DialogTitle>
            <DialogDescription>
              This action updates crowd favorite status for all members listed below. Everyone will see the same team
              status.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 text-sm">
            <p className="font-medium">Validated team members</p>
            <ul className="space-y-1 text-muted-foreground">
              {displayedTeamMembers.map((member) => (
                <li key={member.email}>
                  {member.first_name} &lt;{member.email}&gt;
                </li>
              ))}
            </ul>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onConfirmSubmit}>Confirm opt-in</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CrowdFavoriteOptInForm;
