"use client";

import { useEffect, type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  ariaLabel?: string;
  size?: "md" | "lg";
  scrollable?: boolean;
  overlayClassName?: string;
}

export function Modal({
  isOpen,
  onClose,
  children,
  ariaLabel,
  size = "md",
  scrollable = false,
  overlayClassName = "bg-slate-900/55 backdrop-blur-[2px]",
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        className={`absolute inset-0 ${overlayClassName}`}
        aria-label="Закрыть"
        onClick={onClose}
      />
      <div
        className={`relative z-10 w-full animate-modal-in ${
          scrollable
            ? "custom-scrollbar max-h-[92dvh] overflow-y-auto sm:max-h-[90vh]"
            : "overflow-hidden"
        } ${size === "lg" ? "sm:max-w-2xl" : "sm:max-w-lg"}`}
      >
        {children}
      </div>
    </div>
  );
}
