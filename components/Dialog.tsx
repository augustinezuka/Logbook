"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

export default function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      panelRef.current?.querySelector("input")?.focus();
      // Prevent body scroll on mobile
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ink)]/40 px-4 py-6 sm:py-4 overflow-y-auto"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="ledger-tape w-full max-w-md p-5 sm:p-6 my-auto"
      >
        <div className="mb-4 flex items-start sm:items-center justify-between gap-4">
          <h2 className="font-display text-lg sm:text-xl font-semibold flex-1">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex-shrink-0 font-mono text-xl sm:text-lg text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors duration-200"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
