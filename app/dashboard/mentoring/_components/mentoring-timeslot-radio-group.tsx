"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MENTORING_TIMESLOTS } from "@/constants";
import type { JudgeAndMentorUser, MentoringTimeslot } from "@/types";

import { useMentoringTimeslotRadioGroup } from "../_hooks";
import { TIMESLOT_CONFIRMATION_DEADLINE } from "../constants";

type MentoringTimeslotRadioGroupProps = {
  modality: JudgeAndMentorUser["modality"];
  mentoring_timeslot: JudgeAndMentorUser["mentoring_timeslot"];
};

const MentoringTimeslotRadioGroup = ({ modality, mentoring_timeslot }: MentoringTimeslotRadioGroupProps) => {
  const { selectedMentoringTimeslot, setSelectedMentoringTimeslot, onSubmit, isSubmitting } =
    useMentoringTimeslotRadioGroup(mentoring_timeslot);

  const isTimeslotConfirmationDeadlinePassed = new Date().getTime() > TIMESLOT_CONFIRMATION_DEADLINE;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentoring Timeslot</CardTitle>
        <CardDescription>
          <div className="space-y-1">
            <p>You have been assigned to a mentoring timeslot. If you wish to change it, you can do so by selecting a different timeslot below.</p>
            <p>
              Keep in mind that mentoring will happen on <span className="font-bold underline underline-offset-4">Saturday, April 11th</span> and you must confirm a
              timeslot by <span className="font-bold underline underline-offset-4">Wednesday, April 6th, 11:59 PM CT.</span>
            </p>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <RadioGroup
          value={selectedMentoringTimeslot}
          disabled={isTimeslotConfirmationDeadlinePassed || isSubmitting}
          onValueChange={(value: string) => setSelectedMentoringTimeslot(value as MentoringTimeslot)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {MENTORING_TIMESLOTS.map((timeslot: MentoringTimeslot) => (
            <FieldLabel htmlFor={timeslot} key={timeslot} className="col-span-1">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{timeslot}</FieldTitle>
                </FieldContent>
                <RadioGroupItem value={timeslot} id={timeslot} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
        {modality === "In-Person" && <p className="text-sm text-muted-foreground">Because you have selected to be in-person, we expect you to be present at the venue during your assigned timeslot.</p>}
        {modality === "Remote" && <p className="text-sm text-muted-foreground">Because you have selected to be remote, we expect you to be available via our Discord server during your assigned timeslot.</p>}
      </CardContent>
      <CardFooter className="flex justify-end items-center gap-4">
        {isTimeslotConfirmationDeadlinePassed && (
          <p className="text-sm text-muted-foreground">
            The timeslot confirmation deadline has passed. Please contact the organizers if you need to update your
            timeslot.
          </p>
        )}
        <Button type="button" onClick={onSubmit} disabled={isTimeslotConfirmationDeadlinePassed || isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirm selection"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MentoringTimeslotRadioGroup;
