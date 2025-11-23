import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EventStatistics() {
  return (
    <Card className="row-span-3 md:col-span-2">
      <CardHeader>
        <CardTitle>Event Statistics</CardTitle>
        <CardDescription>WildHacks by the numbers.</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
