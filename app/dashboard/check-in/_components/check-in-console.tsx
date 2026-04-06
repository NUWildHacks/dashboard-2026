"use client";

import { AlertCircle, Camera, CameraOff, Loader2, RefreshCcw, Ticket, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { QRScanner, type QRScannerError } from "@/components/qr-scanner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEventTimeRange, getSendTime, getTimeFromMilliseconds } from "@/lib";
import type { Role } from "@/types";

import { getRecentEventCheckIns, processCheckIn, WILDHACKS_EVENT_ID } from "../_actions";
import type { CheckInEventOption } from "../types";

type CheckInConsoleProps = {
  events: CheckInEventOption[];
};

type RecentActivityItem = {
  id: string;
  userId: string;
  fullName?: string;
  email?: string;
  role?: Role;
  processedAt: number;
};

const DUPLICATE_SCAN_WINDOW_MS = 1500;
const RECENT_ACTIVITY_LIMIT = 12;

const cToast = {
  success: (title: string, opts: { description?: string } = {}) =>
    toast.success(title, {
      ...opts,
      style: { background: "#16a34a", color: "white", border: "1px solid #15803d" },
      classNames: { description: "text-green-100!" },
    }),
  error: (title: string, opts: { description?: string } = {}) =>
    toast.error(title, {
      ...opts,
      style: { background: "#dc2626", color: "white", border: "1px solid #b91c1c" },
      classNames: { description: "text-red-100!" },
    }),
  warning: (title: string, opts: { description?: string } = {}) =>
    toast.warning(title, {
      ...opts,
      style: { background: "#d97706", color: "white", border: "1px solid #b45309" },
      classNames: { description: "text-amber-100!" },
    }),
};

const formatRoleLabel = (role: Role | undefined): string => {
  if (!role) return "Unknown role";

  const normalizedRole = role.toLowerCase().replaceAll("_", " ");
  return normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1);
};

