"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import Discord from "@/components/icon/discord";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DISCORD_INVITE_PATH } from "@/constants";
import type { TeamSuggestion } from "@/types";

const TeamMatchingResults = ({ suggestions }: { suggestions: TeamSuggestion[] }) => {
  const [revealed, setRevealed] = useState(false);
  const [index, setIndex] = useState(0);

  // suggestions + 1 Discord fallback card
  const total = suggestions.length + 1;
  const isDiscordCard = index === suggestions.length;
  const current = suggestions[index];

  if (!revealed) {
    return (
      <Card className="shadow-xs h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-base">Team Matching Results</CardTitle>
          <p className="text-sm text-muted-foreground">Open to find your top 3 groups!</p>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <Button onClick={() => setRevealed(true)}>
            See your results
          </Button>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Results available until Sunday 11AM (submission deadline)
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="shadow-xs h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Team Matching Results</CardTitle>
          <span className="text-xs text-muted-foreground shrink-0">{index + 1} / {total}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        {isDiscordCard ? (
          <div className="flex flex-col gap-3 justify-center flex-1">
            <p className="text-sm text-muted-foreground">
              If none of your matches worked out, feel free to check the team formation channel on the Discord!
            </p>
            <Button variant="outline" className="w-fit gap-2" asChild>
              <a href={DISCORD_INVITE_PATH} target="_blank" rel="noopener noreferrer">
                <Discord className="size-4" />
                #team-formation
              </a>
            </Button>
          </div>
        ) : (
          <>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {index === 0 ? "Your Team" : `Suggestion ${index}`}
            </p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {current.members.map((member) => (
                <div key={member.user_id} className="flex flex-col gap-1">
                  <span className="text-sm font-medium">{member.name}</span>
                  <div className="flex flex-wrap gap-1">
                    {member.roles.map((role) => (
                      <Badge key={role} variant="secondary" className="text-xs">
                        {role.replace(" Engineer", "").replace(" Scientist", "")}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {current.match_reasons.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium">Why we matched you:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  {current.match_reasons.map((reason, i) => (
                    <li key={i} className="text-xs text-muted-foreground">{reason}</li>
                  ))}
                </ul>
              </div>
            )}

            {current.where_to_meet && (
              <div className="rounded-md border p-3">
                <p className="text-xs font-medium">Meet your team at:</p>
                <p className="text-sm mt-0.5">{current.where_to_meet}</p>
              </div>
            )}
          </>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>

        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`size-2 rounded-full transition-colors ${i === index ? "bg-primary" : "bg-muted-foreground/30"}`}
              aria-label={i === suggestions.length ? "Discord fallback" : i === 0 ? "Your Team" : `Suggestion ${i}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
          disabled={index === total - 1}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeamMatchingResults;
