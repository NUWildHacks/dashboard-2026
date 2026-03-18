"use client";

import { AlertCircle, CheckCircle2, Loader2, RefreshCcw, Ticket, UtensilsCrossed } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { QRScanner, type QRScannerError } from "@/components/qr-scanner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEventTimeRange, getSendTime, getTimeFromMilliseconds } from "@/lib";
import type { Role } from "@/types";

import { getRecentEventCheckIns, getRecentMealExchanges, processCheckIn, processMealExchange } from "../_actions";
import type { CheckInEventOption, CheckInMode } from "../types";

type CheckInConsoleProps = {
  events: CheckInEventOption[];
};

type FeedbackTone = "success" | "warning" | "error";

type ScanFeedback = {
  tone: FeedbackTone;
  title: string;
  description: string;
  timestamp: number;
};

type RecentActivityItem = {
  id: string;
  userId: string;
  email?: string;
  role?: Role;
  processedAt: number;
};

const DUPLICATE_SCAN_WINDOW_MS = 1500;
const RECENT_ACTIVITY_LIMIT = 12;

const getModeLabel = (mode: CheckInMode): string => {
  return mode === "check-in" ? "Event check-in" : "Meal exchange";
};

const formatRoleLabel = (role: Role | undefined): string => {
  if (!role) return "Unknown role";

  const normalizedRole = role.toLowerCase().replaceAll("_", " ");
  return normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1);
};

