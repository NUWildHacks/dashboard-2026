"use client";

import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

import Discord from "@/components/icon/discord";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { db } from "@/config/firebase-client";
import { DISCORD_INVITE_PATH, WILDHACKS_COLLECTION, WILDHACKS_CONFIG_DOC } from "@/constants";
import type { TeamSuggestion } from "@/types";

import { getParticipantSuggestions } from "../_actions/get-participant-suggestions.actions";

import TeamMatchingIntake from "./team-matching-intake";
import TeamMatchingResults from "./team-matching-results";


type Props = {
  hasSubmitted: boolean;
  initialReleased: boolean;
  initialSuggestions: TeamSuggestion[];
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  fieldOfStudy: string;
  eventStartTime: number;
};

export const TeamMatchingGate = ({
  hasSubmitted,
  initialReleased,
  initialSuggestions,
  ...intakeProps
}: Props) => {
  const [released, setReleased] = useState(initialReleased);
  const [suggestions, setSuggestions] = useState<TeamSuggestion[]>(initialSuggestions);
  // Track whether we've already fetched so we don't re-fetch on every snapshot
  const fetchedRef = useRef(initialSuggestions.length > 0);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, WILDHACKS_COLLECTION, WILDHACKS_CONFIG_DOC),
      async (snap) => {
        const newReleased: boolean = snap.data()?.results_released ?? false;
        setReleased(newReleased);

        if (newReleased && hasSubmitted && !fetchedRef.current) {
          fetchedRef.current = true;
          const result = await getParticipantSuggestions();
          setSuggestions(result);
        }

        if (!newReleased) {
          fetchedRef.current = false;
          setSuggestions([]);
        }
      }
    );
    return unsub;
  }, [hasSubmitted]);

  if (hasSubmitted && released && suggestions.length > 0) {
    return <TeamMatchingResults suggestions={suggestions} />;
  } 

  if (!hasSubmitted && released) {
    return (
      <Card className="shadow-xs h-full flex flex-col">
          <CardHeader>
            <CardTitle>Team matching has closed</CardTitle>
            <CardDescription>
              If you&apos;re still looking for a team, head to Discord — that&apos;s where teams are forming now.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <Button variant="outline" className="w-fit gap-2" asChild>
              <a href={DISCORD_INVITE_PATH} target="_blank" rel="noopener noreferrer">
                <Discord className="size-4" />
                #team-formation
              </a>
            </Button>
          </CardContent>
        </Card>
    )
  }

  return <TeamMatchingIntake hasSubmitted={hasSubmitted} {...intakeProps} />;
};
