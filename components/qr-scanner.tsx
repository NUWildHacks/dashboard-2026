"use client";

import { Html5Qrcode } from "html5-qrcode";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

export type QRScannerError = "CAMERA_NOT_FOUND" | "PERMISSION_DENIED" | "SCAN_FAILED" | "UNKNOWN";

export interface QRScannerProps {
  /** Callback when a QR code is successfully scanned */
  onScan: (scanResult: string) => void;
  /** Optional error handler callback */
  onError?: (error: QRScannerError, message: string) => void;
  /** Debounce delay in milliseconds to prevent rapid duplicate scans (default: 500) */
  debounceMs?: number;
  /** CSS class name for the scanner container */
  containerClassName?: string;
  /** Whether the scanner is enabled */
  enabled?: boolean;
  /** FPS for the scanning detection (10 = default, lower = less CPU) */
  fps?: number;
}

type CameraDevice = Awaited<ReturnType<typeof Html5Qrcode.getCameras>>[number];

const getScannerErrorType = (errorMessage: string): QRScannerError => {
  const normalizedErrorMessage = errorMessage.toLowerCase();

  if (
    normalizedErrorMessage.includes("permission") ||
    normalizedErrorMessage.includes("denied") ||
    normalizedErrorMessage.includes("notallowederror")
  ) {
    return "PERMISSION_DENIED";
  }

  if (
    normalizedErrorMessage.includes("notreadable") ||
    normalizedErrorMessage.includes("trackstarterror") ||
    normalizedErrorMessage.includes("could not start video source") ||
    normalizedErrorMessage.includes("in use")
  ) {
    return "SCAN_FAILED";
  }

  if (
    normalizedErrorMessage.includes("camera") ||
    normalizedErrorMessage.includes("notfound") ||
    normalizedErrorMessage.includes("notfounderr") ||
    normalizedErrorMessage.includes("overconstrained") ||
    normalizedErrorMessage.includes("facingmode")
  ) {
    return "CAMERA_NOT_FOUND";
  }

  return "UNKNOWN";
};

const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
};

const getPreferredCameraOrder = (cameras: CameraDevice[]): CameraDevice[] => {
  const backCameraKeywords = ["back", "rear", "environment", "traseira", "trasera", "hinten", "背面"];

  return [...cameras].sort((leftCamera, rightCamera) => {
    const leftLabel = leftCamera.label.toLowerCase();
    const rightLabel = rightCamera.label.toLowerCase();

    const leftIsBackCamera = backCameraKeywords.some((keyword) => leftLabel.includes(keyword));
    const rightIsBackCamera = backCameraKeywords.some((keyword) => rightLabel.includes(keyword));

    if (leftIsBackCamera && !rightIsBackCamera) return -1;
    if (!leftIsBackCamera && rightIsBackCamera) return 1;

    return 0;
  });
};

