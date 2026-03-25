"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

type OverlayPosition = {
  top: number;
  left: number;
};

type OverlayCardProps = {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  position?: OverlayPosition | null;
};

export function OverlayCard({
  isOpen,
  title,
  subtitle,
  onClose,
  children,
  position,
}: OverlayCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && cardRef.current) {
      cardRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const cardStyle: React.CSSProperties | undefined = position
    ? {
        top: position.top,
        left: position.left,
        transform: "translate(-50%, -50%)",
      }
    : {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={cardRef}
        tabIndex={-1}
        className="day-card"
        style={cardStyle}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 text-xs text-foreground/70">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="rounded-full p-1 text-foreground/60 hover:bg-black/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="mt-2 text-xs text-foreground/80">{children}</div>
      </div>
    </>
  );
}

