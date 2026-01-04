"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { WildHacksStatistics } from "@/types/wildhacks.types";

const chartConfig = {
  count: {
    label: "Count",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

type StatisticsProps = WildHacksStatistics;

const Statistics = ({ participants, judges, admins, projects, submissions }: StatisticsProps) => {
  const chartData = [
    { item: "Participants", count: participants },
    { item: "Judges", count: judges },
    { item: "Admins", count: admins },
    { item: "Projects", count: projects },
    { item: "Submissions", count: submissions },
  ];

  return (
    <Card className="shadow-xs row-span-3 md:col-span-2">
      <CardHeader>
        <CardTitle>Event Statistics</CardTitle>
        <CardDescription>
          WildHacks by the numbers. Track participant counts, judge availability, submitted projects, and more in
          real-time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: -10,
            }}
          >
            <XAxis type="number" dataKey="count" hide />
            <YAxis
              dataKey="item"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default Statistics;
