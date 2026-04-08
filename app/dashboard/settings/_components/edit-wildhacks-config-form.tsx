"use client";

import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";

import DateTimePickerField from "@/components/form/datetime-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { WildHacksConfig } from "@/types";

import { useEditWildhacksConfigForm } from "../_hooks";

type EditWildhacksConfigFormProps = {
  wildhacksConfig: WildHacksConfig;
};

const EditWildhacksConfigForm = ({ wildhacksConfig }: EditWildhacksConfigFormProps) => {
  const { control, handleSubmit, onSubmit, isSubmitting, isDirty, handleReset, watch, setValue, getValues } =
    useEditWildhacksConfigForm(wildhacksConfig);

  const hasOptInStarted = watch("crowd_favorite_opt_in_started");
  const isOptInOpen = watch("crowd_favorite_opt_in_open");
  const hasVotingStarted = watch("crowd_favorite_voting_started");
  const isVotingOpen = watch("crowd_favorite_voting_open");

  const isOptInClosed = hasOptInStarted && !isOptInOpen;
  const isVotingClosed = hasVotingStarted && !isVotingOpen;

  const optInStatusText = !hasOptInStarted
    ? "Opt-in has not started yet."
    : isOptInOpen
      ? "Opt-in is currently open."
      : "Opt-in has closed.";

  const votingStatusText = !hasVotingStarted
    ? "Voting has not started yet."
    : isVotingOpen
      ? "Voting is currently open."
      : "Voting has closed.";

  const handleToggleOptIn = () => {
    if (isOptInOpen) {
      setValue("crowd_favorite_opt_in_open", false, { shouldDirty: true });
      return;
    }

    setValue("crowd_favorite_opt_in_started", true, { shouldDirty: true });
    setValue("crowd_favorite_opt_in_open", true, { shouldDirty: true });
  };

  const handleToggleVoting = () => {
    if (isVotingOpen) {
      setValue("crowd_favorite_voting_open", false, { shouldDirty: true });
      return;
    }

    if (!getValues("crowd_favorite_opt_in_started")) {
      return;
    }

    // Starting voting automatically closes opt-in to preserve phase ordering.
    setValue("crowd_favorite_opt_in_open", false, { shouldDirty: true });
    setValue("crowd_favorite_voting_started", true, { shouldDirty: true });
    setValue("crowd_favorite_voting_open", true, { shouldDirty: true });
  };

  return (
    <Card>
      <CardContent>
        <form id="edit-wildhacks-config-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet disabled={isSubmitting}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Controller
                  name="registration_deadline"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DateTimePickerField
                      label="Registration Deadline"
                      fieldName={field.name}
                      field={field}
                      fieldState={fieldState}
                    />
                  )}
                />
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

              <div className="mt-6 border-t pt-6">
                <h3 className="mb-4 text-sm font-semibold">Crowd Favorite Controls</h3>
                <p className="mb-4 text-xs text-muted-foreground">
                  Use these controls to toggle phases, then click Save changes to apply them.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-md border p-4">
                    <p className="text-sm font-medium">Crowd Favorite Opt-in</p>
                    <p className="mt-1 text-xs text-muted-foreground">{optInStatusText}</p>
                    <Button
                      type="button"
                      variant={isOptInOpen ? "destructive" : "default"}
                      className="mt-3"
                      onClick={handleToggleOptIn}
                    >
                      {!hasOptInStarted || isOptInClosed ? "Start crowd favorite opt-in" : "Stop crowd favorite opt-in"}
                    </Button>
                  </div>

                  <div className="rounded-md border p-4">
                    <p className="text-sm font-medium">Crowd Favorite Voting</p>
                    <p className="mt-1 text-xs text-muted-foreground">{votingStatusText}</p>
                    <Button
                      type="button"
                      variant={isVotingOpen ? "destructive" : "default"}
                      className="mt-3"
                      onClick={handleToggleVoting}
                      disabled={!hasOptInStarted}
                    >
                      {!hasVotingStarted || isVotingClosed
                        ? "Start crowd favorite voting"
                        : "Stop crowd favorite voting"}
                    </Button>
                    {!hasOptInStarted && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Start crowd favorite opt-in before enabling voting.
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Controller
                    name="crowd_favorite_password"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Crowd Favorite Voting Password</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          type="text"
                          placeholder="Enter voting password"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                      </Field>
                    )}
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Controller
                    name="max_team_size"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Max Team Size</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          type="number"
                          step={1}
                          disabled
                          readOnly
                          aria-invalid={fieldState.invalid}
                          className="bg-muted cursor-not-allowed"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="max_participants"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Max Participants</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          type="number"
                          step={1}
                          disabled
                          readOnly
                          aria-invalid={fieldState.invalid}
                          className="bg-muted cursor-not-allowed"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                      </Field>
                    )}
                  />
                </div>
              </div>
            </FieldSet>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="flex-row-reverse">
          <Button type="submit" form="edit-wildhacks-config-form" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Save changes"}
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