export const QRScanner: React.FC<QRScannerProps> = ({
  onScan,
  onError,
  debounceMs = 500,
  containerClassName = "",
  enabled = true,
  fps = 10,
}) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const activeCameraIdRef = useRef<string | null>(null);
  const onScanRef = useRef(onScan);
  const onErrorRef = useRef(onError);
  const lastScanTimeRef = useRef<number>(0);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<{ type: QRScannerError; message: string } | null>(null);
  const reactId = useId();
  const scannerElementId = `qr-scanner-${reactId.replaceAll(":", "")}`;

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  // Initialize scanner
  useEffect(() => {
    let cancelled = false;

    const stopAndClearScanner = async () => {
      const scanner = scannerRef.current;

      if (!scanner) return;

      try {
        await scanner.stop();
      } catch {
        // Scanner may already be stopped; ignore cleanup stop errors.
      }

      try {
        scanner.clear();
      } catch {
        // Clear may fail if scanner was never fully initialized; ignore cleanup clear errors.
      }

      if (scannerRef.current === scanner) {
        scannerRef.current = null;
      }
    };

    if (!enabled) {
      setIsInitializing(false);
      setIsScanning(false);
      activeCameraIdRef.current = null;
      void stopAndClearScanner();
      return;
    }

    const waitForElement = (): Promise<HTMLElement> => {
      return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 50; // 50 * 50ms = 2.5 seconds max

        const checkElement = () => {
          const element = document.getElementById(scannerElementId);
          if (element && element.offsetWidth > 0 && element.offsetHeight > 0) {
            resolve(element);
          } else if (attempts < maxAttempts) {
            attempts++;
            // Use requestAnimationFrame to wait for browser paint, then check again
            requestAnimationFrame(() => {
              setTimeout(checkElement, 50);
            });
          } else {
            reject(new Error(`Element #${scannerElementId} not found or has zero dimensions after 2.5s`));
          }
        };

        // Start checking after current frame
        requestAnimationFrame(checkElement);
      });
    };

    const initializeScanner = async () => {
      try {
        setIsInitializing(true);
        setError(null);

        if (cancelled) return;

        // Wait for DOM element to be fully ready before proceeding
        await waitForElement();

        if (cancelled) return;

        // Create scanner instance immediately (html5-qrcode will handle DOM element lookup)
        let scanner: Html5Qrcode | null = null;
        try {
          scanner = new Html5Qrcode(scannerElementId);
        } catch (initError) {
          console.error("[QRScanner] Failed to create Html5Qrcode instance:", initError);
          throw new Error(
            `Failed to create scanner: ${initError instanceof Error ? initError.message : "Unknown error"}`
          );
        }

        scannerRef.current = scanner;

        // Setup success callback with debouncing
        const handleQrCodeSuccess = (decodedText: string) => {
          const now = Date.now();
          const timeSinceLastScan = now - lastScanTimeRef.current;

          // Clear any pending debounce timeout
          if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
            debounceTimeoutRef.current = null;
          }

          // Only process if enough time has passed to avoid duplicates
          if (timeSinceLastScan >= debounceMs) {
            lastScanTimeRef.current = now;
            onScanRef.current(decodedText);
          } else {
            // Schedule callback for after debounce period
            const remainingDelay = debounceMs - timeSinceLastScan;
            debounceTimeoutRef.current = setTimeout(() => {
              lastScanTimeRef.current = Date.now();
              onScanRef.current(decodedText);
              debounceTimeoutRef.current = null;
            }, remainingDelay);
          }
        };

        const handleQrCodeError = (errorMessage: string) => {
          // Silently handle QR code scanning failures (common when no code in frame)
          // Only log in development for debugging purposes
          if (process.env.NODE_ENV === "development") {
            console.debug("[QRScanner] Scan error (expected if no code in frame):", errorMessage);
          }
        };

        if (cancelled) return;

        // Strategy 1: Try enumerated cameras with preferred ordering
        let startError: unknown = null;
        let cameraStartSuccess = false;

        try {
          const cameras = await Html5Qrcode.getCameras();

          if (cameras && cameras.length > 0) {
            const orderedCameras = getPreferredCameraOrder(cameras);

            for (const camera of orderedCameras) {
              try {
                await scanner.start(
                  camera.id,
                  {
                    fps: fps || 10,
                    qrbox: { width: 250, height: 250 },
                  },
                  handleQrCodeSuccess,
                  handleQrCodeError
                );

                activeCameraIdRef.current = camera.id;
                cameraStartSuccess = true;
                break;
              } catch (error) {
                startError = error;

                if (process.env.NODE_ENV === "development") {
                  console.debug(
                    "[QRScanner] Unable to start camera ID, trying next:",
                    camera.label || camera.id,
                    error
                  );
                }
              }
            }
          }
        } catch (enumerationError) {
          if (process.env.NODE_ENV === "development") {
            console.debug("[QRScanner] Camera enumeration failed:", enumerationError);
          }
        }

        // Strategy 2: Fallback - try environment facing mode
        if (!cameraStartSuccess) {
          try {
            await scanner.start(
              { facingMode: "environment" },
              {
                fps: fps || 10,
                qrbox: { width: 250, height: 250 },
              },
              handleQrCodeSuccess,
              handleQrCodeError
            );

            cameraStartSuccess = true;
            if (process.env.NODE_ENV === "development") {
              console.debug("[QRScanner] Started with environment facingMode");
            }
          } catch (facingModeError) {
            startError = facingModeError;

            if (process.env.NODE_ENV === "development") {
              console.debug("[QRScanner] Environment facingMode failed, trying user facingMode:", facingModeError);
            }

            // Strategy 3: Last resort - try user-facing camera
            try {
              await scanner.start(
                { facingMode: "user" },
                {
                  fps: fps || 10,
                  qrbox: { width: 250, height: 250 },
                },
                handleQrCodeSuccess,
                handleQrCodeError
              );

              cameraStartSuccess = true;
              if (process.env.NODE_ENV === "development") {
                console.debug("[QRScanner] Started with user facingMode");
              }
            } catch (userFacingError) {
              startError = userFacingError;

              if (process.env.NODE_ENV === "development") {
                console.error("[QRScanner] All camera start strategies failed:", userFacingError);
              }
            }
          }
        }

        if (!cameraStartSuccess) {
          throw startError || new Error("Failed to initialize camera - no compatible camera found");
        }

        if (cancelled) {
          await stopAndClearScanner();
          return;
        }

        setIsScanning(true);
        setIsInitializing(false);
      } catch (err) {
        if (cancelled) return;

        const errorMessage = getErrorMessage(err, "Failed to initialize camera");
        const errorType = getScannerErrorType(errorMessage);

        console.error("[QRScanner] Initialization failed:", errorMessage, err);

        setError({ type: errorType, message: errorMessage });
        onErrorRef.current?.(errorType, errorMessage);
        setIsInitializing(false);
        setIsScanning(false);
      }
    };

    void initializeScanner();

    // Cleanup on unmount or disable
    return () => {
      cancelled = true;

      // Clear any pending debounce timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }

      // Stop and cleanup scanner
      activeCameraIdRef.current = null;
      void stopAndClearScanner();
    };
  }, [enabled, debounceMs, fps, scannerElementId]);

  if (!enabled) {
    return null;
  }

  // Always render the scanner div (even during loading/error) so it's available for initialization
  return (
    <div className={`flex flex-col gap-4 ${containerClassName}`}>
      {/* Scanner display container - always present for initialization */}
      <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-black">
        <div id={scannerElementId} className="w-full min-h-[300px]" />

        {/* Loading overlay */}
        {isInitializing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/80 backdrop-blur-sm">
            <Loader2 className="h-10 w-10 animate-spin text-slate-300" />
            <p className="text-sm text-slate-300">Initializing camera...</p>
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-red-950/80 backdrop-blur-sm p-4">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <div className="text-center">
              <p className="font-semibold text-red-300">Scanner Error</p>
              <p className="text-sm text-red-200">{error.message}</p>
              {error.type === "PERMISSION_DENIED" && (
                <p className="mt-2 text-xs text-red-300">
                  Please allow camera access in your browser settings and reload the page.
                </p>
              )}
              {error.type === "CAMERA_NOT_FOUND" && (
                <p className="mt-2 text-xs text-red-300">
                  No compatible camera is available. Ensure your webcam is accessible.
                </p>
              )}
              {error.type === "SCAN_FAILED" && (
                <p className="mt-2 text-xs text-red-300">
                  Camera started but became unavailable. Close other apps using your camera and try again.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status indicator */}
      {isScanning && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 px-3 py-2">
          <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
          <p className="text-xs font-medium text-green-700">Scanning...</p>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
