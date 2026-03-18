"use client";

import { Html5Qrcode } from "html5-qrcode";
import { AlertCircle, Camera, CameraOff, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

export const QRScanner: React.FC<QRScannerProps> = ({
  onScan,
  onError,
  debounceMs = 500,
  containerClassName = "",
  enabled = true,
  fps = 10,
}) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScanTimeRef = useRef<number>(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<{ type: QRScannerError; message: string } | null>(null);
  const [isCameraAvailable, setIsCameraAvailable] = useState(true);
  const containerIdRef = useRef<string | null>(null);

  // Initialize container ID on first render
  if (containerIdRef.current === null) {
    containerIdRef.current = `qr-scanner-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize scanner
  useEffect(() => {
    if (!enabled) {
      setIsInitializing(false);
      return;
    }

    const initializeScanner = async () => {
      try {
        setIsInitializing(true);
        setError(null);

        // Check if camera devices are available
        const devices = await Html5Qrcode.getCameras();
        if (devices.length === 0) {
          setIsCameraAvailable(false);
          const errorMsg = "No camera devices found on this device";
          setError({ type: "CAMERA_NOT_FOUND", message: errorMsg });
          onError?.("CAMERA_NOT_FOUND", errorMsg);
          return;
        }

        // Create scanner instance
        if (!containerIdRef.current) {
          throw new Error("Container ID not initialized");
        }
        const scanner = new Html5Qrcode(containerIdRef.current);

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
            onScan(decodedText);
          } else {
            // Schedule callback for after debounce period
            const remainingDelay = debounceMs - timeSinceLastScan;
            debounceTimeoutRef.current = setTimeout(() => {
              lastScanTimeRef.current = Date.now();
              onScan(decodedText);
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

        // Start scanning
        await scanner.start(
          { facingMode: "environment" }, // Use rear camera
          {
            fps: fps || 10,
            qrbox: { width: 250, height: 250 },
          },
          handleQrCodeSuccess,
          handleQrCodeError
        );

        setIsScanning(true);
        setIsInitializing(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to initialize camera";

        // Determine error type based on message content
        let errorType: QRScannerError = "UNKNOWN";
        if (
          errorMessage.toLowerCase().includes("permission") ||
          errorMessage.toLowerCase().includes("denied") ||
          errorMessage.toLowerCase().includes("notallowederror")
        ) {
          errorType = "PERMISSION_DENIED";
        } else if (
          errorMessage.toLowerCase().includes("camera") ||
          errorMessage.toLowerCase().includes("notfound") ||
          errorMessage.toLowerCase().includes("notfounderr")
        ) {
          errorType = "CAMERA_NOT_FOUND";
        }

        setError({ type: errorType, message: errorMessage });
        onError?.(errorType, errorMessage);
        setIsInitializing(false);
      }
    };

    initializeScanner();

    // Cleanup on unmount or disable
    return () => {
      // Clear any pending debounce timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }

      // Stop and cleanup scanner
      const scanner = scannerRef.current;
      if (scanner && scanner.isScanning) {
        scanner
          .stop()
          .then(() => {
            scanner.clear();
            scannerRef.current = null;
            setIsScanning(false);
          })
          .catch((err) => {
            console.error("[QRScanner] Error stopping scanner:", err);
          });
      }
    };
  }, [enabled, debounceMs, fps, onScan, onError]);

  // Handle pause/resume
  const toggleScannerState = async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;

    try {
      if (isScanning) {
        await scanner.stop();
        setIsScanning(false);
      } else if (isCameraAvailable) {
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: fps || 10,
            qrbox: { width: 250, height: 250 },
          },
          () => {}, // onSuccess - already bound from initialization
          () => {} // onError - already bound from initialization
        );
        setIsScanning(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to toggle scanner";
      setError({ type: "SCAN_FAILED", message: errorMessage });
      onError?.("SCAN_FAILED", errorMessage);
    }
  };

  if (!enabled) {
    return null;
  }

  // Error state rendering
  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 p-6 ${containerClassName}`}
      >
        <AlertCircle className="h-12 w-12 text-red-600" />
        <div className="text-center">
          <p className="font-semibold text-red-900">Scanner Error</p>
          <p className="text-sm text-red-700">{error.message}</p>
          {error.type === "PERMISSION_DENIED" && (
            <p className="mt-2 text-xs text-red-600">
              Please allow camera access in your browser settings and reload the page.
            </p>
          )}
          {error.type === "CAMERA_NOT_FOUND" && (
            <p className="mt-2 text-xs text-red-600">Please connect a camera to your device and reload the page.</p>
          )}
        </div>
      </div>
    );
  }

  // Loading state rendering
  if (isInitializing) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-8 ${containerClassName}`}
      >
        <Loader2 className="h-10 w-10 animate-spin text-slate-600" />
        <p className="text-sm text-slate-600">Initializing camera...</p>
      </div>
    );
  }

  // Scanner ready state rendering
  return (
    <div className={`flex flex-col gap-4 ${containerClassName}`}>
      {/* Scanner display container with aspect ratio */}
      <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-black">
        <div id={containerIdRef.current!} className="w-full" />
      </div>

      {/* Scanner controls */}
      <div className="flex gap-2">
        <button
          onClick={toggleScannerState}
          disabled={!isCameraAvailable}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isScanning ? (
            <>
              <CameraOff className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Camera className="h-4 w-4" />
              Resume
            </>
          )}
        </button>
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
