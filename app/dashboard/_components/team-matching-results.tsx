"use client";

import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import Discord from "@/components/icon/discord";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DISCORD_TEAM_PATH } from "@/constants";
import type { TeamSuggestion } from "@/types";

const AVATAR_COLORS = [
  { bg: "bg-teal-100", text: "text-teal-800" },
  { bg: "bg-blue-100", text: "text-blue-800" },
  { bg: "bg-violet-100", text: "text-violet-800" },
  { bg: "bg-purple-100", text: "text-purple-800" },
  { bg: "bg-amber-100", text: "text-amber-800" },
  { bg: "bg-rose-100", text: "text-rose-800" },
];
 
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
          <CardDescription className="text-sm text-muted-foreground">Open to find your top 3 groups!</CardDescription>
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
      <CardHeader className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-base">Team Matching Results</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Open to find your top 3 groups!</CardDescription>
          </div>
          <CardDescription className="text-xs text-muted-foreground shrink-0">{index + 1} / {total}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        {isDiscordCard ? (
          <Card className="shadow-md flex flex-col gap-4 justify-center align-middle py-12">
            <CardHeader className="text-center">
              <CardTitle className="font-normal text-md">
                If none of your matches worked out, feel free to check the team formation channel on the Discord!
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              <Button variant="outline" className="w-fit gap-2" asChild>
                <a href={DISCORD_TEAM_PATH} target="_blank" rel="noopener noreferrer">
                  <Discord className="size-4" />
                  #find-teammates
                </a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-md flex flex-col gap-4">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Match {index + 1} 
              </CardTitle>
              <Badge variant="secondary" className="inline-flex items-baseline gap-0.5 bg-green-50 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                {current.score}
                <span className="text-green-600 font-normal">/ 100</span>
                </Badge>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                {current.members.map((member, i) => (
                  <div key={member.user_id} className="flex gap-2 items-start">
                    <Avatar>
                      <AvatarFallback className={`text-sm font-medium w-10 h-10 rounded-full flex items-center justify-center ${AVATAR_COLORS[i % AVATAR_COLORS.length].bg} ${AVATAR_COLORS[i % AVATAR_COLORS.length].text}`}>
                        {member.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-sm font-medium leading-tight">{member.name}</span>

                      <div className="flex flex-wrap gap-1">
                        {member.roles.map((role) => (
                          <Badge key={role} variant="secondary" className="text-xs font-normal px-1.5 py-0">
                            {role.replace(" Engineer", "").replace(" Scientist", "")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                ))}
              </div>

              <div className="border-t" />

              {current.match_reasons.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Why we matched you</p>
                  <div className="flex flex-wrap gap-1.5">
                    {current.match_reasons.map((reason, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-muted text-muted-foreground"
                      >
                        <span className="text-[10px]">✓</span>
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t" />

              {current.where_to_meet && (
                <div className="flex items-center justify-between bg-muted/50 rounded-md px-3 py-2.5">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground">Meet your team at</p>
                    <p className="text-sm font-medium">{current.where_to_meet}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
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
