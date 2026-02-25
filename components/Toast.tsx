"use client";

import { useEffect } from "react";

type ToastProps = {
  message: string | null;
  onDismiss?: () => void;
  durationMs?: number;
};

export function Toast({ message, onDismiss, durationMs = 2600 }: ToastProps) {
  useEffect(() => {
    if (!message || !onDismiss) return;

    const timeout = window.setTimeout(() => {
      onDismiss();
    }, durationMs);

    return () => window.clearTimeout(timeout);
  }, [message, onDismiss, durationMs]);

  if (!message) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 sm:bottom-6 sm:px-0">
      <div className="pointer-events-auto inline-flex max-w-md items-center gap-2 rounded-full bg-foreground/90 px-4 py-2 text-xs sm:text-sm text-background shadow-lg shadow-black/20">
        <span aria-live="polite">{message}</span>
      </div>
    </div>
  );
}

