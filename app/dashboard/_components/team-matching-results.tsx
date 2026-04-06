"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserSuggestions } from "@/types";

type TeamMatchingResultsProps = {
  suggestions: UserSuggestions;
};

const TeamMatchingResults = ({ suggestions }: TeamMatchingResultsProps) => {
  const [index, setIndex] = useState(0);

  const items = suggestions.suggestions;
  const current = items[index];

  if (!current) return null;

  return (
    <Card className="shadow-xs h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Your team suggestions</CardTitle>
          <span className="text-xs text-muted-foreground">
            {index + 1} / {items.length}
          </span>
        </div>
        <p className="text-xs text-yellow-800 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-400/60 rounded-md px-3 py-2">
          Head to your designated meeting spot to connect with your matches!
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Suggestion {index + 1}
        </p>

        <div className="flex flex-col gap-2">
          {current.members.map((member) => (
            <div key={member.user_id} className="flex items-start gap-2">
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
          <div>
            <p className="text-xs font-medium mb-1">Why you were matched</p>
            <ul className="list-disc pl-4 space-y-0.5">
              {current.match_reasons.map((reason, i) => (
                <li key={i} className="text-xs text-muted-foreground">{reason}</li>
              ))}
            </ul>
          </div>
        )}

        {current.where_to_meet && (
          <div className="rounded-md border p-3">
            <p className="text-xs font-medium">Where to meet</p>
            <p className="text-sm mt-0.5">{current.where_to_meet}</p>
          </div>
        )}
      </CardContent>

      {items.length > 1 && (
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
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`size-2 rounded-full transition-colors ${i === index ? "bg-primary" : "bg-muted-foreground/30"}`}
                aria-label={`Suggestion ${i + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
            disabled={index === items.length - 1}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default TeamMatchingResults;