const CheckInConsole = ({ events }: CheckInConsoleProps) => {
  const [checkInMode, setCheckInMode] = useState<"event" | "wildhacks">("event");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [isScannerEnabled, setIsScannerEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshingRecent, setIsRefreshingRecent] = useState(false);
  const [lastScannedValue, setLastScannedValue] = useState("");
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);

  const inFlightScanRef = useRef(false);
  const lastSubmissionRef = useRef<{ key: string; at: number } | null>(null);

  // Effective event ID based on mode
  const effectiveEventId = checkInMode === "wildhacks" ? WILDHACKS_EVENT_ID : selectedEventId;

  useEffect(() => {
    if (checkInMode === "wildhacks") {
      setSelectedEventId("");
      return;
    }

    if (!events.length) {
      setSelectedEventId("");
      setIsScannerEnabled(false);
      return;
    }

    const selectedEventExists = events.some((event) => event.id === selectedEventId);
    if (!selectedEventExists && selectedEventId !== "") {
      setSelectedEventId("");
      setIsScannerEnabled(false);
    }
  }, [events, selectedEventId, checkInMode]);

  useEffect(() => {
    if (!effectiveEventId) {
      setIsScannerEnabled(false);
    }
  }, [effectiveEventId]);

  const selectedEvent = useMemo(() => {
    return events.find((event) => event.id === selectedEventId);
  }, [events, selectedEventId]);

  const refreshRecentActivity = useCallback(async (eventId: string) => {
    if (!eventId) {
      setRecentActivity([]);
      return;
    }

    setIsRefreshingRecent(true);

    try {
      const result = await getRecentEventCheckIns({ eventId, limitCount: RECENT_ACTIVITY_LIMIT });

      if (!result.success) {
        setRecentActivity([]);
        cToast.error("Unable to load recent check-ins", {
          description: result.error ?? "Please try refreshing recent activity.",
        });
        return;
      }

      const activity = (result.check_ins ?? []).map((checkIn) => ({
        id: checkIn.id,
        userId: checkIn.user_id,
        fullName: checkIn.scan_payload.full_name,
        email: checkIn.scan_payload.email,
        role: checkIn.scan_payload.role,
        processedAt: checkIn.checked_in_at,
      }));

      setRecentActivity(activity);
    } catch (error) {
      setRecentActivity([]);
      cToast.error("Unable to load recent activity", {
        description: error instanceof Error ? error.message : "An unknown error occurred while loading activity.",
      });
    } finally {
      setIsRefreshingRecent(false);
    }
  }, []);

  const handleScan = useCallback(
    async (scanPayload: string) => {
      const normalizedPayload = scanPayload.trim();
      if (!normalizedPayload) return;

      if (!effectiveEventId) {
        cToast.error("Select an event or mode first", {
          description: "Please choose a check-in mode and event before scanning QR codes.",
        });
        return;
      }

      if (inFlightScanRef.current) return;

      const submissionKey = `check-in:${effectiveEventId}:${normalizedPayload}`;
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
        const result = await processCheckIn({ eventId: effectiveEventId, scanPayload: normalizedPayload });
        const errorMessage = !result.success ? result.error : "Unable to process this QR code.";

        if (!result.success || !result.check_in) {
          if (result.requires_wildhacks_check_in) {
            cToast.warning("WildHacks check-in required", {
              description: errorMessage,
            });
            return;
          }

          cToast.error("Check-in failed", {
            description: errorMessage,
          });
          return;
        }

        const userDisplay =
          result.check_in.scan_payload.full_name ?? result.check_in.scan_payload.email ?? result.check_in.user_id;

        const dietaryRestrictionsText =
          result.dietary_restrictions !== undefined
            ? ` Dietary restrictions: ${result.dietary_restrictions.length > 0 ? result.dietary_restrictions.join(", ") : "None"}.`
            : "";

        if (result.already_checked_in) {
          cToast.warning("Already checked in", {
            description: `${userDisplay} was already checked in.${dietaryRestrictionsText}`,
          });
        } else {
          cToast.success("Check-in successful", {
            description: `${userDisplay} has been checked in successfully.${dietaryRestrictionsText}`,
          });
        }

        await refreshRecentActivity(effectiveEventId);
      } catch (error) {
        cToast.error("Unable to process scan", {
          description: error instanceof Error ? error.message : "An unknown error occurred while processing the scan.",
        });
      } finally {
        inFlightScanRef.current = false;
        setIsSubmitting(false);
      }
    },
    [effectiveEventId, refreshRecentActivity]
  );

  const handleScannerError = useCallback((scannerError: QRScannerError, message: string) => {
    const title = scannerError === "PERMISSION_DENIED" ? "Camera permission required" : "Scanner unavailable";

    cToast.error(title, {
      description: message,
    });
  }, []);

  const isCameraActive = !!effectiveEventId && isScannerEnabled;
  const hasEventSchedule = !!selectedEvent && selectedEvent.start_time > 0 && selectedEvent.end_time > 0;

  const truncatedScanPayload = lastScannedValue.length > 96 ? `${lastScannedValue.slice(0, 96)}...` : lastScannedValue;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="size-4" />
              Admin check-in console
            </CardTitle>
            <CardDescription>Select an event and scan attendee QR codes to check them in.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm font-medium">Check-in Mode</p>
              <Tabs value={checkInMode} onValueChange={(value) => setCheckInMode(value as "event" | "wildhacks")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="event">
                    <Ticket className="size-4" />
                    Event
                  </TabsTrigger>
                  <TabsTrigger value="wildhacks">
                    <Users className="size-4" />
                    WildHacks
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {checkInMode === "event" && (
              <div className="space-y-2 min-w-0">
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
            )}

            {checkInMode === "wildhacks" && (
              <div className="rounded-lg border bg-muted/40 px-3 py-2">
                <p className="text-sm font-medium">WildHacks 2026</p>
                <p className="text-xs text-muted-foreground">Main event check-in</p>
              </div>
            )}

            {checkInMode === "event" && selectedEvent && (
              <div className="rounded-lg border bg-muted/40 px-3 py-2">
                <p className="text-sm font-medium break-words">{selectedEvent.title}</p>
                <p className="text-xs text-muted-foreground">
                  {hasEventSchedule
                    ? getEventTimeRange(selectedEvent.start_time, selectedEvent.end_time)
                    : "Schedule TBD"}
                  {selectedEvent.location ? ` • ${selectedEvent.location}` : ""}
                </p>
              </div>
            )}

            {checkInMode === "event" && !events.length && (
              <Alert>
                <AlertCircle />
                <AlertTitle>No events available</AlertTitle>
                <AlertDescription>Create or import schedule events before scanning attendees.</AlertDescription>
              </Alert>
            )}

            {(events.length > 0 || checkInMode === "wildhacks") && (
              <>
                <div className="flex flex-col gap-2 rounded-lg border bg-muted/40 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">
                    {!effectiveEventId
                      ? checkInMode === "event"
                        ? "Select an event to enable camera controls."
                        : "Camera controls ready."
                      : isCameraActive
                        ? "Camera is on and ready to scan."
                        : "Camera is off. Turn it on when ready."}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!effectiveEventId || isSubmitting}
                    onClick={() => setIsScannerEnabled((previous) => !previous)}
                  >
                    {isCameraActive ? <CameraOff className="size-4" /> : <Camera className="size-4" />}
                    {isCameraActive ? "Turn camera off" : "Turn camera on"}
                  </Button>
                </div>

                <QRScanner onScan={handleScan} onError={handleScannerError} debounceMs={700} enabled={isCameraActive} />
                <div className="flex flex-col gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                  <p className="min-w-0">
                    Last payload: <span className="font-mono break-all">{truncatedScanPayload || "No scans yet"}</span>
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

        <Card className="min-w-0">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle>Recent activity</CardTitle>
                <CardDescription>Latest check-in records for the selected event.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={!effectiveEventId || isRefreshingRecent}
                onClick={() => void refreshRecentActivity(effectiveEventId)}
              >
                {isRefreshingRecent ? <Loader2 className="size-4 animate-spin" /> : <RefreshCcw className="size-4" />}
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {!effectiveEventId && (
              <p className="text-sm text-muted-foreground">
                {checkInMode === "event" ? "Select an event" : "Select a mode"} to load recent activity.
              </p>
            )}

            {effectiveEventId && !isRefreshingRecent && recentActivity.length === 0 && (
              <p className="text-sm text-muted-foreground">No recent check-ins for this selection.</p>
            )}

            {recentActivity.map((activityItem) => (
              <div key={activityItem.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium min-w-0">
                    {activityItem.fullName ?? activityItem.email ?? activityItem.userId}
                  </p>
                  <Badge variant="secondary">Checked in</Badge>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                  {activityItem.email && <span className="break-all">{activityItem.email}</span>}
                  {activityItem.role && <span>{formatRoleLabel(activityItem.role)}</span>}
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
