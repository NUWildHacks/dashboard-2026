"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MENTORING_TIMESLOTS } from "@/constants";
import type { JudgeAndMentorUser, MentoringTimeslot } from "@/types";

import { useMentoringTimeslotRadioGroup } from "../_hooks";

type MentoringTimeslotRadioGroupProps = {
  mentoring_timeslot: JudgeAndMentorUser["mentoring_timeslot"];
};

const MentoringTimeslotRadioGroup = ({ mentoring_timeslot }: MentoringTimeslotRadioGroupProps) => {
  const { selectedMentoringTimeslot, setSelectedMentoringTimeslot, onSubmit, isSubmitting } =
    useMentoringTimeslotRadioGroup(mentoring_timeslot);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Mentoring Timeslot</CardTitle>
        <CardDescription>Select which timeslot that you will be available for mentoring.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <RadioGroup
          value={selectedMentoringTimeslot}
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
      <CardFooter className="flex justify-end">
        <Button type="button" onClick={onSubmit} disabled={isSubmitting || !selectedMentoringTimeslot}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirm selection"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MentoringTimeslotRadioGroup;
