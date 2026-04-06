"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { WildHacksStatistics } from "@/types";

const chartConfig = {
  value: { label: "Users" },
  participants: { label: "Participants", color: "var(--chart-1)" },
  judges: { label: "Judges", color: "var(--chart-2)" },
  mentors: { label: "Mentors", color: "var(--chart-3)" },
  admins: { label: "Admins", color: "var(--chart-4)" },
} satisfies ChartConfig;

type StatisticsProps = WildHacksStatistics;

const Statistics = ({ participants, judges, mentors, admins, projects, submissions }: StatisticsProps) => {
  const id = "pie-statistics";

  const pieData = React.useMemo(
    () => [
      { name: "participants", value: participants, fill: "var(--color-participants)" },
      { name: "judges", value: judges, fill: "var(--color-judges)" },
      { name: "mentors", value: mentors, fill: "var(--color-mentors)" },
      { name: "admins", value: admins, fill: "var(--color-admins)" },
    ],
    [participants, judges, mentors, admins]
  );

  const [activeName, setActiveName] = React.useState(pieData[0].name);

  const activeIndex = pieData.findIndex((item) => item.name === activeName);

  const activeShape = ({ outerRadius = 0, ...props }: PieSectorDataItem) => (
    <g>
      <Sector {...props} outerRadius={outerRadius + 10} />
      <Sector {...props} outerRadius={outerRadius + 25} innerRadius={outerRadius + 12} />
    </g>
  );

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Event Statistics</CardTitle>
          <CardDescription>User breakdown and project progress.</CardDescription>
        </div>
        <Select value={activeName} onValueChange={setActiveName}>
          <SelectTrigger className="ml-auto h-7 w-[130px] rounded-lg pl-2.5" aria-label="Select a role">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {pieData.map(({ name }) => {
              const config = chartConfig[name as keyof typeof chartConfig];
              if (!config) return null;
              return (
                <SelectItem key={name} value={name} className="rounded-lg [&_span]:flex">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{ backgroundColor: `var(--color-${name})` }}
                    />
                    {config.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer id={id} config={chartConfig} className="mx-auto aspect-square w-full max-w-[300px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={activeShape}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {pieData[activeIndex].value.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          {chartConfig[activeName as keyof typeof chartConfig].label}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <div className="grid grid-cols-2 gap-3 px-6 pb-6 pt-4">
        <div className="flex flex-col items-center justify-center rounded-lg bg-muted/50 p-4 text-center">
          <span className="text-3xl font-bold">{projects}</span>
          <span className="mt-1 text-xs text-muted-foreground">Projects</span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg bg-muted/50 p-4 text-center">
          <span className="text-3xl font-bold">{submissions}</span>
          <span className="mt-1 text-xs text-muted-foreground">Submissions</span>
        </div>
      </div>
    </Card>
  );
};

export default Statistics;