const CheckInConsole = ({ events }: CheckInConsoleProps) => {
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id ?? "");
  const [mode, setMode] = useState<CheckInMode>("check-in");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshingRecent, setIsRefreshingRecent] = useState(false);
  const [feedback, setFeedback] = useState<ScanFeedback | null>(null);
  const [lastScannedValue, setLastScannedValue] = useState("");
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);

  const inFlightScanRef = useRef(false);
  const lastSubmissionRef = useRef<{ key: string; at: number } | null>(null);

  useEffect(() => {
    if (!events.length) {
      setSelectedEventId("");
      return;
    }

    const selectedEventExists = events.some((event) => event.id === selectedEventId);
    if (!selectedEventExists) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  const selectedEvent = useMemo(() => {
    return events.find((event) => event.id === selectedEventId);
  }, [events, selectedEventId]);

  const refreshRecentActivity = useCallback(async (eventId: string, selectedMode: CheckInMode) => {
    if (!eventId) {
      setRecentActivity([]);
      return;
    }

    setIsRefreshingRecent(true);

    try {
      if (selectedMode === "check-in") {
        const result = await getRecentEventCheckIns({ eventId, limitCount: RECENT_ACTIVITY_LIMIT });

        if (!result.success) {
          setRecentActivity([]);
          setFeedback({
            tone: "error",
            title: "Unable to load recent check-ins",
            description: result.error ?? "Please try refreshing recent activity.",
            timestamp: Date.now(),
          });
          return;
        }

        const activity = (result.check_ins ?? []).map((checkIn) => ({
          id: checkIn.id,
          userId: checkIn.user_id,
          email: checkIn.scan_payload.email,
          role: checkIn.scan_payload.role,
          processedAt: checkIn.checked_in_at,
        }));

        setRecentActivity(activity);
        return;
      }

      const result = await getRecentMealExchanges({ eventId, limitCount: RECENT_ACTIVITY_LIMIT });

      if (!result.success) {
        setRecentActivity([]);
        setFeedback({
          tone: "error",
          title: "Unable to load recent meal exchanges",
          description: result.error ?? "Please try refreshing recent activity.",
          timestamp: Date.now(),
        });
        return;
      }

      const activity = (result.meal_exchanges ?? []).map((mealExchange) => ({
        id: mealExchange.id,
        userId: mealExchange.user_id,
        email: mealExchange.scan_payload.email,
        role: mealExchange.scan_payload.role,
        processedAt: mealExchange.exchanged_at,
      }));

      setRecentActivity(activity);
    } catch (error) {
      setRecentActivity([]);
      setFeedback({
        tone: "error",
        title: "Unable to load recent activity",
        description: error instanceof Error ? error.message : "An unknown error occurred while loading activity.",
        timestamp: Date.now(),
      });
    } finally {
      setIsRefreshingRecent(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedEventId) {
      setRecentActivity([]);
      return;
    }

    void refreshRecentActivity(selectedEventId, mode);
  }, [mode, refreshRecentActivity, selectedEventId]);

  const handleScan = useCallback(
    async (scanPayload: string) => {
      const normalizedPayload = scanPayload.trim();
      if (!normalizedPayload) return;

      if (!selectedEventId) {
        setFeedback({
          tone: "error",
          title: "Select an event first",
          description: "Please choose an event before scanning QR codes.",
          timestamp: Date.now(),
        });
        return;
      }

      if (inFlightScanRef.current) return;

      const submissionKey = `${mode}:${selectedEventId}:${normalizedPayload}`;
      const now = Date.now();
      const previousSubmission = lastSubmissionRef.current;

      if (
        previousSubmission &&
        previousSubmission.key === submissionKey &&
        now - previousSubmission.at < DUPLICATE_SCAN_WINDOW_MS
      ) {
        return;
      }

      lastSubmissionRef.current = { key: submissionKey, at: now };

      inFlightScanRef.current = true;
      setIsSubmitting(true);
      setLastScannedValue(normalizedPayload);

      try {
        if (mode === "check-in") {
          const result = await processCheckIn({ eventId: selectedEventId, scanPayload: normalizedPayload });
          const errorMessage = !result.success ? result.error : "Unable to process this QR code.";

          if (!result.success || !result.check_in) {
            setFeedback({
              tone: "error",
              title: "Check-in failed",
              description: errorMessage,
              timestamp: Date.now(),
            });
            return;
          }

          const userDisplay = result.check_in.scan_payload.email ?? result.check_in.user_id;

          setFeedback({
            tone: result.already_checked_in ? "warning" : "success",
            title: result.already_checked_in ? "Already checked in" : "Check-in successful",
            description: result.already_checked_in
              ? `${userDisplay} was already checked in for this event.`
              : `${userDisplay} has been checked in successfully.`,
            timestamp: Date.now(),
          });
        } else {
          const result = await processMealExchange({ eventId: selectedEventId, scanPayload: normalizedPayload });
          const errorMessage = !result.success ? result.error : "Unable to process this QR code.";

          if (!result.success || !result.meal_exchange) {
            setFeedback({
              tone: "error",
              title: "Meal exchange failed",
              description: errorMessage,
              timestamp: Date.now(),
            });
            return;
          }

          const userDisplay = result.meal_exchange.scan_payload.email ?? result.meal_exchange.user_id;

          setFeedback({
            tone: result.already_exchanged ? "warning" : "success",
            title: result.already_exchanged ? "Meal already exchanged" : "Meal exchange successful",
            description: result.already_exchanged
              ? `${userDisplay} already exchanged a meal for this event.`
              : `${userDisplay} can now receive a meal.`,
            timestamp: Date.now(),
          });
        }

        await refreshRecentActivity(selectedEventId, mode);
      } catch (error) {
        setFeedback({
          tone: "error",
          title: "Unable to process scan",
          description: error instanceof Error ? error.message : "An unknown error occurred while processing the scan.",
          timestamp: Date.now(),
        });
      } finally {
        inFlightScanRef.current = false;
        setIsSubmitting(false);
      }
    },
    [mode, refreshRecentActivity, selectedEventId]
  );

  const handleScannerError = useCallback((scannerError: QRScannerError, message: string) => {
    const title = scannerError === "PERMISSION_DENIED" ? "Camera permission required" : "Scanner unavailable";

    setFeedback({
      tone: "error",
      title,
      description: message,
      timestamp: Date.now(),
    });
  }, []);

  const feedbackAlertClassName =
    feedback?.tone === "success"
      ? "border-emerald-300 text-emerald-900 [&>svg]:text-emerald-700"
      : feedback?.tone === "warning"
        ? "border-amber-300 text-amber-900 [&>svg]:text-amber-700"
        : undefined;

  const hasEventSchedule = !!selectedEvent && selectedEvent.start_time > 0 && selectedEvent.end_time > 0;

  const truncatedScanPayload = lastScannedValue.length > 96 ? `${lastScannedValue.slice(0, 96)}...` : lastScannedValue;

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="size-4" />
              Admin check-in console
            </CardTitle>
            <CardDescription>
              Select an event, choose a mode, and scan attendee QR codes for {getModeLabel(mode).toLowerCase()}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium">Event</p>
                <Select
                  value={selectedEventId}
                  onValueChange={setSelectedEventId}
                  disabled={!events.length || isSubmitting || isRefreshingRecent}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Mode</p>
                <Tabs value={mode} onValueChange={(nextMode) => setMode(nextMode as CheckInMode)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="check-in">
                      <Ticket />
                      Check-in
                    </TabsTrigger>
                    <TabsTrigger value="meal-exchange">
                      <UtensilsCrossed />
                      Meal
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {selectedEvent && (
              <div className="rounded-lg border bg-muted/40 px-3 py-2">
                <p className="text-sm font-medium">{selectedEvent.title}</p>
                <p className="text-xs text-muted-foreground">
                  {hasEventSchedule
                    ? getEventTimeRange(selectedEvent.start_time, selectedEvent.end_time)
                    : "Schedule TBD"}
                  {selectedEvent.location ? ` • ${selectedEvent.location}` : ""}
                </p>
              </div>
            )}

            {!events.length && (
              <Alert>
                <AlertCircle />
                <AlertTitle>No events available</AlertTitle>
                <AlertDescription>Create or import schedule events before scanning attendees.</AlertDescription>
              </Alert>
            )}

            {feedback && (
              <Alert variant={feedback.tone === "error" ? "destructive" : "default"} className={feedbackAlertClassName}>
                {feedback.tone === "error" ? <AlertCircle /> : <CheckCircle2 />}
                <AlertTitle>{feedback.title}</AlertTitle>
                <AlertDescription>
                  <p>{feedback.description}</p>
                  <p className="text-xs">Updated {getSendTime(feedback.timestamp)}</p>
                </AlertDescription>
              </Alert>
            )}

            {events.length > 0 && (
              <>
                <QRScanner
                  onScan={handleScan}
                  onError={handleScannerError}
                  debounceMs={700}
                  enabled={!!selectedEventId}
                />
                <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                  <p>
                    Last payload: <span className="font-mono">{truncatedScanPayload || "No scans yet"}</span>
                  </p>
                  {isSubmitting && (
                    <span className="inline-flex items-center gap-1">
                      <Loader2 className="size-3 animate-spin" />
                      Processing
                    </span>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle>Recent activity</CardTitle>
                <CardDescription>
                  Latest {getModeLabel(mode).toLowerCase()} records for the selected event.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={!selectedEventId || isRefreshingRecent}
                onClick={() => void refreshRecentActivity(selectedEventId, mode)}
              >
                {isRefreshingRecent ? <Loader2 className="size-4 animate-spin" /> : <RefreshCcw className="size-4" />}
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {!selectedEventId && (
              <p className="text-sm text-muted-foreground">Select an event to load recent activity.</p>
            )}

            {selectedEventId && !isRefreshingRecent && recentActivity.length === 0 && (
              <p className="text-sm text-muted-foreground">No recent activity yet for this mode.</p>
            )}

            {recentActivity.map((activityItem) => (
              <div key={activityItem.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{activityItem.email ?? activityItem.userId}</p>
                  <Badge variant="secondary">{mode === "check-in" ? "Checked in" : "Meal exchanged"}</Badge>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                  <span>ID: {activityItem.userId}</span>
                  <span>{formatRoleLabel(activityItem.role)}</span>
                  <span>{getSendTime(activityItem.processedAt)}</span>
                  <span>{getTimeFromMilliseconds(activityItem.processedAt)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckInConsole;
