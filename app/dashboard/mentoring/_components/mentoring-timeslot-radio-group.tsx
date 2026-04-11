"use client";

import { Info, Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IN_PERSON_MODALITY, MENTORING_TIMESLOTS, OTHER_MODALITY, REMOTE_MODALITY } from "@/constants";
import type { JudgeAndMentorUser, MentoringTimeslot } from "@/types";

import { useMentoringTimeslotRadioGroup } from "../_hooks";
import { TIMESLOT_CONFIRMATION_DEADLINE } from "../constants";

const formattedDeadline = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago",
  weekday: "long",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
}).format(new Date(TIMESLOT_CONFIRMATION_DEADLINE));

type MentoringTimeslotRadioGroupProps = Pick<JudgeAndMentorUser, "other_modality" | "modality" | "mentoring_timeslot">;

const MentoringTimeslotRadioGroup = ({
  other_modality,
  modality,
  mentoring_timeslot,
}: MentoringTimeslotRadioGroupProps) => {
  const { isEditing, setIsEditing, selectedMentoringTimeslot, setSelectedMentoringTimeslot, onSubmit, isSubmitting } =
    useMentoringTimeslotRadioGroup(mentoring_timeslot);

  const isTimeslotConfirmationDeadlinePassed = new Date().getTime() > TIMESLOT_CONFIRMATION_DEADLINE;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentoring Timeslot</CardTitle>
        <CardDescription>
          <div className="space-y-1">
            <p>
              You have been assigned to a mentoring timeslot. If you wish to change it, you can do so by selecting a
              different timeslot below.
            </p>
            <p>
              Keep in mind that mentoring will happen on{" "}
              <span className="font-bold underline underline-offset-4">Saturday, April 11th</span> and you must confirm
              a timeslot by <span className="font-bold underline underline-offset-4">{formattedDeadline}.</span>
            </p>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Alert>
          <Info />
          <AlertTitle className="flex items-center gap-2">
            <p className="text-sm">Your modality: </p>
            <Badge>{modality === OTHER_MODALITY ? other_modality : modality}</Badge>
          </AlertTitle>
          <AlertDescription>
            {modality === IN_PERSON_MODALITY && (
              <p>
                Because you have selected to be in-person, we expect you to be present at the venue from{" "}
                <span className="font-bold underline underline-offset-4">{mentoring_timeslot}</span>.
              </p>
            )}
            {modality === REMOTE_MODALITY && (
              <p>
                Because you have selected to be remote, we expect you to be available via our Discord server from{" "}
                <span className="font-bold underline underline-offset-4">{mentoring_timeslot}</span>.
              </p>
            )}
          </AlertDescription>
        </Alert>
        <RadioGroup
          value={selectedMentoringTimeslot}
          disabled={isTimeslotConfirmationDeadlinePassed || isSubmitting || !isEditing}
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
      </CardContent>
      <CardFooter className="flex justify-end items-center gap-4">
        {isTimeslotConfirmationDeadlinePassed && (
          <p className="text-sm text-muted-foreground">
            The timeslot confirmation deadline has passed. Please contact the organizers if you need to update your
            timeslot.
          </p>
        )}
        {isEditing ? (
          <>
            <Button type="button" onClick={() => setIsEditing(false)} variant="outline">
              Cancel
            </Button>
            <Button type="submit" onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirm selection"}
            </Button>
          </>
        ) : (
          <Button type="button" onClick={() => setIsEditing(true)} disabled={isTimeslotConfirmationDeadlinePassed}>
            Edit timeslot
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MentoringTimeslotRadioGroup;
